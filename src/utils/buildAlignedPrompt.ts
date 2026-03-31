import { ProfileConfig } from '../config/profiles';
import { LlmConfig } from '../config/llms';
import { detectTaskType, TaskType } from './detectTaskType';

function getProfileAlignedTask(
  rawInput: string,
  profileId: string,
  taskType: TaskType
): string {
  const cleaned = rawInput.trim();

  const map: Record<string, Partial<Record<TaskType | 'default', string>>> = {
    '1': {
      default: `${cleaned}. Make the response precise, well-structured, and logically organized.`,
      analysis: `Analyze the following in a precise, well-structured way. Use clear logic and explicit reasoning: ${cleaned}`,
      planning: `Create a structured plan for the following, with clear priorities and ordered steps: ${cleaned}`,
      writing: `Write the following clearly and accurately, with strong structure and careful wording: ${cleaned}`,
    },
    '2': {
      default: `${cleaned}. Make the response helpful, considerate, and practical for the people involved.`,
      writing: `Write the following in a warm, clear, and effective way for the intended audience: ${cleaned}`,
      explanation: `Explain the following in a supportive, accessible, and easy-to-understand way: ${cleaned}`,
    },
    '3': {
      default: `${cleaned}. Focus on the strongest result and the most useful outcome.`,
      planning: `Create a focused action plan for the following, starting with the highest-impact steps: ${cleaned}`,
      writing: `Write the strongest final version of the following, keeping it sharp, effective, and ready to use: ${cleaned}`,
      analysis: `Analyze the following and lead with the strongest conclusion and the most practical next steps: ${cleaned}`,
    },
    '4': {
      default: `${cleaned}. Make the response thoughtful, nuanced, and distinctive rather than generic.`,
      writing: `Write the following with a distinct voice, strong tone, and meaningful expression: ${cleaned}`,
      brainstorming: `Generate original, non-obvious ideas for the following: ${cleaned}`,
    },
    '5': {
      default: `${cleaned}. Go deeper than surface-level advice and include reasoning where useful.`,
      analysis: `Analyze the following in a structured way. Explain causes, assumptions, and implications: ${cleaned}`,
      explanation: `Explain the following clearly and logically, building understanding step by step: ${cleaned}`,
      planning: `Create a plan for the following and explain why each step matters: ${cleaned}`,
    },
    '6': {
      default: `${cleaned}. Make the response dependable, clear, and low in ambiguity.`,
      planning: `Create a practical plan for the following, including likely risks and how to reduce them: ${cleaned}`,
      analysis: `Analyze the following clearly, separating facts, interpretation, and uncertainty: ${cleaned}`,
    },
    '7': {
      default: `${cleaned}. Explore strong options and useful possibilities while staying practical.`,
      brainstorming: `Generate a diverse set of strong, high-value ideas for the following: ${cleaned}`,
      planning: `Create a practical plan for the following, and include a few good alternative approaches if relevant: ${cleaned}`,
    },
    '8': {
      default: `${cleaned}. Focus on what matters most and what should be done first.`,
      analysis: `Analyze the following by identifying the core issue, the weak points, and the strongest move: ${cleaned}`,
      planning: `Create a direct, no-fluff action plan for the following, with the most important steps first: ${cleaned}`,
      writing: `Write the following clearly, strongly, and with purpose: ${cleaned}`,
    },
    '9': {
      default: `${cleaned}. Keep the response balanced, simple, and easy to act on.`,
      explanation: `Explain the following in a calm, step-by-step way that is easy to follow: ${cleaned}`,
      planning: `Create a clear, manageable sequence of steps for the following: ${cleaned}`,
    },
  };

  return map[profileId]?.[taskType] || map[profileId]?.default || cleaned;
}

function getTaskInstruction(taskType: TaskType): string {
  switch (taskType) {
    case 'writing':
      return `Produce polished language that is ready to use. Match the purpose, audience, and tone. Give the strongest final version first, then alternatives only if useful.`;

    case 'analysis':
      return `Break the issue into its key parts. Show the reasoning clearly. Identify the main drivers, tradeoffs, assumptions, and most important conclusions.`;

    case 'brainstorming':
      return `Generate multiple strong ideas, not minor variations of the same one. Prioritize variety, originality, and practical usefulness. Group ideas when it helps.`;

    case 'planning':
      return `Create a practical, ordered plan. Put the highest-leverage actions first. Make the result easy to execute.`;

    case 'explanation':
      return `Explain the topic clearly and step by step. Start simple, then add depth where helpful.`;

    default:
      return `Clarify the objective, strengthen the framing, and provide a practical, well-structured response.`;
  }
}

function getProfileStyleInstruction(profileId: string): string {
  const map: Record<string, string> = {
    '1': `Be precise, structured, and logically consistent. Prioritize correctness and clean reasoning.`,
    '2': `Keep the response human-centered, helpful, and considerate. Pay attention to tone and how the message will land.`,
    '3': `Be efficient, outcome-focused, and practical. Prioritize usefulness and speed.`,
    '4': `Be thoughtful, nuanced, and expressive. Avoid flattening the response into something generic.`,
    '5': `Go beyond surface-level advice. Include reasoning, structure, and why the answer works.`,
    '6': `Reduce ambiguity. Be dependable, clear, and well-structured. Include relevant caveats or risks.`,
    '7': `Keep the response engaging, possibility-oriented, and idea-rich while still useful.`,
    '8': `Be direct, decisive, and no-nonsense. Cut filler and focus on what matters most.`,
    '9': `Keep the response clear, calm, balanced, and easy to follow. Avoid unnecessary complexity.`,
  };

  return map[profileId] || '';
}

function getProfilePatternInstruction(profileId: string, taskType: TaskType): string {
  const map: Record<string, Partial<Record<TaskType | 'default', string>>> = {
    '1': {
      default: `Use a clean structure with labeled sections or ordered steps.`,
      analysis: `Use a logical breakdown with explicit reasoning.`,
      planning: `Use a step-by-step plan with clear priorities and sequence.`,
      writing: `Prefer organized, well-formed output over loose creative variation.`,
    },
    '2': {
      default: `Make the response approachable and easy to apply with people.`,
      writing: `Optimize for warmth, clarity, helpfulness, and audience response.`,
      explanation: `Explain in a supportive, accessible way.`,
    },
    '3': {
      default: `Lead with the strongest answer first, then supporting points.`,
      planning: `Give a short, high-impact action plan.`,
      writing: `Give the strongest final draft first. Keep it sharp and effective.`,
      analysis: `Lead with the conclusion, then the evidence.`,
    },
    '4': {
      default: `Preserve voice, nuance, and originality.`,
      writing: `Make the language distinctive, authentic, and well-shaped.`,
      brainstorming: `Favor originality and fresh angles over obvious ideas.`,
    },
    '5': {
      default: `Include logic, assumptions, explanation, and useful depth.`,
      analysis: `Use a structured breakdown with reasoning and implications.`,
      explanation: `Start with the core idea, then unpack the logic behind it.`,
      planning: `Explain why the sequence makes sense, not just what to do.`,
    },
    '6': {
      default: `Use a dependable structure with clear guidance and relevant cautions.`,
      planning: `Include likely risks, failure points, and how to reduce them.`,
      analysis: `Separate evidence, interpretation, and uncertainty clearly.`,
    },
    '7': {
      default: `Offer multiple meaningful options when helpful.`,
      brainstorming: `Generate a diverse set of ideas and group them into useful categories.`,
      planning: `Offer a practical path, plus a few good alternate approaches if relevant.`,
    },
    '8': {
      default: `Lead with the strongest recommendation. Be bluntly clear.`,
      analysis: `Call out the core issue, weak points, and best move.`,
      planning: `Give a direct action sequence with no fluff.`,
      writing: `Make it clear, strong, and purposeful.`,
    },
    '9': {
      default: `Keep the structure simple, balanced, and easy to absorb.`,
      explanation: `Walk through the answer in a calm, stepwise way.`,
      planning: `Use a straightforward sequence that feels manageable.`,
    },
  };

  return map[profileId]?.[taskType] || map[profileId]?.default || '';
}

function getLlmInstruction(llmId: string): string {
  const map: Record<string, string> = {
    chatgpt: `Use clear structure, explicit formatting, and practical wording.`,
    claude: `Preserve context, nuance, and reasoning clarity.`,
    grok: `Keep the tone direct and conversational, but still organized.`,
    gemini: `Keep the response broad enough to be useful, but avoid filler.`,
  };

  return map[llmId] || '';
}

function getQualityInstruction(taskType: TaskType): string {
  switch (taskType) {
    case 'writing':
      return `Make the language polished, specific, and ready to use. Improve clarity, tone, and effectiveness.`;

    case 'analysis':
      return `Be specific. Distinguish facts, reasoning, assumptions, and conclusions.`;

    case 'brainstorming':
      return `Avoid repetitive ideas. Prefer a smaller number of strong ideas over many weak ones.`;

    case 'planning':
      return `Make the plan actionable, prioritized, and practical.`;

    case 'explanation':
      return `Favor clarity first, depth second.`;

    default:
      return `Be specific, practical, and immediately useful. Avoid filler.`;
  }
}

export function buildAlignedPrompt(
  rawInput: string,
  profile: ProfileConfig,
  llm: LlmConfig
): string {
  const cleanInput = rawInput.trim();
  const taskType = detectTaskType(cleanInput);

  const alignedTask = getProfileAlignedTask(cleanInput, profile.id, taskType);
  const taskInstruction = getTaskInstruction(taskType);
  const profileStyleInstruction = getProfileStyleInstruction(profile.id);
  const profilePatternInstruction = getProfilePatternInstruction(profile.id, taskType);
  const llmInstruction = getLlmInstruction(llm.id);
  const qualityInstruction = getQualityInstruction(taskType);

  return `${alignedTask}

Task handling:
${taskInstruction}

User communication style:
${profileStyleInstruction}

Preferred response pattern:
${profilePatternInstruction}

Model-specific guidance:
${llmInstruction}

Quality bar:
${qualityInstruction}

Improve the framing where needed so the final result is clearer, stronger, and more useful than the original wording. Do not ask follow-up questions unless absolutely necessary.`
    .trim();
}