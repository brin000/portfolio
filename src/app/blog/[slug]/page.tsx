import Link from "next/link";
import { notFound } from "next/navigation";
import { getPostBySlug, getAllPosts } from "@/lib/content/blog";
import { format } from "date-fns";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import Container from "@/components/container";
import { BlogTOC } from "@/components/blog-toc";
import { extractTOC } from "@/lib/toc";
import { unified } from "unified";
import remarkParse from "remark-parse";
import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";
import remarkRehype from "remark-rehype";
import rehypeSlug from "rehype-slug";
import rehypeKatex from "rehype-katex";
import rehypeStringify from "rehype-stringify";
import rehypePrettyCode from "rehype-pretty-code";
import KatexStyles from "@/components/katex-styles";


export async function generateStaticParams() {
  const posts = getAllPosts();
  return posts.map((post) => ({
    slug: post.slug,
  }));
}

async function processMDX(content: string) {
  const file = await unified()
    .use(remarkParse)
    .use(remarkGfm)
    .use(remarkMath)
    .use(remarkRehype, { allowDangerousHtml: true })
    .use(rehypeSlug)
    .use(rehypeKatex, {
      throwOnError: false,
      strict: false,
    })
    .use(rehypePrettyCode, {
      theme: {
        light: "github-light",
        dark: "github-dark-dimmed",
      },
      keepBackground: false,
      grid: true,
    })
    .use(rehypeStringify, { allowDangerousHtml: true })
    .process(content);

  return String(file);
}

export default async function BlogPost({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = getPostBySlug(slug);

  if (!post) {
    notFound();
  }

  const processedContent = await processMDX(post.content);
  const toc = extractTOC(processedContent);

  return (
    <>
      <KatexStyles />
      <div className="flex items-stretch">
        <div className="flex min-w-0 flex-1 flex-col">
          <Container as="main">
          <div className="flex flex-col gap-6 md:gap-8">
            <Button variant="ghost" size="sm" asChild className="w-fit">
              <Link href="/blog" className="flex items-center gap-2">
                <ArrowLeft className="size-4" />
                返回博客列表
              </Link>
            </Button>

            <article className="flex flex-col gap-4 md:gap-6">
              <header className="flex flex-col gap-2">
                <h1 className="text-3xl font-semibold tracking-tight md:text-4xl">
                  {post.title}
                </h1>
                <time
                  dateTime={post.date}
                  className="text-sm text-muted-foreground"
                >
                  {format(new Date(post.date), "yyyy年MM月dd日")}
                </time>
              </header>

              <div
                className="prose prose-sm dark:prose-invert max-w-none"
                dangerouslySetInnerHTML={{ __html: processedContent }}
              />
            </article>
          </div>
        </Container>
      </div>
      {toc.items.length > 0 && (
        <div className="sticky top-[calc(var(--header-height)+1px)] z-30 ml-auto hidden h-[calc(100svh-var(--header-height))] w-72 flex-col gap-4 overflow-hidden overscroll-none pb-8 xl:flex">
          <div className="px-6">
            <BlogTOC toc={toc} />
          </div>
        </div>
      )}
      </div>
    </>
  );
}

