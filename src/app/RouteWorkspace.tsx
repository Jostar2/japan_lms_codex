import {
  getRouteContract,
  type ClosedLoopContract,
  type RouteKey,
  type Surface,
  type SurfaceRoute,
} from "../shared/lms-contract.js";

interface RouteWorkspaceProps {
  closedLoop: ClosedLoopContract;
  route: SurfaceRoute;
  routeKey: RouteKey;
  surface: Surface;
  onRouteChange: (routeKey: RouteKey) => void;
}

interface WorkspaceCopy {
  eyebrow: string;
  summary: string;
  metricA: WorkspaceMetric;
  metricB: WorkspaceMetric;
  metricC: WorkspaceMetric;
  workItems: WorkspaceWorkItem[];
  nextActions: string[];
  evidenceFocus: string;
}

interface WorkspaceMetric {
  label: string;
  value: string;
  sub: string;
  tone?: "neutral" | "good" | "warn" | "danger";
}

interface WorkspaceWorkItem {
  label: string;
  title: string;
  body: string;
  meta: string;
  tone: "student" | "instructor" | "xai" | "warn";
}

export function RouteWorkspace({ closedLoop, route, routeKey, surface, onRouteChange }: RouteWorkspaceProps) {
  const copy = workspaceCopy[routeKey];
  const activeLoopStep = closedLoop.steps.find((step) => step.route === routeKey);

  return (
    <div className="route-workspace">
      <div className="page-head workspace-page-head">
        <div>
          <div className="page-eyebrow">{copy.eyebrow}</div>
          <h1>{route.label}</h1>
          <p>{copy.summary}</p>
        </div>
        <div className="workspace-state-card" aria-label="Current route operating state">
          <span>{surface === "student" ? "학습자 화면" : "교수자 화면"}</span>
          <strong>{activeLoopStep ? phaseLabel[activeLoopStep.phase] : "정규 운영"}</strong>
        </div>
      </div>

      <section className="workspace-metrics" aria-label={`${route.label} metrics`}>
        {[copy.metricA, copy.metricB, copy.metricC].map((metric) => (
          <div className={`workspace-metric ${metric.tone ?? "neutral"}`} key={metric.label}>
            <span>{metric.label}</span>
            <strong>{metric.value}</strong>
            <small>{metric.sub}</small>
          </div>
        ))}
      </section>

      <div className="workspace-board">
        <section className="workspace-panel primary" aria-label={`${route.label} work queue`}>
          <div className="card-head">
            <div>
              <div className="card-title">운영 큐</div>
              <div className="card-sub">오늘 처리할 항목을 근거와 함께 정렬합니다.</div>
            </div>
            <span className="route-key">{route.group}</span>
          </div>
          <div className="workspace-work-list">
            {copy.workItems.map((item) => (
              <article className={`workspace-work-item ${item.tone}`} key={item.title}>
                <div>
                  <span>{item.label}</span>
                  <h2>{item.title}</h2>
                  <p>{item.body}</p>
                </div>
                <small>{item.meta}</small>
              </article>
            ))}
          </div>
        </section>

        <section className="workspace-panel secondary" aria-label="Route data boundary">
          <div className="card-title">데이터 경계</div>
          <p>{copy.evidenceFocus}</p>
          <div className="entity-chip-list" aria-label="Route entities">
            {route.entities.map((entity) => (
              <span className="entity-chip" key={entity}>
                {entityLabel[entity] ?? entity}
              </span>
            ))}
          </div>
          <div className="next-action-list">
            {copy.nextActions.map((action) => (
              <button className="btn btn-ghost" key={action} type="button">
                {action}
              </button>
            ))}
          </div>
        </section>
      </div>

      <section className="closed-loop-map" aria-label="Shared W7 closed loop">
        <div className="card-head">
          <div>
            <div className="card-title">학생-교수자 연결 흐름</div>
            <div className="card-sub">W7/Lec2 지니·엔트로피 막힘 패턴</div>
          </div>
          <span className="tag tag-xai">W7 집계 신호</span>
        </div>
        <div className="loop-node-list">
          {closedLoop.steps.map((step) => {
            const stepRoute = getRouteContract(step.route);

            return (
              <button
                className={`loop-node ${step.route === routeKey ? "active" : ""}`}
                key={`${step.phase}-${step.route}`}
                type="button"
                onClick={() => onRouteChange(step.route)}
              >
                <span>{phaseLabel[step.phase]}</span>
                <strong>{stepRoute.label}</strong>
                <small>{phaseDescription[step.phase]}</small>
              </button>
            );
          })}
        </div>
      </section>
    </div>
  );
}

const phaseLabel: Record<ClosedLoopContract["steps"][number]["phase"], string> = {
  detect: "감지",
  aggregate: "집계",
  intervene: "개입",
  measure: "측정",
};

const phaseDescription: Record<ClosedLoopContract["steps"][number]["phase"], string> = {
  detect: "학생에게는 개인 회복 경로만 표시",
  aggregate: "교수자에게는 익명 반 단위 패턴만 표시",
  intervene: "교수자가 자료 개선안을 검토하고 승인",
  measure: "효과와 윤리 지표를 함께 추적",
};

const entityLabel: Record<string, string> = {
  institution: "대학",
  term: "학기",
  course: "강의",
  section: "분반",
  user: "사용자",
  role: "역할",
  enrollment: "수강",
  lecture: "강의 영상",
  "lecture-segment": "강의 구간",
  assignment: "과제",
  submission: "제출물",
  rubric: "루브릭",
  "feedback-item": "피드백",
  intervention: "학습 지원",
  "cohort-pattern": "반 단위 패턴",
  "measurement-result": "측정 결과",
  "xai-evidence-item": "AI 근거",
};

const workspaceCopy: Record<RouteKey, WorkspaceCopy> = {
  "student.dashboard": {
    eyebrow: "데이터 마이닝 · 학습 홈",
    summary: "수강 중인 강의, 마감, AI 추천 복습을 한 화면에서 정리합니다.",
    metricA: { label: "오늘 학습", value: "2개", sub: "강의 1 · 과제 1", tone: "neutral" },
    metricB: { label: "위험 신호", value: "1건", sub: "W7 개념 회복 필요", tone: "warn" },
    metricC: { label: "학습 리듬", value: "82%", sub: "지난 14일 유지", tone: "good" },
    workItems: [
      {
        label: "지금 이어서",
        title: "W7/Lec2 18:12 구간 복습",
        body: "지니와 엔트로피 정의에서 반복 재생이 감지되어 5분 회복 경로를 제안합니다.",
        meta: "개인 학습 신호 · 교수자에게 비공개",
        tone: "student",
      },
      {
        label: "마감",
        title: "과제 3 초안 제출 전 체크",
        body: "AI 사용 허용 범위와 인용 규칙을 확인한 뒤 제출할 수 있습니다.",
        meta: "마감 36시간 전",
        tone: "warn",
      },
      {
        label: "피드백",
        title: "루브릭 기준별 보완점 2개",
        body: "지난 제출물에서 근거 연결과 실험 설명 항목이 약하게 평가되었습니다.",
        meta: "다음 제출에 반영 가능",
        tone: "xai",
      },
    ],
    nextActions: ["오늘 계획 조정", "5분 복습 시작", "마감만 보기"],
    evidenceFocus: "개인 추천은 본인에게만 표시하고, 반 전체 패턴은 익명 집계로만 노출합니다.",
  },
  "student.today": {
    eyebrow: "오늘 · 학습 실행",
    summary: "오늘 해야 할 강의, 과제, 확인 문제를 시간 순서로 정렬합니다.",
    metricA: { label: "예상 소요", value: "72분", sub: "강의 52 · 점검 20", tone: "neutral" },
    metricB: { label: "우선순위", value: "W7", sub: "개념 회복 먼저", tone: "warn" },
    metricC: { label: "완료율", value: "34%", sub: "오전 세션 기준", tone: "neutral" },
    workItems: [
      {
        label: "1순위",
        title: "Lec2 남은 34분 수강",
        body: "18:12 구간의 개념 카드를 확인한 뒤 본 강의로 돌아갑니다.",
        meta: "추천 경로 · confidence 0.82",
        tone: "student",
      },
      {
        label: "2순위",
        title: "확인 문제 2개",
        body: "정답률과 자신감 응답을 함께 기록해 다음 추천을 갱신합니다.",
        meta: "소요 4분",
        tone: "xai",
      },
      {
        label: "3순위",
        title: "과제 3 자료 읽기",
        body: "IRB 절차와 AI 사용 범위를 먼저 확인하면 제출 오류를 줄일 수 있습니다.",
        meta: "마감 36시간 전",
        tone: "warn",
      },
    ],
    nextActions: ["시간표에 넣기", "짧은 것부터", "마감순 정렬"],
    evidenceFocus: "오늘의 학습 순서는 개인 진도, 마감, 최근 막힘 신호를 조합해 계산합니다.",
  },
  "student.explore": {
    eyebrow: "강의 · 탐색",
    summary: "강의 단원, 개념, 추천 복습 경로를 한 곳에서 탐색합니다.",
    metricA: { label: "열린 단원", value: "7주차", sub: "의사결정 트리", tone: "neutral" },
    metricB: { label: "추천 개념", value: "3개", sub: "지니 · 엔트로피 · pruning", tone: "neutral" },
    metricC: { label: "검색 결과", value: "18건", sub: "강의·자막·노트", tone: "good" },
    workItems: [
      {
        label: "개념 지도",
        title: "지니/엔트로피 선후 관계",
        body: "정의, 계산 예시, 실제 트리 분할 결과를 연결해 볼 수 있습니다.",
        meta: "W7/Lec2와 연결",
        tone: "student",
      },
      {
        label: "추천",
        title: "과제 3에 필요한 선수 개념",
        body: "실험 설계와 루브릭 기준에 필요한 강의 구간을 먼저 제안합니다.",
        meta: "과제 제출 전 경로",
        tone: "xai",
      },
      {
        label: "복습",
        title: "동료 질문이 많은 구간",
        body: "같은 강의를 듣는 학생들이 자주 묻는 질문을 익명 패턴으로 보여줍니다.",
        meta: "개인 식별 없음",
        tone: "student",
      },
    ],
    nextActions: ["개념 지도 열기", "자막 검색", "복습 경로 저장"],
    evidenceFocus: "탐색 추천은 강의 자료와 본인의 학습 이력만 사용하며, 다른 학생의 개별 기록은 노출하지 않습니다.",
  },
  "student.lecture": {
    eyebrow: "데이터 마이닝 · 강의 수강",
    summary: "강의 영상, 자막, 개념 점검, AI 근거를 같은 맥락에서 제공합니다.",
    metricA: { label: "진행률", value: "22%", sub: "18:12 / 52:08", tone: "neutral" },
    metricB: { label: "막힘 신호", value: "42%", sub: "익명 집계", tone: "warn" },
    metricC: { label: "회복 경로", value: "5분", sub: "정의 카드 + 확인 문제", tone: "good" },
    workItems: [],
    nextActions: ["강의 계속", "근거 보기", "교수자 집계 확인"],
    evidenceFocus: "강의 중 AI는 개인에게는 회복 경로를, 교수자에게는 익명 집계 패턴만 전달합니다.",
  },
  "student.assignment": {
    eyebrow: "강의 · 과제와 토론",
    summary: "제출 상태, 루브릭 기준, 토론 참여를 한 흐름으로 관리합니다.",
    metricA: { label: "과제 상태", value: "초안", sub: "제출 전", tone: "neutral" },
    metricB: { label: "루브릭 경고", value: "2개", sub: "근거·인용 부족", tone: "warn" },
    metricC: { label: "토론 참여", value: "1/2", sub: "답글 1개 남음", tone: "neutral" },
    workItems: [
      {
        label: "제출 전",
        title: "AI 사용 범위 체크",
        body: "허용된 도구, 인용 방식, 본인 작성 범위를 제출 전에 확인합니다.",
        meta: "정책 위반 예방",
        tone: "warn",
      },
      {
        label: "루브릭",
        title: "실험 설계 설명 보완",
        body: "데이터 분할 기준과 평가지표 선택 이유가 짧게 작성되어 있습니다.",
        meta: "점수 영향 중간",
        tone: "xai",
      },
      {
        label: "토론",
        title: "동료 질문 1건에 답변",
        body: "엔트로피 계산 예시 질문에 본인의 풀이 과정을 공유할 수 있습니다.",
        meta: "참여 기준 충족",
        tone: "student",
      },
    ],
    nextActions: ["루브릭 보기", "제출 전 검사", "토론 열기"],
    evidenceFocus: "제출 조언은 루브릭과 공개 강의 자료 기준으로만 제공되며 자동 채점 확정으로 쓰이지 않습니다.",
  },
  "student.feedback": {
    eyebrow: "강의 · 피드백",
    summary: "채점 결과와 다음 제출에 반영할 개선 행동을 연결합니다.",
    metricA: { label: "최근 피드백", value: "B+", sub: "과제 2", tone: "neutral" },
    metricB: { label: "개선 항목", value: "3개", sub: "근거·표현·실험", tone: "warn" },
    metricC: { label: "다음 영향", value: "+8%", sub: "루브릭 회복 가능", tone: "good" },
    workItems: [
      {
        label: "핵심",
        title: "근거와 주장 연결 강화",
        body: "모델 선택 이유를 결과표와 직접 연결하면 루브릭 설명 점수를 회복할 수 있습니다.",
        meta: "채점자 코멘트 기반",
        tone: "xai",
      },
      {
        label: "실행",
        title: "다음 과제 체크리스트 생성",
        body: "이번 피드백을 과제 3 제출 전 확인 항목으로 전환합니다.",
        meta: "개인 학습용",
        tone: "student",
      },
      {
        label: "질문",
        title: "교수자에게 확인할 1문장",
        body: "루브릭 경계가 애매한 항목은 질문 초안을 만든 뒤 직접 보낼 수 있습니다.",
        meta: "자동 발송 없음",
        tone: "warn",
      },
    ],
    nextActions: ["개선 체크리스트", "교수자 질문 작성", "다음 과제에 반영"],
    evidenceFocus: "AI는 피드백을 설명하고 다음 행동을 제안하지만, 최종 평가는 교수자 기록을 기준으로 합니다.",
  },
  "student.companion": {
    eyebrow: "Claritas AI · 학습 동반자",
    summary: "강의, 교재, 과제 맥락을 인용하면서 질문에 답합니다.",
    metricA: { label: "대화 맥락", value: "W7", sub: "데이터 마이닝", tone: "neutral" },
    metricB: { label: "근거 출처", value: "4개", sub: "영상·교재·루브릭", tone: "good" },
    metricC: { label: "주의 필요", value: "1건", sub: "과제 직접 답안 방지", tone: "warn" },
    workItems: [
      {
        label: "질문",
        title: "지니와 엔트로피 차이 설명",
        body: "강의 18:12와 교재 4.2절을 근거로 짧은 설명을 제공합니다.",
        meta: "출처 포함",
        tone: "xai",
      },
      {
        label: "연습",
        title: "비슷한 계산 문제 생성",
        body: "과제 정답을 대신 쓰지 않고, 같은 개념의 연습 문제를 만듭니다.",
        meta: "학습 윤리 보호",
        tone: "student",
      },
      {
        label: "기록",
        title: "헷갈린 개념 저장",
        body: "다음 복습 세션에서 다시 확인할 개념으로 표시합니다.",
        meta: "개인 노트",
        tone: "student",
      },
    ],
    nextActions: ["질문하기", "연습문제 생성", "출처만 보기"],
    evidenceFocus: "답변은 강의·교재·루브릭 출처를 표시하고, 과제 직접 대필은 차단합니다.",
  },
  "student.insight-me": {
    eyebrow: "Claritas AI · 나의 인사이트",
    summary: "학습 습관, 회복 경로, 성과 변화를 본인에게만 보여줍니다.",
    metricA: { label: "회복 성공", value: "5/7", sub: "막힘 후 복귀", tone: "good" },
    metricB: { label: "반복 패턴", value: "화 22시", sub: "집중도 하락", tone: "warn" },
    metricC: { label: "성과 변화", value: "+11%", sub: "확인 문제 정확도", tone: "good" },
    workItems: [
      {
        label: "패턴",
        title: "늦은 밤 학습에서 재시청 증가",
        body: "집중도가 낮은 시간대에는 짧은 복습 카드부터 시작하는 편이 안정적입니다.",
        meta: "개인 신호만 사용",
        tone: "student",
      },
      {
        label: "성과",
        title: "정의 카드 후 정확도 상승",
        body: "지니/엔트로피 계열 문제에서 확인 문제 정확도가 개선되었습니다.",
        meta: "최근 14일",
        tone: "xai",
      },
      {
        label: "조정",
        title: "다음 주 학습 리듬 제안",
        body: "마감 전날보다 이틀 전 30분 세션이 더 안정적입니다.",
        meta: "개인 계획",
        tone: "student",
      },
    ],
    nextActions: ["리듬 조정", "성과 기준 보기", "데이터 사용 범위"],
    evidenceFocus: "개인 인사이트는 본인 화면에서만 제공하며 교수자 화면에는 익명 집계만 전달됩니다.",
  },
  "instructor.dashboard": {
    eyebrow: "데이터 마이닝 · 티칭 홈",
    summary: "오늘 처리해야 할 교수자 결정을 근거, 대안, 측정 계획과 함께 보여줍니다.",
    metricA: { label: "결정 대기", value: "3건", sub: "우선순위 정렬", tone: "warn" },
    metricB: { label: "수강생", value: "214명", sub: "3개 강의", tone: "neutral" },
    metricC: { label: "집계 신뢰도", value: "0.78", sub: "W7 incident", tone: "good" },
    workItems: [],
    nextActions: ["결정 검토", "근거 보기", "측정 계획"],
    evidenceFocus: "교수자 화면은 개인 식별 없이 반 단위 패턴과 승인 필요한 의사결정만 보여줍니다.",
  },
  "instructor.today": {
    eyebrow: "오늘 · 교수자 작업",
    summary: "강의 운영, 채점, 학생 지원 작업을 긴급도와 영향도 기준으로 정렬합니다.",
    metricA: { label: "오늘 작업", value: "7개", sub: "검토 3 · 발송 2", tone: "warn" },
    metricB: { label: "자동 초안", value: "5개", sub: "승인 전", tone: "neutral" },
    metricC: { label: "시간 절감", value: "42분", sub: "예상", tone: "good" },
    workItems: [
      {
        label: "결정",
        title: "W7 자료 개선 승인 여부",
        body: "학생 막힘 집계가 충분해 Co-Creation 보완안을 검토할 수 있습니다.",
        meta: "수업 영향 높음",
        tone: "instructor",
      },
      {
        label: "채점",
        title: "경계 답안 8건 검토",
        body: "AI 초안 확신도가 낮은 답안만 교수자 검토 큐로 분리했습니다.",
        meta: "마감 72시간 내",
        tone: "warn",
      },
      {
        label: "지원",
        title: "미접속 학생 6명 메시지 확인",
        body: "개인별 사유를 단정하지 않고 지원 옵션만 제안합니다.",
        meta: "발송 전 승인 필요",
        tone: "xai",
      },
    ],
    nextActions: ["긴급순 보기", "승인 대기만", "오늘 일정"],
    evidenceFocus: "오늘 할 일은 자동 실행하지 않으며, 교수자 승인과 감사 가능한 근거를 요구합니다.",
  },
  "instructor.design": {
    eyebrow: "강의 운영 · 학습 설계",
    summary: "강의 목표, 자료, 평가 기준을 연결해 다음 주 수업을 설계합니다.",
    metricA: { label: "다음 강의", value: "W8", sub: "랜덤 포레스트", tone: "neutral" },
    metricB: { label: "보완 필요", value: "2곳", sub: "선수개념·예시", tone: "warn" },
    metricC: { label: "정렬도", value: "91%", sub: "목표-평가 연결", tone: "good" },
    workItems: [
      {
        label: "목표",
        title: "학습성과와 루브릭 연결",
        body: "W8 강의 목표가 과제 3 루브릭의 실험 설계 항목과 직접 연결됩니다.",
        meta: "정렬도 91%",
        tone: "instructor",
      },
      {
        label: "자료",
        title: "W7 막힘을 W8 도입부에 반영",
        body: "지니/엔트로피 혼란을 랜덤 포레스트 도입 전에 3분 복습으로 처리합니다.",
        meta: "incident 기반",
        tone: "xai",
      },
      {
        label: "검토",
        title: "공개 전 표현과 예시 점검",
        body: "일본어 경어 톤과 유학생 지원 문구를 함께 확인합니다.",
        meta: "일본 대학 UX",
        tone: "instructor",
      },
    ],
    nextActions: ["강의안 열기", "목표-평가 매핑", "복습 블록 추가"],
    evidenceFocus: "설계 제안은 강의 목표, 과제 루브릭, 익명 학습 패턴을 연결하되 교수자 최종 편집을 전제로 합니다.",
  },
  "instructor.rubric": {
    eyebrow: "강의 운영 · 루브릭",
    summary: "평가 기준을 만들고 AI 평가 지원이 사용할 수 있는 근거 구조를 고정합니다.",
    metricA: { label: "루브릭", value: "4기준", sub: "과제 3", tone: "neutral" },
    metricB: { label: "모호 항목", value: "1개", sub: "실험 재현성", tone: "warn" },
    metricC: { label: "검토 상태", value: "초안", sub: "공개 전", tone: "neutral" },
    workItems: [
      {
        label: "기준",
        title: "실험 설계 기준 문구 보완",
        body: "자료 출처, 변수 선택, 평가 지표를 분리하면 채점 불확실성을 줄일 수 있습니다.",
        meta: "경계 답안 감소 예상",
        tone: "warn",
      },
      {
        label: "AI 사용",
        title: "허용 범위 문구 추가",
        body: "학생이 사용할 수 있는 AI 도움과 금지되는 대필을 명확히 분리합니다.",
        meta: "정책 일관성",
        tone: "instructor",
      },
      {
        label: "검증",
        title: "샘플 답안 3개로 기준 테스트",
        body: "상·중·하 답안에 같은 기준을 적용해 모호성을 확인합니다.",
        meta: "공개 전 체크",
        tone: "xai",
      },
    ],
    nextActions: ["기준 편집", "샘플 테스트", "학생용 문구 보기"],
    evidenceFocus: "루브릭은 AI 초안 생성보다 교수자 평가 기준의 명확성과 일관성을 우선합니다.",
  },
  "instructor.cocreation": {
    eyebrow: "강의 운영 · Co-Creation",
    summary: "학생 막힘 신호를 강의자료 개선안으로 바꾸고, 승인 후 효과를 측정합니다.",
    metricA: { label: "대상 구간", value: "22%", sub: "W7/Lec2", tone: "warn" },
    metricB: { label: "개선안", value: "3개", sub: "비교 가능", tone: "neutral" },
    metricC: { label: "예상 효과", value: "-18%", sub: "재시청률", tone: "good" },
    workItems: [
      {
        label: "입력",
        title: "Gini/Entropy 정의 구간 막힘",
        body: "정지/반복 42%, 질문 42건, 정의 혼란 신호가 같은 구간에 모였습니다.",
        meta: "익명 집계",
        tone: "xai",
      },
      {
        label: "초안",
        title: "1분 카드 + 비교 예시",
        body: "기존 강의를 대체하지 않고 막힌 구간 앞에 짧은 보완 자료를 삽입합니다.",
        meta: "승인 전",
        tone: "instructor",
      },
      {
        label: "측정",
        title: "A/B 경계와 guardrail 등록",
        body: "재시청률, 확인 문제 정확도, 감시받는 느낌을 함께 측정합니다.",
        meta: "파일럿 지표",
        tone: "warn",
      },
    ],
    nextActions: ["개선안 비교", "승인 전 검토", "효과 측정 등록"],
    evidenceFocus: "Co-Creation은 학생 개인을 추적하지 않고, 반 단위 막힘 패턴을 교수자 소유 자료 개선으로 전환합니다.",
  },
  "instructor.grading": {
    eyebrow: "강의 운영 · AI 평가 지원",
    summary: "AI 초안 채점 중 확신도가 낮은 제출물만 교수자 검토 큐로 올립니다.",
    metricA: { label: "초안 완료", value: "32건", sub: "52건 중", tone: "neutral" },
    metricB: { label: "검토 필수", value: "8건", sub: "경계 답안", tone: "warn" },
    metricC: { label: "확정 가능", value: "24건", sub: "루브릭 일치", tone: "good" },
    workItems: [
      {
        label: "검토",
        title: "루브릭 A/B 경계 답안",
        body: "실험 설계 근거는 충분하지만 재현성 설명이 짧은 제출물입니다.",
        meta: "교수자 판정 필요",
        tone: "warn",
      },
      {
        label: "일괄",
        title: "확정 가능 24건 승인",
        body: "루브릭 근거와 피드백 문구가 기준 안에 들어온 항목입니다.",
        meta: "승인 전 미리보기",
        tone: "instructor",
      },
      {
        label: "품질",
        title: "피드백 문구 톤 점검",
        body: "학생이 다음 행동을 이해할 수 있도록 기준별 보완 문장으로 정리합니다.",
        meta: "학습자 경험",
        tone: "xai",
      },
    ],
    nextActions: ["8건 검토", "확정 가능만 보기", "피드백 톤 점검"],
    evidenceFocus: "AI 평가는 최종 채점자가 아니라 루브릭 근거를 정리하는 보조자로 제한됩니다.",
  },
  "instructor.classhealth": {
    eyebrow: "강의 운영 · 클래스 건강도",
    summary: "반 단위 학습 신호와 개입 효과를 장기적으로 추적합니다.",
    metricA: { label: "건강도", value: "74", sub: "100점 기준", tone: "neutral" },
    metricB: { label: "주의 군집", value: "3개", sub: "익명 패턴", tone: "warn" },
    metricC: { label: "개선 효과", value: "+9%", sub: "확인 문제", tone: "good" },
    workItems: [
      {
        label: "W7",
        title: "Gini/Entropy 개선안 효과 추적",
        body: "Co-Creation 공개 후 재시청률과 질문 중복률 변화를 확인합니다.",
        meta: "측정 대기",
        tone: "xai",
      },
      {
        label: "지원",
        title: "미접속/미제출 동시 발생군",
        body: "개인 사유를 단정하지 않고 지원 옵션별 반응만 비교합니다.",
        meta: "학생 지원",
        tone: "warn",
      },
      {
        label: "성과",
        title: "학기 중간 인사이트 저장",
        body: "다음 학기 설계를 위해 효과가 있었던 개입만 기록합니다.",
        meta: "재사용 가능",
        tone: "instructor",
      },
    ],
    nextActions: ["효과 보기", "군집 비교", "학기 리포트"],
    evidenceFocus: "클래스 건강도는 개인 감시가 아니라 수업 설계 개선을 위한 집계 지표로 제한합니다.",
  },
  "instructor.intervention": {
    eyebrow: "학생 지원 · 학습 개입",
    summary: "개별 학생에게 보낼 지원 메시지를 근거와 대안 비교 후 승인합니다.",
    metricA: { label: "개입 후보", value: "6명", sub: "발송 전", tone: "warn" },
    metricB: { label: "대안", value: "3종", sub: "오피스아워·자료·유예", tone: "neutral" },
    metricC: { label: "자동 발송", value: "0건", sub: "승인 필요", tone: "good" },
    workItems: [
      {
        label: "후보",
        title: "3주 미접속 + 과제 미제출",
        body: "개인 사유를 추정하지 않고 도움을 받을 수 있는 선택지를 제안합니다.",
        meta: "민감도 높음",
        tone: "warn",
      },
      {
        label: "메시지",
        title: "부담 낮은 오피스아워 초대",
        body: "비난이 아닌 지원 톤으로, 학생이 선택할 수 있는 경로를 제공합니다.",
        meta: "승인 전",
        tone: "instructor",
      },
      {
        label: "측정",
        title: "개입 후 7일 변화 확인",
        body: "접속, 제출, 답장 여부를 집계해 다음 개입 품질을 점검합니다.",
        meta: "학생별 낙인 방지",
        tone: "xai",
      },
    ],
    nextActions: ["메시지 검토", "대안 비교", "민감도 확인"],
    evidenceFocus: "개입은 학생을 판단하는 화면이 아니라 지원 선택지를 교수자가 검토하는 화면입니다.",
  },
  "instructor.insights": {
    eyebrow: "학생 지원 · 학기 인사이트",
    summary: "이번 학기 운영 결과를 다음 학기 설계와 파일럿 측정으로 연결합니다.",
    metricA: { label: "등록 지표", value: "4개", sub: "파일럿 기준", tone: "neutral" },
    metricB: { label: "효과 확인", value: "2건", sub: "강의자료 개선", tone: "good" },
    metricC: { label: "주의", value: "1건", sub: "감시 인식", tone: "warn" },
    workItems: [
      {
        label: "성과",
        title: "중복 질문률 감소",
        body: "보완 자료 공개 후 같은 개념 질문이 줄었는지 학기 단위로 확인합니다.",
        meta: "집계 지표",
        tone: "xai",
      },
      {
        label: "설계",
        title: "다음 학기 W7 개선안 고정",
        body: "효과가 확인된 복습 블록을 정규 강의안에 반영합니다.",
        meta: "교수자 승인",
        tone: "instructor",
      },
      {
        label: "윤리",
        title: "학생 감시 인식 guardrail",
        body: "도움이 되었는지뿐 아니라 감시받는 느낌이 증가했는지도 함께 기록합니다.",
        meta: "파일럿 필수",
        tone: "warn",
      },
    ],
    nextActions: ["리포트 생성", "다음 학기 반영", "guardrail 확인"],
    evidenceFocus: "학기 인사이트는 성과 지표와 윤리 지표를 함께 다뤄야 파일럿 이후 실제 도입으로 이어집니다.",
  },
};
