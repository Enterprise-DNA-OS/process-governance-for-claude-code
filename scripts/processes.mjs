#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import {createHash,randomUUID} from 'node:crypto';
import {pathToFileURL} from 'node:url';
import {getDb,REPO_ROOT} from './lib/db.mjs';
import {parseCsv,pick} from './lib/csv.mjs';
import {table} from './lib/format.mjs';
export const commands=['help','processes','process','reviews-due','approval-queue','improvements-due','acknowledgement-gaps','owner-workload','bottlenecks','attention','compliance','history','weekly-review','add','set-metadata','revise','edit-draft','approve','review','log-improvement','close-improvement','assign-reader','acknowledge','log','archive','import','export','draft-review'];
const reads={
 'processes':'select * from process_register order by reference',
 'reviews-due':"select reference,name,owner,review_due,days_to_review,overdue_improvements from process_register where status='active' and (review_due is null or review_due<=current_date+30) order by review_due nulls first,reference",
 'approval-queue':"select p.reference,p.name,r.version,r.author,r.change_reason,p.safety_sensitive from revisions r join processes p on p.id=r.process_id where r.status='draft' and p.status<>'archived' order by p.reference",
 'improvements-due':'select reference,process,title,owner,due,days_left,priority,process_status from improvement_queue order by due,reference',
 'acknowledgement-gaps':'select reference,name,version,reader from acknowledgement_gaps order by reference,reader',
 'owner-workload':"select coalesce(nullif(owner,''),'Unassigned') as owner,count(*)::int as processes,count(*) filter(where review_due<=current_date or review_due is null)::int as reviews_due,sum(overdue_improvements)::int as overdue_improvements from process_register where status<>'archived' group by owner order by reviews_due desc,owner",
 'bottlenecks':'select * from process_bottlenecks order by wait_minutes desc,reference',
 'attention':"select reference,name,owner,days_to_review,pending_version,overdue_improvements,quiet_days from process_register where status<>'archived' and (owner='' or review_due is null or review_due<=current_date or pending_version>0 or overdue_improvements>0 or quiet_days>=30) order by reference",
 'compliance':'select reference,rule,finding from compliance_findings order by reference,rule',
 'history':'select p.reference,a.actor,a.action,a.detail,a.created_at from activity a join processes p on p.id=a.process_id order by a.created_at,a.id'
};
function parse(args){const opts={},pos=[];for(const a of args){if(a.startsWith('--')){const [k,...v]=a.slice(2).split('=');if(k in opts)throw Error(`Duplicate option --${k}`);opts[k]=v.length?v.join('='):true;}else pos.push(a);}return {opts,pos};}
const required=(o,k)=>{if(typeof o[k]!=='string'||!o[k].trim())throw Error(`--${k}= is required`);return o[k].trim();};
export function date(s){if(!/^\d{4}-\d{2}-\d{2}$/.test(String(s))||new Date(s+'T00:00:00Z').toISOString().slice(0,10)!==s)throw Error('Date must be a real YYYY-MM-DD date');return s;}
function bool(s){if(!['true','false'].includes(s))throw Error('Boolean must be true or false');return s==='true';}
function steps(raw){const v=JSON.parse(raw);if(!Array.isArray(v)||!v.length)throw Error('Procedure needs at least one step');for(const s of v){if(!s||typeof s.title!=='string'||!s.title.trim()||typeof s.role!=='string'||!s.role.trim())throw Error('Every step needs title and role');for(const k of ['active_minutes','wait_minutes'])if(typeof s[k]!=='number'||!Number.isFinite(s[k])||s[k]<0)throw Error(`${k} must be a nonnegative number`);}return v;}
export async function resolve(db,kind,value){if(!['processes','improvements'].includes(kind))throw Error('Unknown record kind');if(!value)throw Error('Record reference is required');const field=kind==='processes'?'name':'title';const rows=await db.query(`select * from ${kind} where lower(reference)=lower($1) or id::text=$1 or lower(${field})=lower($1) order by reference`,[value]);const matches=rows.length?rows:await db.query(`select * from ${kind} where left(id::text,length($1))=lower($1) or strpos(lower(${field}),lower($1))>0 order by reference`,[value]);if(matches.length!==1)throw Error(matches.length?`Ambiguous ${kind}:\n${matches.map(r=>r.reference+' '+r[field]).join('\n')}`:`No matching ${kind}: ${value}`);return matches[0];}
const record=async(db,p,actor,action,detail)=>db.query('insert into activity(process_id,actor,action,detail) values($1,$2,$3,$4)',[p,actor,action,JSON.stringify(detail)]);
async function locked(db,o){const p=await resolve(db,'processes',required(o,'process'));return (await db.query('select * from processes where id=$1 for update',[p.id]))[0];}
function active(p){if(p.status==='archived')throw Error('Process is archived');}
async function current(db,p){const r=(await db.query('select * from current_procedures where process_id=$1',[p.id]))[0];if(!r)throw Error('No approved procedure');return r;}
const allTables=['processes','revisions','reviews','improvements','readers','acknowledgements','activity'];
const allowed={
 help:[],processes:[],process:['process'],'reviews-due':[],'approval-queue':[],'improvements-due':[],'acknowledgement-gaps':[],'owner-workload':[],bottlenecks:[],attention:[],compliance:[],history:[],'weekly-review':[],
 add:['reference','name','owner','expert','group','review-due','safety-sensitive','personal-data','jurisdiction','retention-purpose','retention-review'],
 'set-metadata':['process','owner','expert','group','safety-sensitive','personal-data','jurisdiction','retention-purpose','retention-review','legal-hold','reason'],
 'edit-draft':['process','objective','steps','reason'],revise:['process','objective','steps','reason'],approve:['process','evidence','safety-review','next-review'],review:['process','evidence','note','next-review'],
 'log-improvement':['process','reference','title','owner','due','priority'],'close-improvement':['improvement','resolution','evidence'],
 'assign-reader':['process','reader'],acknowledge:['process','reader','evidence'],log:['process','note'],archive:['process','reason'],
 import:['file','map','dry-run'],export:['file'],'draft-review':[]
};
export async function run(db,args){
 const {opts:o,pos}=parse(args);const cmd=pos[0]||'help';if(!commands.includes(cmd))throw Error(`Unknown command ${cmd}`);
 for(const k of Object.keys(o))if(![...allowed[cmd],'actor','json'].includes(k))throw Error(`Unknown option --${k} for ${cmd}`);
 if(pos.length>(cmd==='import'?2:1))throw Error('Unexpected positional arguments');
 if(cmd==='help')return commands.map(command=>({command,options:allowed[command].map(k=>'--'+k+'=').join(' ')}));
 if(reads[cmd])return db.query(reads[cmd]);
 if(cmd==='process'){const p=await resolve(db,'processes',required(o,'process'));return {process:p,revisions:await db.query('select * from revisions where process_id=$1 order by version',[p.id]),improvements:await db.query('select * from improvements where process_id=$1 order by reference',[p.id]),reviews:await db.query('select * from reviews where process_id=$1 order by created_at',[p.id])};}
 if(cmd==='weekly-review'||cmd==='draft-review'){const data={};for(const c of ['reviews-due','improvements-due','acknowledgement-gaps'])data[c]=await run(db,[c]);if(cmd==='weekly-review')return data;const dir=path.join(process.env.OUTPUT_DIR||REPO_ROOT,'drafts');fs.mkdirSync(dir,{recursive:true});const file=path.join(dir,`review-${randomUUID()}.md`);fs.writeFileSync(file,'# Internal weekly process review\n\nDraft only. Records as at '+new Date().toISOString()+'\n\n'+human(data),'utf8');return [{file}];}
 if(cmd==='export'){const data={format:'process-governance-v1',exported_at:new Date().toISOString()};for(const t of allTables)data[t]=await db.query(`select * from ${t} order by id`);const file=path.resolve(required(o,'file'));fs.writeFileSync(file,JSON.stringify(data,null,2)+'\n',{flag:'wx'});return [{file,record_sets:allTables.length}];}
 const actor=required(o,'actor');await db.exec('BEGIN');
 try{
 let result;
 if(cmd==='add'){
 const ref=required(o,'reference');if(!/^[A-Za-z0-9][A-Za-z0-9_-]*$/.test(ref))throw Error('Reference must contain letters, digits, underscores or hyphens');
 const p=(await db.query(`insert into processes(reference,name,owner,expert,process_group,review_due,safety_sensitive,personal_data,jurisdiction,retention_purpose,retention_review) values($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11) returning *`,[ref,required(o,'name'),required(o,'owner'),o.expert||'',o.group||'',o['review-due']?date(o['review-due']):null,o['safety-sensitive']?bool(o['safety-sensitive']):false,o['personal-data']?bool(o['personal-data']):false,o.jurisdiction||'NZ',o['retention-purpose']||'',o['retention-review']?date(o['retention-review']):null]))[0];await record(db,p.id,actor,cmd,{reference:ref});result=[p];
 }else if(cmd==='import'){
 if(pos[1]!=='nintex')throw Error('Use import nintex --file=');
 const mapping=o.map?JSON.parse(fs.readFileSync(o.map,'utf8')):{};
 const validMap=['id','name','owner','expert','group'];for(const [k,v] of Object.entries(mapping))if(!validMap.includes(k)||typeof v!=='string')throw Error('Mapping keys: id, name, owner, expert, group; values must be column headings');
 const input=parseCsv(fs.readFileSync(required(o,'file'),'utf8'));if(!input.length)throw Error('CSV contains no records');
 const counters={inserted:0,unchanged:0,dry_run:!!o['dry-run']};
 const seen=new Set();
 for(const row of input){
 const get=(k,...names)=>mapping[k]?pick(row,mapping[k]):pick(row,...names);
 const name=get('name','Process Name','Process','Name').trim();const group=get('group','Process Group','Group').trim();
 if(!name)throw Error('Missing Process Name; use --map= for different headings');
 const id=get('id','Process ID','Process Unique ID','Unique ID','Process URL','URL').trim();const key=id||JSON.stringify([group.toLowerCase(),name.toLowerCase()]);if(seen.has(key))throw Error('Duplicate process identity in CSV');seen.add(key);
 const sourceKey='nintex:'+key;const canonical=Object.fromEntries(Object.entries(row).sort(([a],[b])=>a.localeCompare(b)));const hash=createHash('sha256').update(JSON.stringify(canonical)).digest('hex');
 const old=(await db.query('select id,source_hash from processes where source_key=$1',[sourceKey]))[0];if(old){if(old.source_hash!==hash)throw Error(`Changed import for ${name}; reconcile explicitly before reimporting`);counters.unchanged++;continue;}
 const ref='NX-'+createHash('sha256').update(sourceKey).digest('hex').slice(0,16);
 const p=(await db.query('insert into processes(reference,name,process_group,owner,expert,source_key,source_hash,source_record) values($1,$2,$3,$4,$5,$6,$7,$8) returning id',[ref,name,group,get('owner','Process Owner','Owner').trim(),get('expert','Process Expert','Expert').trim(),sourceKey,hash,JSON.stringify(row)]))[0];
 await record(db,p.id,actor,'import',{source:'Nintex Process List',source_key:sourceKey});counters.inserted++;
 }
 result=[counters];
 }else if(cmd==='close-improvement'){
 const i=await resolve(db,'improvements',required(o,'improvement'));
 const changed=await db.query("update improvements set status='closed',resolution=$2,evidence_ref=$3 where id=$1 and status='open' returning *",[i.id,required(o,'resolution'),required(o,'evidence')]);if(!changed.length)throw Error('Improvement already closed');await record(db,i.process_id,actor,cmd,{reference:i.reference,resolution:o.resolution,evidence:o.evidence});result=changed;
 }else{
 const p=await locked(db,o);active(p);
 if(cmd==='set-metadata'){
 required(o,'reason');const mapping={'owner':'owner','expert':'expert','group':'process_group','safety-sensitive':'safety_sensitive','personal-data':'personal_data','jurisdiction':'jurisdiction','retention-purpose':'retention_purpose','retention-review':'retention_review','legal-hold':'legal_hold'};
 const sets=[],values=[p.id];for(const [k,col] of Object.entries(mapping)){if(!(k in o))continue;let value=o[k];if(typeof value!=='string')throw Error(`${k} needs a value`);if(k==='owner'&&!value.trim())throw Error('Owner cannot be empty');if(['safety-sensitive','personal-data'].includes(k))value=bool(value);if(k==='retention-review')value=date(value);values.push(value);sets.push(`${col}=$${values.length}`);}if(!sets.length)throw Error('Specify a metadata field');
 result=await db.query(`update processes set ${sets.join(',')} where id=$1 returning *`,values);
 }else if(cmd==='edit-draft'){
 const body=steps(fs.readFileSync(required(o,'steps'),'utf8'));result=await db.query("update revisions set objective=$2,steps=$3,change_reason=$4,author=$5 where process_id=$1 and status='draft' returning *",[p.id,required(o,'objective'),JSON.stringify(body),required(o,'reason'),actor]);if(!result.length)throw Error('No draft revision');
 }else if(cmd==='revise'){
 const body=steps(fs.readFileSync(required(o,'steps'),'utf8'));const reason=required(o,'reason'),objective=required(o,'objective');
 if((await db.query("select id from revisions where process_id=$1 and status='draft'",[p.id])).length)throw Error('A draft already exists; inspect and edit that draft before approval');
 const version=Number((await db.query('select coalesce(max(version),0)+1 as version from revisions where process_id=$1',[p.id]))[0].version);
 result=await db.query('insert into revisions(process_id,version,objective,steps,change_reason,author) values($1,$2,$3,$4,$5,$6) returning *',[p.id,version,objective,JSON.stringify(body),reason,actor]);
 }else if(cmd==='approve'){
 const r=(await db.query("select * from revisions where process_id=$1 and status='draft'",[p.id]))[0];if(!r)throw Error('No draft revision');
 if(!p.owner.trim())throw Error('Assign a process owner before approval');if(actor.toLowerCase()===r.author.toLowerCase())throw Error('Approval requires a reviewer other than the author');steps(JSON.stringify(r.steps));
 const next=date(required(o,'next-review'));if(next<=(await db.query('select current_date::text as d'))[0].d)throw Error('Next review must be in the future');
 const safety=p.safety_sensitive?required(o,'safety-review'):null;
 result=await db.query("update revisions set status='approved',approver=$2,approved_at=now(),evidence_ref=$3,safety_review_ref=$4 where id=$1 returning *",[r.id,actor,required(o,'evidence'),safety]);
 await db.query("update processes set status='active',review_due=$2 where id=$1",[p.id,next]);
 }else if(cmd==='review'){
 const r=await current(db,p);const next=date(required(o,'next-review'));if(next<=(await db.query('select current_date::text as d'))[0].d)throw Error('Next review must be in the future');
 result=await db.query('insert into reviews(process_id,revision_id,actor,note,evidence_ref,next_review) values($1,$2,$3,$4,$5,$6) returning *',[p.id,r.id,actor,required(o,'note'),required(o,'evidence'),next]);await db.query('update processes set review_due=$2 where id=$1',[p.id,next]);
 }else if(cmd==='log-improvement'){
 result=await db.query('insert into improvements(reference,process_id,title,owner,due,priority) values($1,$2,$3,$4,$5,$6) returning *',[required(o,'reference'),p.id,required(o,'title'),required(o,'owner'),date(required(o,'due')),o.priority||'normal']);
 }else if(cmd==='assign-reader'){
 result=await db.query('insert into readers(process_id,name) values($1,$2) returning *',[p.id,required(o,'reader')]);
 }else if(cmd==='acknowledge'){
 const r=await current(db,p);const reader=(await db.query('select id from readers where process_id=$1 and lower(name)=lower($2)',[p.id,required(o,'reader')]))[0];if(!reader)throw Error('Reader is not assigned');
 result=await db.query('insert into acknowledgements(reader_id,revision_id,evidence_ref,actor) values($1,$2,$3,$4) returning *',[reader.id,r.id,required(o,'evidence'),actor]);
 }else if(cmd==='archive'){
 required(o,'reason');if(p.legal_hold.trim())throw Error('Legal hold prevents archiving');
 if((await db.query("select id from improvements where process_id=$1 and status='open'",[p.id])).length)throw Error('Resolve open improvements before archiving');
 if((await db.query("select id from revisions where process_id=$1 and status='draft'",[p.id])).length)throw Error('Resolve draft revision before archiving');
 result=await db.query("update processes set status='archived' where id=$1 returning *",[p.id]);
 }else if(cmd==='log'){required(o,'note');result=[{reference:p.reference,note:o.note}];}
 else throw Error('Command not implemented');
 await record(db,p.id,actor,cmd,Object.fromEntries(Object.entries(o).filter(([k])=>!['actor','json'].includes(k))));
 }
 await db.exec(o['dry-run']?'ROLLBACK':'COMMIT');return result;
 }catch(e){await db.exec('ROLLBACK');throw e;}
}
export function human(value){if(!Array.isArray(value))return Object.entries(value).map(([k,v])=>`${k}\n${human(Array.isArray(v)?v:[v])}`).join('\n\n');if(!value.length)return '(none)';const keys=Object.keys(value[0]).filter(k=>!['id','process_id','source_hash'].includes(k));return table(value,keys.map(key=>({key,label:key.replaceAll('_',' '),width:65,format:v=>v===null?'':typeof v==='object'?JSON.stringify(v):String(v)})));}
if(process.argv[1]&&import.meta.url===pathToFileURL(path.resolve(process.argv[1])).href){let db;try{db=await getDb();const args=process.argv.slice(2);const data=await run(db,args[0]==='--help'?['help']:args);console.log(args.includes('--json')?JSON.stringify(data,null,2):human(data));}catch(e){console.error(e.message);process.exitCode=1;}finally{if(db)await db.close();}}
