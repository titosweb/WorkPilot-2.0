import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { Bot, Copy, Eraser, RefreshCw, Send, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { PageHeader } from "@/components/page-header";
import { PromptInspector } from "@/components/prompt-inspector";
import { AiGeneratedBadge, ResponsibleAiNotice } from "@/components/ai-notice";
import { ErrorState } from "@/components/state-blocks";
import { demoChatSeed } from "@/lib/demo-data";
import { generate, RunError } from "@/lib/ai-runtime";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/chat")({
  head: () => ({
    meta: [
      { title: "AI Workplace Chat — WorkPilot AI" },
      {
        name: "description",
        content:
          "A general workplace assistant that answers briefly, flags assumptions and hands off to the specialist WorkPilot modules.",
      },
      { property: "og:title", content: "AI Workplace Chat — WorkPilot AI" },
      {
        property: "og:description",
        content: "A workplace assistant that flags assumptions and hands off to specialist modules.",
      },
    ],
  }),
  component: ChatPage,
});

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
}

const SUGGESTIONS = [
  "Help me reply to a client asking for a discount",
  "Summarise what we decided in today's platform sync",
  "Plan a two-week accessibility cleanup",
  "What evidence do I need before proposing a price change?",
];

function ChatPage() {
  const [messages, setMessages] = useState<Message[]>(demoChatSeed);
  const [input, setInput] = useState("");
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const lastUser = useRef<string>("");
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ block: "end", behavior: "smooth" });
  }, [messages, pending]);

  async function send(text: string) {
    const trimmed = text.trim();
    if (!trimmed || pending) return;
    lastUser.current = trimmed;
    setMessages((prev) => [
      ...prev,
      { id: `u-${Date.now()}`, role: "user", content: trimmed },
    ]);
    setInput("");
    setError(null);
    setPending(true);
    try {
      const history = messages.slice(-10).map((m) => ({ role: m.role, content: m.content }));
      const result = await generate("chat", { message: trimmed }, { history });
      setMessages((prev) => [
        ...prev,
        { id: `a-${Date.now()}`, role: "assistant", content: result.text },
      ]);
    } catch (e) {
      setError(
        e instanceof RunError ? e.message : "The assistant didn't respond. Please try again.",
      );
    } finally {
      setPending(false);
    }
  }

  function regenerate() {
    if (!lastUser.current) return;
    setMessages((prev) => {
      const idx = [...prev].reverse().findIndex((m) => m.role === "assistant");
      if (idx === -1) return prev;
      return prev.slice(0, prev.length - 1 - idx);
    });
    void send(lastUser.current);
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="AI Workplace Chat"
        description="The general entry point. Ask anything work-related — the assistant answers briefly, marks assumptions and points you to the specialist module when one fits better."
        icon={Bot}
        badges={
          <Badge variant="outline" className="border-ai/40 bg-ai-surface text-ai-foreground">
            Live AI · human review required
          </Badge>
        }
      />

      <ResponsibleAiNotice />

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_20rem]">
        <Card className="flex min-h-[32rem] flex-col shadow-card">
          <CardHeader className="border-b border-border pb-4">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div>
                <CardTitle className="text-base">Conversation</CardTitle>
                <CardDescription>Not saved — refreshing clears this thread</CardDescription>
              </div>
              <div className="flex gap-2">
                <Button variant="ghost" size="sm" onClick={regenerate} disabled={pending || !lastUser.current}>
                  <RefreshCw aria-hidden="true" className="size-4" />
                  Regenerate
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setMessages(demoChatSeed);
                    setError(null);
                    lastUser.current = "";
                  }}
                >
                  <Eraser aria-hidden="true" className="size-4" />
                  Clear
                </Button>
              </div>
            </div>
          </CardHeader>

          <CardContent className="flex-1 space-y-4 overflow-y-auto py-5" role="log" aria-live="polite">
            {messages.map((m) => (
              <div
                key={m.id}
                className={cn("flex gap-3", m.role === "user" ? "justify-end" : "justify-start")}
              >
                {m.role === "assistant" ? (
                  <span className="mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-lg bg-accent text-accent-foreground">
                    <Bot aria-hidden="true" className="size-4" />
                  </span>
                ) : null}
                <div
                  className={cn(
                    "max-w-[85%] space-y-2 rounded-xl px-4 py-3 text-sm leading-relaxed",
                    m.role === "user"
                      ? "bg-primary text-primary-foreground"
                      : "border border-ai/30 bg-card",
                  )}
                >
                  {m.role === "assistant" ? <AiGeneratedBadge /> : null}
                  <p className="whitespace-pre-wrap">{m.content}</p>
                  {m.role === "assistant" ? (
                    <Button
                      variant="ghost"
                      size="sm"
                      className="-ml-2 h-7 text-xs"
                      onClick={() => {
                        void navigator.clipboard
                          .writeText(m.content)
                          .then(() => toast.success("Reply copied"))
                          .catch(() => toast.error("Couldn't access the clipboard"));
                      }}
                    >
                      <Copy aria-hidden="true" className="size-3.5" />
                      Copy
                    </Button>
                  ) : null}
                </div>
                {m.role === "user" ? (
                  <span className="mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-lg bg-secondary text-secondary-foreground">
                    <User aria-hidden="true" className="size-4" />
                  </span>
                ) : null}
              </div>
            ))}

            {pending ? (
              <div className="flex items-center gap-2 text-sm text-muted-foreground" role="status">
                <span className="flex gap-1">
                  <span className="size-1.5 animate-bounce rounded-full bg-muted-foreground" />
                  <span className="size-1.5 animate-bounce rounded-full bg-muted-foreground [animation-delay:120ms]" />
                  <span className="size-1.5 animate-bounce rounded-full bg-muted-foreground [animation-delay:240ms]" />
                </span>
                WorkPilot is thinking…
              </div>
            ) : null}

            {error ? <ErrorState message={error} onRetry={regenerate} /> : null}
            <div ref={endRef} />
          </CardContent>

          <div className="border-t border-border p-4">
            <form
              className="space-y-2"
              onSubmit={(e) => {
                e.preventDefault();
                void send(input);
              }}
            >
              <label htmlFor="chat-input" className="sr-only">
                Message WorkPilot AI
              </label>
              <Textarea
                id="chat-input"
                rows={3}
                value={input}
                placeholder="Ask about your work… (Enter to send, Shift+Enter for a new line)"
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    void send(input);
                  }
                }}
              />
              <div className="flex items-center justify-between gap-3">
                <p className="text-xs text-muted-foreground">
                  Replies are AI generated. Never share credentials or personal data.
                </p>
                <Button type="submit" disabled={pending || !input.trim()}>
                  <Send aria-hidden="true" className="size-4" />
                  Send
                </Button>
              </div>
            </form>
          </div>
        </Card>

        <div className="space-y-6">
          <Card className="shadow-card">
            <CardHeader>
              <CardTitle className="text-base">Try asking</CardTitle>
              <CardDescription>Each of these routes to a specialist module</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              {SUGGESTIONS.map((s) => (
                <Button
                  key={s}
                  variant="outline"
                  className="h-auto w-full justify-start py-2.5 text-left text-[13px] leading-snug whitespace-normal"
                  onClick={() => void send(s)}
                  disabled={pending}
                >
                  {s}
                </Button>
              ))}
            </CardContent>
          </Card>
          <PromptInspector moduleId="chat" />
        </div>
      </div>
    </div>
  );
}
