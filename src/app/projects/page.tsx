import { projects } from "@/lib/content/projects";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Code, ExternalLink } from "lucide-react";
import Container from "@/components/container";

export default function Projects() {
  return (
    <Container as="main">
      <div className="flex flex-col gap-6 md:gap-8">
        <h1 className="text-3xl font-semibold tracking-tight md:text-4xl">
          项目
        </h1>
        <div className="flex flex-col gap-4 md:gap-6">
          {projects.map((project) => (
            <Card key={project.title}>
              <CardHeader>
                <CardTitle>{project.title}</CardTitle>
                <CardDescription>{project.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {project.tags.map((tag) => (
                    <Badge key={tag} variant="outline">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </CardContent>
              {project.links && (
                <CardFooter className="flex flex-wrap gap-2">
                  {project.links.github && (
                    <Button variant="outline" size="sm" asChild>
                      <a
                        href={project.links.github}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2"
                      >
                        <Code className="size-4" />
                        GitHub
                      </a>
                    </Button>
                  )}
                  {project.links.demo && (
                    <Button variant="outline" size="sm" asChild>
                      <a
                        href={project.links.demo}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2"
                      >
                        <ExternalLink className="size-4" />
                        Demo
                      </a>
                    </Button>
                  )}
                  {project.links.website && (
                    <Button variant="outline" size="sm" asChild>
                      <a
                        href={project.links.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2"
                      >
                        <ExternalLink className="size-4" />
                        Website
                      </a>
                    </Button>
                  )}
                </CardFooter>
              )}
            </Card>
          ))}
        </div>
      </div>
    </Container>
  );
}
