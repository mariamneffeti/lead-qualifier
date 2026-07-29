# AI Lead Qualification Assistant (n8n)

## Selected Problem Statement
**Option 2: AI Lead Qualification Assistant**
This project implements an intelligent, conversational AI assistant designed to interact with potential Trizen customers. It naturally gathers lead information, determines qualification status, extracts structured data, and seamlessly triggers backend business operations.

## Workflow Explanation
The automation is divided into two primary n8n workflows:

1. **RAG Data Ingestion Pipeline:** 
   - Monitors a Google Drive folder for new company documents.
   - Chunks and embeds the text using OpenAI Embeddings.
   - Upserts the vectors into a **Pinecone Vector Database** (using a delete-before-insert strategy to prevent duplicate data when files are updated).

2. **Core Lead Qualification Chatbot:**
   - **Trigger & Memory:** Receives messages via Webhook from a custom frontend web widget. Conversation history is maintained using **Redis Chat Memory**.
   - **AI Agent Node:** Powered by the **OpenAI Chat Model**, the agent follows a strict system prompt to ask one question at a time. It uses the Pinecone Vector Store as a "Tool" to accurately answer user questions about the company before pivoting back to qualification.
   - **Structured Output Parser:** Once the agent determines the lead is either `qualified` or `unqualified`, it extracts the Lead Name, Email, Budget, Timeline, and Requirements into a strict JSON format.
   - **Validation & Enrichment:** Routes the JSON data through **Hunter.io** to verify the email address validity, and then uses **Apollo** to enrich the lead with company details.
   - **Business Actions (CRM & Notifications):**
     - If qualified and verified: Creates/Updates a contact in **HubSpot**, sends a real-time notification to the sales team in **Slack**, and generates a **Calendly** booking link via HTTP Request for the user.
     - If unqualified or invalid email: Sends a polite rejection/fallback message back to the frontend and halts CRM pollution.

## AI Model Used
- **OpenAI (GPT-4o)** for the conversational AI Agent.
- **OpenAI Embeddings** for the RAG vectorization.
- **Browser Web Speech API** for frontend Voice-to-Text transcription.

## External Integrations
This workflow successfully integrates with 6 external services (exceeding the required 2):
1. **Pinecone:** Vector database for RAG company knowledge.
2. **Hunter.io:** Email verification to prevent spam leads.
3. **Apollo:** Lead enrichment to discover company domain/size.
4. **HubSpot:** CRM for storing qualified contacts.
5. **Slack:** Real-time team notifications for hot leads.
6. **Calendly:** API integration for meeting scheduling.

## Bonus Features Achieved
- ✅ **Voice Interaction:** The frontend widget includes a microphone button that utilizes the native Web Speech API to transcribe voice to text before sending it to n8n.
- ✅ **AI Conversation Memory:** Implemented using a Redis Chat Memory node to maintain context across multiple webhook calls.
- ✅ **Calendar Integration:** HTTP request to Calendly to fetch meeting links.
- ✅ **Error Handling:** Built-in logic gates (Switch/If nodes) to handle invalid emails and unqualified leads gracefully without breaking the workflow.

## Setup Instructions
1. Import the exported `.json` workflows into your n8n instance.
2. Configure your credentials in n8n for: OpenAI, Pinecone, Hunter, Apollo, HubSpot, and Slack.
3. Replace the Calendly Bearer token in the HTTP Request node with your personal access token.
4. Host the provided `index.html` file (locally or via Vercel). Ensure the `webhookUrl` variable in the HTML script matches your n8n production webhook URL.
5. Activate both workflows in n8n.

## Future Improvements
- **Human Handoff:** Add an option for the AI to ping a human agent in Slack and route live responses back to the chat widget if the user asks highly complex questions.
- **Multi-language Support:** Configure the AI prompt and Web Speech API to automatically detect and respond in the user's native language.