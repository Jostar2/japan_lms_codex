import { useMemo, useState } from "react";
import { AiContextPanel } from "./AiContextPanel.js";
import { AppShell } from "./AppShell.js";
import { RouteWorkspace } from "./RouteWorkspace.js";
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

  function navigateRoute(nextRouteKey: RouteKey) {
    setSurface(nextRouteKey.startsWith("student.") ? "student" : "instructor");
    setRouteKey(nextRouteKey);
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
            <AiContextPanel closedLoop={closedLoop} route={route} surface={surface} />
          )
        }
        routeKey={routeKey}
        routes={routes}
        surface={surface}
        onRouteChange={navigateRoute}
        onSurfaceChange={switchSurface}
      >
        {studentLectureViewModel ? (
          <StudentLectureRoute viewModel={studentLectureViewModel} />
        ) : instructorDashboardViewModel ? (
          <InstructorDashboardRoute viewModel={instructorDashboardViewModel} onRouteChange={navigateRoute} />
        ) : (
          <RouteWorkspace
            closedLoop={closedLoop}
            route={route}
            routeKey={routeKey}
            surface={surface}
            onRouteChange={navigateRoute}
          />
        )}
      </AppShell>
    </>
  );
}
