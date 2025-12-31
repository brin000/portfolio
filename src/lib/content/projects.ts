export interface Project {
  title: string;
  description: string;
  tags: string[];
  links?: {
    github?: string;
    demo?: string;
    website?: string;
  };
}

export const projects: Project[] = [
  {
    title: "项目示例 1",
    description: "这是一个示例项目，展示了如何使用 React 和 Next.js 构建现代化的 Web 应用。",
    tags: ["React", "Next.js", "TypeScript"],
    links: {
      github: "https://github.com/example/project1",
      demo: "https://demo.example.com/project1",
    },
  },
];

