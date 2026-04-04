import type { AgentEvent } from "./events"

// Realistic simulation of a health research session for a competitive powerlifter
// Each event has a `delay` (ms from previous event) for realistic pacing

export interface SimEvent {
  delay: number
  event: AgentEvent
}

const t = Date.now()

export const SIM_EVENTS: SimEvent[] = [
  // === Session Start ===
  {
    delay: 500,
    event: {
      type: "session_started",
      agentId: "system",
      timestamp: t,
      data: {
        sessionId: "sim_demo",
        researchType: "health",
        userName: "Demo User",
      },
    },
  },

  // === Brief Generation ===
  {
    delay: 800,
    event: {
      type: "agent_thinking",
      agentId: "brief_generator",
      timestamp: t,
      data: {
        thought: "Analyzing user profile and generating research plan...",
        step: 1,
      },
    },
  },
  {
    delay: 2000,
    event: {
      type: "brief_generated",
      agentId: "brief_generator",
      timestamp: t,
      data: {
        researchQuestions: [
          "What is the optimal training volume for intermediate powerlifters targeting strength gains?",
          "How does West African genetic heritage influence power sport performance and muscle fiber composition?",
          "What evidence-based supplement protocols support maximal strength development?",
          "What periodization models show the best results for competitive powerlifters?",
          "How do recovery protocols differ for strength vs hypertrophy-focused training?",
          "What nutritional strategies optimize performance for powerlifters cutting to a weight class?",
        ],
        priorityAreas: [
          "Training volume and periodization",
          "Genetic heritage and athletic performance",
          "Evidence-based supplementation",
          "Competition preparation",
        ],
      },
    },
  },

  // === Supervisor Spawns ===
  {
    delay: 600,
    event: {
      type: "agent_spawned",
      agentId: "supervisor",
      timestamp: t,
      data: {
        name: "supervisor",
        role: "Research Supervisor",
        team: "orchestrator",
        description: "Coordinating research agents across health domain",
      },
    },
  },
  {
    delay: 400,
    event: {
      type: "agent_thinking",
      agentId: "supervisor",
      timestamp: t,
      data: {
        thought: "Planning research strategy for health domain...",
        step: 1,
      },
    },
  },
  {
    delay: 800,
    event: {
      type: "agent_thinking",
      agentId: "supervisor",
      timestamp: t,
      data: {
        thought:
          "Phase 1: Deploying 2 data-gathering agents in parallel: pubmed_researcher, genetics_analyst",
        step: 2,
      },
    },
  },

  // === PubMed Researcher ===
  {
    delay: 300,
    event: {
      type: "agent_spawned",
      agentId: "pubmed_researcher",
      parentId: "supervisor",
      timestamp: t,
      data: {
        name: "pubmed_researcher",
        role: "PubMed Literature Researcher",
        team: "health",
        description: "Searching PubMed for peer-reviewed exercise science studies",
      },
    },
  },

  // === Genetics Analyst (parallel) ===
  {
    delay: 200,
    event: {
      type: "agent_spawned",
      agentId: "genetics_analyst",
      parentId: "supervisor",
      timestamp: t,
      data: {
        name: "genetics_analyst",
        role: "Genetic Heritage Analyst",
        team: "health",
        description:
          "Researching genetic heritage fitness inclinations and population-level sport distributions",
      },
    },
  },

  // === PubMed searches ===
  {
    delay: 600,
    event: {
      type: "agent_thinking",
      agentId: "pubmed_researcher",
      timestamp: t,
      data: {
        thought: "Research iteration 1/8 — searching for powerlifting training volume studies...",
        step: 1,
      },
    },
  },
  {
    delay: 400,
    event: {
      type: "agent_tool_call",
      agentId: "pubmed_researcher",
      timestamp: t,
      data: {
        toolName: "pubmed_search",
        toolInput: '{"query":"resistance training volume strength powerlifting meta-analysis","maxResults":10}',
        toolOutputPreview: "Running...",
      },
    },
  },

  // === Genetics searches (parallel) ===
  {
    delay: 300,
    event: {
      type: "agent_thinking",
      agentId: "genetics_analyst",
      timestamp: t,
      data: {
        thought: "Research iteration 1/8 — searching for genetic heritage and athletic performance...",
        step: 1,
      },
    },
  },
  {
    delay: 500,
    event: {
      type: "agent_tool_call",
      agentId: "genetics_analyst",
      timestamp: t,
      data: {
        toolName: "exa_search",
        toolInput: '{"query":"West African genetic heritage power sports muscle fiber composition ACTN3"}',
        toolOutputPreview: "Running...",
      },
    },
  },

  // === PubMed results ===
  {
    delay: 1800,
    event: {
      type: "agent_tool_call",
      agentId: "pubmed_researcher",
      timestamp: t,
      data: {
        toolName: "pubmed_search",
        toolInput: '{"query":"resistance training volume strength"}',
        toolOutputPreview: '{"articles":[{"pmid":"34280005","title":"Dose-Response Relationship Between Weekly Resistance Training Volume and Increases in Muscle Mass..."}],"count":847}',
      },
    },
  },
  {
    delay: 600,
    event: {
      type: "agent_finding",
      agentId: "pubmed_researcher",
      parentId: "supervisor",
      timestamp: t,
      data: {
        finding: {
          id: "pubmed_researcher_0",
          agentId: "pubmed_researcher",
          title: "Training volume dose-response: 12-20 weekly sets per muscle group optimal",
          summary:
            "Meta-analysis of 34 studies (n=1,289) found a dose-response relationship between weekly sets and hypertrophy. 12-20 sets per muscle group per week produced the greatest gains. Beyond 20 sets showed diminishing returns and increased injury risk for intermediate/advanced lifters.",
          source: "Sports Medicine",
          sourceUrl: "PMID:34280005",
          sourceType: "pubmed",
          evidenceGrade: "A",
          timestamp: Date.now(),
        },
      },
    },
  },

  // === Genetics results ===
  {
    delay: 800,
    event: {
      type: "agent_tool_call",
      agentId: "genetics_analyst",
      timestamp: t,
      data: {
        toolName: "exa_search",
        toolInput: '{"query":"West African genetic heritage power sports"}',
        toolOutputPreview: '{"results":[{"title":"ACTN3 R577X Polymorphism and Athletic Performance...","url":"https://..."}]}',
      },
    },
  },
  {
    delay: 500,
    event: {
      type: "agent_finding",
      agentId: "genetics_analyst",
      parentId: "supervisor",
      timestamp: t,
      data: {
        finding: {
          id: "genetics_analyst_0",
          agentId: "genetics_analyst",
          title: "ACTN3 R577X: West African populations show highest frequency of power-associated RR genotype",
          summary:
            "The ACTN3 gene produces alpha-actinin-3, critical for fast-twitch muscle fiber function. The RR genotype (power variant) is found in ~98% of West African populations compared to ~82% in Europeans. This correlates with the dominance of West African-descended athletes in sprint and power events.",
          source: "Nature Genetics",
          sourceUrl: "https://exa.ai/results/actn3-west-african",
          sourceType: "exa",
          evidenceGrade: "B",
          timestamp: Date.now(),
        },
      },
    },
  },

  // === More PubMed research ===
  {
    delay: 700,
    event: {
      type: "agent_thinking",
      agentId: "pubmed_researcher",
      timestamp: t,
      data: {
        thought: "Research iteration 2/8 — searching for periodization models in powerlifting...",
        step: 2,
      },
    },
  },
  {
    delay: 400,
    event: {
      type: "agent_tool_call",
      agentId: "pubmed_researcher",
      timestamp: t,
      data: {
        toolName: "pubmed_search",
        toolInput: '{"query":"periodization powerlifting strength systematic review","maxResults":10}',
        toolOutputPreview: "Running...",
      },
    },
  },
  {
    delay: 1500,
    event: {
      type: "agent_finding",
      agentId: "pubmed_researcher",
      parentId: "supervisor",
      timestamp: t,
      data: {
        finding: {
          id: "pubmed_researcher_1",
          agentId: "pubmed_researcher",
          title: "Daily undulating periodization (DUP) outperforms linear models for intermediate lifters",
          summary:
            "Systematic review of 12 RCTs found DUP produced 22% greater strength gains than linear periodization in trained individuals (>1 year experience). DUP alternates intensity/volume daily (e.g., heavy/light/moderate) which provides varied stimulus and better fatigue management.",
          source: "Journal of Strength and Conditioning Research",
          sourceUrl: "PMID:36120981",
          sourceType: "pubmed",
          evidenceGrade: "A",
          timestamp: Date.now(),
        },
      },
    },
  },

  // === More genetics research ===
  {
    delay: 500,
    event: {
      type: "agent_thinking",
      agentId: "genetics_analyst",
      timestamp: t,
      data: {
        thought: "Research iteration 2/8 — deep research on cultural athletic distributions...",
        step: 2,
      },
    },
  },
  {
    delay: 400,
    event: {
      type: "agent_tool_call",
      agentId: "genetics_analyst",
      timestamp: t,
      data: {
        toolName: "exa_search",
        toolInput: '{"query":"population genetics athletic performance muscle fiber type distribution ethnicity","category":"research paper"}',
        toolOutputPreview: "Running...",
      },
    },
  },
  {
    delay: 1200,
    event: {
      type: "agent_finding",
      agentId: "genetics_analyst",
      parentId: "supervisor",
      timestamp: t,
      data: {
        finding: {
          id: "genetics_analyst_1",
          agentId: "genetics_analyst",
          title: "Muscle fiber type composition varies significantly by ancestry — implications for training",
          summary:
            "West African-descended individuals average 67-70% Type II (fast-twitch) muscle fibers vs. 50-55% in European-descended populations. This predisposes toward explosive power but may require different recovery protocols — fast-twitch fibers generate more metabolic stress and take longer to recover.",
          source: "Journal of Applied Physiology",
          sourceUrl: "https://exa.ai/results/fiber-type-ancestry",
          sourceType: "exa",
          evidenceGrade: "C",
          timestamp: Date.now(),
        },
      },
    },
  },

  // === Supplement finding ===
  {
    delay: 700,
    event: {
      type: "agent_thinking",
      agentId: "pubmed_researcher",
      timestamp: t,
      data: {
        thought: "Research iteration 3/8 — searching for evidence-based supplement protocols...",
        step: 3,
      },
    },
  },
  {
    delay: 1400,
    event: {
      type: "agent_finding",
      agentId: "pubmed_researcher",
      parentId: "supervisor",
      timestamp: t,
      data: {
        finding: {
          id: "pubmed_researcher_2",
          agentId: "pubmed_researcher",
          title: "Creatine monohydrate: 5g/day produces consistent strength gains across 250+ studies",
          summary:
            "Meta-analysis of 250+ studies confirms creatine monohydrate at 3-5g/day increases maximal strength by 8-14% and lean body mass by 1-2kg over 4-12 weeks. Loading phase (20g/day x 5 days) accelerates saturation but is not required. No significant adverse effects in healthy populations.",
          source: "Journal of the International Society of Sports Nutrition",
          sourceUrl: "PMID:33557850",
          sourceType: "pubmed",
          evidenceGrade: "A",
          timestamp: Date.now(),
        },
      },
    },
  },

  // === Phase 1 agents complete ===
  {
    delay: 800,
    event: {
      type: "agent_complete",
      agentId: "pubmed_researcher",
      timestamp: t,
      data: { summary: "Found 3 findings", findingsCount: 3, durationMs: 12000 },
    },
  },
  {
    delay: 400,
    event: {
      type: "agent_complete",
      agentId: "genetics_analyst",
      timestamp: t,
      data: { summary: "Found 2 findings", findingsCount: 2, durationMs: 11000 },
    },
  },

  // === Phase 2: Protocol Builder ===
  {
    delay: 600,
    event: {
      type: "agent_thinking",
      agentId: "supervisor",
      timestamp: t,
      data: {
        thought: "Phase 1 complete. 5 findings collected. Deploying synthesis agents...",
        step: 3,
      },
    },
  },
  {
    delay: 400,
    event: {
      type: "agent_spawned",
      agentId: "protocol_builder",
      parentId: "supervisor",
      timestamp: t,
      data: {
        name: "protocol_builder",
        role: "Protocol Builder",
        team: "health",
        description:
          "Building personalized training and supplement protocols from research findings",
      },
    },
  },
  {
    delay: 800,
    event: {
      type: "agent_thinking",
      agentId: "protocol_builder",
      timestamp: t,
      data: {
        thought: "Research iteration 1/8 — synthesizing training protocol from findings...",
        step: 1,
      },
    },
  },
  {
    delay: 400,
    event: {
      type: "agent_tool_call",
      agentId: "protocol_builder",
      timestamp: t,
      data: {
        toolName: "exa_search",
        toolInput: '{"query":"powerlifting training program intermediate DUP 4-day split"}',
        toolOutputPreview: "Running...",
      },
    },
  },
  {
    delay: 1500,
    event: {
      type: "agent_finding",
      agentId: "protocol_builder",
      parentId: "supervisor",
      timestamp: t,
      data: {
        finding: {
          id: "protocol_builder_0",
          agentId: "protocol_builder",
          title: "Recommended 4-day DUP program: Heavy/Moderate/Light/Volume rotation",
          summary:
            "Based on DUP evidence and user's intermediate training level: Day 1: Squat heavy (5x3@85%), Bench moderate (4x6@75%). Day 2: Deadlift heavy (5x3@85%), OHP moderate (4x6@75%). Day 3: Squat light (3x8@65%), Bench volume (5x8@70%). Day 4: Deadlift light (3x8@65%), accessories. Target 14-16 weekly sets per major lift.",
          source: "Protocol synthesis",
          sourceType: "exa",
          evidenceGrade: "C",
          timestamp: Date.now(),
        },
      },
    },
  },
  {
    delay: 700,
    event: {
      type: "agent_complete",
      agentId: "protocol_builder",
      timestamp: t,
      data: { summary: "Found 1 finding", findingsCount: 1, durationMs: 5000 },
    },
  },

  // === Supervisor complete ===
  {
    delay: 400,
    event: {
      type: "agent_complete",
      agentId: "supervisor",
      timestamp: t,
      data: {
        summary: "Research complete. 6 total findings from 3 agents.",
        findingsCount: 6,
        durationMs: 25000,
      },
    },
  },

  // === Evidence Grading ===
  {
    delay: 500,
    event: {
      type: "agent_spawned",
      agentId: "evidence_grader",
      timestamp: t,
      data: {
        name: "evidence_grader",
        role: "Evidence Grader",
        team: "synthesis",
        description: "Grading evidence quality for all findings",
      },
    },
  },
  {
    delay: 1500,
    event: {
      type: "agent_complete",
      agentId: "evidence_grader",
      timestamp: t,
      data: { summary: "Graded 6 findings", findingsCount: 6, durationMs: 3000 },
    },
  },

  // === Synthesis ===
  {
    delay: 400,
    event: {
      type: "agent_spawned",
      agentId: "synthesizer",
      timestamp: t,
      data: {
        name: "synthesizer",
        role: "Research Synthesizer",
        team: "synthesis",
        description: "Synthesizing findings into actionable insights",
      },
    },
  },
  {
    delay: 600,
    event: {
      type: "agent_thinking",
      agentId: "synthesizer",
      timestamp: t,
      data: {
        thought: "Analyzing 6 findings across health domain...",
        step: 1,
      },
    },
  },
  {
    delay: 2000,
    event: {
      type: "insight_synthesized",
      agentId: "synthesizer",
      timestamp: t,
      data: {
        insight: {
          id: "insight_0",
          title: "Your genetic profile strongly favors power-based training — train accordingly",
          content:
            "Your West African heritage correlates with ~98% likelihood of the ACTN3 RR genotype (power variant) and an estimated 67-70% Type II muscle fibers. This is a significant advantage for powerlifting. However, higher fast-twitch proportion means you generate more metabolic stress per session and may need longer recovery between heavy sessions (72h vs 48h). The DUP model handles this naturally via daily intensity variation.",
          supportingFindings: ["genetics_analyst_0", "genetics_analyst_1", "pubmed_researcher_1"],
          evidenceGrade: "B",
          domain: "health",
        },
      },
    },
  },
  {
    delay: 1500,
    event: {
      type: "insight_synthesized",
      agentId: "synthesizer",
      timestamp: t,
      data: {
        insight: {
          id: "insight_1",
          title: "Optimal protocol: 4-day DUP with 14-16 weekly sets, creatine 5g/day",
          content:
            "The convergence of evidence points to a specific protocol: 4-day daily undulating periodization targeting 14-16 weekly sets per major lift, combined with creatine monohydrate at 5g/day. This volume sits in the optimal dose-response range (meta-analysis, Grade A) while the DUP structure outperforms linear models by 22% for your experience level. Creatine is the most evidence-backed supplement with 250+ studies supporting 8-14% strength increases.",
          supportingFindings: ["pubmed_researcher_0", "pubmed_researcher_1", "pubmed_researcher_2", "protocol_builder_0"],
          evidenceGrade: "A",
          domain: "health",
        },
      },
    },
  },
  {
    delay: 500,
    event: {
      type: "agent_complete",
      agentId: "synthesizer",
      timestamp: t,
      data: { summary: "Synthesized 2 insights from 6 findings", findingsCount: 2, durationMs: 5000 },
    },
  },

  // === Report Writing ===
  {
    delay: 400,
    event: {
      type: "agent_spawned",
      agentId: "report_writer",
      timestamp: t,
      data: {
        name: "report_writer",
        role: "Report Writer",
        team: "synthesis",
        description: "Generating personalized research report",
      },
    },
  },
  {
    delay: 600,
    event: {
      type: "agent_thinking",
      agentId: "report_writer",
      timestamp: t,
      data: { thought: "Structuring the final report...", step: 1 },
    },
  },
  {
    delay: 1500,
    event: {
      type: "report_section",
      agentId: "report_writer",
      timestamp: t,
      data: {
        section: {
          sectionName: "Executive Summary",
          content:
            "This report synthesizes findings from 6 peer-reviewed sources and population genetics research to build an evidence-based powerlifting protocol personalized to your profile. Key finding: your genetic heritage gives you a measurable advantage in power sports — the ACTN3 RR genotype found in ~98% of West African populations is associated with superior fast-twitch muscle fiber function. Combined with optimal training volume research (12-20 sets/week) and the strongest evidence-based periodization model (DUP), we recommend a specific 4-day program with creatine supplementation.",
          citations: [
            { title: "Dose-Response Relationship in Resistance Training (2021)", evidenceGrade: "A" },
            { title: "ACTN3 R577X and Athletic Performance", evidenceGrade: "B" },
          ],
          domain: "overview",
        },
      },
    },
  },
  {
    delay: 2000,
    event: {
      type: "report_section",
      agentId: "report_writer",
      timestamp: t,
      data: {
        section: {
          sectionName: "Training Protocol",
          content:
            "Based on meta-analytic evidence (Grade A), we recommend a 4-day Daily Undulating Periodization (DUP) program:\n\nDay 1 — Squat Heavy (5x3 @ 85% 1RM), Bench Moderate (4x6 @ 75% 1RM), Rows 3x8\nDay 2 — Deadlift Heavy (5x3 @ 85% 1RM), OHP Moderate (4x6 @ 75% 1RM), Pull-ups 3x8\nDay 3 — Squat Light (3x8 @ 65% 1RM), Bench Volume (5x8 @ 70% 1RM), Accessories\nDay 4 — Deadlift Light (3x8 @ 65% 1RM), Competition Lift Practice, Accessories\n\nTarget 14-16 weekly sets per major movement pattern. DUP produced 22% greater strength gains than linear periodization in intermediate lifters (Grade A). Your higher fast-twitch fiber proportion means prioritizing 72h recovery between heavy sessions of the same movement pattern.",
          citations: [
            { title: "DUP vs Linear Periodization Systematic Review (2022)", url: "PMID:36120981", evidenceGrade: "A" },
            { title: "Training Volume Meta-Analysis (2021)", url: "PMID:34280005", evidenceGrade: "A" },
            { title: "Muscle Fiber Type and Recovery (2019)", evidenceGrade: "C" },
          ],
          domain: "health",
        },
      },
    },
  },
  {
    delay: 1800,
    event: {
      type: "report_section",
      agentId: "report_writer",
      timestamp: t,
      data: {
        section: {
          sectionName: "Supplementation Protocol",
          content:
            "Evidence-graded supplement stack:\n\n1. Creatine Monohydrate — 5g daily, any time (Grade A). The single most evidence-backed sports supplement with 250+ studies showing 8-14% strength gains. No loading phase required. Take consistently every day including rest days.\n\n2. Caffeine — 3-6mg/kg body weight, 30-60min pre-training (Grade A). Consistently improves maximal strength by 2-7% across meta-analyses. Cycle 2 weeks on / 1 week off to maintain sensitivity.\n\n3. Beta-Alanine — 3.2-6.4g daily, split doses (Grade B). Benefits higher-rep sets (6+ reps) by buffering hydrogen ion accumulation. Less relevant for heavy singles/triples but supports volume days.",
          citations: [
            { title: "ISSN Position Stand on Creatine (2021)", url: "PMID:33557850", evidenceGrade: "A" },
            { title: "Caffeine and Strength Performance Meta-Analysis", evidenceGrade: "A" },
            { title: "Beta-Alanine ISSN Review", evidenceGrade: "B" },
          ],
          domain: "health",
        },
      },
    },
  },
  {
    delay: 1500,
    event: {
      type: "report_section",
      agentId: "report_writer",
      timestamp: t,
      data: {
        section: {
          sectionName: "Genetic Heritage Insights",
          content:
            "Your West African genetic heritage has measurable implications for your training:\n\nACTN3 Gene: ~98% of West African populations carry the RR genotype, producing functional alpha-actinin-3 in fast-twitch fibers. This protein is critical for generating explosive force — a direct advantage in powerlifting (Grade B).\n\nMuscle Fiber Composition: Population-level data suggests 67-70% Type II fibers vs. ~52% in European-descended populations. More fast-twitch fibers means higher ceiling for absolute strength but also greater metabolic stress per session (Grade C).\n\nTraining Implication: You likely respond better to lower-rep, higher-intensity work and may need slightly longer recovery. The DUP program above accounts for this with its heavy/light alternation.",
          citations: [
            { title: "ACTN3 Polymorphism and Ethnicity (Nature Genetics)", evidenceGrade: "B" },
            { title: "Muscle Fiber Distribution and Ancestry (J Applied Physiol)", evidenceGrade: "C" },
          ],
          domain: "health",
        },
      },
    },
  },
  {
    delay: 500,
    event: {
      type: "agent_complete",
      agentId: "report_writer",
      timestamp: t,
      data: { summary: "Report generated with 4 sections", findingsCount: 4, durationMs: 8000 },
    },
  },

  // === Complete ===
  {
    delay: 300,
    event: {
      type: "research_complete",
      agentId: "system",
      timestamp: t,
      data: {
        reportId: "report_sim_demo",
        totalFindings: 6,
        totalInsights: 2,
        totalDurationMs: 45000,
      },
    },
  },
]
