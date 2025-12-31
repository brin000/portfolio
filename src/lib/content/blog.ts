import fs from "fs";
import path from "path";
import matter from "gray-matter";

const postsDirectory = path.join(process.cwd(), "content", "blog");

export interface Post {
  slug: string;
  title: string;
  date: string;
  summary: string;
  content: string;
}

export function getAllPosts(): Omit<Post, "content">[] {
  // 确保目录存在
  if (!fs.existsSync(postsDirectory)) {
    return [];
  }

  const fileNames = fs.readdirSync(postsDirectory);
  const allPostsData = fileNames
    .filter((fileName) => fileName.endsWith(".md") || fileName.endsWith(".mdx"))
    .map((fileName) => {
      const slug = fileName.replace(/\.(md|mdx)$/, "");
      const fullPath = path.join(postsDirectory, fileName);
      const fileContents = fs.readFileSync(fullPath, "utf8");
      const { data } = matter(fileContents);

      return {
        slug,
        title: data.title || "",
        date: data.date || "",
        summary: data.summary || "",
      };
    })
    .filter((post) => post.title && post.date) // 过滤掉无效的文章
    .sort((a, b) => {
      // 按日期降序排序（最新的在前）
      return new Date(b.date).getTime() - new Date(a.date).getTime();
    });

  return allPostsData;
}

export function getPostBySlug(slug: string): Post | null {
  // 尝试 .mdx 和 .md 文件
  const mdxPath = path.join(postsDirectory, `${slug}.mdx`);
  const mdPath = path.join(postsDirectory, `${slug}.md`);
  
  const fullPath = fs.existsSync(mdxPath) ? mdxPath : 
                   fs.existsSync(mdPath) ? mdPath : null;

  if (!fullPath || !fs.existsSync(fullPath)) {
    return null;
  }

  const fileContents = fs.readFileSync(fullPath, "utf8");
  const { data, content } = matter(fileContents);

  return {
    slug,
    title: data.title || "",
    date: data.date || "",
    summary: data.summary || "",
    content,
  };
}

