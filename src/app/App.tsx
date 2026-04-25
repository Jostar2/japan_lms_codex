import { useMemo, useState } from "react";
import { AiContextPanel } from "./AiContextPanel.js";
import { AppShell } from "./AppShell.js";
import { flattenDesignTokens } from "../shared/design-tokens.js";
import {
  getClosedLoop,
  getRouteContract,
  getSurfaceRoutes,
  type RouteKey,
  type Surface,
} from "../shared/lms-contract.js";
import {
  InstructorDashboardAside,
  InstructorDashboardRoute,
} from "../instructor/dashboard/InstructorDashboardRoute.js";
import { getInstructorDashboardDecisionViewModel } from "../instructor/dashboard/view-model.js";
import { StudentLectureAside, StudentLectureRoute } from "../student/lecture/StudentLectureRoute.js";
import { getStudentLectureViewModel } from "../student/lecture/view-model.js";

const defaultRouteBySurface: Record<Surface, RouteKey> = {
  student: "student.lecture",
  instructor: "instructor.dashboard",
};

export function App() {
  const [surface, setSurface] = useState<Surface>("student");
  const [routeKey, setRouteKey] = useState<RouteKey>(defaultRouteBySurface.student);
  const routes = getSurfaceRoutes(surface);
  const route = getRouteContract(routeKey);
  const closedLoop = getClosedLoop("w7-gini-entropy-incident");
  const studentLectureViewModel = routeKey === "student.lecture" ? getStudentLectureViewModel() : null;
  const instructorDashboardViewModel =
    routeKey === "instructor.dashboard" ? getInstructorDashboardDecisionViewModel() : null;

  const tokenCss = useMemo(() => {
    const declarations = flattenDesignTokens().map((token) => `  ${token.cssVariable}: ${token.value};`);
    return `:root {\n${declarations.join("\n")}\n}`;
  }, []);

  function switchSurface(nextSurface: Surface) {
    setSurface(nextSurface);
    setRouteKey(defaultRouteBySurface[nextSurface]);
  }

  return (
    <>
      <style>{tokenCss}</style>
      <AppShell
        aside={
          studentLectureViewModel ? (
            <StudentLectureAside viewModel={studentLectureViewModel} />
          ) : instructorDashboardViewModel ? (
            <InstructorDashboardAside viewModel={instructorDashboardViewModel} />
          ) : (
            <AiContextPanel />
          )
        }
        routeKey={routeKey}
        routes={routes}
        surface={surface}
        onRouteChange={setRouteKey}
        onSurfaceChange={switchSurface}
      >
        {studentLectureViewModel ? (
          <StudentLectureRoute viewModel={studentLectureViewModel} />
        ) : instructorDashboardViewModel ? (
          <InstructorDashboardRoute viewModel={instructorDashboardViewModel} onRouteChange={setRouteKey} />
        ) : (
          <RouteContractWorkspace surface={surface} route={route} routeKey={routeKey} closedLoop={closedLoop} />
        )}
      </AppShell>
    </>
  );
}

interface RouteContractWorkspaceProps {
  closedLoop: ReturnType<typeof getClosedLoop>;
  route: ReturnType<typeof getRouteContract>;
  routeKey: RouteKey;
  surface: Surface;
}

function RouteContractWorkspace({ closedLoop, route, routeKey, surface }: RouteContractWorkspaceProps) {
  return (
    <>
      <div className="page-head">
        <div>
          <div className="page-eyebrow">{surface === "student" ? "Student Surface" : "Instructor Surface"}</div>
          <h1>{route.label}</h1>
          <p>
            Production app shell boundary. Prototype visual parity comes next; this layer owns route and domain wiring.
          </p>
        </div>
      </div>

      <section className="work-panel" aria-label="Route contract">
        <div className="panel-head">
          <h2>Route Contract</h2>
          <span className="route-key">{route.key}</span>
        </div>
        <dl className="route-grid">
          <div>
            <dt>Group</dt>
            <dd>{route.group}</dd>
          </div>
          <div>
            <dt>Migration</dt>
            <dd>#{route.migrationPriority}</dd>
          </div>
          <div>
            <dt>Entities</dt>
            <dd>{route.entities.join(", ")}</dd>
          </div>
        </dl>
      </section>

      <section className="work-panel" aria-label="Closed loop">
        <div className="panel-head">
          <h2>Closed Loop</h2>
          <span className="route-key">{closedLoop.id}</span>
        </div>
        <ol className="loop-steps">
          {closedLoop.steps.map((step) => (
            <li key={`${step.phase}-${step.route}`}>
              <span className="step-phase">{step.phase}</span>
              <span>{step.route}</span>
              <span className="step-target">{step.targetId}</span>
            </li>
          ))}
        </ol>
      </section>
    </>
  );
}
