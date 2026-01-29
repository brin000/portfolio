"use client";

import { Button } from "@/components/ui/button";
import { Github, ArrowUpRight } from "lucide-react";
import Container from "@/components/container";
import { cn } from "@/lib/utils";

export default function Home() {
  return (
    <Container as="main" className="relative">
      {/* Soft radial gradient for depth — avoids flat background */}
      <div
        className="pointer-events-none absolute inset-0 -top-24 h-[80vh] max-h-[640px] opacity-[0.4] dark:opacity-[0.12]"
        aria-hidden
        style={{
          background:
            "radial-gradient(ellipse 80% 70% at 50% -20%, var(--primary) / 0.15, transparent)",
        }}
      />

      <div className="relative flex flex-col gap-10 md:gap-14">
        {/* Hero: display font + gradient accent; left border on desktop for editorial asymmetry */}
        <section className="flex flex-col gap-6 border-l-0 pl-0 md:border-l-2 md:border-l-foreground/10 md:pl-8 md:dark:border-l-foreground/15">
          <h1
            className={cn(
              "home-hero-reveal home-hero-reveal-1 font-(--font-display) text-5xl font-semibold tracking-tight text-foreground md:text-7xl md:leading-[1.1]",
              "bg-linear-to-br from-foreground via-foreground to-muted-foreground bg-clip-text text-transparent dark:from-foreground dark:to-muted-foreground"
            )}
          >
          LAKE
          </h1>
          <p className="home-hero-reveal home-hero-reveal-2 text-base leading-7 text-muted-foreground md:text-lg md:leading-8">
            专注于现代 Web
            前端开发，追求高质量代码、卓越性能与优质用户体验。持续学习和探索前沿技术，善于解决复杂问题，注重前后端协作。
          </p>
          <p className="home-hero-reveal home-hero-reveal-3 text-base leading-7 text-muted-foreground/90 md:text-lg md:leading-8">
            不断优化业务流程和项目结构，期望用简洁、易维护且高效的代码改善产品体验。关注可访问性与响应式设计，熟悉多端适配和性能调优。欢迎一起交流技术、分享经验、共建开放友好的开发社区。
          </p>
        </section>

        {/* Links: clear hierarchy + hover micro-interaction */}
        <section className="flex flex-col gap-4">
          <h2 className="home-hero-reveal home-hero-reveal-4 text-xs font-medium uppercase tracking-widest text-muted-foreground/80">
            Links
          </h2>
          <div className="home-hero-reveal home-hero-reveal-5 flex flex-wrap gap-3">
            <Button
              variant="outline"
              size="default"
              asChild
              className="group border-border/80 bg-background/80 shadow-sm transition-all duration-200 hover:border-foreground/20 hover:shadow-md dark:bg-card/50"
            >
              <a
                href="https://github.com/brin000"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2"
              >
                <Github className="size-4 transition-transform duration-200 group-hover:scale-110" />
                GitHub
                <ArrowUpRight className="size-4 opacity-60 transition-all duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:opacity-100" />
              </a>
            </Button>
          </div>
        </section>
      </div>
    </Container>
  );
}
