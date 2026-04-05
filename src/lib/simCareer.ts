import type { SimEvent } from "./simData"

const t = Date.now()

export const SIM_CAREER_EVENTS: SimEvent[] = [
  // === Session Start ===
  {
    delay: 500,
    event: {
      type: "session_started",
      agentId: "system",
      timestamp: t,
      data: { sessionId: "sim_career", researchType: "career", userName: "Demo Student" },
    },
  },

  // === Brief ===
  {
    delay: 800,
    event: {
      type: "agent_thinking",
      agentId: "brief_generator",
      timestamp: t,
      data: { thought: "Analyzing academic profile and career interests...", step: 1 },
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
          "What occupations best match a Computer Science major with interests in AI and education technology?",
          "What is the projected job growth and salary trajectory for AI/ML engineers over the next decade?",
          "What skill gaps exist between a CS degree and roles in AI product management?",
          "What certifications or graduate programs accelerate entry into edtech leadership?",
          "How does the edtech labor market compare to general software engineering in terms of growth and compensation?",
          "What are the most in-demand skills in the AI education intersection for 2026-2030?",
        ],
        priorityAreas: [
          "Career-skill alignment",
          "AI/ML job market outlook",
          "EdTech industry growth",
          "Skill gap analysis and upskilling paths",
        ],
      },
    },
  },

  // === Supervisor ===
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
        description: "Coordinating research agents across career domain",
      },
    },
  },
  {
    delay: 400,
    event: {
      type: "agent_thinking",
      agentId: "supervisor",
      timestamp: t,
      data: { thought: "Planning career research strategy...", step: 1 },
    },
  },
  {
    delay: 700,
    event: {
      type: "agent_thinking",
      agentId: "supervisor",
      timestamp: t,
      data: {
        thought: "Phase 1: Deploying 2 data-gathering agents in parallel: onet_researcher, trends_analyst",
        step: 2,
      },
    },
  },

  // === O*NET Researcher ===
  {
    delay: 300,
    event: {
      type: "agent_spawned",
      agentId: "onet_researcher",
      parentId: "supervisor",
      timestamp: t,
      data: {
        name: "onet_researcher",
        role: "O*NET Occupation Researcher",
        team: "career",
        description: "Searching O*NET for matching occupations based on skills and education",
      },
    },
  },

  // === Trends Analyst (parallel) ===
  {
    delay: 200,
    event: {
      type: "agent_spawned",
      agentId: "trends_analyst",
      parentId: "supervisor",
      timestamp: t,
      data: {
        name: "trends_analyst",
        role: "Labor Market Trends Analyst",
        team: "career",
        description: "Researching labor market trends, salary trajectories, and emerging fields",
      },
    },
  },

  // === O*NET searches ===
  {
    delay: 600,
    event: {
      type: "agent_thinking",
      agentId: "onet_researcher",
      timestamp: t,
      data: { thought: "Research iteration 1/8 — searching for AI/ML occupations...", step: 1 },
    },
  },
  {
    delay: 400,
    event: {
      type: "agent_tool_call",
      agentId: "onet_researcher",
      timestamp: t,
      data: {
        toolName: "onet_search_occupations",
        toolInput: '{"keyword":"artificial intelligence engineer"}',
        toolOutputPreview: "Running...",
      },
    },
  },

  // === Trends searches (parallel) ===
  {
    delay: 300,
    event: {
      type: "agent_thinking",
      agentId: "trends_analyst",
      timestamp: t,
      data: { thought: "Research iteration 1/8 — searching for AI job market projections...", step: 1 },
    },
  },
  {
    delay: 500,
    event: {
      type: "agent_tool_call",
      agentId: "trends_analyst",
      timestamp: t,
      data: {
        toolName: "exa_search",
        toolInput: '{"query":"AI machine learning engineer job growth salary projections 2025 2030","category":"news"}',
        toolOutputPreview: "Running...",
      },
    },
  },

  // === O*NET results ===
  {
    delay: 1600,
    event: {
      type: "agent_tool_call",
      agentId: "onet_researcher",
      timestamp: t,
      data: {
        toolName: "onet_get_occupation_details",
        toolInput: '{"code":"15-2051.00"}',
        toolOutputPreview: '{"code":"15-2051.00","title":"Data Scientists","description":"Develop and implement...","outlook":{"brightOutlook":true,"projectedGrowth":"36%"}}',
      },
    },
  },
  {
    delay: 600,
    event: {
      type: "agent_finding",
      agentId: "onet_researcher",
      parentId: "supervisor",
      timestamp: t,
      data: {
        finding: {
          id: "onet_researcher_0",
          agentId: "onet_researcher",
          title: "Data Scientists (15-2051.00): 36% projected growth, Bright Outlook designation",
          summary:
            "O*NET designates Data Scientists as a Bright Outlook occupation with 36% projected growth (2022-2032), far exceeding the 3% average across all occupations. Median annual salary: $108,020. Key skills: Python, machine learning, statistical analysis, data visualization. Strong alignment with user's CS background and AI interests.",
          source: "O*NET OnLine",
          sourceUrl: "https://www.onetonline.org/link/summary/15-2051.00",
          sourceType: "onet",
          evidenceGrade: "A",
          timestamp: Date.now(),
        },
      },
    },
  },

  // === Trends results ===
  {
    delay: 700,
    event: {
      type: "agent_tool_call",
      agentId: "trends_analyst",
      timestamp: t,
      data: {
        toolName: "exa_search",
        toolInput: '{"query":"AI ML engineer job growth salary 2030"}',
        toolOutputPreview: '{"results":[{"title":"Bureau of Labor Statistics: Computer and Information Research Scientists..."}]}',
      },
    },
  },
  {
    delay: 500,
    event: {
      type: "agent_finding",
      agentId: "trends_analyst",
      parentId: "supervisor",
      timestamp: t,
      data: {
        finding: {
          id: "trends_analyst_0",
          agentId: "trends_analyst",
          title: "AI/ML roles growing 4x faster than software engineering overall",
          summary:
            "BLS data shows computer and information research scientists (which includes AI/ML) projected to grow 26% vs. 17% for software developers generally. AI-specific roles command a 35-50% salary premium over equivalent-seniority general SWE roles. Median AI/ML engineer salary reached $158,000 in 2025, with senior roles exceeding $250,000 at top companies.",
          source: "Bureau of Labor Statistics",
          sourceUrl: "https://www.bls.gov/ooh/computer-and-information-technology/",
          sourceType: "exa",
          evidenceGrade: "B",
          timestamp: Date.now(),
        },
      },
    },
  },

  // === More O*NET research ===
  {
    delay: 600,
    event: {
      type: "agent_thinking",
      agentId: "onet_researcher",
      timestamp: t,
      data: { thought: "Research iteration 2/8 — searching for edtech-related occupations...", step: 2 },
    },
  },
  {
    delay: 400,
    event: {
      type: "agent_tool_call",
      agentId: "onet_researcher",
      timestamp: t,
      data: {
        toolName: "onet_search_occupations",
        toolInput: '{"keyword":"instructional technology"}',
        toolOutputPreview: "Running...",
      },
    },
  },
  {
    delay: 1400,
    event: {
      type: "agent_finding",
      agentId: "onet_researcher",
      parentId: "supervisor",
      timestamp: t,
      data: {
        finding: {
          id: "onet_researcher_1",
          agentId: "onet_researcher",
          title: "Instructional Coordinators + AI: a convergence opportunity in edtech",
          summary:
            "O*NET shows Instructional Coordinators (25-9031.00) at 2% growth, but the emerging sub-field of AI-powered instructional design is unlisted — it sits at the intersection of education and CS. EdTech companies are creating hybrid roles (Learning Engineer, AI Curriculum Designer) that combine pedagogical knowledge with ML skills. These roles don't appear in traditional occupation databases yet, indicating a first-mover opportunity.",
          source: "O*NET OnLine",
          sourceUrl: "https://www.onetonline.org/link/summary/25-9031.00",
          sourceType: "onet",
          evidenceGrade: "C",
          timestamp: Date.now(),
        },
      },
    },
  },

  // === More trends ===
  {
    delay: 500,
    event: {
      type: "agent_thinking",
      agentId: "trends_analyst",
      timestamp: t,
      data: { thought: "Research iteration 2/8 — deep research on edtech industry growth...", step: 2 },
    },
  },
  {
    delay: 400,
    event: {
      type: "agent_tool_call",
      agentId: "trends_analyst",
      timestamp: t,
      data: {
        toolName: "exa_search",
        toolInput: '{"query":"education technology market size growth 2025 2030 AI personalized learning","category":"research paper"}',
        toolOutputPreview: "Running...",
      },
    },
  },
  {
    delay: 1200,
    event: {
      type: "agent_finding",
      agentId: "trends_analyst",
      parentId: "supervisor",
      timestamp: t,
      data: {
        finding: {
          id: "trends_analyst_1",
          agentId: "trends_analyst",
          title: "Global EdTech market projected to reach $421B by 2032 — AI-personalization is the fastest segment",
          summary:
            "The global edtech market is valued at $146B (2024) and projected to reach $421B by 2032 (CAGR 14.2%). The AI in education sub-segment is growing at 36% CAGR, driven by demand for adaptive learning, automated assessment, and intelligent tutoring systems. Companies like Khan Academy (Khanmigo), Duolingo, and Coursera are all investing heavily in AI integration.",
          source: "Grand View Research",
          sourceUrl: "https://www.grandviewresearch.com/industry-analysis/education-technology-market",
          sourceType: "exa",
          evidenceGrade: "C",
          timestamp: Date.now(),
        },
      },
    },
  },

  // === Skill gap finding ===
  {
    delay: 700,
    event: {
      type: "agent_thinking",
      agentId: "onet_researcher",
      timestamp: t,
      data: { thought: "Research iteration 3/8 — analyzing skill gaps...", step: 3 },
    },
  },
  {
    delay: 1300,
    event: {
      type: "agent_finding",
      agentId: "onet_researcher",
      parentId: "supervisor",
      timestamp: t,
      data: {
        finding: {
          id: "onet_researcher_2",
          agentId: "onet_researcher",
          title: "Skill gap analysis: CS → AI Product Manager requires UX research, A/B testing, stakeholder management",
          summary:
            "Comparing O*NET skill profiles for Software Developers (15-1252.00) vs. AI Product Managers shows 72% skill overlap in technical areas but significant gaps in: user research methods, experimental design (A/B testing), cross-functional stakeholder management, and business strategy. The user's CS background covers programming and data skills but lacks product management fundamentals. Recommended bridge: product management certification + 1-2 years as a technical PM.",
          source: "O*NET Skill Comparison",
          sourceUrl: "https://www.onetonline.org/link/summary/15-1252.00",
          sourceType: "onet",
          evidenceGrade: "B",
          timestamp: Date.now(),
        },
      },
    },
  },

  // === Phase 1 complete ===
  {
    delay: 800,
    event: {
      type: "agent_complete",
      agentId: "onet_researcher",
      timestamp: t,
      data: { summary: "Found 3 findings", findingsCount: 3, durationMs: 14000 },
    },
  },
  {
    delay: 400,
    event: {
      type: "agent_complete",
      agentId: "trends_analyst",
      timestamp: t,
      data: { summary: "Found 2 findings", findingsCount: 2, durationMs: 13000 },
    },
  },

  // === Phase 2: Pathway Builder ===
  {
    delay: 600,
    event: {
      type: "agent_thinking",
      agentId: "supervisor",
      timestamp: t,
      data: { thought: "Phase 1 complete. 5 findings collected. Deploying pathway builder...", step: 3 },
    },
  },
  {
    delay: 400,
    event: {
      type: "agent_spawned",
      agentId: "pathway_builder",
      parentId: "supervisor",
      timestamp: t,
      data: {
        name: "pathway_builder",
        role: "Career Pathway Builder",
        team: "career",
        description: "Building concrete career pathways with timelines and milestones",
      },
    },
  },
  {
    delay: 700,
    event: {
      type: "agent_thinking",
      agentId: "pathway_builder",
      timestamp: t,
      data: { thought: "Research iteration 1/8 — synthesizing career roadmap from findings...", step: 1 },
    },
  },
  {
    delay: 400,
    event: {
      type: "agent_tool_call",
      agentId: "pathway_builder",
      timestamp: t,
      data: {
        toolName: "exa_search",
        toolInput: '{"query":"career path computer science to AI product manager edtech timeline certifications"}',
        toolOutputPreview: "Running...",
      },
    },
  },
  {
    delay: 1500,
    event: {
      type: "agent_finding",
      agentId: "pathway_builder",
      parentId: "supervisor",
      timestamp: t,
      data: {
        finding: {
          id: "pathway_builder_0",
          agentId: "pathway_builder",
          title: "Recommended 3-year pathway: CS graduate → ML Engineer → AI Product Lead in EdTech",
          summary:
            "Year 1: Join an AI/ML team as a junior ML engineer to build production ML experience. Complete Google PM Certificate or equivalent. Year 2: Transition to Technical Product Manager role at an edtech company, leveraging ML background for AI feature development. Build portfolio of AI-in-education projects. Year 3: Target AI Product Lead roles at companies like Khan Academy, Duolingo, or Coursera. Salary progression: $95K → $140K → $185K.",
          source: "Career pathway synthesis",
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
      agentId: "pathway_builder",
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
      data: { summary: "Research complete. 6 total findings from 3 agents.", findingsCount: 6, durationMs: 28000 },
    },
  },

  // === Evidence Grading ===
  {
    delay: 500,
    event: {
      type: "agent_spawned",
      agentId: "evidence_grader",
      timestamp: t,
      data: { name: "evidence_grader", role: "Evidence Grader", team: "synthesis", description: "Grading evidence quality for all findings" },
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
      data: { name: "synthesizer", role: "Research Synthesizer", team: "synthesis", description: "Synthesizing findings into actionable insights" },
    },
  },
  {
    delay: 600,
    event: {
      type: "agent_thinking",
      agentId: "synthesizer",
      timestamp: t,
      data: { thought: "Analyzing 6 findings across career domain...", step: 1 },
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
          title: "The AI × EdTech intersection is your highest-leverage career bet",
          content:
            "The edtech market is growing at 14.2% CAGR while AI-in-education is growing at 36% CAGR. Meanwhile, AI/ML roles pay a 35-50% premium over general SWE. Your CS background puts you in the top 5% of candidates for this intersection — most edtech professionals lack deep technical ML skills, and most ML engineers lack pedagogical understanding. This is a genuine first-mover advantage in a market projected to reach $421B by 2032.",
          supportingFindings: ["trends_analyst_0", "trends_analyst_1", "onet_researcher_1"],
          evidenceGrade: "B",
          domain: "career",
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
          title: "Bridge the product gap: your technical skills are strong but PM skills are the bottleneck to leadership",
          content:
            "O*NET skill comparison shows 72% overlap between your CS skill profile and AI PM roles, but the missing 28% — UX research, A/B testing, stakeholder management — is exactly what separates $95K IC roles from $185K leadership roles. The 3-year pathway (ML Engineer → Tech PM → AI Product Lead) has the highest expected ROI, with a projected salary trajectory from $95K to $185K and strong demand signals from companies like Khan Academy and Duolingo.",
          supportingFindings: ["onet_researcher_0", "onet_researcher_2", "pathway_builder_0"],
          evidenceGrade: "B",
          domain: "career",
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

  // === Report ===
  {
    delay: 400,
    event: {
      type: "agent_spawned",
      agentId: "report_writer",
      timestamp: t,
      data: { name: "report_writer", role: "Report Writer", team: "synthesis", description: "Generating personalized research report" },
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
            "This report analyzes career opportunities at the intersection of artificial intelligence and education technology for a Computer Science graduate with interests in AI and edtech. Key finding: the AI-in-education market is growing at 36% CAGR within a broader edtech market projected to reach $421B by 2032. AI/ML roles command a 35-50% salary premium over general software engineering, and the combination of deep CS skills with educational domain knowledge represents a genuine first-mover advantage in an undersupplied market. We recommend a 3-year pathway from ML Engineer to AI Product Lead in EdTech, with projected salary growth from $95K to $185K.",
          citations: [
            { title: "BLS Computer and Information Research Scientists Outlook", evidenceGrade: "B" },
            { title: "O*NET Data Scientists Occupation Profile", url: "https://www.onetonline.org/link/summary/15-2051.00", evidenceGrade: "A" },
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
          sectionName: "Career-Skill Alignment",
          content:
            "Your Computer Science background aligns strongly with the fastest-growing technical occupations. O*NET analysis identified two primary career clusters:\n\n1. Data Scientists (15-2051.00) — 36% projected growth, $108K median salary, Bright Outlook. Your CS coursework in algorithms, statistics, and programming covers 85% of required skills.\n\n2. Software Developers (15-1252.00) — 17% projected growth, $132K median salary. Standard CS graduate pathway but with lower growth ceiling.\n\nThe emerging hybrid role — AI Product Manager / Learning Engineer in EdTech — doesn't yet have its own O*NET code, indicating a market so new that formal classification hasn't caught up. This is where first-movers win.\n\nSkill gap analysis (CS → AI PM) reveals 72% existing coverage. The critical gaps: UX research methods, experimental design for product (A/B testing), and cross-functional stakeholder management.",
          citations: [
            { title: "O*NET Data Scientists Occupation Profile", url: "https://www.onetonline.org/link/summary/15-2051.00", evidenceGrade: "A" },
            { title: "O*NET Software Developers Occupation Profile", url: "https://www.onetonline.org/link/summary/15-1252.00", evidenceGrade: "A" },
            { title: "O*NET Skill Gap Comparison Analysis", evidenceGrade: "B" },
          ],
          domain: "career",
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
          sectionName: "Market Opportunity",
          content:
            "Three converging trends create an unusually strong market opportunity:\n\n1. AI/ML roles are growing 4x faster than general software engineering (26% vs. 17% projected growth, BLS data). AI-specific roles command a 35-50% salary premium — median AI/ML engineer salary reached $158K in 2025, with senior roles at top companies exceeding $250K.\n\n2. The global edtech market is projected to grow from $146B (2024) to $421B by 2032. The AI-in-education sub-segment is the fastest at 36% CAGR, driven by adaptive learning, automated assessment, and intelligent tutoring systems.\n\n3. The supply-demand mismatch is acute: most edtech professionals lack ML depth, and most ML engineers lack pedagogical understanding. A candidate with both is competing in a pool 10-20x smaller than either field alone.\n\nTarget companies leading AI-in-education: Khan Academy (Khanmigo), Duolingo, Coursera, Chegg, McGraw Hill, and Series A-C edtech startups.",
          citations: [
            { title: "BLS AI/ML Job Growth Projections (2022-2032)", evidenceGrade: "B" },
            { title: "Grand View Research EdTech Market Report (2024)", url: "https://www.grandviewresearch.com/industry-analysis/education-technology-market", evidenceGrade: "C" },
          ],
          domain: "career",
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
          sectionName: "Recommended Career Pathway",
          content:
            "Based on market data, skill gap analysis, and salary projections, we recommend a 3-year phased pathway:\n\nYear 1 (ML Engineer): Join an AI/ML team at a mid-to-large tech company or well-funded startup. Target: build production ML experience (model training, deployment, monitoring). Complete Google Product Management Certificate in parallel. Expected salary: $95-110K.\n\nYear 2 (Technical PM): Transition to a Technical Product Manager role at an edtech company. Leverage ML background to own AI-powered features. Build portfolio of shipped AI-in-education products. Join edtech communities (ASU+GSV, EdTechX). Expected salary: $130-150K.\n\nYear 3 (AI Product Lead): Target AI Product Lead or Head of AI roles at top edtech companies. You'll have rare combination: production ML experience + product management skills + edtech domain knowledge. Expected salary: $170-200K.\n\nAlternative path: If entrepreneurship appeals, the Year 2 PM experience combined with ML skills positions you to found an AI-in-education startup in the $421B market.",
          citations: [
            { title: "Career Pathway Synthesis from O*NET + BLS Data", evidenceGrade: "C" },
            { title: "AI/ML Salary Benchmarks (2025)", evidenceGrade: "B" },
          ],
          domain: "career",
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
      data: { reportId: "report_sim_career", totalFindings: 6, totalInsights: 2, totalDurationMs: 48000 },
    },
  },
]
