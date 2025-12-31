import nextMDX from "@next/mdx";

/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export', // 关键配置：导出静态资源
  images: {
    unoptimized: true, // 静态导出不支持 Next.js 默认的图片优化，需禁用
  },
  pageExtensions: ["ts", "tsx", "js", "jsx", "md", "mdx"],
};

const withMDX = nextMDX({
  extension: /\.mdx?$/,
  options: {
    remarkPlugins: [],
    // rehype-pretty-code 在运行时通过 unified 处理，避免序列化问题
    rehypePlugins: [],
  },
});

export default withMDX(nextConfig);

