import contractJson from "../../contracts/university-lms.contract.json";

export type Surface = "student" | "instructor";

export type SharedEntity =
  | "institution"
  | "term"
  | "course"
  | "section"
  | "user"
  | "role"
  | "enrollment"
  | "lecture"
  | "lecture-segment"
  | "assignment"
  | "submission"
  | "rubric"
  | "feedback-item"
  | "intervention"
  | "cohort-pattern"
  | "measurement-result"
  | "xai-evidence-item";

export type StudentRouteKey =
  | "student.dashboard"
  | "student.today"
  | "student.explore"
  | "student.lecture"
  | "student.assignment"
  | "student.feedback"
  | "student.companion"
  | "student.insight-me";

export type InstructorRouteKey =
  | "instructor.dashboard"
  | "instructor.today"
  | "instructor.design"
  | "instructor.rubric"
  | "instructor.cocreation"
  | "instructor.grading"
  | "instructor.classhealth"
  | "instructor.intervention"
  | "instructor.insights";

export type RouteKey = StudentRouteKey | InstructorRouteKey;

export interface SurfaceRoute {
  key: RouteKey;
  label: string;
  group: string;
  entities: SharedEntity[];
  migrationPriority: number;
}

export interface SurfaceContract {
  purpose: string;
  privacyBoundary: string[];
  routes: SurfaceRoute[];
}

export interface ClosedLoopStep {
  phase: "detect" | "aggregate" | "intervene" | "measure";
  surface: Surface;
  route: RouteKey;
  targetId: string;
  entity: SharedEntity;
  privacy: string;
}

export interface ClosedLoopContract {
  id: string;
  name: string;
  sharedEntities: SharedEntity[];
  studentVisible: boolean;
  instructorVisible: boolean;
  steps: ClosedLoopStep[];
  expectedOutcomeMetrics: string[];
}

export interface UniversityLmsContract {
  version: string;
  product: {
    name: string;
    type: string;
    market: string;
    designSourceOfTruth: string;
  };
  sharedEntities: SharedEntity[];
  xaiEvidenceContract: {
    requiredFields: string[];
    studentLanguage: string[];
    instructorLanguage: string[];
  };
  surfaces: Record<Surface, SurfaceContract>;
  closedLoops: ClosedLoopContract[];
}

export const universityLmsContract = contractJson as UniversityLmsContract;

export function getSurfaceRoutes(surface: Surface): SurfaceRoute[] {
  return [...universityLmsContract.surfaces[surface].routes].sort(
    (left, right) => left.migrationPriority - right.migrationPriority,
  );
}

export function getRouteContract(routeKey: RouteKey): SurfaceRoute {
  const route = Object.values(universityLmsContract.surfaces)
    .flatMap((surface) => surface.routes)
    .find((item) => item.key === routeKey);

  if (!route) {
    throw new Error(`Unknown LMS route: ${routeKey}`);
  }

  return route;
}

export function getClosedLoop(loopId: string): ClosedLoopContract {
  const loop = universityLmsContract.closedLoops.find((item) => item.id === loopId);

  if (!loop) {
    throw new Error(`Unknown LMS closed loop: ${loopId}`);
  }

  return loop;
}
