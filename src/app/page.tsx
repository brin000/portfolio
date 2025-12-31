import { Button } from "@/components/ui/button";
import { Github, Mail, Twitter } from "lucide-react";
import Container from "@/components/container";

export default function Home() {
  return (
    <Container as="main">
      <div className="flex flex-col gap-6 md:gap-8">
        <div className="flex flex-col gap-4">
          <h1 className="text-3xl font-semibold tracking-tight md:text-4xl">
            梦见
          </h1>
          <p className="text-base leading-7 text-muted-foreground md:text-lg">
            专注于现代 Web 前端开发，追求高质量代码、卓越性能与优质用户体验。持续学习和探索前沿技术，善于解决复杂问题，注重前后端协作。不断优化业务流程和项目结构，期望用简洁、易维护且高效的代码改善产品体验。关注可访问性与响应式设计，熟悉多端适配和性能调优。欢迎一起交流技术、分享经验、共建开放友好的开发社区。
          </p>
        </div>

        <div className="flex flex-col gap-4">
          <h2 className="text-sm font-medium text-muted-foreground">
            Links
          </h2>
          <div className="flex flex-wrap gap-2">
            <Button variant="outline" size="sm" asChild>
              <a
                href="https://github.com/brin000"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2"
              >
                <Github className="size-4" />
                GitHub
              </a>
            </Button>
          </div>
        </div>
      </div>
    </Container>
  );
}
