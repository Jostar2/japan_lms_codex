import type { RouteKey, SharedEntity, Surface } from "./lms-contract.js";

export type XaiIntent = "VIEW" | "DECIDE" | "DRAFT" | "APPROVE" | "MEASURE";

export interface XaiEvidenceItem {
  id: string;
  label: string;
  value: string;
  source: "student-activity" | "cohort-aggregate" | "content-analysis" | "rubric" | "measurement" | "policy";
}

export interface XaiExplanation {
  intent: XaiIntent;
  route: RouteKey;
  surface: Surface;
  targetId: string;
  entity: SharedEntity;
  judgment: string;
  evidence: XaiEvidenceItem[];
  modelVersion: string;
  confidenceOrUncertainty: string;
  recommendedAction: string;
  humanApprovalState: "not-required" | "student-controlled" | "instructor-review-required" | "approved" | "measured";
  measurementPlan: string;
}

export function evidenceSummary(explanation: XaiExplanation): string {
  return explanation.evidence.map((item) => `${item.label}: ${item.value}`).join("; ");
}
