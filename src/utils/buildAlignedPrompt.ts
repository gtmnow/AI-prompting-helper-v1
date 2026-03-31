import { ProfileConfig } from '../config/profiles';
import { LlmConfig } from '../config/llms';

type TaskType =
  | 'writing'
  | 'analysis'
  | 'brainstorming'
  | 'planning'
  | 'explanation'
  | 'general';

function detectTaskType(input: string): TaskType {
  const text = input.toLowerCase();

  if (
    text.includes('write') ||
    text.includes('draft') ||
    text.includes('email') ||
    text.includes('subject line') ||
    text.includes('linkedin') ||
    text.includes('post') ||
    text.includes('message') ||
    text.includes('copy') ||
    text.includes('headline')
  ) {
    return 'writing';
  }

  if (
    text.includes('analyze') ||
    text.includes('analysis') ||
    text.includes('compare') ||
    text.includes('evaluate') ||
    text.includes('assess') ||
    text.includes('diagnose') ||
    text.includes('pros and cons') ||
    text.includes('tradeoff')
  ) {
    return 'analysis';
  }

  if (
    text.includes('brainstorm') ||
    text.includes('ideas') ||
    text.includes('creative') ||
    text.includes('options') ||
    text.includes('concepts') ||
    text.includes('angles')
  ) {
    return 'brainstorming';
  }

  if (
    text.includes('plan') ||
    text.includes('roadmap') ||
    text.includes('steps') ||
    text.includes('strategy') ||
    text.includes('how do i') ||
    text.includes('how to') ||
    text.includes('approach')
  ) {
    return 'planning';
  }

  if (
    text.includes('explain') ||
    text.includes('what is') ||
    text.includes('help me understand') ||
    text.includes('teach me') ||
    text.includes('walk me through')
  ) {
    return 'explanation';
  }

  return 'general';
}

function getTaskInstruction(taskType: TaskType): string {
  switch (taskType) {
    case 'writing':
      return `This is a writing task. Produce polished language, not rough notes. Match the requested purpose and audience. If useful, provide a strong final version first, then optional alternatives.`;

    case 'analysis':
      return `This is an analysis task. Break the issue into key factors, explain the reasoning clearly, and identify the most important takeaways. Include tradeoffs, risks, or assumptions where relevant.`;

    case 'brainstorming':
      return `This is a brainstorming task. Generate multiple strong ideas, not minor variations of the same idea. Prioritize variety, originality, and practical usefulness. Group ideas when helpful.`;

    case 'planning':
      return `This is a planning task. Create a practical, ordered approach. Prioritize the highest-leverage actions first. Make the result actionable and easy to execute.`;

    case 'explanation':
      return `This is an explanation task. Explain clearly and in a way that builds understanding step by step. Use plain language first, then add depth where helpful.`;

    default:
      return `Treat this as a general problem-solving task. Clarify the objective, improve the wording, and make the response useful and well-structured.`;
  }
}

function getProfileInstruction(profileId: string): string {
  const profileInstructionMap: Record<string, string> = {
    '1': `Be precise, structured, and logically consistent. Prioritize correctness, clean reasoning, and clear organization. Avoid loose or fuzzy framing.`,

    '2': `Keep the response human-centered, helpful, and considerate. Make the tone warm but still practical. Pay attention to how the message will land with people.`,

    '3': `Keep the response efficient, outcome-focused, and practical. Lead with the strongest answer. Prioritize usefulness, speed, and clarity over nuance for its own sake.`,

    '4': `Make the response thoughtful, nuanced, and expressive. Avoid generic language. Preserve tone, individuality, and depth where appropriate.`,

    '5': `Go deeper than surface-level advice. Include reasoning, structure, assumptions, and why the answer works. Support the recommendation with substance.`,

    '6': `Reduce ambiguity. Be clear, well-structured, and dependable. Include risk factors, caveats, or validation points where relevant so the answer feels trustworthy.`,

    '7': `Keep the response engaging, possibility-oriented, and idea-rich. Offer multiple promising directions when useful, while still keeping the answer practical.`,

    '8': `Be direct, decisive, and no-nonsense. Cut filler. Focus on what matters most, what actually works, and what should be done first.`,

    '9': `Keep the response clear, calm, and balanced. Make it easy to follow. Avoid unnecessary intensity or overcomplication.`
  };

  return profileInstructionMap[profileId] || '';
}

function getProfileFormatInstruction(profileId: string, taskType: TaskType): string {
  const formatMap: Record<string, Partial<Record<TaskType | 'default', string>>> = {
    '1': {
      default: `Use a clean structure with labeled sections or ordered steps.`,
      analysis: `Use labeled sections and a logical sequence. Make the reasoning easy to audit.`,
      planning: `Use an ordered step-by-step plan with clear priorities.`,
    },
    '2': {
      default: `Keep the structure clear and approachable. Make the response easy to apply with people.`,
      writing: `Optimize for tone, clarity, and audience response.`,
    },
    '3': {
      default: `Lead with the best answer first, then supporting points.`,
      planning: `Use a short action plan with highest-impact actions first.`,
      writing: `Give the strongest final draft first. Keep it sharp and effective.`,
    },
    '4': {
      default: `Preserve nuance and voice. Avoid flattening the response into something generic.`,
      writing: `Make the wording distinctive, authentic, and well-shaped.`,
    },
    '5': {
      default: `Include underlying logic, assumptions, and explanation.`,
      analysis: `Use a structured breakdown, with reasoning and implications.`,
      explanation: `Start with the core idea, then unpack the logic behind it.`,
    },
    '6': {
      default: `Use a dependable structure with clear guidance and any relevant cautions.`,
      planning: `Include key steps, likely risks, and how to reduce mistakes.`,
    },
    '7': {
      default: `Offer multiple viable options when useful, but keep them distinct and meaningful.`,
      brainstorming: `Generate a diverse set of ideas and group them into useful categories.`,
    },
    '8': {
      default: `Be bluntly clear. Lead with the strongest recommendation.`,
      analysis: `Call out the core issue, weak points, and best move.`,
      planning: `Give a direct action sequence with no fluff.`,
    },
    '9': {
      default: `Keep the answer simple, balanced, and easy to absorb.`,
      explanation: `Walk through the answer in a calm, stepwise way.`,
    },
  };

  return formatMap[profileId]?.[taskType] || formatMap[profileId]?.default || '';
}

function getLlmInstruction(llmId: string): string {
  const llmInstructionMap: Record<string, string> = {
    chatgpt: `Structure the response clearly. Use explicit headings or bullets when useful. Follow the instructions closely and keep the result practical.`,

    claude: `Provide a thoughtful, well-reasoned response with strong clarity and nuance. Preserve context and explain your reasoning when helpful.`,

    grok: `Keep the response direct, conversational, and energetic, but still organized enough to be easy to use.`,

    gemini: `Organize the response clearly and ensure broad, useful coverage of the topic without drifting into filler.`
  };

  return llmInstructionMap[llmId] || '';
}

function getQualityInstruction(taskType: TaskType): string {
  const shared = `Be specific, not generic. Avoid filler. Make the result immediately usable.`;

  switch (taskType) {
    case 'writing':
      return `${shared} Make the language polished and ready to use. If relevant, improve clarity, tone, and persuasion.`;

    case 'analysis':
      return `${shared} Distinguish facts, reasoning, assumptions, and conclusions.`;

    case 'brainstorming':
      return `${shared} Avoid repetitive ideas. Prefer fewer strong ideas over many weak ones.`;

    case 'planning':
      return `${shared} Prioritize sequence, execution, and leverage.`;

    case 'explanation':
      return `${shared} Favor clarity first, depth second.`;

    default:
      return shared;
  }
}

export function buildAlignedPrompt(
  rawInput: string,
  profile: ProfileConfig,
  llm: LlmConfig
): string {
  const cleanInput = rawInput.trim();
  const taskType = detectTaskType(cleanInput);

  const taskInstruction = getTaskInstruction(taskType);
  const profileInstruction = getProfileInstruction(profile.id);
  const profileFormatInstruction = getProfileFormatInstruction(profile.id, taskType);
  const llmInstruction = getLlmInstruction(llm.id);
  const qualityInstruction = getQualityInstruction(taskType);

  return `I want help with the following task:

${cleanInput}

Please respond in a way that is aligned to my communication style and optimized for this AI model.

Task handling:
${taskInstruction}

User alignment:
${profileInstruction}

Response structure:
${profileFormatInstruction}

Model alignment:
${llmInstruction}

Quality bar:
${qualityInstruction}

Before answering, improve the framing of the task where needed so the final result is clearer, stronger, and more useful than the original request. Do not ask follow-up questions unless absolutely necessary.`
    .trim();
}