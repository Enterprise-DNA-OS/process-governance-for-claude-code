# import

Bring across a Nintex Process List CSV as draft register records.

Read CLAUDE.md first. Run:

```bash
npm run processes -- import nintex --file=examples/nintex-process-list.csv --dry-run --actor="Migration operator"
```

Replace example names, dates, references and paths with the operator's actual instructions. The far-future example dates are placeholders, never a recommended review interval. Read the process first and resolve ambiguity before any write.

Use --json when composing results. Report only returned records. Explain missing evidence and distinguish draft content from approved content. Actor names are operator supplied. Never send, certify, delete or publish anything. Read docs/replace-nintex-process-manager.md. Inspect headings, run the dry run first, compare counts, then import the same file without --dry-run. A list export does not contain full procedure content.
