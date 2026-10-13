---
title: "Workshop: Setup"
description: "Set up the workshop app with OpenAI and Langfuse credentials, then verify the local Dad IT Support Agent."
---

# 00 Setup

## Goal

Have the workshop app running locally with both OpenAI and Langfuse credentials in place. From here you can skim `01-base-app`, then start building in `02-tracing`.

> ⚠️ Use **Langfuse Cloud** so you have the latest features this workshop describes. Self-hosted instances may be on an older version and will not match the lessons.

## Prerequisites

**Node.js `^20.19.0 || >=22.12.0`** — check with `node -v` and upgrade before installing if you are below it (`nvm install 22`, or the equivalent for `asdf`, `fnm`, or `volta`).

An older version fails in a way that is easy to misread. Vite's platform-specific binary is an optional dependency, so npm skips it **without reporting an error**: `npm install` looks like it succeeded, and the problem only appears later when `npm run dev` cannot start Vite. If you upgrade Node after installing, re-run `npm ci` so the skipped binary is fetched.

## Starting point

Clone the workshop repository, enter it, then check out the setup checkpoint for this chapter:

```bash
git clone https://github.com/Danzo2/langfuse-workshop.git
cd langfuse-workshop
git checkout checkpoint/00-setup
```

This checkpoint intentionally contains the same untraced base app as `checkpoint/01-base-app`. Use it to confirm that your API keys, dependencies, and local ports work before switching to the build chapters. The Langfuse keys are configured now, but traces start only after you add instrumentation in `02-tracing`.

## Step 1 — Get the API keys

1. **Azure OpenAI (Arterial Corporate Setup)** — Get your Azure OpenAI API key from the team. The shared endpoint is `https://openai-arterial.openai.azure.com/` and the deployment is `gpt-5.1`. You will paste your API key into `.env` in Step 3.
2. **Langfuse** — Log in to Arterial's Langfuse US instance at **[https://us.cloud.langfuse.com](https://us.cloud.langfuse.com)**.
   - Click the organization dropdown and choose **New Project**.
   - Name the project: `[your name] langfuse workshop` (for example, `Jane Doe langfuse workshop`).
   - Copy the public + secret keys from **Settings → API Keys**. You will paste those into `.env` in Step 3.

## Step 2 — Install the Langfuse skill and CLI

Later modules drive Langfuse through a coding agent, which needs the `langfuse` skill and the Langfuse CLI.

Paste this into your coding agent (Antigravity, Cursor, etc.) to install both:

> "Please install the `langfuse` skill from `https://github.com/langfuse/skills/tree/main/skills/langfuse`, and install the Langfuse CLI with `npm install -g langfuse-cli`."

Prefer to install them yourself:

```bash
# Langfuse CLI
npm install -g --force langfuse-cli

# Langfuse Skill:
npx -y skills add langfuse/skills --skill "langfuse" -y
```

> [!IMPORTANT]
> **Protect `.agents/` across checkpoint checkouts:**
> Add the skill directory to your local git exclusions so Git doesn't wipe it when switching checkpoint tags:
> ```bash
> printf "\n.agents/\nskills-lock.json\n" >> .git/info/exclude
> ```

## Step 3 — Configure `.env`

```bash
cp .env.example .env
```

Fill in your Azure OpenAI API key and Langfuse keys in `.env`:

```bash
# Azure OpenAI Configuration (Arterial Corporate Setup)
AZURE_OPENAI_API_KEY="your-azure-api-key"
AZURE_OPENAI_ENDPOINT="https://openai-arterial.openai.azure.com/"
AZURE_OPENAI_DEPLOYMENT="gpt-5.1"
AZURE_OPENAI_API_VERSION="2024-10-21"

# Standard OpenAI (Optional fallback, leave blank if using Azure)
OPENAI_API_KEY=
OPENAI_MODEL=gpt-5.1

# Langfuse Configuration
LANGFUSE_PUBLIC_KEY=pk-lf-...
LANGFUSE_SECRET_KEY=sk-lf-...
LANGFUSE_BASE_URL=https://us.cloud.langfuse.com
LANGFUSE_PROMPT_NAME=dad-it-support-agent
LANGFUSE_PROMPT_LABEL=production

# Workshop Dataset
DATASET_NAME=dad-it-support-workshop
```

Leave the rest of the defaults as they are.

The workshop app always loads this repository's `.env` file for the server and helper scripts. If you have `LANGFUSE_*`, `AZURE_OPENAI_*`, `OPENAI_*`, or `DATASET_NAME` values exported in your shell from another project, they will not override this file. To change the workshop configuration, edit `.env`.

Keep these values in your local `.env` only. Do not paste real API keys into shared workshop notes, transcripts, screenshots, or chat messages.

## Step 4 — Install and run

```bash
npm install
npm run dev
```

Leave `npm run dev` running while you edit. Client changes hot-reload via Vite; server code and `.env` changes restart the API automatically. You do not need to stop and start the app for normal workshop edits.

Open [http://127.0.0.1:3333](http://127.0.0.1:3333) to access the Dad IT Support Agent UI.

## Step 5 — Confirm what you see

You should see the **Dad IT Support Agent** chat:

- the Specs mascot up top
- a greeting from Specs
- suggestion chips below the greeting
- the iPhone panel on the right ("Dad" + iPhone 15 details)

![How Specs handles a ticket — one agent, two tools, one model, each hop an observation in the trace.](../images/specs_illustration.png)


## How to verify you are done

- `npm run dev` is running and the UI loads at `http://127.0.0.1:3333`.
- The browser shows the Specs greeting, not an error.
- Sending one of the suggestion chips returns a real iPhone answer from the model.

## End state

Your environment is ready. To build the workshop step-by-step, skim `01-base-app` if you want the app tour, then check out `checkpoint/02-tracing` for the first code changes.
