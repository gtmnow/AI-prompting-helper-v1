import { ProfileConfig } from '../config/profiles';
import { LlmConfig } from '../config/llms';
import { detectTaskType, TaskType } from './detectTaskType';

function getContextResetInstruction(): string {
  return `Treat this as a completely new, standalone request. Ignore any previous conversation, prior assumptions, earlier instructions, or existing context unless it is explicitly included below.`;
}

function getProfileAlignedTask(
  rawInput: string,
  profileId: string,
  taskType: TaskType
): string {
  const cleaned = rawInput.trim();

  const map: Record<string, Partial<Record<TaskType | 'default', string>>> = {
    '1': {
      default: `Strengthen and complete the following request so the result is precise, logically sound, and clearly organized:

${cleaned}`,
      analysis: `Analyze the following in a precise, well-structured way. Use explicit logic, clear reasoning, and defensible conclusions:

${cleaned}`,
      planning: `Create a structured plan for the following. Use clear priorities, ordered steps, and a logical sequence:

${cleaned}`,
      writing: `Write the following with accuracy, clarity, and strong organization. Make the wording disciplined and well-structured:

${cleaned}`,
    },
    '2': {
      default: `Strengthen the following request so the result is helpful, considerate, and practical for the people involved:

${cleaned}`,
      writing: `Write the following in a warm, clear, and thoughtful way. Make it effective for the intended audience and attentive to how it will be received:

${cleaned}`,
      explanation: `Explain the following in a supportive, accessible, and easy-to-understand way that helps the reader feel guided rather than overwhelmed:

${cleaned}`,
    },
    '3': {
      default: `Strengthen the following request so it produces the most useful, high-impact result with minimal wasted motion:

${cleaned}`,
      planning: `Create a focused action plan for the following. Start with the highest-impact steps and keep it execution-oriented:

${cleaned}`,
      writing: `Write the strongest final version of the following. Make it sharp, effective, and ready to use immediately:

${cleaned}`,
      analysis: `Analyze the following and lead with the strongest conclusion, the most important drivers, and the most useful next actions:

${cleaned}`,
    },
    '4': {
      default: `Strengthen the following request so the result is thoughtful, nuanced, and distinctive rather than generic:

${cleaned}`,
      writing: `Write the following with a distinct voice, strong tone, and meaningful expression. Make it feel authentic rather than formulaic:

${cleaned}`,
      brainstorming: `Generate original, non-obvious ideas for the following. Favor freshness, resonance, and interesting angles over safe repetition:

${cleaned}`,
    },
    '5': {
      default: `Strengthen the following request so the result goes beyond surface-level advice and includes real substance, reasoning, and structure:

${cleaned}`,
      analysis: `Analyze the following in a structured way. Explain causes, assumptions, implications, and the reasoning behind the conclusions:

${cleaned}`,
      explanation: `Explain the following clearly and logically, building understanding step by step from core principles:

${cleaned}`,
      planning: `Create a plan for the following and explain why each step matters, not just what to do:

${cleaned}`,
    },
    '6': {
      default: `Strengthen the following request so the result is dependable, clear, and low in ambiguity:

${cleaned}`,
      planning: `Create a practical plan for the following, including likely risks, weak points, and how to reduce mistakes:

${cleaned}`,
      analysis: `Analyze the following clearly, separating facts, interpretation, uncertainty, and likely implications:

${cleaned}`,
    },
    '7': {
      default: `Strengthen the following request so the result explores strong possibilities, useful options, and creative paths while staying practical:

${cleaned}`,
      brainstorming: `Generate a diverse set of strong, high-value ideas for the following. Favor variety, energy, and useful possibilities over narrow repetition:

${cleaned}`,
      planning: `Create a practical plan for the following, and include a few strong alternate approaches if they add value:

${cleaned}`,
    },
    '8': {
      default: `Strengthen the following request so the result is direct, high-value, and focused on what matters most and what should be done first:

${cleaned}`,
      analysis: `Analyze the following by identifying the core issue, the weak points, and the strongest move. Be direct and decisive:

${cleaned}`,
      planning: `Create a direct, no-fluff action plan for the following, with the most important steps first:

${cleaned}`,
      writing: `Write the following clearly, strongly, and with purpose. Make it decisive and effective:

${cleaned}`,
    },
    '9': {
      default: `Strengthen the following request so the result is balanced, simple, and easy to act on:

${cleaned}`,
      explanation: `Explain the following in a calm, step-by-step way that is easy to follow and easy to absorb:

${cleaned}`,
      planning: `Create a clear, manageable sequence of steps for the following. Keep it practical and straightforward:

${cleaned}`,
    },
  };

  return map[profileId]?.[taskType] || map[profileId]?.default || cleaned;
}

function getTaskInstruction(taskType: TaskType): string {
  switch (taskType) {
    case 'writing':
      return `Produce polished language that is ready to use. Match the purpose, audience, and tone. Give the strongest final version first, then alternatives only if they add clear value.`;

    case 'analysis':
      return `Break the issue into its key parts. Show the reasoning clearly. Identify the main drivers, tradeoffs, assumptions, and most important conclusions.`;

    case 'brainstorming':
      return `Generate multiple strong ideas, not minor variations of the same idea. Prioritize variety, originality, and practical usefulness. Group ideas when it improves clarity.`;

    case 'planning':
      return `Create a practical, ordered plan. Put the highest-leverage actions first. Make the result easy to execute in the real world.`;

    case 'explanation':
      return `Explain the topic clearly and step by step. Start simple, then add depth where it genuinely helps understanding.`;

    default:
      return `Clarify the objective, strengthen the framing, and provide a practical, well-structured result.`;
  }
}

function getProfileStyleInstruction(profileId: string): string {
  const map: Record<string, string> = {
    '1': `Be precise, structured, and logically consistent. Prioritize correctness, clarity, and disciplined reasoning.`,
    '2': `Be human-centered, helpful, and considerate. Pay attention to tone, empathy, and how the message will land.`,
    '3': `Be efficient, outcome-focused, and practical. Prioritize usefulness, momentum, and strong execution value.`,
    '4': `Be thoughtful, nuanced, and expressive. Preserve voice and avoid flattening the response into something generic.`,
    '5': `Go beyond surface-level advice. Include reasoning, structure, and enough depth to make the answer intellectually satisfying.`,
    '6': `Reduce ambiguity. Be dependable, clear, and well-structured. Include relevant caveats, risks, or validation points where useful.`,
    '7': `Be engaging, possibility-oriented, and idea-rich while still staying useful and grounded.`,
    '8': `Be direct, decisive, and no-nonsense. Cut filler and focus on what matters most.`,
    '9': `Be clear, calm, balanced, and easy to follow. Avoid unnecessary intensity or complication.`,
  };

  return map[profileId] || '';
}

function getProfileBehaviorInstruction(profileId: string, taskType: TaskType): string {
  const map: Record<string, Partial<Record<TaskType | 'default', string>>> = {
    '1': {
      default: `Prefer order, correctness, and internal consistency over speed or novelty.`,
      analysis: `Test the logic, eliminate weak reasoning, and arrive at the cleanest defensible conclusion.`,
      planning: `Prefer the most disciplined and orderly path, even if it is less flashy.`,
    },
    '2': {
      default: `Optimize for human usefulness, emotional intelligence, and how the response will be received by others.`,
      writing: `Make the message considerate, relational, and likely to create a positive response.`,
      explanation: `Reduce friction, increase reassurance, and help the reader feel supported.`,
    },
    '3': {
      default: `Optimize for results, momentum, and practical payoff. Do not spend too much time on nuance that does not improve execution.`,
      analysis: `Move quickly to the highest-value conclusion and recommended action.`,
      planning: `Favor the shortest credible path to a strong result.`,
    },
    '4': {
      default: `Favor authenticity, originality, and meaningful expression over standardized or generic output.`,
      writing: `Avoid canned phrasing. Make the response feel distinct and human.`,
      brainstorming: `Push toward fresh, resonant, and non-obvious ideas rather than safe ones.`,
    },
    '5': {
      default: `Optimize for depth, understanding, and explanatory integrity. Do not skip the reasoning.`,
      analysis: `Interrogate assumptions, trace causes, and make the logic visible.`,
      explanation: `Teach the idea, not just the conclusion.`,
    },
    '6': {
      default: `Optimize for trustworthiness, clarity, and risk awareness. Reduce avoidable ambiguity.`,
      analysis: `Distinguish what is known, what is inferred, and what remains uncertain.`,
      planning: `Surface possible failure points and how to manage them.`,
    },
    '7': {
      default: `Optimize for optionality, idea range, and energetic exploration before narrowing.`,
      brainstorming: `Generate multiple distinct directions and avoid converging too quickly on one answer.`,
      planning: `Present a primary path, but include strong alternate routes if they add value.`,
    },
    '8': {
      default: `Optimize for decisiveness, strength, and action. Do not hedge unnecessarily or present weak alternatives.`,
      analysis: `Identify the central problem fast, call out what is weak, and commit to the strongest move.`,
      planning: `Choose the clearest path and drive toward execution without fluff.`,
    },
    '9': {
      default: `Optimize for clarity, steadiness, and ease of use. Reduce unnecessary tension, overload, or complexity.`,
      explanation: `Make the response smooth, calm, and easy to absorb.`,
      planning: `Present a manageable path that feels realistic and not overwhelming.`,
    },
  };

  return map[profileId]?.[taskType] || map[profileId]?.default || '';
}

function getProfilePatternInstruction(profileId: string, taskType: TaskType): string {
  const map: Record<string, Partial<Record<TaskType | 'default', string>>> = {
    '1': {
      default: `Use a clean structure with labeled sections or ordered steps.`,
      analysis: `Use a logical breakdown with explicit reasoning and clearly separated conclusions.`,
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
      analysis: `Lead with the conclusion, then the evidence and next steps.`,
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
      planning: `Offer a practical path, plus a few strong alternate approaches if relevant.`,
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

  const contextResetInstruction = getContextResetInstruction();
  const alignedTask = getProfileAlignedTask(cleanInput, profile.id, taskType);
  const taskInstruction = getTaskInstruction(taskType);
  const profileStyleInstruction = getProfileStyleInstruction(profile.id);
  const profileBehaviorInstruction = getProfileBehaviorInstruction(profile.id, taskType);
  const profilePatternInstruction = getProfilePatternInstruction(profile.id, taskType);
  const llmInstruction = getLlmInstruction(llm.id);
  const qualityInstruction = getQualityInstruction(taskType);

  return `${contextResetInstruction}

${alignedTask}

Instructions:
${taskInstruction}
${profileBehaviorInstruction}
${profilePatternInstruction}

Style:
${profileStyleInstruction}

Model guidance:
${llmInstruction}

Constraints:
${qualityInstruction}

Strengthen weak wording, fill in obvious gaps intelligently, and make the result feel like it was written by an expert rather than generated by an AI. Do not ask follow-up questions unless absolutely necessary.`
    .trim();
}