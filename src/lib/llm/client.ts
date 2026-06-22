import Anthropic from "@anthropic-ai/sdk";
import { readFileSync } from "fs";
import { join } from "path";

let client: Anthropic | null = null;

function getClient(): Anthropic {
  if (!client) {
    const apiKey = process.env.ANTHROPIC_API_KEY;
    if (!apiKey) throw new Error("ANTHROPIC_API_KEY is not set");
    client = new Anthropic({ apiKey });
  }
  return client;
}

export function loadPrompt(
  name: string,
  variables: Record<string, string>
): string {
  const promptPath = join(process.cwd(), "prompts", `${name}.txt`);
  let template = readFileSync(promptPath, "utf-8");
  for (const [key, value] of Object.entries(variables)) {
    template = template.replaceAll(`{{${key}}}`, value);
  }
  return template;
}

export async function callClaude<T>(params: {
  systemPrompt: string;
  userMessage: string;
  maxTokens?: number;
}): Promise<T> {
  const anthropic = getClient();

  const response = await anthropic.messages.create({
    model: "claude-sonnet-4-6",
    max_tokens: params.maxTokens ?? 4096,
    system: params.systemPrompt,
    messages: [{ role: "user", content: params.userMessage }],
  });

  const textBlock = response.content.find((block) => block.type === "text");
  if (!textBlock || textBlock.type !== "text") {
    throw new Error("No text response from Claude");
  }

  const jsonMatch = textBlock.text.match(/\[[\s\S]*\]|\{[\s\S]*\}/);
  if (!jsonMatch) {
    throw new Error("No JSON found in Claude response");
  }

  return JSON.parse(jsonMatch[0]) as T;
}
