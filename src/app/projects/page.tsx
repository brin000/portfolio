import { projects } from "@/lib/content/projects";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Code, ExternalLink, ArrowUpRight } from "lucide-react";
import Container from "@/components/container";
import { cn } from "@/lib/utils";

export default function Projects() {
  return (
    <Container as="main" className="relative">
      <div
        className="pointer-events-none absolute inset-0 -top-24 h-[60vh] max-h-[480px] opacity-30 dark:opacity-10"
        aria-hidden
        style={{
          background:
            "radial-gradient(ellipse 80% 70% at 50% -20%, var(--primary) / 0.15, transparent)",
        }}
      />

      <div className="relative flex flex-col gap-10 md:gap-14">
        <header className="flex flex-col gap-2 border-l-0 pl-0 md:border-l-2 md:border-l-foreground/10 md:pl-8 md:dark:border-l-foreground/15">
          <h1
            className={cn(
              "font-(--font-display) text-4xl font-semibold tracking-tight md:text-5xl",
              "bg-linear-to-br from-foreground via-foreground to-muted-foreground bg-clip-text text-transparent dark:from-foreground dark:to-muted-foreground"
            )}
          >
            项目
          </h1>
          <p className="max-w-xl text-sm text-muted-foreground md:text-base">
            作品与案例
          </p>
        </header>

        <ul className="flex flex-col gap-5 md:gap-6">
          {projects.map((project, index) => (
            <li
              key={project.title}
              className="page-reveal"
              style={{ animationDelay: `${index * 80}ms` }}
            >
              <Card
                className={cn(
                  "border-border/80 bg-card/80 shadow-sm transition-all duration-200",
                  "hover:border-foreground/15 hover:shadow-md dark:bg-card/50 dark:hover:border-foreground/10"
                )}
              >
                <CardHeader>
                  <CardTitle className="font-(--font-display) text-lg font-semibold tracking-tight md:text-xl">
                    {project.title}
                  </CardTitle>
                  <CardDescription className="text-sm leading-relaxed">
                    {project.description}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {project.tags.map((tag) => (
                      <Badge
                        key={tag}
                        variant="outline"
                        className="border-border/80 text-muted-foreground"
                      >
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
                {project.links && (
                  <CardFooter className="flex flex-wrap gap-2 pt-0">
                    {project.links.github && (
                      <Button
                        variant="outline"
                        size="sm"
                        asChild
                        className="group border-border/80 bg-background/80 shadow-sm transition-all duration-200 hover:border-foreground/20 hover:shadow dark:bg-card/50"
                      >
                        <a
                          href={project.links.github}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-2"
                        >
                          <Code className="size-4 transition-transform duration-200 group-hover:scale-110" />
                          GitHub
                          <ArrowUpRight className="size-4 opacity-60 transition-all duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:opacity-100" />
                        </a>
                      </Button>
                    )}
                    {project.links.demo && (
                      <Button
                        variant="outline"
                        size="sm"
                        asChild
                        className="group border-border/80 bg-background/80 shadow-sm transition-all duration-200 hover:border-foreground/20 hover:shadow dark:bg-card/50"
                      >
                        <a
                          href={project.links.demo}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-2"
                        >
                          <ExternalLink className="size-4 transition-transform duration-200 group-hover:scale-110" />
                          Demo
                          <ArrowUpRight className="size-4 opacity-60 transition-all duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:opacity-100" />
                        </a>
                      </Button>
                    )}
                    {project.links.website && (
                      <Button
                        variant="outline"
                        size="sm"
                        asChild
                        className="group border-border/80 bg-background/80 shadow-sm transition-all duration-200 hover:border-foreground/20 hover:shadow dark:bg-card/50"
                      >
                        <a
                          href={project.links.website}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-2"
                        >
                          <ExternalLink className="size-4 transition-transform duration-200 group-hover:scale-110" />
                          Website
                          <ArrowUpRight className="size-4 opacity-60 transition-all duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:opacity-100" />
                        </a>
                      </Button>
                    )}
                  </CardFooter>
                )}
              </Card>
            </li>
          ))}
        </ul>
      </div>
    </Container>
  );
}
