import * as React from "react";
import { cn } from "@/lib/utils";

type ContainerElement = "div" | "main" | "section" | "article";

interface ContainerProps<T extends ContainerElement = "div">
  extends Omit<React.HTMLAttributes<HTMLElement>, "as"> {
  as?: T;
}

const contentColumnStyle = {
  maxWidth: "var(--content-max-width)",
  paddingLeft: "var(--content-padding-x)",
  paddingRight: "var(--content-padding-x)",
} as const;

const Container = React.forwardRef<
  HTMLElement,
  ContainerProps<ContainerElement>
>(({ className, style, as: Component = "div", ...props }, ref) => {
  return (
    <Component
      ref={ref as any}
      className={cn("mx-auto py-12 md:py-16", className)}
      style={{ ...contentColumnStyle, ...style }}
      {...props}
    />
  );
});

Container.displayName = "Container";

export default Container;

