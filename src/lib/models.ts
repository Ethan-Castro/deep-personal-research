import { ChatAnthropic } from "@langchain/anthropic"
import { ChatOpenAI } from "@langchain/openai"
import { ChatGoogleGenerativeAI } from "@langchain/google-genai"

const MODEL_ROUTING = {
  supervisor: "claude-sonnet-4-6",
  briefGenerator: "claude-sonnet-4-6",
  researcher: "gemini-2.5-flash",
  evidenceGrader: "gemini-2.5-flash",
  synthesizer: "claude-sonnet-4-6",
  reportWriter: "claude-sonnet-4-6",
} as const

type ModelRole = keyof typeof MODEL_ROUTING

export function getModel(role: ModelRole) {
  const modelId = MODEL_ROUTING[role]

  if (modelId.startsWith("claude")) {
    return new ChatAnthropic({ model: modelId, temperature: 0 })
  }

  if (modelId.startsWith("gpt")) {
    return new ChatOpenAI({ model: modelId, temperature: 0 })
  }

  if (modelId.startsWith("gemini") || modelId.startsWith("gemma")) {
    return new ChatGoogleGenerativeAI({ model: modelId, temperature: 0 })
  }

  // OpenAI-compatible endpoints (Kimi, Qwen, Nemotron)
  const compatibleEndpoints: Record<
    string,
    { baseURL: string; apiKeyEnv: string }
  > = {
    "kimi-k2.5": {
      baseURL: "https://api.moonshot.cn/v1",
      apiKeyEnv: "MOONSHOT_API_KEY",
    },
    "qwen-3.6": {
      baseURL: "https://dashscope.aliyuncs.com/compatible-mode/v1",
      apiKeyEnv: "DASHSCOPE_API_KEY",
    },
    "qwen-3.5-small": {
      baseURL: "https://dashscope.aliyuncs.com/compatible-mode/v1",
      apiKeyEnv: "DASHSCOPE_API_KEY",
    },
    "nemotron-super": {
      baseURL: "https://integrate.api.nvidia.com/v1",
      apiKeyEnv: "NVIDIA_API_KEY",
    },
  }

  const endpoint = compatibleEndpoints[modelId]
  if (endpoint) {
    return new ChatOpenAI({
      model: modelId,
      temperature: 0,
      configuration: {
        baseURL: endpoint.baseURL,
        apiKey: process.env[endpoint.apiKeyEnv],
      },
    })
  }

  throw new Error(`Unknown model: ${modelId}`)
}
