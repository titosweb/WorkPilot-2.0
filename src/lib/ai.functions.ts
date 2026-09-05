import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

import { MODULE_PROMPTS, type ModulePromptId } from "./prompts";

const MODEL = "google/gemini-3.7-flash";
const GATEWAY_URL = "https://ai.gateway.lovable.dev/v1/chat/completions";

const schema = z.object({
  moduleId: z.enum(["email", "meeting-notes", "task-planner", "research", "chat"]),
  fields: z.record(z.string(), z.string().max(20000)),
  history: z
    .array(
      z.object({
        role: z.enum(["user", "assistant"]),
        content: z.string().max(20000),
      }),
    )
    .max(20)
    .optional(),
});

function renderUserMessage(fields: Record<string, string>): string {
  const lines = Object.entries(fields)
    .filter(([, value]) => value.trim().length > 0)
    .map(([key, value]) => `${key}:\n${value.trim()}`);
  return lines.join("\n\n");
}

export const generateModuleOutput = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => schema.parse(input))
  .handler(async ({ data }) => {
    const apiKey = process.env["LOVABLE_API_KEY"];
    if (!apiKey) {
      throw new Error("The AI service is not configured for this workspace.");
    }

    const prompt = MODULE_PROMPTS[data.moduleId as ModulePromptId];
    const userMessage = renderUserMessage(data.fields);
    if (!userMessage) {
      throw new Error("Add some input first — there is nothing to work from yet.");
    }

    const messages = [
      { role: "system" as const, content: prompt.systemPrompt },
      ...(data.history ?? []).map((m) => ({ role: m.role, content: m.content })),
      { role: "user" as const, content: userMessage },
    ];

    const response = await fetch(GATEWAY_URL, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ model: MODEL, messages, stream: false }),
    });

    if (response.status === 429) {
      throw new Error("Rate limit reached. Wait a moment and try again.");
    }
    if (response.status === 402) {
      throw new Error("The AI workspace credits are exhausted. Top them up to continue.");
    }
    if (!response.ok) {
      const detail = await response.text();
      console.error("AI gateway error", response.status, detail);
      throw new Error("The assistant could not be reached. Please try again.");
    }

    const payload = (await response.json()) as {
      choices?: { message?: { content?: string } }[];
    };
    const text = payload.choices?.[0]?.message?.content?.trim();
    if (!text) {
      throw new Error("The assistant returned an empty response. Please try again.");
    }

    return {
      text,
      model: MODEL,
      promptVersion: prompt.version,
      generatedAt: new Date().toISOString(),
    };
  });
