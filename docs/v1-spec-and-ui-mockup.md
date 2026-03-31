# AI Prompting Helper — V1 Product Spec

## Goal
Build a lightweight iframe-ready web app for Herman Science that helps a user turn a raw question into an LLM-ready prompt aligned to:
- the user's Herman personality type (1–9)
- the selected LLM's inferred interaction style

## V1 success criteria
A user can:
1. arrive with a Herman profile passed by URL
2. confirm their profile on screen
3. choose a target LLM
4. enter a raw question
5. generate a rewritten prompt
6. copy the final prompt

This version should be simple enough to build quickly and embed via iframe.

---

## Scope

### In scope for V1
- Read `profile` from URL query string
- Accept numeric profile values `1` through `9`
- Show profile label on screen
- LLM dropdown with initial options:
  - ChatGPT
  - Claude
  - Grok
  - Gemini
- Hardcoded mapping of each LLM to an inferred communication style
- Textarea for the user's raw question
- Generate button
- Output area with aligned prompt
- Copy button
- Basic validation and fallback states
- Responsive single-screen layout
- Clean embed-friendly styling

### Out of scope for V1
- Login or authentication
- Direct Herman API integration
- Saving history
- Advanced editing modes
- Multi-step wizard
- Deep Enneagram logic such as wings/subtypes
- Analytics dashboard
- Database

---

## Inputs

### URL input
Example:
`/prompt-helper?profile=8`

### User input
- Raw question/task
- Selected LLM

---

## Core logic

### User profile mapping
Map profile number to:
- label
- short style summary
- prompt preferences

Example fields:
- `id`
- `label`
- `style`
- `prefers`
- `avoid`
- `promptStyle`

### LLM mapping
Map selected LLM to:
- label
- short inferred interaction style
- preferred instruction pattern

### Prompt generation
The generator will combine:
- raw user question
- user profile prompt style
- LLM preferred instruction pattern

Output structure should be deterministic and simple.

### V1 prompt output format
Each generated prompt should generally include:
1. the task restated clearly
2. tone/style guidance matched to the user
3. structural guidance matched to the LLM
4. optional constraints like concise, detailed, step-by-step, direct, etc.

---

## Functional requirements

### FR1 — Read URL profile
- If `profile` exists and is valid (`1`–`9`), use it
- If invalid or missing, show a profile selector fallback

### FR2 — Show confirmation strip
The screen should show:
- Your profile: `[label] ([number])`
- Selected AI: `[llm]`
- AI style: `[short style]`

### FR3 — User question input
- Large textarea
- Placeholder example: `What do you want to ask the AI?`

### FR4 — Generate aligned prompt
On button click:
- validate input
- run prompt builder
- display formatted output

### FR5 — Copy prompt
- One-click copy to clipboard
- Brief success state such as `Copied`

### FR6 — Embed-safe layout
- No heavy nav
- No modal requirement
- One-screen design suitable for iframe

---

## Non-functional requirements
- Fast load
- No backend required for V1 unless later needed
- Clean React single-page app
- Mobile-friendly though primarily desktop iframe use
- Simple configuration objects for profiles and LLM styles

---

## Recommended stack
- React
- TypeScript
- Vite
- Plain CSS or lightweight utility styling

This is the fastest path for a solid V1.

---

## Suggested file structure
```text
src/
  components/
    PromptHelper.tsx
    StatusStrip.tsx
    PromptInput.tsx
    PromptOutput.tsx
  config/
    profiles.ts
    llms.ts
  utils/
    getProfileFromUrl.ts
    buildAlignedPrompt.ts
  App.tsx
  main.tsx
```

---

## Data model sketch

### Profile config
```ts
{
  id: "8",
  label: "Challenger",
  style: "direct, assertive, control-oriented",
  promptStyle: "direct, no fluff"
}
```

### LLM config
```ts
{
  id: "chatgpt",
  label: "ChatGPT",
  style: "balanced, instruction-following, adaptive",
  prefers: ["clear instructions", "structured prompts"]
}
```

---

## Build plan for under 2 hours

### Phase 1 — Skeleton app
- Create Vite React TypeScript app
- Add one-page layout
- Add dummy inputs and output card

### Phase 2 — Config and URL handling
- Add profile config
- Add LLM config
- Parse `profile` from URL
- Add fallback selector

### Phase 3 — Prompt generator
- Add deterministic `buildAlignedPrompt()` function
- Tune output format for 3–4 example cases

### Phase 4 — Finish polish
- Copy button
- Error handling
- Simple styling
- Embed sizing test

---

# UI Mockup

## Screen structure

```text
+-------------------------------------------------------------+
| AI Prompting Helper                                         |
| Turn your question into an AI-aligned prompt                |
+-------------------------------------------------------------+
| Your Profile: Challenger (8)                                |
| Target AI: ChatGPT                                          |
| AI Style: Balanced, instruction-following, adaptive         |
+-------------------------------------------------------------+
| Target AI                                                   |
| [ ChatGPT v ]                                               |
|                                                             |
| What do you want to ask?                                    |
| +---------------------------------------------------------+ |
| | e.g. Help me write a better outreach email for a CFO   | |
| |                                                         | |
| |                                                         | |
| +---------------------------------------------------------+ |
|                                                 [Generate]  |
+-------------------------------------------------------------+
| Your aligned prompt                                         |
| +---------------------------------------------------------+ |
| | Give me a direct, well-structured outreach email for   | |
| | a CFO. Keep the message concise, outcome-focused, and  | |
| | easy to scan. Include a strong subject line and a      | |
| | practical call to action...                            | |
| +---------------------------------------------------------+ |
|                                          [Copy Prompt]      |
+-------------------------------------------------------------+
```

---

## UI notes
- Keep width compact and centered
- Use cards with soft border and mild shadow
- Use a simple Herman-aligned brand color for buttons
- Make the status strip visually distinct but not large
- Output area should feel like the final answer card

---

## Minimal component layout

### Header
- Title
- One-line explanation

### Status strip
- User profile
- Selected LLM
- LLM style

### Input card
- LLM dropdown
- Question textarea
- Generate button

### Output card
- Generated aligned prompt
- Copy button

---

## Future-ready hooks
These should be easy to add later without redesign:
- Accept profile from Herman parent app instead of URL
- Add `name` or `profileLabel` query params
- Add model-specific prompt patterns
- Add `purpose` selector like write, analyze, brainstorm, summarize
- Add explanation drawer for why the prompt was shaped this way

---

## Recommendation
Build the UI first, then wire the config and prompt generator. That gets a working demo fastest.
