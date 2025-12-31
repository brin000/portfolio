import { Button } from "@/components/ui/button";
import { Github, Mail, Twitter } from "lucide-react";

export default function Home() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-16">
      <main className="flex flex-col gap-8">
        <div className="flex flex-col gap-4">
          <h1 className="text-4xl font-semibold tracking-tight">
            Your Name
          </h1>
          <p className="text-lg leading-7 text-muted-foreground">
            Frontend engineer building modern web experiences. Passionate about
            clean code, performance, and user experience.
          </p>
        </div>

        <div className="flex flex-col gap-4">
          <h2 className="text-sm font-medium text-muted-foreground">
            Links
          </h2>
          <div className="flex flex-wrap gap-2">
            <Button variant="outline" size="sm" asChild>
              <a
                href="https://github.com/yourusername"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2"
              >
                <Github className="size-4" />
                GitHub
              </a>
            </Button>
            <Button variant="outline" size="sm" asChild>
              <a
                href="https://x.com/yourusername"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2"
              >
                <Twitter className="size-4" />
                X
              </a>
            </Button>
            <Button variant="outline" size="sm" asChild>
              <a
                href="mailto:your.email@example.com"
                className="flex items-center gap-2"
              >
                <Mail className="size-4" />
                Email
              </a>
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
}
