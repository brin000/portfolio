"use client";

import { resume } from "@/lib/content/resume";
import Container from "@/components/container";
import Link from "next/link";

/**
 * ATS Safe 布局：单栏、语义化 HTML、联系信息纯文本无图标。
 * 简介版，无 shadcn 组件。
 */

export default function ResumePage() {
  const contactLine = resume.contact
    .map((item) => `${item.label}：${item.value}`)
    .join(" | ");

  return (
    <Container as="main" className="resume-page max-w-3xl print:py-8">
      <article className="flex flex-col gap-8 print:gap-6">
        {/* 打印按钮：置顶醒目，打印时隐藏 */}
        <p className="flex justify-end print:hidden">
          <button
            type="button"
            onClick={() => window.print()}
            className="rounded-md border border-border bg-background px-4 py-2 text-sm font-medium text-foreground shadow-sm hover:bg-muted/50"
          >
            打印 / 另存为 PDF
          </button>
        </p>

        <header>
          <h1 className="text-2xl font-semibold tracking-tight text-foreground md:text-3xl">
            {resume.name}
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">{resume.title}</p>
          <p className="mt-2 text-sm text-foreground" aria-label="联系方式">
            {contactLine}
          </p>
          <p className="mt-1 text-xs text-muted-foreground">
            {resume.meta.education}，工作年限：{resume.meta.yearsExp} 年
          </p>
        </header>

        <section aria-labelledby="summary-heading">
          <h2
            id="summary-heading"
            className="text-xs font-semibold uppercase tracking-wider text-resume-accent"
          >
            专业概述
          </h2>
          <p className="mt-2 text-sm leading-relaxed text-foreground">
            {resume.summary}
          </p>
        </section>

        <section aria-labelledby="skills-heading">
          <h2
            id="skills-heading"
            className="text-xs font-semibold uppercase tracking-wider text-resume-accent"
          >
            核心技能
          </h2>
          <ul className="mt-2 list-none space-y-2 text-sm text-foreground">
            {Object.entries(resume.skills).map(([category, text]) => (
              <li key={category}>
                <strong>{category}：</strong>
                {text}
              </li>
            ))}
          </ul>
        </section>

        <section aria-labelledby="experience-heading">
          <h2
            id="experience-heading"
            className="text-xs font-semibold uppercase tracking-wider text-resume-accent"
          >
            工作经历
          </h2>
          <ul className="mt-4 list-none space-y-6">
            {resume.experience.map((job, i) => (
              <li key={`${job.company}-${i}`}>
                <div className="flex flex-wrap items-baseline justify-between gap-2">
                  <h3 className="text-base font-semibold text-foreground">
                    {job.role}，{job.company}
                  </h3>
                  <span className="text-xs tabular-nums text-muted-foreground">
                    {job.period}
                  </span>
                </div>
                {"product" in job && job.product && (
                  <p className="mt-1 text-xs text-muted-foreground">
                    {job.product}
                  </p>
                )}
                <ul className="mt-2 list-disc space-y-1 pl-5 text-sm leading-relaxed text-foreground">
                  {job.highlights.map((line, j) => (
                    <li key={j}>{line}</li>
                  ))}
                </ul>
              </li>
            ))}
          </ul>
        </section>

        <section aria-labelledby="articles-heading">
          <h2
            id="articles-heading"
            className="text-xs font-semibold uppercase tracking-wider text-resume-accent"
          >
            技术文章
          </h2>
          <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-foreground">
            {resume.articles.map((a) => (
              <li key={a.href}>
                <Link href={a.href} className="underline underline-offset-2">
                  {a.title}
                </Link>
              </li>
            ))}
          </ul>
        </section>

        <p className="text-sm italic leading-relaxed text-muted-foreground">
          {resume.closing}
        </p>
      </article>
    </Container>
  );
}
