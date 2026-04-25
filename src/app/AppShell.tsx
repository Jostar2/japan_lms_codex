import type { KeyboardEvent, MouseEvent, ReactNode } from "react";
import type { RouteKey, Surface, SurfaceRoute } from "../shared/lms-contract.js";

interface AppShellProps {
  activeAiTarget: string;
  aside: ReactNode;
  children: ReactNode;
  routeKey: RouteKey;
  routes: SurfaceRoute[];
  surface: Surface;
  onAiTargetSelect: (targetId: string) => void;
  onRouteChange: (routeKey: RouteKey) => void;
  onSurfaceChange: (surface: Surface) => void;
}

export function AppShell({
  activeAiTarget,
  aside,
  children,
  routeKey,
  routes,
  surface,
  onAiTargetSelect,
  onRouteChange,
  onSurfaceChange,
}: AppShellProps) {
  function handleAiTargetClick(event: MouseEvent<HTMLDivElement>) {
    const targetId = resolveAiTarget(event.target);
    if (!targetId) return;

    onAiTargetSelect(targetId);
  }

  function handleAiTargetKeyDown(event: KeyboardEvent<HTMLDivElement>) {
    if (event.key !== "Enter" && event.key !== " ") return;

    const targetId = resolveAiTarget(event.target);
    if (!targetId) return;

    const element = event.target instanceof HTMLElement ? event.target : null;
    const isNativeControl = element ? ["BUTTON", "A", "INPUT", "TEXTAREA"].includes(element.tagName) : false;
    if (!isNativeControl) event.preventDefault();

    onAiTargetSelect(targetId);
  }

  return (
    <div
      className={`claritas-shell ${surface === "student" ? "s-mode" : "i-mode"}`}
      data-active-ai-target={activeAiTarget}
      data-surface={surface}
      onClickCapture={handleAiTargetClick}
      onKeyDownCapture={handleAiTargetKeyDown}
    >
      <Topbar surface={surface} onSurfaceChange={onSurfaceChange} />
      <LeftNav routeKey={routeKey} routes={routes} surface={surface} onRouteChange={onRouteChange} />
      <main className="app-main">{children}</main>
      {aside}
    </div>
  );
}

function resolveAiTarget(target: EventTarget | null): string | null {
  if (!(target instanceof HTMLElement)) return null;

  const targetElement = target.closest<HTMLElement>("[data-ai-target]");
  return targetElement?.dataset.aiTarget ?? null;
}

interface TopbarProps {
  surface: Surface;
  onSurfaceChange: (surface: Surface) => void;
}

function Topbar({ surface, onSurfaceChange }: TopbarProps) {
  return (
    <header className="app-topbar">
      <div className="brand" aria-label="Claritas">
        <div className="brand-mark">C</div>
        <div>
          <div className="brand-name">Claritas</div>
          <div className="brand-tag">Explainable University AI</div>
        </div>
      </div>

      <form className="search-bar" role="search" aria-label="LMS search" onSubmit={(event) => event.preventDefault()}>
        <span className="search-kicker" aria-hidden="true">
          검색
        </span>
        <input aria-label="강의, 주제, 학생, 과제 검색" placeholder="강의·주제·학생·과제 검색" type="search" />
      </form>

      <div className="topbar-context" aria-label="Current academic context">
        <span>2026 봄학기</span>
        <strong>데이터 마이닝</strong>
      </div>

      <div className="view-switch" role="group" aria-label="Surface switch">
        <button
          className={surface === "student" ? "active" : ""}
          type="button"
          data-persona="student"
          onClick={() => onSurfaceChange("student")}
        >
          <span className="persona-dot student" aria-hidden="true" />
          학습자
        </button>
        <button
          className={surface === "instructor" ? "active" : ""}
          type="button"
          data-persona="instructor"
          onClick={() => onSurfaceChange("instructor")}
        >
          <span className="persona-dot instructor" aria-hidden="true" />
          교수자
        </button>
      </div>
    </header>
  );
}

interface LeftNavProps {
  routeKey: RouteKey;
  routes: SurfaceRoute[];
  surface: Surface;
  onRouteChange: (routeKey: RouteKey) => void;
}

function LeftNav({ routeKey, routes, surface, onRouteChange }: LeftNavProps) {
  const routeGroups = groupRoutes(routes);

  return (
    <nav className="app-nav" aria-label={`${surface === "student" ? "Student" : "Instructor"} navigation`}>
      <div className="nav-head">
        <span className="snb-title">{surface === "student" ? "Learner Workspace" : "Teaching Workspace"}</span>
      </div>
      <div className="nav-list">
        {routeGroups.map((group) => (
          <div className="nav-section" key={group.label}>
            <div className="nav-section-label">{group.label}</div>
            {group.items.map((item) => (
              <button
                aria-current={item.key === routeKey ? "page" : undefined}
                className={`nav-item ${item.key === routeKey ? "active" : ""}`}
                key={item.key}
                type="button"
                onClick={() => onRouteChange(item.key)}
              >
                <span>
                  <span className="nav-label">{item.label}</span>
                  <span className="nav-group">{navRouteSubtitles[item.key]}</span>
                </span>
              </button>
            ))}
          </div>
        ))}
      </div>
    </nav>
  );
}

const navRouteSubtitles: Record<RouteKey, string> = {
  "student.dashboard": "수강 현황과 다음 행동",
  "student.today": "오늘 할 학습 정렬",
  "student.explore": "강의와 개념 탐색",
  "student.lecture": "영상 · 자막 · 복습",
  "student.assignment": "제출 · 토론 · 루브릭",
  "student.feedback": "채점 결과와 개선점",
  "student.companion": "출처 기반 AI 질문",
  "student.insight-me": "개인 학습 패턴",
  "instructor.dashboard": "결정 큐와 운영 신호",
  "instructor.today": "오늘 승인할 작업",
  "instructor.design": "강의 목표와 자료",
  "instructor.rubric": "평가 기준 설계",
  "instructor.cocreation": "자료 개선안 생성",
  "instructor.grading": "채점 초안 검토",
  "instructor.classhealth": "반 단위 효과 측정",
  "instructor.intervention": "지원 메시지 승인",
  "instructor.insights": "학기 리포트",
};

function groupRoutes(routes: SurfaceRoute[]): Array<{ label: string; items: SurfaceRoute[] }> {
  const grouped = new Map<string, SurfaceRoute[]>();

  for (const route of routes) {
    grouped.set(route.group, [...(grouped.get(route.group) ?? []), route]);
  }

  return [...grouped.entries()].map(([label, items]) => ({ label, items }));
}
