# acknowledge

Record evidence that an assigned reader acknowledged the current version.

Read CLAUDE.md first. Run:

```bash
npm run processes -- acknowledge --process=PROC-001 --reader="Leo" --evidence="archive/read-receipt" --actor="Operator"
```

Replace example names, dates, references and paths with the operator's actual instructions. The far-future example dates are placeholders, never a recommended review interval. Read the process first and resolve ambiguity before any write.

Use --json when composing results. Report only returned records. Explain missing evidence and distinguish draft content from approved content. Actor names are operator supplied. Never send, certify, delete or publish anything.
