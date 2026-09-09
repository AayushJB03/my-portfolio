import { USER } from "@/data"
import Link from "next/link"
import { DitheringShader } from "../ui/dithering-shader"
import { ContainerWrapper } from "./container"

export const SiteFooter = () => {
  return (
    <footer className="bg-background text-foreground w-full">
      <div className="border-edge border-b-[1px]">
        <ContainerWrapper crosshairs="top">
          <div className="relative flex min-h-20 items-center justify-between overflow-hidden px-6 py-4 sm:px-8">
            <DitheringShader
              shape="swirl"
              type="4x4"
              colorBack="var(--footer-shader-back)"
              colorFront="var(--footer-shader-front)"
              pxSize={4}
              speed={0.35}
            />
            <div className="from-background/55 via-background/70 to-background/90 dark:from-background/35 dark:via-background/55 dark:to-background/80 pointer-events-none absolute inset-0 bg-gradient-to-r" />

            <div className="text-muted-foreground relative z-10 font-mono text-xs leading-tight font-medium sm:text-sm">
              <p>
                &copy; 2026{" "}
                <Link
                  href="/privacy"
                  className="hover:text-primary underline underline-offset-4 transition-colors"
                >
                  {USER.username}
                </Link>
              </p>
              <p>Built with love, LLMs and Coffee</p>
            </div>
          </div>
        </ContainerWrapper>
      </div>

      <div className="border-edge border-b-[1px]">
        <ContainerWrapper crosshairs="bottom">
          <div className="ending-dot-grid h-20 sm:h-24" aria-hidden />
        </ContainerWrapper>
      </div>
    </footer>
  )
}
