import type { XaiExplanation } from "../xai-evidence.js";

export interface W7GiniEntropyIncident {
  id: "w7-gini-entropy-incident";
  course: {
    id: "course-data-mining-2026-spring";
    title: "데이터 마이닝";
    term: "2026-spring";
  };
  lecture: {
    id: "lecture-w7-lec2";
    title: "의사결정 트리: 지니 불순도와 엔트로피";
    instructor: "이숙현 교수";
    durationMinutes: 52;
  };
  segment: {
    id: "seg-22pct";
    timestamp: "18:12";
    progressPercent: 22;
    concept: "Gini vs Entropy";
  };
  cohortPattern: {
    sampleSize: 128;
    pauseReplayRate: 0.42;
    confidence: 0.82;
    topQuestionCluster: "Gini vs Entropy 차이";
  };
  expectedOutcomeMetrics: string[];
  explanations: {
    studentSegment: XaiExplanation;
    instructorDecision: XaiExplanation;
    cocreationInput: XaiExplanation;
    impactMeasurement: XaiExplanation;
  };
}

export const w7GiniEntropyIncident: W7GiniEntropyIncident = {
  id: "w7-gini-entropy-incident",
  course: {
    id: "course-data-mining-2026-spring",
    title: "데이터 마이닝",
    term: "2026-spring",
  },
  lecture: {
    id: "lecture-w7-lec2",
    title: "의사결정 트리: 지니 불순도와 엔트로피",
    instructor: "이숙현 교수",
    durationMinutes: 52,
  },
  segment: {
    id: "seg-22pct",
    timestamp: "18:12",
    progressPercent: 22,
    concept: "Gini vs Entropy",
  },
  cohortPattern: {
    sampleSize: 128,
    pauseReplayRate: 0.42,
    confidence: 0.82,
    topQuestionCluster: "Gini vs Entropy 차이",
  },
  expectedOutcomeMetrics: [
    "pauseReplayRate",
    "confirmationQuestionAccuracy",
    "duplicateQuestionRate",
    "studentPerceivedSurveillance",
  ],
  explanations: {
    studentSegment: {
      intent: "VIEW",
      route: "student.lecture",
      surface: "student",
      targetId: "seg-22pct",
      entity: "lecture-segment",
      judgment: "영상 22% 구간은 지니 불순도와 엔트로피 해석 혼동 구간으로 판단됩니다.",
      evidence: [
        {
          id: "pause-replay-rate",
          label: "동료 정지/반복",
          value: "42% (n=128, confidence 0.82)",
          source: "cohort-aggregate",
        },
        {
          id: "question-cluster",
          label: "질문 클러스터",
          value: "Gini vs Entropy 차이",
          source: "cohort-aggregate",
        },
        {
          id: "prereq-entropy",
          label: "선수 개념",
          value: "엔트로피 정의 약함",
          source: "student-activity",
        },
      ],
      modelVersion: "segment_struggle_detector.v2.1",
      confidenceOrUncertainty: "행동 기반 추정입니다. 확인 문제 결과로 사후 갱신됩니다.",
      recommendedAction: "5분 Quick Review와 확인 문제 2개로 원인을 갱신합니다.",
      humanApprovalState: "student-controlled",
      measurementPlan: "확인 문제 정답률, 되감기 감소, 다음 세그먼트 진입 속도를 반영합니다.",
    },
    instructorDecision: {
      intent: "DECIDE",
      route: "instructor.dashboard",
      surface: "instructor",
      targetId: "decision-w7-cocreation",
      entity: "cohort-pattern",
      judgment: "W7/Lec2 22% 구간이 반 단위로 막혀 있어 자료 개선이 가장 큰 효과를 기대할 수 있습니다.",
      evidence: [
        {
          id: "cohort-pause-replay",
          label: "정지/반복",
          value: "42% (집계, n=128)",
          source: "cohort-aggregate",
        },
        {
          id: "cluster-gini-entropy",
          label: "질문 클러스터",
          value: "Gini vs Entropy 차이",
          source: "cohort-aggregate",
        },
        {
          id: "expected-rewatch-reduction",
          label: "예상 재시청률 변화",
          value: "-18~-26%, confidence 0.78",
          source: "measurement",
        },
      ],
      modelVersion: "teaching_decision_ranker.v1.4",
      confidenceOrUncertainty: "예상 효과 추정 overlap 0.71. 2주 사전등록 outcome으로 검증합니다.",
      recommendedAction: "Co-Creation Studio에서 보완자료 3종을 비교하고 1개를 승인 배포합니다.",
      humanApprovalState: "instructor-review-required",
      measurementPlan: "배포 후 2주 재시청률, 확인문제 정답률, 질문 중복률을 비교합니다.",
    },
    cocreationInput: {
      intent: "DRAFT",
      route: "instructor.cocreation",
      surface: "instructor",
      targetId: "step1-input",
      entity: "lecture",
      judgment: "원인은 설명 길이가 아니라 지니/엔트로피 정의 연결 부족입니다.",
      evidence: [
        {
          id: "student-incident",
          label: "학생 신호",
          value: "student.lecture 22% incident와 동일",
          source: "cohort-aggregate",
        },
        {
          id: "ocr-gap",
          label: "슬라이드 분석",
          value: "비교 예시 부족",
          source: "content-analysis",
        },
      ],
      modelVersion: "course_cocreation_planner.v0.9",
      confidenceOrUncertainty: "원인 추정 posterior 0.76.",
      recommendedAction: "비유형, 예제형, 시각화형 보완자료를 생성합니다.",
      humanApprovalState: "instructor-review-required",
      measurementPlan: "승인 배포 후 W7/Lec2 outcome을 class health에서 추적합니다.",
    },
    impactMeasurement: {
      intent: "MEASURE",
      route: "instructor.classhealth",
      surface: "instructor",
      targetId: "impact-ledger-entry",
      entity: "measurement-result",
      judgment: "보완자료 배포 후 2주 outcome을 impact ledger에 기록해야 합니다.",
      evidence: [
        {
          id: "registered-outcome",
          label: "사전등록 outcome",
          value: "재시청률, 확인문제 정답률, 질문 중복률",
          source: "policy",
        },
      ],
      modelVersion: "impact_ledger.v1.0",
      confidenceOrUncertainty: "효과 측정은 cohort aggregate 기준이며 개인 식별을 노출하지 않습니다.",
      recommendedAction: "2주 후 측정값을 다음 학기 정책 제안에 반영합니다.",
      humanApprovalState: "measured",
      measurementPlan: "pauseReplayRate, confirmationQuestionAccuracy, duplicateQuestionRate를 추적합니다.",
    },
  },
};
