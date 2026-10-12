import "./load-env";

export const env = {
  port: Number(process.env.PORT ?? 8787),
  // OpenAI / Azure OpenAI
  openaiApiKey: process.env.OPENAI_API_KEY ?? "",
  openaiModel:
    process.env.OPENAI_MODEL ??
    process.env.AZURE_OPENAI_DEPLOYMENT ??
    "gpt-4.1-2025-04-14",
  azureOpenaiApiKey: process.env.AZURE_OPENAI_API_KEY ?? "",
  azureOpenaiEndpoint: process.env.AZURE_OPENAI_ENDPOINT ?? "",
  azureOpenaiDeployment:
    process.env.AZURE_OPENAI_DEPLOYMENT ??
    process.env.OPENAI_MODEL ??
    "gpt-4.1-2025-04-14",
  azureOpenaiApiVersion: process.env.AZURE_OPENAI_API_VERSION ?? "2024-10-21",
  isAzure: Boolean(
    process.env.AZURE_OPENAI_API_KEY && process.env.AZURE_OPENAI_ENDPOINT
  ),

  // Langfuse
  langfusePublicKey: process.env.LANGFUSE_PUBLIC_KEY ?? "",
  langfuseSecretKey: process.env.LANGFUSE_SECRET_KEY ?? "",
  langfuseBaseUrl: process.env.LANGFUSE_BASE_URL ?? "https://cloud.langfuse.com",
  langfusePromptName: process.env.LANGFUSE_PROMPT_NAME ?? "dad-it-support-agent",
  langfusePromptLabel: process.env.LANGFUSE_PROMPT_LABEL ?? "production",
  workshopPromptVariant: process.env.WORKSHOP_PROMPT_VARIANT ?? "default",
  datasetName: process.env.DATASET_NAME ?? "dad-it-support-workshop"
};

export function isLangfuseConfigured() {
  return Boolean(env.langfusePublicKey && env.langfuseSecretKey);
}

export function isOpenAIConfigured() {
  return Boolean(env.isAzure || env.openaiApiKey);
}
