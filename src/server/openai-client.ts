import { AzureOpenAI, OpenAI } from "openai";
import { env } from "./env";

export function createOpenAIClient(): OpenAI {
  if (env.isAzure) {
    return new AzureOpenAI({
      apiKey: env.azureOpenaiApiKey,
      endpoint: env.azureOpenaiEndpoint,
      deployment: env.azureOpenaiDeployment,
      apiVersion: env.azureOpenaiApiVersion
    });
  }
  return new OpenAI({ apiKey: env.openaiApiKey });
}
