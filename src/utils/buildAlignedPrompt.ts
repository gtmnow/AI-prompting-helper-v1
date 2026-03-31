import { LlmConfig } from '../config/llms';
import { ProfileConfig } from '../config/profiles';

export function buildAlignedPrompt(userQuestion: string, profile: ProfileConfig, llm: LlmConfig): string {
  const cleanedQuestion = userQuestion.trim();

  const sections: string[] = [
    `Help me with this request: ${cleanedQuestion}`,
    '',
    `Write the response in a way that fits a ${profile.label.toLowerCase()} communication style: ${profile.promptStyle}.`,
    `Emphasize: ${profile.prefers.join(', ')}.`,
    `Avoid: ${profile.avoid.join(', ')}.`,
    '',
    `Optimize the response for ${llm.label}'s interaction style: ${llm.style}.`,
    llm.structureHint,
    '',
    'Please deliver the answer in a clear, usable format.',
  ];

  if (profile.id === '3' || profile.id === '8') {
    sections.push('Keep the output concise and action-oriented.');
  }

  if (profile.id === '5' || profile.id === '6') {
    sections.push('Include reasoning, assumptions, and a clear step-by-step structure where helpful.');
  }

  if (profile.id === '4' || profile.id === '7') {
    sections.push('Allow for creativity and interesting angles while still answering the core request.');
  }

  return sections.join('\n');
}
