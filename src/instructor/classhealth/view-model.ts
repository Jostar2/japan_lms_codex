import { w7GiniEntropyIncident } from "../../shared/incidents/w7-gini-entropy.js";
import { evidenceSummary } from "../../shared/xai-evidence.js";

export type InstructorClassHealthTargetId =
  | "impact-ledger-entry"
  | "clo-3-mastery-trend"
  | "policy-memo-draft"
  | "next-semester-policy"
  | "support-start-block"
  | "support-entropy-card"
  | "support-pace-agent"
  | "engagement-drop-w6"
  | "purpose-access-log"
  | "model-risk-factors";

export interface ClassHealthMetric {
  label: string;
  value: string;
  sub: string;
  tone: "neutral" | "good" | "warn" | "danger";
}

export interface ClassHealthLoopNode {
  label: string;
  sub: string;
  status: "done" | "active" | "idle";
}

export interface ClassHealthOutcome {
  targetId?: InstructorClassHealthTargetId;
  label: string;
  value: string;
  detail: string;
  role: "primary" | "secondary" | "guardrail";
}

export interface ClassHealthSupportAction {
  targetId: Extract<
    InstructorClassHealthTargetId,
    "support-start-block" | "support-entropy-card" | "support-pace-agent"
  >;
  number: string;
  pattern: string;
  count: string;
  action: string;
  actionJa: string;
  effect: string;
  regret: string;
  primary: string;
  tone: "claude" | "xai" | "instructor";
}

export interface ClassHealthRiskFactor {
  label: string;
  weight: string;
}

export interface InstructorClassHealthViewModel {
  routeKey: "instructor.classhealth";
  sourceCocreationRoute: "instructor.cocreation";
  interventionRoute: "instructor.intervention";
  page: {
    eyebrow: string;
    title: string;
    subtitle: string;
  };
  closedLoop: {
    targetId: "impact-ledger-entry";
    title: string;
    badge: string;
    nodes: ClassHealthLoopNode[];
  };
  metrics: ClassHealthMetric[];
  masteryTrend: {
    targetId: "clo-3-mastery-trend";
    title: string;
    value: string;
    subtitle: string;
    sample: string;
    series: number[];
    weeks: string[];
    dipIndex: number;
    recoveryIndex: number;
  };
  impactLedger: {
    targetId: "impact-ledger-entry";
    title: string;
    rows: Array<{ label: string; value: string; tone?: "ok" | "warn" }>;
    summary: string;
    evidenceSummary: string;
  };
  policyMemo: {
    targetId: "policy-memo-draft";
    nextActionTargetId: "next-semester-policy";
    title: string;
    body: string;
    nextAction: string;
    trackingCopy: string;
  };
  outcomes: ClassHealthOutcome[];
  supportActions: ClassHealthSupportAction[];
  engagement: {
    targetId: "engagement-drop-w6";
    title: string;
    subtitle: string;
    currentSeries: number[];
    targetPercent: number;
    anomalyWeek: string;
    anomalyCopy: string;
  };
  accessGate: {
    targetId: "purpose-access-log";
    title: string;
    subtitle: string;
    purposeOptions: string[];
    guardrails: string[];
    retentionCopy: string;
  };
  aside: {
    model: {
      targetId: "model-risk-factors";
      title: string;
      version: string;
      f1: string;
      factors: ClassHealthRiskFactor[];
      privacyCopy: string;
    };
    playbook: Array<{ label: string; effect: string }>;
    governance: {
      title: string;
      items: string[];
    };
  };
}

export function getInstructorClassHealthViewModel(): InstructorClassHealthViewModel {
  const incident = w7GiniEntropyIncident;
  const explanation = incident.explanations.impactMeasurement;

  return {
    routeKey: "instructor.classhealth",
    sourceCocreationRoute: "instructor.cocreation",
    interventionRoute: "instructor.intervention",
    page: {
      eyebrow: "클래스 건강도 · 데이터 마이닝",
      title: "개별 명단 대신, 반 전체에 효과 큰 개입부터 봅니다.",
      subtitle:
        "낙인 방지 정책에 따라 첫 화면은 항상 반 단위 지원 제안입니다. 개별 학생 열람은 목적 입력 후 감사 로그가 남습니다.",
    },
    closedLoop: {
      targetId: "impact-ledger-entry",
      title: "폐루프 결말 · W7/Lec2 incident",
      badge: "4단계 완료",
      nodes: [
        { label: "감지", sub: "student.lecture", status: "done" },
        { label: "결정", sub: "instructor.dashboard", status: "done" },
        { label: "배포", sub: "cocreation step4", status: "done" },
        { label: "측정", sub: "cocreation step5", status: "done" },
        { label: "정책 반영", sub: "다음 학기 Blueprint", status: "active" },
      ],
    },
    metrics: [
      { label: "평균 진도율", value: "67%", sub: "4% vs 지난 학기", tone: "good" },
      { label: "참여 밀도", value: "0.74", sub: "중간", tone: "neutral" },
      { label: "개념 이해 지수", value: "B+", sub: "1단계 하락 후 회복", tone: "warn" },
      { label: "지원 대상", value: "74명", sub: "3개 패턴 중복 포함", tone: "warn" },
    ],
    masteryTrend: {
      targetId: "clo-3-mastery-trend",
      title: "CLO-3 마스터리",
      value: "+6%p",
      subtitle: "Gini/Entropy 비교 CLO 정답률이 자료 배포 후 회복했습니다.",
      sample: `n=${incident.cohortPattern.sampleSize} · 2주 사전등록`,
      series: [62, 64, 65, 67, 66, 64, 58, 64],
      weeks: ["W1", "W2", "W3", "W4", "W5", "W6", "W7", "W8"],
      dipIndex: 6,
      recoveryIndex: 7,
    },
    impactLedger: {
      targetId: "impact-ledger-entry",
      title: "Impact Ledger",
      rows: [
        { label: "감지", value: "2026-W7 · student.lecture" },
        { label: "결정", value: "2026-W7 · instructor.dashboard" },
        { label: "배포", value: "2026-04-10 · Variant B" },
        { label: "측정", value: "2026-04-24 · -22% [CI -32, -12]", tone: "ok" },
        { label: "정책", value: "다음 학기 반영 대기", tone: "warn" },
      ],
      summary: "감지, 결정, 배포, 측정까지 완료되었습니다. 정책 반영만 남았습니다.",
      evidenceSummary: evidenceSummary(explanation),
    },
    policyMemo: {
      targetId: "policy-memo-draft",
      nextActionTargetId: "next-semester-policy",
      title: "다음 학기 정책 갱신",
      body: "2026 가을 Course Blueprint에 W7/Lec2 Variant B 보완자료를 기본 자료로 편입할 것을 권장합니다.",
      nextAction: "다음 학기 설계 메모로 보내기",
      trackingCopy: "반영 시 다음 학기 W7 시점 동일 incident 재발생률을 자동 추적합니다.",
    },
    outcomes: [
      {
        targetId: "impact-ledger-entry",
        label: "재시청률",
        value: "-22% [CI -32, -12]",
        detail: "primary outcome · regret 0건",
        role: "primary",
      },
      {
        targetId: "clo-3-mastery-trend",
        label: "CLO-3 정답률",
        value: "+6%p",
        detail: "2주 후 n=128",
        role: "secondary",
      },
      {
        label: "질문 중복률",
        value: "-34%",
        detail: "Gini vs Entropy 질문군",
        role: "secondary",
      },
      {
        label: "감시 인식",
        value: "+0.2",
        detail: "guardrail · 허용 범위",
        role: "guardrail",
      },
    ],
    supportActions: [
      {
        targetId: "support-start-block",
        number: "01",
        pattern: "draft 0건 + 개념 숙달 정체",
        count: "28명",
        action: "과제 시작 장벽 낮추기",
        actionJa: "開始ブロックを送る",
        effect: "제출 지연 -9 ~ -13%p",
        regret: "6%",
        primary: "15분 시작 블록 보내기",
        tone: "claude",
      },
      {
        targetId: "support-entropy-card",
        number: "02",
        pattern: "선수 개념 '엔트로피 정의' 약화",
        count: "34명",
        action: "엔트로피 1분 카드 + 5분 복기",
        actionJa: "次回授業に5分追加",
        effect: "재평가 정답률 +8 ~ +14%p",
        regret: "4%",
        primary: "다음 수업에 추가",
        tone: "xai",
      },
      {
        targetId: "support-pace-agent",
        number: "03",
        pattern: "로그인 하락 + 과제 지연",
        count: "12명",
        action: "Pace Agent 자동 권유",
        actionJa: "Pace Agent 提案",
        effect: "활성도 +14 ~ +22% (2주)",
        regret: "7%",
        primary: "학생에게 제안 발송",
        tone: "instructor",
      },
    ],
    engagement: {
      targetId: "engagement-drop-w6",
      title: "주차별 참여율 · 어디서 흔들렸나",
      subtitle: "클래스 평균 · 영상 시청·토론·제출 종합",
      currentSeries: [76, 80, 78, 76, 72, 42, 56, 68, 72, 70, 75, 76, 78, 79],
      targetPercent: 75,
      anomalyWeek: "W6",
      anomalyCopy:
        "6주차 교차검증 구간에서 참여율이 42%로 급락했습니다. 같은 패턴이 이전 학기에 해석 과제 평균 -11점으로 이어졌습니다.",
    },
    accessGate: {
      targetId: "purpose-access-log",
      title: "개별 학생 열람",
      subtitle: "개인 식별 데이터 열람은 목적 입력이 필요합니다.",
      purposeOptions: ["개별 학업 상담", "장학 심사 자료", "TA 배정 검토", "학적 변동 상담", "기타 사유 기입"],
      guardrails: ["민감 변수 제외", "k-anonymity >= 5", "'위험' 단어 사용 안 함", "Mei-waku Care 상시 열림"],
      retentionCopy: "열람 기록은 instructor.data_access에 5년 보존됩니다.",
    },
    aside: {
      model: {
        targetId: "model-risk-factors",
        title: "위험 예측 모델 설명",
        version: "class_risk_model.v2.4.0",
        f1: "0.82",
        factors: [
          { label: "최근 2주 접속 패턴", weight: "+31" },
          { label: "과제 제출 지연·결손", weight: "+27" },
          { label: "퀴즈 평균 추세", weight: "+18" },
          { label: "Q&A·튜터 활동", weight: "+14" },
          { label: "동료 학습 네트워크", weight: "+10" },
        ],
        privacyCopy: "민감 변수는 사용하지 않으며, 편향 모니터를 매 학기 검증합니다.",
      },
      playbook: [
        { label: "가벼운 알림", effect: "효과 28%" },
        { label: "맞춤 복습 링크", effect: "효과 44%" },
        { label: "1:1 오피스아워 제안", effect: "효과 71%" },
        { label: "동료 학습 매칭", effect: "효과 58%" },
      ],
      governance: {
        title: "Class Health 운영 원칙",
        items: ["개별 명단보다 반 단위 제안 우선", "목적 없는 식별 열람 차단", "효과 지표와 guardrail 동시 기록"],
      },
    },
  };
}
