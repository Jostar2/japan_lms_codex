import { useState } from "react";

export interface AiInteractionContext {
  actionLabel: string;
  body: string;
  confidenceLabel: string;
  evidence: string[];
  modeLabel: string;
  prompts: string[];
  response: string;
  scope: string;
  title: string;
}

interface AiInteractionPanelProps {
  context: AiInteractionContext;
  tone: "student" | "instructor";
}

export function AiInteractionPanel({ context, tone }: AiInteractionPanelProps) {
  const [draft, setDraft] = useState("");
  const [activePrompt, setActivePrompt] = useState(context.prompts[0] ?? "");

  function submitPrompt(prompt: string) {
    const trimmedPrompt = prompt.trim();
    if (!trimmedPrompt) return;

    setActivePrompt(trimmedPrompt);
    setDraft("");
  }

  return (
    <section className={`ai-interaction-panel ${tone}`} aria-label={`${context.modeLabel} interaction panel`}>
      <div className="ai-interaction-head">
        <div>
          <span>{context.modeLabel}</span>
          <h2>{context.title}</h2>
        </div>
        <strong>{context.confidenceLabel}</strong>
      </div>

      <div className="ai-context-summary">
        <span>{context.scope}</span>
        <p>{context.body}</p>
      </div>

      <div className="ai-evidence-stack" aria-label="AI evidence">
        {context.evidence.map((item) => (
          <div key={item}>{item}</div>
        ))}
      </div>

      <div className="ai-prompt-row" aria-label="Suggested AI prompts">
        {context.prompts.map((prompt) => (
          <button key={prompt} type="button" onClick={() => submitPrompt(prompt)}>
            {prompt}
          </button>
        ))}
      </div>

      <form
        className="ai-compose"
        aria-label="Ask Claritas AI"
        onSubmit={(event) => {
          event.preventDefault();
          submitPrompt(draft);
        }}
      >
        <input
          aria-label="AI에게 질문하기"
          placeholder="이 근거로 무엇을 할까요?"
          type="text"
          value={draft}
          onChange={(event) => setDraft(event.target.value)}
        />
        <button className={tone === "student" ? "btn btn-student" : "btn btn-instructor"} type="submit">
          묻기
        </button>
      </form>

      <div className="ai-response-card" aria-live="polite">
        <div className="ai-response-user">{activePrompt}</div>
        <div className="ai-response-body">{context.response}</div>
        <button className="btn btn-sm btn-ghost" type="button">
          {context.actionLabel}
        </button>
      </div>
    </section>
  );
}
