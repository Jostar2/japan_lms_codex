# Route Inventory

Source reference: `xAI_LMS_Prototype.html`.

Current route count: 17 routes.

Known mismatch: the prototype comment near the NAV data says "All 16 menus", but the actual NAV contains 8 student routes and 9 instructor routes.

## Student Surface

| Route                | Label         | Group       | Primary role                          | Initial work type                   |
| -------------------- | ------------- | ----------- | ------------------------------------- | ----------------------------------- |
| `student.dashboard`  | 대시보드      | 오늘        | Learner overview and decision queue   | Preserve visual parity              |
| `student.today`      | 오늘의 학습   | 오늘        | Daily learning plan and pacing        | Clarify task/action hierarchy       |
| `student.explore`    | 강의 탐색     | 강의        | Course discovery and recommendation   | Add/verify focus context coverage   |
| `student.lecture`    | 강의 수강     | 강의        | Lecture player and struggle recovery  | Fix AI target/action click conflict |
| `student.assignment` | 과제 · 토론   | 강의        | Submission and discussion workflow    | Normalize AI use boundary states    |
| `student.feedback`   | 피드백        | 강의        | Feedback explanation and improvement  | Normalize evidence/action card      |
| `student.companion`  | 학습 동반자   | Claritas AI | AI learning companion                 | Preserve conversational guidance    |
| `student.insight-me` | 나의 인사이트 | Claritas AI | Personal learning pattern and history | Improve scanability                 |

## Instructor Surface

| Route                     | Label              | Group     | Primary role                           | Initial work type                    |
| ------------------------- | ------------------ | --------- | -------------------------------------- | ------------------------------------ |
| `instructor.dashboard`    | 티칭 홈            | 오늘      | Teaching decision queue                | Preserve visual parity               |
| `instructor.today`        | 오늘 할 일         | 오늘      | Instructor task queue                  | Clarify task grouping                |
| `instructor.design`       | 학습 설계          | 강의 운영 | Course/session design                  | Extract course blueprint components  |
| `instructor.rubric`       | 루브릭 빌더        | 강의 운영 | Rubric design and governance           | Normalize rubric contract model      |
| `instructor.cocreation`   | Co-Creation Studio | 강의 운영 | AI-assisted teaching material creation | Normalize closed-loop XAI workflow   |
| `instructor.grading`      | AI 평가 지원       | 강의 운영 | Grading support and uncertainty queue  | Improve auditability and review flow |
| `instructor.classhealth`  | 클래스 건강도      | 강의 운영 | Cohort health and effect measurement   | Preserve dense operational dashboard |
| `instructor.intervention` | 학습 개입          | 학생 지원 | Intervention planning                  | Clarify approval and follow-up flow  |
| `instructor.insights`     | 학기 인사이트      | 학생 지원 | Semester-level impact ledger           | Normalize measurement evidence       |

## Cross-Surface Links

Student and instructor routes should connect through domain entities, not page internals.

Allowed link contracts:

- Course
- Lecture segment
- Assignment
- Submission
- Rubric
- Feedback item
- Intervention
- Cohort pattern
- Measurement result
- XAI evidence item

Example:

- `student.lecture` may link to the instructor view through a lecture-segment pattern such as `seg-22pct`.
- `instructor.dashboard` may aggregate the same pattern as a cohort decision item.
- The shared contract is the lecture segment and evidence object, not either page's DOM or route template.

Current verified linkage:

- `student.lecture` target `decision-w7-cocreation` links to `instructor.dashboard`.
- `instructor.cocreation` target `impact-ledger-entry` links to `instructor.classhealth`.
- `instructor.today` reuses dashboard decision targets and should be treated as a task-queue view over the same instructor decision entities.

## First Improvement Queue

Use this order unless a blocker forces a different one:

1. Shared verification: npm capture script, route screenshot baseline, console/page error reporting.
2. Shared bug: resolve `data-ai-target` capture handler blocking real button actions.
3. Student route: `student.lecture` parity and interaction hardening.
4. Instructor route: `instructor.dashboard` parity and decision queue hardening.
5. Shared XAI contract: evidence/action/measurement schema.
6. Instructor route: `instructor.cocreation` closed-loop workflow.
7. Student route: `student.feedback` and `student.assignment` AI-use boundary.
