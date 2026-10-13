# Process Governance for Claude Code

Your procedures, owners, revisions and review dates in a database you own. Built by Enterprise DNA. Works with Claude Code, Codex, OpenCode or Cursor.

| Do it yourself | We customise it | We run it for you |
|---|---|---|
| Free MIT code. Install it and own the records. | Your fields, rules, Nintex data mapping and a web front end or different stack if required. | Installed, connected and operated through Omni by Enterprise DNA. One setup fee, then a monthly retainer. |

[Discuss your version with Sam](https://enterprisedna.co/omni/book/?offer=replace-software&utm_source=github&utm_medium=readme&utm_campaign=nintex-process-manager).

## What it covers

For an operations lead maintaining controlled procedures across purchasing, administration and site operations. Keep approved procedures separate from proposed changes, record owner reviews, follow up improvements and track acknowledgements against the current approved revision. Generate procedure sheets, change records and owner review briefs. No workflow engine or graphical process editor is required for these jobs.

Nintex's [current pricing route](https://www.nintex.com/pricing/) asks you to contact sales. We have not verified a current NZ or AU customer invoice and make no savings claim. The procurement benchmarks and candidate assessment are in [research notes](docs/research.md).

## Quick start

Node 20 or later.

```bash
git clone https://github.com/Enterprise-DNA-OS/process-governance-for-claude-code.git
cd process-governance-for-claude-code
npm install
npm run demo
npm run processes -- weekly-review
npm run view
npm run docs
```

Open the folder with your coding agent and ask /weekly-review. With DATABASE_URL unset, PGlite stores the demo in .data/db. For your own Postgres, set DATABASE_URL and run npm run migrate. Run npm run demo only against a demo database. Agent use and hosting have their own costs. Back up your database and referenced evidence separately.

## The commands

28 CLI commands, plus /customise and /new-view, make 30 command recipes. Reads print aligned output; --json returns structured records. Writes require --actor=. Resolve records by reference, UUID prefix or case-insensitive name. Ambiguous names list candidates and exit 1.

| Recurring job | Command |
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
| Add a field or rule | /customise |
| Add a report | /new-view |

## Ten questions to ask your own records

These combined checks run today. They are examples of tailoring questions to your business, not a claim that Nintex cannot produce similar reports.

- Which overdue process reviews also have overdue improvement actions? `reviews-due`
- Which pending safety procedure changes still need a control review? `compliance`
- Who has acknowledged an old version but not the current one? `acknowledgement-gaps`
- Which processes combine the most waiting time with high-priority open actions? `bottlenecks`
- Which owners carry the largest overdue process review load? `owner-workload`
- Which procedures have proposed changes while an older version remains approved? `approval-queue`
- Which process records have gone quiet for thirty days? `attention`
- Which personal-information processes need their retention purpose reviewed? `compliance`
- Which imported records still need procedure content and approval? `compliance`
- What are the review dates, open improvements and missing read receipts for Monday? `weekly-review`

## Your first hour: ten things to ask for

1. Put our name, logo and colours on procedure sheets.
2. Show overdue reviews beside unresolved improvements.
3. Show the approved version and the proposed version separately.
4. Find readers who have not acknowledged the current version.
5. List pending changes to safety procedures.
6. Compare recorded waiting time across purchasing procedures.
7. Test our Nintex export without saving changes.
8. Draft our Monday review from the actual records.
9. Add a business-unit field with a migration.
10. Add a read-only report for our process owners.

## A controlled change

Write the proposed steps as a JSON array. Each step needs title, role, active_minutes and wait_minutes. Use examples/steps.json as the shape. Propose with revise; correct an unapproved version with edit-draft. A separate reviewer records approval evidence and a future review date. A safety-sensitive procedure also requires a control-review reference. Approved content is immutable. The older approved revision stays current until its replacement is approved. Readers then appear as missing acknowledgements until evidence for the new version is recorded.

Review records preserve the revision checked. set-metadata changes owners, grouping, jurisdiction or retention metadata with a reason. archive refuses legal holds, open improvements and draft revisions. It does not delete records.

## Switch from Nintex Process Manager

```bash
npm run processes -- import nintex --file=examples/nintex-process-list.csv --dry-run --actor="Migration operator"
npm run processes -- import nintex --file=examples/nintex-process-list.csv --actor="Migration operator"
```

The importer covers the Process List CSV register, preserves all original fields and starts records as drafts. Use --map=examples/import-map.json for heading differences. The sample demonstrates supported headings, not a certified export from a live tenant. Procedure steps, approvals, permissions and attachments require separate mapping and reconciliation. [Full replacement guide](docs/replace-nintex-process-manager.md).

## Documents and views

brand.json controls business name, logo reference and colours. npm run docs produces controlled procedure snapshots, review briefs and change records in docs-out/. npm run view produces the week and control checks in views/. These are read-only HTML snapshots, printable to PDF. They never send messages or change operational records. [Why no front end](docs/why-no-front-end.md).

## Compliance and trust

[Compliance notes](docs/compliance.md) cite NZ control-review guidance, NZ Privacy Principle 9 and Australian APP 11. The checks flag records for assessment. They do not certify a safe process or decide a legal retention period. Actor names and evidence references are supplied by the operator. An acknowledgement is not proof of training or competence. History is not tamper-proof against database administrators.

## Tests

npm test uses a temporary database. It covers all 28 CLI commands, repeated migrations and seeds, rejected self-approval, immutable approved revisions, acknowledgement invalidation, safety evidence, legal holds, atomic import rollback, dry runs, repeat detection, exports and escaped HTML. GitHub checks run the suite on Linux, Windows and PostgreSQL 16.

MIT licence. Not affiliated with Nintex or Anthropic. [Book 30 minutes with Sam](https://enterprisedna.co/omni/book/?offer=replace-software&utm_campaign=nintex-process-manager&utm_source=github&utm_medium=readme).
