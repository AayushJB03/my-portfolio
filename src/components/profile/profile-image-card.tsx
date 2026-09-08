import Image from "next/image"
import { USER } from "@/data"
import { cn } from "@/lib/utils"

export function ProfileImageCard({
  avatarUrl,
  className,
  alt = `${USER.fullName}'s profile picture`,
  size = 160,
}: {
  avatarUrl: string
  className?: string
  alt?: string
  size?: number
}) {
  const quote = "Simply lovely...!"

  return (
    <section
      aria-label={`${USER.fullName} profile signature`}
      className={cn(
        "border-edge relative isolate my-8 overflow-hidden rounded-[8px] border bg-[#11100d] text-zinc-50 shadow-[0_18px_60px_rgb(0_0_0/0.18)] dark:bg-[#090908]",
        className
      )}
    >
      <div className="relative flex min-h-[21rem] items-center justify-center px-5 py-12 sm:min-h-[24rem] sm:px-8 md:px-12">
        <Image
          src="/assets/profile-cloud-halftone-4k.webp"
          alt=""
          fill
          sizes="(min-width: 896px) 56rem, 100vw"
          className="pointer-events-none -z-30 object-cover object-center opacity-80 contrast-125 saturate-[0.72] select-none dark:opacity-70"
        />
        <div className="absolute inset-0 -z-20 bg-[linear-gradient(180deg,rgb(8_8_7/0.42),rgb(8_8_7/0.74)),radial-gradient(circle_at_50%_48%,rgb(255_244_214/0.2),transparent_45%)]" />
        <div className="absolute inset-x-0 top-0 -z-10 h-px bg-gradient-to-r from-transparent via-amber-100/55 to-transparent" />
        <div className="absolute inset-x-5 bottom-5 -z-10 h-px bg-gradient-to-r from-transparent via-zinc-100/20 to-transparent sm:inset-x-8" />

        <div className="mx-auto flex w-full max-w-2xl flex-col items-center text-center">
          <Image
            src={avatarUrl}
            alt={alt}
            width={size}
            height={size}
            className="border-edge/60 size-20 rounded-[8px] border object-cover object-center shadow-[0_12px_38px_rgb(0_0_0/0.35)] grayscale-[18%] sm:size-24"
          />

          <p className="mt-7 font-mono text-[10px] leading-none font-semibold text-amber-100/70 uppercase">
            profile
          </p>
          <h2 className="font-pixelify mt-3 text-3xl leading-none font-bold text-balance text-zinc-50 sm:text-5xl md:text-6xl">
            {USER.name}
          </h2>
          <blockquote className="font-bitcount mt-6 max-w-xl text-center text-lg leading-snug font-semibold text-balance text-amber-100 sm:text-2xl md:text-3xl">
            <span aria-hidden="true" className="text-zinc-50/45">
              &quot;
            </span>
            {quote}
            <span aria-hidden="true" className="text-zinc-50/45">
              &quot;
            </span>
          </blockquote>
        </div>
      </div>
    </section>
  )
}
