import { getModel } from "@/lib/models"
import { HumanMessage, SystemMessage } from "@langchain/core/messages"
import type { Finding, Insight, ResearchBrief, WorkoutPlan, WorkoutDay } from "@/lib/types"
import type { EmitFn } from "@/lib/events"
import { createEvent } from "@/lib/events"

const WORKOUT_PLAN_PROMPT = `You are the Workout Plan Generator for Personal PI. You produce a structured, evidence-based workout plan from research findings and insights.

Your workout plan must be:
1. Personalized — tailored to the user's training experience, goals, body metrics, and health conditions
2. Evidence-graded — cite evidence grades for programming choices (e.g. rep ranges, volume, frequency)
3. Specific — exact exercises, sets, reps, rest periods. Not vague.
4. Progressive — include a clear progression scheme

Output a SINGLE JSON object with this exact structure:
{
  "title": "8-Week Hypertrophy Program for [Name]",
  "overview": "Brief overview of the program philosophy and why it suits this user",
  "periodization": "e.g. Linear periodization with weekly progressive overload",
  "weeklySchedule": [
    {
      "dayName": "Day 1 — Push",
      "focus": "Chest, Shoulders, Triceps",
      "warmup": "5 min incline walk, arm circles, band pull-aparts",
      "exercises": [
        {
          "name": "Barbell Bench Press",
          "sets": 4,
          "reps": "6-8",
          "restSeconds": 180,
          "notes": "Progressive overload: add 5lb when hitting 4x8",
          "evidenceGrade": "A"
        }
      ],
      "cooldown": "Static stretching, 5 min"
    }
  ],
  "nutritionNotes": "Brief nutrition guidance based on their goals and body metrics",
  "supplementNotes": "Evidence-based supplement recommendations if relevant",
  "progressionScheme": "Detailed progression rules",
  "citations": [{"title": "...", "url": "...", "evidenceGrade": "A"}]
}

Design a full week (typically 3-6 training days depending on experience level). Be specific with exercise selection based on the user's goals, experience, and any limitations.`

export async function writeWorkoutPlan(
  findings: Finding[],
  insights: Insight[],
  brief: ResearchBrief,
  sessionId: string,
  emit: EmitFn
): Promise<WorkoutPlan> {
  emit(
    createEvent("agent_spawned", "workout_plan_writer", {
      name: "workout_plan_writer",
      role: "Workout Plan Writer",
      team: "synthesis",
      description: "Generating personalized workout plan",
    })
  )

  const model = getModel("reportWriter")

  const healthProfile = brief.userProfile.healthProfile
  const profileText = healthProfile
    ? `Age: ${healthProfile.age}, Sex: ${healthProfile.sex}, Weight: ${healthProfile.weight}lbs, Height: ${healthProfile.height}in
Activity Level: ${healthProfile.activityLevel}, Training Experience: ${healthProfile.trainingExperience}
Goals: ${healthProfile.fitnessGoals.join(", ")}
Health Conditions: ${healthProfile.healthConditions.join(", ") || "None"}
Medications: ${healthProfile.medications.join(", ") || "None"}
Dietary Preferences: ${healthProfile.dietaryPreferences.join(", ") || "None"}
Current Program: ${healthProfile.currentProgram || "None specified"}
Genetic Heritage: ${healthProfile.geneticHeritage.join(", ") || "Not specified"}`
    : "No health profile available"

  const insightsText = insights
    .filter((i) => i.domain === "health" || i.domain === "cross_domain")
    .map((ins) => `[${ins.evidenceGrade}] ${ins.title}: ${ins.content}`)
    .join("\n\n")

  const findingsText = findings
    .filter((f) => f.sourceType === "pubmed" || f.sourceType === "exa")
    .slice(0, 20)
    .map((f) => `[${f.evidenceGrade}] ${f.title} — ${f.summary.slice(0, 150)}`)
    .join("\n")

  emit(
    createEvent("agent_thinking", "workout_plan_writer", {
      thought: "Designing personalized workout program...",
      step: 1,
    })
  )

  const response = await model.invoke([
    new SystemMessage(WORKOUT_PLAN_PROMPT),
    new HumanMessage(
      `User: ${brief.userProfile.name}
${profileText}

RESEARCH INSIGHTS:
${insightsText}

SUPPORTING FINDINGS:
${findingsText}

Generate the workout plan as a single JSON object.`
    ),
  ])

  const text = typeof response.content === "string" ? response.content : ""

  // Extract JSON from response
  let parsed: Record<string, unknown> = {}
  const jsonMatch = text.match(/\{[\s\S]*\}/)
  if (jsonMatch) {
    try {
      parsed = JSON.parse(jsonMatch[0])
    } catch {
      // Try to extract just the first complete JSON object
      let depth = 0
      let start = text.indexOf("{")
      for (let i = start; i < text.length; i++) {
        if (text[i] === "{") depth++
        if (text[i] === "}") depth--
        if (depth === 0) {
          try {
            parsed = JSON.parse(text.slice(start, i + 1))
          } catch {
            // Fall through to fallback
          }
          break
        }
      }
    }
  }

  const weeklySchedule: WorkoutDay[] = Array.isArray(parsed.weeklySchedule)
    ? (parsed.weeklySchedule as Record<string, unknown>[]).map((day) => ({
        dayName: String(day.dayName ?? "Training Day"),
        focus: String(day.focus ?? ""),
        exercises: Array.isArray(day.exercises)
          ? (day.exercises as Record<string, unknown>[]).map((ex) => ({
              name: String(ex.name ?? "Exercise"),
              sets: Number(ex.sets ?? 3),
              reps: String(ex.reps ?? "8-12"),
              restSeconds: Number(ex.restSeconds ?? 90),
              notes: ex.notes ? String(ex.notes) : undefined,
              evidenceGrade: ex.evidenceGrade ? (String(ex.evidenceGrade) as "A" | "B" | "C" | "D" | "F") : undefined,
            }))
          : [],
        warmup: day.warmup ? String(day.warmup) : undefined,
        cooldown: day.cooldown ? String(day.cooldown) : undefined,
      }))
    : []

  const plan: WorkoutPlan = {
    id: `workout_${sessionId}`,
    sessionId,
    title: String(parsed.title ?? `Workout Plan for ${brief.userProfile.name}`),
    overview: String(parsed.overview ?? ""),
    periodization: String(parsed.periodization ?? ""),
    weeklySchedule,
    nutritionNotes: parsed.nutritionNotes ? String(parsed.nutritionNotes) : undefined,
    supplementNotes: parsed.supplementNotes ? String(parsed.supplementNotes) : undefined,
    progressionScheme: String(parsed.progressionScheme ?? ""),
    citations: Array.isArray(parsed.citations)
      ? (parsed.citations as Record<string, unknown>[]).map((c) => ({
          title: String(c.title ?? ""),
          url: c.url ? String(c.url) : undefined,
          evidenceGrade: (String(c.evidenceGrade ?? "C") as "A" | "B" | "C" | "D" | "F"),
        }))
      : [],
    createdAt: Date.now(),
  }

  emit(
    createEvent("workout_plan_generated", "workout_plan_writer", {
      workoutPlan: plan,
    })
  )

  emit(
    createEvent("agent_complete", "workout_plan_writer", {
      summary: `Generated ${plan.weeklySchedule.length}-day workout plan`,
      findingsCount: plan.weeklySchedule.length,
      durationMs: 0,
    })
  )

  return plan
}
