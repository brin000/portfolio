import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "简历 | LAKE",
  description: "LAKE 的个人简历 — 前端工程师，专注现代 Web 开发与用户体验",
};

export default function ResumeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
