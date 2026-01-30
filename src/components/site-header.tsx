"use client";

import { useEffect, useState, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ThemeToggle } from "@/components/theme-toggle";
import { cn } from "@/lib/utils";

const navItems = [
  { href: "/", label: "主页" },
  { href: "/resume", label: "简历" },
  { href: "/projects", label: "项目" },
  { href: "/blog", label: "博客" },
  { href: "/guestbook", label: "留言板" },
] as const;

const SCROLL_THRESHOLD = 80;

export default function SiteHeader() {
  const pathname = usePathname();
  const [visible, setVisible] = useState(true);
  const lastScrollY = useRef(0);

  useEffect(() => {
    let ticking = false;

    function onScroll() {
      const y = window.scrollY;
      if (y <= SCROLL_THRESHOLD) {
        setVisible(true);
      } else if (y > lastScrollY.current) {
        setVisible(false);
      } else {
        setVisible(true);
      }
      lastScrollY.current = y;
      ticking = false;
    }

    function handleScroll() {
      if (!ticking) {
        requestAnimationFrame(onScroll);
        ticking = true;
      }
    }

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={cn(
        "site-header fixed left-0 right-0 top-0 z-50 transition-transform duration-300 ease-out",
        visible ? "translate-y-0" : "-translate-y-full"
      )}
      style={{ willChange: "transform" }}
    >
      <nav className="border-b border-border/80 bg-background/80 backdrop-blur-md">
        <div
          className="mx-auto"
          style={{
            maxWidth: "var(--content-max-width)",
            paddingLeft: "var(--content-padding-x)",
            paddingRight: "var(--content-padding-x)",
          }}
        >
          <div className="flex h-14 items-center justify-between md:h-16">
            <div className="flex items-center gap-1 md:gap-2">
              {navItems.map(({ href, label }) => {
                const isActive =
                  href === "/" ? pathname === "/" : pathname.startsWith(href);
                return (
                  <Link
                    key={href}
                    href={href}
                    className={cn(
                      "rounded-md px-3 py-2 text-sm font-medium transition-colors md:px-4",
                      isActive
                        ? "text-foreground"
                        : "text-muted-foreground hover:text-foreground"
                    )}
                  >
                    {label}
                  </Link>
                );
              })}
            </div>
            <ThemeToggle />
          </div>
        </div>
      </nav>
    </header>
  );
}
