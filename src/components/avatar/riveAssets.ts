export const RIVE_ASSET_PATH = "/rive/agent-avatar.riv"
export const STATE_MACHINE_NAME = "AvatarStateMachine"

// Maps AvatarState to state machine number input value
export const AVATAR_STATE_TO_NUMBER: Record<string, number> = {
  spawned: 0,
  thinking: 1,
  searching: 2,
  found: 3,
  complete: 4,
  error: 5,
}

// Team colors used for runtime tinting
export const TEAM_COLORS = {
  orchestrator: "#a855f7",
  health: "#10b981",
  career: "#3b82f6",
  synthesis: "#f59e0b",
} as const
