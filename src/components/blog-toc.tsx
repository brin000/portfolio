"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import type { TableOfContents, TOCItem } from "@/lib/toc";

interface BlogTOCProps {
  toc: TableOfContents;
}

function useActiveItem(itemIds: string[]) {
  const [activeId, setActiveId] = React.useState<string | null>(null);

  React.useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
          }
        });
      },
      { rootMargin: `0% 0% -80% 0%` }
    );

    itemIds?.forEach((id) => {
      const element = document.getElementById(id);
      if (element) {
        observer.observe(element);
      }
    });

    return () => {
      itemIds?.forEach((id) => {
        const element = document.getElementById(id);
        if (element) {
          observer.unobserve(element);
        }
      });
    };
  }, [itemIds]);

  return activeId;
}

interface TreeProps {
  tree: TableOfContents | TOCItem;
  level?: number;
  activeItem?: string | null;
}

function Tree({ tree, level = 1, activeItem }: TreeProps) {
  // 处理 TableOfContents 或 TOCItem
  const items = "items" in tree && Array.isArray(tree.items) 
    ? tree.items 
    : "title" in tree 
    ? [tree] 
    : [];
  
  return items?.length && level < 3 ? (
    <ul className={cn("m-0 list-none", { "pl-4": level !== 1 })}>
      {items.map((item, index) => {
        return (
          <li key={index} className={cn("mt-0 pt-2")}>
            <a
              href={item.url}
              className={cn(
                "inline-block no-underline transition-colors hover:text-foreground",
                item.url === `#${activeItem}`
                  ? "font-medium text-foreground"
                  : "text-muted-foreground"
              )}
            >
              {item.title}
            </a>
            {item.items?.length ? (
              <Tree tree={{ items: item.items }} level={level + 1} activeItem={activeItem} />
            ) : null}
          </li>
        );
      })}
    </ul>
  ) : null;
}

export function BlogTOC({ toc }: BlogTOCProps) {
  const itemIds = React.useMemo(
    () =>
      toc.items
        ? toc.items
            .flatMap((item) => [
              item.url,
              item?.items?.map((item) => item.url),
            ])
            .flat()
            .filter((url): url is string => Boolean(url))
            .map((url) => url.replace("#", ""))
        : [],
    [toc]
  );

  const activeHeading = useActiveItem(itemIds);

  if (!toc?.items?.length) {
    return null;
  }

  return (
    <nav
      aria-label="Table of contents"
      className="sticky top-[calc(var(--header-height)+1px)] hidden h-[calc(100svh-var(--header-height))] overflow-y-auto xl:block"
    >
      <div className="space-y-2">
        <p className="mb-4 text-xs font-medium uppercase tracking-widest text-muted-foreground/80">
          本页目录
        </p>
        <Tree tree={toc} activeItem={activeHeading} />
      </div>
    </nav>
  );
}

