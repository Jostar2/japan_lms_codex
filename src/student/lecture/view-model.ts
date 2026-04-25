import { w7GiniEntropyIncident } from "../../shared/incidents/w7-gini-entropy.js";
import { evidenceSummary } from "../../shared/xai-evidence.js";

export type StudentLectureTargetId =
  | "seg-intro"
  | "seg-22pct"
  | "transcript-18m12"
  | "quick-review-5min"
  | "peer-struggle-cluster"
  | "prereq-entropy"
  | "confirm-q-2"
  | "metacog-check-3";

export interface StudentLectureProgressCue {
  percent: number;
  label: string;
  targetId: StudentLectureTargetId;
  emphasis: "primary" | "secondary";
}

export interface StudentLectureTranscriptRow {
  timestamp: string;
  text: string;
  targetId?: StudentLectureTargetId;
  active: boolean;
}

export interface StudentLectureSummaryBullet {
  index: number;
  text: string;
  terms: string[];
}

export interface StudentLectureMetacognitionCheck {
  cadence: string;
  question: string;
  selectedValue: number;
  scale: string[];
  targetId: "metacog-check-3";
  privacyCopy: string;
}

export interface StudentLectureAsideCard {
  title: string;
  body: string;
  metric: string;
  targetId: StudentLectureTargetId;
}

export interface StudentLecturePeerHint {
  prompt: string;
  count: number;
}

export interface StudentLectureCompanionThread {
  title: string;
  subtitle: string;
  messages: Array<{
    who: "user" | "ai";
    body: string;
    citation?: string;
  }>;
  presets: string[];
}

export interface StudentLectureViewModel {
  routeKey: "student.lecture";
  courseTitle: string;
  lectureTitle: string;
  instructor: string;
  page: {
    eyebrow: string;
    title: string;
    subtitle: string;
  };
  player: {
    currentTime: string;
    duration: string;
    progressPercent: number;
    title: string;
    cues: StudentLectureProgressCue[];
  };
  segment: {
    id: string;
    timestamp: string;
    progressPercent: number;
    concept: string;
  };
  guidance: {
    judgment: string;
    recommendedAction: string;
    uncertainty: string;
    evidenceSummary: string;
  };
  callout: {
    targetId: "seg-22pct";
    label: string;
    badge: string;
  };
  summaryBullets: StudentLectureSummaryBullet[];
  transcript: {
    languageTabs: string[];
    rows: StudentLectureTranscriptRow[];
  };
  metacognition: StudentLectureMetacognitionCheck;
  aside: {
    title: string;
    subtitle: string;
    heatmap: StudentLectureProgressCue[];
    cards: StudentLectureAsideCard[];
    peerCluster: {
      targetId: "peer-struggle-cluster";
      body: string;
      hints: StudentLecturePeerHint[];
      confidencePercent: number;
    };
    companion: StudentLectureCompanionThread;
  };
  instructorBridge: {
    routeKey: "instructor.dashboard";
    targetId: "decision-w7-cocreation";
    label: string;
    body: string;
    privacyCopy: string;
  };
}

export function getStudentLectureViewModel(): StudentLectureViewModel {
  const explanation = w7GiniEntropyIncident.explanations.studentSegment;
  const cues: StudentLectureProgressCue[] = [
    { percent: 0, label: "시작", targetId: "seg-intro", emphasis: "secondary" },
    { percent: 22, label: "Gini/Entropy", targetId: "seg-22pct", emphasis: "primary" },
    { percent: 48, label: "정의 경계", targetId: "prereq-entropy", emphasis: "secondary" },
    { percent: 73, label: "응용", targetId: "quick-review-5min", emphasis: "secondary" },
    { percent: 100, label: "회복", targetId: "confirm-q-2", emphasis: "secondary" },
  ];

  return {
    routeKey: "student.lecture",
    courseTitle: w7GiniEntropyIncident.course.title,
    lectureTitle: w7GiniEntropyIncident.lecture.title,
    instructor: w7GiniEntropyIncident.lecture.instructor,
    page: {
      eyebrow: "데이터 마이닝 · 7주차 · Lec 2",
      title: "의사결정 트리: 지니 불순도와 엔트로피",
      subtitle: "52분 · 이숙현 교수 · AI 요약·번역·실시간 자막·메타인지 점검 지원",
    },
    player: {
      currentTime: w7GiniEntropyIncident.segment.timestamp,
      duration: "52:08",
      progressPercent: w7GiniEntropyIncident.segment.progressPercent,
      title: "Lec 2 — 분할 기준을 고르는 두 가지 방법",
      cues,
    },
    segment: w7GiniEntropyIncident.segment,
    guidance: {
      judgment: explanation.judgment,
      recommendedAction: explanation.recommendedAction,
      uncertainty: explanation.confidenceOrUncertainty,
      evidenceSummary: evidenceSummary(explanation),
    },
    callout: {
      targetId: "seg-22pct",
      label: "22% 구간 (≈18:12) · Gini/Entropy 정의 — 동료 정지/반복 42%",
      badge: "근거 보기",
    },
    summaryBullets: [
      {
        index: 1,
        text: "의사결정 트리는 데이터를 불순도가 낮아지는 방향으로 분할한다.",
        terms: ["불순도"],
      },
      {
        index: 2,
        text: "대표적인 지표 두 가지는 지니와 엔트로피다.",
        terms: ["지니", "엔트로피"],
      },
      {
        index: 3,
        text: "두 지표는 수치는 다르지만 분할 선택 결과는 대부분 동일하다.",
        terms: ["동일"],
      },
      {
        index: 4,
        text: "정보 이득은 부모 불순도에서 가중 자식 불순도를 뺀 값이다.",
        terms: ["Information Gain"],
      },
      {
        index: 5,
        text: "과적합을 막기 위해 가지치기가 필요하다.",
        terms: ["pruning"],
      },
    ],
    transcript: {
      languageTabs: ["한", "EN", "日", "中"],
      rows: [
        {
          timestamp: "17:55",
          text: "자, 여기서 가장 중요한 질문은 — 어떤 특성으로 먼저 나눌 것인가입니다.",
          active: false,
        },
        {
          timestamp: "18:12",
          text: "그 기준이 되는 게 바로 불순도입니다. 한 노드 안에 서로 다른 클래스가 얼마나 섞여 있는가를 수치화한 거죠.",
          targetId: "transcript-18m12",
          active: true,
        },
        {
          timestamp: "18:41",
          text: "지니 불순도는 계산이 빠르고, 엔트로피는 정보량 관점에서 해석이 깔끔합니다.",
          active: false,
        },
        {
          timestamp: "19:03",
          text: "실제로 두 방법으로 트리를 만들어 비교해보면 — 결과는 놀랄 만큼 비슷해요.",
          active: false,
        },
      ],
    },
    metacognition: {
      cadence: "매 15분",
      question: "지금까지 본 내용, 나는 친구에게 설명할 수 있나요?",
      selectedValue: 3,
      scale: ["1 · 모름", "2", "3 · 대체로", "4", "5 · 자신 있음"],
      targetId: "metacog-check-3",
      privacyCopy: "응답은 맞춤 점검 문제 생성에만 쓰이며 교수자에게 공유되지 않습니다.",
    },
    aside: {
      title: "지금 이 순간",
      subtitle: "18:12 / 52:08 — 지니 / 엔트로피 정의",
      heatmap: cues,
      cards: [
        {
          title: "선수 개념 — 엔트로피 정의",
          body: "22% 막힘의 근본 원인 후보. 정의 1분 카드로 회복 후 본 강의 복귀를 권장합니다.",
          metric: "P=0.71 · 진단 4문항 기반",
          targetId: "prereq-entropy",
        },
        {
          title: "확인 문제 2개 (post-segment)",
          body: "22% 구간 직후 2문항으로 막힘 원인을 갱신합니다 — 정답률·자신감을 함께 기록.",
          metric: "결과로 추천 경로 즉시 갱신",
          targetId: "confirm-q-2",
        },
      ],
      peerCluster: {
        targetId: "peer-struggle-cluster",
        body: "같은 22% 구간에서 수강생 128명 중 42%가 정지하거나 반복 재생했습니다.",
        hints: [
          { prompt: "Gini vs Entropy — 정의 차이는?", count: 38 },
          { prompt: "log2를 왜 쓰는지?", count: 27 },
          { prompt: "가중 평균이 왜 가중인가요?", count: 18 },
        ],
        confidencePercent: 82,
      },
      companion: {
        title: "이 구간에 대해 묻기",
        subtitle: "답변은 영상·교재·논문 인용과 함께 제공됩니다",
        messages: [
          {
            who: "user",
            body: "잠깐, 지니와 엔트로피는 왜 같은 결과를 내나요?",
          },
          {
            who: "ai",
            body: "둘 다 섞여 있을수록 값이 커진다는 볼록 함수 형태라, 최대값을 주는 분할 지점이 대부분 겹칩니다.",
            citation: "19:03 구간 + 교재 §4.2",
          },
        ],
        presets: ["그래프로 보여줘", "연습문제 1개", "지니 계산 예시"],
      },
    },
    instructorBridge: {
      routeKey: "instructor.dashboard",
      targetId: "decision-w7-cocreation",
      label: "반 단위 신호 · 같은 incident",
      body: "이 22% 막힘은 반 전체에서 일어났습니다. 교수자 화면에서 같은 incident를 집계로 보면 자료 개선 결정으로 연결됩니다.",
      privacyCopy: "집계 신호 · 개인 식별 없음",
    },
  };
}
