import {
  universityLmsContract,
  type ClosedLoopContract,
  type Surface,
  type SurfaceRoute,
} from "../shared/lms-contract.js";

const requiredFields = universityLmsContract.xaiEvidenceContract.requiredFields;

interface AiContextPanelProps {
  closedLoop?: ClosedLoopContract;
  route?: SurfaceRoute;
  surface?: Surface;
}

export function AiContextPanel({ closedLoop, route, surface }: AiContextPanelProps) {
  const privacyBoundary = surface ? localizedPrivacyBoundary[surface] : [];
  const loopStep = route && closedLoop ? closedLoop.steps.find((step) => step.route === route.key) : null;

  return (
    <aside className="app-aside" aria-label="AI context panel">
      <div className="aside-head">
        <div>
          <div className="aside-title">{route ? "근거와 데이터 경계" : "AI Context"}</div>
          <div className="aside-sub">{route ? `${route.label} · ${route.group}` : "Shared XAI contract"}</div>
        </div>
      </div>

      {route ? (
        <>
          <section className="xai-panel route-context-panel">
            <div className="xai-panel-head">AI 근거 원칙</div>
            <div className="xai-panel-body">
              AI 추천은 판단, 근거, 불확실성, 승인 상태, 효과 측정 계획을 함께 노출해야 합니다.
            </div>
            <div className="evidence-field-grid" aria-label="Required evidence fields">
              {requiredFields.slice(0, 6).map((field) => (
                <span key={field}>{evidenceFieldLabels[field] ?? field}</span>
              ))}
            </div>
          </section>

          <section className="aside-mini-card route-privacy-card" aria-label="Surface privacy boundary">
            <div className="aside-mini-card-head">데이터 사용 경계</div>
            <ul className="compact-list">
              {privacyBoundary.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </section>

          <section className="aside-mini-card route-loop-card" aria-label="Closed loop stage">
            <div className="aside-mini-card-head">연결된 학습 패턴</div>
            <div>W7/Lec2 지니·엔트로피 막힘</div>
            <div className="muted">
              {loopStep ? `${phaseLabel[loopStep.phase]} · ${entityLabels[loopStep.entity]}` : "정규 운영 화면"}
            </div>
          </section>
        </>
      ) : (
        <div className="xai-panel">
          <div className="xai-panel-head">Required evidence fields</div>
          <ul className="field-list">
            {requiredFields.map((field) => (
              <li key={field}>{field}</li>
            ))}
          </ul>
        </div>
      )}
    </aside>
  );
}

const evidenceFieldLabels: Record<string, string> = {
  intent: "의도",
  judgment: "AI 판단",
  evidence: "근거",
  modelVersion: "모델 버전",
  confidenceOrUncertainty: "불확실성",
  recommendedAction: "권장 행동",
  humanApprovalState: "승인 상태",
  measurementPlan: "효과 측정",
};

const localizedPrivacyBoundary: Record<Surface, string[]> = {
  student: [
    "개인 추천은 학습자 본인에게만 표시",
    "동료 신호는 익명 집계로만 표시",
    "다른 학생의 신원은 노출하지 않음",
    "교수자 채점 불확실성 큐는 표시하지 않음",
  ],
  instructor: [
    "반 단위 패턴과 승인 필요한 결정만 표시",
    "개인 개입과 자료 개선 신호를 분리",
    "채점 불확실성은 교수자 검토용으로만 사용",
    "AI 추천은 근거와 불확실성을 함께 노출",
  ],
};

const phaseLabel: Record<ClosedLoopContract["steps"][number]["phase"], string> = {
  detect: "학습자 감지",
  aggregate: "교수자 집계",
  intervene: "자료 개선",
  measure: "효과 측정",
};

const entityLabels: Record<string, string> = {
  course: "강의",
  lecture: "강의 영상",
  "lecture-segment": "강의 구간",
  "cohort-pattern": "반 단위 패턴",
  "measurement-result": "측정 결과",
  "xai-evidence-item": "AI 근거",
};
