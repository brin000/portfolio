import Link from "next/link";
import { getAllPosts } from "@/lib/content/blog";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Container from "@/components/container";
import { ArrowUpRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { formatDateInTimeZone } from "@/lib/date";

/** 博客列表日期：固定时区 + date-fns 格式，保证 SSR 水合一致 */
const BLOG_DATE_FORMAT = "yyyy年MM月dd日";
const BLOG_DATE_TIMEZONE = "UTC";

export default function Blog() {
  const posts = getAllPosts();

  return (
    <Container as="main" className="relative">
      <div
        className="pointer-events-none absolute inset-0 -top-24 h-[60vh] max-h-[480px] opacity-30 dark:opacity-10"
        aria-hidden
        style={{
          background:
            "radial-gradient(ellipse 80% 70% at 50% -20%, var(--primary) / 0.15, transparent)",
        }}
      />

      <div className="relative flex flex-col gap-10 md:gap-14">
        <header className="flex flex-col gap-2 border-l-0 pl-0 md:border-l-2 md:border-l-foreground/10 md:pl-8 md:dark:border-l-foreground/15">
          <h1
            className={cn(
              "font-(--font-display) text-4xl font-semibold tracking-tight md:text-5xl",
              "bg-linear-to-br from-foreground via-foreground to-muted-foreground bg-clip-text text-transparent dark:from-foreground dark:to-muted-foreground"
            )}
          >
            博客
          </h1>
          <p className="max-w-xl text-sm text-muted-foreground md:text-base">
            技术笔记与思考
          </p>
        </header>

        {posts.length === 0 ? (
          <p className="text-base leading-7 text-muted-foreground md:text-lg">
            Coming soon...
          </p>
        ) : (
          <ul className="flex flex-col gap-4 md:gap-5">
            {posts.map((post, index) => (
              <li
                key={post.slug}
                className="page-reveal"
                style={{ animationDelay: `${index * 80}ms` }}
              >
                <Link href={`/blog/${post.slug}`} className="block">
                  <Card
                    className={cn(
                      "border-border/80 bg-card/80 shadow-sm transition-all duration-200",
                      "hover:border-foreground/15 hover:shadow-md dark:bg-card/50 dark:hover:border-foreground/10"
                    )}
                  >
                    <CardHeader className="pb-2">
                      <CardTitle className="group flex items-start justify-between gap-4 text-lg font-semibold leading-tight">
                        <span className="hover:text-foreground/90">
                          {post.title}
                        </span>
                        <ArrowUpRight className="size-4 shrink-0 opacity-50 transition-all duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:opacity-100" />
                      </CardTitle>
                      <CardDescription>
                        <time
                          dateTime={post.date}
                          className="text-xs text-muted-foreground"
                        >
                          {formatDateInTimeZone(
                            post.date,
                            BLOG_DATE_FORMAT,
                            BLOG_DATE_TIMEZONE
                          )}
                        </time>
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="pt-0">
                      <p className="line-clamp-2 text-sm text-muted-foreground">
                        {post.summary}
                      </p>
                    </CardContent>
                  </Card>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>
    </Container>
  );
}
