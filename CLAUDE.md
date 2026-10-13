# Process Governance for Claude Code

For the process owner and operations lead maintaining procedures, review dates and improvement actions. Set your business name and colours in brand.json. The demo records are fictional.

## House rules

Read records before answering. Keep approved revisions intact and propose changes as a new revision. All writes need a named actor and explicit operator intent. Never infer an approval, read receipt or safety assessment from an imported status. Never send, sign, delete or publish. Draft internal briefs to drafts/. Evidence references are operator supplied and are not verified documents. An ambiguous name means list candidates and ask. Use npm run processes -- help for accepted flags. Unknown options fail.

DATABASE_URL selects shared Postgres; otherwise use local PGlite. This is a trusted-operator CLI, not an authenticated multi-user service. Use restricted database credentials and your own backup/access controls for shared operation. No direct anonymous database access.

## Routing

| Request | Command |
|---|---|
| Show command names and accepted options | /help |
| Read the process register | /processes |
| Read one process and its revisions, reviews and improvements | /process |
| Find owner reviews due within thirty days | /reviews-due |
| Read proposed revisions awaiting approval | /approval-queue |
| Review open improvement actions in due-date order | /improvements-due |
| Find assigned readers missing the current approved version | /acknowledgement-gaps |
| Compare owners, review dates and overdue improvement counts | /owner-workload |
| Compare recorded active and waiting minutes with high-priority actions | /bottlenecks |
| Find overdue, unowned, quiet or changing processes | /attention |
| Check record exceptions against cited rules and local policies | /compliance |
| Read the activity history | /history |
| Build the Monday review from review dates, improvements and acknowledgements | /weekly-review |
| Register a process as a draft | /add |
| Update ownership, scope or retention metadata with a reason | /set-metadata |
| Propose the next procedure version | /revise |
| Correct proposed content before approval | /edit-draft |
| Record independent approval with evidence and a future review date | /approve |
| Record an owner review of the approved version | /review |
| Assign an improvement with an owner and due date | /log-improvement |
| Record a resolution and its evidence | /close-improvement |
| Add someone who must acknowledge a procedure | /assign-reader |
| Record evidence that an assigned reader acknowledged the current version | /acknowledge |
| Record a process note | /log |
| Retire a process after holds, open improvements and drafts are resolved | /archive |
| Bring across a Nintex Process List CSV as draft register records | /import |
| Export all seven record sets to a new JSON file | /export |
| Write an internal weekly brief to drafts without sending | /draft-review |
| Change a field or rule | /customise |
| Add a read-only report | /new-view |

## Verification

Run npm test before committing changes. TEST_DATABASE_URL may only identify an empty disposable database. Never put a live connection in it. The same suite runs on Windows and Linux in .github/workflows/test.yml, plus PostgreSQL 16. npm run demo seeds fictional records, so use it only on a demo database. Read docs/compliance.md before discussing a finding.

Built and run for businesses through Omni by Enterprise DNA.
