# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

@AGENTS.md

## Commands

```bash
npm run dev      # Start dev server (Next.js 16, localhost:3000)
npm run build    # Production build
npm run lint     # ESLint (flat config, no --fix flag)
```

No test framework is configured yet.

## Architecture

**Personal PI** is a multi-agent deep research app. Users submit a profile (health and/or career), a LangGraph-powered backend orchestrates specialized AI agents that search real data sources, then delivers an evidence-graded report — all streamed live to a visual constellation map.

### Backend Pipeline (`src/agents/pipeline.ts`)

Sequential 5-step pipeline, each step emitting `AgentEvent`s via SSE:

1. **Brief Generator** — LLM turns user profile into research questions and priority areas
2. **Supervisor** — Orchestrates researcher agents in two phases: data-gathering (parallel), then synthesis agents enriched with phase-1 findings
3. **Evidence Grader** — Grades each finding A–F using the schema in `src/lib/types.ts`
4. **Synthesizer** — Merges graded findings into cross-domain insights
5. **Report Writer** — Produces sectioned report with citations

### Agent / Model Routing (`src/lib/models.ts`)

Model routing is role-based: supervisor/brief/synthesizer/report → Claude Sonnet, researcher/grader → Gemini Flash. The `getModel()` factory supports Anthropic, OpenAI, Google, and OpenAI-compatible endpoints (Moonshot, DashScope, NVIDIA).

### Research Agents (`src/agents/researcher.ts`)

Pre-built agent configs per domain:
- **Health**: `pubmed_researcher`, `genetics_analyst`, `protocol_builder`
- **Career**: uses O*NET, BLS, Exa tools

Each agent runs a tool-calling loop against its assigned tools (`src/tools/`), emitting thinking/tool_call/finding events.

### Real-time Streaming

- API: `POST /api/research/start` creates session → `GET /api/research/stream?sessionId=` returns SSE stream of `AgentEvent`
- Session state is in-memory (`src/lib/sessionStore.ts` — Map-based, no persistence yet)
- Client: `useAgentStream` hook consumes SSE, dispatches to Zustand store (`useResearchState`)

### Frontend Visualization

- **Constellation Map** (`src/components/constellation/`) — React Flow graph that builds dynamically from agent events. Node types: center, agent, finding, insight, source. Layout via dagre.
- **Research Stage** (`src/components/stage/`) — Orchestrator area + team columns showing agent avatars with Rive/Lottie animations
- **Transparency Dock** (`src/components/transparency/`) — Activity feed, finding cards, tool call cards
- **Report View** (`src/components/report/`) — Paper-style rendered report with evidence badges and export

### State Management

Single Zustand store (`useResearchState`) holds all session state: nodes/edges for the constellation, findings, insights, report sections, activity log. The `useAgentStream` hook is the sole writer.

### Key Conventions

- Path alias: `@/*` → `./src/*`
- Zod schemas in `src/lib/types.ts` are the source of truth for all data shapes
- `AgentEvent` type in `src/lib/events.ts` defines the event protocol between backend and frontend
- UI components in `src/components/ui/` are shadcn/ui (Base UI + CVA + Tailwind v4)
- Sim/demo mode: `src/app/research/sim/page.tsx` with mock data from `src/lib/simData.ts` and `src/lib/simCareer.ts`

### Environment Variables

Required API keys: `ANTHROPIC_API_KEY`, `GOOGLE_API_KEY`, `EXA_API_KEY`. Optional: `MOONSHOT_API_KEY`, `DASHSCOPE_API_KEY`, `NVIDIA_API_KEY` for alternative model endpoints.
