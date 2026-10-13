# edit-draft

Correct proposed content before approval.

Read CLAUDE.md first. Run:

```bash
npm run processes -- edit-draft --process=PROC-001 --objective="Check unloading controls" --steps=examples/steps.json --reason="Correct proposed steps" --actor="Author"
```

Replace example names, dates, references and paths with the operator's actual instructions. The far-future example dates are placeholders, never a recommended review interval. Read the process first and resolve ambiguity before any write.

Use --json when composing results. Report only returned records. Explain missing evidence and distinguish draft content from approved content. Actor names are operator supplied. Never send, certify, delete or publish anything.
