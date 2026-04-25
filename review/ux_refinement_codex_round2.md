# Codex UX 재정비 교차리뷰 (구현 후)

## 한 줄 판정
OK-with-fixes

핵심 구조는 ship 가능한 수준입니다. State 단일화, Focus 진입, Hidden nav 정리는 실제 코드에서 대체로 맞게 반영됐습니다. 다만 발표 신뢰도를 해칠 수 있는 숫자 불일치와, AI touchpoint인데 배지가 빠진 카드, Focus Dock의 접힌 세부 항목은 수정하는 편이 좋습니다.

## 1. State 모델 정합성

`state.aiExpanded` 실행 참조는 제거됐습니다. 현재 `state`에는 `navCollapsed`만 있고, `syncShellMode()`가 `nav-collapsed`, `ai-expanded`, `ai-focus`, `data-mode`를 모두 `state.navCollapsed`에서 파생합니다.

삭제 대상 함수의 실행 참조도 남아 있지 않습니다. `toggleAiPanel`, `collapseAiPanel`, `setAiFocus`, `setAiExpanded`, `toggleAiFocus`, `focusAiMode`, `exitAiMode`는 검색되지 않습니다. 단, 주석에 `old expandAiPanel()` 언급이 하나 남아 있습니다. 런타임 문제는 아니지만 "완전 제거" 관점에서는 정리해도 됩니다.

`openAiContext()`는 idempotent-open입니다. 이미 focus mode일 때 닫히지 않고, `aside.scrollTop = 0`만 수행합니다. 토글로 작동하지 않습니다.

Esc 핸들러도 적절합니다. `Escape`가 아니면 무시, focus mode가 아니면 무시, `INPUT/TEXTAREA/SELECT/contenteditable` 포커스 중이면 무시합니다. 현재 요구한 입력 예외는 충족합니다.

## 2. Hidden Route 누출

5개 핵심 화면 기준으로 hidden 화면 이동은 남아 있지 않습니다.

- `student.dashboard`: `go('lecture')`만 남아 있고 `lecture`는 핵심 화면입니다. 과제 카드는 `openAiContext()`로 바뀌었습니다.
- `student.lecture`: hidden route 이동 없음.
- `instructor.dashboard`: `go('grading')`만 남아 있고 `grading`은 핵심 화면입니다. `intervention`, `rubric`은 `openAiContext()`로 바뀌었습니다.
- `instructor.cocreation`: hidden route 이동 없음.
- `instructor.grading`: hidden route 이동 없음.

참고로 hidden 화면 내부에는 `go('intervention')` 같은 이동이 남아 있습니다. 그러나 nav에서 직접 노출되지 않는 화면을 URL/콘솔로 직접 진입했을 때의 후속 흐름이므로, 이번 발표 누출 문제와는 분리해도 됩니다.

## 3. AI 배지 일관성

5종 표준 자체는 대부분 반영됐습니다. 핵심 화면에서 확인되는 표준형은 `AI 예측`, `AI 생성`, `AI 분석`, `AI 초안`입니다.

남은 불일치가 있습니다.

- `student.lecture`의 `AI 자막 · 4개 언어 번역`은 5종 표준 밖입니다. 기능명은 좋지만 표준을 지키려면 `AI 생성 · 자막 번역` 또는 `AI 분석 · 실시간 자막`처럼 1차 타입을 앞에 둬야 합니다.
- `student.dashboard`의 과제 카드와 AI 맞춤 복습 카드는 `.ai-touchpoint`이며 `openAiContext()`를 여는 카드인데, 카드 내부에 표준 `.ai-badge`가 없습니다. 첫 번째 강의 카드만 `AI 예측` 배지가 있습니다.
- `instructor.dashboard`의 Decision Card 3개도 `.ai-touchpoint`인데 표준 `.ai-badge`가 없습니다. 특히 채점 카드에는 `AI 초안`, 개입 카드에는 `AI 추천` 또는 `AI 분석`, 루브릭 카드에는 `AI 초안`이 붙는 편이 일관됩니다.
- `instructor.cocreation`의 3개 variant가 모두 `AI 생성 · 교수 승인 대기`를 반복하는 것은 카드 반복 구조상 허용 가능합니다. 중복 자체보다 "승인 전 비공개" 메시지를 강화하는 효과가 있습니다.

전역 `.ai-badge` 클릭 핸들러가 모든 배지를 focus mode 진입 대상으로 만듭니다. 지금은 의도에 가깝지만, 정보성 배지까지 모두 같은 generic Focus Context를 여는 점은 남은 UX 모호성입니다.

## 4. Focus Dock 순서

실제 DOM 순서는 요구와 맞습니다.

`Judgment → Action → Evidence → Uncertainty → Measurement → Buttons → Override box` 순서로 배치되어 있습니다. Override 설명/사유 선택 박스도 실행 버튼 뒤에 있습니다.

다만 데모 관점에서는 `details open`이 Evidence 하나뿐이고, Uncertainty와 Measurement는 접힌 상태입니다. 이번 제품의 핵심 차별점이 "불확실성 공개"와 "효과 측정 계획"이라면 발표 화면에서 접혀 있으면 보이지 않습니다. 최소한 focus mode에서는 3개 details를 모두 open으로 시작하거나, Uncertainty/Measurement의 한 줄 요약을 접힘 밖에 노출하는 편이 맞습니다.

또 하나의 작은 혼선은 `focus-actions` 안의 override 버튼과 아래 `Override · Mei-waku Care` select가 모두 override 역할을 한다는 점입니다. 순서는 맞지만 의미가 두 갈래로 보일 수 있습니다.

## 5. Co-Creation 명료성

섹션 번호 1~5는 대체로 읽힙니다. 1은 카드 내부 tag, 2와 5는 section heading, 3과 4는 한 카드 제목 안에 함께 들어갑니다. 발표자가 읽기에는 충분하지만, `3 · 편집`과 `4 · 배포 설정`이 한 제목에 합쳐져 있어 단계감은 약합니다. 제목을 `3 · 선택 초안 편집` / `4 · 승인 후 배포 설정`처럼 분리하거나 줄바꿈해도 됩니다.

`승인 전 비공개`는 page-sub, variant 배지의 `교수 승인 대기`, 편집 카드의 warn tag로 반복되어 충분히 전달됩니다. 단, 최종 버튼 문구가 `편집 후 공개 (AB 테스트 on)`이라 자동 공개처럼 보일 여지가 있습니다. `승인 후 공개`가 더 안전합니다.

Teaching Profile 압축은 성공적입니다. `박교수 v3`, 교수법 선언 1문장, `です・ます 어조 / 具体的には / 반례 먼저` 3칩으로 생성물이 어떤 말투와 교수법을 따르는지 충분히 전달됩니다. 세부 선호/회피 용어가 빠졌지만 발표 핵심을 해치지는 않습니다.

## 6. Grading 배너

배너는 테이블 위에 있고, `검토 필수 · 8건`, `신뢰도 <75%`, `8건 순서대로 검토` CTA가 한 번에 읽힙니다. prominent합니다.

사람 최종 결정자 원칙도 첫 화면에서 읽힙니다. 페이지 제목의 `당신은 의사결정자`, page-sub의 `반드시 교수 검토`, 배너 본문의 `사람 최종 결정자 원칙`이 같은 메시지를 반복합니다.

다만 숫자 모델은 수정해야 합니다. 현재 문맥은 `52건 중 24건 초안 완료`, `8건 불확실`, `20 미실행`인데, 테이블 태그는 `24 완료 + 8 불확실 + 20 미실행 = 52`처럼 읽힙니다. 그러면 불확실 8건이 24건의 부분집합인지 별도 상태인지 모호합니다. 배너의 `나머지 24건은 교수 일괄 승인 후 자동 발송 가능`도 같은 혼선을 키웁니다. 회장님 데모에서 숫자 불일치는 신뢰를 바로 깎습니다.

## 7. Claude 거부 항목 재검토

Companion 유지는 타당합니다. 실제 구현은 학생 dashboard aside 상단에 `왜 오늘 이 경로인가 · AI 분석` xAI 패널을 먼저 두고, 그 아래 Companion을 배치했습니다. 그래서 Codex 원안처럼 Companion을 강하게 줄이지 않아도 AI 동반자 서사와 판단 근거가 같이 살아납니다.

일정 카드 압축 유지도 타당합니다. 교수자 dashboard aside 하단의 2줄 일정은 Decision Card 흐름을 방해하지 않는 수준입니다. 제거까지 갈 필요는 없어 보입니다.

Grading 피드백 즉시 노출은 조건부로 타당합니다. 20분 데모에서는 즉시 보이는 편이 설명 비용이 낮습니다. 다만 현재 문구는 `채점 확정 시 AI가 생성합니다`라고 하면서 실제 draft가 이미 보입니다. Claude 선택을 유지하려면 `발송 전 검토용 미리보기`처럼 바꾸거나, Codex 원안대로 확정 후 노출해야 합니다. 지금 상태는 둘 중 어느 쪽도 명확하지 않습니다.

## 8. 버그·회귀

1. Grading 카운트가 모호합니다. `24 완료`, `8 불확실`, `20 미실행`의 포함 관계를 하나로 정리해야 합니다.

2. Grading aside의 피드백 초안은 "확정 시 생성"이라고 설명하면서 이미 노출됩니다. 즉시 노출 정책이면 문구를 바꿔야 합니다.

3. `.ai-touchpoint`와 `.ai-badge`의 관계가 아직 일관되지 않습니다. 클릭 가능한 AI touchpoint인데 배지가 없는 카드가 핵심 화면에 남아 있습니다.

4. Focus Dock의 Uncertainty/Measurement가 접혀 있어 발표장에서 xAI 원칙이 약하게 보일 수 있습니다.

5. 전역 `.ai-badge` 클릭은 항상 현재 페이지의 generic Focus Context를 엽니다. 배지별 근거를 구분하지 않으므로, 사용자가 특정 배지를 눌렀을 때 기대한 근거와 패널 내용이 어긋날 수 있습니다.

## Fix List (우선순위)

1. [Critical] Grading 숫자 체계를 정리하세요. 예: `52건 = 초안 완료 32건(확정 가능 24 + 검토 필수 8) + 미실행 20건`처럼 page-sub, 배너, 테이블 tag를 모두 같은 구조로 맞춥니다.
2. [Should-fix] 핵심 화면의 `.ai-touchpoint` 카드에는 표준 `.ai-badge`를 붙이세요. 특히 `student.dashboard` 2/3번 카드와 `instructor.dashboard` Decision Card 3개가 대상입니다.
3. [Should-fix] Focus Dock에서 Uncertainty와 Measurement를 데모 기본 상태에서 보이게 하세요. 3개 details를 모두 open으로 두는 방법이 가장 작습니다.
4. [Should-fix] Grading 피드백 초안의 정책을 하나로 정하세요. 즉시 노출이면 "미리보기/발송 전 검토"로, 확정 후 생성이면 패널을 지연 노출로 바꿉니다.
5. [Should-fix] `AI 자막 · 4개 언어 번역`을 5종 표준에 맞춰 `AI 생성 · 자막 번역`처럼 바꾸세요.
6. [Nice-to-have] Co-Creation의 `3 · 편집`과 `4 · 배포 설정`을 제목에서 더 분리하고, 공개 버튼은 `승인 후 공개`로 바꾸세요.
7. [Nice-to-have] 주석에 남은 `old expandAiPanel()` 언급과 전역 `.ai-badge` generic open의 한계를 정리하세요.
