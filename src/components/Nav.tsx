import Link from "next/link";
import { ThemeToggle } from "@/components/ThemeToggle";

export default function Nav() {
  return (
    <nav className="border-b">
      <div className="mx-auto max-w-3xl px-4">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center gap-6">
            <Link
              href="/"
              className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
              Home
            </Link>
            <Link
              href="/projects"
              className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
              Projects
            </Link>
            <Link
              href="/blog"
              className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
              Blog
            </Link>
          </div>
          <ThemeToggle />
        </div>
      </div>
    </nav>
  );
}
