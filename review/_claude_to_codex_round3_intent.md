# Claude → Codex Round 3 · 의도 기반 재고도화 (Architectural)

> 사용자 결정: Round 2 까지 합의했던 **5-cut 닫힌 루프 데모 스파인**은 일단 비활성화 (cold disable). 코드는 남겨두되 트리거를 끊었다 (`goCut`, `incidentRibbon`, `renderDemoRail`, 키보드 1~5, `goWithDemo`의 cut/phase 인자 처리, `commitPolicyUpdate`).
> 사용자가 정말 원했던 것은 *"5개 컷으로 한 사건을 묶기"* 가 아니라:
> **"어떤 시나리오로 어떤 항목/버튼을 누르면서 설명하면 'AI가 운영에 실제 개입한다'는 체감을 회장에게 줄 수 있을까?"**
> 이 라운드는 그 질문을 **architectural 결정** 3개로 좁혀서 합의한다.
> UI 기계적 디테일 (badge 여백, 버튼 테두리, "AI" 단어 노출, 한 줄 메트릭 분리) 은 이 라운드 밖에서 별도 패스로 처리한다 — codex에게 묻지 않는다.

---

## 0. 라운드 3 목적 (3가지만)

1. **Incident-to-Surface mapping** — 같은 W7/Lec2 사건이 dashboard 상황 카드 + Priority Strip + Hero 결정 카드 3중 노출. 이게 사용자 불만의 핵심 ("디자인이 너무 AI로 만든 것 같다"). 한 incident 가 한 화면에 한 번만 살아야 하는가, 세 화면 세 표현이 정당한가.
2. **Lecture 시점 기반 동적 AI 패널 (확정 시나리오)** — 영상 재생 중 특정 시점(예: 22% 통과)에 AI 패널이 *클릭 없이* 자동 갱신. 사용자가 명시적으로 "이건 확정"이라 함. 구현 primitive 선택이 critical: `<video>` `timeupdate`? scripted `setTimeout` cue list? clickable progress markers (time-advance simulation)? — 발표 안정성 + 데모 효과 + `next_steps_final.md` 라이브 데모 금지 원칙을 동시에 만족하는 것은?
3. **의문 컴포넌트 살리기/죽이기** — `priorityStrip`, `struggleHeatmap`, `cloSparkline`, `evidenceToPolicyTrace`, `uncertaintyDistribution`, `upliftComparison` 6종 baked SVG. 사용자가 `priorityStrip`을 직접 비판 ("디자인이 너무 AI로 만든 것 같다"). 나머지 5종도 같은 시각 언어 risk. 어느 것은 살리고, 어느 것은 죽이고, 어느 것은 redesign 인가.

---

## 1. 사용자 발언 원본 (정리 없는 원문, 컨텍스트)

> 1. "데모 스파인은 기능은 좋은데 지금은 주석처리 했으면 좋겠어. 내가 필요한거는 이러 이러한 시나리오로 이런 버튼이나 항목들을 누르면서 설명하면 AI 개입을 효과적으로 보여줄 수 있을것이다. 라는걸 codex랑 토론하고 수정/보완 및 고도화(추가도 고려) 하라는거였어."
>
> 2. "한 가지로 말하는게 아니라 여러가지를 말할거야"
>
> 3. **(Dashboard 상황 카드 3개 캡처)** "6명 학생 이탈 위험 상승 / 과제 24건 AI 초안 평가 대기 / 다음 주 루브릭 AI 준비 완료" — "이거 뱃지 좌우 여백이 너무 없어서 불안정해보여"
>
> 4. **(Priority Strip 3개 캡처)** "#1 자료 개선 / #2 채점 검토 / #3 개입 비교" 메트릭 + confidence + 소요시간 — "이거 디자인 너무 AI 로 만든거같아."
>
> 5. **(Hero 오늘의 결정 3개 캡처)** "AI 분석 · 우선순위 #1 / AI 초안 / AI 초안" — "이것도 마찬가지고"
>
> 6. "22% 구간 정지/반복 42% (집계 신호 · 개인 식별 없음) · 예상 재시청률 -18~-26% · confidence 0.78 · 6분 소요 이것도 말이 너무 길어 1줄씩만 보이는게 더 깔끔해. 우리가 콘텐츠적 내용을 막 어필할 필요는 없잖아."
>
> 7. "AI 근거 보기 호버하기전에는 버튼인지도 몰라 테두리가 없어서. 테두리 없는거 학습 수강에서 좋아요 싫어요 버튼도 마찬가지야"
>
> 8. **(확정 시나리오)** "AI 패널이 클릭하므로써 바뀌기도 하지만, 학습 수강에서는 재생되면서 어떤 특정 시점을 지날 때 동적으로 변하는 걸 보여줄거야. 이건 확정 시나리오니까 고도화해"
>
> 9. "콘텐츠 영역과 AI 패널에 있는 모든 텍스트와 기능들이 어떠한 목적이나 의도를 가지고 있어야해. 그것들을 나한테 모두 설명하거나 xAI_LMS_Design_Spec.html 여기에 설명되어야 하고"
>
> 10. "위에 지적한 내용들을 딱 그 메뉴에서만 하는게 아니라 다른 화면들에서도 비슷한 내용은 알아서 잘 수정해해"

핵심 압축: **"AI" 단어/시각 언어가 과잉 → 자연스럽게 줄여라. 하지만 'AI가 보고 있다' 체감은 강해져야 한다 (특히 lecture 시점 기반).** — 이 두 요구는 모순처럼 보이지만 사실 같은 것이다. AI 라벨링이 약해질수록 *자동 갱신* 하나하나가 더 강하게 느껴진다.

---

## 2. 현재 프로토타입 상태 (round 3 cold disable 후)

### 2-A. 살아있는 인프라 (codex 검토 없이 유지)
- `INCIDENTS['w7-lec2-gini-22pct']` 단일 진실원 (개념·수치·날짜)
- `FOCUS_CONTEXT[routeKey].targets[targetId]` dual-key shape (4 spine 라우트)
- `getFocusContext(routeKey, targetId)` adapter (flat shape 12 라우트와 호환)
- `openAiContext(targetId)` 시그니처 (idempotent-open 보존)
- `state.demo.targetId` namespace + global `[data-ai-target]` capture handler
- 39개 `data-ai-target` hooks (4 spine 라우트)

### 2-B. Cold-disabled (codex 토론 결과에 따라 부활/완전제거 결정)
- `goCut(n)`, `DEMO_CUTS`, `renderDemoRail`, `resetDemo`, `commitPolicyUpdate`
- demo-rail HTML
- 키보드 1~5 핸들러
- `goWithDemo`의 `cut`/`phase`/`openFocus` 인자 처리
- `incidentRibbon()` 호출 (renderPage 안)
- cocreation "시연: 2주 후 결과 보기" 버튼
- "다음 학기 설계 메모로 보내기" → 단순 `showToast()` 로 강등

### 2-C. 살아있지만 codex 토론 대상 (3번 주제)
- `priorityStrip()` — `instructor.dashboard` 상단
- `struggleHeatmap()` — `student.lecture` aside top
- `cloSparkline()` — `instructor.classhealth` (CLO-3)
- `evidenceToPolicyTrace()` — `instructor.classhealth` (5노드 timeline)
- `uncertaintyDistribution()` — `instructor.cocreation` step2
- `upliftComparison()` — `instructor.cocreation` step5 (현재 `phase==='after2w'` 분기 안 — 비활성)

---

## 3. Topic 1 — Incident-to-Surface Mapping

### 3-1. 현재 중복 노출 (사용자 불만의 직접 원인)

같은 W7/Lec2 incident이 `instructor.dashboard` 한 화면에 **3중 노출**:

| 표면 | 컴포넌트 | 표현 |
|---|---|---|
| 상단 띠 | Priority Strip | `#1 자료 개선 · -18~-26% · conf 0.78 · 6분` chip |
| Hero | "오늘의 결정" 카드 | `AI 분석 · 우선순위 #1` + 긴 소제목 + 메트릭 한 줄 나열 |
| 우측 (cohort) | `cohort-pattern-w7` 카드 | "W7/Lec2 재시청 급증 · 클래스 단위 패턴" |

추가로:
- `student.lecture` 의 22% 구간 영상 marker + heatmap
- `student.lecture` 푸터의 "교수자 집계에서 보기" 인터스티셜 카드 (`decision-w7-cocreation` data-ai-target)
- `instructor.cocreation` 의 step1/step2 자동 채움 + step5 effect 카드들
- `instructor.classhealth` 의 evidenceToPolicyTrace + ImpactLedger 카드 + CLO-3 sparkline + 정책 갱신 CTA

→ **하나의 사건 incident이 4 라우트, 적어도 8개 표면에서 동시 노출**.

### 3-2. 의도 (round 2 합의)
"라우트를 옮길 때 같은 사건이 따라오는 폐루프 spine" — 즉 의도된 중복.

### 3-3. 사용자가 round 3에서 뒤집은 것
"디자인이 너무 AI로 만든 것 같다" — *4 라우트 8 표면 전체*에 대한 발언이 아니라 **dashboard 한 화면 안의 priority strip + hero card 동시 노출** 에 대한 발언. 한 화면 안 중복이 'AI 풍'을 만든다는 진단.

### 3-4. 다른 두 시나리오 — 같은 사건인가 별개 사건인가?

dashboard 상황 카드 3개 (사용자 캡처):
- "6명 학생 이탈 위험 상승" — 학생군 단위 신호
- "과제 24건 AI 초안 평가 대기" — 채점 워크플로 신호
- "다음 주 루브릭 AI 준비 완료" — 자료/루브릭 워크플로 신호

priority strip 3개 (사용자 캡처):
- "#1 자료 개선 (W7 Gini/Entropy 보완)"
- "#2 채점 검토 (불확실 8건)"
- "#3 개입 비교 (메시지 6건)"

hero 결정 카드 3개:
- W7 자료 개선 (priority #1 와 동일)
- AI 채점 불확실 8건 (priority #2 와 동일)
- 학습 개입 메시지 6건 (priority #3 와 동일)

**Hero ≡ Priority Strip · 같은 데이터 두 형태로 동시 노출**.

상황 카드 3개와의 관계:
- "6명 이탈 위험" ≠ priority #1~#3 (학생군 단위 vs 워크플로 단위)
- "과제 24건 AI 초안 대기" ≈ priority #2 (채점 검토) 의 상위 풀
- "루브릭 AI 준비" ≠ priority — 미래 시점 신호 (다음 주)

→ 상황 카드와 priority/hero 가 같은 풀이 아닐 수도 있음. 상위 사건군 vs 오늘 결정해야 할 액션.

### 3-5. Claude 잠정안 (codex 검토 요청)

**선택지 A — 한 화면 한 표현 (가장 단순, 가장 사용자 발언과 일치)**
- Hero에서 "오늘의 결정 3건" 제거. Priority Strip 단독으로 살림.
- 또는 그 반대: Priority Strip 제거, Hero "오늘의 결정" 단독.
- 둘 다 메트릭은 1줄 1정보 원칙으로 단순화 (사용자 발언 #6).

**선택지 B — 상황·결정 분리 (정보 layer 명시)**
- 상단 ribbon = "오늘의 상황" (상황 카드 3개: 이탈 6명 / 채점 24 / 루브릭 준비) — 신호 layer
- Hero = "오늘 결정해야 할 것 3개" (priority/hero) — 액션 layer
- Priority Strip 컴포넌트 자체 폐기 (chip 형태가 'AI 풍'의 원인)
- 상황 카드는 더 정적·LMS-네이티브한 표현 (목록형 + 마이크로카피, 컬러 채도 낮춤)

**선택지 C — Priority Strip 잠금 (사용자 직접 비판한 것만 폐기)**
- Priority Strip 폐기
- Hero "오늘의 결정 3건" 만 살림 (단, "AI 분석" / "AI 초안" 라벨 제거 → 단순 "결정" / "초안")
- cohort-pattern-w7 카드도 hero에 흡수해서 한 줄 추가. 라우트당 incident 노출 횟수 정확히 1.

### 3-6. Codex 에게 묻는 것
1. A/B/C 중 어느 쪽이 사용자 발언 #4·#5와 가장 정합? B 가 information architecture 적으로 가장 깔끔하지만 변경 폭이 큼. C 가 가장 외과적.
2. lecture(student) ↔ dashboard(instructor) ↔ cocreation ↔ classhealth 의 incident 추적은 유지되어야 하는가? round 2 의 "spine" 가치를 완전히 폐기하면 'AI 개입의 닫힘' 자체가 사라지는데, 이를 어떻게 데모 외 자연스러운 재방문 경로로 보존하나?
3. 상황 카드 3개 (이탈 6 / 채점 24 / 루브릭 준비) — 이게 hero "오늘의 결정 3건" 에 *흡수* 되어야 하는가, *별도 layer* 인가? 셋 다 priority 와 다른 시간 축 (now / queued / next-week) 이라 분리가 정합해 보이지만 검증 필요.

---

## 4. Topic 2 — Lecture 시점 기반 동적 AI 패널 (확정 시나리오)

### 4-1. 사용자 의도 명확함
"영상 재생 중 22% 시점을 *지나갈 때* AI 패널이 클릭 없이 자동 변함" — '클릭 없이' 가 핵심. 회장에게 보여줄 핵심 모멘트.

### 4-2. 충돌하는 제약
- **`next_steps_final.md`** 는 라이브 데모/실시간 갱신 절대 금지. RNG·setInterval·Date() 모두 금지.
- **사용자는 자동 갱신을 원함.**

이 둘이 모순처럼 보이지만 해결책은 "*사전 정의된 시점에서의 baked-state 전환*". 즉 시간이 흐르는 게 아니라 **사전 cue 가 발화하는 것**.

### 4-3. 구현 primitive 선택지

**선택지 P1 — `<video> timeupdate` 이벤트**
- 실제 영상 element 가 있어야 함. mock 영상 ≠ 실제 학습 콘텐츠.
- `timeupdate` 는 250ms~ 단위로 발화. cue 시점 (예: 18.2초 = 22%) 통과 감지 후 state 전환.
- 장점: 가장 자연스러움 — 영상이 진짜 재생되는 듯.
- 단점: 영상 파일 호스팅, 발표장 네트워크 의존, 영상 컨트롤(시크/재시작) UX 처리 부담.

**선택지 P2 — Scripted `setTimeout` cue list**
- 가짜 progress bar + 진행 시간 카운터를 0초부터 setTimeout 으로 진척.
- cue 시점 (예: 5초 = 22%) 도달 시 state 전환.
- `next_steps_final.md` 의 "setInterval 금지" 와 충돌. setTimeout 도 같은 카테고리로 보면 위반.
- 발표 시 한번 트리거 후 자동 진행. 회장 시선 끌기 좋음.
- 단점: 정책 위반. 시연 중 일시정지/되감기 불가.

**선택지 P3 — Clickable progress markers (time-advance simulation)**
- 영상 progress bar 위에 `[0% 시작 / 22% 난관 / 48% 정의 / 73% 응용 / 100% 끝]` 5개 마커.
- 각 마커 클릭 → progress bar 가 시각적으로 그 위치까지 차고, AI 패널 state 전환.
- 클릭으로 time advance 흉내. 자동성은 약하지만 *제어 가능*.
- `next_steps_final.md` 정책 100% 부합.
- 단점: 사용자 발언 "*재생되면서* 특정 시점을 지날 때" 와 살짝 어긋남 — 클릭이 곧 재생 시뮬레이션.

**선택지 P4 — Hybrid: P1 + P3**
- 실제 `<video>` element + `timeupdate` 자동 cue 발화.
- 동시에 progress bar 마커 클릭으로 manual time-jump 가능.
- 발표자가 "재생" 클릭 → 22% 통과 시점에 자동 발화. 만약 시간이 모자라면 마커로 점프.
- 단점: 영상 파일 의존. 영상 콘텐츠 만들기 부담. 발표 안정성 (네트워크 등).

**선택지 P5 — Hybrid: P2 정책 완화 + P3**
- "사전 정의된 1회성 cue list" 라는 것을 명시적으로 정책 예외 처리.
- setTimeout 1회 발화는 RNG/실시간 갱신과 다름 → `next_steps_final.md` 보강.
- progress bar 는 설치된 순간부터 자동 진행 (단, 발표자 'pause' 가능).
- 보강 정책 + 사용자 의도 모두 충족.

### 4-4. Claude 잠정 추천
**P3 (clickable markers) + P4 의 가짜 progress bar 시각** 의 hybrid:
- 영상 placeholder 안에 가짜 progress bar (정적 SVG, fill 비율은 state 기반).
- 마커 클릭 = time advance 시뮬레이션. fill 애니메이션 (CSS transition) 으로 "재생되어 도달" 연출.
- 자동성은 약하지만 발표자 제어 가능. 정책 위반 0.

근데 사용자 발언 ("재생되면서 자동으로") 과 P3 의 "클릭이 곧 재생" 사이 미세한 간극이 있다. **회장이 "이거 클릭으로 시뮬한 거지?" 라고 물으면 무슨 말로 답할 것인가** 가 진짜 시험.

### 4-5. Codex 에게 묻는 것
1. P1~P5 중 어느 것이 발표 안정성 + 사용자 의도 + 라이브 데모 금지 정책 셋 다 만족?
2. P3 가 정책 부합도 최고지만 사용자 의도 부합도가 낮음. P5 (정책 보강) 가 합리적인가?
3. lecture 페이지의 **AI 패널 변화 cue 점수 (시점 → 콘텐츠) 표** 를 같이 잡아주길 — 0% (intro) / 22% (Gini 난관) / 48% (정의 경계) / 73% (응용 사례) / 100% (회복 권장) 5단계로 잠정 잡았는데 추가/조정할 cue 가 있는지.
4. 이 cue 발화 시 Focus Dock 외 *다른 장소* (heatmap 마커 강조, transcript scroll, 동료 신호 chip 갱신 등) 도 동시 갱신해야 하는가? 동시 갱신이 강할수록 'AI 보고 있다' 체감 강함. 너무 많으면 신호가 산만해짐.

---

## 5. Topic 3 — 의문 컴포넌트 6종 처리

| # | 컴포넌트 | 위치 | 사용자 직접 비판? | Claude 의견 |
|---|---|---|---|---|
| 1 | `priorityStrip()` | dashboard 상단 | **예 ("AI 풍")** | **폐기**. hero "오늘의 결정 3건" 으로 흡수. |
| 2 | `struggleHeatmap()` | lecture aside | 아니오 | **유지·redesign**. Topic 2 의 lecture 동적 패널과 강한 시너지. 단 시각 언어 (그라디언트 막대 형태) 는 더 차분하게. |
| 3 | `cloSparkline()` | classhealth | 아니오 | **유지**. CLO-3 mastery trend 자체는 LMS-native 차트. 시각 언어가 'AI 풍' 이라기보다 일반 분석 차트. |
| 4 | `evidenceToPolicyTrace()` | classhealth | 아니오 | **유지하되 조건부**. round 2 폐루프 결말의 핵심. 단 Topic 1 에서 spine 자체를 폐기하면 의미 약함. spine 보존이 결정되면 유지. |
| 5 | `uncertaintyDistribution()` | cocreation step2 | 아니오 | **유지**. variant 95% CI bar 는 의사결정 정보. AI-optional 한 시각화 (CI bar 는 AI 라벨 없어도 의미 있음). |
| 6 | `upliftComparison()` | cocreation step5 | 아니오 | **현재 비활성** (phase 분기 false). spine 결과 phase 가 살아나면 같이 살림. |

### 5-1. Codex 에게 묻는 것
1. 위 표의 Claude 의견 중 흔들림이 있는 것 (4번, 6번) 은 Topic 1 의 spine 보존 결정과 묶여 있음. spine 폐기 시 4·6 도 같이 폐기되어야 하는가, 다른 자리(dashboard, single-route 안)에 흡수 가능?
2. `priorityStrip()` 폐기는 이미 거의 결정. 그 자리 (dashboard 상단) 가 비게 됨. 무엇이 그 자리에 가야 하는가? Topic 1 선택지 B 의 "상황 ribbon" 이 후보. codex 추천?
3. `struggleHeatmap()` 의 redesign 방향 — 현재는 0~100% bucket density 가로 막대. 사용자 발언 #4 "AI 풍" 우려 적용 시 어떤 시각 언어가 더 LMS-native?
4. 4번/5번/6번 컴포넌트의 "AI" 라벨 — 현재 `AI 분석 · 우선순위 #1` 같은 ai-badge 가 컴포넌트 헤더에 붙어 있음. 사용자 발언 #5 "AI 단어 노출 과다" 적용 시 ai-badge 자체를 컴포넌트에서 떼고 컴포넌트 옆 별도 작은 표식만 남기는 게 정합?

---

## 6. 라운드 3 결과물 형식

`review/_codex_round3_intent_response.md` (한국어, 마크다운, 4~6 페이지) 에 다음을 담아주길:

```
# Codex Round 3 · 의도 기반 재고도화 응답

## 1. Topic 1 — Incident-to-Surface Mapping
   1-A 선택지 A/B/C 중 추천 + 이유
   1-B Spine 보존/폐기 결정 (round 2 가치 보존 방안)
   1-C 상황 카드 3개의 위치 (hero 흡수 vs 별도 layer)

## 2. Topic 2 — Lecture 시점 기반 동적 AI 패널
   2-A P1~P5 중 추천 + 이유
   2-B Cue 점수표 (시점 → 콘텐츠) 보강
   2-C 동시 갱신 표면 범위 (얼마나 많이, 어디까지)

## 3. Topic 3 — 의문 컴포넌트 6종 처리
   3-A 6종 표 검토 (유지/폐기/redesign 결정)
   3-B priorityStrip 자리 후속 처리
   3-C struggleHeatmap redesign 방향
   3-D ai-badge 노출 위치 정책

## 4. Topic 1·2·3 의 상호 의존성
   서로 어떤 결정이 어떤 결정을 강제하는지

## 5. Round 3 plan 모드에 가져갈 결정 사항 (3~5개)

## 6. 라운드 3 락 위반 추가 위험
   round 1·2 락 14종 + round 3 결정으로 새로 생기는 위험
```

---

## 7. 라운드 3 밖에서 처리되는 것 (codex 에게 묻지 않음)

다음은 mechanical 디테일이라 별도 패스에서 처리한다:

1. Badge 좌우 여백 부족 (사용자 발언 #3) — `padding` / `min-width` 조정.
2. 한 줄 메트릭 ` · ` 나열 → 1줄 1정보 (사용자 발언 #6). hero / priority / 모든 카드.
3. "AI" 단어 노출 줄이기 (사용자 발언 #4·#5). `AI 분석`, `AI 초안`, `AI 분석 · 효과 검증` 등 라벨 → 가능한 한 제거 또는 sparkle icon 만 남김.
4. 버튼 affordance — `AI 근거 보기`, `좋아요/싫어요` 등 테두리 추가 (사용자 발언 #7).
5. 위 4개 모두 16 라우트 일관 적용 (사용자 발언 #10).

이 5개는 codex round 3 응답 *전후 어디에서나* 진행 가능한 독립 트랙.

---

## 8. 입력 자료 (round 3 토론 시 codex 가 참조해야 할 것)

- `xAI_LMS_Prototype.html` (현재, ~4,250 lines, demo spine cold-disabled 후)
- `review/_claude_codex_synthesis.md` (round 1 합의)
- `review/_claude_codex_round2_synthesis.md` (round 2 합의 — 이번에 부분 뒤집힘)
- `review/_codex_round2_targets_response.md` (codex round 2 응답)
- `review/next_steps_final.md` § 라이브 데모 절대 금지
- `review/claude_design_brief.md` § 락 정책

---

## 9. 라운드 3 의도 한 줄 요약

"AI 라벨링은 약하게, AI 자동성은 강하게" — `priorityStrip` 같은 *말로 'AI'라고 외치는* 컴포넌트를 줄이고, lecture 영상 시점 통과 *순간 AI 패널이 스스로 변하는* 모멘트를 더 두껍게.

---

다른 코드 수정 금지. 이 라운드 끝나면 Claude 가 응답 받아 plan 모드 진입한다.
