import { useEffect, useMemo, useState } from 'react';
import { PromptInput } from './components/PromptInput';
import { PromptOutput } from './components/PromptOutput';
import { StatusStrip } from './components/StatusStrip';
import { llmConfigs, orderedLlms, type LlmId } from './config/llms';
import { orderedProfiles, profileConfigs, type ProfileId } from './config/profiles';
import { buildAlignedPrompt } from './utils/buildAlignedPrompt';
import { getProfileFromUrl } from './utils/getProfileFromUrl';

function App() {
  const urlProfile = getProfileFromUrl();
  const [selectedProfile, setSelectedProfile] = useState<ProfileId>(urlProfile ?? '1');
  const [selectedLlm, setSelectedLlm] = useState<LlmId>('chatgpt');
  const [question, setQuestion] = useState('');
  const [output, setOutput] = useState('');
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const scale = params.get('scale');

    if (scale) {
      const numericScale = Number(scale);
      if (!Number.isNaN(numericScale) && numericScale >= 0.65 && numericScale <= 1.1) {
        document.documentElement.style.setProperty('--ui-scale', String(numericScale));
      }
    }
  }, []);

  const activeProfile = useMemo(() => profileConfigs[selectedProfile], [selectedProfile]);
  const activeLlm = useMemo(() => llmConfigs[selectedLlm], [selectedLlm]);

  const handleGenerate = () => {
    setCopied(false);

    if (!question.trim()) {
      setError('Please enter a question or task first.');
      setOutput('');
      return;
    }

    setError('');
    setOutput(buildAlignedPrompt(question, activeProfile, activeLlm));
  };

  const handleCopy = async () => {
    if (!output) return;

    try {
      await navigator.clipboard.writeText(output);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1500);
    } catch {
      setCopied(false);
    }
  };

  return (
    <main className="app-shell">
      <section className="hero">
        <img
          src="/hermanscience-logo.png"
          alt="Herman Science"
          className="brand-logo"
        />
        <p className="subtitle">
          Turn your question into an AI-aligned prompt based on your profile and the target model.
        </p>
      </section>

      {!urlProfile && (
        <div className="card profile-selector-card">
          <div className="field-group">
            <label htmlFor="profileSelect">Select a profile</label>
            <select
              id="profileSelect"
              value={selectedProfile}
              onChange={(e) => setSelectedProfile(e.target.value as ProfileId)}
            >
              {orderedProfiles.map((profile) => (
                <option key={profile.id} value={profile.id}>
                  {profile.label} ({profile.id})
                </option>
              ))}
            </select>
          </div>
        </div>
      )}

      <StatusStrip profile={activeProfile} llm={activeLlm} />

      <div className="grid-layout">
        <PromptInput
          profile={activeProfile}
          llms={orderedLlms}
          selectedLlmId={selectedLlm}
          question={question}
          error={error}
          onLlmChange={(value) => setSelectedLlm(value as LlmId)}
          onQuestionChange={setQuestion}
          onGenerate={handleGenerate}
        />
        <PromptOutput prompt={output} copied={copied} onCopy={handleCopy} />
      </div>
    </main>
  );
}

export default App;