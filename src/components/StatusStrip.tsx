import { LlmConfig } from '../config/llms';
import { ProfileConfig } from '../config/profiles';

type StatusStripProps = {
  profile: ProfileConfig;
  llm: LlmConfig;
};

export function StatusStrip({ profile, llm }: StatusStripProps) {
  return (
    <div className="card status-strip">
      <div>
        <span className="status-label">Your Profile</span>
        <strong>
          {profile.label} ({profile.id})
        </strong>
      </div>
      <div>
        <span className="status-label">Target AI</span>
        <strong>{llm.label}</strong>
      </div>
      <div>
        <span className="status-label">AI Style</span>
        <strong>{llm.style}</strong>
      </div>
    </div>
  );
}
