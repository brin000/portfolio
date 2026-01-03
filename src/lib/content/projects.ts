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
    title: "个人作品集网站",
    description: "我的个人作品集网站，展示了我的项目、博客和个人信息。基于 React、Next.js 和 TypeScript 开发，支持内容管理和现代前端最佳实践。",
    tags: ["React", "Next.js", "TypeScript", "Portfolio"],
    links: {
      github: "https://github.com/brin000/portfolio",
      website: "portfolio-brin000s-projects.vercel.app",
    },
  },
];

