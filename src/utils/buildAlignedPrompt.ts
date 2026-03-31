import { ProfileConfig } from '../config/profiles';
import { LlmConfig } from '../config/llms';

export function buildAlignedPrompt(
  rawInput: string,
  profile: ProfileConfig,
  llm: LlmConfig
): string {
  const cleanInput = rawInput.trim();

  // -----------------------------
  // 1. CORE TASK REWRITE
  // -----------------------------
  const task = `Help me with the following:\n${cleanInput}`;

  // -----------------------------
  // 2. PROFILE-DRIVEN STYLE
  // -----------------------------
  const profileStyleMap: Record<string, string> = {
    '1': `Be precise, structured, and logically sound. Prioritize correctness and clarity.`,
    '2': `Keep the tone supportive and human-centered. Make the response helpful and considerate.`,
    '3': `Be concise, efficient, and focused on outcomes. Prioritize actionable results.`,
    '4': `Provide thoughtful, nuanced, and expressive insights. Avoid generic responses.`,
    '5': `Go deep. Provide detailed explanations, reasoning, and underlying principles.`,
    '6': `Be clear, structured, and reduce ambiguity. Include validation and potential risks.`,
    '7': `Offer multiple ideas and possibilities. Keep it engaging and forward-looking.`,
    '8': `Be direct, assertive, and to the point. No fluff. Focus on what actually works.`,
    '9': `Keep the response clear, balanced, and easy to follow. Avoid unnecessary complexity.`
  };

  const styleLayer = profileStyleMap[profile.id] || '';

  // -----------------------------
  // 3. LLM STRUCTURE LAYER
  // -----------------------------
  const llmStructureMap: Record<string, string> = {
    chatgpt: `Structure the response clearly using sections or bullet points.`,
    claude: `Provide a well-reasoned and thoughtfully structured response with clear explanations.`,
    grok: `Keep the response conversational and direct, but still structured.`,
    gemini: `Organize the response clearly and ensure broad coverage of the topic.`
  };

  const structureLayer = llmStructureMap[llm.id] || '';

  // -----------------------------
  // 4. OUTPUT QUALITY BOOST
  // -----------------------------
  const qualityLayer = `
Before answering:
- Clarify the intent if needed (but do not ask questions unless necessary)
- Fill in any obvious gaps intelligently

In your response:
- Be specific, not generic
- Avoid filler language
- Make the output immediately usable
`;

  // -----------------------------
  // 5. FINAL PROMPT
  // -----------------------------
  return `${task}

Instructions:
${styleLayer}
${structureLayer}

${qualityLayer}`.trim();
}