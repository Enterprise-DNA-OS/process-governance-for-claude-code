insert into processes(id,reference,name,process_group,owner,expert,status,review_due,safety_sensitive,personal_data,retention_purpose,retention_review,updated_at) values
 ('10000000-0000-0000-0000-000000000001','PROC-001','Receive bulk deliveries','Operations','Aroha','Wiremu','active',current_date-7,true,false,'',null,now()-interval '35 days'),
 ('10000000-0000-0000-0000-000000000002','PROC-002','Approve supplier onboarding','Purchasing','Aroha','Mia','active',current_date+10,false,true,'Supplier due diligence',current_date-2,now()-interval '18 days'),
 ('10000000-0000-0000-0000-000000000003','PROC-003','Resolve delivery exceptions','Operations','Wiremu','Mia','active',current_date+45,false,false,'',null,now()-interval '5 days'),
 ('10000000-0000-0000-0000-000000000004','PROC-004','Review customer records','Administration','','Mia','draft',null,false,true,'',null,now()-interval '40 days') on conflict do nothing;
insert into revisions(id,process_id,version,objective,steps,change_reason,author,status,approver,approved_at,evidence_ref,safety_review_ref) values
 ('20000000-0000-0000-0000-000000000001','10000000-0000-0000-0000-000000000001',1,'Accept only checked deliveries','[{"title":"Check unloading area","role":"Warehouse lead","active_minutes":10,"wait_minutes":5},{"title":"Check delivery quantity","role":"Storeperson","active_minutes":15,"wait_minutes":40}]','Initial procedure','Wiremu','approved','Aroha',now()-interval '100 days','demo/approval-001','demo/control-review-001'),
 ('20000000-0000-0000-0000-000000000002','10000000-0000-0000-0000-000000000002',1,'Validate supplier details before buying','[{"title":"Check supplier evidence","role":"Buyer","active_minutes":20,"wait_minutes":90},{"title":"Approve supplier","role":"Manager","active_minutes":10,"wait_minutes":120}]','Initial procedure','Mia','approved','Aroha',now()-interval '90 days','demo/approval-002',null),
 ('20000000-0000-0000-0000-000000000003','10000000-0000-0000-0000-000000000003',1,'Resolve quantity and condition exceptions','[{"title":"Record discrepancy","role":"Storeperson","active_minutes":10,"wait_minutes":0},{"title":"Agree resolution","role":"Buyer","active_minutes":15,"wait_minutes":30}]','Initial procedure','Mia','approved','Wiremu',now()-interval '30 days','demo/approval-003',null),
 ('20000000-0000-0000-0000-000000000004','10000000-0000-0000-0000-000000000001',2,'Accept checked deliveries on the new night shift','[{"title":"Check unloading area and lighting","role":"Warehouse lead","active_minutes":15,"wait_minutes":5},{"title":"Check delivery quantity","role":"Storeperson","active_minutes":15,"wait_minutes":40}]','Proposed night shift','Wiremu','draft',null,null,null,null) on conflict do nothing;
insert into improvements(id,reference,process_id,title,owner,due,priority,created_at) values
 ('30000000-0000-0000-0000-000000000001','IMP-001','10000000-0000-0000-0000-000000000001','Review night shift unloading controls','Wiremu',current_date-3,'high',now()-interval '20 days'),
 ('30000000-0000-0000-0000-000000000002','IMP-002','10000000-0000-0000-0000-000000000002','Remove duplicate evidence check','Aroha',current_date-1,'high',now()-interval '16 days'),
 ('30000000-0000-0000-0000-000000000003','IMP-003','10000000-0000-0000-0000-000000000003','Clarify photo archive reference','Mia',current_date+5,'normal',now()-interval '5 days') on conflict do nothing;
insert into readers(id,process_id,name) values
 ('40000000-0000-0000-0000-000000000001','10000000-0000-0000-0000-000000000001','Hana'),
 ('40000000-0000-0000-0000-000000000002','10000000-0000-0000-0000-000000000001','Leo'),
 ('40000000-0000-0000-0000-000000000003','10000000-0000-0000-0000-000000000002','Mia') on conflict do nothing;
insert into acknowledgements(id,reader_id,revision_id,evidence_ref,actor) values
 ('50000000-0000-0000-0000-000000000001','40000000-0000-0000-0000-000000000001','20000000-0000-0000-0000-000000000001','demo/read-receipt-hana','Hana') on conflict do nothing;
insert into activity(id,process_id,actor,action,detail) values
 ('60000000-0000-0000-0000-000000000001','10000000-0000-0000-0000-000000000001','Demo operator','seed','{"note":"Fictional demonstration records, not operational evidence"}') on conflict do nothing;
