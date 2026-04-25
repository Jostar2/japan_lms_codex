import type { RouteKey } from "../../shared/lms-contract.js";
import type { InstructorDashboardDecisionViewModel, InstructorDecisionCard } from "./view-model.js";

interface InstructorDashboardRouteProps {
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
  viewModel: InstructorDashboardDecisionViewModel;
}

export function InstructorDashboardAside({ viewModel }: InstructorDashboardAsideProps) {
  return (
    <aside className="app-aside instructor-dashboard-aside" aria-label="Instructor dashboard AI panel">
      <div className="aside-head">
        <div>
          <div className="aside-title">{viewModel.aside.title}</div>
          <div className="aside-sub">{viewModel.aside.subtitle}</div>
        </div>
      </div>

      <section className="question-trends-card" aria-label="Question trends">
        <div className="card-head">
          <div className="card-title">질문 트렌드 · 수강생 214명</div>
          <span className="ai-badge">AI</span>
        </div>
        <div className="source-list">
          {viewModel.aside.questionTrends.map((trend) => (
            <div className="source-item" data-ai-target={trend.targetId} key={trend.label}>
              <span>"{trend.label}"</span>
              <span className="source-weight">{trend.count} 질문</span>
            </div>
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
