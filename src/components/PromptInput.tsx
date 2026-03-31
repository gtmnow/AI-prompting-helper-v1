import { ChangeEvent } from 'react';
import { LlmConfig } from '../config/llms';
import { ProfileConfig } from '../config/profiles';

type PromptInputProps = {
  profile: ProfileConfig;
  llms: LlmConfig[];
  selectedLlmId: string;
  question: string;
  error: string;
  onLlmChange: (value: string) => void;
  onQuestionChange: (value: string) => void;
  onGenerate: () => void;
};

export function PromptInput({
  profile,
  llms,
  selectedLlmId,
  question,
  error,
  onLlmChange,
  onQuestionChange,
  onGenerate,
}: PromptInputProps) {
  return (
    <div className="card">
      <div className="field-group">
        <label htmlFor="profileSummary">Profile</label>
        <input
          id="profileSummary"
          type="text"
          value={`${profile.label} (${profile.id})`}
          readOnly
        />
      </div>

      <div className="field-group">
        <label htmlFor="llmSelect">Target AI</label>
        <select id="llmSelect" value={selectedLlmId} onChange={(e: ChangeEvent<HTMLSelectElement>) => onLlmChange(e.target.value)}>
          {llms.map((llm) => (
            <option key={llm.id} value={llm.id}>
              {llm.label}
            </option>
          ))}
        </select>
      </div>

      <div className="field-group">
        <label htmlFor="question">What do you want to ask?</label>
        <textarea
          id="question"
          rows={7}
          placeholder="Example: Help me write a better outreach email for a CFO."
          value={question}
          onChange={(e: ChangeEvent<HTMLTextAreaElement>) => onQuestionChange(e.target.value)}
        />
      </div>

      {error ? <p className="error-text">{error}</p> : null}

      <div className="actions">
        <button type="button" onClick={onGenerate}>
          Generate My Prompt
        </button>
      </div>
    </div>
  );
}
