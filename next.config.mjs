import nextMDX from "@next/mdx";

/** @type {import('next').NextConfig} */
const nextConfig = {
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

