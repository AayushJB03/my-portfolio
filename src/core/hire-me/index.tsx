import { cn } from "@/lib/utils"
import Image from "next/image"

export const HireMe = () => {
  return (
    <div className={cn("fixed right-0 bottom-6 z-50")}>
      <Image
        src="/bloub/bloub-my-cycle.gif"
        alt="Aayush Bhadbhade"
        width={64}
        height={64}
        unoptimized
        className={cn("size-16")}
      />
    </div>
  )
}