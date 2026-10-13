create table processes (
 id uuid primary key default gen_random_uuid(), reference text not null unique, name text not null check(length(trim(name))>0),
 process_group text not null default '', owner text not null default '', expert text not null default '',
 status text not null default 'draft' check(status in ('draft','active','archived')),
 review_due date, safety_sensitive boolean not null default false,
 personal_data boolean not null default false, jurisdiction text not null default 'NZ' check(jurisdiction in ('NZ','AU','other')),
 retention_purpose text not null default '', retention_review date, legal_hold text not null default '',
 source_key text unique, source_hash text, source_record jsonb,
 created_at timestamptz not null default now(), updated_at timestamptz not null default now()
);
create table revisions (
 id uuid primary key default gen_random_uuid(), process_id uuid not null references processes(id), version integer not null check(version>0),
 objective text not null, steps jsonb not null check(jsonb_typeof(steps)='array'),
 change_reason text not null, author text not null, status text not null default 'draft' check(status in ('draft','approved')),
 approver text, approved_at timestamptz, evidence_ref text, safety_review_ref text,
 created_at timestamptz not null default now(), updated_at timestamptz not null default now(), unique(process_id,version),
 check(status<>'approved' or (length(trim(approver))>0 and approved_at is not null and length(trim(evidence_ref))>0))
);
create unique index one_draft_per_process on revisions(process_id) where status='draft';
create table reviews (
 id uuid primary key default gen_random_uuid(), process_id uuid not null references processes(id), revision_id uuid not null references revisions(id),
 actor text not null, note text not null, evidence_ref text not null, next_review date not null,
 created_at timestamptz not null default now(), updated_at timestamptz not null default now()
);
create table improvements (
 id uuid primary key default gen_random_uuid(), reference text not null unique, process_id uuid not null references processes(id),
 title text not null, owner text not null, due date not null, priority text not null check(priority in ('normal','high')),
 status text not null default 'open' check(status in ('open','closed')), resolution text, evidence_ref text,
 created_at timestamptz not null default now(), updated_at timestamptz not null default now(),
 check(status<>'closed' or (length(trim(resolution))>0 and length(trim(evidence_ref))>0))
);
create table readers (
 id uuid primary key default gen_random_uuid(), process_id uuid not null references processes(id), name text not null check(length(trim(name))>0),
 created_at timestamptz not null default now(), updated_at timestamptz not null default now()
);
create unique index reader_name_unique on readers(process_id,lower(name));
create table acknowledgements (
 id uuid primary key default gen_random_uuid(), reader_id uuid not null references readers(id), revision_id uuid not null references revisions(id),
 evidence_ref text not null, actor text not null,
 created_at timestamptz not null default now(), updated_at timestamptz not null default now(), unique(reader_id,revision_id)
);
create table activity (
 id uuid primary key default gen_random_uuid(), process_id uuid not null references processes(id), actor text not null, action text not null, detail jsonb not null,
 created_at timestamptz not null default now(), updated_at timestamptz not null default now()
);
create function touch_updated_at() returns trigger language plpgsql as $$ begin new.updated_at=now(); return new; end $$;
create function protect_approved_revision() returns trigger language plpgsql as $$
begin if old.status='approved' then raise exception 'Approved revisions are immutable; create a new revision'; end if; return new; end $$;
create trigger approved_revision_immutable before update or delete on revisions for each row execute function protect_approved_revision();
do $$ declare t text; begin foreach t in array array['processes','revisions','reviews','improvements','readers','acknowledgements','activity'] loop
 execute format('create trigger touch_%I before update on %I for each row execute function touch_updated_at()',t,t);
 execute format('alter table %I enable row level security',t);
 execute format('revoke all on %I from public',t);
end loop; end $$;
create view current_procedures as
 select distinct on (r.process_id) r.* from revisions r where r.status='approved' order by r.process_id,r.version desc;
create view process_register as
 select p.id,p.reference,p.name,p.process_group,p.owner,p.expert,p.status,p.review_due,
 p.review_due-current_date as days_to_review,c.version as approved_version,
 coalesce((select max(r.version) from revisions r where r.process_id=p.id and r.status='draft'),0) as pending_version,
 (select count(*)::int from improvements i where i.process_id=p.id and i.status='open') as open_improvements,
 (select count(*)::int from improvements i where i.process_id=p.id and i.status='open' and i.due<current_date) as overdue_improvements,
 (current_date-p.updated_at::date)::int as quiet_days
 from processes p left join current_procedures c on c.process_id=p.id;
create view acknowledgement_gaps as
 select p.id as process_id,p.reference,p.name,c.version,r.name as reader
 from processes p join current_procedures c on c.process_id=p.id join readers r on r.process_id=p.id
 where p.status='active' and not exists(select 1 from acknowledgements a where a.reader_id=r.id and a.revision_id=c.id);
create view improvement_queue as
 select i.id,i.reference,p.reference as process,p.name,i.title,i.owner,i.due,i.due-current_date as days_left,i.priority,p.status as process_status
 from improvements i join processes p on p.id=i.process_id where i.status='open';
create view process_bottlenecks as
 select p.reference,p.name,p.owner,c.version,
 coalesce(sum((s->>'active_minutes')::numeric),0) as active_minutes,
 coalesce(sum((s->>'wait_minutes')::numeric),0) as wait_minutes,
 (select count(*)::int from improvements i where i.process_id=p.id and i.status='open' and i.priority='high') as high_priority_open
 from processes p join current_procedures c on c.process_id=p.id left join lateral jsonb_array_elements(c.steps) s on true
 where p.status='active' group by p.id,c.version;
create view compliance_findings as
 select p.id as process_id,p.reference,'POLICY-OWNER' as rule,'Assign a process owner' as finding from processes p where p.status<>'archived' and trim(p.owner)=''
 union all select p.id,p.reference,'POLICY-REVIEW','Review date missing or due' from processes p where p.status='active' and (p.review_due is null or p.review_due<=current_date)
 union all select p.id,p.reference,'POLICY-APPROVAL','No approved procedure' from processes p where p.status='active' and not exists(select 1 from current_procedures c where c.process_id=p.id)
 union all select p.id,p.reference,'NZ-GRWM','Safety procedure has a pending change: review controls before use' from processes p where p.status<>'archived' and p.jurisdiction='NZ' and p.safety_sensitive and exists(select 1 from revisions r where r.process_id=p.id and r.status='draft')
 union all select p.id,p.reference,'POLICY-SAFETY','Approved safety procedure has no recorded control review' from processes p join current_procedures c on c.process_id=p.id where p.status='active' and p.safety_sensitive and coalesce(trim(c.safety_review_ref),'')=''
 union all select p.id,p.reference,case when p.jurisdiction='NZ' then 'NZ-IPP9' when p.jurisdiction='AU' then 'AU-APP11' else 'POLICY-RETENTION' end,'Assess retention purpose and review date; preserve any legal hold' from processes p where p.personal_data and (trim(p.retention_purpose)='' or p.retention_review is null or p.retention_review<=current_date)
 union all select p.id,p.reference,'POLICY-IMPORT','Imported register record needs content mapping and approval' from processes p where p.source_key is not null and p.status='draft';
