export type TaskType =
  | 'writing'
  | 'analysis'
  | 'brainstorming'
  | 'planning'
  | 'explanation'
  | 'general';

export function detectTaskType(input: string): TaskType {
  const text = input.toLowerCase();

  if (
    text.includes('write') ||
    text.includes('draft') ||
    text.includes('email') ||
    text.includes('subject line') ||
    text.includes('headline') ||
    text.includes('linkedin') ||
    text.includes('message') ||
    text.includes('copy') ||
    text.includes('post')
  ) {
    return 'writing';
  }

  if (
    text.includes('analyze') ||
    text.includes('analysis') ||
    text.includes('assess') ||
    text.includes('diagnose') ||
    text.includes('evaluate') ||
    text.includes('compare') ||
    text.includes('tradeoff') ||
    text.includes('pros and cons')
  ) {
    return 'analysis';
  }

  if (
    text.includes('brainstorm') ||
    text.includes('ideas') ||
    text.includes('options') ||
    text.includes('angles') ||
    text.includes('concepts') ||
    text.includes('creative')
  ) {
    return 'brainstorming';
  }

  if (
    text.includes('plan') ||
    text.includes('roadmap') ||
    text.includes('steps') ||
    text.includes('strategy') ||
    text.includes('approach') ||
    text.includes('how do i') ||
    text.includes('how to')
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