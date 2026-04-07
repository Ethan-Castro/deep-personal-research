"use client"

import { useResearchState } from "@/hooks/useResearchState"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Dumbbell, Clock, RotateCcw, ChevronDown, ChevronUp, Flame, Pill, TrendingUp } from "lucide-react"
import { useState } from "react"
import { EvidenceBadge } from "./EvidenceBadge"
import type { WorkoutDay, WorkoutExercise } from "@/lib/types"

function ExerciseRow({ exercise, index }: { exercise: WorkoutExercise; index: number }) {
  return (
    <div className="flex items-center gap-3 rounded-lg bg-background/50 px-3 py-2.5">
      <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary/10 text-[10px] font-bold text-primary">
        {index + 1}
      </span>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium truncate">{exercise.name}</span>
          {exercise.evidenceGrade && (
            <EvidenceBadge grade={exercise.evidenceGrade} />
          )}
        </div>
        {exercise.notes && (
          <p className="mt-0.5 text-[11px] text-muted-foreground truncate">{exercise.notes}</p>
        )}
      </div>
      <div className="flex shrink-0 items-center gap-3 text-xs text-muted-foreground">
        <span className="flex items-center gap-1">
          <Dumbbell className="h-3 w-3" />
          {exercise.sets}×{exercise.reps}
        </span>
        <span className="flex items-center gap-1">
          <Clock className="h-3 w-3" />
          {exercise.restSeconds >= 60
            ? `${Math.floor(exercise.restSeconds / 60)}m${exercise.restSeconds % 60 ? ` ${exercise.restSeconds % 60}s` : ""}`
            : `${exercise.restSeconds}s`}
        </span>
      </div>
    </div>
  )
}

function DayCard({ day, dayIndex }: { day: WorkoutDay; dayIndex: number }) {
  const [expanded, setExpanded] = useState(dayIndex === 0)

  const dayColors = [
    "border-emerald-500/30 bg-emerald-500/5",
    "border-blue-500/30 bg-blue-500/5",
    "border-amber-500/30 bg-amber-500/5",
    "border-pink-500/30 bg-pink-500/5",
    "border-purple-500/30 bg-purple-500/5",
    "border-cyan-500/30 bg-cyan-500/5",
    "border-red-500/30 bg-red-500/5",
  ]

  return (
    <div className={`rounded-xl border ${dayColors[dayIndex % dayColors.length]} overflow-hidden`}>
      <button
        onClick={() => setExpanded(!expanded)}
        className="flex w-full items-center justify-between px-4 py-3 text-left"
      >
        <div>
          <h3 className="text-sm font-semibold">{day.dayName}</h3>
          <p className="mt-0.5 text-[11px] text-muted-foreground">{day.focus}</p>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[10px] text-muted-foreground">
            {day.exercises.length} exercises
          </span>
          {expanded ? (
            <ChevronUp className="h-4 w-4 text-muted-foreground" />
          ) : (
            <ChevronDown className="h-4 w-4 text-muted-foreground" />
          )}
        </div>
      </button>

      {expanded && (
        <div className="space-y-1.5 px-3 pb-3">
          {day.warmup && (
            <div className="flex items-center gap-2 rounded-lg bg-orange-500/5 px-3 py-1.5 text-[11px] text-orange-400">
              <Flame className="h-3 w-3" />
              <span className="font-medium">Warmup:</span> {day.warmup}
            </div>
          )}

          {day.exercises.map((exercise, i) => (
            <ExerciseRow key={i} exercise={exercise} index={i} />
          ))}

          {day.cooldown && (
            <div className="flex items-center gap-2 rounded-lg bg-blue-500/5 px-3 py-1.5 text-[11px] text-blue-400">
              <RotateCcw className="h-3 w-3" />
              <span className="font-medium">Cooldown:</span> {day.cooldown}
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export function WorkoutPlanView() {
  const workoutPlan = useResearchState((s) => s.workoutPlan)
  const status = useResearchState((s) => s.status)

  if (!workoutPlan) {
    if (status === "writing" || status === "complete") {
      return (
        <div className="flex h-full items-center justify-center p-4">
          <div className="text-center">
            <Dumbbell className="mx-auto mb-2 h-8 w-8 animate-pulse text-muted-foreground" />
            <p className="text-sm text-muted-foreground">Generating workout plan...</p>
          </div>
        </div>
      )
    }
    return null
  }

  return (
    <ScrollArea className="h-full">
      <div className="space-y-6 p-4">
        {/* Header */}
        <div>
          <h2 className="text-lg font-bold">{workoutPlan.title}</h2>
          <p className="mt-1 text-sm text-muted-foreground">{workoutPlan.overview}</p>
        </div>

        {/* Periodization & Progression */}
        <div className="grid grid-cols-1 gap-3">
          {workoutPlan.periodization && (
            <div className="rounded-lg border border-border bg-card p-3">
              <div className="flex items-center gap-2 text-xs font-medium text-muted-foreground mb-1">
                <TrendingUp className="h-3.5 w-3.5" />
                Periodization
              </div>
              <p className="text-sm">{workoutPlan.periodization}</p>
            </div>
          )}
          {workoutPlan.progressionScheme && (
            <div className="rounded-lg border border-border bg-card p-3">
              <div className="flex items-center gap-2 text-xs font-medium text-muted-foreground mb-1">
                <TrendingUp className="h-3.5 w-3.5" />
                Progression
              </div>
              <p className="text-sm">{workoutPlan.progressionScheme}</p>
            </div>
          )}
        </div>

        {/* Weekly Schedule */}
        <div className="space-y-3">
          <h3 className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
            Weekly Schedule
          </h3>
          {workoutPlan.weeklySchedule.map((day, i) => (
            <DayCard key={i} day={day} dayIndex={i} />
          ))}
        </div>

        {/* Nutrition */}
        {workoutPlan.nutritionNotes && (
          <div className="rounded-lg border border-border bg-card p-4">
            <div className="flex items-center gap-2 text-xs font-medium text-muted-foreground mb-2">
              <Flame className="h-3.5 w-3.5" />
              Nutrition Guidelines
            </div>
            <p className="text-sm leading-relaxed">{workoutPlan.nutritionNotes}</p>
          </div>
        )}

        {/* Supplements */}
        {workoutPlan.supplementNotes && (
          <div className="rounded-lg border border-border bg-card p-4">
            <div className="flex items-center gap-2 text-xs font-medium text-muted-foreground mb-2">
              <Pill className="h-3.5 w-3.5" />
              Supplement Recommendations
            </div>
            <p className="text-sm leading-relaxed">{workoutPlan.supplementNotes}</p>
          </div>
        )}

        {/* Citations */}
        {workoutPlan.citations.length > 0 && (
          <div className="border-t border-border pt-4">
            <h3 className="mb-2 text-xs font-medium uppercase tracking-wider text-muted-foreground">
              References
            </h3>
            <ol className="space-y-1">
              {workoutPlan.citations.map((cite, i) => (
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
