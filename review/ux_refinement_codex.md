# Codex UX 재정비 플랜 비판 (독립 라운드)

## 한 줄 판정
Go-with-conditions. 방향은 맞지만, 현재 플랜 그대로 구현하면 `expandAiPanel()` 의미가 깨지고, 숨긴 화면으로 빠지는 CTA가 남으며, AI 표기 체계가 "보라색 장식"으로 다시 번질 위험이 큽니다. 먼저 "AI 근거를 여는 행위"와 "화면 레이아웃을 접는 행위"를 분리해 정의해야 합니다.

## 1. 놓친 함정

### A1. `expandAiPanel()` 단순 위임은 UX 의도를 훼손한다

현재 `expandAiPanel()`은 단순 레이아웃 확대 함수처럼 보이지만 실제 호출 맥락은 서로 다릅니다.

- `student.dashboard`의 "AI 패널에서 재계획"은 우측 패널의 계획 판단을 열어야 합니다.
- 같은 화면의 "근거 보기"는 특정 학습 경로 카드의 판단 근거로 이동해야 합니다.
- "시작"은 학습 실행 CTA인데, 이것을 SNB 토글로 바꾸면 사용자는 "왜 강의가 시작되지 않고 레이아웃만 바뀌지?"라고 느낍니다.
- `decisionCard()`의 `action2.includes('AI') ? 'expandAiPanel()'`는 "AI에게 수정 지시"를 일반 Focus 패널 열기로 처리합니다. 이 경우 어느 결정 카드의 어떤 수정 지시인지 컨텍스트가 사라집니다.

따라서 `expandAiPanel()`을 `toggleSnb()`로 위임하면 안 됩니다. 특히 `toggleSnb()`는 토글 함수라서 이미 Focus 상태일 때 "근거 보기"를 누르면 오히려 닫힐 수 있습니다. "근거 보기"는 항상 idempotent open이어야 합니다.

대안:

- `toggleSnb()`는 사용자 쉘 상태만 바꾸는 단일 토글로 유지합니다.
- 기존 호출부 보존을 위해 `expandAiPanel()`은 제거하지 말고 `openAiContext(targetId, mode)`의 얇은 wrapper로 바꿉니다.
- `근거 보기`는 `data-ai-target="student-dashboard-path-lecture"` 같은 명시적 target으로 해당 xAI 카드 또는 우측 `FOCUS_CONTEXT` 항목을 열고 하이라이트해야 합니다.
- `시작`, `검토`, `발송` 같은 실행 CTA는 레이아웃 토글과 분리하고, 필요한 경우 실행 후 근거 패널을 보조로 열어야 합니다.

### A2. `state.navCollapsed`와 `state.aiExpanded`를 항상 같게 둘 거면 변수 하나가 맞다

플랜은 두 state를 동기화하되 `state.aiExpanded`는 유지하자고 합니다. 이 방식은 코드상으로 가장 애매합니다. 항상 같은 값이라면 `state.aiExpanded`는 상태가 아니라 파생값입니다. 남겨두면 다음 구현자가 `setAiExpanded(true)`를 호출해 다시 4상태 모델로 되돌릴 가능성이 큽니다.

대안은 둘 중 하나로 확정해야 합니다.

- 사용자 확정안 기준: `state.navCollapsed` 하나만 source of truth로 두고, DOM 클래스 `ai-expanded`, `ai-focus`는 `state.navCollapsed`에서 파생시킵니다. 내부 명칭은 더 정확히 `state.focusMode`로 바꾸는 편이 좋습니다.
- 향후 분리 가능성을 진짜로 열어둘 기준: state는 분리하되 UI에서는 AI 패널 토글을 숨기고, AI 실행 CTA만 `aiExpanded=true`를 켤 수 있게 둡니다. 다만 이는 사용자의 "SNB 토글 하나만 존재" 결정과 충돌하므로 이번 라운드에서는 권하지 않습니다.

### A3. Esc 복귀는 맞지만 입력 중 Esc 예외가 필요하다

Esc로 SNB와 AI 패널을 동시에 원상복귀시키는 방향은 자연스럽습니다. 다만 현재 우측 Companion 입력, select, details 등 포커스 가능한 요소가 많습니다. 입력창에서 Esc를 눌렀는데 전체 레이아웃이 접히면 작업 중단으로 느껴질 수 있습니다.

대안:

- `input`, `textarea`, `select`, `[contenteditable]` 포커스 중에는 Esc 전역 복귀를 무시합니다.
- Focus 상태에서만 Esc를 처리하고, 기본 상태에서는 아무 동작도 하지 않습니다.

### A4. Header 버튼 제거는 맞지만 문제 원인을 "툴팁"으로만 보면 안 된다

새로고침·알림 버튼 제거는 적절합니다. 현재 두 버튼은 클릭 후 이어지는 업무가 없고, 우측 끝 긴 `data-tip` 때문에 경계 침범을 일으킵니다. 다만 제거 후에도 전역 `[data-tip]` 툴팁 규칙은 남습니다. 이후 우측 끝에 다른 버튼을 추가하면 같은 문제가 재발합니다.

대안:

- 이번에는 버튼 제거로 해결하되, 후속 패치 리스트에 "우측 정렬 요소의 tooltip alignment 규칙"을 남깁니다.
- 알림의 역할은 교수자 dashboard의 Decision Card로 흡수하는 것이 맞습니다. 별도 알림 아이콘은 데모 서사를 흐립니다.

### B1. 4분류는 너무 좁다

`AI 생성 / AI 추천 / AI 분석 / AI 초안`만으로는 실제 핵심 화면의 AI 역할을 다 담지 못합니다.

- `instructor.cocreation`의 "2주 후 효과 검증"은 생성도 추천도 초안도 아니며, 단순 분석보다 "검증/측정"에 가깝습니다.
- `student.lecture`의 "AI 이해도 예측"은 분석 결과라기보다 예측 판단입니다.
- `student.lecture`의 자막 번역은 생성으로 볼 수 있지만 사용자가 기대하는 기능명은 "AI 자막"입니다.
- `instructor.dashboard`의 Decision Card는 추천이라기보다 판단과 우선순위화입니다.

대안:

- 배지의 1차 타입은 5개로 확장합니다: `AI 생성`, `AI 추천`, `AI 분석`, `AI 예측`, `AI 초안`.
- 효과 측정은 별도 배지로 늘리기보다 `AI 분석 · 효과 검증`처럼 보조 라벨을 붙입니다.
- "AI 판단"은 배지보다는 xAI 카드의 첫 행 `Judgment`로 드러내는 편이 낫습니다. 모든 카드에 `AI 판단` 배지를 붙이면 차이가 흐려집니다.

### B2. xAI 순서 고정은 맞지만 현재 Focus Dock 순서와 다르다

스펙의 순서는 `Judgment → Recommended Action → Evidence → Uncertainty → Measurement Plan → Override`입니다. 현재 Focus Dock은 Judgment와 Action 다음에 실행 버튼과 override 버튼이 먼저 나오고, Evidence/Uncertainty/Measurement는 details 안에 들어갑니다. 플랜이 "순서 고정"을 말하지만 실제 HTML 구조를 그대로 두면 스펙 일치가 아닙니다.

대안:

- Focus Dock 내부도 순서를 실제로 재배열합니다.
- 실행 버튼은 Action 아래에 둘 수 있지만, Override는 Evidence/Uncertainty/Measurement 이후로 내려야 합니다.
- 모든 xAI 카드에 footer `xaiMeta()`를 붙인다는 스펙은 5개 핵심 화면에 우선 적용하되, "모든 AI 출력"이라고 과장하지 않습니다.

### C4. Co-Creation 5단계 플로우는 과잉이 될 수 있다

현재 `instructor.cocreation`은 이미 구조가 읽힙니다: 난관 구간 입력 → AI 초안 3종 → 선택 초안 편집/배포 → 지난 배포의 2주 후 결과 → 우측 효과 측정 계획. 여기에 별도 "플로우 띠"를 추가하면 같은 정보를 한 번 더 설명하는 장식이 될 위험이 큽니다.

대안:

- 별도 대형 플로우 띠를 추가하지 않습니다.
- 각 섹션 제목 앞에 `1 입력`, `2 AI 3안`, `3 편집/승인`, `4 배포`, `5 효과검증` 정도의 작은 단계 번호만 붙입니다.
- 데모에서는 실제 시선이 "3안 비교"와 "2주 후 검증"에 머물러야 합니다. 플로우 장식이 그 두 지점을 밀어내면 손해입니다.

### D. 숨김 방식은 CTA와 직접 접근 정책이 빠져 있다

NAV에서 11개 화면을 숨기는 것만으로는 5개 핵심 시나리오가 되지 않습니다. 현재 핵심 화면 안에도 숨길 예정인 화면으로 이동하는 CTA가 남아 있습니다.

- `student.dashboard`의 과제 카드는 `go('assignment')`로 이동합니다.
- `instructor.dashboard`의 첫 Decision Card는 `go('intervention')`입니다.
- 세 번째 Decision Card는 `go('rubric')`입니다.

이 상태에서 nav만 숨기면 사용자는 발표 중 비핵심 화면으로 빠집니다. 반대로 직접 접근을 막으면 기존 CTA가 깨집니다.

대안:

- 숨김 화면 정책을 명시합니다: "NAV에서 숨김, 직접 `go()`는 정상 진입, 단 상단에 `핵심 데모로 돌아가기` 배너 제공".
- 데모 핵심 CTA는 숨김 화면으로 보내지 말고 5개 핵심 화면 안에서 해결합니다. 예를 들어 dashboard의 "학습 개입"은 우측 xAI 판단을 열고, 실제 개입 상세는 발표 후 공개로 처리합니다.
- `hidden:true`는 `renderNav()` 필터에만 쓰지 말고 `currentPageLabel()`과 `go()`의 hidden route 처리에도 반영해야 합니다.

## 2. 더 심플하게 할 여지

1. 학생 dashboard의 "수강 중인 강의" 4카드는 제거가 맞습니다. 오늘의 학습 경로 3개와 역할이 겹치고, AI 판단→근거→실행 서사에 직접 기여하지 않습니다.

2. 교수자 dashboard의 "운영 중 강의" 4카드도 제거가 맞습니다. 상단 Stats의 운영 강의 수, Decision Card의 우선순위와 중복됩니다. 20분 데모에서는 "오늘의 결정 3개"만 남기는 쪽이 훨씬 강합니다.

3. 우측 Aside의 Companion은 화면마다 상시 채팅으로 반복되면 AI 상호작용이 아니라 배경 소음이 됩니다. 학생 dashboard는 Companion 대화 전체보다 "왜 오늘 이 경로인가" xAI 요약 카드가 우선입니다. lecture에서만 Companion을 살리고, dashboard에서는 한 줄 입력 또는 추천 질문 2개 정도로 줄이는 편이 낫습니다.

4. instructor dashboard Aside의 질문 트렌드, 감정 온도, 오늘 일정은 동시에 두면 "AI 판단 패널"이 아니라 운영 위젯 모음으로 보입니다. Decision Card를 선택했을 때 해당 결정의 근거만 보여주는 구조가 더 단순합니다. 일정 카드는 제거 후보입니다.

5. Co-Creation Aside의 Teaching Profile은 데모 차별점이지만 현재는 문장, 평균 문장 길이, 경어 레벨, 선호/회피 용어, 편집 버튼까지 길게 나옵니다. 핵심은 "교수자 말투를 반영했다"이므로 3개 칩과 한 문장 선언으로 압축하고, 공간은 효과 측정 xAI에 줘야 합니다.

6. Grading Aside는 공정성 모니터와 학생 피드백 초안이 모두 의미 있지만, 첫 화면에서는 "불확실 8건"과 루브릭 근거가 우선입니다. 피드백 초안은 확정 버튼 이후에 나타나는 보조 패널로 늦춰도 됩니다.

7. SNB 하단 path mini는 5개 핵심 데모에서는 여정 신호가 아니라 남은 장식으로 보일 수 있습니다. nav를 5개로 줄인 뒤에도 path card가 스토리에 기여하지 않으면 접거나 제거하는 편이 낫습니다.

## 3. AI 상호작용 식별 해법 평가

플랜 B3의 `.ai-touchpoint` + dotted underline 또는 우상단 ✦ 마커는 "한눈에 식별" 요구를 충분히 만족하지 못합니다.

현재 `.ai-touchpoint`는 카드 우상단에 작은 `AI` 라벨을 붙입니다. 이미 카드 내부에 `.ai-badge`, `tag-xai`, xAI 패널, sparkle icon이 섞여 있어 작은 마커를 더 붙여도 사용자는 "무엇을 누르면 무엇이 열리는지" 알기 어렵습니다. dotted underline은 더 위험합니다. lecture의 용어 툴팁, draft의 하이라이트 설명과 시각 문법이 겹쳐서 "AI 상호작용"이 아니라 "용어 설명"처럼 보일 수 있습니다.

레퍼런스 HTML은 점선 밑줄보다 명시적 라벨과 액션이 강합니다.

- 교수자 레퍼런스는 `✦ AI 학습 설계 어시스턴트`, `✦ AI Rubric 자동 생성`, `✦ AI 생성됨`처럼 기능명과 액션을 직접 노출합니다.
- 학생 레퍼런스는 `✦ AI 질의` 탭, `AI 강의 요약`, `✦ AI 맞춤 학습 경로 추천`처럼 "AI가 있는 영역"을 구획으로 보여줍니다.
- 즉, AI 표기는 단순 마커가 아니라 "AI 영역명 + 실행 동사 + 결과 표시"의 조합입니다.

대안 문법:

- AI 출력: 제목 앞 또는 카드 우상단에 `✦ AI 예측 74%`, `✦ AI 초안`, `✦ AI 생성`처럼 역할과 신뢰도를 함께 표기합니다.
- AI 실행 CTA: 버튼 문구를 `근거 보기`, `AI로 재계획`, `초안 생성`, `AI에게 수정 지시`처럼 동사로 끝냅니다. 버튼 안에 sparkle icon을 쓰고, 단순 hover에 의존하지 않습니다.
- AI 근거 영역: xAI 패널은 Pattern ② 근거 리스트, Pattern ③ 신뢰도 바, Pattern ⑤ 대안 초안, Pattern ⑥ 투명성 로그 중 최소 하나를 포함합니다.
- AI 용어/문장 하이라이트: Pattern ④로 제한합니다. dotted underline은 이 용도에만 쓰고, 카드 전체 AI touchpoint 표기에는 쓰지 않습니다.
- 단순 정보 카드에는 AI 마커를 붙이지 않습니다. `오늘 AI가 남긴 실행` 같은 stat은 AI 결과이긴 하지만 클릭 대상이 아니라면 touchpoint가 아니라 배지 없는 지표로 두는 편이 낫습니다.

## 4. 구현 순서 권고

Claude 플랜의 A → B → C → D 순서는 큰 틀에서는 가능하지만, A1/A2가 상태 모델을 건드리므로 바로 시작하면 회귀 위험이 큽니다. 더 안전한 순서는 다음과 같습니다.

1. AI route inventory 먼저 작성
   5개 핵심 화면의 AI CTA를 모두 나열하고 `targetId`, 열릴 xAI 카드, 이동할 핵심 화면을 정합니다. 이 단계에서 숨김 화면으로 가는 CTA를 먼저 잡아냅니다.

2. 작은 Chrome 정리
   Header의 새로고침·알림 버튼 제거, AI 패널의 수동 토글 버튼 제거만 먼저 합니다. 이때 JS 함수는 아직 지우지 말고 wrapper로 남깁니다.

3. 단일 state 모델 정리
   `state.aiExpanded`를 source of truth에서 제거하거나 파생값으로 바꿉니다. `expandAiPanel()`은 `openAiContext()`로 의미를 보존하고, `toggleSnb()`와 직접 연결하지 않습니다.

   체크포인트: SNB 토글 2회, Esc, `근거 보기`, AI badge click이 모두 "닫힘/열림 반전" 없이 동작해야 합니다.

4. NAV 숨김과 숨김 route 정책 적용
   `hidden:true` 필터를 적용하되, core 화면 안의 CTA가 hidden route로 빠지지 않게 수정합니다. 직접 접근 시에는 정상 진입 + "핵심 데모로 돌아가기" 탈출구를 둡니다.

   체크포인트: 학생/교수자 전환 후 nav에는 5개만 보이고, 발표 시나리오 클릭 흐름이 hidden 화면으로 새지 않아야 합니다.

5. AI 표기 문법을 한 화면씩 적용
   먼저 `student.dashboard`와 `instructor.dashboard`에서 배지/CTA/xAI 순서를 맞춥니다. 여기서 패턴이 납득되면 lecture, cocreation, grading으로 확장합니다.

6. 콘텐츠 pruning
   중복 위젯 제거는 마지막에 화면별로 작게 합니다. Co-Creation은 핵심 차별화 화면이므로 맨 마지막에 손대고, 별도 플로우 띠 추가 전후를 비교해야 합니다.

한 번에 묶어 편집하면 위험한 부분은 state 모델(A1/A2), hidden route(D), `decisionCard()` helper입니다. 특히 `decisionCard()`는 dashboard와 hidden 화면 이동을 동시에 건드리므로 별도 커밋 단위가 맞습니다.

## 5. 스펙/레퍼런스 위배 여부

1. Focus AI Mode 스펙과 사용자 확정 방향이 충돌합니다. 스펙은 "SNB와 AI Panel이 각자 자기 영역에서 확장·축소"되고 AI Panel 내부 핸들이 있다고 정의합니다. 그러나 이번 확정안은 AI 패널 토글 제거, SNB 단일 토글입니다. 구현만 바꾸면 스펙 위배가 되므로 `xAI_LMS_Design_Spec.html`의 Focus Mode 규칙도 후속 갱신해야 합니다.

2. 스펙의 AI Panel Order는 실제 Focus Dock 구조와 다릅니다. 현재는 Action 직후 실행/override 버튼이 나오고 Evidence는 details 아래로 밀립니다. 플랜은 "순서 고정"을 말하지만 실제 구현 지점까지 명시해야 합니다.

3. 스펙의 AI Touchpoint 규칙은 "AI와 상호작용 가능한 항목만 ✦/AI 뱃지와 실행 동사 CTA"입니다. 현재 `.ai-touchpoint`는 stat이나 card 외곽에 작은 `AI` 라벨을 붙이는 방식이라 실행 동사가 약합니다. 플랜의 dotted underline도 이 규칙을 충분히 만족하지 않습니다.

4. xAI 7원칙 중 "신뢰도를 수치로 말한다"가 5개 핵심 화면 전체에서 균일하지 않습니다. dashboard의 Decision Card는 신뢰도 수치가 sub 텍스트에 섞이거나 빠져 있고, lecture의 AI 요약도 신뢰도/검증 루프가 tooltip에 숨어 있습니다.

5. "사람을 최종 결정자로" 원칙은 grading에서는 강하지만 cocreation의 `초안 생성`, `편집 후 공개`, `AB 테스트 on` 버튼에서는 더 명확히 분리해야 합니다. "생성"과 "공개"가 한 화면에 같이 있어도 승인 전 비공개가 읽히지 않으면 AI 자동 배포처럼 오해될 수 있습니다.

6. 레퍼런스 화면은 AI 기능을 구역, 탭, 버튼명으로 드러냅니다. 반면 플랜 B3는 마커 중심입니다. 레퍼런스와 맞추려면 `✦ AI 질의`, `✦ AI 초안 생성`, `✦ AI 근거` 같은 영역명과 액션명이 우선이어야 합니다.

## 6. 발표 맥락 인상

이 플랜대로 잘 다듬으면 "오, 이건 다르네" 할 지점은 있습니다.

1. Co-Creation Studio의 "난관 구간 입력 → AI 3안 생성 → 교수자 말투 반영 편집 → 2주 후 효과 검증"은 일반 LMS의 콘텐츠 생성 도구보다 강합니다. 특히 2주 후 uplift/CI가 돌아오는 부분은 단순 생성형 AI가 아니라 교육 개선 루프로 보입니다.

2. Grading의 "AI 초안 24건 + 불확실 8건 교수 필수 검토 + 루브릭 근거 인용 + 공정성 모니터"는 사람 최종 결정자 원칙이 분명합니다. 회장님에게는 자동 채점보다 "검토해야 할 것만 줄여준다"가 더 설득력 있습니다.

3. 학생 lecture의 실시간 구간 힌트와 메타인지 체크는 학생 AI가 답을 대신하는 것이 아니라 학습 상태를 조절한다는 인상을 줄 수 있습니다. 다만 AI 요약/자막 자체는 흔하므로 메타인지와 근거를 앞세워야 합니다.

"그건 이미 다 해봤어"로 보일 위험도 있습니다.

1. AI 요약, AI 자막, AI 추천 강의, 챗봇 Companion은 이미 익숙한 요소입니다. 이 기능만 전면에 두면 차별점이 약합니다.

2. dashboard의 Stats 4개와 카드 나열은 기존 LMS/BI 대시보드처럼 보일 수 있습니다. "AI가 왜 이 결정을 오늘 먼저 놓았는가"가 바로 열리지 않으면 새로움이 줄어듭니다.

3. 배지를 많이 붙이는 방식은 AI 제품처럼 보이게 할 수는 있지만, 근거·신뢰도·측정 계획이 같이 보이지 않으면 포장으로 읽힙니다.

## 최종 수정 권고 (Patch List)

1. [A1. AI 패널 토글 버튼 제거] → `expandAiPanel()`을 `toggleSnb()`로 위임하지 말고 `openAiContext(targetId)` wrapper로 유지한다. → 기존 호출부가 "근거 보기/재계획/시작/수정 지시"를 서로 다른 의미로 쓰고 있어 단순 토글은 UX를 깨뜨린다.

2. [A1. 호출부 처리] → 모든 AI CTA에 `data-ai-target` 또는 명시적 인자(`openAiContext('student.path.lecture')`)를 부여한다. → 어떤 xAI 카드가 열려야 하는지 추적 가능해야 한다.

3. [A2. `state.aiExpanded` 유지] → 단일 source of truth로 `state.focusMode` 또는 `state.navCollapsed`만 남기고 `aiExpanded`는 파생 DOM class로 처리한다. → 항상 같은 두 state를 유지하면 회귀와 분기 버그가 늘어난다.

4. [A3. Esc 단축키] → 입력 요소 포커스 중에는 Esc 전역 복귀를 무시한다. → Companion 입력과 select 조작 중 레이아웃이 갑자기 접히는 문제를 막는다.

5. [B1. 배지 4종 표준화] → 1차 배지를 `AI 생성/추천/분석/예측/초안` 5종으로 조정하고, 효과 검증은 `AI 분석 · 효과 검증`처럼 보조 라벨로 처리한다. → 이해도 예측과 2주 후 검증을 4분류에 억지로 넣으면 의미가 흐려진다.

6. [B2. xAI 카드 내부 순서] → Focus Dock 실제 DOM 순서를 `Judgment → Action → Evidence → Uncertainty → Measurement → Override`로 재배열한다. → 현재 구조는 스펙의 순서 고정과 다르다.

7. [B3. `.ai-touchpoint` 마커] → dotted underline/작은 ✦ 대신 "AI 영역 라벨 + 실행 동사 CTA + 근거 패널" 문법으로 바꾼다. → 한눈에 보이는 것은 마커가 아니라 무엇을 할 수 있는지 드러내는 액션명이다.

8. [C1. `student.dashboard`] → 수강 강의 4카드를 제거하고, 과제 카드의 `go('assignment')`는 hidden route로 새지 않게 재설계한다. → 오늘 학습 경로와 중복되고 5개 핵심 시나리오 밖으로 빠진다.

9. [C2. `student.lecture`] → AI 요약/자막/메타인지에 각각 배지만 붙이지 말고 신뢰도 또는 검증 상태를 한 줄로 노출한다. → tooltip 속 설명은 발표장에서 보이지 않는다.

10. [C3. `instructor.dashboard`] → 운영 중 강의 4카드와 Aside 일정 카드를 제거하고, Decision Card 선택 근거를 우측에 집중시킨다. → 교수자 화면의 핵심은 운영 현황이 아니라 의사결정 우선순위화다.

11. [C4. `instructor.cocreation`] → 별도 대형 5단계 플로우 띠를 추가하지 말고 섹션 번호만 붙인다. → 현재도 흐름이 읽히며, 추가 띠는 3안 비교와 효과 검증을 밀어내는 노이즈가 될 수 있다.

12. [C4. Teaching Profile Aside] → 긴 프로필 설명을 3개 칩과 한 문장으로 압축한다. → 생성형 차별점은 말투 분석 자체보다 교수자 가치가 초안에 반영되는 결과다.

13. [C5. `instructor.grading`] → "불확실 8건"을 테이블 필터가 아니라 상단 검토 큐로 승격한다. → 사람 최종 결정자 원칙이 첫 화면에서 보여야 한다.

14. [D. 비핵심 화면 숨김] → `hidden:true`의 직접 접근 정책과 탈출구를 명시한다. → nav에서 숨긴 화면에 CTA로 진입했을 때 사용자가 길을 잃지 않아야 한다.

15. [D. 숨김 화면 목록] → hidden 화면으로 가는 핵심 CTA를 모두 재검토한다. → nav만 숨기면 발표 중 `assignment`, `intervention`, `rubric`으로 새는 문제가 남는다.

16. [Critical Files / 참고만] → Focus Mode 변경 후 `xAI_LMS_Design_Spec.html`도 후속 갱신 대상으로 추가한다. → 사용자 확정안이 기존 스펙의 "AI Panel 내부 핸들" 규칙과 충돌한다.

17. [Verification] → "URL 직접 입력(`go('explore')`)은 여전히 동작"만 확인하지 말고 "hidden 화면에는 핵심 데모 복귀 배너가 보임"을 검증 항목에 추가한다. → 숨김 정책이 데모 흐름과 유지보수 양쪽에서 명확해진다.
