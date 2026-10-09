# Scaling plan: AI Lead Qualification Assistant

This plan is based on the checked-in n8n exports (`Lead_Qualifier.json`, `Rag.json`), `index.html`, and `README.md`. The project is currently a demo/prototype: the workflows are small and the browser widget calls n8n directly.

## P0 — Make the current flow reliable before adding traffic

- [ ] **Fix and verify RAG replacement behavior.** The Drive trigger watches `fileCreated` only, so edited documents are not re-indexed. The ingestion workflow also fans a Pinecone HTTP request and an insert operation from the download node; make deletion complete before insertion. Use Pinecone's documented delete-by-metadata operation and authenticated credential, then insert; handle delete/insert failures and retries. Confirm the request is targeting the intended Pinecone endpoint and API version.
- [ ] **Align qualification fields end to end.** The parser schema in the export uses `email`, `company`, `budget_range`, `timeline`, `need`, and `decision_maker`, while the README describes name, budget, requirements, and Apollo enrichment. Check every Switch condition, Hunter input, HubSpot mapping, Slack message, and prompt against one canonical schema; remove stale README claims or implement the claimed steps.
- [ ] **Check contact mapping after email verification.** The Hunter node becomes the current item before HubSpot. Ensure the HubSpot email and properties are sourced from the qualification result, not accidentally from Hunter's response; explicitly preserve the lead object through verification.
- [ ] **Validate webhook requests.** Require `session_id` and `message`, enforce a reasonable body/message size, reject malformed input, and configure allowed origins to the actual site instead of `*`. Add rate limiting or an equivalent per-session/IP guard before the AI call.
- [ ] **Make chat session IDs safe and durable.** Generate a high-entropy session ID in the widget or backend, validate it server-side, and prevent callers from selecting another user's session key. Add retention/expiry for Redis conversations and document how consent and deletion requests work.
- [ ] **Handle integration failures without losing leads.** Add explicit error paths for OpenAI, Redis, Hunter, HubSpot, Slack, Calendly, and Pinecone. Persist qualified leads to a durable retry queue/outbox before non-critical notifications; make CRM writes idempotent to avoid duplicate contacts on webhook retries.
- [ ] **Return a usable Calendly result.** The current request calls `/users/me`; ensure the response sent to the widget includes an actual booking URL/event type, and handle missing configuration and API failures.

## P1 — Measure and operate it

- [ ] **Add workflow observability.** Record a correlation ID, workflow execution ID, duration, outcome/status, and integration failures. Avoid logging raw conversation text or unnecessary personal data. Alert on repeated workflow failures and ingestion lag.
- [ ] **Define qualification quality metrics.** Track conversation completion, qualified rate, valid-email rate, CRM success, booking conversion, abandonment, and human correction rate. Establish a baseline and review false-qualified/false-rejected examples before changing prompts or thresholds.
- [ ] **Build a small evaluation set.** Include ordinary, ambiguous, incomplete, adversarial, unsupported-company-question, invalid-email, and integration-failure cases. Re-run it when prompts, model, schema, or routing changes.
- [ ] **Add operational limits.** Set model token/turn limits, timeouts, concurrency limits, and provider quotas. Document expected cost per completed conversation and alert on abnormal usage.
- [ ] **Add an operator recovery guide.** Document how to replay failed executions safely, rebuild the Pinecone index, rotate credentials, and diagnose an empty or stale knowledge base.

## P2 — Scale the product surface

- [ ] **Separate the widget from the demo page.** Extract the chat widget into a versioned embeddable asset or package; keep the sample landing page separate. Add configuration for endpoint, brand, locale, and feature flags instead of editing the page source.
- [ ] **Improve browser compatibility and accessibility.** Provide a clear fallback when Web Speech API is unavailable, set the recognition language explicitly, announce new messages to assistive technology, and verify keyboard and mobile interaction.
- [ ] **Support multiple tenants deliberately.** If serving more than Trizen, namespace Redis sessions, Pinecone metadata/indexes, prompts, allowed origins, CRM routing, and secrets by tenant. Add tenant-level authorization and usage limits before onboarding another company.
- [ ] **Version workflow releases.** Keep export files free of environment-specific identifiers where possible, document required n8n node versions, and promote workflow changes through development/staging/production with a rollback path.
- [ ] **Expand knowledge ingestion safely.** Handle edits, deletions, unsupported file types, duplicate events, and large files. Track document version/hash and ingestion status; publish a new document version only after successful parsing and embedding.

## Suggested order

1. Reconcile the README with the exported workflows and settle the canonical lead schema.
2. Fix RAG update ordering and verify ingestion on create, edit, and delete.
3. Harden webhook/session handling and confirm the widget response contract.
4. Make CRM writes idempotent and add retry/error handling.
5. Add metrics and an evaluation set; use the results to guide prompt and capacity changes.
6. Extract the widget and add tenant isolation only when there is a real second deployment.

## Scale trigger

Keep the current n8n design while volume is low and the team can inspect failures manually. Consider queue-backed workers, a durable lead store, and a separate API service when measured webhook latency, execution concurrency, provider limits, or recovery time repeatedly miss agreed targets. Set those targets from an initial production baseline rather than guessing them now.
