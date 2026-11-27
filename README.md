# AI Lead Qualification & CRM Enrichment Assistant

An AI-powered lead qualification and sales automation pipeline built with n8n. Combines a conversational website chat widget with document-grounded RAG retrieval, automated lead scoring, email verification, and CRM synchronization with human review.

[![Built with n8n](https://img.shields.io/badge/orchestration-n8n-EA4B71)](https://n8n.io/)
[![Video Walkthrough](https://img.shields.io/badge/video%20walkthrough-Google%20Drive-4285F4)](https://drive.google.com/file/d/1U0eff06DoqX4AHfy9hmTER32MMZ-WVDF/view?usp=sharing)
[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)

> [!NOTE]
> **Implementation & Confidentiality Notice:**  
> This repository presents the architecture, sanitized n8n workflow templates, and client-facing chat interface for an automated lead-qualification and enrichment system originally developed for production use. In accordance with client NDAs, private API keys, proprietary CRM properties, and confidential sales data remain redacted.

---

## Video Walkthrough

Watch a comprehensive end-to-end walkthrough demonstrating chat interaction, n8n workflow execution, email verification, and CRM handoff:

📺 **[Watch the Product Walkthrough on Google Drive](https://drive.google.com/file/d/1U0eff06DoqX4AHfy9hmTER32MMZ-WVDF/view?usp=sharing)**

---

## System Architecture

```mermaid
flowchart LR
    D[Google Drive Knowledge Base] --> R[n8n RAG Ingestion Pipeline]
    R --> P[(Pinecone Vector Store)]
    U[Website Chat Widget] --> W[n8n Qualification Workflow]
    W --> A[OpenAI Extraction Agent]
    A --> P
    A --> M[(Redis Session Memory)]
    W --> H[Hunter Email Verification]
    H --> C[HubSpot CRM Contact Sync]
    C --> S[Slack Sales Notification]
    S --> L[Calendly Scheduling Handoff]
```

### Core Pipeline Capabilities
* **Grounded Natural Conversations:** Uses OpenAI LLM connected to **Pinecone** to answer company and product FAQs from ingested documentation without hallucination.
* **Session Persistence:** Maintains multi-turn context across chat visits using **Redis** keyed by session ID.
* **Lead Scoring & Extraction:** Discretely extracts prospect budget, timeline, company size, decision-maker status, and email during natural dialogue.
* **Email Verification Gate:** Checks prospect email deliverability via **Hunter API** before any contact record creation to maintain clean CRM data.
* **CRM & Sales Operations:** Automatically upserts qualified leads to **HubSpot CRM**, posts instant deal notifications to **Slack**, and provides meeting booking handoffs via **Calendly**.

---

## Visual Architecture & Workflow Lifecycle

| High-Level Architecture | Lead Lifecycle Flow |
| :---: | :---: |
| ![Architecture](portfolio/lead-qualification/architecture.png) | ![Lead Lifecycle](portfolio/lead-qualification/lead-lifecycle.png) |

| End-to-End Demo Flow |
| :---: |
| ![Demo Flow](portfolio/lead-qualification/demo-flow.png) |

---

## Included Workflows

1. **`Lead_Qualifier.json` (Main Qualification & Routing):**
   * Webhook listener at `/lead-chat`.
   * Integrates OpenAI conversational agent, Pinecone retrieval, and Redis session memory.
   * Conditional routing: ongoing conversation, polite disqualification, or qualified prospect escalation through email verification, HubSpot, Slack, and Calendly.
2. **`Rag.json` (Automated Document Ingestion):**
   * Monitors Google Drive folder for new product / company documentation.
   * Splits text, generates embeddings (`text-embedding-3-large`), and indexes into Pinecone namespaces.
3. **`portfolio/lead-qualification/workflows/Lead_Review_Demo.json` (Human-in-the-Loop Review):**
   * Checkpoint workflow enabling sales reps to inspect lead enrichment and approve outreach before customer-facing emails dispatch.

---

## Tech Stack

* **Workflow Orchestration:** [n8n](https://n8n.io/)
* **AI & Embeddings:** OpenAI (`gpt-4o-mini` / `text-embedding-3-large`)
* **Vector Database:** Pinecone
* **Session Cache:** Redis
* **Sales & Ops Integrations:** HubSpot, Hunter, Slack, Calendly
* **Frontend:** Responsive Vanilla HTML, CSS, JavaScript widget

---

## Quickstart: Synthetic Local Demo

The recommended first run is the standalone portfolio demo. It needs no n8n instance, API key, or external account, and the browser simulation does not send data to a server.

1. Open `portfolio/lead-qualification/index.html` in a browser.
2. Try the synthetic lead qualification conversation and review interaction.

For importable n8n examples, see [`portfolio/lead-qualification/workflows`](portfolio/lead-qualification/workflows). These demo workflows are inactive on import, use synthetic inputs, and do not connect to a CRM or send outreach. See the [portfolio demo README](portfolio/lead-qualification/README.md) for their limits.

## Optional: Connect the Integration Templates

`Lead_Qualifier.json` and `Rag.json` are integration templates, not the local demo. Running them requires an n8n instance and your own credentials for the services you enable, including OpenAI, Redis, Pinecone, Google Drive, Hunter, HubSpot, and Slack. Some services may require paid accounts or incur usage charges. Replace the Google Drive folder and Pinecone index placeholders in `Rag.json` with resources in your own accounts before using that template.

> **Data handling:** The root `frontend/index.html` chat sends messages to the n8n webhook configured in its `CONFIG.webhookUrl`. The qualification workflow may pass submitted information to enabled third-party services and may create CRM records or send notifications. Use only synthetic test data and a webhook you control. Do not point the frontend at a client or production workflow for this portfolio demo.

To experiment with the integration templates, import them into a separate development n8n instance, configure only the credentials needed for the nodes you intend to test, and keep CRM and notification actions disconnected or test-only. Review each workflow and service's behavior before activation.

---
## Contact

**Meriem Neffeti**  
AI Automation Engineer  
Email: [neffetimeriem@gmail.com](mailto:neffetimeriem@gmail.com) · [LinkedIn](https://www.linkedin.com/in/meriem-neffeti-8a488a385/) · [GitHub](https://github.com/mariamneffeti)
