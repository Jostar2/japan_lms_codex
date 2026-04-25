# Codex Round 2 · 타깃 인벤토리 응답

전제부터 명확히 둔다. §2의 큰 방향, 즉 **Target-aware AI Context를 S01 폐루프의 중심 메커니즘으로 두는 결정에는 동의**한다. 다만 지금 잠정안은 좋은 spine을 잡았지만, 몇 지점에서 "같은 사건을 끝까지 추적한다"는 감각이 약해질 수 있다. 특히 `student.lecture`는 지니/엔트로피 난관인데 `instructor.cocreation`은 분산/표준오차 난관처럼 읽히는 불일치가 크다. plan 모드로 들어가기 전에는 타깃 ID보다 먼저 **단일 incident의 개념명, 시각 수치, 시간표시, phase**를 하나로 고정해야 한다.

아래 평가는 메인 프로토타입의 현재 구조(`xAI_LMS_Prototype.html`)와 라운드 2 락을 기준으로 작성했다. 구현 제안은 코드 변경 지시가 아니라 plan 모드에서 가져갈 설계 판단이다.

## 1. §2-1 타깃 인벤토리 평가

### 1-A. 라우트별 동의/조정/추가

#### Route A. `student.lecture`

전체 방향은 맞다. `seg-22pct`를 시연 첫 클릭으로 두는 것은 가장 강하다. 영상 progress marker, 활성 transcript row, 동료 분포 heatmap spike가 모두 같은 타깃으로 수렴하면 "AI가 지금 이 지점을 보고 있다"는 체감이 바로 생긴다.

조정이 필요한 지점은 세 가지다.

1. `peer-bookmark-cluster`는 이름이 부정확하다. 현재 화면 맥락은 학생 개인 북마크보다 동료 정지, 반복 재생, 질문 클러스터에 가깝다. `peer-pause-question-cluster` 또는 `peer-struggle-cluster`로 바꾸는 편이 맞다.
2. `prereq-entropy`는 좋은 타깃이지만, 화면에 명시적인 선수 개념 카드가 있어야 한다. 지금처럼 Focus Dock의 evidence 문장에만 있으면 클릭 가능한 AI 타깃이 아니다.
3. `confirm-q-2`는 "영상 종료 후"보다 Cut 1의 `Quick Review` 뒤에 붙는 확인 문제 카드로 두는 편이 좋다. 그래야 `seg-22pct` 판단이 확인 문제 결과로 갱신되는 흐름이 보인다.

추가 권장 타깃은 아래와 같다.

| Target ID | 우선순위 | 가시 위치 | Focus Dock 변화 |
|---|---:|---|---|
| `quick-review-5min` | 상 | 상단 `Quick 5분` 버튼 또는 22% marker 옆 CTA | "22% 구간만 5분 복기로 압축 · 확인 문제 2개 생성" |
| `metacog-check-3` | 중 | 메타인지 체크 3점 선택 상태 | "자기평가 3/5 · 원인 추정에 낮은 자신감 신호 반영" |
| `transcript-18m12` | 중 | 활성 transcript row | 별도 컨텍스트보다 `seg-22pct`의 alias로 처리 권장 |
| `peer-struggle-cluster` | 상 | aside 상단 heatmap 또는 질문 클러스터 | "동료 반복 재생과 질문이 같은 정의 구간에 집중" |

삭제 또는 비권장 후보도 있다. `AI 생성 · 요약 87%` 카드 자체를 spine 타깃으로 승격하는 것은 약하다. 요약 품질 근거로 빠질 수 있어 S01 폐루프의 긴장감이 흐려진다. 48%, 73% progress marker도 시연 중에는 비활성 보조 marker로 남기는 편이 좋다.

중요한 데이터 정합성 이슈가 있다. 잠정안은 "동료 42%"를 쓰고, 현재 화면은 "128명 중 54%" 같은 표현을 쓴다. 데모에서는 하나의 truth만 써야 한다. 추천은 `42%가 22% 구간에서 정지 또는 반복 재생`으로 고정하고, 질문 수는 별도 `42 questions`처럼 다른 단위로 표시하지 않는 것이다.

#### Route B. `instructor.dashboard`

`decision-w7-cocreation`을 핵심 spine 노드로 올리는 데 동의한다. 다만 현재 프로토타입의 교수자 대시보드 첫 번째 결정은 "학습 개입 6명", 두 번째는 "채점 24건", 세 번째는 "루브릭 초안"이다. S01 중심 데모로 갈 경우 첫 번째 결정 큐는 반드시 W7/Lec2 자료 개선이어야 한다. 그렇지 않으면 Cut 2에서 학생 난관이 교수자 결정으로 변환되는 인과가 끊긴다.

우선순위 조정은 다음이 적절하다.

| 순위 | Target ID | 판정 | 이유 |
|---:|---|---|---|
| 1 | `decision-w7-cocreation` | 유지 및 최상단 고정 | S01 spine 연결점. Cut 2의 주인공이어야 함 |
| 2 | `decision-grading-uncertain-8` | 유지 | S09 보조 장면으로 확장 가능 |
| 3 | `decision-intervention-6` | 유지하되 spine 밖 | 중요한 AI 결정이지만 S01 중심성은 낮음 |
| 제외 또는 하향 | 기존 루브릭 초안 카드 | 데모 큐 밖으로 이동 | W7 incident와 연결이 약함 |

추가 권장 타깃은 아래와 같다.

| Target ID | 가시 위치 | Focus Dock 변화 |
|---|---|---|
| `priority-strip-w7` | dashboard 상단 priority strip의 1번 chip | "영향도와 확실성 기준으로 W7 자료 개선이 오늘 1순위" |
| `question-trend-gini` | aside 질문 트렌드 1번 항목 | "지니 vs 엔트로피 질문 급증 · student.lecture 22%와 같은 incident" |
| `cohort-pattern-w7` | 우측 cohort 또는 trend 카드 | "개별 학생이 아니라 반 단위 집계 패턴 · privacy boundary 유지" |

Cut 2에서 persona switch는 자연스럽게 만들 수 있다. 단, 버튼 문구가 단순히 "교수자로 전환"이면 데모 장치가 드러난다. `교수자 집계에서 보기` 또는 `Teaching Queue에서 같은 패턴 보기` 같은 브리지 CTA가 필요하다. 이 CTA는 "학생 개인 기록이 교수자에게 전달된다"는 오해를 막기 위해 `집계 수준 · 개인 식별 없음` 표시를 함께 가져야 한다.

#### Route C. `instructor.cocreation`

가장 큰 조정 지점이다. 잠정안의 Route A는 `지니 불순도/엔트로피` 난관인데, Route C의 원인 추정에는 `분산 개념 혼동`, 현재 프로토타입에는 `표준오차 선수 공백`이 섞여 있다. 이 상태로 구현하면 회장은 "같은 사건"이 이어진다고 느끼기 어렵다.

추천 결정은 하나다. 이번 spine의 incident를 `w7-lec2-gini-22pct`로 고정하고, `instructor.cocreation`의 step1 원인 개념도 `지니 불순도와 엔트로피의 해석 혼동`으로 맞춘다. 분산/표준오차는 다른 데모 incident로 남기는 편이 낫다.

기존 타깃 중 유지할 것은 `step1-input`, `step2-variant-a/b/c`, `step3-edit`, `step4-publish`, `step5-effect`다. 다만 각 variant의 Focus Dock이 `novelty`만 말하면 약하다. 교수자가 결정해야 하는 것은 새로움이 아니라 효과, 부담, 신뢰성이다. 각 variant에는 최소한 `expected rewatch reduction`, `95% CI`, `overlap`, `student burden`, `governance pass`가 같이 있어야 한다.

추가 권장 타깃은 아래와 같다.

| Target ID | 우선순위 | 가시 위치 | Focus Dock 변화 |
|---|---:|---|---|
| `step2-selection-rationale` | 상 | variant 3종 비교 하단 선택 근거 | "최대 효과 추정이 아니라 overlap과 부담을 함께 보고 A안 선택" |
| `step3-governance-gates` | 중 | hallucination, 용어 일관성, CASE 정렬 tag | "승인 전 4-Gate 통과 · 학생 공개 전 검증 완료" |
| `step4-ab-settings` | 상 | 승인 후 공개 버튼 옆 AB 설정 | "AB 테스트 on · 2주 후 outcome 사전등록" |
| `measurement-plan` | 중 | aside 효과 측정 계획 | "재시청률, 확인문제 정답률, 질문 중복률을 2주 뒤 비교" |
| `step5-effect` | 최상 | 2주 후 효과 검증 panel | "재시청률 -22% [CI -32, -12], regret 0건 · 같은 incident의 결과" |

`step5-effect`는 spine의 1차 결말이므로 별표 노드가 맞다. 다만 화면에서는 "지난 배포"처럼 과거 일반 사례로 읽히면 안 된다. `W7/Lec2 22% 보완자료 · 배포 2026-04-10 → 측정 2026-04-24`처럼 같은 incident ID와 절대 날짜가 보이는 편이 안전하다.

#### Route D. `instructor.classhealth`

`clo-3-mastery-trend`와 `next-semester-policy`는 결말로 적합하다. 다만 현재 이름만으로는 "개별 화면을 하나 더 본다"는 느낌이 강하고, 정책 갱신의 무게가 충분히 안 나온다. Cut 5의 힘은 "학생 난관이 교수자 자료 개선을 거쳐 다음 학기 설계 정책으로 들어갔다"는 ledger 감각에서 나온다.

추가 권장 타깃은 아래와 같다.

| Target ID | 가시 위치 | Focus Dock 변화 |
|---|---|---|
| `impact-ledger-entry` | CLO sparkline 옆 작은 timeline 또는 ledger row | "감지 → 보완자료 → 배포 → 2주 효과 → 정책 반영이 한 줄로 닫힘" |
| `policy-memo-draft` | 다음 학기 설계 메모 카드 | "W7/Lec2 지니/엔트로피 보완 전략을 다음 학기 설계안에 추가" |
| `next-semester-policy` | 학기 메모 보내기 CTA | "다음 학기 Course Blueprint에 반영 완료 · 폐루프 완료" |

`next-semester-policy`는 CTA만 보여주고 끝내면 약하다. 클릭 후 버튼 상태가 `보냄` 또는 `설계 메모에 반영됨`으로 바뀌고, Focus Dock의 Measurement가 `다음 학기 같은 CLO에서 재평가`로 바뀌어야 결말이 닫힌다.

#### Route E. `student.dashboard`

선택적 학생 결말로는 좋지만, 4~5분 메인 spine에 넣으면 정책 결말의 힘을 분산시킬 수 있다. 회장 대상 데모의 본편은 Route D에서 끝내고, 시간이 남을 때 15~20초 epilogue로 쓰는 편이 낫다.

유지할 타깃은 `recovered-segment`, `path-update`다. 추가한다면 `learning-receipt` 정도가 적절하다.

| Target ID | 가시 위치 | Focus Dock 변화 |
|---|---|---|
| `learning-receipt` | 학생 dashboard 상단 회복 알림 | "W7/Lec2 22% 구간 확인문제 통과 · 개인 학습 경로만 갱신" |

주의할 점은 학생 화면에 교수자의 AB 테스트, 정책 메모, 다른 학생 집계가 노출되면 안 된다는 것이다. 학생 결말은 "내 학습 경로가 좋아졌다"까지만 보여주는 게 맞다.

#### 최종 spine 우선순위

plan 모드에서는 아래 타깃을 spine 필수 노드로 고정하는 것을 권장한다.

| 단계 | 필수 Target ID | 역할 |
|---:|---|---|
| 1 | `seg-22pct` | 학생 난관 감지 |
| 2 | `decision-w7-cocreation` | 교수자 결정 큐로 사건 승격 |
| 3 | `step1-input` | 같은 incident가 제작 입력으로 변환 |
| 4 | `step2-selection-rationale` | 대안 3종 중 교수자 승인 판단 |
| 5 | `step4-ab-settings` | 배포와 사전등록 outcome 확정 |
| 6 | `step5-effect` | 2주 후 효과 검증 |
| 7 | `next-semester-policy` | 다음 학기 설계 정책으로 반영 |

## 2. §2-2 데모 스크립트 평가

### 2-A. 5컷 시간·트리거 검토

제안된 5컷 구조는 맞다. 다만 Cut 3에 step1 입력, variant 비교, 선택, 편집, 승인, 공개가 모두 들어가 있어 75초로는 빡빡하다. 시연자가 설명을 붙이면 Cut 3이 쉽게 2분을 넘는다. Cut 4의 "2주 후" 효과 검증은 충분히 보여줘야 하므로 Cut 3에서 편집 텍스트를 길게 읽지 않게 만들어야 한다.

추천 시간표는 다음이다.

| 컷 | 시간 | 라우트 | 클릭과 결과 | 다음 컷 트리거 |
|---|---:|---|---|---|
| Cut 1 | 0:00-0:45 | `student.lecture` | 22% marker 또는 heatmap spike 클릭 → `seg-22pct` 활성. Focus Dock이 지니/엔트로피 정의 난관, Quick Review, 확인 문제 계획을 보여줌 | `교수자 집계에서 보기` |
| Cut 2 | 0:45-1:25 | `instructor.dashboard` | 같은 incident ribbon이 priority strip 1번으로 등장. `decision-w7-cocreation` 클릭 → Focus Dock이 자료 개선 결정으로 전환 | `Co-Creation에서 보완` |
| Cut 3 | 1:25-2:45 | `instructor.cocreation` | `step1-input` 자동 채움 → 3개 variant CI 비교 → `step2-selection-rationale` → `step4-publish` 승인 | `2주 후 결과 보기` |
| Cut 4 | 2:45-3:35 | `instructor.cocreation` step5 | `after-2w` phase로 전환. `step5-effect`가 재시청률 -22% [CI -32, -12], regret 0건, uplift comparison을 보여줌 | `클래스 영향 보기` |
| Cut 5 | 3:35-4:30 | `instructor.classhealth` | CLO-3 sparkline 개선 → `impact-ledger-entry` → `next-semester-policy` 클릭. 버튼 상태가 정책 반영 완료로 바뀜 | `폐루프 완료` |

Cut 2의 persona switch는 자연스럽다. 조건은 두 가지다. 첫째, 전환 CTA가 "교수자 화면으로 전환"이 아니라 "같은 패턴을 교수자 집계에서 보기"여야 한다. 둘째, 교수자 화면 첫 줄에 `W7/Lec2 · 22% · 집계 신호 · 개인 식별 없음` 같은 incident ribbon이 보여야 한다. 그래야 학생 개인의 행동을 교수자가 훔쳐보는 인상이 아니라, 반 단위 학습 신호가 교수자의 의사결정으로 올라온다는 인상을 준다.

Cut 5 결말은 잠정안 그대로는 중간 강도다. `CLO-3 sparkline`과 `다음 학기 메모 보내기`만 있으면 "보고서에 저장했다" 정도로 끝날 수 있다. 강한 결말을 만들려면 클릭 후 상태 변화가 필요하다. 예를 들어 `다음 학기 설계 메모로 보내기`를 누르면 카드가 `2026 가을 Course Blueprint에 반영됨`으로 바뀌고, ledger가 `Detected → Decided → Published → Measured → Policy updated`까지 닫혀야 한다.

### 2-B. 추가 권장 컷/생략 권장 컷

메인 4분 30초 버전에는 컷을 추가하지 않는 편이 좋다. 특히 S07 Career나 S09 Grading을 본편 안에 넣으면 S01의 인과 사슬이 약해진다.

대신 5분 버전에서만 15~20초 epilogue를 허용할 수 있다. Cut 5 뒤에 `student.dashboard`로 돌아가 `recovered-segment`를 보여주는 것이다. 이때도 설명은 짧게 끝내야 한다. "학생에게는 정책 메모가 아니라 회복된 학습 경로만 보입니다" 정도면 충분하다.

생략 권장 요소는 긴 텍스트 편집 시연이다. `step3-edit`은 교수자 어조 보정과 governance 통과를 보여주는 카드 수준이면 된다. 발표장에서 편집문을 읽는 순간 속도가 죽는다. Cut 3의 핵심은 "AI가 3안을 만들고, 교수자가 근거를 보고 선택하며, 승인 전까지 비공개"라는 구조다.

트리거는 hover에 의존하면 안 된다. 모든 컷 끝에는 작은 demo rail 또는 고정 `다음` 버튼이 있어야 한다. 키보드 `1`-`5` 단축키는 좋지만, input, textarea, contenteditable 포커스 안에서는 동작하지 않게 해야 한다.

## 3. §2-3 시각 4종 배치 평가

### Struggle Heatmap

배치는 `student.lecture` aside top이 맞다. 다만 "가로 100분할 bar"는 엄밀한 heatmap이라기보다 timeline density bar다. 문제는 용어가 아니라 기능이다. 22% spike가 video progress marker와 같은 target을 가리켜야 한다. 사용자가 heatmap spike를 클릭해도 `seg-22pct`, progress marker를 클릭해도 `seg-22pct`, transcript row를 클릭해도 같은 Focus Dock이 열려야 한다.

데이터는 `영상 0-100% × 정지/되감기/북마크/질문 빈도`로 합성해도 된다. 단, 숫자는 고정해야 한다. 추천 표시는 `22% 구간 · 정지/반복 42% · 표본 신뢰도 82%`다. 48%, 73%는 보조 marker로 희미하게 두되, Cut 1에서는 22%만 강조한다.

### Priority Strip

`instructor.dashboard` 상단 배치는 맞다. 다만 chip strip만으로는 결정 큐의 무게가 약할 수 있다. 최소 정보는 `우선순위`, `예상 영향`, `확실성`, `처리 시간`이다. 예시는 `#1 W7/Lec2 자료 개선 · 예상 재시청률 -18~-26% · confidence 0.78 · 6분`처럼 읽히면 좋다.

Priority Strip의 1번 chip과 아래 Decision Card 1번은 같은 `decision-w7-cocreation` 타깃을 공유해야 한다. 둘을 별도 target으로 두면 Focus Dock이 미세하게 달라져 혼란이 생긴다. strip은 시각적 요약, card는 실행 affordance로 역할을 나누면 된다.

### Uncertainty Distribution

`instructor.cocreation` step2와 `instructor.grading` aside에 함께 쓰는 방향은 가능하다. 그러나 두 화면의 의미는 다르다.

`cocreation`에서는 variant별 예상 uplift posterior다. 회장 대상 시연에서는 violin보다 95% CI bar가 읽기 쉽다. 각 variant를 `예상 재시청률 변화`, `CI`, `overlap`, `regret risk`로 보여주는 편이 낫다.

`grading`에서는 점수 확신도 분포 또는 8건 불확실 큐의 score band다. 이것은 S01 spine의 필수 컴포넌트가 아니라 S09 보조 장면용이다. 따라서 공통 컴포넌트 이름은 유지하되, 데이터 schema는 `cocreation.upliftPosterior`와 `grading.scoreUncertainty`로 분리해야 한다.

### Uplift Comparison

`instructor.cocreation` step5 배치가 맞다. 이 컴포넌트는 Cut 4의 주인공이다. 단순 가로 막대보다 `배포 전 baseline`, `배포 후 2주`, `선택 variant`, `비선택 variant 예상치`를 함께 보여주면 설득력이 커진다.

추천 데이터는 다음이다.

| 항목 | 값 |
|---|---|
| selected variant | A 또는 선택된 실제 variant ID |
| primary outcome | 재시청률 -22% |
| 95% CI | [-32, -12] |
| secondary outcome | 확인문제 정답률 +8~+12%p |
| overlap | 0.71 |
| regret | 0건 |

`overlap`은 효과가 아니라 비교 가능성 또는 표본 유사도이므로 bar 위에 같이 놓으면 오해가 생긴다. 별도 small badge로 빼는 편이 안전하다.

### 추가 권장 컴포넌트

4종 외에 사실상 필수인 시각 컴포넌트가 하나 있다. **Incident Ribbon**이다. 모든 라우트 상단에 `W7/Lec2 · 22% · Gini/Entropy · incident:w7-lec2-gini-22pct` 같은 짧은 띠가 있어야 한다. 이것이 없으면 route 전환 때 같은 사건이 따라온다는 감각이 약해진다.

두 번째로 권장하는 것은 Cut 5의 **Evidence-to-Policy Trace**다. 5노드 timeline으로 `감지 → 결정 → 배포 → 측정 → 정책 반영`을 보여주면 폐루프 결말이 훨씬 강해진다. 이 trace는 SVG로 bake하고, 현재 phase만 강조하면 된다.

모든 시각은 잠정안대로 baked SVG가 맞다. RNG, `Date()`, `setInterval` 기반 변화는 발표 안정성을 해친다. SVG 내부 `id`도 반복 렌더링과 충돌하지 않게 route별 prefix를 붙이거나 `defs` 사용을 최소화해야 한다.

## 4. §2-4 state 모델 평가

### 4-A. 구조적 결함

현재 잠정 state의 핵심 결함은 `step` 축이 없다는 점이다. §1 목적은 `incident`/`step`/`targetId` 3축인데, 제안 객체에는 `incidentId`, `cut`, `targetId`, `timeWarp`만 있다. `cut`은 발표 스크립트 위치이고, `step`은 제품 workflow 위치다. 둘은 분리해야 한다. Cut 3 안에서 `step1`, `step2`, `step3`, `step4`가 모두 지나가기 때문이다.

`timeWarp`도 이름이 좋지 않다. 데모 연출만 뜻한다면 허용 가능하지만, 실제 데이터 상태를 고르는 축으로 쓰기에는 너무 프레젠테이션 장치처럼 들린다. 추천은 `phase` 또는 `evaluationPhase`다. 예를 들어 `baseline`, `drafting`, `published`, `after2w`, `policyUpdated`로 두면 Cut 4와 Cut 5가 자연스럽게 연결된다.

`FOCUS_CONTEXT` dual-key도 그대로 넣으면 기존 흐름을 깨뜨릴 수 있다. 현재 `focusModeDock()`은 `FOCUS_CONTEXT[key]`가 곧 `{title, judgment, action, evidence...}` shape라고 가정한다. 이를 `{default, 'seg-22pct', ...}` 형태로 바꾸면 dock이 바로 깨진다. 따라서 map shape 변경과 dock 접근을 동시에 하지 말고, `getFocusContext(routeKey, targetId)` adapter를 먼저 두어야 한다.

또 하나의 결함은 stale target 문제다. `student.lecture`에서 `targetId='seg-22pct'`인 상태로 `instructor.dashboard`로 이동하면, dashboard에는 같은 target이 없다. route 전환 시 `targetId`를 route의 primary target으로 매핑하거나 fallback default로 바꾸는 규칙이 필요하다.

마지막으로 incident의 개념 데이터가 state에 없다. `incidentId` 문자열만으로는 화면 카피, 수치, outcome, variant 선택을 안정적으로 묶기 어렵다. 실제 데이터는 constants에 두고 state는 현재 선택만 가리키는 편이 좋다.

### 4-B. 대안 제안

권장 구조는 아래 정도면 충분하다.

```js
const state = {
  persona: 'student',
  page: 'lecture',
  navCollapsed: false,
  expandedGroups: new Set(['강의']),
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

`workflowStep`은 `lecture.struggle`, `dashboard.decision`, `cocreation.input`, `cocreation.variant`, `cocreation.publish`, `cocreation.effect`, `classhealth.policy` 정도면 된다. `cut`은 demo rail과 keyboard shortcut을 위한 값으로만 사용한다.

context map은 아래처럼 adapter 전제로 둔다.

```js
const FOCUS_CONTEXT = {
  'student.lecture': {
    default: { /* 기존 페이지 단위 fallback */ },
    targets: {
      'seg-22pct': { /* target-specific context */ },
      'quick-review-5min': { /* ... */ }
    }
  }
};

function getFocusContext(routeKey, targetId){
  const bucket = FOCUS_CONTEXT[routeKey];
  if(!bucket) return fallbackFocusContext();
  if(bucket.targets && targetId && bucket.targets[targetId]){
    return bucket.targets[targetId];
  }
  return bucket.default || bucket;
}
```

이렇게 하면 기존 flat `FOCUS_CONTEXT`도 과도기적으로 살릴 수 있다. 핵심은 `focusModeDock()`이 직접 `FOCUS_CONTEXT[key]`를 읽지 않고 항상 getter를 거치게 하는 것이다.

`openAiContext(targetId?)`는 idempotent-open 계약을 유지하되, target 갱신과 focus mode 진입을 분리해서 생각해야 한다.

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

실제 구현에서는 불필요한 double render를 줄일 수 있지만, 원칙은 위와 같다. 인자 없는 `openAiContext()`는 기존 페이지 default를 열어야 하며, 이미 focus mode일 때 다시 눌러도 닫히면 안 된다.

## 5. §2-5 락 위반 추가 위험

§2-5의 기존 위험 식별은 타당하다. 추가로 plan 모드에서 반드시 체크할 위험은 아래다.

| 추가 위험 | 왜 문제인가 | 대응 |
|---|---|---|
| route 전환 후 stale `targetId` | `seg-22pct`가 dashboard에서 그대로 남으면 Focus Dock fallback이 틀어짐 | 컷 전환마다 `targetId`를 route primary target으로 명시 설정 |
| `FOCUS_CONTEXT` shape 변경 | 기존 `focusModeDock()`이 flat object를 기대함 | `getFocusContext()` adapter 도입 후 점진 전환 |
| incident copy 불일치 | 지니/엔트로피, 분산/표준오차, 12:34/18:12, 42%/54%가 섞이면 spine 붕괴 | `INCIDENTS` 상수 하나에서 모든 copy와 수치 공급 |
| 개인 데이터 노출 오해 | student lecture의 북마크나 자기평가가 instructor dashboard로 직접 간 것처럼 보일 수 있음 | 교수자 화면은 집계 신호만 표시, privacy ribbon 고정 |
| global `.ai-badge` capture handler | 모든 badge가 target 없이 page default를 열 수 있음 | `data-ai-target`을 읽고 없을 때만 default. inline click과 중복 호출 방지 |
| `switchPersona()` reset | persona 전환 시 page와 expandedGroups가 reset되며 demo target만 남을 수 있음 | demo transition 함수가 persona, page, workflowStep, targetId를 함께 세팅 |
| demo keyboard shortcut 충돌 | `1`-`5` 키가 편집 중 텍스트 입력을 방해할 수 있음 | Escape 처리처럼 input, textarea, select, contenteditable guard |
| hidden route 유입 | Cut 중 `go('intervention')`, `go('grading')` 같은 보조 route가 실수로 본편을 이탈시킬 수 있음 | demo mode에서는 spine CTA와 보조 CTA를 시각적으로 분리 |
| no tooltip 원칙 위반 | progress marker 설명이 tooltip에만 있으면 발표장에서 안 보임 | 22% marker label, heatmap label, Focus Dock evidence를 화면에 상시 표시 |
| baked SVG id 충돌 | 같은 `defs` id를 여러 SVG에서 반복하면 gradient나 clipPath가 섞일 수 있음 | route별 prefix 또는 inline fill 사용 |
| 날짜 불안정 | 현재 날짜 기반 계산은 발표일에 따라 "2주 후"가 흔들림 | 모든 데모 날짜와 phase label을 고정 copy로 bake |
| Round-2 lock copy 덮어쓰기 | target-aware copy를 넣다가 hero eyebrow, step label, grading copy가 바뀔 수 있음 | 기존 락 copy는 그대로 두고 Focus Dock target copy만 확장 |

특히 "개념 불일치"는 단순 카피 문제가 아니라 전체 구현의 위험이다. S01을 지니/엔트로피로 잡으면 `cocreation`의 보완자료, `classhealth`의 CLO, `step5`의 효과 검증도 모두 그 개념으로 맞춰야 한다.

## 6. (선택) S07/S09 끼워넣기

S09 Grading은 1분 안에 끼워 넣을 수 있다. Cut 2에서 `decision-grading-uncertain-8`을 35~45초 side branch로 열고, `instructor.grading`에서 uncertainty distribution과 "교수 최종 확정" 원칙을 보여준 뒤 demo rail로 Cut 3에 복귀하면 된다. 다만 이건 본편이 아니라 확장 시연이어야 한다. 본편에 넣으면 S01 자료 개선 루프의 리듬이 끊긴다.

S07 Career는 이번 spine에는 약하다. 학생 dashboard의 `path-update` 뒤에 "다음 주 머신러닝 응용과 진로 역량 연결"을 30초 정도 붙일 수는 있지만, 회장 데모의 폐루프 메시지와 직접 관련이 낮다. 꼭 넣어야 한다면 본편 종료 후 별도 "학생 장기 경로도 같은 target-aware 구조로 확장된다"는 appendix로 두는 편이 낫다.

## 7. plan 모드로 가져갈 핵심 결정 사항 요약

1. **incident를 하나로 고정한다.** 추천 ID는 `w7-lec2-gini-22pct`다. 지니/엔트로피, 22%, 18:12 또는 22% 구간, 42%, 2주 후 outcome 수치를 모든 라우트에서 동일하게 쓴다.
2. **필수 spine target은 7개로 둔다.** `seg-22pct` → `decision-w7-cocreation` → `step1-input` → `step2-selection-rationale` → `step4-ab-settings` → `step5-effect` → `next-semester-policy`.
3. **state에는 `cut`과 별도로 `workflowStep`/`phase`를 둔다.** `timeWarp`라는 이름은 피하고, `baseline`, `drafting`, `published`, `after2w`, `policyUpdated` 같은 phase로 관리한다.
4. **`FOCUS_CONTEXT`는 getter로 감싼다.** 기존 page-level shape를 바로 깨지 말고 `getFocusContext(routeKey, targetId)`에서 target-specific context와 default fallback을 결정한다.
5. **Cut 5는 policy update 상태 변화로 끝낸다.** 단순 CTA가 아니라 `다음 학기 설계 메모 반영 완료`와 evidence-to-policy trace까지 보여줘야 폐루프 결말이 강하다.

