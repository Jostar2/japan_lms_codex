import { w7GiniEntropyIncident } from "../../shared/incidents/w7-gini-entropy.js";
import { evidenceSummary } from "../../shared/xai-evidence.js";

export type InstructorDashboardTargetId =
  | "decision-w7-cocreation"
  | "decision-grading-uncertain-8"
  | "decision-intervention-6"
  | "question-trend-gini"
  | "cohort-pattern-w7";

export interface InstructorSituationItem {
  tone: "risk" | "focus" | "ok";
  label: string;
  detail: string;
}

export interface InstructorDashboardStat {
  label: string;
  value: string;
  tone: "neutral" | "up" | "danger" | "warn";
  sub: string;
}

export interface InstructorDecisionCard {
  urgency: "high" | "mid" | "low";
  targetId: InstructorDashboardTargetId;
  badge: string;
  title: string;
  subtitle: string;
  meta: string;
  primaryAction: string;
  secondaryAction: string;
  destinationRoute: "instructor.cocreation" | "instructor.grading" | "instructor.intervention";
}

export interface InstructorQuestionTrend {
  targetId?: InstructorDashboardTargetId;
  label: string;
  count: number;
}

export interface InstructorScheduleItem {
  time: string;
  label: string;
  status: string;
}

export interface InstructorDashboardDecisionViewModel {
  routeKey: "instructor.dashboard";
  decisionId: "decision-w7-cocreation";
  title: string;
  sourceStudentRoute: "student.lecture";
  targetRoute: "instructor.cocreation";
  hero: {
    eyebrow: string;
    title: string;
    subtitle: string;
  };
  situation: {
    title: string;
    subtitle: string;
    items: InstructorSituationItem[];
  };
  stats: InstructorDashboardStat[];
  decisionQueue: InstructorDecisionCard[];
  aside: {
    title: string;
    subtitle: string;
    questionTrends: InstructorQuestionTrend[];
    sentiment: {
      title: string;
      body: string;
      confidencePercent: number;
      privacyCopy: string;
    };
    schedule: InstructorScheduleItem[];
  };
  evidenceSummary: string;
  uncertainty: string;
  recommendedAction: string;
  measurementPlan: string;
}

export function getInstructorDashboardDecisionViewModel(): InstructorDashboardDecisionViewModel {
  const explanation = w7GiniEntropyIncident.explanations.instructorDecision;

  return {
    routeKey: "instructor.dashboard",
    decisionId: "decision-w7-cocreation",
    title: "W7 자료 개선 결정",
    sourceStudentRoute: "student.lecture",
    targetRoute: "instructor.cocreation",
    hero: {
      eyebrow: "오늘의 결정 3건 · 2026 봄학기 · 8주차 수요일",
      title: "박교수님, 세 가지 결정이 기다리고 있어요.",
      subtitle: "모든 제안에는 근거 · 대안 · 무시하기 선택지가 있습니다.",
    },
    situation: {
      title: "오늘의 상황",
      subtitle: "최근 7일 운영 신호",
      items: [
        {
          tone: "risk",
          label: "이탈 위험",
          detail: "6명 · 접속/제출 신호 약화",
        },
        {
          tone: "focus",
          label: "채점 대기",
          detail: "24건 · 초안 평가 대기",
        },
        {
          tone: "ok",
          label: "루브릭 준비",
          detail: "다음 주 · 공개 전 검토 가능",
        },
      ],
    },
    stats: [
      {
        label: "운영 중 강의",
        value: "3",
        tone: "neutral",
        sub: "전체 수강 214명",
      },
      {
        label: "평균 진도율",
        value: "67%",
        tone: "up",
        sub: "4% vs 지난 학기",
      },
      {
        label: "미채점",
        value: "24",
        tone: "danger",
        sub: "마감 72h 내",
      },
      {
        label: "개입 필요",
        value: "6",
        tone: "warn",
        sub: "왜 이 추천?",
      },
    ],
    decisionQueue: [
      {
        urgency: "high",
        targetId: "decision-w7-cocreation",
        badge: "우선순위 #1",
        title: "W7/Lec2 자료 개선 — Co-Creation에서 보완할까요?",
        subtitle: "22% 구간에서 정지/반복 42%",
        meta: "예상 재시청률 -18~-26% · 신뢰도 0.78",
        primaryAction: "Co-Creation에서 보완",
        secondaryAction: "근거 보기",
        destinationRoute: "instructor.cocreation",
      },
      {
        urgency: "mid",
        targetId: "decision-grading-uncertain-8",
        badge: "우선순위 #2",
        title: "채점 불확실 8건 — 교수 검토 필수",
        subtitle: "52건 중 초안 완료 32건 · 확정 가능 24 + 검토 필수 8",
        meta: "루브릭 A/B 경계 답안",
        primaryAction: "8건 순서대로 검토",
        secondaryAction: "근거 보기",
        destinationRoute: "instructor.grading",
      },
      {
        urgency: "low",
        targetId: "decision-intervention-6",
        badge: "우선순위 #3",
        title: "학습 개입 메시지 6건 — 발송 전 검토",
        subtitle: "3주 미접속 + 과제 미제출 동시 발생군",
        meta: "오피스아워 / 보완자료 / 마감유예 비교 후 발송",
        primaryAction: "개입 비교",
        secondaryAction: "근거 보기",
        destinationRoute: "instructor.intervention",
      },
    ],
    aside: {
      title: "오늘의 요약",
      subtitle: "09:02 생성 · 최신 동기화 2분 전",
      questionTrends: [
        {
          targetId: "question-trend-gini",
          label: "지니 vs 엔트로피 실무 차이",
          count: 42,
        },
        {
          label: "과제 3 AI 사용 허용 범위",
          count: 28,
        },
        {
          label: "실험 설계 IRB 절차",
          count: 14,
        },
      ],
      sentiment: {
        title: "이번 주 학생 감정 온도",
        body: "과제 Q&A 톤 분석(익명): 혼란 상승, 좌절 유지, 호기심 하락. 지니/엔트로피 구간에서 왜와 모르겠다의 동시 출현이 증가했습니다.",
        confidencePercent: 76,
        privacyCopy: "분석은 개별 학생을 특정하지 않는 집계 수준에서만 진행됩니다.",
      },
      schedule: [
        {
          time: "10:00",
          label: "오피스아워",
          status: "3명 예약",
        },
        {
          time: "14:00",
          label: "데이터 마이닝 · 8주차",
          status: "준비 완료",
        },
      ],
    },
    evidenceSummary: evidenceSummary(explanation),
    uncertainty: explanation.confidenceOrUncertainty,
    recommendedAction: explanation.recommendedAction,
    measurementPlan: explanation.measurementPlan,
  };
}
