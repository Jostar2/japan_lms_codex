# Claude → Codex Round 2 · 타깃 ID 인벤토리 + 데모 스크립트 확정

> 사용자 결정: §1 합의 그대로 진행. **Target-aware AI Context를 중심 메커니즘**으로 못박음.
> "AI가 이 항목을 보고 있다"는 체감을 만들어내야 함.
> 다음 단계 = Claude가 plan 모드로 들어가 완벽한 구현 계획을 세움. 그 전에 너의 라운드 2 협력 필요.

---

## 1. 라운드 2의 목적

Direction을 잡았으니, 이제 **무엇을 정확히 만들지**를 못박는다. plan 모드 진입 전에:

1. **타깃 ID 인벤토리** — S01 폐루프 4~5개 라우트 각각에서 **클릭 가능한 AI 타깃**을 모두 enumerate. 각 타깃마다 Focus Dock이 뭐로 바뀌어야 하는지.
2. **5-컷 데모 스크립트** — 회장이 보는 4~5분짜리 클릭 시퀀스. 컷마다 시작 라우트 / 클릭 객체 / Focus Dock 변화 / 시각 강조 / 다음 컷 트리거.
3. **시각 컴포넌트 4종 배치** — heatmap (lecture), priority strip (dashboard), uncertainty distribution (grading), uplift comparison (cocreation). 각각 어디에, 어떤 형태로, 어떤 데이터로.
4. **State 모델** — `incident`/`step`/`targetId` 3축이 JS state에서 어떻게 표현되어야 하는가.
5. **락 위반 위험 점검** — target-aware 도입이 기존 락 (`openAiContext()` idempotent, `state.navCollapsed` 단일 진실원, 16 nav items, Round-2 copy)과 충돌할 지점.

---

## 2. Claude 잠정안 — 너가 검토·반박·확장할 것

### 2-1. 타깃 ID 인벤토리 (5 라우트)

#### Route A. `student.lecture` (시연 시작점)
| Target ID | 가시 위치 | Focus Dock 변화 |
|---|---|---|
| `seg-22pct` | 영상 progress bar 22% 마커 + 동료 분포 heatmap | "지니 불순도 정의에서 막힘 가능성 높음 · 5분 Quick Review 권장" |
| `prereq-entropy` | 선수 개념 카드 | "엔트로피 문항 오답 · 우선 점검" |
| `peer-bookmark-cluster` | 정의 구간 북마크 표시 | "동료 42%가 같은 구간에서 정지" |
| `confirm-q-2` | 영상 종료 후 2문항 카드 | "확인 문제로 막힘 원인 갱신 예정" |

#### Route B. `instructor.dashboard` (라우트 전환 후 첫 화면)
| Target ID | 가시 위치 | Focus Dock 변화 |
|---|---|---|
| `decision-w7-cocreation` ★ | 결정 큐 1번 카드 (priority strip top) | "W7 자료 개선 결정 · 22% 구간 보완" — **spine 연결점** |
| `decision-grading-uncertain-8` | 결정 큐 2번 카드 | "채점 불확실 8건 검토 시작" |
| `decision-intervention-6` | 결정 큐 3번 카드 | "개입 메시지 6건 검토" |
| `cohort-pattern-w7` | 우측 cohort 카드 | "W7/Lec2 재시청 급증 · 클래스 단위 패턴" |

#### Route C. `instructor.cocreation` (decision-w7 클릭 → 진입)
| Target ID | 가시 위치 | Focus Dock 변화 |
|---|---|---|
| `step1-input` | 1단계: 난관 구간 입력 | "감지된 22% 구간 + 원인 추정 (분산 개념 혼동)" |
| `step2-variant-a` | 2단계: 비유형 초안 | "비유 기반 설명 · novelty 0.62" |
| `step2-variant-b` | 2단계: 예제형 초안 | "코드 예제 추가 · novelty 0.71" |
| `step2-variant-c` | 2단계: 시각화형 초안 | "히트맵 시각화 · novelty 0.58" |
| `step3-edit` | 3단계: 편집 | "교수자 어조 보정 · 敬語 です・ます 톤" |
| `step4-publish` | 4단계: 승인 후 공개 | "AB 테스트 on · 2주 후 재평가" |
| `step5-effect` ★ | 5단계: 2주 후 효과 검증 | "재시청률 -22% [-32, -12], overlap 0.71, regret 0건" — **결말 1차** |

#### Route D. `instructor.classhealth` (step5에서 자연 진입)
| Target ID | 가시 위치 | Focus Dock 변화 |
|---|---|---|
| `clo-3-mastery-trend` | CLO-3 sparkline | "CLO-3 정답률 +6%p · 2주 사전등록 outcome" |
| `next-semester-policy` ★ | 학기 메모 보내기 CTA | "다음 학기 설계에 W7 보완 전략 자동 반영" — **결말 2차 (정책 갱신)** |

#### Route E. `student.dashboard` (선택적 학생 결말)
| Target ID | 가시 위치 | Focus Dock 변화 |
|---|---|---|
| `recovered-segment` | 막혔던 구간 회복 알림 | "W7/Lec2 22% 구간 통과 · 신뢰도 81%" |
| `path-update` | AI 추천 경로 갱신 | "다음 주 머신러닝 응용으로 자연 연결" |

★ = 시연 핵심 spine 노드.

### 2-2. 5-컷 데모 스크립트 (4~5분)

| 컷 | 시간 | 라우트 | 클릭 → 결과 |
|---|---:|---|---|
| Cut 1 | 0:00–0:50 | `student.lecture` | 영상 progress 22% 마커에서 멈춤. 자동 강조 → `seg-22pct` 활성. Focus Dock = "지니 불순도 정의에서 막힘". heatmap에 동료 분포 표시. |
| Cut 2 | 0:50–1:30 | persona switch → `instructor.dashboard` | 같은 incident가 결정 큐 1번 카드에 등장. `decision-w7-cocreation` 활성. Focus Dock = "W7 자료 개선 결정". 클릭 → cocreation 진입. |
| Cut 3 | 1:30–2:45 | `instructor.cocreation` | step1 입력 자동 채움 → step2 variant 3종 비교 (uplift CI 표시) → 변형 1개 선택 → step3 편집 (敬語 톤 보정) → step4 승인 후 공개. |
| Cut 4 | 2:45–3:45 | 같은 라우트 step5 | "2주 후" 시간 점프 → step5 effect panel: 재시청률 -22% [CI -32, -12], regret 0건. uplift comparison 시각. |
| Cut 5 | 3:45–4:30 | `instructor.classhealth` | CLO-3 sparkline 변화 → `next-semester-policy` 카드 → "다음 학기 설계 메모로 보내기" 클릭. 폐루프 완료. |

각 컷의 끝에 다음 컷 트리거가 화면에 보임 (`다음` 버튼 또는 키보드 1·2·3·4·5).

### 2-3. 시각 컴포넌트 4종 배치

| 컴포넌트 | 라우트 | 데이터 | 형태 |
|---|---|---|---|
| Struggle Heatmap | `student.lecture` aside top | 영상 0~100% × 동료 정지 빈도 | 가로 100분할 bar, 22% 구간 spike |
| Priority Strip | `instructor.dashboard` 상단 | 결정 3건 우선순위 + 신뢰도 | 좌우 정렬 chip strip |
| Uncertainty Distribution | `instructor.cocreation` step2 (variant 비교) + `instructor.grading` aside | 각 변형의 expected uplift posterior | violin or 95% CI bar |
| Uplift Comparison | `instructor.cocreation` step5 | 변형별 effect delta + overlap | 가로 막대 + CI whisker |

모든 시각은 **사전 baked SVG** (RNG·setInterval 금지). 데모 컷 전환 시 **사전 정의 state**로 전환.

### 2-4. State 모델 (잠정)

```js
state = {
  persona,          // 'student' | 'instructor' (기존)
  page,             // 라우트 ID (기존)
  navCollapsed,     // 단일 진실원 (기존, 유지)
  expandedGroups,   // SNB 그룹 collapse (기존, 유지)
  // ── 신규 ──
  demo: {
    incidentId,     // 'w7-lec2-22pct'
    cut,            // 1..5
    targetId,       // 현재 활성 타깃 (예: 'seg-22pct')
    timeWarp,       // 'now' | 'after-2w' (step5 시간 점프)
  }
}
```

`openAiContext(targetId?)`로 시그니처 확장. 인자 없으면 기존 동작 (페이지 단위 idempotent open). 인자 있으면 `state.demo.targetId` 갱신 + Focus Dock 재렌더.

`FOCUS_CONTEXT`는 dual-keyed:
```js
FOCUS_CONTEXT = {
  'student.lecture': {
    default: { ... },                     // 기존 페이지 단위 fallback
    'seg-22pct': { judgment, action, ... },
    'prereq-entropy': { ... },
    ...
  },
  ...
}
```

### 2-5. 락 위반 위험 점검 (Claude 잠정 식별)

| 락 항목 | 위험 | 대응 |
|---|---|---|
| `openAiContext()` idempotent-open | 시그니처 확장 시 닫힘 동작이 들어가지 않도록 주의 | targetId 인자만 추가, 닫힘 분기 없음 보존 |
| `state.navCollapsed` 단일 진실원 | `state.demo.targetId` 신규는 별도 namespace, navCollapsed에 영향 없음 | 같은 함수 안에서 두 state를 따로 다룸 |
| 16 nav items visible | 데모 spine이 4 라우트만 사용해도 나머지 12개 navi 모두 visible 유지 | 시연 중에도 SNB 그대로 |
| Round-2 락 카피 | step1~5 라벨, "確定 가능 24·검토 필수 8" 등 그대로 | 새 카피는 Focus Dock 변형 안에만 추가 |
| 회화형 Companion 위치 | dashboard에 conversational 추가 금지 | dashboard는 xAI summary만 |
| No load-bearing tooltips | Cut 트리거 안내가 hover에 의존하지 않게 | 화면 표시 + 키보드 단축키 동시 노출 |

---

## 3. 너의 임무 (라운드 2)

1. **§2-1 타깃 인벤토리**에 빠진 타깃, 잘못 잡은 타깃, 우선순위 조정을 명시. 라우트별 추가/삭제 후보.
2. **§2-2 데모 스크립트**의 5컷 시간 배분·트리거·라우트 순서를 검토. Cut 2의 persona switch가 자연스러운가? Cut 5 결말이 강력한가?
3. **§2-3 시각 4종**의 배치·형태·데이터 정합성 점검. 추가/대체할 컴포넌트?
4. **§2-4 state 모델**의 구조적 결함 식별. `timeWarp` namespace가 적절한가? FOCUS_CONTEXT dual-key가 기존 코드 흐름을 깨지 않는가?
5. **§2-5 락 위반 점검**에 빠진 위험 추가.
6. (선택) S01 외 보조 장면 (S07 Career, S09 Grading)이 이 spine에 어떻게 1분 안에 끼어들 수 있는지 짧게 의견.

산출 파일: `review/_codex_round2_targets_response.md` (한국어, 마크다운, 3~5 페이지).

다른 코드 수정 금지. 이 라운드 끝나면 Claude가 plan 모드로 진입한다.

---

## 4. 형식

```
# Codex Round 2 · 타깃 인벤토리 응답

## 1. §2-1 타깃 인벤토리 평가
   1-A 라우트별 동의/조정/추가 (5 라우트 각각)
## 2. §2-2 데모 스크립트 평가
   2-A 5컷 시간·트리거 검토
   2-B 추가 권장 컷/생략 권장 컷
## 3. §2-3 시각 4종 배치 평가
## 4. §2-4 state 모델 평가
   4-A 구조적 결함
   4-B 대안 제안 (있다면)
## 5. §2-5 락 위반 추가 위험
## 6. (선택) S07/S09 끼워넣기
## 7. plan 모드로 가져갈 핵심 결정 사항 요약 (3~5개)
```
