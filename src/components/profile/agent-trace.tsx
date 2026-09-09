"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "motion/react"
import { cn } from "@/lib/utils"
import { playSound } from "@/lib/sounds"
import { HeaderTitle } from "./header-title"

type StepKind = "thinking" | "tool" | "observation" | "answer"

type Step = {
  kind: StepKind
  text: string
}

type Scenario = {
  id: string
  prompt: string
  steps: Step[]
}

// ponytail: hand-written, not a live model call — the point is showing how
// the reasoning goes, not burning API calls on every portfolio pageview.
// Labeled clearly in the UI as a simulated trace.
const SCENARIOS: Scenario[] = [
  {
    id: "rag-hallucination",
    prompt: "How do you reduce hallucination in a RAG pipeline?",
    steps: [
      {
        kind: "thinking",
        text: "Hallucination usually means the model answered from parametric memory instead of the retrieved context.",
      },
      { kind: "tool", text: 'retrieve(query="...", top_k=5)' },
      { kind: "observation", text: "5 chunks retrieved, top similarity 0.81." },
      {
        kind: "thinking",
        text: "Anything below ~0.6 similarity isn't trustworthy enough to answer from.",
      },
      {
        kind: "answer",
        text: "Ground every claim in a retrieved chunk, cite the source, and fall back to \"I don't know\" below the similarity threshold instead of letting the model improvise.",
      },
    ],
  },
  {
    id: "multi-agent",
    prompt: "How would you design a multi-agent workflow?",
    steps: [
      {
        kind: "thinking",
        text: "Split by responsibility, not by agent count — more agents isn't automatically better.",
      },
      { kind: "tool", text: 'plan(task="...")' },
      { kind: "observation", text: "3 sub-tasks identified: research, draft, verify." },
      {
        kind: "thinking",
        text: "A verifier with a narrower system prompt catches errors the drafting agent is blind to.",
      },
      {
        kind: "answer",
        text: "One planner, one specialist per sub-task, one verifier with veto power. Keep the loop short — long chains compound errors.",
      },
    ],
  },
  {
    id: "flaky-eval",
    prompt: "An LLM eval is flaky. How do you debug it?",
    steps: [
      {
        kind: "thinking",
        text: "Flaky usually means non-determinism somewhere — temperature, tool timing, or the eval itself.",
      },
      { kind: "tool", text: "run_eval(seed=42, n=10)" },
      { kind: "observation", text: "7/10 pass — inconsistent, not just occasionally wrong." },
      {
        kind: "thinking",
        text: "Pin temperature to 0 and rerun before touching the prompt at all.",
      },
      {
        kind: "answer",
        text: "Isolate the variance first: fixed seed, fixed temperature, logged intermediate steps. Most \"flaky prompt\" bugs are actually flaky harnesses.",
      },
    ],
  },
]

const STEP_META: Record<StepKind, { label: string; icon: string; className: string }> = {
  thinking: {
    label: "Thinking",
    icon: "\u{1F9E0}",
    className: "text-muted-foreground",
  },
  tool: {
    label: "Tool Call",
    icon: "\u{1F527}",
    className: "text-primary",
  },
  observation: {
    label: "Observation",
    icon: "\u{1F4C4}",
    className: "text-muted-foreground",
  },
  answer: {
    label: "Answer",
    icon: "✅",
    className: "text-primary font-semibold",
  },
}

export function AgentTrace() {
  const [activeId, setActiveId] = useState(SCENARIOS[0].id)
  const [replayKey, setReplayKey] = useState(0)

  const active = SCENARIOS.find((s) => s.id === activeId) ?? SCENARIOS[0]

  const selectScenario = (id: string) => {
    if (id === activeId) {
      setReplayKey((k) => k + 1)
    } else {
      setActiveId(id)
      setReplayKey((k) => k + 1)
    }
    playSound("tickOn")
  }

  return (
    <section className="w-full">
      <HeaderTitle title="Agent Trace" />
      <div className="space-y-3 px-4 py-4 sm:px-6">
        <p className="text-muted-foreground max-w-2xl text-xs leading-relaxed sm:text-sm">
          A simulated trace of how I actually reason through agent-design
          questions — hand-written, not a live model call. Pick one:
        </p>

        <div className="flex flex-wrap gap-2">
          {SCENARIOS.map((s) => (
            <button
              key={s.id}
              type="button"
              onClick={() => selectScenario(s.id)}
              className={cn(
                "font-pixelify rounded-md border px-2.5 py-1 text-[11px] transition-colors sm:text-xs",
                s.id === activeId
                  ? "border-primary text-primary"
                  : "border-edge text-muted-foreground hover:text-primary"
              )}
            >
              {s.prompt}
            </button>
          ))}
        </div>

        <div className="border-edge bg-card/50 overflow-hidden rounded-md border">
          <div className="border-edge text-muted-foreground border-b px-3 py-2 font-mono text-[11px] sm:text-xs">
            &gt; {active.prompt}
          </div>
          <div className="p-3">
            <AnimatePresence mode="wait">
              <motion.div
                key={`${active.id}-${replayKey}`}
                className="space-y-2.5"
              >
                {active.steps.map((step, i) => {
                  const meta = STEP_META[step.kind]
                  return (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, x: -8 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{
                        delay: i * 0.4,
                        duration: 0.3,
                        ease: "easeOut",
                      }}
                      className={cn(
                        "flex items-start gap-2 font-mono text-[11px] leading-relaxed sm:text-xs",
                        meta.className
                      )}
                    >
                      <span className="shrink-0">{meta.icon}</span>
                      <span className="shrink-0 font-semibold">
                        [{meta.label}]
                      </span>
                      <span>{step.text}</span>
                    </motion.div>
                  )
                })}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  )
}
