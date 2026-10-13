# set-metadata

Update ownership, scope or retention metadata with a reason.

Read CLAUDE.md first. Run:

```bash
npm run processes -- set-metadata --process=PROC-001 --owner="Wiremu" --reason="Ownership handover" --actor="Operator"
```

Replace example names, dates, references and paths with the operator's actual instructions. The far-future example dates are placeholders, never a recommended review interval. Read the process first and resolve ambiguity before any write.

Use --json when composing results. Report only returned records. Explain missing evidence and distinguish draft content from approved content. Actor names are operator supplied. Never send, certify, delete or publish anything.
