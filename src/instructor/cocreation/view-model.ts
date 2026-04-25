import { w7GiniEntropyIncident } from "../../shared/incidents/w7-gini-entropy.js";
import { evidenceSummary } from "../../shared/xai-evidence.js";

export type InstructorCocreationTargetId =
  | "step1-input"
  | "step2-variant-a"
  | "step2-variant-b"
  | "step2-variant-c"
  | "step2-selection-rationale"
  | "step3-governance-gates"
  | "step4-ab-settings"
  | "step5-effect"
  | "measurement-plan"
  | "impact-ledger-entry";

export interface CocreationMetric {
  label: string;
  value: string;
}

export interface CocreationVariant {
  targetId: Extract<InstructorCocreationTargetId, "step2-variant-a" | "step2-variant-b" | "step2-variant-c">;
  label: string;
  labelJa: string;
  summary: string;
  metrics: CocreationMetric[];
  selected: boolean;
}

export interface CocreationGovernanceGate {
  label: string;
  value: string;
  status: "pass" | "monitor";
}

export interface CocreationOutcome {
  label: string;
  value: string;
  role: "primary" | "secondary" | "guardrail";
}

export interface InstructorCocreationViewModel {
  routeKey: "instructor.cocreation";
  sourceRoute: "instructor.dashboard";
  classHealthRoute: "instructor.classhealth";
  page: {
    eyebrow: string;
    title: string;
    subtitle: string;
  };
  incidentInput: {
    targetId: "step1-input";
    courseLabel: string;
    sourceCopy: string;
    segmentWindow: string;
    segmentMetric: string;
    rootCause: string;
    rootCauseMetric: string;
    evidenceMetric: string;
    evidenceSummary: string;
  };
  generationConstraints: CocreationMetric[];
  variants: CocreationVariant[];
  selectionRationale: {
    targetId: "step2-selection-rationale";
    judgment: string;
    evidenceSummary: string;
  };
  draft: {
    targetId: "step3-governance-gates";
    title: string;
    privacyState: string;
    teachingProfileCopy: string;
    tabs: string[];
    body: string;
    gates: CocreationGovernanceGate[];
  };
  approval: {
    targetId: "step4-ab-settings";
    publishDate: string;
    abSplit: string;
    registeredOutcomes: CocreationOutcome[];
  };
  effect: {
    targetId: "step5-effect";
    measuredDate: string;
    summary: string;
    outcomes: CocreationOutcome[];
  };
  classHealthBridge: {
    routeKey: "instructor.classhealth";
    targetId: "impact-ledger-entry";
    label: string;
  };
  measurementPlan: {
    targetId: "measurement-plan";
    summary: string;
  };
  aside: {
    teachingProfile: {
      title: string;
      statement: string;
      tags: string[];
    };
    xaiPlan: {
      title: string;
      body: string;
      modelVersion: string;
      measurementDate: string;
    };
  };
}

export function getInstructorCocreationViewModel(): InstructorCocreationViewModel {
  const incident = w7GiniEntropyIncident;
  const inputExplanation = incident.explanations.cocreationInput;
  const impactExplanation = incident.explanations.impactMeasurement;

  return {
    routeKey: "instructor.cocreation",
    sourceRoute: "instructor.dashboard",
    classHealthRoute: "instructor.classhealth",
    page: {
      eyebrow: "Co-Creation Studio · 자료 공동 개선",
      title: "AI와 함께 강의자료를 개선하고, 2주 후 효과로 검증합니다.",
      subtitle:
        "학생 난관 구간, 오개념 클러스터, 실시간 흔들림을 입력으로 대체 설명 스크립트 · 확인 문제 · 슬라이드 · 용어집을 생성합니다.",
    },
    incidentInput: {
      targetId: "step1-input",
      courseLabel: `${incident.course.title} · W7 · Lec 2 · 의사결정 트리`,
      sourceCopy: "student.lecture 22% incident와 동일",
      segmentWindow: "18:00-18:24",
      segmentMetric: "영상 22% · P(struggle) 0.82 · CI 0.74~0.89",
      rootCause: "엔트로피 정의 선수 공백",
      rootCauseMetric: "P=0.71 · 오개념 Gini ↔ Entropy 해석 혼동 68%",
      evidenceMetric: "이벤트 4종 · 동료 정지/반복 42%",
      evidenceSummary: evidenceSummary(inputExplanation),
    },
    generationConstraints: [
      { label: "CASE", value: "0.89" },
      { label: "용어 일관성", value: "0.91" },
      { label: "출처", value: "0.82" },
    ],
    variants: [
      {
        targetId: "step2-variant-a",
        label: "A · 비유 중심",
        labelJa: "比喩中心",
        summary:
          "지니는 한 그룹 안에서 두 명을 무작위로 골랐을 때 다른 클래스일 확률, 엔트로피는 정보를 알기까지 필요한 평균 질문 수라는 비유로 직관을 먼저 잡습니다.",
        metrics: [
          { label: "IRT 난이도", value: "0.42" },
          { label: "예상 재시청률", value: "-16%" },
          { label: "overlap", value: "0.68" },
          { label: "유사 사례", value: "n=28" },
        ],
        selected: false,
      },
      {
        targetId: "step2-variant-b",
        label: "B · 예제 중심",
        labelJa: "数式·例題",
        summary:
          "분류 분할 예제로 Gini = 1 - Σp_i^2, Entropy = -Σp_i log2 p_i를 직접 계산하고 같은 결정에서 두 값이 어떻게 다른지 비교합니다.",
        metrics: [
          { label: "IRT 난이도", value: "0.55" },
          { label: "예상 재시청률", value: "-22%" },
          { label: "overlap", value: "0.71" },
          { label: "유사 사례", value: "n=19" },
        ],
        selected: true,
      },
      {
        targetId: "step2-variant-c",
        label: "C · 시각화 중심",
        labelJa: "視覚化中心",
        summary:
          "정보이득을 분류 결정마다 히트맵으로 보여주고, Gini/Entropy 두 기준이 같은 분할을 선택하는 경우와 다르게 선택하는 경우를 시각화합니다.",
        metrics: [
          { label: "IRT 난이도", value: "0.32" },
          { label: "예상 재시청률", value: "-14%" },
          { label: "overlap", value: "0.65" },
          { label: "유사 사례", value: "n=24" },
        ],
        selected: false,
      },
    ],
    selectionRationale: {
      targetId: "step2-selection-rationale",
      judgment: "최대 효과 추정만 보지 않고 overlap, 부담, 신뢰성을 결합해 Variant B 선택을 권장합니다.",
      evidenceSummary: "B의 CI [-32, -12]가 가장 안정적이고 overlap 0.71로 비교 가능성이 양호합니다.",
    },
    draft: {
      targetId: "step3-governance-gates",
      title: "3 · 선택 초안 편집 · 4 · 승인 후 배포",
      privacyState: "승인 전 비공개",
      teachingProfileCopy: '"공식 제시 전 반례 먼저"',
      tabs: ["スクリプト", "確認問題 3", "スライド 2", "用語集"],
      body: "분류 트리에서 어떻게 나눌지 정할 때 지니 불순도와 엔트로피를 자주 씁니다. 이름과 공식은 다르지만 핵심 의도는 같습니다. 한 그룹 안에 클래스가 얼마나 섞여 있는가를 잽니다.",
      gates: [
        { label: "hallucination check", value: "pass", status: "pass" },
        { label: "용어 일관성", value: "0.91", status: "pass" },
        { label: "CASE 정렬", value: "0.89", status: "pass" },
      ],
    },
    approval: {
      targetId: "step4-ab-settings",
      publishDate: "2026-04-10",
      abSplit: "AB 50:50",
      registeredOutcomes: [
        { label: "재시청률", value: "primary", role: "primary" },
        { label: "확인문제 정답률", value: "secondary", role: "secondary" },
        { label: "질문 중복률", value: "secondary", role: "secondary" },
        { label: "perceived surveillance", value: "guardrail", role: "guardrail" },
      ],
    },
    effect: {
      targetId: "step5-effect",
      measuredDate: "2026-04-24",
      summary: "Variant B 배포 결과 재시청률 -22% [CI -32, -12], regret 0건.",
      outcomes: [
        { label: "재시청률", value: "-22% [CI -32, -12]", role: "primary" },
        { label: "확인문제 정답률", value: "+8~+12%p", role: "secondary" },
        { label: "질문 중복률", value: "감소 추적", role: "secondary" },
      ],
    },
    classHealthBridge: {
      routeKey: "instructor.classhealth",
      targetId: "impact-ledger-entry",
      label: "클래스 영향 보기",
    },
    measurementPlan: {
      targetId: "measurement-plan",
      summary: impactExplanation.measurementPlan,
    },
    aside: {
      teachingProfile: {
        title: "Teaching Profile",
        statement: "공식 제시 전 반례 먼저. 어려운 개념일수록 역사적 맥락부터.",
        tags: ["です・ます 어조", "具体的には", "반례 먼저"],
      },
      xaiPlan: {
        title: "이 초안의 효과 측정 계획",
        body: "배포 직후 동일 구간 학생 2개 섹션에 cluster-randomized trial로 배정합니다. 2주 후 재시청률과 재평가 정답률 변화를 CI와 함께 산출합니다.",
        modelVersion: inputExplanation.modelVersion,
        measurementDate: "2026-05-08 예약",
      },
    },
  };
}
