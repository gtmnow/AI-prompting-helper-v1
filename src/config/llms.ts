export type LlmId = 'chatgpt' | 'claude' | 'grok' | 'gemini';

export type LlmConfig = {
  id: LlmId;
  label: string;
  style: string;
  prefers: string[];
  structureHint: string;
};

export const llmConfigs: Record<LlmId, LlmConfig> = {
  chatgpt: {
    id: 'chatgpt',
    label: 'ChatGPT',
    style: 'balanced, instruction-following, adaptive',
    prefers: ['clear instructions', 'structured prompts'],
    structureHint: 'Use explicit instructions and a clean structure.',
  },
  claude: {
    id: 'claude',
    label: 'Claude',
    style: 'thoughtful, nuanced, context-heavy',
    prefers: ['context', 'clarity', 'intent'],
    structureHint: 'Include context, intent, and the desired depth of response.',
  },
  grok: {
    id: 'grok',
    label: 'Grok',
    style: 'casual, fast, conversational',
    prefers: ['direct questions', 'lighter structure'],
    structureHint: 'Keep it direct and conversational without overloading the prompt.',
  },
  gemini: {
    id: 'gemini',
    label: 'Gemini',
    style: 'informational, broad, utility-focused',
    prefers: ['clear tasks', 'scope definition'],
    structureHint: 'Define the task and desired scope clearly.',
  },
};

export const orderedLlms = Object.values(llmConfigs);
