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
import {
  InstructorCocreationAside,
  InstructorCocreationRoute,
} from "../instructor/cocreation/InstructorCocreationRoute.js";
import { getInstructorCocreationViewModel } from "../instructor/cocreation/view-model.js";
import {
  InstructorClassHealthAside,
  InstructorClassHealthRoute,
} from "../instructor/classhealth/InstructorClassHealthRoute.js";
import { getInstructorClassHealthViewModel } from "../instructor/classhealth/view-model.js";
import { StudentLectureAside, StudentLectureRoute } from "../student/lecture/StudentLectureRoute.js";
import { getStudentLectureViewModel } from "../student/lecture/view-model.js";

const defaultRouteBySurface: Record<Surface, RouteKey> = {
  student: "student.lecture",
  instructor: "instructor.dashboard",
};

const defaultAiTargetByRoute: Partial<Record<RouteKey, string>> = {
  "student.lecture": "seg-22pct",
  "instructor.dashboard": "decision-w7-cocreation",
  "instructor.cocreation": "step1-input",
  "instructor.classhealth": "impact-ledger-entry",
};

export function App() {
  const [surface, setSurface] = useState<Surface>("student");
  const [routeKey, setRouteKey] = useState<RouteKey>(defaultRouteBySurface.student);
  const [activeAiTarget, setActiveAiTarget] = useState(
    defaultAiTargetByRoute[defaultRouteBySurface.student] ?? "route",
  );
  const routes = getSurfaceRoutes(surface);
  const route = getRouteContract(routeKey);
  const closedLoop = getClosedLoop("w7-gini-entropy-incident");
  const studentLectureViewModel = routeKey === "student.lecture" ? getStudentLectureViewModel() : null;
  const instructorDashboardViewModel =
    routeKey === "instructor.dashboard" ? getInstructorDashboardDecisionViewModel() : null;
  const instructorCocreationViewModel =
    routeKey === "instructor.cocreation" ? getInstructorCocreationViewModel() : null;
  const instructorClassHealthViewModel =
    routeKey === "instructor.classhealth" ? getInstructorClassHealthViewModel() : null;

  const tokenCss = useMemo(() => {
    const declarations = flattenDesignTokens().map((token) => `  ${token.cssVariable}: ${token.value};`);
    return `:root {\n${declarations.join("\n")}\n}`;
  }, []);

  function switchSurface(nextSurface: Surface) {
    const nextRouteKey = defaultRouteBySurface[nextSurface];
    setSurface(nextSurface);
    setRouteKey(nextRouteKey);
    setActiveAiTarget(defaultAiTargetByRoute[nextRouteKey] ?? "route");
  }

  function navigateRoute(nextRouteKey: RouteKey) {
    setSurface(nextRouteKey.startsWith("student.") ? "student" : "instructor");
    setRouteKey(nextRouteKey);
    setActiveAiTarget(defaultAiTargetByRoute[nextRouteKey] ?? "route");
  }

  return (
    <>
      <style>{tokenCss}</style>
      <AppShell
        activeAiTarget={activeAiTarget}
        aside={
          studentLectureViewModel ? (
            <StudentLectureAside activeAiTarget={activeAiTarget} viewModel={studentLectureViewModel} />
          ) : instructorDashboardViewModel ? (
            <InstructorDashboardAside activeAiTarget={activeAiTarget} viewModel={instructorDashboardViewModel} />
          ) : instructorCocreationViewModel ? (
            <InstructorCocreationAside activeAiTarget={activeAiTarget} viewModel={instructorCocreationViewModel} />
          ) : instructorClassHealthViewModel ? (
            <InstructorClassHealthAside activeAiTarget={activeAiTarget} viewModel={instructorClassHealthViewModel} />
          ) : (
            <AiContextPanel closedLoop={closedLoop} route={route} surface={surface} />
          )
        }
        routeKey={routeKey}
        routes={routes}
        surface={surface}
        onAiTargetSelect={setActiveAiTarget}
        onRouteChange={navigateRoute}
        onSurfaceChange={switchSurface}
      >
        {studentLectureViewModel ? (
          <StudentLectureRoute viewModel={studentLectureViewModel} />
        ) : instructorDashboardViewModel ? (
          <InstructorDashboardRoute viewModel={instructorDashboardViewModel} onRouteChange={navigateRoute} />
        ) : instructorCocreationViewModel ? (
          <InstructorCocreationRoute viewModel={instructorCocreationViewModel} onRouteChange={navigateRoute} />
        ) : instructorClassHealthViewModel ? (
          <InstructorClassHealthRoute viewModel={instructorClassHealthViewModel} onRouteChange={navigateRoute} />
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
