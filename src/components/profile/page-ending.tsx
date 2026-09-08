import { CrosshairMark } from "../ui/crosshair"
import { QuoteLoop } from "./quote-loop"

export const PageEnding = () => {
  return (
    <div className="relative">
      <CrosshairMark className="bottom-0 left-0 -translate-x-1/2 translate-y-1/2" />
      <CrosshairMark className="bottom-0 right-0 translate-x-1/2 translate-y-1/2" />
      <section className="bg-background px-5 py-6 text-foreground transition-colors duration-200 sm:px-8 sm:py-8">
        <div className="mx-auto flex max-w-[560px] flex-col items-center text-center">
          <span
            className="mb-4 font-serif text-4xl leading-none font-black text-muted-foreground"
            aria-hidden
          >
            &rdquo;&rdquo;
          </span>

          <QuoteLoop />
        </div>
      </section>
    </div>
  )
}
