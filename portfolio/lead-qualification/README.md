# Lead Qualification & CRM Enrichment — Portfolio Demo

This package is a separate, synthetic portfolio demonstration of an AI-assisted lead qualification pattern. It is not the client workflow or a production CRM integration. The original freelance implementation ran in the client's environment and is not included.

## Contents

- `index.html`, `site.css`, `demo.js` — standalone portfolio page and local interactive simulation.
- `workflows/Lead_Qualification_Demo.json` — importable n8n webhook that validates and scores synthetic lead data and returns a pending-review state.
- `workflows/Lead_Review_Demo.json` — importable n8n webhook that accepts a synthetic approve/reject decision. It does not persist state, write to HubSpot, or send outreach.
- `architecture.png`, `demo-flow.png`, `lead-lifecycle.png` — portfolio reference diagrams. The client architecture diagram is illustrative, not a deployment topology.

## Open the site

Open `index.html` directly or serve this directory with a static file server. The browser demo runs locally and does not submit personal data to a server.

## Import the n8n demos

Import each JSON file into a development n8n instance. Both workflows are inactive on import. They contain no credentials and make no external calls. Activate only in an isolated demo environment after reviewing the nodes. The intake webhook expects `name`, `email`, `company`, `need`, `budget` (`high`, `mid`, `low`, `unknown`), `timeline` (`soon`, `later`, `research`), and optional `decision_maker`.

The score is deterministic example logic, not an OpenAI model result. The review workflow demonstrates the decision contract only; it does not verify that the lead exists or save the decision. Add authenticated state persistence and idempotency before using this pattern operationally.

## Honest presentation

Describe the freelance work only at a level permitted by the agreement. Describe this package as an independent synthetic demonstration. Do not imply that its sample scoring, approval endpoint, or diagrams are the client's implementation or measured production results.
