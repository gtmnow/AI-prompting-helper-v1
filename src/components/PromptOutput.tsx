type PromptOutputProps = {
  prompt: string;
  copied: boolean;
  onCopy: () => void;
};

export function PromptOutput({ prompt, copied, onCopy }: PromptOutputProps) {
  return (
    <div className="card">
      <div className="output-header">
        <h2>Your aligned prompt</h2>
        <button type="button" className="secondary-button" onClick={onCopy} disabled={!prompt}>
          {copied ? 'Copied' : 'Copy Prompt'}
        </button>
      </div>

      <textarea className="output-box" readOnly rows={14} value={prompt || 'Your generated prompt will appear here.'} />
    </div>
  );
}
