import { universityLmsContract } from "../shared/lms-contract.js";

const requiredFields = universityLmsContract.xaiEvidenceContract.requiredFields;

export function AiContextPanel() {
  return (
    <aside className="app-aside" aria-label="AI context panel">
      <div className="aside-head">
        <div>
          <div className="aside-title">AI Context</div>
          <div className="aside-sub">Shared XAI contract</div>
        </div>
      </div>
      <div className="xai-panel">
        <div className="xai-panel-head">Required evidence fields</div>
        <ul className="field-list">
          {requiredFields.map((field) => (
            <li key={field}>{field}</li>
          ))}
        </ul>
      </div>
    </aside>
  );
}
