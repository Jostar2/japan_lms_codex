import { getClosedLoop, getSurfaceRoutes, type InstructorRouteKey } from "../shared/lms-contract.js";

export const instructorRoutes = getSurfaceRoutes("instructor");

export const instructorMigrationOrder = instructorRoutes.map((route) => route.key as InstructorRouteKey);

export const instructorClosedLoop = getClosedLoop("w7-gini-entropy-incident");

export const instructorDashboardRouteKey: InstructorRouteKey = "instructor.dashboard";
