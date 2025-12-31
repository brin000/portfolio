import Link from "next/link";
import { getAllPosts } from "@/lib/content/blog";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { format } from "date-fns";
import Container from "@/components/container";

export default function Blog() {
  const posts = getAllPosts();


  return (
    <Container as="main">
      <div className="flex flex-col gap-6 md:gap-8">
        <h1 className="text-3xl font-semibold tracking-tight md:text-4xl">
          博客
        </h1>
        {posts.length === 0 ? (
          <p className="text-base leading-7 text-muted-foreground md:text-lg">
            Coming soon...
          </p>
        ) : (
          <div className="flex flex-col gap-4 md:gap-6">
            {posts.map((post) => (
              <Card key={post.slug}>
                <CardHeader>
                  <CardTitle>
                    <Link
                      href={`/blog/${post.slug}`}
                      className="hover:underline"
                    >
                      {post.title}
                    </Link>
                  </CardTitle>
                  <CardDescription>
                    <time dateTime={post.date} className="text-xs">
                      {format(new Date(post.date), "yyyy年MM月dd日")}
                    </time>
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    {post.summary}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </Container>
  );
}
