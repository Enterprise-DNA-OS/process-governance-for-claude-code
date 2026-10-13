# approve

Record independent approval with evidence and a future review date.

Read CLAUDE.md first. Run:

```bash
npm run processes -- approve --process=PROC-001 --evidence="archive/approval" --safety-review="archive/control-review" --next-review=2099-01-01 --actor="Reviewer"
```

Replace example names, dates, references and paths with the operator's actual instructions. The far-future example dates are placeholders, never a recommended review interval. Read the process first and resolve ambiguity before any write.

Use --json when composing results. Report only returned records. Explain missing evidence and distinguish draft content from approved content. Actor names are operator supplied. Never send, certify, delete or publish anything. The approver must differ from the author. For safety procedures record a real control review before use. Evidence paths are references, not authenticated signatures.
