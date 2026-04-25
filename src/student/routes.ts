import { getClosedLoop, getSurfaceRoutes, type StudentRouteKey } from "../shared/lms-contract.js";

export const studentRoutes = getSurfaceRoutes("student");

export const studentMigrationOrder = studentRoutes.map((route) => route.key as StudentRouteKey);

export const studentLectureClosedLoop = getClosedLoop("w7-gini-entropy-incident");

export const studentLectureRouteKey: StudentRouteKey = "student.lecture";
