# Codex UX 재정비 교차리뷰 라운드 2 (구현 후 점검)

## 역할
당신은 시니어 UX 아키텍트 + 프런트엔드 리뷰어입니다. 한국어로 답변하세요.

## 맥락

1라운드에서 당신(Codex)이 17개 patch를 권고했고, Claude가 그중 일부는 채택, 일부는 자신의 대안으로 수정, 일부는 거부 후 사용자 승인을 받아 구현을 진행했습니다.

**1라운드 당신의 비판**: `C:\Users\josta\OneDrive\바탕 화면\위키드스톰\AIEx 사업 본부\2026.03\japan_lms_claude_max\review\ux_refinement_codex.md`

**Claude의 채택/수정/거부 결정 요약**:

### 전면 채택 (12개)
- A2 `state.aiExpanded` 삭제 → state.navCollapsed 단일 source of truth
- A3 Esc input focus 예외 처리
- A4 Header 새로고침·알림 버튼 제거
- B1 배지 5종 확장 (+ AI 예측)
- B2 Focus Dock DOM 실제 재배열 (Evidence/Uncertainty/Measurement을 실행 버튼 앞으로)
- C4 5단계 플로우 띠 추가 안 함 (섹션 번호만 1~5)
- Simplification 1, 2 (수강/운영 강의 4카드 제거)
- Simplification 5 (Teaching Profile 3칩+1문장 압축)

### Claude 대안으로 수정 (3개)
- **A1**: `openAiContext(targetId)` 복잡 설계는 과잉 — `openAiContext()` (targetId 없이) idempotent-open wrapper로 단순화. line 1776 "시작" 버튼은 실행 CTA이므로 openAiContext 아닌 `showToast('5분 AI 복습을 시작합니다')`로 교체.
- **B3**: "새 문법 만들기" 아닌 "기존 `.ai-badge`+`.ai-touchpoint`+`.xai-panel` 문법을 5개 화면에 일관 적용". Dotted underline은 AI 마커 용도로는 제거(Pattern ④ 용어 tooltip 전용). stat 카드(`.stat.ai-touchpoint`)에서 `.ai-touchpoint` 제거.
- **D**: "핵심 데모로 돌아가기" 배너는 과잉. 대신 핵심 화면 내 leaking CTA(student.dashboard 과제 카드, instructor.dashboard Decision Card의 intervention/rubric 링크)를 모두 `openAiContext()`로 in-place 재작성. hidden 화면은 URL 직접 입력해야만 진입.

### 거부 (2개)
- **Simplification 3** (학생 dashboard Companion "추천 질문 2개"로 축소): 거부. AI 동반자 존재감은 서사 핵심. Aside 상단에 xAI 요약 추가하지 않고, Companion 2턴 유지.
- **Simplification 4** (instructor dashboard 일정 카드 제거): 부분 거부. 제거 대신 Aside 하단으로 내리고 2줄로 압축.
- **Simplification 6** (Grading 피드백 초안 "확정 후" 지연 표시): 거부. 20분 데모에서 지연 인터랙션은 과잉. 즉시 노출 유지.
- **B2 Override 후순위**: 부분 거부. Focus Dock 내부에서 Override는 codex 말대로 마지막으로 배치. 단 Mei-waku Care 인라인 링크는 다른 곳에도 계속 유지 (중복 노출).

## 실제 구현된 변경 (파일: `xAI_LMS_Prototype.html`)

### A. Chrome + State
- `topbar-right`에서 새로고침·알림 버튼 제거
- `state` 객체에서 `aiExpanded` 필드 삭제. `state.navCollapsed` 하나만 존재
- `syncShellMode()` 재작성 — navCollapsed에서 `.ai-expanded`, `.ai-focus` 파생
- `toggleSnb()` → navCollapsed 토글 + renderPage() 호출
- `openAiContext()` 신규 — idempotent-open, aside 상단 scroll
- `exitFocusMode()` 신규
- 삭제 함수: `toggleAiPanel`, `setAiExpanded`, `setAiFocus`, `toggleAiFocus`, `focusAiMode`, `exitAiMode`
- 삭제 함수 호출부 모두 `openAiContext()` 또는 `exitFocusMode()`로 교체. line 1776 "시작"은 `showToast`로 교체.
- Esc 핸들러: input/textarea/select/contenteditable 포커스 시 무시
- `.ai-badge` 전역 클릭 → `openAiContext()` 호출
- `aiPanelToolbar()` → 라벨만, 버튼 제거
- `focusModeDock()` 재작성:
  - `focus-exit` 버튼 제거 (Esc 또는 SNB 토글로 복귀)
  - DOM 순서: Judgment → Action → Evidence/Uncertainty/Measurement (details) → 실행 버튼 → Override box
  - Override box에 "Override · Mei-waku Care" 헤더 추가

### D. Nav 숨김 + CTA 재작성
- NAV 객체에 `hidden:true` 플래그 추가 (비핵심 11개)
- `renderNav` 필터링: `visibleGroups = data.map(g => ({...g, items: g.items.filter(it => !it.hidden)})).filter(g => g.items.length > 0)`
- student.dashboard 과제 카드: `onclick="go('assignment')"` → `onclick="openAiContext()"` + 버튼 "들어가기" → "근거 보기"
- instructor.dashboard Decision Card 1 (intervention): onClick → `"openAiContext()"`, action2 "나중에" → "AI 근거 보기"
- instructor.dashboard Decision Card 3 (rubric): onClick → `"openAiContext()"`, action "루브릭 열기" → "AI 초안 보기"

### B. AI 배지
- `.stat.ai-touchpoint` → `.stat` (line 1734 "오늘 AI가 남긴 실행") — 클릭 대상 아님
- student.dashboard "개념 보강 권장" → "AI 예측 · 이해도 61%"
- student.lecture AI 요약 배지 → "AI 생성 · 요약 87%"
- student.lecture 라이브 스크립트에 배지 신규 추가: "AI 자막 · 4개 언어 번역"
- student.lecture 동료 힌트 xAI에 confidence bar 추가 + "AI 분석" 라벨
- instructor.grading 이도윤 채점 배지 → "AI 초안 · 신뢰도 94%"
- instructor.cocreation `coStudioVariant` 헬퍼에 "AI 생성 · 교수 승인 대기" 배지 추가
- instructor.cocreation 효과 검증 섹션에 "AI 분석 · 효과 검증" 배지 추가
- instructor.dashboard Aside 질문 트렌드에 "AI 분석" 배지 추가

### C. 콘텐츠 정돈
- C1 student.dashboard: 수강 중인 강의 4카드 전체 제거
- C3 instructor.dashboard: 운영 중 강의 4카드 전체 제거, Aside 일정 카드 2줄로 압축
- C5 instructor.grading: 테이블 상단에 "검토 필수 · 8건" 하이라이트 배너 승격 + "8건 순서대로 검토" 버튼
- C4 instructor.cocreation:
  - 섹션 번호 1~5 추가 (1 입력, 2 AI 3안, 3 편집·승인 · 4 배포, 5 효과 검증)
  - 플로우 띠 추가 안 함
  - "승인 전 비공개" 태그를 card-sub에 명시
  - Aside Teaching Profile 압축: 3개 tag chip + 1문장 인용

## 당신의 임무 (이번 라운드)

파일 `xAI_LMS_Prototype.html`을 **실제로 다시 읽고** 다음 항목을 점검하세요:

### 1. State 모델 정합성
- `state.aiExpanded` 참조가 완전히 제거됐는가
- 삭제된 함수(`toggleAiPanel`, `collapseAiPanel`, `expandAiPanel`, `setAiFocus` 등) 참조가 HTML·JS 전역에서 사라졌는가
- `openAiContext()`가 정말 idempotent-open인가 (이미 focus mode일 때 토글로 작동하지 않는가)
- Esc 핸들러의 input 예외 처리가 올바른가

### 2. Hidden Route 누출 재검증
- 5개 핵심 화면(`student.dashboard`, `student.lecture`, `instructor.dashboard`, `instructor.cocreation`, `instructor.grading`)에서 hidden 화면으로 이동하는 `go('X')` 호출이 남아 있는가
- 남아 있다면 위치와 맥락

### 3. AI 배지 일관성
- 5개 핵심 화면에서 배지 문구가 5종 표준(생성/추천/분석/예측/초안)을 따르는가
- 중복 배지 or 누락 배지

### 4. Focus Dock 순서
- DOM 순서가 실제로 Judgment → Action → Evidence → Uncertainty → Measurement → Buttons → Override인가
- 기존 `<details>`가 `<details open>` 하나만 있고 나머지는 접힌 상태로 시작하는데 데모에서는 펼쳐져 있어야 하지 않은가?

### 5. Co-Creation 명료성
- 섹션 번호 1~5가 발표 시 읽히기에 충분히 명시적인가
- "승인 전 비공개" 표기가 충분히 눈에 띄는가
- Teaching Profile 압축이 정보 손실 없이 핵심을 전달하는가

### 6. Grading "불확실 8건" 승격
- 배너가 테이블 위에 충분히 prominent한가
- 사람 최종 결정자 원칙이 첫 화면에서 즉시 읽히는가

### 7. Claude가 거부한 3개 항목 재검토
- Companion 유지, 일정 카드 압축 유지, Grading 피드백 즉시 노출 — 발표 맥락에서 Claude의 거부 결정이 타당한가, 아니면 codex 원안이 여전히 더 맞는가? 한 번 더 의견.

### 8. 그 외 발견한 버그·회귀

## 출력 형식

다음 파일에 저장: `C:\Users\josta\OneDrive\바탕 화면\위키드스톰\AIEx 사업 본부\2026.03\japan_lms_claude_max\review\ux_refinement_codex_round2.md`

```markdown
# Codex UX 재정비 교차리뷰 (구현 후)

## 한 줄 판정
(OK-ship / OK-with-fixes / Rework needed)

## 1. State 모델 정합성
...

## 2. Hidden Route 누출
...

## 3. AI 배지 일관성
...

## 4. Focus Dock 순서
...

## 5. Co-Creation 명료성
...

## 6. Grading 배너
...

## 7. Claude 거부 항목 재검토
...

## 8. 버그·회귀
...

## Fix List (우선순위)
1. [Critical] ...
2. [Should-fix] ...
3. [Nice-to-have] ...
```

금지:
- 스타일(색/폰트) 지적 금지
- 1라운드 내용 그대로 재인용 금지
- Claude 결정을 무조건 칭찬 or 무조건 뒤집기 금지 — 근거 기반 판단
