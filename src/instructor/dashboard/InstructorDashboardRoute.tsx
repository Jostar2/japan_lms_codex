import { AiInteractionPanel, type AiInteractionContext } from "../../app/AiInteractionPanel.js";
import type { RouteKey } from "../../shared/lms-contract.js";
import type { InstructorDashboardDecisionViewModel, InstructorDecisionCard } from "./view-model.js";

interface InstructorDashboardRouteProps {
  activeAiTarget?: string;
  viewModel: InstructorDashboardDecisionViewModel;
  onRouteChange: (routeKey: RouteKey) => void;
}

export function InstructorDashboardRoute({ viewModel, onRouteChange }: InstructorDashboardRouteProps) {
  return (
    <div className="instructor-dashboard-page">
      <section className="dash-hero-react">
        <div className="page-eyebrow row">
          <span className="ai-badge">오늘의 결정 3건</span>
          <span>{viewModel.hero.eyebrow.replace("오늘의 결정 3건 · ", "")}</span>
        </div>
        <h1>{viewModel.hero.title}</h1>
        <p>{viewModel.hero.subtitle}</p>
      </section>

      <section className="dashboard-bridge-strip" aria-label="W7 closed loop bridge">
        <span>학습자 강의 막힘</span>
        <strong>W7 자료 개선 결정</strong>
        <span>Co-Creation Studio</span>
      </section>

      <section className="dashboard-command-bar" aria-label="Instructor operating controls">
        <div>
          <span>자동 실행</span>
          <strong>0건</strong>
        </div>
        <div>
          <span>승인 대기</span>
          <strong>3건</strong>
        </div>
        <div>
          <span>데이터 범위</span>
          <strong>익명 집계</strong>
        </div>
        <button className="btn btn-ghost" type="button">
          운영 로그
        </button>
      </section>

      <div className="dashboard-overview-grid">
        <section className="situation-layer-react" aria-label={viewModel.situation.title}>
          <div className="situation-head">
            <h2>{viewModel.situation.title}</h2>
            <span className="muted">{viewModel.situation.subtitle}</span>
          </div>
          <div className="situation-row-react">
            {viewModel.situation.items.map((item) => (
              <div className="situation-item-react" key={item.label}>
                <span className={`situation-dot ${item.tone}`} aria-hidden="true" />
                <div>
                  <div className="situation-label">{item.label}</div>
                  <div className="situation-detail">{item.detail}</div>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="dashboard-governance-panel" aria-label="AI governance status">
          <div className="card-title">AI 운영 원칙</div>
          <div className="governance-row">
            <span>권장</span>
            <strong>교수자 승인 전까지 보류</strong>
          </div>
          <div className="governance-row">
            <span>근거</span>
            <strong>집계 신호 · 루브릭 · 일정</strong>
          </div>
          <div className="governance-row">
            <span>측정</span>
            <strong>효과와 guardrail 동시 기록</strong>
          </div>
        </section>
      </div>

      <section className="stat-grid" aria-label="Instructor operating metrics">
        {viewModel.stats.map((stat) => (
          <div className={`stat-card ${stat.tone}`} key={stat.label}>
            <div className="stat-label">{stat.label}</div>
            <div className="stat-value">{stat.value}</div>
            <div className="stat-sub">{stat.sub}</div>
          </div>
        ))}
      </section>

      <div className="section-h">
        <h2>오늘의 결정</h2>
        <span className="decision-filter-chip">영향도순</span>
        <span className="decision-filter-chip">승인 필요</span>
        <div className="dash" />
      </div>

      <section className="decision-list" aria-label="Today decision queue">
        {viewModel.decisionQueue.map((decision) => (
          <DecisionQueueCard decision={decision} key={decision.targetId} onRouteChange={onRouteChange} />
        ))}
      </section>
    </div>
  );
}

interface DecisionQueueCardProps {
  decision: InstructorDecisionCard;
  onRouteChange: (routeKey: RouteKey) => void;
}

function DecisionQueueCard({ decision, onRouteChange }: DecisionQueueCardProps) {
  return (
    <article className={`decision-card-react ${decision.urgency}`} data-ai-target={decision.targetId}>
      <div className="decision-marker" aria-hidden="true" />
      <div className="decision-content">
        <div className="decision-topline">
          <span className="decision-badge">{decision.badge}</span>
          <span className="decision-meta">{decision.meta}</span>
        </div>
        <h3>{decision.title}</h3>
        <p>{decision.subtitle}</p>
        <div className="decision-route-line">
          <span>다음 작업</span>
          <strong>{destinationRouteLabels[decision.destinationRoute]}</strong>
        </div>
        <div className="decision-proof-grid" aria-label={`${decision.title} decision evidence`}>
          {decisionProofs[decision.targetId].map((proof) => (
            <div key={proof.label}>
              <span>{proof.label}</span>
              <strong>{proof.value}</strong>
            </div>
          ))}
        </div>
        <div className="decision-actions">
          <button className="btn btn-instructor" type="button" onClick={() => onRouteChange(decision.destinationRoute)}>
            {decision.primaryAction}
          </button>
          <button className="btn btn-ghost" type="button" data-ai-target={decision.targetId}>
            {decision.secondaryAction}
          </button>
        </div>
      </div>
    </article>
  );
}

const destinationRouteLabels: Record<InstructorDecisionCard["destinationRoute"], string> = {
  "instructor.cocreation": "Co-Creation Studio",
  "instructor.grading": "AI 평가 지원",
  "instructor.intervention": "학습 개입",
};

const decisionProofs: Record<InstructorDecisionCard["targetId"], Array<{ label: string; value: string }>> = {
  "decision-w7-cocreation": [
    { label: "근거", value: "정지/반복 42%" },
    { label: "불확실성", value: "신뢰도 0.78" },
    { label: "측정", value: "재시청률 · 정답률" },
  ],
  "decision-grading-uncertain-8": [
    { label: "근거", value: "루브릭 경계" },
    { label: "불확실성", value: "8건 보류" },
    { label: "측정", value: "재검토 일치율" },
  ],
  "decision-intervention-6": [
    { label: "근거", value: "3주 미접속" },
    { label: "불확실성", value: "사유 단정 없음" },
    { label: "측정", value: "7일 후 반응" },
  ],
  "question-trend-gini": [
    { label: "근거", value: "질문 42건" },
    { label: "불확실성", value: "표현 다양" },
    { label: "측정", value: "중복 질문률" },
  ],
  "cohort-pattern-w7": [
    { label: "근거", value: "수강생 128명" },
    { label: "불확실성", value: "익명 집계" },
    { label: "측정", value: "회복률" },
  ],
};

interface InstructorDashboardAsideProps {
  activeAiTarget?: string;
  viewModel: InstructorDashboardDecisionViewModel;
}

export function InstructorDashboardAside({
  activeAiTarget = "decision-w7-cocreation",
  viewModel,
}: InstructorDashboardAsideProps) {
  const aiContext = getInstructorAiContext(viewModel, activeAiTarget);

  return (
    <aside className="app-aside instructor-dashboard-aside" aria-label="Instructor dashboard AI panel">
      <div className="aside-head">
        <div>
          <div className="aside-title">AI 결정 보조</div>
          <div className="aside-sub">선택 맥락 · {aiContext.scope}</div>
        </div>
      </div>

      <AiInteractionPanel context={aiContext} key={activeAiTarget} tone="instructor" />

      <section className="question-trends-card" aria-label="Question trends">
        <div className="card-head">
          <div className="card-title">질문 트렌드 · 수강생 214명</div>
          <span className="ai-badge">AI</span>
        </div>
        <div className="source-list">
          {viewModel.aside.questionTrends.map((trend) => (
            <button
              className="source-item source-button"
              data-ai-target={trend.targetId}
              key={trend.label}
              type="button"
            >
              <span>"{trend.label}"</span>
              <span className="source-weight">{trend.count} 질문</span>
            </button>
          ))}
        </div>
        <button className="btn btn-sm question-action" type="button">
          공지로 한 번에 답하기
        </button>
      </section>

      <section className="xai-panel instructor-sentiment-panel">
        <div className="xai-panel-head">{viewModel.aside.sentiment.title}</div>
        <div className="xai-panel-body">{viewModel.aside.sentiment.body}</div>
        <div className="confidence">
          <span>신호 확실성</span>
          <div className="confidence-bar">
            <div className="confidence-bar-fill" style={{ width: `${viewModel.aside.sentiment.confidencePercent}%` }} />
          </div>
          <span className="confidence-value">{viewModel.aside.sentiment.confidencePercent}%</span>
        </div>
        <div className="muted">{viewModel.aside.sentiment.privacyCopy}</div>
      </section>

      <section className="schedule-card" aria-label="Today schedule">
        <div className="card-title">오늘 일정</div>
        <div className="schedule-list">
          {viewModel.aside.schedule.map((item) => (
            <div className="schedule-item" key={`${item.time}-${item.label}`}>
              <span>
                {item.time} · {item.label}
              </span>
              <span className="tag">{item.status}</span>
            </div>
          ))}
        </div>
      </section>
    </aside>
  );
}

function getInstructorAiContext(
  viewModel: InstructorDashboardDecisionViewModel,
  targetId: string,
): AiInteractionContext {
  const contexts: Record<string, AiInteractionContext> = {
    "decision-w7-cocreation": {
      actionLabel: "Co-Creation 열기",
      body: "W7/Lec2 22% 구간의 정지/반복과 질문 군집이 같은 개념에 모였습니다. AI는 자료 개선을 제안하지만 공개 전 교수자 승인이 필요합니다.",
      confidenceLabel: "0.78",
      evidence: ["정지/반복 42%", "관련 질문 42건", "예상 재시청률 -18~-26%"],
      modeLabel: "결정 AI",
      prompts: ["왜 우선순위 1인가요?", "대안 비교해줘", "측정 계획 만들어줘"],
      response:
        "가장 영향이 큰 이유는 같은 구간에서 시청 행동, 질문, 선수개념 신호가 동시에 모였기 때문입니다. 권장 조치는 기존 영상을 대체하지 않고 1분 비교 카드를 앞에 삽입한 뒤 재시청률과 확인 문제 정확도를 측정하는 것입니다.",
      scope: "W7 자료 개선",
      title: "자료 개선 결정을 설명합니다",
    },
    "decision-grading-uncertain-8": {
      actionLabel: "8건 검토 시작",
      body: "AI 초안 채점 중 루브릭 경계에 걸린 제출물만 교수자 검토 큐로 분리했습니다. 자동 확정은 하지 않습니다.",
      confidenceLabel: "8건",
      evidence: ["52건 중 초안 완료 32건", "확정 가능 24건", "경계 답안 8건 보류"],
      modeLabel: "채점 AI",
      prompts: ["왜 보류됐나요?", "검토 순서 정해줘", "피드백 톤 점검"],
      response:
        "보류된 답안은 실험 설계 근거는 있으나 재현성 설명이 짧은 유형입니다. 먼저 루브릭 A/B 경계 답안을 묶어 보고, 같은 기준으로 8건을 연속 검토하는 편이 일관성이 높습니다.",
      scope: "채점 불확실",
      title: "채점 보류 사유를 정리합니다",
    },
    "decision-intervention-6": {
      actionLabel: "개입안 비교",
      body: "3주 미접속과 과제 미제출이 동시에 나타난 학생군입니다. 사유를 단정하지 않고 지원 선택지를 비교합니다.",
      confidenceLabel: "6명",
      evidence: ["접속/제출 신호 약화", "개인 사유 단정 없음", "발송 전 교수자 승인 필요"],
      modeLabel: "개입 AI",
      prompts: ["메시지 초안 만들어줘", "오피스아워와 유예 비교", "민감도 점검"],
      response:
        "권장 초안은 '최근 학습 리듬이 끊긴 것 같아 선택 가능한 지원 경로를 안내합니다'처럼 판단보다 선택지를 앞세워야 합니다. 오피스아워, 보완자료, 마감유예를 비교한 뒤 교수자가 발송 여부를 승인합니다.",
      scope: "학습 개입",
      title: "지원 메시지를 안전하게 만듭니다",
    },
    "question-trend-gini": {
      actionLabel: "공지 초안 만들기",
      body: "지니와 엔트로피의 실무 차이에 대한 질문이 가장 많습니다. 공지는 답안 제공이 아니라 개념 경계 정리에 집중해야 합니다.",
      confidenceLabel: "42질문",
      evidence: ["질문 트렌드 1위", "W7/Lec2 구간과 연결", "중복 질문 감소 측정 가능"],
      modeLabel: "공지 AI",
      prompts: ["공지 초안 작성", "FAQ 3개로 압축", "학생용 예시 만들기"],
      response:
        "공지 초안은 '두 지표는 목적이 같고 계산 관점만 다릅니다'로 시작하고, 지니는 계산이 단순한 기준, 엔트로피는 정보량 관점의 기준으로 비교하면 됩니다. 마지막에는 과제 3에서 어떤 수준까지 요구하는지 명시하세요.",
      scope: "질문 트렌드",
      title: "반복 질문을 공지로 전환합니다",
    },
    "cohort-pattern-w7": {
      actionLabel: "효과 지표 등록",
      body: "반 단위 패턴은 개인 감시가 아니라 수업자료 개선을 위한 집계 신호입니다. 효과와 감시 인식 guardrail을 함께 봅니다.",
      confidenceLabel: "집계",
      evidence: ["수강생 128명 집계", "개인 식별 없음", "재시청률·정답률·감시 인식 측정"],
      modeLabel: "측정 AI",
      prompts: ["파일럿 지표 추천", "guardrail 설명", "Class Health로 보내기"],
      response:
        "효과 지표는 재시청률, 확인 문제 정확도, 중복 질문률입니다. guardrail은 '감시받는 느낌이 증가했는가'를 별도 문항으로 두어야 실제 파일럿에서 설득력이 생깁니다.",
      scope: "반 단위 패턴",
      title: "측정 가능한 개선으로 바꿉니다",
    },
  };

  return contexts[targetId] ?? contexts[viewModel.decisionId];
}
