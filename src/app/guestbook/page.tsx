"use client";

import { useState, useEffect, useCallback } from "react";
import Container from "@/components/container";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { Send, MessageCircle } from "lucide-react";
import { format } from "date-fns";

const STORAGE_KEY = "portfolio-guestbook-messages";

export interface GuestbookMessage {
  id: string;
  name: string;
  content: string;
  createdAt: string;
}

function loadMessages(): GuestbookMessage[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as GuestbookMessage[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function saveMessages(messages: GuestbookMessage[]) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(messages));
  } catch {
    // ignore
  }
}

export default function GuestbookPage() {
  const [messages, setMessages] = useState<GuestbookMessage[]>([]);
  const [name, setName] = useState("");
  const [content, setContent] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMessages(loadMessages());
    setMounted(true);
  }, []);

  const handleSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      const trimmed = content.trim();
      if (!trimmed || isSubmitting) return;
      setIsSubmitting(true);
      const newMessage: GuestbookMessage = {
        id: crypto.randomUUID(),
        name: name.trim() || "匿名",
        content: trimmed,
        createdAt: new Date().toISOString(),
      };
      const next = [newMessage, ...messages];
      setMessages(next);
      saveMessages(next);
      setContent("");
      setName("");
      setIsSubmitting(false);
    },
    [content, name, messages, isSubmitting]
  );

  return (
    <Container as="main" className="relative">
      {/* 柔和径向渐变，营造便签墙氛围 */}
      <div
        className="pointer-events-none absolute inset-0 -top-24 h-[70vh] max-h-[560px] opacity-[0.35] dark:opacity-[0.1]"
        aria-hidden
        style={{
          background:
            "radial-gradient(ellipse 85% 65% at 50% -15%, var(--primary) / 0.18, transparent)",
        }}
      />

      <div className="relative flex flex-col gap-12 md:gap-16">
        {/* Hero：留言板标题 + 副标题 */}
        <header className="flex flex-col gap-2 border-l-0 pl-0 md:border-l-2 md:border-l-foreground/10 md:pl-8 md:dark:border-l-foreground/15">
          <h1
            className={cn(
              "font-(--font-display) text-4xl font-semibold tracking-tight md:text-5xl",
              "bg-linear-to-br from-foreground via-foreground to-muted-foreground bg-clip-text text-transparent dark:from-foreground dark:to-muted-foreground"
            )}
          >
            留言板
          </h1>
          <p className="max-w-xl text-sm text-muted-foreground md:text-base">
            留下一句话，打个招呼或聊聊想法。
          </p>
        </header>

        {/* 发表留言表单 */}
        <section
          className={cn(
            "page-reveal flex flex-col gap-6 rounded-2xl border border-border/80 bg-card/60 p-6 shadow-sm backdrop-blur-sm md:p-8",
            "transition-all duration-300 hover:border-foreground/10 hover:shadow-md dark:bg-card/40"
          )}
          style={{ animationDelay: "0ms" }}
        >
          <h2 className="flex items-center gap-2 text-xs font-medium uppercase tracking-widest text-muted-foreground/80">
            <MessageCircle className="size-4" />
            写一条留言
          </h2>
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div className="grid gap-2">
              <Label htmlFor="guestbook-name" className="text-muted-foreground">
                昵称（选填）
              </Label>
              <Input
                id="guestbook-name"
                type="text"
                placeholder="如：小明"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="border-border/80 bg-background/60 transition-colors focus-visible:ring-2"
                maxLength={32}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="guestbook-content" className="text-muted-foreground">
                内容（必填）
              </Label>
              <Textarea
                id="guestbook-content"
                placeholder="想说点什么？"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                className="min-h-[120px] resize-y border-border/80 bg-background/60 transition-colors focus-visible:ring-2"
                required
                maxLength={500}
              />
              <p className="text-xs text-muted-foreground">
                {content.length}/500
              </p>
            </div>
            <Button
              type="submit"
              disabled={!content.trim() || isSubmitting}
              className="group mt-2 w-fit border-border/80 bg-foreground text-background shadow-sm transition-all duration-200 hover:bg-foreground/90 hover:shadow-md disabled:opacity-50"
            >
              <Send className="size-4 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              发送
            </Button>
          </form>
        </section>

        {/* 留言列表：便签式卡片 + 错峰出现 */}
        <section className="flex flex-col gap-4">
          <h2 className="text-xs font-medium uppercase tracking-widest text-muted-foreground/80">
            全部留言
          </h2>
          {!mounted ? (
            <p className="text-sm text-muted-foreground">加载中…</p>
          ) : messages.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-border/60 bg-muted/30 px-6 py-12 text-center">
              <p className="text-sm text-muted-foreground">
                还没有留言，来写第一条吧。
              </p>
            </div>
          ) : (
            <ul className="flex flex-col gap-4">
              {messages.map((msg, index) => (
                <li
                  key={msg.id}
                  className="page-reveal"
                  style={{ animationDelay: `${index * 60}ms` }}
                >
                  <article
                    className={cn(
                      "rounded-xl border border-border/80 bg-card/70 px-5 py-4 shadow-sm backdrop-blur-sm",
                      "border-l-4 border-l-primary/50 dark:border-l-primary/40",
                      "transition-all duration-200 hover:border-foreground/10 hover:shadow-md dark:bg-card/50"
                    )}
                  >
                    <header className="mb-2 flex flex-wrap items-baseline justify-between gap-2">
                      <span className="font-(--font-display) text-sm font-medium text-foreground">
                        {msg.name}
                      </span>
                      <time
                        dateTime={msg.createdAt}
                        className="text-xs text-muted-foreground"
                      >
                        {format(new Date(msg.createdAt), "yyyy/M/d HH:mm")}
                      </time>
                    </header>
                    <p className="whitespace-pre-wrap text-sm leading-relaxed text-muted-foreground">
                      {msg.content}
                    </p>
                  </article>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>
    </Container>
  );
}
