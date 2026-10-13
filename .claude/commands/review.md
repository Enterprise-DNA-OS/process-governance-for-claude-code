# review

Record an owner review of the approved version.

Read CLAUDE.md first. Run:

```bash
npm run processes -- review --process=PROC-002 --note="Procedure and evidence checked" --evidence="archive/review" --next-review=2099-01-01 --actor="Reviewer"
```

Replace example names, dates, references and paths with the operator's actual instructions. The far-future example dates are placeholders, never a recommended review interval. Read the process first and resolve ambiguity before any write.

Use --json when composing results. Report only returned records. Explain missing evidence and distinguish draft content from approved content. Actor names are operator supplied. Never send, certify, delete or publish anything.
