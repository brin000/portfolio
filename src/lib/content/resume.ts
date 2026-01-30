type ContactItem = { label: string; value: string; href?: string };

export const resume = {
  name: "LAKE",
  title: "WEB 前端工程师",
  meta: {
    gender: "男",
    education: "本科 · 计算机",
    yearsExp: 9,
  },
  summary:
    "9 年前端开发经验，主导过企业级多端平台从 0 到 1 的架构落地与性能优化。擅长 SSR（Nuxt/Next.js）、Node.js BFF、Monorepo 与微前端，具备在多租户、多端分发场景下的工程化与可维护性实践。注重可量化结果：首屏与构建耗时显著下降、排障与接入效率提升，并能通过技术文章与规范沉淀推动团队协作。",
  contact: [
    { label: "联系", value: "通过博客或 GitHub", href: "/blog" },
    { label: "GitHub", value: "github.com/brin000", href: "https://github.com/brin000" },
  ] as ContactItem[],
  skills: {
    前端: "Vue 2/3 (Composition API)、React、React Native",
    SSR: "Nuxt.js、Next.js",
    工程化: "Vite、Webpack、Rollup、Monorepo、pnpm",
    架构: "微前端、多应用基座、配置化平台",
    性能: "SSR 首屏优化、缓存策略、代码分割",
    服务端: "Node.js (SSR / 中间层 / 脚手架)、Nginx",
    其他: "组件库、CI/CD",
  },
  experience: [
    {
      company: "某智能科技公司",
      role: "前端主管",
      period: "20XX — 20XX",
      product: "企业级多端游戏聚合平台（B/C 端）",
      highlights: [
        "主导 Nuxt SSR 架构设计与落地，统一服务端与客户端渲染链路，支撑 PC/H5 多端内容分发；通过 SSR 数据预取与缓存策略（SSR Cache + TanStack Query）将首屏加载时间降低约 40%+，TTFB 明显改善。",
        "抽象通用页面模板与渲染层逻辑，将页面级重复代码减少约 60%；设计并落地多租户主题系统（Tailwind CSS），支持品牌级定制与运行时切换；通过环境变量驱动前端形态编排，实现构建结果高解耦与多端精准分发。",
        "从 0 搭建 Node.js BFF 中间层，统一接口聚合、异常兜底与权限控制；基于 OpenAPI 代码生成类型安全 API 客户端，配合拦截器与请求去重/取消，统一主站/游客/系统/扩展等多端请求配置与错误处理。",
        "接入 Sentry + SourceMap + Performance Tracing，建立线上问题与性能优化的可量化闭环，排障效率提升约 50%；优化超长列表渲染，实现 10K+ 条注单秒级展示与无卡顿滚动。",
        "负责官方综合页（PC/H5）技术选型与落地：React、Next.js (App Router)、pnpm、Turborepo、Tailwind、Service Worker、Node.js；主导 Monorepo（pnpm + Turborepo）重构，CI 构建时间减少约 40%；通过 Next.js 基座与 Service Worker 缓存策略，新项目接入成本降低约 50%，弱网与海外访问体验显著提升。",
      ],
    },
    {
      company: "某互联科技公司",
      role: "前端开发",
      period: "20XX — 20XX",
      product: "业务官网与业务系统、网格社区治理与排查管理系统",
      highlights: [
        "独立负责多条业务线前端开发，使用 React 组件化与 Next.js 实现 SSR/静态生成，首屏与 SEO 指标明显优化，支撑多款企业官网与内部系统稳定上线。",
        "设计并实现基座应用 + 子应用微前端架构（iframe + postMessage），完成路由同步、状态共享与权限控制；通过 Nginx 反向代理统一主域，实现 Cookie 共享与登录态复用；引入 http-vue-loader 对老系统做渐进式改造，在低改造成本下完成架构升级。",
        "推动 CI/CD（GitLab CI）落地：PR 阶段集成代码规范与 TypeScript 校验，构建、缓存与多环境发布流程标准化，发布周期缩短、线上问题追溯效率提升。",
      ],
    },
    {
      company: "某数字技术公司",
      role: "前端开发",
      period: "20XX — 20XX",
      product: "企业官网与内部系统",
      highlights: [
        "独立完成企业官网与内部系统多模块页面开发与交互实现，交付响应式、跨浏览器兼容的稳定页面；参与基础组件与公共工具封装，提升组件复用率与团队协作效率。",
      ],
    },
  ],
  articles: [
    { title: "React Server Components", href: "/blog/react-server-components" },
    { title: "React Scheduler 与 MessageChannel", href: "/blog/react-scheduler-messagechannel" },
    { title: "React Query 与 Next.js", href: "/blog/react-query-nextjs" },
  ],
  closing: "感谢您花时间阅读我的简历，期待有机会进一步交流。",
} as const;
