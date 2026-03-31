# AI Prompting Helper V1

A lightweight iframe-ready React app for Herman Science that helps a user rewrite a raw question into an AI-aligned prompt based on:
- the user's Herman personality type (1–9)
- the selected LLM's inferred interaction style

## Current V1 features
- Reads `profile` from the URL query string, for example `?profile=8`
- Supports profiles 1 through 9
- Lets the user select a target AI model
- Shows the user's profile and inferred AI style on screen
- Rewrites a raw question into an aligned prompt
- Provides one-click copy to clipboard
- Falls back to a profile selector if no URL profile is passed

## Quick start
```bash
npm install
npm run dev
```

Then open the local URL in your browser.

Example:
```text
http://localhost:5173/?profile=8
```

## Suggested repo structure
```text
src/
  components/
    PromptInput.tsx
    PromptOutput.tsx
    StatusStrip.tsx
  config/
    llms.ts
    profiles.ts
  utils/
    buildAlignedPrompt.ts
    getProfileFromUrl.ts
  App.tsx
  main.tsx
  styles.css
```

## Notes
- This is a fast V1 starter scaffold.
- Profile logic and LLM style mappings are intentionally hardcoded.
- The prompt builder is deterministic for now and can later be replaced or enhanced.
