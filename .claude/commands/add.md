# add

Register a process as a draft.

Read CLAUDE.md first. Run:

```bash
npm run processes -- add --reference=PROC-005 --name="Approve stock adjustments" --owner="Aroha" --group="Operations" --actor="Operator"
```

Replace example names, dates, references and paths with the operator's actual instructions. The far-future example dates are placeholders, never a recommended review interval. Read the process first and resolve ambiguity before any write.

Use --json when composing results. Report only returned records. Explain missing evidence and distinguish draft content from approved content. Actor names are operator supplied. Never send, certify, delete or publish anything.
