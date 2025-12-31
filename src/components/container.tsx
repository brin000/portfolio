import * as React from "react";
import { cn } from "@/lib/utils";

type ContainerElement = "div" | "main" | "section" | "article";

interface ContainerProps<T extends ContainerElement = "div">
  extends Omit<React.HTMLAttributes<HTMLElement>, "as"> {
  as?: T;
}

const Container = React.forwardRef<
  HTMLElement,
  ContainerProps<ContainerElement>
>(({ className, as: Component = "div", ...props }, ref) => {
  return (
    <Component
      ref={ref as any}
      className={cn(
        "mx-auto max-w-3xl px-4 py-12 md:py-16",
        className
      )}
      {...props}
    />
  );
});

Container.displayName = "Container";

export default Container;

