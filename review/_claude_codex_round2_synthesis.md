# Claude × Codex Round 2 합의 — Plan 모드 진입 전 락업

> 입력: `_claude_to_codex_round2_targets.md` + `_codex_round2_targets_response.md`.
> 목적: plan 모드에 들고 들어갈 결정 5종을 못박는다.

---

## 0. Codex가 라운드 2에서 결정적으로 잡은 것들 (전부 수용)

### A. **개념 불일치 = spine 붕괴 1순위 위험** (★ 가장 결정적)
현재 `student.lecture`는 **지니/엔트로피** 난관 카피, `instructor.cocreation`은 **분산/표준오차** 카피, 일부 evidence는 **표준오차**. 이대로 Cut 1→Cut 3 전환하면 회장 즉시 간파.
**락**: incident = `w7-lec2-gini-22pct`. 지니/엔트로피, 22% 구간, 42% 정지/반복, 2주 후 outcome 수치 — 모든 라우트에서 동일.

### B. **State 모델 분리** — `cut` ≠ `workflowStep`
- `cut` = 발표 스크립트 위치 (1~5)
- `workflowStep` = 제품 워크플로 위치 (`lecture.struggle` / `dashboard.decision` / `cocreation.input|variant|publish|effect` / `classhealth.policy`)
- Cut 3 안에 step1·step2·step3·step4가 모두 흐른다. 한 축으로 묶을 수 없음.

### C. **`timeWarp` → `phase`**
이름이 연출 장치처럼 들림. 실제 데이터 상태를 고르는 축이므로 `phase: baseline | drafting | published | after2w | policyUpdated` 가 정확.

### D. **`FOCUS_CONTEXT` shape 변경은 adapter로 보호**
기존 `focusModeDock()`이 flat object를 기대. 직접 dual-key shape로 바꾸면 dock이 즉시 깨짐.
**해법**: `getFocusContext(routeKey, targetId)` getter를 먼저 도입. focusModeDock은 항상 getter를 거치게. shape 전환은 점진적.

### E. **Stale targetId on route transition**
`seg-22pct`로 dashboard 가면 fallback이 틀어짐. **각 컷 전환 시 `targetId`를 그 라우트의 primary spine target으로 명시 설정**해야 함.

### F. **Cut 5는 단순 CTA 아닌 state change로 끝**
`next-semester-policy` 클릭 → 카드 상태가 `2026 가을 Course Blueprint에 반영됨`으로 flip + Evidence-to-Policy trace의 마지막 노드 활성. 이게 없으면 "보고서에 저장" 정도로 약화.

### G. **Privacy framing**
Cut 2 persona switch CTA = "교수자로 전환" ❌ → "**같은 패턴을 교수자 집계에서 보기**" ✅ + dashboard 첫 줄 `W7/Lec2 · 22% · 집계 신호 · 개인 식별 없음` ribbon 고정.

### H. **추가 시각 컴포넌트 2종**
원래 4종 (heatmap/priority strip/uncertainty/uplift)에 추가:
1. **Incident Ribbon** — 모든 라우트 상단 띠. spine 추적 감각의 기반.
2. **Evidence-to-Policy Trace** — Cut 5의 5노드 SVG timeline (`Detected → Decided → Published → Measured → Policy updated`). 폐루프 결말 강도 결정.

---

## 1. 락된 incident 데이터 (구현 시 `INCIDENTS` 상수에서 단일 공급)

```
incidentId: 'w7-lec2-gini-22pct'
강의: W7 / Lec2 (의사결정 트리)
난관 개념: 지니 불순도와 엔트로피의 해석 혼동
영상 위치: 22% 구간 (≈ 18:12 부근)
동료 신호: 정지/반복 42% · 표본 신뢰도 82%
선수 개념 공백: 엔트로피 정의
질문 클러스터: "지니 vs 엔트로피 차이"
Co-Creation 배포: 2026-04-10
효과 측정: 2026-04-24 (2주 후)
Primary outcome: 재시청률 -22% [CI -32, -12]
Secondary: 확인문제 정답률 +8~+12%p
Overlap: 0.71 · Regret: 0건
다음 학기 정책 반영처: 2026 가을 Course Blueprint
```

이 모든 수치·날짜·개념명은 **사전 baked**. 어디에도 RNG·`Date()`·`setInterval` 사용 금지.

---

## 2. 7개 Spine Target + 보조 Target 인벤토리 (Codex 라운드 2 결과 기준 최종)

### 2-A. 7 Spine Targets (필수 노드)

| # | Target ID | 라우트 | 워크플로 | 페이즈 |
|---:|---|---|---|---|
| 1 | `seg-22pct` | `student.lecture` | `lecture.struggle` | `baseline` |
| 2 | `decision-w7-cocreation` | `instructor.dashboard` | `dashboard.decision` | `baseline` |
| 3 | `step1-input` | `instructor.cocreation` | `cocreation.input` | `drafting` |
| 4 | `step2-selection-rationale` | `instructor.cocreation` | `cocreation.variant` | `drafting` |
| 5 | `step4-ab-settings` | `instructor.cocreation` | `cocreation.publish` | `published` |
| 6 | `step5-effect` | `instructor.cocreation` | `cocreation.effect` | `after2w` |
| 7 | `next-semester-policy` | `instructor.classhealth` | `classhealth.policy` | `policyUpdated` |

### 2-B. 보조 Targets (라우트 내 풍성도, spine 외)

- `student.lecture`: `quick-review-5min`, `confirm-q-2`, `peer-struggle-cluster`, `metacog-check-3`, `prereq-entropy` (전용 카드 추가)
- `instructor.dashboard`: `priority-strip-w7` (decision-w7-cocreation의 strip alias), `question-trend-gini`, `cohort-pattern-w7`, `decision-grading-uncertain-8`, `decision-intervention-6`
- `instructor.cocreation`: `step2-variant-a/b/c` (3종), `step3-governance-gates`, `measurement-plan`
- `instructor.classhealth`: `clo-3-mastery-trend`, `impact-ledger-entry`, `policy-memo-draft`
- `student.dashboard` (epilogue): `learning-receipt`, `recovered-segment`, `path-update`

---

## 3. 5-Cut 데모 스크립트 (최종 시간표 — Codex 추천 적용)

| Cut | 시간 | 라우트 / phase | 핵심 동작 | 다음 컷 트리거 |
|---|---:|---|---|---|
| 1 | 0:00–0:45 | `student.lecture` / `baseline` | 22% marker 또는 heatmap spike 클릭 → `seg-22pct` 활성. Focus Dock = 지니/엔트로피 정의 난관 + Quick Review + 확인문제 계획. | "교수자 집계에서 보기" |
| 2 | 0:45–1:25 | `instructor.dashboard` / `baseline` | Incident Ribbon 따라옴. priority strip #1 chip = `priority-strip-w7` (alias). Decision Card #1 클릭 → `decision-w7-cocreation` Focus Dock = "W7 자료 개선 결정" | "Co-Creation에서 보완" |
| 3 | 1:25–2:45 | `instructor.cocreation` / `drafting` | step1 자동 입력 → step2 variant 3종 CI 비교 → `step2-selection-rationale` 활성 → step3 governance pass tag → step4 승인 후 공개 (AB on) | "2주 후 결과 보기" |
| 4 | 2:45–3:35 | `instructor.cocreation` / `after2w` | step5 phase = `after2w`. Uplift Comparison 시각: -22% [CI -32, -12], regret 0건. selected vs counterfactual variant 비교. | "클래스 영향 보기" |
| 5 | 3:35–4:30 | `instructor.classhealth` / `policyUpdated` | CLO-3 sparkline 개선. Impact Ledger entry. `next-semester-policy` 클릭 → 버튼 상태 flip "2026 가을 Course Blueprint에 반영됨" + Evidence-to-Policy trace 마지막 노드 활성. | "폐루프 완료" |

5분 버전에서만 epilogue (Cut 5 뒤 +15~20초): `student.dashboard` → `learning-receipt`. 학생에게는 정책 메모가 아니라 회복된 학습 경로만 보임.

---

## 4. State 모델 (확정)

```js
const state = {
  persona: 'student',
  page: 'lecture',
  navCollapsed: false,
  expandedGroups: new Set(['오늘']),
  // ── 신규 ──
  demo: {
    incidentId: 'w7-lec2-gini-22pct',
    cut: 1,
    workflowStep: 'lecture.struggle',
    targetId: 'seg-22pct',
    phase: 'baseline',
    selectedVariantId: null
  }
};
```

`openAiContext(targetId?)` 시그니처:
```js
function openAiContext(targetId){
  if(targetId) state.demo.targetId = targetId;
  if(!state.navCollapsed){
    state.navCollapsed = true;
    syncShellMode();
    renderNav();
  }
  renderPage();
}
```

`getFocusContext(routeKey, targetId)` adapter:
```js
function getFocusContext(routeKey, targetId){
  const bucket = FOCUS_CONTEXT[routeKey];
  if(!bucket) return fallbackFocusContext();
  if(bucket.targets && targetId && bucket.targets[targetId]){
    return bucket.targets[targetId];
  }
  return bucket.default || bucket;
}
```

`focusModeDock()`은 직접 `FOCUS_CONTEXT[key]`를 읽지 않고 항상 getter 경유.

라우트 전환 시 stale target 방지: `goWithDemo(page, primaryTarget, workflowStep, phase)` 헬퍼로 한 번에 세팅. 일반 `go(id)`는 데모 외 네비게이션용으로 보존.

---

## 5. Plan 모드에 가져갈 5대 결정 (Codex 결론 그대로)

1. **Incident lock** = `w7-lec2-gini-22pct`. `INCIDENTS` 상수 단일 공급.
2. **7 Spine Targets** 고정 (§2-A 표).
3. **State 분리** — `cut` + `workflowStep` + `phase`. `timeWarp` 폐기.
4. **`FOCUS_CONTEXT` getter 도입** — 기존 flat shape 점진 마이그레이션.
5. **Cut 5 = policy update state change** — 단순 CTA 금지.

---

## 6. 시각 컴포넌트 6종 최종 (4 → 6 확장)

| # | 컴포넌트 | 라우트/위치 | 데이터 |
|---|---|---|---|
| 1 | Incident Ribbon | 모든 라우트 상단 (지속 표시) | `W7/Lec2 · 22% · Gini/Entropy · 집계 신호 · 개인 식별 없음` |
| 2 | Struggle Heatmap | `student.lecture` aside top | 0~100% × 정지/되감기/북마크/질문 빈도. 22% spike. |
| 3 | Priority Strip | `instructor.dashboard` 상단 | #1 W7 자료 개선 · -18~-26% · conf 0.78 · 6분 · #2 채점 8건 · #3 개입 6건 |
| 4 | Uncertainty Distribution | `instructor.cocreation` step2 | variant별 95% CI bar + overlap badge |
| 5 | Uplift Comparison | `instructor.cocreation` step5 | baseline / 배포 후 2주 / selected / counterfactual |
| 6 | Evidence-to-Policy Trace | `instructor.classhealth` | 5노드 timeline: Detected → Decided → Published → Measured → Policy updated |

모든 시각 = **baked SVG**. RNG·setInterval·Date() 금지. SVG defs id에는 라우트별 prefix.

---

## 7. 락 위반 위험 12종 (plan 모드에서 매 단계 점검)

Codex가 추가한 위험들 + Claude의 5종을 합한 최종 체크리스트.

1. `openAiContext()` idempotent-open 계약 보존 (시그니처 확장만, 닫힘 분기 없음)
2. `state.navCollapsed` 단일 진실원 보존 (`state.demo.*`는 별도 namespace)
3. 16 nav items visible 유지
4. Round-2 락 copy 덮어쓰기 금지 (Focus Dock target copy만 확장)
5. 회화형 Companion 위치 고정 (`student.lecture` + `instructor.cocreation`만)
6. Stale targetId 방지 (`goWithDemo()` 헬퍼)
7. `FOCUS_CONTEXT` shape 변경은 getter adapter 후 점진 전환
8. `INCIDENTS` 상수 단일 공급 (개념·수치·날짜 모두 한 곳)
9. Privacy ribbon 고정 (`개인 식별 없음`)
10. `.ai-badge` 글로벌 capture handler — `data-ai-target` 우선, inline click 중복 방지
11. demo keyboard shortcut (1~5) — input/textarea/contenteditable guard
12. SVG defs id 충돌 방지 — 라우트별 prefix 또는 inline fill
13. baked SVG, baked dates — RNG/setInterval/Date() 절대 금지
14. No load-bearing tooltips — 모든 핵심 라벨은 화면 상시 표시

---

## 8. 다음 단계

Plan 모드 진입 → 위 8개 절을 기반으로 단계별 구현 plan 제시 → 사용자 승인 → 구현 라운드 시작.

## 부록 — 참조

- `review/_claude_to_codex_upgrade_brief.md` (Round 1 브리프)
- `review/_codex_upgrade_proposal.md` (Round 1 codex 응답)
- `review/_claude_codex_synthesis.md` (Round 1 통합)
- `review/_claude_to_codex_round2_targets.md` (Round 2 브리프)
- `review/_codex_round2_targets_response.md` (Round 2 codex 응답)
