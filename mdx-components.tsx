import Image from "next/image"
import Link from "next/link"
import React from "react"

import { Separator } from "@/components/profile/separator"
import { ProfileImage } from "@/components/profile/mdx-profile-image"
import { PageHeaderTitle } from "@/components/site/page-header-title"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AspectRatio } from "@/components/ui/aspect-ratio"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { cn } from "@/lib/utils"
import type { MDXComponents } from "mdx/types"

export function useMDXComponents(components: MDXComponents): MDXComponents {
  return {
    ...components,
    ...customComponents,
  }
}

const createHeadingId = (children: React.ReactNode) => {
  const text = React.Children.toArray(children)
    .filter((child): child is string | number =>
      ["string", "number"].includes(typeof child)
    )
    .join(" ")

  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-")
}

const customComponents = {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
  Alert,
  AlertTitle,
  AlertDescription,
  Button,
  PageHeaderTitle,
  ProfileImage,
  Separator,
  VariantsText: ({ className }: React.HTMLAttributes<HTMLDivElement>) => (
    <div
      className={cn(
        "border-edge flex w-full items-center justify-center border-b-2 border-dotted px-2 py-2",
        className
      )}
    >
      <Button variant={"link"} className="mx-0 px-0 text-xl sm:text-2xl">
        Variants
      </Button>
    </div>
  ),
  h1: ({
    className,
    children,
    id,
    ...props
  }: React.HTMLAttributes<HTMLHeadingElement>) => {
    const headingId = id || createHeadingId(children)
    return (
      <h1
        id={headingId}
        className={cn(
          "font-heading group my-3 scroll-m-24 text-3xl font-bold tracking-tight",
          className
        )}
        {...props}
      >
        {children}
        {headingId && (
          <a
            href={`#${headingId}`}
            aria-label={`Link to ${headingId.replaceAll("-", " ")}`}
            className="text-muted-foreground ml-2 opacity-0 transition-opacity group-hover:opacity-100 focus:opacity-100"
          >
            #
          </a>
        )}
      </h1>
    )
  },
  h2: ({
    className,
    children,
    id,
    ...props
  }: React.HTMLAttributes<HTMLHeadingElement>) => {
    const headingId = id || createHeadingId(children)
    return (
      <h2
        id={headingId}
        className={cn(
          "font-heading group mt-10 scroll-m-24 border-b pb-3 text-2xl font-semibold tracking-tight first:mt-0",
          className
        )}
        {...props}
      >
        {children}
        {headingId && (
          <a
            href={`#${headingId}`}
            aria-label={`Link to ${headingId.replaceAll("-", " ")}`}
            className="text-muted-foreground ml-2 opacity-0 transition-opacity group-hover:opacity-100 focus:opacity-100"
          >
            #
          </a>
        )}
      </h2>
    )
  },
  h3: ({
    className,
    children,
    id,
    ...props
  }: React.HTMLAttributes<HTMLHeadingElement>) => {
    const headingId = id || createHeadingId(children)
    return (
      <h3
        id={headingId}
        className={cn(
          "font-heading group mt-8 mb-2 scroll-m-24 text-xl font-semibold tracking-tight",
          className
        )}
        {...props}
      >
        {children}
        {headingId && (
          <a
            href={`#${headingId}`}
            aria-label={`Link to ${headingId.replaceAll("-", " ")}`}
            className="text-muted-foreground ml-2 opacity-0 transition-opacity group-hover:opacity-100 focus:opacity-100"
          >
            #
          </a>
        )}
      </h3>
    )
  },
  h4: ({ className, ...props }: React.HTMLAttributes<HTMLHeadingElement>) => (
    <h4
      className={cn(
        "font-heading mt-8 mb-1 scroll-m-24 text-lg font-semibold tracking-tight",
        className
      )}
      {...props}
    />
  ),
  h5: ({ className, ...props }: React.HTMLAttributes<HTMLHeadingElement>) => (
    <h5
      className={cn(
        "mt-8 mb-1 scroll-m-20 text-lg font-semibold tracking-tight",
        className
      )}
      {...props}
    />
  ),
  h6: ({ className, ...props }: React.HTMLAttributes<HTMLHeadingElement>) => (
    <h6
      className={cn(
        "mt-8 mb-1 scroll-m-20 text-base font-semibold tracking-tight",
        className
      )}
      {...props}
    />
  ),
  p: ({ className, ...props }: React.HTMLAttributes<HTMLParagraphElement>) => (
    <p
      className={cn("my-4 leading-7 text-pretty", className)}
      {...props}
    />
  ),
  a: ({
    className,
    href,
    target,
    rel,
    ...props
  }: React.AnchorHTMLAttributes<HTMLAnchorElement>) => {
    const isExternal = Boolean(href?.startsWith("http"))
    return (
      <a
        href={href}
        target={target ?? (isExternal ? "_blank" : undefined)}
        rel={rel ?? (isExternal ? "noreferrer noopener" : undefined)}
        className={cn(
          "decoration-muted-foreground/60 hover:decoration-foreground font-medium underline underline-offset-4 transition-colors",
          className
        )}
        {...props}
      />
    )
  },
  strong: ({ className, ...props }: React.HTMLAttributes<HTMLElement>) => (
    <strong className={cn("font-semibold", className)} {...props} />
  ),
  ul: ({ className, ...props }: React.HTMLAttributes<HTMLUListElement>) => (
    <ul className={cn("my-6 ml-6 list-disc", className)} {...props} />
  ),
  ol: ({ className, ...props }: React.HTMLAttributes<HTMLOListElement>) => (
    <ol className={cn("my-6 ml-6 list-decimal", className)} {...props} />
  ),
  li: ({ className, ...props }: React.HTMLAttributes<HTMLElement>) => (
    <li className={cn("mt-2", className)} {...props} />
  ),
  blockquote: ({ className, ...props }: React.HTMLAttributes<HTMLElement>) => (
    <blockquote
      className={cn("mt-6 border-l-2 pl-6 italic", className)}
      {...props}
    />
  ),
  img: ({
    className,
    alt,
    ...props
  }: React.ImgHTMLAttributes<HTMLImageElement>) => (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      className={cn("my-8 rounded-lg border", className)}
      alt={alt || ""}
      loading="lazy"
      decoding="async"
      {...props}
    />
  ),
  hr: ({ ...props }: React.HTMLAttributes<HTMLHRElement>) => (
    <hr className="my-4 md:my-8" {...props} />
  ),
  table: ({ className, ...props }: React.HTMLAttributes<HTMLTableElement>) => (
    <div className="my-6 w-full overflow-x-auto rounded-lg border">
      <table
        className={cn(
          "relative w-full overflow-hidden border-none text-sm",
          className
        )}
        {...props}
      />
    </div>
  ),
  tr: ({ className, ...props }: React.HTMLAttributes<HTMLTableRowElement>) => (
    <tr
      className={cn("last:border-b-none m-0 border-b", className)}
      {...props}
    />
  ),
  th: ({ className, ...props }: React.HTMLAttributes<HTMLTableCellElement>) => (
    <th
      className={cn(
        "px-4 py-2 text-left font-bold [&[align=center]]:text-center [&[align=right]]:text-right",
        className
      )}
      {...props}
    />
  ),
  td: ({ className, ...props }: React.HTMLAttributes<HTMLTableCellElement>) => (
    <td
      className={cn(
        "px-4 py-2 text-left [&[align=center]]:text-center [&[align=right]]:text-right",
        className
      )}
      {...props}
    />
  ),
  pre: ({ className, ...props }: React.HTMLAttributes<HTMLPreElement>) => (
    <pre
      className={cn(
        "bg-muted/70 my-6 overflow-x-auto rounded-lg border p-4 text-sm leading-6",
        className
      )}
      {...props}
    />
  ),
  code: ({ className, ...props }: React.HTMLAttributes<HTMLElement>) => (
    <code
      className={cn(
        "bg-muted rounded px-1.5 py-0.5 font-mono text-[0.9em] [&[data-language]]:bg-transparent [&[data-language]]:p-0",
        className
      )}
      {...props}
    />
  ),
  figure: ({ className, ...props }: React.HTMLAttributes<HTMLElement>) => (
    <figure className={cn("my-8", className)} {...props} />
  ),
  figcaption: ({ className, ...props }: React.HTMLAttributes<HTMLElement>) => (
    <figcaption
      className={cn(
        "text-muted-foreground mt-3 text-center text-sm leading-6",
        className
      )}
      {...props}
    />
  ),
  kbd: ({ className, ...props }: React.HTMLAttributes<HTMLElement>) => (
    <kbd
      className={cn(
        "bg-muted rounded border px-1.5 py-0.5 font-mono text-xs shadow-sm",
        className
      )}
      {...props}
    />
  ),
  Article: ({
    className,
    ...props
  }: React.HTMLAttributes<HTMLElement>) => (
    <article
      className={cn("mx-auto w-full max-w-3xl text-base", className)}
      {...props}
    />
  ),
  Callout: ({
    className,
    ...props
  }: React.HTMLAttributes<HTMLDivElement>) => (
    <aside
      className={cn(
        "bg-muted/45 my-6 rounded-lg border-l-4 px-5 py-3 [&>p:first-child]:mt-0 [&>p:last-child]:mb-0",
        className
      )}
      {...props}
    />
  ),
  Image,
  AspectRatio,
  Step: ({ className, ...props }: React.ComponentProps<"h3">) => (
    <h3
      className={cn(
        "font-heading mt-8 scroll-m-20 text-xl font-semibold tracking-tight",
        className
      )}
      {...props}
    />
  ),
  Steps: ({ ...props }) => (
    <div
      className="[&>h3]:step steps mb-12 [counter-reset:step] md:ml-4 md:border-l md:pl-8"
      {...props}
    />
  ),
  Tabs: ({ className, ...props }: React.ComponentProps<typeof Tabs>) => (
    <Tabs className={cn("relative mt-6 w-full", className)} {...props} />
  ),
  TabsList: ({
    className,
    ...props
  }: React.ComponentProps<typeof TabsList>) => (
    <TabsList
      className={cn(
        "w-full justify-start rounded-none border-b bg-transparent p-0",
        className
      )}
      {...props}
    />
  ),
  TabsTrigger: ({
    className,
    ...props
  }: React.ComponentProps<typeof TabsTrigger>) => (
    <TabsTrigger
      className={cn(
        "text-muted-foreground data-[state=active]:border-b-primary data-[state=active]:text-foreground relative h-9 rounded-none border-b-2 border-b-transparent bg-transparent px-4 pt-2 pb-3 font-semibold shadow-none transition-none data-[state=active]:shadow-none",
        className
      )}
      {...props}
    />
  ),
  // CodeBlock: ({
  //   className,
  //   ...props
  // }: React.ComponentProps<typeof CodeBlock>) => (
  //   <CodeBlock className={cn(className)} {...props} />
  // ),
  TabsContent: ({
    className,
    ...props
  }: React.ComponentProps<typeof TabsContent>) => (
    <TabsContent
      className={cn(
        "relative [&_h3.font-heading]:text-base [&_h3.font-heading]:font-semibold",
        className
      )}
      {...props}
    />
  ),
  Link: ({ className, ...props }: React.ComponentProps<typeof Link>) => (
    <Link
      className={cn("font-medium underline underline-offset-4", className)}
      {...props}
    />
  ),
  LinkedCard: ({ className, ...props }: React.ComponentProps<typeof Link>) => (
    <Link
      className={cn(
        "bg-card text-card-foreground hover:bg-muted/50 flex w-full flex-col items-center rounded-xl border p-6 shadow transition-colors sm:p-10",
        className
      )}
      {...props}
    />
  ),
}
