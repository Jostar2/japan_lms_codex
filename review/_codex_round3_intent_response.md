# Codex Round 3 · 의도 기반 재고도화 응답

본 응답은 코드 변경 지시가 아니라 plan 모드에 넘길 architectural 결정이다. §1의 사용자 발언은 축약하거나 새로 번역하지 않고, 판단 근거가 필요할 때 원문 그대로만 인용한다. 이번 라운드에서 내가 유지하는 라운드 1·2 결정과 수정하는 결정은 먼저 고정한다.

| 라운드 1·2 항목 | Round 3 판정 | 이유 |
|---|---|---|
| Target-aware AI Context | 유지 | 클릭한 대상 단위로 Focus Dock이 바뀌어야 “이 항목을 보고 있다”는 감각이 생긴다. 이는 이번 lecture cue에도 필요하다. |
| 공통 incident `w7-lec2-gini-22pct` | 유지 | 지니/엔트로피, 22%, 42%, 2주 후 outcome을 하나로 묶는 단일 진실원은 여전히 맞다. |
| 폐루프 spine 가치 | 유지하되 수정 | “5-cut 데모 레일”이 아니라 자연 라우트 이동에서 같은 incident가 따라오는 제품 구조로 보존한다. |
| 5-cut 닫힌 루프 데모 스파인 | 수정/비활성 유지 | 사용자 발언 #1: "데모 스파인은 기능은 좋은데 지금은 주석처리 했으면 좋겠어. 내가 필요한거는 이러 이러한 시나리오로 이런 버튼이나 항목들을 누르면서 설명하면 AI 개입을 효과적으로 보여줄 수 있을것이다. 라는걸 codex랑 토론하고 수정/보완 및 고도화(추가도 고려) 하라는거였어." |
| Priority Strip | 수정이 아니라 폐기 | dashboard 한 화면의 중복 노출과 chip 시각 언어가 이번 라운드의 핵심 위험이다. |
| baked state / no live data | 유지 | `next_steps_final.md`의 사전 녹화·클릭 프로토타입·PNG 백업 원칙과 충돌하지 않아야 한다. |
| Cut 5 정책 반영 결말 | 유지하되 데모 레일에서 분리 | `evidenceToPolicyTrace`와 `next-semester-policy`는 폐루프 결말로 살리되, 키보드 1~5나 `goCut`에 의존하지 않는다. |

## 1. Topic 1 — Incident-to-Surface Mapping

### 1-A. 선택지 A/B/C 중 추천 + 이유

추천은 **선택지 B — 상황·결정 분리**다.

Claude 잠정안 중 B에 동의한다. 이유는 B만이 dashboard의 정보 구조를 설명 가능하게 만들기 때문이다. 현재 dashboard는 같은 화면에서 상단 hero pill, Priority Strip, “오늘의 결정” 카드, 우측 cohort 카드가 서로 다른 역할을 하는 척하지만 실제로는 일부 incident와 workflow가 겹친다. 이 상태에서는 시각 표현을 조금 다듬어도 왜 같은 정보가 여러 번 보이는지 설명하기 어렵다.

판단 근거로 삼는 사용자 발언은 원문 그대로 다음 둘이다.

> "이거 디자인 너무 AI 로 만든거같아."

> "이것도 마찬가지고"

B는 이 두 발언에 대해 가장 직접적인 구조적 답을 준다. Priority Strip을 폐기하고, dashboard를 두 층으로 나눈다.

| 층 | 역할 | 남길 표면 |
|---|---|---|
| 상황 layer | 오늘 교수자가 알아야 할 상태 신호 | 상단의 “오늘의 상황” 3개: 이탈 6명 / 채점 24건 / 다음 주 루브릭 |
| 결정 layer | 지금 실행하거나 검토해야 할 일 | “오늘의 결정” 3개: W7 자료 개선 / 채점 검토 / 개입 비교 |

A는 “한 화면 한 표현” 원칙이 명확하지만 과하게 단순하다. 상황 신호와 결정 큐를 한쪽으로 몰면 dashboard가 운영 홈으로서 가져야 할 scan 기능을 잃는다. C는 가장 외과적이지만 부족하다. Priority Strip만 없애고 Hero 카드만 남기면 “상황 3개”와 “결정 3개”의 관계가 계속 모호하고, hero 카드의 시각 언어 자체에 대한 발언 #5를 충분히 처리하지 못한다.

따라서 Round 2의 “Priority Strip + Decision Card alias” 합의는 수정한다. `priority-strip-w7` 같은 alias target은 유지할 필요가 없다. W7/Lec2 incident의 dashboard 대표 target은 `decision-w7-cocreation` 하나면 충분하다.

### 1-B. Spine 보존/폐기 결정

**Spine은 보존한다. 다만 5-cut 발표 장치로는 보존하지 않는다.**

Round 2에서 맞았던 것은 “같은 incident가 학생 화면, 교수자 dashboard, Co-Creation, classhealth에서 이어진다”는 제품적 가치다. 이번에 흔들린 것은 그 가치를 `goCut`, demo rail, 키보드 1~5, 한 화면 내 반복 노출로 표현한 방식이다. 그래서 유지/수정 경계를 다음처럼 잡는다.

| 항목 | 결정 |
|---|---|
| `INCIDENTS['w7-lec2-gini-22pct']` | 유지 |
| 7개 spine target | 유지하되 “발표 cut”이 아니라 “자연 workflow target”으로 재정의 |
| `openAiContext(targetId)`와 `getFocusContext(routeKey, targetId)` | 유지 |
| `goCut`, `renderDemoRail`, 키보드 1~5 | 비활성 유지 |
| incident의 라우트 간 추적 | 명시적 CTA와 baked state로 보존 |
| 한 화면 안 3중 노출 | 폐기 |

자연스러운 재방문 경로는 이렇게 정리한다.

1. `student.lecture`: 22% cue가 자동 발화하고 `seg-22pct` Focus Dock을 연다.
2. `student.lecture` 하단: “같은 패턴을 교수자 집계에서 보기” CTA로 instructor dashboard에 간다.
3. `instructor.dashboard`: `decision-w7-cocreation` 하나가 W7/Lec2의 dashboard 대표 표면이다.
4. `instructor.cocreation`: `step1-input` → `step2-selection-rationale` → `step4-ab-settings`가 같은 incident를 제작·승인 workflow로 바꾼다.
5. `instructor.classhealth`: `impact-ledger-entry`와 `next-semester-policy`가 결과와 정책 반영을 닫는다.

이 방식이면 Round 2의 폐루프 가치는 남고, Round 3의 “demo spine cold disable”도 유지된다.

### 1-C. 상황 카드 3개의 위치

상황 카드 3개는 hero “오늘의 결정 3건”에 흡수하지 않는다. **별도 layer**로 둔다.

이유는 세 카드의 시간 축과 의사결정 성격이 서로 다르기 때문이다. “6명 학생 이탈 위험 상승”은 학생군 상태 신호, “과제 24건 초안 평가 대기”는 처리 대기열, “다음 주 루브릭 준비 완료”는 미래 준비 상태다. 이들을 W7 자료 개선, 채점 검토, 개입 비교와 같은 카드로 합치면 dashboard의 우선순위가 아니라 섞인 알림 목록이 된다.

권장 구조는 다음이다.

| 위치 | 이름 | 성격 | 표현 |
|---|---|---|---|
| Hero 바로 아래 또는 hero 내부 하단 | 오늘의 상황 | scan 가능한 운영 상태 | 낮은 채도, 리스트형, 작은 상태 점 |
| 그 아래 main stack | 오늘의 결정 | 실행/검토 대상 | 카드형, 버튼 affordance 명확 |
| 우측 aside | 근거/질문 트렌드 | 보조 설명 | 선택된 target과 연결될 때만 강화 |

Round 2에서 dashboard의 `priorityStrip()`이 맡던 “우선순위 압축” 역할은 폐기한다. 같은 역할은 “오늘의 결정” 섹션 제목과 카드 순서로 충분히 표현한다.

## 2. Topic 2 — Lecture 시점 기반 동적 AI 패널

### 2-A. P1~P5 중 추천 + 이유

추천은 **P4 — Hybrid: `<video>` `timeupdate` + clickable progress markers**다. 단, 전제는 “로컬 baked 영상 또는 로컬 mock 영상”이다. 네트워크 영상, 원격 스트리밍, 라이브 로그는 제외한다.

사용자 발언 #8은 원문 그대로 다음이다.

> "AI 패널이 클릭하므로써 바뀌기도 하지만, 학습 수강에서는 재생되면서 어떤 특정 시점을 지날 때 동적으로 변하는 걸 보여줄거야. 이건 확정 시나리오니까 고도화해"

이 문장 때문에 P3 단독은 탈락이다. marker 클릭만으로는 “재생되면서 특정 시점을 지날 때”가 약하다. 반대로 P5는 탈락이다. `setTimeout` 예외를 정책에 새로 열면 “baked cue”와 “실시간 갱신”의 경계가 다음 라운드에서 다시 흐려진다. `next_steps_final.md`의 “라이브 데모 절대 금지”는 약화하지 않는 편이 맞다.

P4의 충돌 해결안은 다음이다.

| 제약 | 해결 |
|---|---|
| 발표장은 라이브 데모 금지 | 본 발표의 기본은 사전 녹화 영상으로 둔다. |
| Q&A에서 직접 보여줘야 함 | 클릭 프로토타입 모드로 로컬 `<video>`와 marker를 사용한다. |
| 사용자는 자동 갱신을 확정함 | `timeupdate`가 22%, 48%, 73%, 100% cue 통과를 감지해 panel state를 바꾼다. |
| 발표 안정성이 필요함 | progress marker 클릭이 같은 cue state로 즉시 점프하는 백업 경로다. |
| live data 오해를 피해야 함 | 화면 또는 Design Spec에 “사전 정의 cue / 집계 샘플 / 개인 식별 없음”을 명시한다. |

즉, 자동성은 “데이터가 실시간으로 들어온다”가 아니라 “사전 정의된 학습 시점 cue가 재생 위치에 따라 발화한다”로 정의한다. 이 정의는 Round 1·2의 scripted prototype 원칙을 유지한다.

### 2-B. Cue 점수표

Lecture cue는 5단계면 충분하다. 더 늘리면 panel이 산만해지고, 22%의 핵심 장면이 약해진다.

| 시점 | Cue 이름 | Focus target | AI 패널 내용 | 화면 내 보조 변화 |
|---:|---|---|---|---|
| 0% | 시작 상태 | page default | 오늘 강의 목표, 현재 진도, 기본 자막/요약 상태 | progress bar 시작, transcript 첫 행 |
| 22% | Gini/Entropy 난관 | `seg-22pct` | 지니 불순도와 엔트로피 해석 혼동, 동료 정지/반복 42%, Quick Review 권장 | 22% marker active, transcript 18:12 행 active, heatmap peak 강조 |
| 48% | 정의 경계 확인 | `prereq-entropy` 또는 `confirm-q-2` | 엔트로피 정의 공백 여부 확인, 1분 카드 또는 확인문제 2개 권장 | 작은 확인문제 chip 갱신, transcript 해당 행 scroll |
| 73% | 응용 사례 전이 | `quick-review-5min` 보조 | 정의는 통과했지만 응용 예제에서 다시 멈출 가능성, 5분 복기 유지 | progress marker 보조 강조, Companion preset 변경 |
| 100% | 회복 권장 | `confirm-q-2` | 재시청 대신 확인문제와 자기평가로 회복 여부 측정 | 완료 CTA, “교수자 집계에서 보기” 인터스티셜 노출 |

22%는 main cue다. 48%와 73%는 “AI가 계속 보고 있다”는 보조 cue로만 쓴다. 100%는 다음 route로 넘어가는 bridge를 여는 상태다.

### 2-C. 동시 갱신 표면 범위

동시 갱신은 **3개 표면까지**가 적절하다. 더 많아지면 자동성이 강해지는 것이 아니라 시선이 분산된다.

| 범위 | 포함 | 이유 |
|---|---|---|
| 필수 1 | 우측 AI 패널 / Focus Dock | cue의 의미를 설명하는 주 표면이다. |
| 필수 2 | 영상 progress marker | “시점을 지났다”는 물리적 근거가 된다. |
| 필수 3 | transcript active row | 학생이 실제 콘텐츠의 어느 문장에 있는지 보인다. |
| 선택 | heatmap peak / peer signal chip | 22% main cue에서만 강조한다. |
| 제외 | dashboard hero, classhealth, 여러 통계 카드 동시 변화 | lecture 화면 안에서 이미 충분하다. 라우트 밖 변화는 CTA 이후에 보여준다. |

따라서 `struggleHeatmap()`은 Topic 2를 위해 유지해야 하지만, 모든 cue마다 요란하게 바뀌면 안 된다. 22%에서만 가장 강하게 반응하고, 나머지는 marker와 transcript 중심으로 충분하다.

## 3. Topic 3 — 의문 컴포넌트 6종 처리

### 3-A. 6종 표 검토

| # | 컴포넌트 | 결정 | Claude 잠정안에 대한 판정 | 이유 / 대안 |
|---:|---|---|---|---|
| 1 | `priorityStrip()` | 폐기 | 동의 | 사용자 발언 #4 원문: "이거 디자인 너무 AI 로 만든거같아." 직접 비판이 있는 표면이고, dashboard의 “오늘의 결정”과 역할이 중복된다. 대안은 “오늘의 상황” layer다. |
| 2 | `struggleHeatmap()` | 유지하되 redesign | 동의 | Topic 2의 자동 cue를 받쳐주는 핵심 표면이다. 다만 50개 bucket microbar와 강한 spike 표현은 더 LMS-native한 chapter timeline으로 낮춘다. |
| 3 | `cloSparkline()` | 유지 | 동의 | CLO mastery trend는 일반 LMS 분석 차트로 읽힌다. AI 라벨 없이도 의미가 유지된다. |
| 4 | `evidenceToPolicyTrace()` | 유지하되 classhealth에 한정 | 동의하되 조건 명확화 | spine을 보존하기 때문에 유지한다. 단, 모든 route에 반복 노출하지 말고 classhealth의 정책 결말 표면으로 제한한다. |
| 5 | `uncertaintyDistribution()` | 유지하되 용어/시각 단순화 | 동의 | variant 선택의 의사결정 근거다. “분포”보다 “예상 효과 범위 · 95% CI”로 보이면 AI 장식보다 검토 도구가 된다. |
| 6 | `upliftComparison()` | 유지하되 dormant result panel | Claude안보다 더 명확히 수정 | 5-cut phase가 꺼졌다고 폐기하지 않는다. 대신 “지난 배포의 2주 후 효과 검증” 같은 정상 workflow 결과 panel로 둔다. `goCut`이나 demo rail에 의존시키지 않는다. |

핵심은 `priorityStrip()` 하나만 폐기하고 나머지는 모두 살리는 것이 아니다. 나머지 5개도 “AI라고 외치는 시각 언어”를 낮춰야 한다. 다만 기능적 목적이 있는 컴포넌트는 살린다.

### 3-B. priorityStrip 자리 후속 처리

`priorityStrip()`이 빠진 dashboard 상단에는 **“오늘의 상황” compact layer**를 둔다. 현재 hero pill 3개를 그 자리로 옮기거나, hero 하단에서 더 정적이고 LMS-native한 리스트로 재배치한다.

권장 형태는 card-heavy chip strip이 아니라 다음과 같은 compact row다.

| 항목 | 표시 |
|---|---|
| 이탈 위험 | 6명 · 최근 7일 접속/제출 신호 |
| 채점 대기 | 24건 · 초안 평가 대기 |
| 루브릭 준비 | 다음 주 · 공개 전 검토 가능 |

여기에는 순위 번호, confidence, 처리 시간, 과도한 AI badge를 넣지 않는다. “오늘의 결정” 카드가 아래에서 실행 버튼과 근거 버튼을 갖기 때문에, 상황 layer는 scan만 담당하면 된다.

### 3-C. struggleHeatmap redesign 방향

사용자 발언 #6은 원문 그대로 다음이다.

> "22% 구간 정지/반복 42% (집계 신호 · 개인 식별 없음) · 예상 재시청률 -18~-26% · confidence 0.78 · 6분 소요 이것도 말이 너무 길어 1줄씩만 보이는게 더 깔끔해. 우리가 콘텐츠적 내용을 막 어필할 필요는 없잖아."

이 발언을 `struggleHeatmap()`에도 적용한다. 권장 방향은 다음이다.

| 현재 위험 | redesign |
|---|---|
| 50개 막대가 “데모용 분석 그래픽”처럼 보임 | 5개 chapter marker + 22% 강조로 단순화 |
| “22% spike” 같은 badge가 시각적으로 튐 | “22% · 정지/반복 42%”를 timeline label로 흡수 |
| 근거가 한 줄에 너무 많이 붙음 | 한 줄 1정보: `정지/반복 42%`, `표본 n=128`, `개인 식별 없음` 분리 |
| 클릭 가능한지 약함 | 전체 timeline에 얇은 border와 hover/focus state 부여 |
| heatmap이라는 이름이 과장됨 | UI copy는 “학습 신호 타임라인” 또는 “구간별 학습 신호”로 낮춤 |

즉, 데이터의 기능은 유지하지만 시각 언어는 학습 수강 화면의 chapter navigation에 가깝게 바꾼다.

### 3-D. ai-badge 노출 위치 정책

Round 2와 `claude_design_brief.md`에는 dashboard hero eyebrow의 `AI 분석` 유지 같은 락이 있었다. Round 3에서는 그 락을 좁혀야 한다. 사용자 발언 #5 원문은 다음이다.

> "이것도 마찬가지고"

정책은 다음으로 정리한다.

| 위치 | 정책 |
|---|---|
| 화면 hero / page eyebrow | 가능한 한 `AI 분석`, `AI 초안` 같은 문구 제거. 필요하면 작은 sparkle mark만 둔다. |
| 실행 카드 내부 | “근거 보기”는 bordered button 또는 text button으로 명확히 한다. |
| 생성물 상태 | “초안”, “공개 전”, “교수 승인 대기”처럼 workflow 상태를 우선 표시한다. |
| Focus Dock / 설명 spec | 어떤 AI 역할인지 명확히 설명한다. 화면에서 줄인 정보를 문서에서 보강한다. |
| global click target | 시각 badge 제거와 `data-ai-target` 제거를 혼동하지 않는다. target hook은 유지한다. |

사용자 발언 #7 원문도 반영해야 한다.

> "AI 근거 보기 호버하기전에는 버튼인지도 몰라 테두리가 없어서. 테두리 없는거 학습 수강에서 좋아요 싫어요 버튼도 마찬가지야"

따라서 “AI” 단어를 줄이더라도 evidence affordance는 더 선명해져야 한다.

## 4. Topic 1·2·3 의 상호 의존성

첫째, Topic 1에서 B를 선택하면 `priorityStrip()` 폐기가 강제된다. dashboard 상단은 “우선순위 chip”이 아니라 “상황 layer”가 되어야 한다. 이 결정 없이는 Topic 3의 priorityStrip 후속 처리가 성립하지 않는다.

둘째, spine을 폐기하지 않기로 했기 때문에 `evidenceToPolicyTrace()`와 `upliftComparison()`은 살아남는다. 반대로 spine을 완전히 폐기한다면 이 두 컴포넌트는 classhealth나 cocreation 안에서 독립 사례로 다시 설계해야 하고, Round 2의 정책 반영 결말은 약해진다. 나는 spine 보존을 선택했으므로 두 컴포넌트를 유지한다.

셋째, Topic 2에서 P4를 선택하면 `struggleHeatmap()`은 폐기할 수 없다. 22% cue가 panel, marker, transcript, 학습 신호 timeline을 함께 움직여야 “재생 중 특정 시점 통과”가 보인다. 다만 heatmap은 강한 분석 그래픽이 아니라 lecture-native timeline으로 낮춰야 한다.

넷째, “AI 라벨 약화”와 “AI 자동성 강화”는 서로 의존한다. 라벨을 줄이면 자동 cue, target-aware Focus Dock, 버튼 affordance가 더 중요해진다. 반대로 자동 cue가 약하면 라벨을 줄인 화면은 그냥 일반 LMS로 보인다.

다섯째, `next_steps_final.md`의 라이브 데모 금지는 Topic 2 구현 방식을 제한한다. P5처럼 timer 예외를 열지 않고, P4의 로컬 video cue와 marker fallback만 허용해야 한다. 본 발표은 사전 녹화, Q&A는 클릭 프로토타입, 최후는 PNG backup이라는 구조는 유지한다.

## 5. Round 3 plan 모드에 가져갈 결정 사항

1. **Topic 1은 B로 확정한다.** dashboard는 “오늘의 상황” layer와 “오늘의 결정” layer로 분리하고, `priorityStrip()`은 폐기한다.

2. **Spine은 제품 구조로 보존하고, 5-cut 데모 장치는 비활성 유지한다.** 7개 target은 route 간 자연 workflow의 기준점으로 남긴다.

3. **Lecture 동적 패널은 P4로 간다.** 로컬 `<video>` `timeupdate`가 cue를 자동 발화하고, progress marker는 발표 백업용 manual jump로 둔다. `setTimeout` 예외는 만들지 않는다.

4. **6종 컴포넌트는 1개 폐기, 4개 유지/redesign, 1개 dormant 유지로 정리한다.** 폐기: `priorityStrip()`. 유지/redesign: `struggleHeatmap()`, `cloSparkline()`, `evidenceToPolicyTrace()`, `uncertaintyDistribution()`. dormant result panel: `upliftComparison()`.

5. **AI badge 정책을 새로 잠근다.** 화면 상단의 `AI 분석` 과잉은 줄이고, evidence 버튼과 target hook은 오히려 더 명확히 한다. `data-ai-target`은 시각 badge와 별개로 유지한다.

## 6. 라운드 3 락 위반 추가 위험

기존 Round 1·2 락 14종은 다음처럼 재확인한다.

| # | 기존 락 | Round 3 처리 |
|---:|---|---|
| 1 | `openAiContext()` idempotent-open | 유지. cue 발화도 닫힘 토글을 만들면 안 된다. |
| 2 | `state.navCollapsed` 단일 진실원 | 유지. lecture cue state를 별도 collapse state로 만들지 않는다. |
| 3 | 16 nav items visible | 유지. spine 보존을 위해 nav를 숨기지 않는다. |
| 4 | Round-2 lock copy 덮어쓰기 금지 | 일부 수정 필요. dashboard AI badge/priority strip 관련 lock은 Round 3 결정으로 좁힌다. grading, cocreation CTA 등 핵심 copy는 유지한다. |
| 5 | Companion 위치 고정 | 유지. lecture와 cocreation 외 dashboard에 companion chat을 넣지 않는다. |
| 6 | stale `targetId` 방지 | 유지. marker jump와 route CTA는 항상 route primary target을 명시해야 한다. |
| 7 | `FOCUS_CONTEXT` getter adapter | 유지. cue별 target context도 getter를 거친다. |
| 8 | `INCIDENTS` 상수 단일 공급 | 유지. 22%, 42%, 날짜, outcome을 중복 hardcoding하지 않는다. |
| 9 | privacy ribbon / 개인 식별 없음 | 유지. instructor 화면 전환 시 집계 신호임을 계속 드러낸다. |
| 10 | global `data-ai-target` capture | 유지. badge 제거 과정에서 target hook을 없애면 안 된다. |
| 11 | demo keyboard shortcut guard | 키보드 1~5는 비활성 유지. 재활성 시 input guard 필수다. |
| 12 | SVG defs id 충돌 방지 | 유지. 남는 chart들도 id 충돌이 없어야 한다. |
| 13 | baked SVG / baked dates / no RNG·Date·setInterval | 유지. P4의 `timeupdate`는 로컬 playback cue이며 data 갱신 루프가 아니다. |
| 14 | No load-bearing tooltips | 유지. marker 설명과 evidence CTA는 화면에 보여야 한다. |

Round 3 결정으로 새로 생기는 위험은 다음이다.

| 위험 | 왜 위험한가 | 대응 |
|---|---|---|
| 상황 layer와 결정 layer가 다시 섞임 | B 선택의 의미가 사라지고 dashboard가 다시 중복 카드 묶음이 된다. | “오늘의 상황”은 scan, “오늘의 결정”은 action으로 문구와 버튼을 분리한다. |
| `priorityStrip()` 폐기 후 빈 상단을 새 장식으로 채움 | 문제 컴포넌트를 다른 모양의 chip strip으로 되살릴 수 있다. | replacement는 compact 상황 리스트로 제한한다. |
| P4가 live demo처럼 오해됨 | 회장이 실시간 분석이라고 이해하면 신뢰 리스크가 생긴다. | 본 발표는 사전 녹화, Q&A는 로컬 prototype, 화면에는 사전 정의 cue임을 표시한다. |
| marker fallback이 주 동작이 됨 | 사용자 발언 #8의 “재생되면서”가 약해진다. | 발표 흐름에서는 먼저 재생으로 22% 통과를 보여주고, marker는 시간 부족 시 backup으로만 쓴다. |
| `setTimeout` 예외가 다시 열림 | P5식 예외가 다음 라운드에서 `setInterval`/실시간 갱신으로 번질 수 있다. | timer 기반 cue list는 금지한다. |
| cold-disabled 함수가 부분 부활 | `goCut`, `renderDemoRail`, `commitPolicyUpdate` 일부만 살아나면 state가 어긋난다. | demo rail 부활 여부는 별도 결정 전까지 금지한다. |
| `goWithDemo` opts 비활성 때문에 phase가 안 바뀜 | 현재처럼 cut/phase 인자가 무시되면 `upliftComparison()` 같은 result state가 열리지 않는다. | 정상 workflow용 state transition과 demo cut transition을 분리해 재설계한다. |
| AI badge 제거가 affordance 약화로 이어짐 | “AI” 단어는 줄었지만 버튼인지 모르면 사용자 발언 #7이 반복된다. | bordered evidence button, focus ring, `data-ai-target` 유지로 처리한다. |
| text overload가 chart에 남음 | 사용자 발언 #6과 같은 문제가 다른 컴포넌트에 반복된다. | 모든 metric은 한 줄 1정보로 제한한다. |
| spine 보존이 다시 한 화면 반복 노출로 변질 | Round 2 가치를 유지한다는 명분으로 dashboard 중복이 돌아올 수 있다. | route 간 추적은 유지하고, route 내부 대표 표면은 1개로 제한한다. |

최종 결론은 이렇다. Round 1·2의 핵심인 target-aware context, 단일 incident, 폐루프 결말은 유지한다. 그러나 Round 2의 Priority Strip과 5-cut 데모 spine 표현 방식은 Round 3에서 수정한다. 이번 라운드의 잠금 문장은 **“AI 라벨은 약하게, lecture cue 자동성은 강하게, dashboard 중복 노출은 한 layer씩 분리”**다.
