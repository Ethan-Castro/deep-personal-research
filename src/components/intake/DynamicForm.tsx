"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft, Loader2, Upload, X, Sparkles } from "lucide-react"
import type { ResearchType } from "@/lib/types"

interface UploadedDoc {
  name: string
  content: string
  type: "pdf" | "csv" | "text"
}

interface ResearchDirection {
  id: string
  title: string
  description: string
}

interface DynamicFormProps {
  researchType: ResearchType
  onBack: () => void
}

export function DynamicForm({ researchType, onBack }: DynamicFormProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [name, setName] = useState("")

  // RFP-specific state
  const [rfpText, setRfpText] = useState("")
  const [directions, setDirections] = useState<ResearchDirection[]>([])
  const [generatingDirections, setGeneratingDirections] = useState(false)
  const [launchingDirection, setLaunchingDirection] = useState<string | null>(null)

  // Health fields
  const [age, setAge] = useState("")
  const [sex, setSex] = useState("")
  const [weight, setWeight] = useState("")
  const [height, setHeight] = useState("")
  const [activityLevel, setActivityLevel] = useState("")
  const [trainingExperience, setTrainingExperience] = useState("")
  const [fitnessGoals, setFitnessGoals] = useState("")
  const [geneticHeritage, setGeneticHeritage] = useState("")
  const [healthConditions, setHealthConditions] = useState("")
  const [medications, setMedications] = useState("")
  const [dietaryPreferences, setDietaryPreferences] = useState("")
  const [currentProgram, setCurrentProgram] = useState("")

  // Document uploads
  const [uploadedDocs, setUploadedDocs] = useState<UploadedDoc[]>([])

  async function handleFileUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const files = e.target.files
    if (!files) return

    for (const file of Array.from(files)) {
      const ext = file.name.split(".").pop()?.toLowerCase()
      const docType: UploadedDoc["type"] =
        ext === "pdf" ? "pdf" : ext === "csv" ? "csv" : "text"

      const content = await file.text()
      setUploadedDocs((prev) => [
        ...prev,
        { name: file.name, content, type: docType },
      ])
    }

    // Reset input so the same file can be re-selected
    e.target.value = ""
  }

  function removeDoc(index: number) {
    setUploadedDocs((prev) => prev.filter((_, i) => i !== index))
  }

  // Career fields
  const [educationLevel, setEducationLevel] = useState("")
  const [major, setMajor] = useState("")
  const [gpa, setGpa] = useState("")
  const [interests, setInterests] = useState("")
  const [skills, setSkills] = useState("")
  const [careerGoals, setCareerGoals] = useState("")
  const [personalityTraits, setPersonalityTraits] = useState("")
  const [workExperience, setWorkExperience] = useState("")

  const splitComma = (s: string) =>
    s
      .split(",")
      .map((x) => x.trim())
      .filter(Boolean)

  // Wrapper for shadcn Select which passes string | null
  const selectSetter = (setter: (v: string) => void) => (v: string | null) => setter(v ?? "")

  async function handleRfpSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!rfpText.trim() || !name.trim()) return
    setGeneratingDirections(true)

    try {
      const res = await fetch("/api/research/directions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ rfpText: rfpText.trim() }),
      })
      const data = await res.json()
      if (data.directions) {
        setDirections(data.directions)
      }
    } catch (err) {
      console.error("Failed to generate directions:", err)
    } finally {
      setGeneratingDirections(false)
    }
  }

  async function launchWithDirection(direction: ResearchDirection) {
    setLaunchingDirection(direction.id)

    const combinedRfp = `[Original Research Request]\n${rfpText.trim()}\n\n[Selected Research Direction]\n${direction.title}: ${direction.description}`

    try {
      const res = await fetch("/api/research/start", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userProfile: { name, rfpText: combinedRfp, uploadedDocuments: [] },
          researchType: "rfp",
        }),
      })
      const data = await res.json()
      if (data.sessionId) {
        router.push(`/research/${data.sessionId}`)
      }
    } catch (err) {
      console.error("Failed to start research:", err)
      setLaunchingDirection(null)
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)

    const userProfile: Record<string, unknown> = {
      name,
      uploadedDocuments: uploadedDocs,
    }

    if (researchType === "health" || researchType === "both") {
      userProfile.healthProfile = {
        age: Number(age),
        sex,
        weight: Number(weight),
        height: Number(height),
        activityLevel,
        trainingExperience,
        fitnessGoals: splitComma(fitnessGoals),
        geneticHeritage: splitComma(geneticHeritage),
        healthConditions: splitComma(healthConditions),
        medications: splitComma(medications),
        dietaryPreferences: splitComma(dietaryPreferences),
        currentProgram: currentProgram || undefined,
      }
    }

    if (researchType === "career" || researchType === "both") {
      userProfile.careerProfile = {
        educationLevel,
        major: major || undefined,
        gpa: gpa ? Number(gpa) : undefined,
        interests: splitComma(interests),
        skills: splitComma(skills),
        careerGoals: splitComma(careerGoals),
        personalityTraits: splitComma(personalityTraits),
        workExperience: workExperience
          ? splitComma(workExperience).map((exp) => {
              const parts = exp.split(" in ")
              return {
                title: parts[0] ?? exp,
                field: parts[1]?.split("(")[0]?.trim() ?? "",
                years: Number(parts[1]?.match(/\d+/)?.[0] ?? 0),
              }
            })
          : [],
      }
    }

    try {
      const res = await fetch("/api/research/start", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userProfile, researchType }),
      })
      const data = await res.json()
      if (data.sessionId) {
        router.push(`/research/${data.sessionId}`)
      }
    } catch (err) {
      console.error("Failed to start research:", err)
      setLoading(false)
    }
  }

  const showHealth = researchType === "health" || researchType === "both"
  const showCareer = researchType === "career" || researchType === "both"

  const healthForm = (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="age">Age</Label>
          <Input id="age" type="number" value={age} onChange={(e) => setAge(e.target.value)} placeholder="25" required />
        </div>
        <div>
          <Label htmlFor="sex">Sex</Label>
          <Select value={sex} onValueChange={selectSetter(setSex)}>
            <SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="male">Male</SelectItem>
              <SelectItem value="female">Female</SelectItem>
              <SelectItem value="other">Other</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="weight">Weight (lbs)</Label>
          <Input id="weight" type="number" value={weight} onChange={(e) => setWeight(e.target.value)} placeholder="180" required />
        </div>
        <div>
          <Label htmlFor="height">Height (inches)</Label>
          <Input id="height" type="number" value={height} onChange={(e) => setHeight(e.target.value)} placeholder="70" required />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label>Activity Level</Label>
          <Select value={activityLevel} onValueChange={selectSetter(setActivityLevel)}>
            <SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="sedentary">Sedentary</SelectItem>
              <SelectItem value="light">Light</SelectItem>
              <SelectItem value="moderate">Moderate</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="very_active">Very Active</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label>Training Experience</Label>
          <Select value={trainingExperience} onValueChange={selectSetter(setTrainingExperience)}>
            <SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="beginner">Beginner (&lt;1 year)</SelectItem>
              <SelectItem value="intermediate">Intermediate (1-3 years)</SelectItem>
              <SelectItem value="advanced">Advanced (3-7 years)</SelectItem>
              <SelectItem value="elite">Elite (7+ years)</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      <div>
        <Label htmlFor="fitnessGoals">Fitness Goals (comma-separated)</Label>
        <Input id="fitnessGoals" value={fitnessGoals} onChange={(e) => setFitnessGoals(e.target.value)} placeholder="strength, hypertrophy, fat loss" required />
      </div>
      <div>
        <Label htmlFor="geneticHeritage">Genetic Heritage (comma-separated)</Label>
        <Input id="geneticHeritage" value={geneticHeritage} onChange={(e) => setGeneticHeritage(e.target.value)} placeholder="West African, Northern European" />
      </div>
      <div>
        <Label htmlFor="healthConditions">Health Conditions (comma-separated)</Label>
        <Input id="healthConditions" value={healthConditions} onChange={(e) => setHealthConditions(e.target.value)} placeholder="None, or list conditions" />
      </div>
      <div>
        <Label htmlFor="medications">Medications (comma-separated)</Label>
        <Input id="medications" value={medications} onChange={(e) => setMedications(e.target.value)} placeholder="None, or list medications" />
      </div>
      <div>
        <Label htmlFor="dietaryPreferences">Dietary Preferences (comma-separated)</Label>
        <Input id="dietaryPreferences" value={dietaryPreferences} onChange={(e) => setDietaryPreferences(e.target.value)} placeholder="high protein, no dairy" />
      </div>
      <div>
        <Label htmlFor="currentProgram">Current Training Program (optional)</Label>
        <Textarea id="currentProgram" value={currentProgram} onChange={(e) => setCurrentProgram(e.target.value)} placeholder="PPL 6 days/week, nSuns 5/3/1, etc." rows={2} />
      </div>
    </div>
  )

  const careerForm = (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label>Education Level</Label>
          <Select value={educationLevel} onValueChange={selectSetter(setEducationLevel)}>
            <SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="high_school">High School</SelectItem>
              <SelectItem value="associates">Associate&apos;s</SelectItem>
              <SelectItem value="bachelors">Bachelor&apos;s</SelectItem>
              <SelectItem value="masters">Master&apos;s</SelectItem>
              <SelectItem value="doctorate">Doctorate</SelectItem>
              <SelectItem value="other">Other</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label htmlFor="major">Major / Field</Label>
          <Input id="major" value={major} onChange={(e) => setMajor(e.target.value)} placeholder="Computer Science" />
        </div>
      </div>
      <div>
        <Label htmlFor="gpa">GPA (optional, 0-4.0)</Label>
        <Input id="gpa" type="number" step="0.1" min="0" max="4" value={gpa} onChange={(e) => setGpa(e.target.value)} placeholder="3.5" />
      </div>
      <div>
        <Label htmlFor="interests">Interests (comma-separated)</Label>
        <Input id="interests" value={interests} onChange={(e) => setInterests(e.target.value)} placeholder="AI, education technology, data science" required />
      </div>
      <div>
        <Label htmlFor="skills">Skills (comma-separated)</Label>
        <Input id="skills" value={skills} onChange={(e) => setSkills(e.target.value)} placeholder="Python, data analysis, project management" required />
      </div>
      <div>
        <Label htmlFor="careerGoals">Career Goals (comma-separated)</Label>
        <Input id="careerGoals" value={careerGoals} onChange={(e) => setCareerGoals(e.target.value)} placeholder="lead an AI team, start a company" required />
      </div>
      <div>
        <Label htmlFor="workExperience">Work Experience (format: Title in Field (Years), comma-separated)</Label>
        <Textarea id="workExperience" value={workExperience} onChange={(e) => setWorkExperience(e.target.value)} placeholder="Software Engineer in Fintech (3), Data Analyst in Healthcare (2)" rows={2} />
      </div>
      <div>
        <Label htmlFor="personalityTraits">Personality Traits (comma-separated, optional)</Label>
        <Input id="personalityTraits" value={personalityTraits} onChange={(e) => setPersonalityTraits(e.target.value)} placeholder="analytical, creative, collaborative" />
      </div>
    </div>
  )

  // === RFP Flow ===
  if (researchType === "rfp") {
    return (
      <div className="space-y-6">
        <Button type="button" variant="ghost" size="sm" onClick={onBack} className="gap-2">
          <ArrowLeft className="h-4 w-4" /> Back
        </Button>

        {directions.length === 0 ? (
          <form onSubmit={handleRfpSubmit} className="space-y-6">
            <div>
              <Label htmlFor="rfp-name">Your Name</Label>
              <Input
                id="rfp-name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Ethan"
                required
              />
            </div>

            <Card>
              <CardHeader>
                <CardTitle className="text-base">Research Request</CardTitle>
                <p className="text-sm text-muted-foreground">
                  Describe what you want to research. Be as specific or broad as you like — AI will generate focused research directions for you to choose from.
                </p>
              </CardHeader>
              <CardContent>
                <Textarea
                  id="rfp-text"
                  value={rfpText}
                  onChange={(e) => setRfpText(e.target.value)}
                  placeholder="e.g. What are the most effective strategies for transitioning from software engineering to AI product management while maintaining work-life balance?"
                  rows={5}
                  required
                  minLength={10}
                />
              </CardContent>
            </Card>

            <Button type="submit" disabled={generatingDirections || !rfpText.trim() || !name.trim()} className="w-full" size="lg">
              {generatingDirections ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Generating Research Directions...
                </>
              ) : (
                <>
                  <Sparkles className="mr-2 h-4 w-4" />
                  Generate Research Directions
                </>
              )}
            </Button>
          </form>
        ) : (
          <div className="space-y-4">
            <div>
              <h2 className="text-lg font-semibold">Choose a Research Direction</h2>
              <p className="text-sm text-muted-foreground mt-1">
                Select the angle you want our agents to investigate. Each direction will spawn specialized AI researchers.
              </p>
            </div>

            <Card className="border-dashed">
              <CardContent className="pt-4">
                <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">Your request</p>
                <p className="text-sm">{rfpText}</p>
              </CardContent>
            </Card>

            <div className="grid gap-3">
              {directions.map((d) => (
                <button
                  key={d.id}
                  onClick={() => launchWithDirection(d)}
                  disabled={launchingDirection !== null}
                  className="text-left rounded-xl border border-border p-4 transition-all hover:border-violet-500/50 hover:shadow-md disabled:opacity-50"
                >
                  {launchingDirection === d.id ? (
                    <div className="flex items-center gap-2">
                      <Loader2 className="h-4 w-4 animate-spin text-violet-500" />
                      <span className="text-sm font-medium">Launching research...</span>
                    </div>
                  ) : (
                    <>
                      <h3 className="text-sm font-semibold">{d.title}</h3>
                      <p className="text-xs text-muted-foreground mt-1">{d.description}</p>
                    </>
                  )}
                </button>
              ))}
            </div>

            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setDirections([])}
              className="gap-2"
            >
              <ArrowLeft className="h-3 w-3" /> Back to edit request
            </Button>
          </div>
        )}
      </div>
    )
  }

  // === Structured Form Flow (health / career / both) ===
  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <Button type="button" variant="ghost" size="sm" onClick={onBack} className="gap-2">
        <ArrowLeft className="h-4 w-4" /> Back
      </Button>

      <div>
        <Label htmlFor="name">Your Name</Label>
        <Input id="name" value={name} onChange={(e) => setName(e.target.value)} placeholder="Ethan" required />
      </div>

      {researchType === "both" ? (
        <Tabs defaultValue="health">
          <TabsList className="w-full">
            <TabsTrigger value="health" className="flex-1">Health & Fitness</TabsTrigger>
            <TabsTrigger value="career" className="flex-1">Career & Education</TabsTrigger>
          </TabsList>
          <TabsContent value="health">
            <Card>
              <CardHeader><CardTitle className="text-base">Health & Fitness Profile</CardTitle></CardHeader>
              <CardContent>{healthForm}</CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="career">
            <Card>
              <CardHeader><CardTitle className="text-base">Career & Education Profile</CardTitle></CardHeader>
              <CardContent>{careerForm}</CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">
              {showHealth ? "Health & Fitness Profile" : "Career & Education Profile"}
            </CardTitle>
          </CardHeader>
          <CardContent>{showHealth ? healthForm : showCareer ? careerForm : null}</CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Upload Documents (optional)</CardTitle>
          <p className="text-sm text-muted-foreground">
            {showHealth && showCareer
              ? "Resume, transcript, workout routine, meal plan, lab results, or anything relevant."
              : showHealth
                ? "Current workout routine, meal plan, supplement stack, lab results, or other health docs."
                : "Resume, transcript, certifications, portfolio links, or other career docs."}
          </p>
        </CardHeader>
        <CardContent className="space-y-3">
          <label className="flex cursor-pointer items-center justify-center gap-2 rounded-md border border-dashed border-muted-foreground/30 px-4 py-6 text-sm text-muted-foreground transition-colors hover:border-foreground/50 hover:text-foreground">
            <Upload className="h-4 w-4" />
            Click to upload files
            <input
              type="file"
              multiple
              accept=".txt,.csv,.pdf,.md,.json,.doc,.docx,.rtf"
              onChange={handleFileUpload}
              className="hidden"
            />
          </label>
          {uploadedDocs.length > 0 && (
            <ul className="space-y-1">
              {uploadedDocs.map((doc, i) => (
                <li key={i} className="flex items-center justify-between rounded-md bg-muted/50 px-3 py-1.5 text-sm">
                  <span className="truncate">{doc.name}</span>
                  <button type="button" onClick={() => removeDoc(i)} className="ml-2 text-muted-foreground hover:text-foreground">
                    <X className="h-3.5 w-3.5" />
                  </button>
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>

      <Button type="submit" disabled={loading} className="w-full" size="lg">
        {loading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Launching Research...
          </>
        ) : (
          "Launch Research"
        )}
      </Button>
    </form>
  )
}
