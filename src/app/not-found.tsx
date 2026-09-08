"use client"

import { ContainerWrapper } from "@/components/site/container"
import { Separator } from "@/components/profile/separator"
import { Button } from "@/components/ui/button"
import { SiteHeader } from "@/components/site/site-header"
import { SiteFooter } from "@/components/site/site-footer"
import Link from "next/link"
import { Terminal, Play, Home } from "lucide-react"
import { useState } from "react"
import { cn } from "@/lib/utils"
import { TextScramble } from "@/components/ui/text-scramble"

const Pixel4 = ({ className }: { className?: string }) => {
  const pixels = [
    [3, 0],
    [4, 0],
    [2, 1],
    [3, 1],
    [4, 1],
    [1, 2],
    [2, 2],
    [4, 2],
    [0, 3],
    [1, 3],
    [4, 3],
    [0, 4],
    [1, 4],
    [2, 4],
    [3, 4],
    [4, 4],
    [5, 4],
    [4, 5],
    [4, 6],
    [4, 7],
  ]
  return (
    <svg viewBox="0 0 6 8" className={cn("fill-current", className)}>
      {pixels.map(([x, y], i) => (
        <rect key={i} x={x} y={y} width={1} height={1} />
      ))}
    </svg>
  )
}

const PixelDocument = ({ className }: { className?: string }) => {
  const pixels: [number, number][] = []

  for (let y = 0; y < 13; y++) {
    for (let x = 0; x < 11; x++) {
      // Skip top-left fold corner (black)
      if (y === 0 && x <= 2) continue
      if (y === 1 && x <= 1) continue
      if (y === 2 && x <= 0) continue

      // Skip fold separation line (black)
      if (x === 3 && y <= 2) continue

      // Skip Left Eye (dead 'x')
      if (y === 5 && (x === 2 || x === 4)) continue
      if (y === 6 && x === 3) continue
      if (y === 7 && (x === 2 || x === 4)) continue

      // Skip Right Eye (dead 'x')
      if (y === 5 && (x === 6 || x === 8)) continue
      if (y === 6 && x === 7) continue
      if (y === 7 && (x === 6 || x === 8)) continue

      // Skip Sad Mouth
      if (y === 9 && (x === 4 || x === 5 || x === 6)) continue
      if (y === 10 && (x === 3 || x === 7)) continue

      pixels.push([x, y])
    }
  }

  return (
    <svg viewBox="0 0 11 13" className={cn("fill-current", className)}>
      {pixels.map(([x, y], i) => (
        <rect key={i} x={x} y={y} width={1} height={1} />
      ))}
    </svg>
  )
}

export default function NotFound() {
  const [logs, setLogs] = useState<string[]>([
    "[SYSTEM] Booting portfolio core v1.0.4...",
    "[INFO] Verifying routing protocols...",
    "[ERROR] Route lookup failed: 404 PAGE_NOT_FOUND",
  ])
  const [diagnosticRan, setDiagnosticRan] = useState(false)
  const [isTyping, setIsTyping] = useState(false)

  const runDiagnostics = () => {
    if (isTyping || diagnosticRan) return
    setIsTyping(true)

    const newLogs = [
      "aayush@portfolio:~$ ./diagnose_agent.sh",
      "[INFO] Checking LLM endpoint... OK",
      "[INFO] Pinging vector store... OK (12ms)",
      "[WARN] Server status: route is currently offline",
      "[SUCCESS] Rebooting routing services...",
      "[INFO] System ready. Recommendation: Go back home.",
    ]

    let currentLogIndex = 0
    const interval = setInterval(() => {
      if (currentLogIndex < newLogs.length) {
        setLogs((prev) => [...prev, newLogs[currentLogIndex]])
        currentLogIndex++
      } else {
        clearInterval(interval)
        setIsTyping(false)
        setDiagnosticRan(true)
      }
    }, 600)
  }

  return (
    <>
      <SiteHeader />
      <main className="w-full overflow-x-hidden">
        <ContainerWrapper>
          <Separator />
          <div className="flex w-full flex-col items-center justify-center px-4 py-12 select-none md:py-20">
            {/* Pixel Art 404 Illustration */}
            <div className="mb-10 flex flex-col items-center justify-center">
              <div className="flex items-center gap-5 md:gap-7">
                <Pixel4 className="text-primary/90 h-16 w-12 md:h-24 md:w-18" />
                <PixelDocument className="text-primary/90 h-22 w-18 md:h-32 md:w-26" />
                <Pixel4 className="text-primary/90 h-16 w-12 md:h-24 md:w-18" />
              </div>
              <TextScramble
                as="h1"
                className="font-pixelify text-primary mt-6 text-xl tracking-[0.25em] uppercase md:text-2xl"
              >
                page not found
              </TextScramble>
              <p className="text-muted-foreground mt-2 max-w-xs text-center text-xs tracking-wide uppercase sm:max-w-sm">
                Route Not Resolved / Lost in Production
              </p>
            </div>

            {/* Terminal Block */}
            <div className="mb-10 flex w-full max-w-lg flex-col items-center gap-6">
              <div className="border-edge w-full overflow-hidden rounded-lg border bg-neutral-50 font-mono text-xs shadow-sm sm:text-sm dark:bg-zinc-950">
                {/* Header */}
                <div className="border-edge flex items-center justify-between border-b bg-neutral-100 px-4 py-2.5 select-none dark:bg-zinc-900">
                  <div className="flex items-center gap-1.5">
                    <span className="h-3 w-3 rounded-full bg-red-500/80 dark:bg-red-500/60" />
                    <span className="h-3 w-3 rounded-full bg-yellow-500/80 dark:bg-yellow-500/60" />
                    <span className="h-3 w-3 rounded-full bg-green-500/80 dark:bg-green-500/60" />
                  </div>
                  <span className="text-muted-foreground flex items-center gap-1 text-[10px] font-semibold sm:text-xs">
                    <Terminal className="size-3" />
                    error_diagnostics.log
                  </span>
                  <div className="w-12" /> {/* spacer */}
                </div>

                {/* Terminal Body */}
                <div className="max-h-[270px] min-h-[170px] space-y-2.5 overflow-y-auto bg-white p-4 text-zinc-700 dark:bg-zinc-950 dark:text-zinc-300">
                  {logs.map((log, index) => {
                    let colorClass = "text-zinc-500 dark:text-zinc-400"
                    if (log.startsWith("[ERROR]")) {
                      colorClass = "text-red-500 font-bold"
                    } else if (log.startsWith("[SUCCESS]")) {
                      colorClass = "text-green-500 font-bold"
                    } else if (log.startsWith("[WARN]")) {
                      colorClass =
                        "text-yellow-500 dark:text-yellow-400 font-bold"
                    } else if (log.startsWith("aayush@")) {
                      colorClass =
                        "text-blue-500 dark:text-sky-400 font-semibold"
                    }
                    return (
                      <div key={index} className={colorClass}>
                        {log}
                      </div>
                    )
                  })}
                  {isTyping && (
                    <div className="animate-pulse text-zinc-400 dark:text-zinc-500">
                      System diagnosing... _
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex w-full flex-col items-center justify-center gap-4 sm:flex-row">
              <Button
                onClick={runDiagnostics}
                disabled={isTyping || diagnosticRan}
                variant="outline"
                className="border-edge bg-background hover:bg-accent w-full cursor-pointer gap-2 sm:w-auto"
              >
                <Play className="size-4" />
                {diagnosticRan ? "Diagnostics Complete" : "Run Diagnostics"}
              </Button>

              <Button asChild className="w-full cursor-pointer gap-2 sm:w-auto">
                <Link href="/">
                  <Home className="size-4" />
                  Go Back Home
                </Link>
              </Button>
            </div>
          </div>
          <Separator />
        </ContainerWrapper>
      </main>
      <SiteFooter />
    </>
  )
}
