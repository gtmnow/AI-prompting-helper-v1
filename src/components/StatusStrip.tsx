import { LlmConfig } from '../config/llms';
import { ProfileConfig } from '../config/profiles';

type StatusStripProps = {
  profile: ProfileConfig;
  llm: LlmConfig;
  taskType?: string;
};

function formatTaskType(taskType?: string): string {
  if (!taskType) return 'Not detected yet';

  return taskType.charAt(0).toUpperCase() + taskType.slice(1);
}

export function StatusStrip({ profile, llm, taskType }: StatusStripProps) {
  return (
    <section className="status-strip">
      <div className="card status-item">
        <span className="status-label">Your Profile</span>
        <span className="status-value">
          {profile.label} ({profile.id})
        </span>
      </div>

      <div className="card status-item">
        <span className="status-label">Target AI</span>
        <span className="status-value">{llm.label}</span>
      </div>

      <div className="card status-item">
        <span className="status-label">AI Style</span>
        <span className="status-value">{llm.style}</span>
      </div>

      <div className="card status-item">
        <span className="status-label">Task Type</span>
        <span className="status-value">{formatTaskType(taskType)}</span>
      </div>
    </section>
  );
}