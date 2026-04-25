# Codex UX 재정비 플랜 비판 라운드 (독립 리뷰)

## 역할
당신은 시니어 UX 아키텍트 + 프런트엔드 리뷰어입니다. 한국어로 답변하세요.

## 맥락 (반드시 이해하고 시작)

- **프로젝트 루트**: `C:\Users\josta\OneDrive\바탕 화면\위키드스톰\AIEx 사업 본부\2026.03\japan_lms_claude_max\`
- **현재 프로토타입**: `xAI_LMS_Prototype.html` (약 3900+ 라인의 단일 HTML — 일본 대학 시장용 AI-LMS 프로토타입)
- **설계 스펙**: `xAI_LMS_Design_Spec.html` (xAI 7원칙, 3컬럼 IA, Pattern ①~⑦)
- **레퍼런스 화면**: `reference_html_screens/lms_{instructor,student}_all_screens_260423_post_meeting_update.html`
- **회의 요약**: `AI_LMS_Action_Items.md` (가장 최근 지시: "2~3 핵심 시나리오만, AI 기능 구분 명확화")
- **이전 라운드 기록**: `review/round1_claude.md`, `review/round1_codex.md`, `review/round2_codex.md`, `review/focus_ai_mode_implementation.md`, `review/next_steps_final.md`

## 이번 라운드의 목적

사용자는 Claude + Codex로 여러 라운드 고도화를 진행했지만 **현재 프로토타입의 UI/UX가 마음에 들지 않음**. 불만 4가지:

1. **호버 레이아웃 튐**: 새로고침·알림 버튼 호버 시 화면 경계를 벗어남
2. **토글 위치가 부자연**: SNB 토글은 SNB에, AI 패널 토글은 AI 패널에 붙여야 자연스러움 (최종 확정: **AI 패널 토글은 아예 제거, SNB 토글 하나만 존재하며 AI 패널이 따라 움직임**)
3. **AI 상호작용 항목 식별 어려움**: 어떤 UI 요소가 AI와 상호작용 가능한지 한눈에 안 보임
4. **의미 없는 요소 나열**: 화면 전반에 "논리 없이 채워진" 위젯이 많음

**스타일은 이후 Claude Design으로 별도 재작업 예정이므로 이번 작업은 논리 구조·정보 계층·AI 표기 일관성에만 집중합니다.**

## Claude가 작성한 플랜

플랜 파일: `C:\Users\josta\.claude\plans\wild-percolating-beacon.md`
(전체 내용을 반드시 읽어주세요. 읽을 수 없다면 아래 요약을 참고)

### 플랜 요약 (내용 원문이 아님 — 파일을 직접 읽으세요)

**핵심 시나리오 5개로 압축** (학생 2 + 교수자 3):
1. `student.dashboard` — AI가 개인화 판단
2. `student.lecture` — 실시간 적응 (요약·자막·메타인지)
3. `instructor.dashboard` — AI 의사결정 우선순위화
4. `instructor.cocreation` — 생성형 AI의 교수자 가치 (최우선 공들임)
5. `instructor.grading` — 사람 최종 결정자 원칙

**주요 변경**:
- **A**: Chrome 단순화
  - A1: `ai-panel-expand`·`focus-exit` 버튼 제거. `toggleAiPanel`·`collapseAiPanel`·`expandAiPanel`·`toggleAiFocus` 함수 제거하거나 내부를 `toggleSnb()`로 위임
  - A2: `toggleSnb()`가 `state.navCollapsed`와 `state.aiExpanded`를 함께 토글 (두 값 항상 동일)
  - A3: Esc → SNB + AI 동시에 default로 복귀
  - A4: `topbar-right`의 새로고침·알림 버튼 제거
- **B**: AI 시각 일관화
  - B1: `.ai-badge` 문구 4종 표준화 (AI 생성/추천/분석/초안). 제목 앞 또는 카드 우상단 한 곳
  - B2: 모든 AI 판단에 "근거 보기" — xAI 카드 내부 순서 고정 (Judgment→Action→Evidence→Uncertainty→Measurement→Override)
  - B3: `.ai-touchpoint` 클래스를 AI-interactive 요소에 일관 적용 (1px dotted underline or 작은 ✦ 마커)
- **C**: 5개 핵심 화면 콘텐츠 정돈 (중복 위젯 제거, 배지 재정렬)
- **D**: 비핵심 11개 화면은 NAV에서만 숨김 (PAGES 객체는 유지)

## 당신의 임무

`C:\Users\josta\.claude\plans\wild-percolating-beacon.md`와 `xAI_LMS_Prototype.html` 실제 상태를 점검하고, **독립 비판**을 다음 파일에 저장하세요:

**출력 파일**: `C:\Users\josta\OneDrive\바탕 화면\위키드스톰\AIEx 사업 본부\2026.03\japan_lms_claude_max\review\ux_refinement_codex.md`

(이번 라운드에서는 Claude 리뷰가 별도로 없습니다. 당신의 단독 비판입니다.)

## 비판 우선순위 (이 순서대로 예리하게)

### 1순위 — 플랜의 "놓친 함정"
Claude가 짠 플랜을 실제 HTML 상태와 대조하며:
- **A1의 위험**: `expandAiPanel()` 호출부가 HTML 전반에 흩어져 있는데(예: line 1727 "AI 패널에서 재계획", line 1745 "근거 보기", line 1776 "시작", line 1781 "판단 열기", line 3794 "근거 보기" 등), 이 함수를 `toggleSnb()`로 단순 위임하는 것이 UX 의도를 왜곡하지 않는가? "근거 보기"는 특정 xAI 카드로 스크롤해야 의미가 있지 전체 모드 전환이 필요 없을 수도.
- **A2의 위험**: 두 state를 묶어버리면 `state.aiExpanded`는 사실상 불필요 변수. 남겨두는 게 코드 복잡도만 늘리는 것 아닌가? 아예 삭제가 맞지 않나? 반대로 나중에 분리 가능성을 열어둬야 한다면 묶지 말고 UI만 통합해야 하지 않나?
- **B1의 모호함**: "AI 생성/추천/분석/초안" 4분류가 실제 콘텐츠를 다 커버하는가? 예: `instructor.cocreation`의 "2주 후 효과 검증"은 어디에 속하는가? `student.lecture`의 "AI 이해도 예측"은? 분류 자체가 누락을 낳지 않는가?
- **C4(cocreation)의 플로우 과잉 가능성**: 5단계 시각화가 오히려 화면을 지저분하게 만들 위험. 현재 이미 충분히 읽히는데 "플로우 띠"를 추가하면 노이즈가 되지 않나?
- **D의 숨김 방식**: `hidden:true` 플래그가 URL 직접 접근 시 무슨 동작을 해야 하는가? go('explore') 호출 시 404처럼 처리? 아니면 정상 진입? 숨긴 화면에서 "핵심 화면으로 돌아가기" 탈출구가 있어야 하지 않나?

### 2순위 — "더 심플하게 할 여지"
사용자는 **"의미 없으면 과감히 걷어낸다"**를 원칙으로 밝혔습니다. 플랜이 여전히 유지하는 항목 중:
- 정말 5개 핵심 시나리오에 필요한가?
- 더 걷어낼 수 있는 것 3가지 이상
- 특히 사이드 패널(Aside)의 Companion·xAI·cards 중 중복·장식 요소 지적

### 3순위 — "AI 상호작용 식별" 해법 품질
플랜의 B3: `.ai-touchpoint` + dotted underline 또는 우상단 ✦ 마커
- 이 해법이 **한눈에 식별**되는가? 아니면 또 하나의 시각 노이즈가 될 뿐인가?
- 레퍼런스 HTML(instructor/student reference)에서 AI 요소를 표기한 방식과 비교해 더 나은 대안 제시
- Spec의 Pattern ①~⑦를 더 활용할 여지

### 4순위 — 구현 순서 권고
Claude는 A → B → C → D 순서를 은연 중 전제. 더 안전한 구현 순서(리스크가 낮은 것부터, 롤백 쉬운 것부터)가 있다면 제안:
- 어느 지점에서 중간 체크포인트를 두어야 하는가
- 한 번에 묶어 편집하면 회귀 위험이 큰 부분은 어디인가

### 5순위 — 스펙·레퍼런스 위배 여부
- `xAI_LMS_Design_Spec.html`의 xAI 7원칙, Pattern ①~⑦과 플랜이 어긋나는 지점
- `reference_html_screens/*`의 실제 패턴과 플랜의 제안이 다른 지점

### 6순위 — 발표 맥락(AES, NetLearning 회장)에서의 "인상" 판정
- 이 플랜대로 구현하면 20분 데모 시연 시 회장님이 **"오, 이건 다르네"** 할 지점이 2개 이상인가? 어디인가?
- 회장님이 **"그건 이미 다 해봤어"** 할 지점은 없는가?

## 출력 형식

`review/ux_refinement_codex.md`에 저장 (Markdown). 섹션 순서:

```markdown
# Codex UX 재정비 플랜 비판 (독립 라운드)

## 한 줄 판정
(현재 플랜대로 구현해도 되는가? Go / Go-with-conditions / Rework 중 하나)

## 1. 놓친 함정
...(위 1순위 항목별 구체 지적 + 대안)

## 2. 더 심플하게 할 여지
...(최소 3개)

## 3. AI 상호작용 식별 해법 평가
...(플랜 B3 평가 + 대안 제시)

## 4. 구현 순서 권고
...(체크포인트 포함 순서)

## 5. 스펙/레퍼런스 위배 여부
...

## 6. 발표 맥락 인상
...("오, 이건 다르네" 지점 + "이미 다 해봤어" 지점)

## 최종 수정 권고 (Patch List)
플랜 파일에 반영해야 할 구체 변경 항목을 번호 매겨 목록화.
각 항목: [원문 위치] → [변경안 한 문장] → [이유 한 줄]
```

## 금지 사항

- 플랜을 그대로 칭찬만 하는 답변 금지
- 플랜을 완전히 뒤집는 답변 금지 (사용자가 이미 방향을 확정함)
- 스타일(색/폰트) 관련 지적 금지 (out of scope)
- Claude의 이전 round1/round2 리뷰 그대로 인용 금지 (독립 비판)

## 출력 위치 재확인
반드시 다음 경로에 파일 생성: `C:\Users\josta\OneDrive\바탕 화면\위키드스톰\AIEx 사업 본부\2026.03\japan_lms_claude_max\review\ux_refinement_codex.md`

시작하세요.
