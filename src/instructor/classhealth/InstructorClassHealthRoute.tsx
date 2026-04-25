import { AiInteractionPanel, type AiInteractionContext } from "../../app/AiInteractionPanel.js";
import type { RouteKey } from "../../shared/lms-contract.js";
import type {
  ClassHealthLoopNode,
  ClassHealthMetric,
  ClassHealthOutcome,
  ClassHealthSupportAction,
  InstructorClassHealthTargetId,
  InstructorClassHealthViewModel,
} from "./view-model.js";

interface InstructorClassHealthRouteProps {
  viewModel: InstructorClassHealthViewModel;
  onRouteChange: (routeKey: RouteKey) => void;
}

interface InstructorClassHealthAsideProps {
  activeAiTarget?: string;
  viewModel: InstructorClassHealthViewModel;
}

export function InstructorClassHealthRoute({ viewModel, onRouteChange }: InstructorClassHealthRouteProps) {
  return (
    <div className="classhealth-page">
      <div className="page-head classhealth-page-head">
        <div>
          <div className="page-eyebrow">{viewModel.page.eyebrow}</div>
          <h1>{viewModel.page.title}</h1>
          <p>{viewModel.page.subtitle}</p>
        </div>
        <div className="classhealth-page-actions">
          <button className="btn btn-ghost" type="button" data-ai-target="model-risk-factors">
            모델 설명
          </button>
          <button
            className="btn btn-instructor"
            type="button"
            onClick={() => onRouteChange(viewModel.interventionRoute)}
          >
            개입 시작
          </button>
        </div>
      </div>

      <section className="classhealth-loop-section" aria-label={viewModel.closedLoop.title}>
        <div className="section-h classhealth-section-h">
          <h2>{viewModel.closedLoop.title}</h2>
          <div className="dash" />
          <button className="ai-badge" type="button" data-ai-target={viewModel.closedLoop.targetId}>
            {viewModel.closedLoop.badge}
          </button>
        </div>
        <LoopTrace nodes={viewModel.closedLoop.nodes} />
      </section>

      <section className="classhealth-metric-grid" aria-label="Class health metrics">
        {viewModel.metrics.map((metric) => (
          <MetricCard key={metric.label} metric={metric} />
        ))}
      </section>

      <div className="classhealth-evidence-grid">
        <MasteryTrendCard viewModel={viewModel} />
        <ImpactLedgerCard viewModel={viewModel} />
      </div>

      <section
        className="policy-memo-card"
        aria-label={viewModel.policyMemo.title}
        data-ai-target={viewModel.policyMemo.targetId}
      >
        <div>
          <span>정책 메모 초안</span>
          <h2>{viewModel.policyMemo.title}</h2>
          <p>{viewModel.policyMemo.body}</p>
          <small>{viewModel.policyMemo.trackingCopy}</small>
        </div>
        <button className="btn btn-instructor" type="button" data-ai-target={viewModel.policyMemo.nextActionTargetId}>
          {viewModel.policyMemo.nextAction}
        </button>
      </section>

      <section className="classhealth-outcomes" aria-label="Registered outcome results">
        {viewModel.outcomes.map((outcome) => (
          <OutcomeCard key={outcome.label} outcome={outcome} />
        ))}
      </section>

      <section className="support-action-panel" aria-label="Weekly cohort support actions">
        <div className="card-head">
          <div>
            <div className="card-title">이번 주 반 단위 지원</div>
            <div className="card-sub">개인명은 가린 상태입니다. 먼저 반 단위 효과가 큰 개입을 봅니다.</div>
          </div>
          <span className="tag tag-xai">AI Uplift v2.4</span>
        </div>
        <div className="support-action-list">
          {viewModel.supportActions.map((action) => (
            <SupportActionCard key={action.targetId} action={action} />
          ))}
        </div>
      </section>

      <EngagementChart viewModel={viewModel} />

      <section className="purpose-access-card" aria-label={viewModel.accessGate.title}>
        <div className="card-head">
          <div>
            <div className="card-title">{viewModel.accessGate.title}</div>
            <div className="card-sub">{viewModel.accessGate.subtitle}</div>
          </div>
          <span className="tag tag-xai">purpose token 필수</span>
        </div>
        <div className="purpose-access-box" data-ai-target={viewModel.accessGate.targetId}>
          <div>
            <div className="purpose-label">열람 목적 선택</div>
            <div className="purpose-chip-row">
              {viewModel.accessGate.purposeOptions.map((option, index) => (
                <button className={`purpose-chip ${index === 1 ? "active" : ""}`} key={option} type="button">
                  {option}
                </button>
              ))}
            </div>
          </div>
          <button className="btn btn-instructor btn-sm" type="button" data-ai-target={viewModel.accessGate.targetId}>
            목적 확인 후 열람
          </button>
        </div>
        <div className="access-guardrail-row">
          {viewModel.accessGate.guardrails.map((item) => (
            <span key={item}>{item}</span>
          ))}
        </div>
        <div className="muted">{viewModel.accessGate.retentionCopy}</div>
      </section>
    </div>
  );
}

export function InstructorClassHealthAside({
  activeAiTarget = "impact-ledger-entry",
  viewModel,
}: InstructorClassHealthAsideProps) {
  const aiContext = getClassHealthAiContext(viewModel, activeAiTarget);

  return (
    <aside className="app-aside classhealth-aside" aria-label="Class Health AI panel">
      <div className="aside-head">
        <div>
          <div className="aside-title">AI 효과 분석가</div>
          <div className="aside-sub">선택 맥락 · {aiContext.scope}</div>
        </div>
      </div>

      <AiInteractionPanel context={aiContext} key={activeAiTarget} tone="instructor" />

      <button className="risk-factor-card" type="button" data-ai-target={viewModel.aside.model.targetId}>
        <span>{viewModel.aside.model.title}</span>
        <strong>
          {viewModel.aside.model.version} · F1 {viewModel.aside.model.f1}
        </strong>
        <div className="risk-factor-list">
          {viewModel.aside.model.factors.map((factor) => (
            <div key={factor.label}>
              <span>{factor.label}</span>
              <strong>{factor.weight}</strong>
            </div>
          ))}
        </div>
        <small>{viewModel.aside.model.privacyCopy}</small>
      </button>

      <section className="playbook-card" aria-label="Support playbook">
        <div className="card-title">플레이북</div>
        <div className="playbook-list">
          {viewModel.aside.playbook.map((item) => (
            <div key={item.label}>
              <span>{item.label}</span>
              <strong>{item.effect}</strong>
            </div>
          ))}
        </div>
      </section>

      <section className="classhealth-governance-card" aria-label={viewModel.aside.governance.title}>
        <div className="card-title">{viewModel.aside.governance.title}</div>
        <ul>
          {viewModel.aside.governance.items.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </section>
    </aside>
  );
}

function LoopTrace({ nodes }: { nodes: ClassHealthLoopNode[] }) {
  return (
    <div className="policy-trace-react">
      {nodes.map((node, index) => (
        <div className="policy-trace-segment" key={`${node.label}-${node.sub}`}>
          <button
            className={`policy-trace-node-react ${node.status}`}
            type="button"
            data-ai-target={index < 4 ? "impact-ledger-entry" : "next-semester-policy"}
          >
            <span>{node.status === "done" ? "✓" : index + 1}</span>
            <strong>{node.label}</strong>
            <small>{node.sub}</small>
          </button>
          {index < nodes.length - 1 ? <div className={`policy-trace-link-react ${nodes[index + 1]?.status}`} /> : null}
        </div>
      ))}
    </div>
  );
}

function MetricCard({ metric }: { metric: ClassHealthMetric }) {
  return (
    <div className={`classhealth-metric ${metric.tone}`}>
      <span>{metric.label}</span>
      <strong>{metric.value}</strong>
      <small>{metric.sub}</small>
    </div>
  );
}

function MasteryTrendCard({ viewModel }: { viewModel: InstructorClassHealthViewModel }) {
  const trend = viewModel.masteryTrend;
  const points = buildSparklinePoints(trend.series, 320, 72, 50, 75, 8);
  const dip = getSparklinePoint(trend.series, trend.dipIndex, 320, 72, 50, 75, 8);
  const recovery = getSparklinePoint(trend.series, trend.recoveryIndex, 320, 72, 50, 75, 8);

  return (
    <button className="clo-trend-card" type="button" data-ai-target={trend.targetId}>
      <div>
        <span>{trend.title}</span>
        <strong>{trend.value}</strong>
        <small>{trend.subtitle}</small>
      </div>
      <svg viewBox="0 0 320 72" aria-hidden="true">
        <line x1="8" x2="312" y1="44" y2="44" />
        <polyline points={points} />
        <circle className="dip" cx={dip.x} cy={dip.y} r="4" />
        <circle className="recovery" cx={recovery.x} cy={recovery.y} r="5" />
        <text x={dip.x - 18} y={dip.y + 17}>
          W7 dip
        </text>
        <text x={recovery.x - 42} y={recovery.y - 9}>
          W8 recovery
        </text>
      </svg>
      <div className="trend-week-row">
        {trend.weeks.map((week, index) => (
          <span className={index === trend.dipIndex || index === trend.recoveryIndex ? "marked" : ""} key={week}>
            {week}
          </span>
        ))}
      </div>
      <small>{trend.sample}</small>
    </button>
  );
}

function ImpactLedgerCard({ viewModel }: { viewModel: InstructorClassHealthViewModel }) {
  return (
    <button className="impact-ledger-card-react" type="button" data-ai-target={viewModel.impactLedger.targetId}>
      <span>{viewModel.impactLedger.title}</span>
      <div className="impact-ledger-row-list">
        {viewModel.impactLedger.rows.map((row) => (
          <div className={row.tone ?? ""} key={row.label}>
            <span>{row.label}</span>
            <strong>{row.value}</strong>
          </div>
        ))}
      </div>
      <small>{viewModel.impactLedger.summary}</small>
    </button>
  );
}

function OutcomeCard({ outcome }: { outcome: ClassHealthOutcome }) {
  return (
    <button
      className={`classhealth-outcome ${outcome.role}`}
      type="button"
      data-ai-target={outcome.targetId ?? "impact-ledger-entry"}
    >
      <span>{outcome.label}</span>
      <strong>{outcome.value}</strong>
      <small>{outcome.detail}</small>
    </button>
  );
}

function SupportActionCard({ action }: { action: ClassHealthSupportAction }) {
  return (
    <button className={`support-action-card ${action.tone}`} type="button" data-ai-target={action.targetId}>
      <span className="support-num">{action.number}</span>
      <span className="support-content">
        <strong>{action.pattern}</strong>
        <small>
          {action.count} · {action.action}
        </small>
        <em>{action.actionJa}</em>
      </span>
      <span className="support-result">
        <strong>{action.effect}</strong>
        <small>regret {action.regret}</small>
      </span>
      <span className="support-primary">{action.primary}</span>
    </button>
  );
}

function EngagementChart({ viewModel }: { viewModel: InstructorClassHealthViewModel }) {
  const chart = viewModel.engagement;
  const points = buildSparklinePoints(chart.currentSeries, 640, 200, 25, 100, 40);
  const anomalyIndex = chart.currentSeries.indexOf(42);
  const anomalyPoint = getSparklinePoint(chart.currentSeries, anomalyIndex, 640, 200, 25, 100, 40);
  const targetY = valueToY(chart.targetPercent, 200, 25, 100, 40);

  return (
    <section className="engagement-chart-card" aria-label={chart.title}>
      <div className="card-head">
        <div>
          <div className="card-title">{chart.title}</div>
          <div className="card-sub">{chart.subtitle}</div>
        </div>
        <span className="chart-legend">목표 {chart.targetPercent}%</span>
      </div>
      <button className="engagement-chart-button" type="button" data-ai-target={chart.targetId}>
        <svg viewBox="0 0 640 200" aria-hidden="true">
          {[40, 80, 120, 160].map((y) => (
            <line className="grid-line" key={y} x1="40" x2="620" y1={y} y2={y} />
          ))}
          <line className="target-line" x1="40" x2="620" y1={targetY} y2={targetY} />
          <polyline className="engagement-line" points={points} />
          {chart.currentSeries.map((value, index) => {
            const point = getSparklinePoint(chart.currentSeries, index, 640, 200, 25, 100, 40);
            return (
              <circle
                className={index === anomalyIndex ? "anomaly" : ""}
                cx={point.x}
                cy={point.y}
                key={`${value}-${index}`}
                r={index === anomalyIndex ? 5 : 3.5}
              />
            );
          })}
          <line className="anomaly-guide" x1={anomalyPoint.x} x2={anomalyPoint.x} y1={anomalyPoint.y} y2="174" />
          <text className="anomaly-label" x={anomalyPoint.x + 10} y={anomalyPoint.y - 8}>
            {chart.anomalyWeek} · 42%
          </text>
        </svg>
        <div className="engagement-week-row">
          {chart.currentSeries.map((_, index) => (
            <span className={index === anomalyIndex ? "marked" : ""} key={index}>
              W{index + 1}
            </span>
          ))}
        </div>
        <div className="engagement-alert">{chart.anomalyCopy}</div>
      </button>
    </section>
  );
}

function getClassHealthAiContext(viewModel: InstructorClassHealthViewModel, targetId: string): AiInteractionContext {
  const contexts: Record<InstructorClassHealthTargetId, AiInteractionContext> = {
    "impact-ledger-entry": {
      actionLabel: "Ledger 검토 완료",
      body: "W7/Lec2 자료 개선은 감지, 결정, 배포, 측정까지 완료됐습니다. 이제 다음 학기 정책 반영 여부를 교수자가 결정합니다.",
      confidenceLabel: "완료",
      evidence: viewModel.impactLedger.rows.map((row) => `${row.label}: ${row.value}`),
      modeLabel: "효과 AI",
      prompts: ["폐루프 요약", "정책 반영해도 되나?", "학생에게 어떻게 설명?"],
      response:
        "이 장부는 추천이 실제 수업 개선으로 이어졌는지 기록합니다. 재시청률 감소, CLO-3 회복, 질문 중복률 감소가 같은 방향이라 다음 학기 기본 자료로 올릴 근거가 있습니다.",
      scope: "Impact Ledger",
      title: "폐루프 결과를 감사 가능하게 정리합니다",
    },
    "clo-3-mastery-trend": {
      actionLabel: "CLO 추이 저장",
      body: viewModel.masteryTrend.subtitle,
      confidenceLabel: viewModel.masteryTrend.value,
      evidence: ["W7 dip 58%", "W8 recovery 64%", viewModel.masteryTrend.sample],
      modeLabel: "CLO AI",
      prompts: ["+6%p 의미 설명", "다음 학기 비교 기준", "질문 중복률과 연결"],
      response:
        "CLO-3은 자료 배포 직후 회복했지만 단일 코호트 결과입니다. 다음 학기 같은 W7 시점에서 재발생률과 overlap을 같이 봐야 정책 일반화가 가능합니다.",
      scope: "CLO-3 마스터리",
      title: "학습성과 회복을 해석합니다",
    },
    "policy-memo-draft": {
      actionLabel: "메모 편집",
      body: viewModel.policyMemo.body,
      confidenceLabel: "draft",
      evidence: ["Variant B 효과 검증", "CLO-3 +6%p", "질문 중복률 -34%"],
      modeLabel: "정책 AI",
      prompts: ["메모를 더 보수적으로", "학과 회의용 요약", "학생 공지 문구"],
      response:
        "정책 메모는 '항상 효과 있다'가 아니라 '2026 봄학기 W7 incident에서 효과가 있었고 다음 학기 동일 CLO에서 재검증한다'로 써야 합니다.",
      scope: "정책 메모",
      title: "다음 학기 반영 문구를 만듭니다",
    },
    "next-semester-policy": {
      actionLabel: "Blueprint에 반영",
      body: viewModel.policyMemo.trackingCopy,
      confidenceLabel: "대기",
      evidence: ["감지→결정→배포→측정 완료", "정책 적용 전 재검토 필요", "guardrail 계속 추적"],
      modeLabel: "정책 AI",
      prompts: ["반영 체크리스트", "보류하면 무엇을 잃나?", "재검증 계획"],
      response:
        "반영 전에는 강의 목표, 과제 일정, 학생 공지, 측정 지표를 함께 확인해야 합니다. 반영 후에도 다음 학기 W7에서 동일 incident 재발생률을 추적하세요.",
      scope: "다음 학기 정책",
      title: "Course Blueprint 반영을 준비합니다",
    },
    "support-start-block": {
      actionLabel: "지원안 등록",
      body: "과제 초안을 시작하지 못한 학생군에 개인 낙인 없이 15분 시작 블록을 반 전체 옵션으로 제공합니다.",
      confidenceLabel: "28명",
      evidence: ["draft 0건", "개념 숙달 정체", "제출 지연 -9~-13%p 예상"],
      modeLabel: "지원 AI",
      prompts: ["문구 만들어줘", "Meiwaku 낮춰줘", "성과 지표"],
      response:
        "메시지는 '아직 시작하지 못한 학생'을 지칭하지 말고, 전체 공지로 15분 시작 블록을 제공하는 방식이 안전합니다. 지표는 초안 생성률과 제출 지연률입니다.",
      scope: "시작 장벽",
      title: "과제 시작 장벽을 낮춥니다",
    },
    "support-entropy-card": {
      actionLabel: "다음 수업에 추가",
      body: "엔트로피 정의 약화는 W7 Co-Creation 사건과 직접 연결됩니다. 1분 카드와 5분 복기를 수업 시작에 붙입니다.",
      confidenceLabel: "34명",
      evidence: ["선수 개념 약화", "재평가 정답률 +8~+14%p 예상", "질문 중복률 감소 기대"],
      modeLabel: "지원 AI",
      prompts: ["1분 카드 초안", "수업 도입 문구", "과제와 연결"],
      response:
        "수업 도입부에는 '지난 시간에 많이 헷갈린 부분' 대신 '다음 계산을 위해 1분만 기준을 맞춥니다'라고 말하는 편이 부담이 낮습니다.",
      scope: "엔트로피 카드",
      title: "선수 개념 보강을 수업에 넣습니다",
    },
    "support-pace-agent": {
      actionLabel: "제안 발송 검토",
      body: "로그인 하락과 과제 지연이 동시에 있는 군집입니다. 개인 사유는 추정하지 않고 Pace Agent 선택지를 제안합니다.",
      confidenceLabel: "12명",
      evidence: ["활성도 +14~+22% 예상", "regret 7%", "발송 전 교수자 승인"],
      modeLabel: "지원 AI",
      prompts: ["발송 문구", "부담 리스크", "개입 대신 관찰"],
      response:
        "Pace Agent 제안은 '필요하면 선택할 수 있는 도구'로 제시해야 합니다. 자동 등록이나 위험군 표현은 피하고, 학생이 거절할 수 있게 두세요.",
      scope: "Pace Agent",
      title: "학습 리듬 회복 제안을 검토합니다",
    },
    "engagement-drop-w6": {
      actionLabel: "재설계 제안 보기",
      body: viewModel.engagement.anomalyCopy,
      confidenceLabel: "W6",
      evidence: ["참여율 42%", "목표 대비 -33%p", "이전 학기 해석 과제 -11점"],
      modeLabel: "패턴 AI",
      prompts: ["왜 W6인가요?", "W7 사건과 다른가요?", "재설계 우선순위"],
      response:
        "W6는 별도 병목입니다. W7 자료 개선 효과와 섞지 말고, 교차검증 구간의 실습 설계를 따로 개선해야 다음 학기 전체 리듬이 안정됩니다.",
      scope: "주차별 참여",
      title: "참여율 급락 구간을 분리합니다",
    },
    "purpose-access-log": {
      actionLabel: "열람 목적 확인",
      body: `${viewModel.accessGate.subtitle} ${viewModel.accessGate.retentionCopy}`,
      confidenceLabel: "감사",
      evidence: viewModel.accessGate.guardrails,
      modeLabel: "거버넌스 AI",
      prompts: ["왜 목적이 필요한가요?", "학생에게 설명", "열람 없이 할 수 있는 일"],
      response:
        "Class Health의 기본값은 반 단위 지원입니다. 개별 열람은 학업 상담처럼 명확한 목적이 있을 때만 허용하고, 누가 왜 봤는지 5년 보존해야 합니다.",
      scope: "목적 기반 열람",
      title: "개별 식별 접근을 통제합니다",
    },
    "model-risk-factors": {
      actionLabel: "모델 카드 열기",
      body: viewModel.aside.model.privacyCopy,
      confidenceLabel: `F1 ${viewModel.aside.model.f1}`,
      evidence: viewModel.aside.model.factors.map((factor) => `${factor.label}: ${factor.weight}`),
      modeLabel: "모델 AI",
      prompts: ["민감 변수 쓰나요?", "편향 점검 방법", "설명 가능한가요?"],
      response:
        "모델은 최근 활동과 제출 패턴을 보지만 성별, 국적 같은 민감 변수는 쓰지 않습니다. 다만 결과 편향은 별도 모니터링으로 매 학기 검증해야 합니다.",
      scope: "모델 설명",
      title: "Class Health 모델 근거를 설명합니다",
    },
  };

  return (
    contexts[(targetId as InstructorClassHealthTargetId) || "impact-ledger-entry"] ?? contexts["impact-ledger-entry"]
  );
}

function buildSparklinePoints(
  series: number[],
  width: number,
  height: number,
  minValue: number,
  maxValue: number,
  padding: number,
) {
  return series
    .map((_, index) => {
      const point = getSparklinePoint(series, index, width, height, minValue, maxValue, padding);
      return `${point.x.toFixed(1)},${point.y.toFixed(1)}`;
    })
    .join(" ");
}

function getSparklinePoint(
  series: number[],
  index: number,
  width: number,
  height: number,
  minValue: number,
  maxValue: number,
  padding: number,
) {
  const safeIndex = Math.min(Math.max(index, 0), series.length - 1);
  const xStep = (width - padding * 2) / Math.max(series.length - 1, 1);
  return {
    x: padding + safeIndex * xStep,
    y: valueToY(series[safeIndex] ?? minValue, height, minValue, maxValue, padding),
  };
}

function valueToY(value: number, height: number, minValue: number, maxValue: number, padding: number) {
  const ratio = (value - minValue) / (maxValue - minValue);
  return height - padding - ratio * (height - padding * 2);
}
