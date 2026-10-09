# Interview Prep TODO — Lead Qualification + Competitive Intelligence

Use this as a study plan, not a script to memorize. Keep claims tied to what you personally did and can explain. Client implementations ran in client environments; discuss only details your agreements allow. Portfolio demos are independent synthetic demonstrations and must not be described as the client systems.

## 1. Prepare the two project stories

- [ ] Write a 60–90 second version of each project: business problem → your role → system shape → key decision → outcome you can support.
- [ ] Make a one-page contribution map: what you personally designed, configured, built, operated, and handed off.
- [ ] Separate client implementation facts from the current portfolio/demo implementation. For every feature, know whether it was delivered for the client, appears in the demo, is only in the architecture, or is planned.
- [ ] Prepare a confidentiality answer: “The implementation ran in the client environment, so I can’t share its artifacts or confidential details. I can explain my contribution at a high level and show an independent synthetic demo.”
- [ ] Check that naming the client, industry, integrations, metrics, diagrams, and architecture details is allowed by each agreement. Keep the client unnamed if unsure.
- [ ] Do not invent business outcomes. If you cannot verify a metric, say so and explain what you would measure.
- [ ] Rehearse a demo in under 3 minutes. Use synthetic records only; point out what the demo does and does not implement.

## 2. Lead Qualification & CRM Enrichment — study and rehearse

- [ ] Draw the path from chat/webhook input through field extraction, validation, enrichment, qualification/scoring, human approval, CRM handoff, and response.
- [ ] Explain the canonical lead schema and how you handle missing, malformed, or contradictory fields.
- [ ] Explain how AI extraction differs from business qualification rules. A model’s confidence is not automatically a calibrated probability or a good sales score.
- [ ] Be able to give a sample score rubric, show why each criterion has its weight, and explain how you would tune it with labeled outcomes and human corrections.
- [ ] Explain email validation versus company enrichment: what each provider can and cannot establish, and how you handle unavailable or conflicting results.
- [ ] Explain the human approval gate: what is pending, who can approve, how reject/edit works, what gets audited, how approvals expire, and how the workflow prevents outreach before approval.
- [ ] Explain the PostgreSQL model you would use: leads, enrichment/analysis records, approval decisions, status history, idempotency key, timestamps, and constraints.
- [ ] Explain HubSpot contact upsert/deduplication, property mapping, retry safety, and how you avoid creating duplicates after webhook retries.
- [ ] Review the existing project export before interviews: be ready to distinguish its actual nodes and mappings from the client implementation and from the advertised architecture.
- [ ] Be ready to discuss the prototype gaps visible in the checked-in export: qualification status vocabulary mismatch, no numeric score, no PostgreSQL node, no explicit human approval gate, no Apollo node despite README claims, and a Calendly `/users/me` request rather than a booking URL. Explain these as findings in the portfolio export, not as claims about inaccessible client-environment workflows.
- [ ] Prepare an answer about personal data: data minimization, consent, retention, access control, execution-log redaction, deletion requests, and avoiding unnecessary transcript/PII logging.
- [ ] Explain failure behavior for OpenAI, verification/enrichment APIs, HubSpot, PostgreSQL, Slack, and scheduling: timeout, retry/backoff, dead-letter/manual recovery, and idempotency.
- [ ] Create or describe an evaluation set: clear-fit lead, poor-fit lead, missing email, invalid email, ambiguous budget, long timeline, conflicting decision-maker, prompt injection, provider failure, CRM timeout, repeated request, approval rejection.

### Employer questions to practice — Lead Qualifier

1. What was the business problem and what part did you personally own?
2. How did you decide whether a lead was qualified?
3. How did you keep a model from inventing missing lead fields?
4. Why use an LLM here instead of a conventional form and rules?
5. How did you validate and enrich email/company details? What happens when a provider disagrees?
6. How would you make the score explainable and calibrate it against sales outcomes?
7. How does human approval stop an unapproved lead from receiving outreach?
8. How do you prevent duplicate HubSpot contacts if the same webhook is replayed?
9. What would you persist in PostgreSQL, and which unique constraints/indexes would you add?
10. What happens when HubSpot or the enrichment provider is down after a lead has been scored?
11. How would you handle PII, consent, retention, and deletion?
12. What would you measure: completion, qualified rate, false positives/negatives, approval latency, CRM success, and conversion?
13. What would you change first if lead volume grew 10×?
14. Which part of the public demo is synthetic, and which part came from the client implementation?

## 3. Competitive Intelligence Pipeline — study and rehearse

- [ ] Explain how source items become normalized signals and how the hash is computed. State what fields are canonicalized and how meaningful updates differ from duplicates.
- [ ] Explain evidence provenance: original URL, retrieval timestamp, immutable evidence reference, checksum, and retention policy.
- [ ] Explain the low-cost first model / higher-cost escalation pattern and why a confidence threshold must be calibrated against reviewed examples.
- [ ] Be ready to explain why model confidence may be poorly calibrated; define false accepts, false escalations, and the cost/latency/quality tradeoff.
- [ ] Explain the PostgreSQL records and relationships: competitors, signals, analyses, evidence metadata, escalation queue, and error audit.
- [ ] Explain the dual-write risk between PostgreSQL and object storage and how to reconcile orphan rows or missing evidence.
- [ ] Explain why Redis queue mode separates n8n trigger handling from worker execution, what Redis/PostgreSQL dependencies remain, and which limits to monitor.
- [ ] Explain retry policy, idempotency, dead-letter/replay strategy, queue age, provider rate limits, and alerting.
- [ ] Explain cost accounting: model tier, token usage, retries, escalation percentage, and the limitations of comparing against an all-premium baseline.
- [ ] Be clear about what is a design diagram, what is deployed infrastructure, and what the current n8n demo workflow actually executes.

### Employer questions to practice — Competitive Intelligence

1. How do you define a “signal,” and how do you normalize different sources?
2. How does deduplication work? What are the edge cases for hashing?
3. How do you preserve evidence so an analyst can audit a generated summary?
4. Why use a two-tier model cascade? How did you choose the escalation threshold?
5. How would you know whether the cheaper model is making the right decisions?
6. What if the model provider is unavailable or returns invalid structured data?
7. Why keep evidence in object storage and metadata/analysis in PostgreSQL?
8. How do you handle a successful object upload followed by a failed database insert (or the reverse)?
9. What role does Redis play in queue mode? What can still bottleneck as workers scale?
10. How would you estimate cost savings without overstating them?
11. Which operational metrics and alerts would you add first?
12. What did you actually implement versus document as the target architecture?

## 4. Core technical topics to review

- [ ] n8n: Webhook test vs production URL, authentication, CORS, data shape, expressions, node linking, If/Switch branches, Wait node, sub-workflows, error workflows, executions, retries, and queue mode.
- [ ] OpenAI API: prompt boundaries, structured outputs / JSON Schema, refusals and malformed/incomplete results, tool/function calling, latency/cost controls, and evaluation design.
- [ ] PostgreSQL: primary/foreign/unique/check constraints, transactions, indexes, upserts, isolation/concurrency, migrations, backups, and least-privilege roles.
- [ ] HubSpot: contact properties, email as a dedupe identifier, create/update semantics, associations, rate limits, scopes, and API error handling.
- [ ] Redis: queue semantics, persistence/failover assumptions, memory limits, and why it is not the durable business system of record.
- [ ] Security: secret storage/rotation, webhook authentication, request validation/size limits, rate limiting, least privilege, log redaction, and replay protection.
- [ ] System design: synchronous vs asynchronous API response, durable outbox/retry queue, idempotency keys, tenant isolation, observability, recovery, and capacity triggers.

## 5. Suggested 7-session study order

1. **Project truth and story:** contribution map, confidentiality boundaries, and honest current-vs-target feature map.
2. **n8n mechanics:** webhook → transform/validate → branch → response; error path; Wait/approval pattern; queue mode concepts.
3. **Lead quality:** schema, explainable rule-based score, model extraction, verification, and false-positive/false-negative examples.
4. **CRM and persistence:** HubSpot upsert, PostgreSQL schema/constraints/transactions, idempotent retries.
5. **Competitive intelligence:** signal normalization, dedupe, evidence provenance, two-tier routing, cost tracking.
6. **Operations and security:** failure recovery, logging, privacy, rate limits, scaling, and monitoring.
7. **Mock interview:** answer the questions above aloud; do each demo in three minutes; remove claims you cannot substantiate.

## 6. Official study material

### n8n

- [Learning paths](https://docs.n8n.io/learning-paths.md)
- [Webhook node](https://docs.n8n.io/integrations/builtin/core-nodes/n8n-nodes-base.webhook/)
- [Split with conditionals](https://docs.n8n.io/build/flow-logic/split-with-conditionals/)
- [Wait node](https://docs.n8n.io/integrations/builtin/core-nodes/n8n-nodes-base.wait/)
- [Human-in-the-loop for tools](https://docs.n8n.io/build/integrate-ai/ai-examples/human-in-the-loop-for-tools/)
- [Handle errors gracefully](https://docs.n8n.io/build/flow-logic/handle-errors-gracefully/)
- [Enable queue mode](https://docs.n8n.io/deploy/host-n8n/configure-n8n/scaling/enable-queue-mode/)
- [Run security audits](https://docs.n8n.io/deploy/host-n8n/configure-n8n/security/run-security-audits.md)

### OpenAI API

- [Structured Outputs](https://developers.openai.com/api/docs/guides/structured-outputs) — schema-constrained lead extraction; distinguish this from ordinary JSON mode.
- [Evaluation best practices](https://developers.openai.com/api/docs/guides/evaluation-best-practices) — build task-specific examples and combine automated checks with human review. Prefer a portable local evaluation set; check the current notice before depending on a specific platform eval feature.

### CRM and data

- [HubSpot CRM contacts API](https://developers.hubspot.com/docs/api-reference/legacy/crm/objects/contacts/guide)
- [PostgreSQL constraints](https://www.postgresql.org/docs/current/ddl-constraints.html)
- [PostgreSQL transactions](https://www.postgresql.org/docs/current/tutorial-transactions.html)
- [PostgreSQL indexes](https://www.postgresql.org/docs/current/indexes.html)
- [Redis scaling documentation](https://redis.io/docs/latest/operate/oss_and_stack/management/scaling/)

## 7. Final readiness checklist

- [ ] I can explain every node in a demo workflow and every box/arrow in each architecture image.
- [ ] I can distinguish the client system, the local portfolio export, the independent synthetic demo, and proposed future architecture.
- [ ] I can explain the lead score with a concrete worked example and acknowledge its limits.
- [ ] I can explain how approval, persistence, and idempotency work—or state clearly when a demo simulates them.
- [ ] I can describe one failure and recovery path for each external dependency.
- [ ] I can discuss my contribution without exposing client information.
- [ ] I have no client credentials, customer data, execution logs, or unapproved screenshots in public artifacts.
- [ ] I have a concise answer when asked for impact that I cannot independently verify.
