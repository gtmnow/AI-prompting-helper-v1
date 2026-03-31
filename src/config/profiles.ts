export type ProfileId = '1' | '2' | '3' | '4' | '5' | '6' | '7' | '8' | '9';

export type ProfileConfig = {
  id: ProfileId;
  label: string;
  style: string;
  promptStyle: string;
  prefers: string[];
  avoid: string[];
};

export const profileConfigs: Record<ProfileId, ProfileConfig> = {
  '1': {
    id: '1',
    label: 'Reformer',
    style: 'structured, precise, correctness-oriented',
    promptStyle: 'explicit, structured, step-by-step',
    prefers: ['clear instructions', 'accuracy', 'logic'],
    avoid: ['vagueness', 'loose framing'],
  },
  '2': {
    id: '2',
    label: 'Helper',
    style: 'supportive, relational, people-focused',
    promptStyle: 'friendly, context-aware, human-centered',
    prefers: ['tone awareness', 'helpfulness', 'empathy'],
    avoid: ['cold tone', 'overly technical language'],
  },
  '3': {
    id: '3',
    label: 'Achiever',
    style: 'efficient, outcome-driven, results-focused',
    promptStyle: 'concise, goal-oriented',
    prefers: ['speed', 'clarity', 'action'],
    avoid: ['rambling', 'unnecessary detail'],
  },
  '4': {
    id: '4',
    label: 'Individualist',
    style: 'expressive, nuanced, meaning-focused',
    promptStyle: 'rich, descriptive, expressive',
    prefers: ['depth', 'uniqueness', 'tone'],
    avoid: ['generic output', 'flat language'],
  },
  '5': {
    id: '5',
    label: 'Investigator',
    style: 'analytical, detailed, knowledge-focused',
    promptStyle: 'detailed, structured, technical',
    prefers: ['depth', 'logic', 'explanations'],
    avoid: ['surface-level answers', 'unsupported claims'],
  },
  '6': {
    id: '6',
    label: 'Loyalist',
    style: 'risk-aware, cautious, validation-seeking',
    promptStyle: 'clear, validated, step-by-step with caveats',
    prefers: ['certainty', 'steps', 'risk clarity'],
    avoid: ['ambiguity', 'overconfidence'],
  },
  '7': {
    id: '7',
    label: 'Enthusiast',
    style: 'fast, idea-driven, exploratory',
    promptStyle: 'open-ended, idea-rich',
    prefers: ['options', 'variety', 'possibilities'],
    avoid: ['rigid structure', 'narrow framing'],
  },
  '8': {
    id: '8',
    label: 'Challenger',
    style: 'direct, assertive, control-oriented',
    promptStyle: 'direct, no fluff',
    prefers: ['straight answers', 'clarity', 'decisive language'],
    avoid: ['soft language', 'hedging'],
  },
  '9': {
    id: '9',
    label: 'Peacemaker',
    style: 'balanced, calm, harmony-focused',
    promptStyle: 'clear, simple, balanced',
    prefers: ['clarity', 'ease', 'non-conflict'],
    avoid: ['intensity', 'pressure'],
  },
};

export const orderedProfiles = Object.values(profileConfigs);
