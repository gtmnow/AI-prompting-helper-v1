import { useEffect, useMemo, useState } from 'react';
import { PromptInput } from './components/PromptInput';
import { PromptOutput } from './components/PromptOutput';
import { StatusStrip } from './components/StatusStrip';
import { llmConfigs, orderedLlms, type LlmId } from './config/llms';
import { orderedProfiles, profileConfigs, type ProfileId } from './config/profiles';
import { buildAlignedPrompt } from './utils/buildAlignedPrompt';
import { getProfileFromUrl } from './utils/getProfileFromUrl';
import { detectTaskType } from './utils/detectTaskType';
import logo from './assets/hermanscience-logo.png';

function App() {
  const urlProfile = getProfileFromUrl();
  const [selectedProfile, setSelectedProfile] = useState<ProfileId>(urlProfile ?? '1');
  const [selectedLlm, setSelectedLlm] = useState<LlmId>('chatgpt');
  const [question, setQuestion] = useState('');
  const [output, setOutput] = useState('');
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);
  const [taskType, setTaskType] = useState('');

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
      setTaskType('');
      return;
    }

    setError('');

    const detectedTaskType = detectTaskType(question);
    setTaskType(detectedTaskType);

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
          src={logo}
          alt="Herman Science"
          className="brand-logo"
        />
        <p className="subtitle">
          Turn your question into an AI-aligned prompt based on your profile and the target model.
        </p>
      </section>

      {!urlProfile && (
        <div className="card profile-cta-card">
          <p className="profile-cta-text">
            Don&apos;t know your profile?{' '}
            <a
              href="https://www.hermanscience.com/cqi"
              target="_blank"
              rel="noopener noreferrer"
            >
              Get your personal profile assessment →
            </a>
          </p>
        </div>
      )}

      <StatusStrip profile={activeProfile} llm={activeLlm} taskType={taskType} />

      <div className="grid-layout">
        <PromptInput
          profiles={orderedProfiles}
          selectedProfileId={selectedProfile}
          profile={activeProfile}
          llms={orderedLlms}
          selectedLlmId={selectedLlm}
          question={question}
          error={error}
          onProfileChange={(value) => setSelectedProfile(value as ProfileId)}
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