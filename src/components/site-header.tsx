import Link from "next/link";
import { ThemeToggle } from "@/components/theme-toggle";

const SiteHeader = () => {
  return (
    <nav className="border-b">
      <div className="mx-auto max-w-3xl px-4">
        <div className="flex h-14 items-center justify-between md:h-16">
          <div className="flex items-center gap-4 md:gap-6">
            <Link
              href="/"
              className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
              主页
            </Link>
            <Link
              href="/projects"
              className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
              项目
            </Link>
            <Link
              href="/blog"
              className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
              博客
            </Link>
          </div>
          <ThemeToggle />
        </div>
      </div>
    </nav>
  );
};

export default SiteHeader;
