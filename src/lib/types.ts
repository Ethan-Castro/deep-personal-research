import { z } from "zod"

// === Evidence Grading ===
export const EvidenceGradeSchema = z.enum(["A", "B", "C", "D", "F"])
export type EvidenceGrade = z.infer<typeof EvidenceGradeSchema>
// A = meta-analysis/systematic review of RCTs
// B = multiple RCTs with consistent findings
// C = single RCT or strong observational study
// D = limited/preliminary evidence, pilot studies, case reports
// F = expert consensus, theoretical, or no direct evidence

// === User Profiles ===
export const HealthProfileSchema = z.object({
  age: z.number().min(13).max(120),
  sex: z.enum(["male", "female", "other"]),
  weight: z.number().positive().describe("in lbs"),
  height: z.number().positive().describe("in inches"),
  activityLevel: z.enum(["sedentary", "light", "moderate", "active", "very_active"]),
  healthConditions: z.array(z.string()).default([]),
  medications: z.array(z.string()).default([]),
  geneticHeritage: z
    .array(z.string())
    .default([])
    .describe("e.g. West African, Scandinavian, East Asian"),
  fitnessGoals: z.array(z.string()).min(1),
  dietaryPreferences: z.array(z.string()).default([]),
  trainingExperience: z.enum(["beginner", "intermediate", "advanced", "elite"]),
  currentProgram: z.string().optional(),
})
export type HealthProfile = z.infer<typeof HealthProfileSchema>

export const CareerProfileSchema = z.object({
  educationLevel: z.enum([
    "high_school",
    "associates",
    "bachelors",
    "masters",
    "doctorate",
    "other",
  ]),
  major: z.string().optional(),
  gpa: z.number().min(0).max(4).optional(),
  interests: z.array(z.string()).min(1),
  skills: z.array(z.string()).min(1),
  workExperience: z
    .array(
      z.object({
        title: z.string(),
        field: z.string(),
        years: z.number().min(0),
      })
    )
    .default([]),
  careerGoals: z.array(z.string()).min(1),
  personalityTraits: z.array(z.string()).default([]),
})
export type CareerProfile = z.infer<typeof CareerProfileSchema>

export const UserProfileSchema = z.object({
  name: z.string().min(1),
  healthProfile: HealthProfileSchema.optional(),
  careerProfile: CareerProfileSchema.optional(),
  uploadedDocuments: z
    .array(
      z.object({
        name: z.string(),
        content: z.string(),
        type: z.enum(["pdf", "csv", "text"]),
      })
    )
    .default([]),
})
export type UserProfile = z.infer<typeof UserProfileSchema>

// === Research Session ===
export type ResearchType = "health" | "career" | "both"

export const StartResearchSchema = z.object({
  userProfile: UserProfileSchema,
  researchType: z.enum(["health", "career", "both"]),
})
export type StartResearchInput = z.infer<typeof StartResearchSchema>

export interface ResearchBrief {
  researchType: ResearchType
  userProfile: UserProfile
  researchQuestions: string[]
  priorityAreas: string[]
}

export interface Finding {
  id: string
  agentId: string
  source: string
  sourceUrl?: string
  sourceType: "pubmed" | "exa" | "onet" | "bls" | "eric" | "other"
  evidenceGrade: EvidenceGrade
  title: string
  summary: string
  rawData?: unknown
  timestamp: number
}

export interface Insight {
  id: string
  title: string
  content: string
  supportingFindings: string[]
  evidenceGrade: EvidenceGrade
  domain: "health" | "career" | "cross_domain"
}

export interface ReportSection {
  sectionName: string
  content: string
  citations: Array<{
    title: string
    url?: string
    evidenceGrade: EvidenceGrade
  }>
  domain: "health" | "career" | "methodology" | "overview"
}

export interface Report {
  id: string
  sessionId: string
  title: string
  sections: ReportSection[]
  methodology: {
    databasesSearched: string[]
    papersReviewed: number
    searchQueries: string[]
    inclusionCriteria: string[]
  }
  createdAt: number
}

export interface SessionState {
  id: string
  userProfile: UserProfile
  researchType: ResearchType
  status: "pending" | "running" | "complete" | "error"
  brief?: ResearchBrief
  findings: Finding[]
  insights: Insight[]
  report?: Report
  createdAt: number
}
