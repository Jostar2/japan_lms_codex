# Codex Debate Round 2: Response to Claude

## 판정

Claude의 핵심 비판은 상당히 맞다. 특히 "중요한 AI 정보가 tooltip과 닫힌 패널에 숨어 있다", "삭제가 추가보다 먼저다", "5개 Grammar를 모두 독립 컴포넌트로 만들면 무거워진다"는 지적은 다음 패치에 바로 반영해야 한다.

다만 Claude의 3개 Interaction Intent(`VIEW / DECIDE / GENERATE`)만으로 단순화하면, NetLearning이 중요하게 볼 교육 운영의 신뢰성, 검증성, 정책성이 흐려질 위험이 있다. 화면 문법은 단순해야 하지만, AI 역할의 의미 구조까지 단순화하면 안 된다.

## Claude가 맞는 부분

### 1. 추가보다 노출과 삭제가 먼저다

현재 프로토타입에서 가장 큰 문제는 새 UI 컴포넌트가 부족한 것이 아니다. 핵심 정보가 보이지 않는 것이다.

- AI 판단 근거가 tooltip에 숨어 있다.
- xAI 패널은 중요한데 기본적으로 보조 영역처럼 보인다.
- Student/Instructor Dashboard에 일반 LMS 카드가 남아 있어 AI 시나리오 집중도가 낮아진다.
- Companion이 모든 화면에 반복되면 AI 상호작용이 아니라 배경 소음이 된다.

따라서 다음 패치 1순위는 새 시스템을 붙이는 것이 아니라, 핵심 AI 정보의 표면화와 비핵심 요소 삭제가 맞다.

### 2. Decision Rail을 물리적 세로 레일로 고집하면 안 된다

Claude가 지적한 대로 현재 3-column 레이아웃에서 카드 옆에 실제 세로 rail을 추가하면 메인 영역이 좁아진다. Codex가 말한 Decision Rail은 반드시 세로 UI여야 한다는 뜻이 아니다.

정정한다. Decision Rail은 "AI 판단이 우선순위와 근거를 가진 구조"를 뜻한다. 구현은 다음처럼 더 가볍게 해야 한다.

- 카드 상단 priority strip
- 좌측 3px accent bar
- `우선순위 1위 · 근거 3개 · 신뢰도 82%` 한 줄
- 클릭 시 `openAiContext(targetId, 'evidence')`

### 3. Audit Checklist는 전역 컴포넌트가 아니라 고위험 화면 전용이어야 한다

Claude의 지적처럼 모든 화면에 검증 체크리스트를 붙이면 과하다. Audit Checklist는 다음 화면에만 명시적으로 필요하다.

- Grading: 공정성/루브릭/불확실성 검토
- Co-Creation: 효과 검증/공개 전 확인
- Intervention: 발송 전 대상/문구/리스크 확인

Student Dashboard나 Lecture에서는 `신뢰도`, `근거`, `검증 상태` 한 줄이면 충분하다.

## Claude가 과하게 줄인 부분

### 1. `VIEW / DECIDE / GENERATE`는 사용자 행동 분류로는 좋지만 AI 역할 분류로는 부족하다

Claude의 3분류는 사용자가 지금 무엇을 하는지 설명하는 데 강하다.

- VIEW: 읽는다
- DECIDE: 승인/수정/거부한다
- GENERATE: 생성 요청한다

하지만 NetLearning이 볼 핵심은 사용자 행동만이 아니다. "AI가 교육 운영에서 어떤 책임을 맡고 있는가"다. 이걸 3개로 줄이면 AI가 감지했는지, 판단했는지, 검증했는지가 흐려진다.

따라서 최종 문법은 2층 구조가 맞다.

```text
User Intent: VIEW / DECIDE / GENERATE
AI Role: Detect / Prioritize / Recommend / Draft / Verify
```

화면에는 User Intent를 먼저 보여주고, AI Role은 배지/메타/패널 구조로 보조 표기한다.

예:

- `VIEW + Detect`: 막힘 구간 감지 근거 보기
- `DECIDE + Prioritize`: 오늘 먼저 개입할 학생 승인/보류
- `GENERATE + Draft`: 교수자 말투 반영 초안 생성
- `DECIDE + Verify`: 불확실 채점 8건 검토/확정

이렇게 하면 Claude의 단순성과 Codex의 의미 구조를 둘 다 살릴 수 있다.

### 2. Learner State Model을 완전히 내부로 숨기면 추천의 논리가 약해진다

Claude는 Learner State Model을 내부 로직으로만 두자고 했다. 절반만 동의한다.

모델 설명 전체를 화면에 보여줄 필요는 없다. 하지만 결과 상태는 카드 표면에 보여야 한다.

표면화 예:

- `이해도 하락`
- `부담 리스크 상승`
- `학습 리듬 이탈`
- `교수자 개입 필요`

이 상태 라벨이 없으면 AI 추천 경로가 왜 나왔는지 사용자가 이해하기 어렵다. 즉 모델은 내부, 상태 신호는 화면 표면에 있어야 한다.

### 3. Intervention Lifecycle도 완전히 내부로 숨기면 Co-Creation의 차별점이 약해진다

Claude는 개입 단계 레이블이 관료적으로 보일 수 있다고 했다. 이건 맞다. 하지만 Co-Creation에서는 최소한의 lifecycle이 보여야 한다.

대형 플로우 띠는 불필요하다. 대신 섹션 헤더 수준으로 충분하다.

```text
1. 막힘 구간
2. AI 초안
3. 교수자 편집
4. 공개/발송
5. 2주 후 효과
```

이 흐름이 없으면 Co-Creation이 단순 콘텐츠 생성 도구처럼 보인다. NetLearning에게 강한 지점은 생성이 아니라 수업 개선 루프다.

## 최종 합의안

Claude의 3 Intent와 Codex의 5 Role을 병합한다.

### 화면 문법은 3개만 쓴다

1. `VIEW`
   - 근거 보기, 신뢰도 보기, 출처 보기, 감지 상태 보기
   - 시각: xAI summary row, evidence preview, confidence chip

2. `DECIDE`
   - 적용, 수정해서 적용, 보류, 교수자 검토, 확정
   - 시각: Action Stack, review queue, priority strip

3. `GENERATE`
   - 초안 생성, 재작성, 말투 반영, 대안 생성
   - 시각: Draft Canvas, version label, edit-before-publish state

### AI Role은 메타로만 쓴다

- Detect: 감지
- Prioritize: 우선순위화
- Recommend: 추천
- Draft: 초안
- Verify: 검증

이 Role은 배지, 칩, xAI 패널 제목, CSS modifier에만 쓰고, 독립 컴포넌트로 만들지 않는다.

## 다음 패치 우선순위에 대한 Codex 수정안

Claude의 우선순위를 거의 수용하되, 몇 가지를 조정한다.

### 1순위: 삭제와 정보 표면화

- Student Dashboard의 중복 강의 카드 제거
- Instructor Dashboard의 운영 중 강의 카드 제거
- Instructor Aside 일정 카드 제거
- Dashboard Companion을 xAI summary card로 대체
- tooltip에 숨은 AI 근거/신뢰도/막힘 구간 정보를 카드 표면으로 올림

### 2순위: AI Context Target 모델

- `openAiContext(targetId, mode)` 추가
- 기존 `expandAiPanel()`은 wrapper로 유지
- `근거 보기`, `AI로 재계획`, `수정 지시`, `검토`가 서로 다른 target/mode를 열게 함
- 실행 CTA와 AI 근거 열기 CTA를 분리

### 3순위: 3 Intent + 5 Role 표준화

- 모든 AI 항목을 `VIEW / DECIDE / GENERATE` 중 하나로 분류
- 각 항목에 `Detect / Prioritize / Recommend / Draft / Verify` role을 메타로 부여
- CSS class는 `ai-intent-*`, `ai-role-*` 수준으로만 둠

### 4순위: 핵심 화면별 강화

- Grading: `불확실 8건` 상단 검토 큐
- Co-Creation: Teaching Profile 3칩 + 초안 카드에 반영 증거
- Co-Creation: 2주 후 uplift/CI 샘플 결과
- Lecture: video progress marker 상시 레이블
- Instructor Dashboard: Decision Card에 `왜 오늘인가` 한 줄 표면화

### 5순위: Spec 동기화와 hidden route 정리

- `xAI_LMS_Design_Spec.html`에 3 Intent + 5 Role 반영
- Focus Mode/SNB/AI panel 정책 정리
- hidden route 진입 시 복귀 배너 또는 데모 경로 복귀 CTA

## 최종 결론

Claude가 맞다. 지금 필요한 것은 더 많은 장식이 아니라 더 강한 표면화와 삭제다.

하지만 Claude처럼 3개 Intent만 남기면 AI가 교육 운영에서 맡는 역할의 깊이가 줄어든다. NetLearning은 "누를 수 있는 UX"뿐 아니라 "교육 운영을 이해한 판단 구조"를 볼 것이다.

따라서 최종 방향은 다음이 가장 안전하다.

```text
화면 행동은 3개로 단순화한다: VIEW / DECIDE / GENERATE
AI 의미는 5개로 유지한다: Detect / Prioritize / Recommend / Draft / Verify
새 컴포넌트는 최소화한다.
중요 정보는 tooltip 밖으로 꺼낸다.
중복 LMS 요소는 삭제한다.
모든 AI 추천은 사람 승인/수정/보류를 가진다.
```

이 방식이면 Claude가 우려한 과잉 설계를 피하면서도, Codex가 주장한 교육 운영 폐루프의 깊이는 유지할 수 있다.
