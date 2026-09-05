/**
 * Live AI runtime.
 *
 * Every result here comes from a real model call, executed server-side through
 * the Lovable AI Gateway (see `ai.functions.ts`). Each module sends its own
 * dedicated system prompt from `prompts.ts`, so behaviour and guardrails stay
 * per-module. The UI still labels output as AI generated and requires review.
 */

import type { ModulePromptId } from "./prompts";
import { generateModuleOutput } from "./ai.functions";

export type RunState = "idle" | "loading" | "success" | "error";

export interface ChatTurn {
  role: "user" | "assistant";
  content: string;
}

export interface RunResult {
  moduleId: ModulePromptId;
  text: string;
  promptVersion: string;
  model: string;
  generatedAt: string;
  latencyMs: number;
}

export class RunError extends Error {
  constructor(
    message: string,
    readonly recoverable = true,
  ) {
    super(message);
    this.name = "RunError";
  }
}

export type RunPayload = Record<string, string>;

export async function generate(
  moduleId: ModulePromptId,
  payload: RunPayload,
  options?: { signal?: AbortSignal; history?: ChatTurn[] },
): Promise<RunResult> {
  const started = Date.now();
  const joined = Object.values(payload).join(" ").trim();

  if (!joined) {
    throw new RunError("Add some input first — there is nothing to work from yet.");
  }

  if (options?.signal?.aborted) {
    throw new RunError("Generation cancelled.", false);
  }

  try {
    const result = await generateModuleOutput({
      data: {
        moduleId,
        fields: payload,
        ...(options?.history?.length ? { history: options.history } : {}),
      },
      ...(options?.signal ? { signal: options.signal } : {}),
    });

    if (options?.signal?.aborted) {
      throw new RunError("Generation cancelled.", false);
    }

    return {
      moduleId,
      text: result.text,
      promptVersion: result.promptVersion,
      model: result.model,
      generatedAt: result.generatedAt,
      latencyMs: Date.now() - started,
    };
  } catch (error) {
    if (error instanceof RunError) throw error;
    if (options?.signal?.aborted || (error as Error)?.name === "AbortError") {
      throw new RunError("Generation cancelled.", false);
    }
    throw new RunError(
      error instanceof Error && error.message
        ? error.message
        : "The assistant could not be reached. Please try again.",
    );
  }
}
