# Bring across the Nintex process register

Sources checked 13 October 2026: [Nintex reports help](https://help.nintex.com/en-US/promapp/Admin/Reports.htm) and [Nintex's report endpoint guide](https://community.nintex.com/process-manager-59/endpoint-urls-to-generate-the-in-app-reports-62376). A Promaster can download the Process List CSV from the documented tenant endpoint /exports/api/v1/reports/ProcessListReport/csv while signed in. Download it through your existing authorised account. No credentials belong in this repo.

## One command after export

Run npm run processes -- import nintex --file=/path/process-list.csv --actor="Migration operator". First add --dry-run to test the same mapping without saving records. On Windows use a quoted Windows path.

The default aliases are Process ID, Process Unique ID, Unique ID, Process URL or URL for identity; Process Name, Process or Name for the name; Process Group or Group; Process Owner or Owner; Process Expert or Expert. Nintex documents the endpoint but does not guarantee these headings on the public help page. Inspect your exported headings. Set --map=/path/mapping.json to an object with id, name, owner, expert and group keys naming your exact headings. The included fixture is synthetic.

A stable export ID or URL is preferred. Without one, the importer matches the lower-case group and name together. Renaming either changes that fallback identity, so reconcile renamed records manually. All source fields are preserved in source_record. Every imported process is a draft with no invented steps, approval or review date. Identical repeats are skipped. A changed repeat stops the whole import for reconciliation. Duplicate identities, malformed rows and missing names roll back the entire file. No partial success is hidden.

## Check before switching

Compare record counts and names with the export, inspect several groups and owners, then map procedure steps into revisions. Obtain real review evidence before approval. Map separate review dates and feedback reports only after checking their identity columns. Keep original exports in protected storage. Add readers and actual acknowledgement evidence. Render the documents and compare them with approved procedures before using them.

The Process List is not a full backup. Nintex's [export settings](https://help.nintex.com/en-us/promapp/Admin/Configuration.htm) cover XML and other content exports. This base does not import those formats, diagrams, attached files, permissions, approval history, feedback or read receipts. Enterprise DNA scopes that additional migration, or your coding agent adds and tests a mapper against your actual export. One-command register import does not mean a whole tenant has moved in a day.

Export all seven local record sets with npm run processes -- export --file=process-backup.json. It refuses to overwrite an existing file. This is a portable JSON snapshot, not an automatic restore command. Use a tested database backup and restore procedure for operations; archive referenced documents separately.
