import { AiInteractionPanel, type AiInteractionContext } from "../../app/AiInteractionPanel.js";
import type { RouteKey } from "../../shared/lms-contract.js";
import type { CocreationOutcome, CocreationVariant, InstructorCocreationViewModel } from "./view-model.js";

interface InstructorCocreationRouteProps {
  viewModel: InstructorCocreationViewModel;
  onRouteChange: (routeKey: RouteKey) => void;
}

interface InstructorCocreationAsideProps {
  activeAiTarget?: string;
  viewModel: InstructorCocreationViewModel;
}

export function InstructorCocreationRoute({ viewModel, onRouteChange }: InstructorCocreationRouteProps) {
  const selectedVariant = viewModel.variants.find((variant) => variant.selected) ?? viewModel.variants[0];

  return (
    <div className="cocreation-page">
      <div className="page-head cocreation-page-head">
        <div>
          <div className="page-eyebrow">{viewModel.page.eyebrow}</div>
          <h1>Co-Creation Studio</h1>
          <p>
            {viewModel.page.title} {viewModel.page.subtitle}
          </p>
        </div>
        <div className="cocreation-page-actions">
          <button className="btn btn-ghost" type="button" data-ai-target={viewModel.measurementPlan.targetId}>
            측정 계획
          </button>
          <button className="btn btn-instructor" type="button" data-ai-target={viewModel.approval.targetId}>
            승인 검토
          </button>
        </div>
      </div>

      <section className="cocreation-flow-strip" aria-label="Student to instructor closed loop">
        <div>
          <span>학생 강의</span>
          <strong>22% 막힘</strong>
        </div>
        <div>
          <span>교수자 결정</span>
          <strong>W7 자료 개선</strong>
        </div>
        <div className="active">
          <span>Co-Creation</span>
          <strong>보완안 승인</strong>
        </div>
        <div>
          <span>Class Health</span>
          <strong>2주 후 효과</strong>
        </div>
      </section>

      <section className="cocreation-command-bar" aria-label="Co-Creation operating status">
        <div>
          <span>입력 신호</span>
          <strong>{viewModel.incidentInput.segmentMetric}</strong>
        </div>
        <div>
          <span>선택안</span>
          <strong>{selectedVariant.label}</strong>
        </div>
        <div>
          <span>배포 조건</span>
          <strong>
            {viewModel.approval.publishDate} · {viewModel.approval.abSplit}
          </strong>
        </div>
        <button className="btn btn-ghost" type="button" data-ai-target={viewModel.classHealthBridge.targetId}>
          효과 장부 연결
        </button>
      </section>

      <div className="cocreation-main-grid">
        <section className="cocreation-panel incident" aria-label="Incident input">
          <div className="card-head">
            <div>
              <div className="card-title">1 · 학생 막힘 입력</div>
              <div className="card-sub">{viewModel.incidentInput.courseLabel}</div>
            </div>
            <span className="tag tag-xai">익명 집계</span>
          </div>
          <button className="incident-input-button" type="button" data-ai-target={viewModel.incidentInput.targetId}>
            <span>{viewModel.incidentInput.segmentWindow}</span>
            <strong>{viewModel.incidentInput.rootCause}</strong>
            <small>{viewModel.incidentInput.evidenceSummary}</small>
          </button>
          <div className="incident-proof-grid">
            <div>
              <span>구간</span>
              <strong>{viewModel.incidentInput.segmentMetric}</strong>
            </div>
            <div>
              <span>원인 추정</span>
              <strong>{viewModel.incidentInput.rootCauseMetric}</strong>
            </div>
            <div>
              <span>증거</span>
              <strong>{viewModel.incidentInput.evidenceMetric}</strong>
            </div>
          </div>
          <div className="generation-constraint-row" aria-label="Generation constraints">
            {viewModel.generationConstraints.map((metric) => (
              <div key={metric.label}>
                <span>{metric.label}</span>
                <strong>{metric.value}</strong>
              </div>
            ))}
          </div>
        </section>

        <section className="cocreation-panel variants" aria-label="AI-generated variants">
          <div className="card-head">
            <div>
              <div className="card-title">2 · AI 보완안 비교</div>
              <div className="card-sub">효과 추정, 부담, 교수법 프로필을 함께 봅니다.</div>
            </div>
            <span className="tag">3안</span>
          </div>
          <div className="variant-card-list">
            {viewModel.variants.map((variant) => (
              <VariantCard key={variant.targetId} variant={variant} />
            ))}
          </div>
        </section>
      </div>

      <button
        className="cocreation-rationale-band"
        type="button"
        data-ai-target={viewModel.selectionRationale.targetId}
      >
        <span>선택 근거</span>
        <strong>{viewModel.selectionRationale.judgment}</strong>
        <small>{viewModel.selectionRationale.evidenceSummary}</small>
      </button>

      <div className="cocreation-editor-grid">
        <section className="cocreation-panel draft" aria-label="Selected material draft">
          <div className="card-head">
            <div>
              <div className="card-title">{viewModel.draft.title}</div>
              <div className="card-sub">
                {viewModel.draft.privacyState} · {viewModel.draft.teachingProfileCopy}
              </div>
            </div>
            <span className="tag tag-xai">human approval</span>
          </div>
          <div className="draft-tabs" role="group" aria-label="Draft tabs">
            {viewModel.draft.tabs.map((tab, index) => (
              <button className={index === 0 ? "active" : ""} key={tab} type="button">
                {tab}
              </button>
            ))}
          </div>
          <button className="draft-body" type="button" data-ai-target={viewModel.draft.targetId}>
            {viewModel.draft.body}
          </button>
          <div className="governance-gate-list" aria-label="Governance gates">
            {viewModel.draft.gates.map((gate) => (
              <button
                className={`governance-gate ${gate.status}`}
                key={gate.label}
                type="button"
                data-ai-target={viewModel.draft.targetId}
              >
                <span>{gate.label}</span>
                <strong>{gate.value}</strong>
              </button>
            ))}
          </div>
        </section>

        <section className="cocreation-panel approval" aria-label="Approval and AB settings">
          <div className="card-head">
            <div>
              <div className="card-title">4 · 승인과 실험 설정</div>
              <div className="card-sub">
                {viewModel.approval.publishDate} · {viewModel.approval.abSplit}
              </div>
            </div>
            <button className="btn btn-sm btn-instructor" type="button" data-ai-target={viewModel.approval.targetId}>
              승인
            </button>
          </div>
          <div className="approval-outcome-list">
            {viewModel.approval.registeredOutcomes.map((outcome) => (
              <OutcomePill key={outcome.label} outcome={outcome} />
            ))}
          </div>
          <button className="measurement-plan-card" type="button" data-ai-target={viewModel.measurementPlan.targetId}>
            <span>Measurement Protocol</span>
            <strong>{viewModel.measurementPlan.summary}</strong>
          </button>
        </section>
      </div>

      <section className="cocreation-effect-panel" aria-label="Measured effect">
        <div>
          <div className="card-title">5 · 효과 측정 결과</div>
          <p>{viewModel.effect.summary}</p>
          <div className="effect-outcome-grid">
            {viewModel.effect.outcomes.map((outcome) => (
              <OutcomePill key={outcome.label} outcome={outcome} />
            ))}
          </div>
        </div>
        <button
          className="btn btn-instructor"
          type="button"
          data-ai-target={viewModel.classHealthBridge.targetId}
          onClick={() => onRouteChange(viewModel.classHealthBridge.routeKey)}
        >
          {viewModel.classHealthBridge.label}
        </button>
      </section>
    </div>
  );
}

export function InstructorCocreationAside({
  activeAiTarget = "step1-input",
  viewModel,
}: InstructorCocreationAsideProps) {
  const aiContext = getCocreationAiContext(viewModel, activeAiTarget);

  return (
    <aside className="app-aside cocreation-aside" aria-label="Co-Creation AI panel">
      <div className="aside-head">
        <div>
          <div className="aside-title">AI 공동 설계자</div>
          <div className="aside-sub">선택 맥락 · {aiContext.scope}</div>
        </div>
      </div>

      <AiInteractionPanel context={aiContext} key={activeAiTarget} tone="instructor" />

      <section className="teaching-profile-card" aria-label={viewModel.aside.teachingProfile.title}>
        <div className="aside-mini-card-head">{viewModel.aside.teachingProfile.title}</div>
        <p>{viewModel.aside.teachingProfile.statement}</p>
        <div className="profile-tag-row">
          {viewModel.aside.teachingProfile.tags.map((tag) => (
            <span key={tag}>{tag}</span>
          ))}
        </div>
      </section>

      <button className="xai-plan-card" type="button" data-ai-target={viewModel.measurementPlan.targetId}>
        <span>{viewModel.aside.xaiPlan.title}</span>
        <strong>{viewModel.aside.xaiPlan.body}</strong>
        <small>
          {viewModel.aside.xaiPlan.modelVersion} · {viewModel.aside.xaiPlan.measurementDate}
        </small>
      </button>

      <section className="cocreation-loop-card" aria-label="Closed-loop continuity">
        <div className="card-title">동일 대학 LMS 연계</div>
        <div className="loop-mini-list">
          <div>
            <span>source</span>
            <strong>{viewModel.incidentInput.sourceCopy}</strong>
          </div>
          <div>
            <span>decision</span>
            <strong>instructor.dashboard → Co-Creation</strong>
          </div>
          <div>
            <span>measure</span>
            <strong>{viewModel.classHealthBridge.label}</strong>
          </div>
        </div>
      </section>
    </aside>
  );
}

function VariantCard({ variant }: { variant: CocreationVariant }) {
  return (
    <button
      className={`variant-card ${variant.selected ? "selected" : ""}`}
      type="button"
      data-ai-target={variant.targetId}
    >
      <span className="variant-label">{variant.label}</span>
      <span className="variant-ja">{variant.labelJa}</span>
      <span className="variant-summary">{variant.summary}</span>
      <span className="variant-metric-row">
        {variant.metrics.map((metric) => (
          <span key={metric.label}>
            <small>{metric.label}</small>
            <strong>{metric.value}</strong>
          </span>
        ))}
      </span>
    </button>
  );
}

function OutcomePill({ outcome }: { outcome: CocreationOutcome }) {
  return (
    <span className={`outcome-pill ${outcome.role}`}>
      <small>{outcome.label}</small>
      <strong>{outcome.value}</strong>
    </span>
  );
}

function getCocreationAiContext(viewModel: InstructorCocreationViewModel, targetId: string): AiInteractionContext {
  const selectedVariant = viewModel.variants.find((variant) => variant.selected) ?? viewModel.variants[0];
  const contexts: Record<string, AiInteractionContext> = {
    "step1-input": {
      actionLabel: "입력 근거 고정",
      body: "학생 화면의 22% 구간 막힘이 교수자 화면에서는 개인 식별 없이 반 단위 자료 개선 입력으로 바뀝니다.",
      confidenceLabel: "0.82",
      evidence: [
        viewModel.incidentInput.segmentMetric,
        viewModel.incidentInput.rootCauseMetric,
        viewModel.incidentInput.evidenceMetric,
      ],
      modeLabel: "입력 AI",
      prompts: ["학생에게 보인 정보와 비교", "개인정보 경계 설명", "개선 목표로 바꿔줘"],
      response:
        "이 입력은 특정 학생의 기록이 아니라 W7/Lec2 구간에 모인 익명 집계입니다. 개선 목표는 '지니와 엔트로피 정의를 계산 예시와 연결해 재시청률과 중복 질문을 낮춘다'로 고정하는 편이 안전합니다.",
      scope: "학생 막힘 집계",
      title: "입력 신호를 수업 개선 목표로 바꿉니다",
    },
    "step2-variant-a": {
      actionLabel: "A안 보관",
      body: "비유 중심 설명은 진입 장벽을 낮추지만 과제 3의 계산 요구와 직접 연결되는 힘은 약합니다.",
      confidenceLabel: "대안 A",
      evidence: ["IRT 난이도 0.42", "예상 재시청률 -16%", "유사 사례 n=28"],
      modeLabel: "대안 AI",
      prompts: ["A안 장단점", "B안과 비교", "학생 난이도 낮춰줘"],
      response:
        "A안은 첫 이해에는 좋지만 실험 설계 과제와 연결하려면 계산 예제가 뒤따라야 합니다. 도입부 보조 문장으로 남기고 주안은 B안에 두는 구성이 더 안정적입니다.",
      scope: "비유 중심 대안",
      title: "비유 중심 보완안을 평가합니다",
    },
    "step2-variant-b": {
      actionLabel: "선택안 편집",
      body: `${selectedVariant.label}은 계산 예제와 개념 비교를 동시에 다루며, 현재 집계 신호에서 가장 안정적인 효과 추정치를 보입니다.`,
      confidenceLabel: "선택",
      evidence: ["예상 재시청률 -22%", "overlap 0.71", "CI [-32, -12]"],
      modeLabel: "선택 AI",
      prompts: ["왜 B안인가요?", "더 짧게 편집", "확인 문제 붙여줘"],
      response:
        "B안은 학생이 막힌 지점과 과제 요구가 만나는 지점에 맞습니다. 공식만 늘어놓지 않고 같은 분할 예제로 두 값을 계산하면 오개념을 직접 줄일 수 있습니다.",
      scope: "예제 중심 선택안",
      title: "선택된 보완안을 다듬습니다",
    },
    "step2-variant-c": {
      actionLabel: "시각화 대안 저장",
      body: "시각화 중심 설명은 시선을 끌지만 현재 수업자료에 삽입하려면 제작 비용과 검증 부담이 큽니다.",
      confidenceLabel: "대안 C",
      evidence: ["IRT 난이도 0.32", "예상 재시청률 -14%", "유사 사례 n=24"],
      modeLabel: "대안 AI",
      prompts: ["시각화가 나쁜가요?", "B안에 시각 요소만 추가", "제작 부담 산정"],
      response:
        "C안은 장기적으로 좋은 보완 자료가 될 수 있지만 이번 파일럿에서는 작은 변경과 빠른 측정이 중요합니다. B안에 1개의 비교 표만 추가하는 절충이 좋습니다.",
      scope: "시각화 대안",
      title: "시각화 중심 보완안을 평가합니다",
    },
    "step2-selection-rationale": {
      actionLabel: "결정 메모 저장",
      body: viewModel.selectionRationale.judgment,
      confidenceLabel: "rationale",
      evidence: [viewModel.selectionRationale.evidenceSummary, "교수법 프로필 반영", "승인 전 공개 없음"],
      modeLabel: "결정 AI",
      prompts: ["결정 메모를 교수자 톤으로", "학생 부담 점검", "다른 안 반박 정리"],
      response:
        "결정 메모에는 '최대 효과'보다 '비교 가능성, 부담, 교수법 정렬'을 같이 적어야 합니다. 그래야 파일럿 후 결과가 나오지 않아도 왜 이 결정을 했는지 감사할 수 있습니다.",
      scope: "선택 근거",
      title: "대안 선택 이유를 감사 가능하게 만듭니다",
    },
    "step3-governance-gates": {
      actionLabel: "게이트 통과 기록",
      body: "초안은 공개 전 비공개 상태이며 hallucination, 용어 일관성, CASE 정렬을 통과해야 승인 큐로 이동합니다.",
      confidenceLabel: "pass",
      evidence: viewModel.draft.gates.map((gate) => `${gate.label}: ${gate.value}`),
      modeLabel: "거버넌스 AI",
      prompts: ["표현 위험 점검", "일본어 경어 톤", "확인문제 3개 검증"],
      response:
        "현재 초안은 핵심 개념을 과장하지 않고, 기존 강의를 대체하지 않는 보완 자료로 적합합니다. 공개 전에는 확인 문제 정답과 해설이 과제 직접 답안으로 흐르지 않는지 한 번 더 확인해야 합니다.",
      scope: "초안 품질 게이트",
      title: "공개 전 안전 게이트를 확인합니다",
    },
    "step4-ab-settings": {
      actionLabel: "승인 큐로 이동",
      body: "교수자가 승인해야 AB 설정이 활성화됩니다. 자동 배포하지 않고 효과 지표와 guardrail을 함께 등록합니다.",
      confidenceLabel: "AB 50:50",
      evidence: viewModel.approval.registeredOutcomes.map((outcome) => `${outcome.label}: ${outcome.value}`),
      modeLabel: "승인 AI",
      prompts: ["승인 전 체크리스트", "AB 비율 바꿔도 되나?", "guardrail 설명"],
      response:
        "승인 전 체크는 공개 날짜, 대상 분반, 기존 자료와의 충돌, 학생 공지 문구입니다. AB 50:50은 비교가 가장 단순하지만 수업 운영상 부담이 있으면 섹션 단위 배정을 먼저 고려하세요.",
      scope: "승인과 배포",
      title: "교수자 승인 뒤에만 실행합니다",
    },
    "step5-effect": {
      actionLabel: "효과 리포트 열기",
      body: viewModel.effect.summary,
      confidenceLabel: "2주 후",
      evidence: viewModel.effect.outcomes.map((outcome) => `${outcome.label}: ${outcome.value}`),
      modeLabel: "효과 AI",
      prompts: ["효과 해석", "다음 학기 반영", "부작용 확인"],
      response:
        "재시청률 감소와 정답률 상승이 함께 보이면 자료 개선 효과로 해석할 수 있습니다. 다만 감시 인식이나 질문 회피가 늘지 않았는지 guardrail을 같이 확인해야 합니다.",
      scope: "효과 측정",
      title: "배포 후 효과를 해석합니다",
    },
    "measurement-plan": {
      actionLabel: "측정 프로토콜 저장",
      body: viewModel.measurementPlan.summary,
      confidenceLabel: "protocol",
      evidence: ["primary: 재시청률", "secondary: 확인문제 정답률·중복 질문률", "guardrail: perceived surveillance"],
      modeLabel: "측정 AI",
      prompts: ["파일럿 지표 정리", "IRB/APPI 관점 점검", "대시보드 지표로 보내기"],
      response:
        "파일럿 문서에는 주지표, 보조지표, guardrail을 분리해 등록하세요. 일본 대학 맥락에서는 학생에게 집계 사용 목적과 개인 평가와의 분리를 명확히 알려야 합니다.",
      scope: "측정 계획",
      title: "효과와 윤리 지표를 같이 고정합니다",
    },
    "impact-ledger-entry": {
      actionLabel: "Class Health로 이동",
      body: "Co-Creation 결과는 Class Health의 영향 장부로 이동해 다음 학기 설계와 파일럿 리포트의 근거가 됩니다.",
      confidenceLabel: "ledger",
      evidence: ["route: instructor.classhealth", "target: impact-ledger-entry", "측정일 2026-05-08 예약"],
      modeLabel: "연계 AI",
      prompts: ["Class Health에는 뭐가 남나요?", "다음 학기 반영", "성과 카드 만들기"],
      response:
        "Class Health에는 어떤 자료를 왜 바꿨고, 어떤 지표가 어떻게 변했는지가 남습니다. 이 기록이 있어야 LMS가 단순 추천이 아니라 수업 개선 시스템으로 작동합니다.",
      scope: "Class Health 연계",
      title: "개선 결과를 장부로 연결합니다",
    },
  };

  return contexts[targetId] ?? contexts["step1-input"];
}
