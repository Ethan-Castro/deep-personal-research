"use client"

import { useResearchState } from "@/hooks/useResearchState"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  Target, TrendingUp, BookOpen, DollarSign, Users, Lightbulb, Route, Star,
  GraduationCap, CheckCircle2, Circle, ArrowUpRight,
} from "lucide-react"
import { EvidenceBadge } from "./EvidenceBadge"
import type { CareerGuideSection, CareerPath } from "@/lib/types"

const iconMap = {
  target: Target,
  trending: TrendingUp,
  book: BookOpen,
  dollar: DollarSign,
  users: Users,
  lightbulb: Lightbulb,
  route: Route,
  star: Star,
} as const

function MatchBar({ score }: { score: number }) {
  const color =
    score >= 80 ? "bg-emerald-500" : score >= 60 ? "bg-amber-500" : "bg-red-500"
  return (
    <div className="flex items-center gap-2">
      <div className="h-1.5 flex-1 rounded-full bg-muted">
        <div
          className={`h-full rounded-full ${color} transition-all`}
          style={{ width: `${score}%` }}
        />
      </div>
      <span className="text-[11px] font-semibold tabular-nums">{score}%</span>
    </div>
  )
}

function PathCard({ path, rank }: { path: CareerPath; rank: number }) {
  const medals = ["bg-amber-500/10 border-amber-500/30", "bg-slate-400/10 border-slate-400/30", "bg-orange-700/10 border-orange-700/30"]
  const borderClass = medals[rank] ?? "bg-card border-border"

  return (
    <div className={`rounded-xl border p-4 ${borderClass}`}>
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <span className="text-sm font-bold">{path.title}</span>
            {rank === 0 && (
              <span className="rounded-full bg-amber-500/20 px-2 py-0.5 text-[9px] font-semibold text-amber-400">
                TOP MATCH
              </span>
            )}
          </div>
          <div className="mt-1 flex items-center gap-3 text-[11px] text-muted-foreground">
            <span className="flex items-center gap-1">
              <DollarSign className="h-3 w-3" />{path.salary}
            </span>
            <span className="flex items-center gap-1">
              <TrendingUp className="h-3 w-3" />{path.growthOutlook}
            </span>
          </div>
        </div>
      </div>

      <div className="mt-2">
        <MatchBar score={path.matchScore} />
      </div>

      <p className="mt-2 text-xs leading-relaxed text-muted-foreground">{path.description}</p>

      <div className="mt-3 flex flex-wrap gap-1.5">
        {path.requiredSkills.map((skill) => (
          <span
            key={skill}
            className={`rounded-full px-2 py-0.5 text-[10px] font-medium ${
              path.gapSkills.includes(skill)
                ? "border border-red-500/30 bg-red-500/10 text-red-400"
                : "bg-emerald-500/10 text-emerald-400"
            }`}
          >
            {skill}
            {path.gapSkills.includes(skill) && " ↑"}
          </span>
        ))}
        {path.gapSkills
          .filter((s) => !path.requiredSkills.includes(s))
          .map((skill) => (
            <span
              key={skill}
              className="rounded-full border border-red-500/30 bg-red-500/10 px-2 py-0.5 text-[10px] font-medium text-red-400"
            >
              {skill} ↑
            </span>
          ))}
      </div>
    </div>
  )
}

function GuideSection({ section }: { section: CareerGuideSection }) {
  const Icon = iconMap[section.icon] ?? Lightbulb

  return (
    <div className="rounded-xl border border-border bg-card p-4">
      <div className="flex items-center gap-2 mb-2">
        <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary/10">
          <Icon className="h-3.5 w-3.5 text-primary" />
        </div>
        <h3 className="text-sm font-semibold">{section.title}</h3>
      </div>
      <div className="text-sm leading-relaxed text-muted-foreground">
        {section.content.split("\n").map((para, i) =>
          para.trim() ? <p key={i} className="mb-2 last:mb-0">{para}</p> : null
        )}
      </div>
    </div>
  )
}

export function CareerGuideView() {
  const careerGuide = useResearchState((s) => s.careerGuide)
  const status = useResearchState((s) => s.status)

  if (!careerGuide) {
    if (status === "writing" || status === "complete") {
      return (
        <div className="flex h-full items-center justify-center p-4">
          <div className="text-center">
            <GraduationCap className="mx-auto mb-2 h-8 w-8 animate-pulse text-muted-foreground" />
            <p className="text-sm text-muted-foreground">Generating career guide...</p>
          </div>
        </div>
      )
    }
    return null
  }

  const priorityColors = {
    high: "text-red-400",
    medium: "text-amber-400",
    low: "text-muted-foreground",
  }

  return (
    <ScrollArea className="h-full">
      <div className="space-y-6 p-4">
        {/* Hero */}
        <div className="rounded-xl bg-gradient-to-br from-blue-600/20 to-blue-900/20 border border-blue-500/20 p-5">
          <h2 className="text-lg font-bold">{careerGuide.headline}</h2>
          <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{careerGuide.summary}</p>
        </div>

        {/* Career Paths */}
        <div>
          <h3 className="mb-3 text-xs font-medium uppercase tracking-wider text-muted-foreground flex items-center gap-2">
            <Route className="h-3.5 w-3.5" />
            Career Paths
          </h3>
          <div className="space-y-3">
            {careerGuide.paths
              .sort((a, b) => b.matchScore - a.matchScore)
              .map((path, i) => (
                <PathCard key={i} path={path} rank={i} />
              ))}
          </div>
        </div>

        {/* Sections */}
        <div className="space-y-3">
          {careerGuide.sections.map((section) => (
            <GuideSection key={section.id} section={section} />
          ))}
        </div>

        {/* Action Items */}
        {careerGuide.actionItems.length > 0 && (
          <div>
            <h3 className="mb-3 text-xs font-medium uppercase tracking-wider text-muted-foreground flex items-center gap-2">
              <CheckCircle2 className="h-3.5 w-3.5" />
              Action Plan
            </h3>
            <div className="space-y-2">
              {careerGuide.actionItems.map((item, i) => (
                <div
                  key={i}
                  className="flex items-start gap-3 rounded-lg border border-border bg-card px-3 py-2.5"
                >
                  <Circle className={`mt-0.5 h-3.5 w-3.5 shrink-0 ${priorityColors[item.priority]}`} />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm">{item.text}</p>
                    <div className="mt-0.5 flex items-center gap-2 text-[10px] text-muted-foreground">
                      <span className={`font-medium uppercase ${priorityColors[item.priority]}`}>
                        {item.priority}
                      </span>
                      <span>&middot;</span>
                      <span>{item.timeline}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Citations */}
        {careerGuide.citations.length > 0 && (
          <div className="border-t border-border pt-4">
            <h3 className="mb-2 text-xs font-medium uppercase tracking-wider text-muted-foreground">
              References
            </h3>
            <ol className="space-y-1">
              {careerGuide.citations.map((cite, i) => (
                <li key={i} className="flex gap-2 text-[11px] text-muted-foreground">
                  <span className="font-mono">[{i + 1}]</span>
                  <span>
                    {cite.title}
                    {cite.url && (
                      <>
                        {" "}
                        <a href={cite.url} target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline">
                          Link
                        </a>
                      </>
                    )}
                    <EvidenceBadge grade={cite.evidenceGrade} />
                  </span>
                </li>
              ))}
            </ol>
          </div>
        )}
      </div>
    </ScrollArea>
  )
}
