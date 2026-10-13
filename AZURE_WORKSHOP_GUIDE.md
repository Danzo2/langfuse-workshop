# Langfuse Workshop: Azure OpenAI Companion Guide

This guide is designed for team members at **Arterial** running the [Langfuse Workshop](https://github.com/langfuse/langfuse-workshop) on their local machines. 

The original workshop repository is written assuming standard OpenAI. This document provides the exact **configuration, Azure OpenAI adaptations, AI agent prompts, code snippets, and troubleshooting gotchas** so you can complete all workshop modules smoothly.

---

## Table of Contents
1. [Prerequisites & Initial Setup](#1-prerequisites--initial-setup)
2. [Langfuse Project Setup](#2-langfuse-project-setup)
3. [Environment Configuration (`.env`)](#3-environment-configuration-env)
4. [Setting Up the Azure LLM Connection in Langfuse](#4-setting-up-the-azure-llm-connection-in-langfuse)
5. [Git & Branch Management Gotchas](#5-git--branch-management-gotchas)
6. [Module-by-Module Guide & AI Prompts](#6-module-by-module-guide--ai-prompts)
   - [Module 00: Setup & Verification](#module-00-setup--verification)
   - [Module 01: Base App](#module-01-base-app)
   - [Module 02: Tracing (Azure Adaptation)](#module-02-tracing-azure-adaptation)
   - [Module 03: Prompt Management](#module-03-prompt-management)
   - [Module 04: Monitoring & Evaluators](#module-04-monitoring--evaluators)
   - [Module 05: Dataset Seeding](#module-05-dataset-seeding)
   - [Module 06: Running Experiments](#module-06-running-experiments)
   - [Module 07: Evaluating a Prompt Change](#module-07-evaluating-a-prompt-change)
7. [Key Troubleshooting Points & FAQs](#7-key-troubleshooting-points--faqs)

---

## 1. Prerequisites & Initial Setup

### Requirements
- **Node.js**: v20 or v22 installed (`node --version`)
- **Git**: Installed and configured
- **AI Coding Assistant**: Antigravity, Cursor, or Claude Code

### Step 1.1: Clone the Workshop Repository
```bash
git clone https://github.com/Danzo2/langfuse-workshop.git
cd langfuse-workshop
npm install
```

### Step 1.2: Install the Langfuse CLI & Skill

#### Option A: Copy-Paste Prompt for your AI Coding Assistant
> "Please install the langfuse skill from https://github.com/langfuse/skills/tree/main/skills/langfuse, and install the Langfuse CLI with npm install -g langfuse-cli."

#### Option B: Terminal Commands
```bash
# Install Langfuse CLI globally
npm install -g --force langfuse-cli

# Install Langfuse Skill into your workspace
npx -y skills add langfuse/skills --skill "langfuse" -y
```

> [!IMPORTANT]
> **Prevent Git from wiping your installed skills across checkouts:**  
> When switching checkpoint tags later in the workshop, untracked directories like `.agents/` can get lost if not excluded. Run this once:
> ```bash
> printf "\n.agents/\nskills-lock.json\n" >> .git/info/exclude
> ```

---

## 2. Langfuse Project Setup

1. Open your browser and navigate to our organization's Langfuse US instance:
   👉 **[https://us.cloud.langfuse.com](https://us.cloud.langfuse.com)**
2. In the organization dropdown, click **New Project**.
3. **Project Name**: Set to:
   ```text
   [your name] langfuse workshop
   ```
   *(Example: `Jane Doe langfuse workshop`)*
4. Once created, navigate to **Settings → API Keys** in the left sidebar.
5. Click **Create new API keys** and copy:
   - **Public Key** (`pk-lf-...`)
   - **Secret Key** (`sk-lf-...`)

---

## 3. Environment Configuration (`.env`)

Create a `.env` file in the root of your workspace:

```bash
cp .env.example .env
```

Open `.env` and fill in your keys. The corporate Azure endpoint and deployment name are pre-filled below:

```bash
# Azure OpenAI Configuration (Arterial Corporate Setup)
AZURE_OPENAI_API_KEY=your-azure-openai-api-key-here
AZURE_OPENAI_ENDPOINT=https://openai-arterial.openai.azure.com/
AZURE_OPENAI_DEPLOYMENT=gpt-5.1

# Standard OpenAI (Leave empty)
OPENAI_API_KEY=
OPENAI_MODEL=gpt-5.1

# Langfuse Configuration
LANGFUSE_PUBLIC_KEY=pk-lf-your-public-key-here
LANGFUSE_SECRET_KEY=sk-lf-your-secret-key-here
LANGFUSE_BASE_URL=https://us.cloud.langfuse.com
LANGFUSE_PROMPT_NAME=dad-it-support-agent
LANGFUSE_PROMPT_LABEL=production

# Workshop Dataset
DATASET_NAME=dad-it-support-workshop
```

---

## 4. Setting Up the Azure LLM Connection in Langfuse

In **Module 04 (Monitoring)**, Langfuse runs LLM-as-a-judge evaluators directly from the cloud. You must connect Langfuse to our Azure OpenAI endpoint.

1. In Langfuse, navigate to **Settings → LLM Connections**.
2. Click **Add new LLM Connection**.
3. Fill in the modal fields **exactly** as follows:

| Field | Value to Enter | Notes |
| :--- | :--- | :--- |
| **LLM adapter** | `azure` | Select from dropdown |
| **Provider name** | `azure-openai` | Unique label inside Langfuse |
| **API Key** | Your Azure OpenAI API key | Same key as in your `.env` |
| **API Base URL** | `https://openai-arterial.openai.azure.com/openai/deployments` | ⚠️ **Must include `/openai/deployments` at the end!** Leaving this off causes 404 errors. |
| **Custom models** | `gpt-5.1` | Type `gpt-5.1` and press **Enter** to add the tag |

4. Click **Create connection**.

---

## 5. Git & Branch Management Gotchas

The workshop uses Git tags (`checkpoint/00-setup` through `checkpoint/08-wrap-up`) to track milestones. Here is what you need to know:

* **Detached HEAD**: Checking out a tag puts you in "detached HEAD" state. This is normal.
* **Shared Commits**: Checkpoints `00`, `01`, and `02` share the exact same commit hash. Git status will always display `checkpoint/00-setup`. To verify which tags point to your commit, run:
  ```bash
  git tag --points-at HEAD
  ```
* **Saving your work before switching**: If Git prevents you from checking out a new checkpoint due to uncommitted changes, save your work to a local branch:
  ```bash
  git add .
  git commit -m "Save my progress"
  git branch my-progress-backup HEAD
  git checkout checkpoint/<next-step>
  ```

---

## 6. Module-by-Module Guide & AI Prompts

### Module 00: Setup & Verification

**Goal:** Confirm local server boots and connects to Azure OpenAI & Langfuse.

```bash
git checkout checkpoint/00-setup
npm run dev
```

Test the health check in a new terminal:
```bash
curl -s http://127.0.0.1:8787/api/health
```
**Expected response:**
```json
{"ok":true,"provider":"azure-openai","tracingConfigured":true}
```

---

### Module 01: Base App

**Goal:** Understand the untraced Dad IT Support Agent.

```bash
git checkout checkpoint/01-base-app
```
Open `http://127.0.0.1:3333` in your browser. Ask a question like *"How do I turn on Bluetooth?"*. The agent answers using two local tools (`get_support_context` and `search_help_library`), but no traces appear in Langfuse yet.

---

### Module 02: Tracing (Azure Adaptation)

**Goal:** Wrap the agent and tool calls so that every turn produces a nested Langfuse trace.

```bash
git checkout checkpoint/02-tracing
```

#### ⚠️ Critical Azure OpenAI Gotcha:
The upstream tutorial text tells you to write:
```ts
const openai = observeOpenAI(new OpenAI({ apiKey: env.openaiApiKey }));
```
**Do NOT do this.** In Azure OpenAI, `env.openaiApiKey` is blank. You must wrap the repository's `createOpenAIClient()` factory instead!

#### AI Coding Assistant Prompt:
> "Please implement Step 1, Step 2, and Step 3 from docs/learner/02-tracing.md, but ensure support-agent.ts uses observeOpenAI(createOpenAIClient()) rather than new OpenAI(...) so Azure OpenAI continues to work."

#### Manual Implementation Reference:

1. **In `src/server/index.ts`:**
   Start the Langfuse OpenTelemetry SDK near the top:
   ```ts
   import { NodeSDK } from "@opentelemetry/sdk-node";
   import { LangfuseSpanProcessor } from "@langfuse/otel";

   const langfuseSpanProcessor = new LangfuseSpanProcessor();
   const sdk = new NodeSDK({ spanProcessors: [langfuseSpanProcessor] });
   sdk.start();
   ```
   At the bottom, update `shutdown()` to flush traces:
   ```ts
   async function shutdown() {
     server.close();
     await langfuseSpanProcessor.forceFlush();
     await sdk.shutdown();
   }
   ```

2. **In `src/server/support-agent.ts`:**
   Add imports:
   ```ts
   import { observeOpenAI } from "@langfuse/openai";
   import { observe } from "@langfuse/tracing";
   ```
   Rename the function to `runSupportConversationInner`:
   ```ts
   async function runSupportConversationInner(request: ChatRequest): Promise<ChatResponse> {
     const context = getSupportContext();
     // Wrap createOpenAIClient for Azure support:
     const openai = observeOpenAI(createOpenAIClient());
     // ... rest of function body unchanged ...
   }
   ```
   Export the wrapped agent at the bottom of the file:
   ```ts
   export const runSupportConversation = observe(runSupportConversationInner, {
     name: "dad-it-support-chat-turn",
     asType: "agent"
   });
   ```

3. **In `src/server/tools.ts`:**
   Wrap the two local tools with `observe`:
   ```ts
   import { observe } from "@langfuse/tracing";

   const getSupportContextTool = observe(
     async () => {
       const context = getSupportContext();
       return { ok: true, context: { ... } };
     },
     { name: "get_support_context", asType: "tool" }
   );

   const searchHelpLibraryTool = observe(
     async (input: { question: string }) => {
       const guides = searchGuides(input.question);
       return { ok: true, results: guides.map(...) };
     },
     { name: "search_help_library", asType: "tool" }
   );

   export async function executeTool(name: string, input: Record<string, unknown>): Promise<ToolResult> {
     switch (name) {
       case "get_support_context": return getSupportContextTool();
       case "search_help_library": return searchHelpLibraryTool({ question: String(input.question ?? "") });
       default: return { ok: false, error: `Unsupported tool: ${name}` };
     }
   }
   ```

---

### Module 03: Prompt Management

**Goal:** Move `SYSTEM_PROMPT` into Langfuse so it is versioned, editable in the UI, and fetched dynamically at request time.

```bash
git checkout checkpoint/03-prompt-management
```

#### Step 3.1: Publish the Prompt to Langfuse
Run the publishing script to upload `SYSTEM_PROMPT` to your Langfuse project:
```bash
npm run prompt:publish
```
*(Verify in Langfuse under **Prompts → `dad-it-support-agent`** that Version 1 has the `production` label).*

#### Step 3.2: Wire the Dynamic Prompt in Code

#### ⚠️ Critical Gotcha:
Do **not** call `await getPrompt()` at the module/top-level scope. It must be called **inside `runSupportConversationInner`** so that updates in Langfuse are fetched dynamically at request time without needing a server restart!

#### AI Coding Assistant Prompt:
> "Please implement Step 2 of docs/learner/03-prompt-management.md. Make sure getPrompt() is called inside runSupportConversationInner at request time, and keep observeOpenAI(createOpenAIClient(), langfusePrompt ? { langfusePrompt } : undefined) for Azure OpenAI."

#### Manual Code Reference in `src/server/support-agent.ts`:
```ts
import { LangfuseClient } from "@langfuse/client";

const langfuse = new LangfuseClient();

async function getPrompt() {
  try {
    return await langfuse.prompt.get(env.langfusePromptName);
  } catch {
    return null;
  }
}

async function runSupportConversationInner(request: ChatRequest): Promise<ChatResponse> {
  const context = getSupportContext();
  // Fetch at request time:
  const langfusePrompt = await getPrompt();
  const systemPrompt = langfusePrompt?.prompt ?? SYSTEM_PROMPT;

  return propagateAttributes(
    {
      userId: request.userId ?? `workshop-${context.id}`,
      sessionId: request.sessionId,
      traceName: "dad-it-support-chat-turn",
      tags: ["langfuse-workshop", "dad-it-support"]
    },
    async () => {
      const openai = observeOpenAI(
        createOpenAIClient(),
        langfusePrompt ? { langfusePrompt } : undefined
      );

      const transcript: OpenAI.Chat.Completions.ChatCompletionMessageParam[] = [
        { role: "system", content: systemPrompt },
        ...toOpenAIMessages(request.messages)
      ];
      // ... loop continues as normal ...
    }
  );
}
```

---

### Module 04: Monitoring & Evaluators

**Goal:** Detect user disagreement and all-caps frustration in production traces.

```bash
git checkout checkpoint/04-monitoring
```
*(No code changes needed — this module is configured in the Langfuse UI).*

1. **Confirm LLM Connection**: Ensure you configured the Azure LLM Connection in [Section 4](#4-setting-up-the-azure-llm-connection-in-langfuse).
2. **Evaluator 1: Detect User Disagreement (LLM Judge)**:
   - Go to **Evaluators → New Evaluator → Template Gallery → Detect User Disagreement**.
   - Target the root agent observation `dad-it-support-chat-turn`.
   - Variable Mapping:
     - `{{conversation_history}}` $\rightarrow$ `Input` *(All messages)*
     - `{{last_user_message}}` $\rightarrow$ `Input` *(Last message)*
   - Select your Azure model (`gpt-5.1`) and execute.
3. **Evaluator 2: Detect User Frustration (ALL CAPS)**:
   - Go to **Evaluators → New Evaluator → Detect User Frustration (ALL CAPS)**.
   - Target `dad-it-support-chat-turn` and execute.
4. **Seed Sample Traffic**:
   Replay realistic traffic into Langfuse:
   ```bash
   npm run langfuse:seed:otel:no-scores
   ```
   > ⚠️ **Notice**: This command is **not idempotent**. Run it only once.

---

### Module 05: Dataset Seeding

**Goal:** Upload the 14 curated evaluation test cases into Langfuse.

```bash
git checkout checkpoint/05-dataset
```

Seed the dataset into Langfuse:
```bash
npm run dataset:seed
```
Verify under **Datasets → `dad-it-support-workshop` → Items** that 14 items appear.

---

### Module 06: Running Experiments

**Goal:** Run the full dataset against the agent, scoring responses with `keyword_overlap` (deterministic) and `correctness` (LLM-as-a-judge).

```bash
git checkout checkpoint/06-experiments
```

Run the experiment:
```bash
npm run dataset:run
```

**Console Output:**
```text
──────────────────────────────────────────────────
🧪 Experiment: Dad IT Support Agent experiment
📋 Run name: dad-it-support-...
14 items
Evaluations:
  • keyword_overlap
  • correctness

Average Scores:
  • keyword_overlap: ~0.774
  • correctness: ~0.714
```
View the scored run under **Datasets → `dad-it-support-workshop` → Runs**.

---

### Module 07: Evaluating a Prompt Change

**Goal:** Improve prompt rules, rerun the experiment, and compare scores side by side.

```bash
git checkout checkpoint/07-evaluation
```

#### Step 7.1: Update the Prompt
Open `src/server/support-agent.ts` and add an explicit out-of-scope refusal rule inside `SYSTEM_PROMPT`:
```text
- If a request is outside iPhone help (taxes, travel booking, anything that needs live account access), say so directly in one short sentence — what you can't help with and what you can — then stop. Do not attempt to answer the request.
```

Publish the updated prompt (Version 2) to Langfuse:
```bash
npm run prompt:publish
```
*(Or create a new version directly in the Langfuse UI and promote it to `production`).*

#### Step 7.2: Rerun the Dataset
```bash
npm run dataset:run
```

#### Step 7.3: Compare Runs in Langfuse
1. Go to **Datasets → `dad-it-support-workshop` → Experiments**.
2. Select your baseline run and click **Compare** with your latest run.

---

## 7. Key Troubleshooting Points & FAQs

### Q: Why did my experiment average score stay the same (`0.71 vs 0.71`) in Module 07?
**Look beneath the header in Langfuse:** You will see **`↗1 ↘1`**.
- `↗1`: 1 item improved (e.g. `dad-005` earbuds pairing went from 0 to 1).
- `↘1`: 1 item regressed (e.g. `dad-010` Wi-Fi password went from 1 to 0 because the model explained how to view saved passwords rather than offering reconnection steps).
- In a 14-item dataset, $10/14 = 0.714$. When $+1$ and $-1$ balance out, the top-level average looks identical, but individual item behaviors shifted.

### Q: Why does `git status` say `HEAD detached at checkpoint/00-setup` after checking out `02-tracing`?
Checkpoints `00`, `01`, and `02` share the exact same starting commit SHA. Git simply displays the first matching tag alphabetically. You are on the right commit.

### Q: Why did the LLM Connection fail with 404 in Langfuse?
Check your **API Base URL**. Azure endpoints require `/openai/deployments` at the end:
- ❌ `https://openai-arterial.openai.azure.com/`
- ✅ `https://openai-arterial.openai.azure.com/openai/deployments`

### Q: Why does the IDE show `'observe' is declared but its value is never read (TS6133)`?
In Module 02 Step 2, importing `observe` without exporting the wrapped function at the bottom triggers an unused-variable warning. Make sure you export the wrapped function:
```ts
export const runSupportConversation = observe(runSupportConversationInner, {
  name: "dad-it-support-chat-turn",
  asType: "agent"
});
```

---

*Happy Learning! For any questions or blockers, consult your workshop facilitator.*
