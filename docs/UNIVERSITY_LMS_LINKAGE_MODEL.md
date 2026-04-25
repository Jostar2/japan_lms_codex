# University LMS Linkage Model

The student and instructor surfaces are separate product surfaces inside one university LMS. They should not be implemented as isolated apps with duplicated logic. They are connected through shared academic entities and XAI evidence contracts.

## Shared Academic Entities

The common platform should model these entities once:

- Institution
- Term
- Course
- Section
- User
- Role
- Enrollment
- Lecture
- Lecture segment
- Assignment
- Submission
- Rubric
- Feedback item
- Intervention
- Cohort pattern
- Measurement result
- XAI evidence item

Student and instructor routes may display different views of the same entity. The data contract is shared; the page layout is not.

## Current Closed Loop

The current prototype already contains one strong cross-surface incident:

1. Student surface detects a learning struggle.
   - Route: `student.lecture`
   - Entity: lecture segment `seg-22pct`
   - Signal: Gini/Entropy confusion, 42% cohort pause/replay

2. Instructor surface aggregates it as a teaching decision.
   - Route: `instructor.dashboard`
   - Target: `decision-w7-cocreation`
   - Action: improve W7/Lec2 teaching material

3. Instructor co-creates and publishes a variant.
   - Route: `instructor.cocreation`
   - Targets: `step1-input` through `step5-effect`
   - Action: approve a teaching-material variant with A/B measurement

4. Class health records effect measurement.
   - Route: `instructor.classhealth`
   - Target: `impact-ledger-entry`
   - Result: two-week measurement and policy trace

This loop is the service model to preserve:

`student learning signal -> instructor decision -> teaching intervention -> measured outcome -> future student recommendation`

## Surface Boundary Rules

Student surface may show:

- Personal recommendation
- Personal progress
- Personal feedback
- Cohort signal only when anonymized and framed as reassurance or guidance
- Explanation of why a recommendation was made

Student surface must not show:

- Other students' identities
- Instructor uncertainty queues
- Private rubric calibration
- Cohort-level surveillance language

Instructor surface may show:

- Cohort-level patterns
- Rubric and grading uncertainty
- Intervention candidates
- Teaching material effectiveness
- Audit and measurement trace

Instructor surface must avoid:

- Unnecessary personal profiling
- Unsupported causal claims
- Student-facing conversational language in operational views

## Link Verification

The route audit enforces the minimum current linkage:

- `student.lecture` has a bridge to instructor decision context.
- `decision-w7-cocreation` is supported by `instructor.dashboard`.
- `instructor.cocreation` keeps evidence that the incident originated from `student.lecture`.
- Every DOM `data-ai-target` resolves locally or to another route's focus context.

Command:

```bash
npm run verify:routes
```

This is not a full domain test yet. It is a guardrail that prevents productization work from accidentally splitting the student and instructor experiences into unrelated prototypes.
