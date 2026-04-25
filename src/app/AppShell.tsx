import type { ReactNode } from "react";
import type { RouteKey, Surface, SurfaceRoute } from "../shared/lms-contract.js";

interface AppShellProps {
  aside: ReactNode;
  children: ReactNode;
  routeKey: RouteKey;
  routes: SurfaceRoute[];
  surface: Surface;
  onRouteChange: (routeKey: RouteKey) => void;
  onSurfaceChange: (surface: Surface) => void;
}

export function AppShell({
  aside,
  children,
  routeKey,
  routes,
  surface,
  onRouteChange,
  onSurfaceChange,
}: AppShellProps) {
  return (
    <div className={`claritas-shell ${surface === "student" ? "s-mode" : "i-mode"}`} data-surface={surface}>
      <Topbar surface={surface} onSurfaceChange={onSurfaceChange} />
      <LeftNav routeKey={routeKey} routes={routes} surface={surface} onRouteChange={onRouteChange} />
      <main className="app-main">{children}</main>
      {aside}
    </div>
  );
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

      <div className="search-bar" role="search" aria-label="LMS search">
        <span className="search-copy">강의·주제·학생·과제를 검색합니다</span>
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
  return (
    <nav className="app-nav" aria-label={`${surface === "student" ? "Student" : "Instructor"} navigation`}>
      <div className="nav-head">
        <span className="snb-title">Navigation</span>
      </div>
      <div className="nav-list">
        {routes.map((item) => (
          <button
            className={`nav-item ${item.key === routeKey ? "active" : ""}`}
            key={item.key}
            type="button"
            onClick={() => onRouteChange(item.key)}
          >
            <span>
              <span className="nav-label">{item.label}</span>
              <span className="nav-group">{item.group}</span>
            </span>
          </button>
        ))}
      </div>
    </nav>
  );
}
