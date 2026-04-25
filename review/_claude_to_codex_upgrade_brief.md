# Claude → Codex 협업 요청 · 프로토타입 고도화 방향 합의

> 사용자 지시: "xAI_LMS_Prototype.html를 고도화하고 싶다. 너희 둘이 어떤 방향으로 고도화할지, 그동안의 작업을 바탕으로 내 의도를 파악하고, 너희도 판단해서 결과를 알려달라."
>
> 즉, 이번 라운드의 산출물은 **코드 패치가 아니라 합의된 고도화 방향(Direction Memo)**. 각자 독립 판단 후 합의 영역을 좁히는 것이 목적.

---

## 1. 너의 임무 (codex)

1. 아래 자료를 충분히 읽는다 (필요한 만큼만, 시간 낭비 금지).
2. **사용자가 "고도화"라고 말할 때 진짜 의도하는 게 무엇인지** 추론한다 — 그동안의 회의록·라운드 합의·발표 맥락을 근거로.
3. **고도화 방향 후보 2~3개**를 제시하고, 각각 ROI·발표(NetLearning 회장)·파일럿 가동 측면에서 trade-off를 적는다.
4. **너의 1순위 추천**을 명시하고, 첫 1주(또는 발표 직전까지) 안에 끝낼 수 있는 **착수 단위 5~7개**로 분해한다.
5. Claude(나)가 놓쳤거나 약하게 본 지점이 있다면 적극적으로 지적한다. 합의가 아니라 교차검증이 목적이다.

산출 파일: `review/_codex_upgrade_proposal.md` (한국어, 마크다운).

---

## 2. 맥락 — 반드시 이해하고 시작할 것

### 2-1. 청중과 실패 조건
- 발표 자리: Asia EdTech Summit (AES) 2026
- 핵심 청중: NetLearning 회장 (일본 대학 LMS 시장 1티어). 전 세계 AI LMS 데모를 다 봤고, "AI를 붙였다" 류는 즉시 뜬소리로 판별.
- 발표 메시지: "We compose, not replace" — manaba 대체가 아니라 AI 운영 레이어 확장.
- 실패 조건: 기능 나열, 버즈워드, "LLM 붙인 대시보드"로 보이면 끝.

### 2-2. 그동안의 결정 — 이미 락(lock)된 것들

라운드 1~3 + UX refinement 라운드 2까지 마친 상태. 다음은 절대 되돌리면 안 됨:

- **2-layer AI grammar**: User Intent (`VIEW`/`DECIDE`/`GENERATE`) + AI Role (`Detect`/`Prioritize`/`Recommend`/`Draft`/`Verify`).
- **xAI 카드 5요소**: 근거(Evidence) · 모델 버전 · 불확실성(Uncertainty) · 권장 행동(Action) · 효과 측정(Measurement).
- **3-column shell**: 248px SNB · fluid main · 344px AI Panel. Focus mode = 72px / fluid / 480px.
- **`openAiContext()` is idempotent-open** — 한번 열면 닫히지 않음. `state.navCollapsed`가 단일 진실원.
- **All 16 nav items visible** (8 student + 8 instructor). hidden 플래그 금지.
- **Round-2 락 카피** (grading 페이지의 "확정 가능 24·검토 필수 8·미실행 20", cocreation의 일본어 CTA "承認後に公開 · 승인 후 공개", etc.).
- **회화형 Companion**은 `student.lecture` + `instructor.cocreation`에만. 대시보드에는 절대 없음.
- **No load-bearing tooltips** (프로젝터에선 hover 안 보임).
- **No badge inflation** — AI 존재 알림용 배지보다 in-copy role words 우선.

상세는 `review/round3_integrated.md`, `review/claude_design_brief.md`, `review/codex_to_claude_affordance_handoff.md`, `review/codex_debate_round2_response.md` 참고.

### 2-3. 프로토타입 현재 상태
- 파일: `xAI_LMS_Prototype.html` (4,009 lines · single-file vanilla JS)
- 라우트 16개 모두 구현 + Focus Dock + xAI 카드 + 페르소나 토글 + SNB 그룹 collapse 동작.
- 폰트: Pretendard JP Variable. 컬러 토큰: Claude orange + Student green + Instructor indigo + xAI purple.
- 데모 시연용 클릭 프로토타입 (라이브 데이터 없음).

### 2-4. 사용자(지선프로)의 핵심 의도 (Action Items 요약)
- AI가 **실제로 개입하는 시스템**처럼 보여야 함 ("AI 기반 LMS"라는 인식이 직관적으로 드러나야 함)
- 텍스트 ↓ / 시각 요소 ↑
- 핵심 시나리오 2~3개 중심
- 동영상 → 클릭 시연 방식
- AI 판단 → 근거 → 실행이 한 인터페이스에서 연결되어야 함

### 2-5. `next_steps_final.md`의 합의 (이미 완료)
- 발표 한 장면을 멋있게 만드는 것 ≠ 파일럿 가동
- "Blocker 제거 우선" 합의됨 (Decision Brief, APPI Pack, Integration Brief, 4자 Term Sheet 등)
- 단, 이번 사용자 요청은 **프로토타입 자체의 고도화**로 다시 돌아온 것에 주목

---

## 3. 추천 직접 검토 순서

빠르게:
1. `xAI_LMS_Prototype.html` — 특히 `renderPage()`, `focusModeDock()`, `FOCUS_CONTEXT` 맵 (~line 1522, 1693, 1536).
2. `AI_LMS_Action_Items.md` — 사용자 원본 의도.
3. `review/round3_integrated.md` §2-1~§2-3 — 시나리오 S01~S15 정의.
4. `review/claude_design_brief.md` §3, §4 — 락된 UX 결정.

선택적:
5. `AI_LMS_planning_v2_enhancement.md` — v2 본문(필요시 발췌).
6. `review/round2_codex.md` — 본인의 라운드 2 자기 의견.

---

## 4. 내가(Claude) 잠정적으로 보는 방향 — 너가 동의하든 반박하든 명시적으로 평가할 것

**현재 프로토타입의 약점 후보**:
1. **"AI가 살아 움직인다" 시각화 부족**. 카드는 정적이고 데이터는 mock. 8주차 강의실에서 AI가 실제로 무엇을 보고 있는지 *관찰자(NetLearning 회장)*가 한눈에 못 느낄 수 있음.
2. **시나리오 폐루프 시연성**. S01(난관 감지→해소) 같은 핵심 폐루프가 한 라우트 안에서 "감지→근거→개입 안→승인→2주 후 효과 검증"이 시간축으로 보이지 않음.
3. **데이터 입력 → AI 판단 → 결과 측정의 인과 사슬**이 화면 간 분리됨. cocreation 5단계가 구조적으로는 있으나, "이전 회차 효과를 보고 이번 회차 판단을 바꿨다"는 흐름이 약함.
4. **시각 요소(차트·다이어그램·실시간 변화)**가 부족. 사용자 Action Item "텍스트 ↓ / 시각 요소 ↑"가 아직 약함.
5. **데모 흐름의 결말**이 없음. 발표용 클릭 시퀀스 (예: S01 데모 1 → S07 데모 2 → S08/S11 데모 3) 가 라우트 간에 자연스럽게 이어지지 않음.

**잠정 후보 방향 (네가 동의/반박해줘)**:

- **방향 A: 핵심 폐루프 3개를 "시간 축 데모 시퀀스"로 다듬기**
  - S01 (Course Co-Creation 폐루프), S07 (Career Narrative), S08/S11 (Zemi Hub) 각각에서 *"지금 → 2주 뒤 → 효과 측정"* 타임라인을 화면에 명시.
  - 데모용 Scripted Mode (키 또는 '다음' 버튼) 추가, 상태 변화를 미리 정의된 timeline으로 재생.
  - 발표·시연 측면 ROI 최강. 단, 코드량 큼.

- **방향 B: AI Liveness 강화 — 정적 카드 → 변화하는 시각 컴포넌트**
  - 강의 영상 22% 구간 멈춤 동료 분포(히트맵), CLO별 mastery 트렌드(스파크라인), 채점 불확실성 분포(violin), Decision Queue 변화(animated stack)를 추가.
  - 회장이 "이건 정적 mockup이 아니다"라고 느끼게 함.
  - 단, 시각 요소 추가만으론 "AI 판단의 근거"가 늘진 않으므로 방향 A·C와 결합해야 함.

- **방향 C: 시나리오 격자 압축 — 16 라우트 중 데모 5장만 발표용으로 더 깊게, 나머지 11장은 일관 스타일 유지**
  - 발표 시 보일 5라우트(`instructor.cocreation`, `instructor.grading`, `instructor.dashboard`, `student.dashboard`, `student.lecture`)에 force-multiplier 자원 집중.
  - 나머지는 스타일·copy만 일관.
  - 사용자가 design_brief에서 이미 지정한 우선순위와 정합. ROI 보수적.

**나는 잠정적으로 A + B 결합, 데모 시퀀스 1개(S01 폐루프)에 시각화 강화를 집중 적용하는 것을 1순위로 본다.** 이유: NetLearning 회장은 "한 폐루프가 돌아간다"는 한 장면이 가장 강력. 16라우트 균등 폴리싱은 이미 design brief가 처리. 진짜 약한 건 "라이브한 폐루프 한 번 돌아가는 것"의 시연성.

너의 평가 부탁한다.

---

## 5. 형식

`review/_codex_upgrade_proposal.md` 에 다음 구조로:

```
# Codex 고도화 방향 제안

## 1. 사용자 의도 추론
## 2. 현 프로토타입 약점 진단 (Claude의 5개에 대한 동의/반박/추가)
## 3. 방향 후보 2~3개 (각각: 한 줄 정의 · 근거 · 첫 7~10일 산출물 · trade-off · 나의 confidence)
## 4. 1순위 추천과 그 이유
## 5. 1순위에 대한 착수 단위 5~7개 (작업명 · 영향 받는 파일/섹션 · 추정 시간 · 의존성)
## 6. Claude의 잠정 1순위(A+B 결합)에 대한 명시적 평가 (동의/조건부/반대 + 이유)
## 7. 사용자에게 즉시 결정해야 할 미해결 1~3개
```

길이 가이드: 4~6 페이지 분량(약 2,500~4,000자). 중복·미사여구 금지. 라운드 2 톤 유지.

작성 끝나면 파일 저장만 하고 종료. 이후 합의 라운드는 Claude가 다시 호출한다.
