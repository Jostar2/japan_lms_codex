# Claude Round 2 — Codex 리뷰 교차 비평

> **이 라운드의 목적**: Round 1에서 두 리뷰어가 독립적으로 쓴 리뷰를 가로로 잇는다. 겹치는 부분은 증폭, 충돌은 결론을 낸다. Round 3 통합안의 **설계도**를 남기는 것이 목표.

---

## 0. Codex Round 1 총평 (한 단락)

Codex의 리뷰는 **수학·모델 서술의 정밀도**에서 내 리뷰보다 단단하다. Bayesian change-point, doubly robust estimator, Many-Facet Rasch, calibration error, propensity overlap 같은 기술 용어를 조용상 교수님 톤으로 정확히 배치한다. 일본어 CTA 풍부함도 Codex가 압도적이다(5개 mock 모두 일본어/한국어 병기). **약점**: 내 리뷰가 강조한 "데모 임팩트" 영역(Ambient AI 이어피스, AI와 음성 반박, NotebookLM 스타일 팟캐스트)이 없고, "일본 문화 특화"의 학사 시스템(履修登録·前期後期·卒論ゼミ) 층위도 비어있다. 요약: **Codex = 수학·표준·표현의 깊이**, **Claude = 데모 파워·일본 학사 디테일·비즈니스 맥락**. 둘이 합치면 실제로 한 명의 시니어 리뷰어보다 강하다.

---

## 1. 시나리오별 판정 대조표

| # | Claude R1 | Codex R1 | Claude R2 재판정 | 결정 근거 |
|---|---|---|---|---|
| S01 | C+ | Mixed(규칙기반 히트맵) | **Mixed** | 둘 다 "2σ + HDBSCAN" 한계 지적. Codex가 더 정확히 "현재는 집계 이상치 탐지" 단정. **Codex 승**. |
| S02 | B- | Mixed(정책 약함) | **Mixed** | DKT 이름값과 실제 정책 공백을 Codex가 더 날카롭게 분리. Claude의 "GKT 로드맵" 주장은 유지하되, MVP 범위는 Codex 안(BKT+IRT+불확실성) 채택. |
| S03 | C | Rule-based에 가까운 Mixed | **Mixed (하단)** | 둘 다 같은 진단. Codex의 "Knowledge Debt Graph" 명명 + intent/misconception/conflict 구조화가 한 단계 위. **Codex 승**. |
| S04 | C+ | Rule-based | **Rule-based** | Codex가 더 강하게 부정적. 맞음. "3단계 에스컬레이션" 자체가 rule. Codex의 "survival + uplift" 이 Claude의 "contextual bandit"보다 **의사결정 이론적으로 더 완전**. (둘을 결합해도 됨) |
| S05 | B | Mixed | **Mixed** | 양쪽 동일. Claude의 "Ambient AI 이어피스"는 데모 임팩트로 유지, Codex의 "Live Understanding State + online BKT/IRT"는 모델 뼈대로 유지. 둘을 합체. |
| S06 | C- | Mixed | **Mixed (상단)** | Codex가 더 관대. 내가 "그냥 PWA"로 너무 깎아 내렸음. Codex의 "Commute Learning Agent" 관점과 내 "Personalized NotebookLM 팟캐스트"가 같은 방향. **Codex 판정 수용**. |
| S07 | A- | Mixed | **B+ ~ A-** | **이견 지점.** 내가 너무 후했다고 일부 인정. **현재 문서 그대로면 B+, 업그레이드(Evidence-backed Career Narrative Model + guard)하면 A**. Codex의 "채용 윤리 경계"는 절대 반영 필수. |
| S08 | B | AI-native에 가장 가까운 후보 | **B+ (상향)** | **이견 지점.** Codex가 더 높이 본 이유 — 제미 문화가 LMS의 본질을 넘어선다는 것 — 에 공감. Codex의 "Research Lineage Graph" 명명 + CASE 분리(line 514 오표현 지적)가 핵심. Codex 상향 수용. |
| S09 | B+ | Mixed(잘 키우면 AI-native) | **B+** | 양쪽 동일 방향. Codex의 "Many-Facet Rasch로 채점자 severity drift"가 Claude의 "human-in-the-loop IRT" 보다 교수님 앞에서 더 정확한 표현. |
| S10 | C+ | Rule-based | **Rule-based** | Codex가 더 강한 판정. 맞음. GBT+SHAP = 2018년. Claude의 "Uplift Forest" + Codex의 "Support Policy Simulator" = 같은 방향, 이름은 **"Support Policy Simulator"** (Codex 네이밍) 채택 — 더 정치적으로 안전함. |

### 중요 이견 해소 2건

**① S07 (Shukatsu Forge) — A- vs Mixed**
- 내가 A-를 준 이유는 "**CLR + 일본 就活 + LLM 생성의 3중 결합이 다른 회사에 없음**" — 여전히 맞는 판단.
- Codex가 Mixed를 준 이유는 "**현재 문서 본문은 'LLM이 ES 써준다'로 오독 가능**" — 더 맞는 판단.
- **결론**: 시나리오 **잠재력**은 A-, **현재 서술**은 Mixed. Round 3에서 본문을 Codex의 `Evidence-backed Career Narrative Model` + `최소 2종 evidence source + 1건 externally verifiable + competency confidence ≥ 0.7` guard로 재작성하면 본문도 A-로 올라옴. **재작성 필수**.

**② S08 (Zemi Hub) — B vs AI-native 후보**
- 내가 B를 준 이유는 "Whisper + 임베딩 + LLM은 평범함".
- Codex가 AI-native 후보로 본 이유는 "제미 문화 + Inheritance Graph의 구조적 독창성".
- **결론**: **Codex 승.** 나는 "현재 기술 스택의 평범함"에 매몰돼 **시나리오의 구조적 차별성**을 놓쳤음. 일본 대학에서 "제미"는 단순한 연구실이 아니라 4년간 지식 세습의 사회 단위 — 이것을 LMS 안에 체계화한다는 것 자체가 **글로벌 LMS가 못 한 것**. Codex의 "Research Lineage Graph(RLG)" 명명도 우수. Round 3에서는 **S08을 S07과 같이 "일본 차별화 pair"로 전면 배치**.

---

## 2. 시나리오 업그레이드안 — 통합 · 선택 · 폐기

### 합쳐야 할 것 (두 리뷰를 결합 시 효과 상승)

**S01 난관 구간**
- Codex: `Bayesian change-point detection + sequence transformer` → **모델 뼈대로 채택**
- Claude: 감지 후 "5분 미니 강의 스크립트 즉석 생성 (3종 대안) + TTS 영상 자동 합성 + 다음 코호트 A/B" → **Codex의 N05 Co-Creation Studio와 합체**해 **S01이 발견→해결→효과측정 폐루프를 만드는 대표 시나리오**로 승격.
- Codex의 Intervention xAI Card mock (line 516-532) 의 **표 3행 (A/B/C 개입 후보 · overlap · CI)** 채택.
- Claude의 **"[AI와 이 판단 토론]" CTA**는 xAI 카드 하단 5번째 버튼으로 추가 (Mei-waku 업그레이드).

**S04 몰아치기**
- Codex의 `survival analysis (mark failure hazard) + uplift model` = 왜 개입해야 하는가 + 어떤 개입이 효과적인가의 **이론적 완결**.
- Claude의 `contextual bandit (LinUCB/Thompson)` = 어떤 tone이 이 학생에게 효과적인가의 **개별 최적화**.
- **통합**: survival→hazard 추정 / uplift→개입 후보별 효과 / bandit→tone·시간·채널 선택 — **3계층 정책 스택**.
- Codex의 `expected utility > 0일 때만 개입` + `stress uplift ≤ +0.05, opt-out < 12%` 기준 통째로 채택.

**S10 Early Warning**
- 네이밍: Codex의 **"Support Policy Simulator"** 채택 (정치적으로 안전).
- 모델: Claude의 `Uplift Forest` + Codex의 `risk + uplift + fairness audit + uncertainty` **4모델 스택** 통합.
- 교수자 화면: Codex안 — "이번 주 반 전체에 효과가 큰 개입 3개"로 시작. **전면 채택**.
- 수용 기준: Codex안 — `PPV≥0.45`, `false positive contact regret<8%`, `calibration error≤0.05`, `intervention uplift≥+10%p`. **전면 채택**, Claude의 Recall 0.7은 보조.

### 둘 중 하나를 선택

**S05 실시간 강의**
- Claude안: **Ambient AI 이어피스/사일런트 모드** (교수자 귀에 AI 속삭임)
- Codex안: **Live Understanding State + 교수자 CTA 3버튼** (대형 화면 + 2분 예시 바꿔 설명/확인 문제 1개/그대로 진행)
- **선택**: **둘 다 살릴 것**. 이어피스는 **프레젠 하이라이트 영상 소재**(10초 컷, 회장님 기억에 남음), CTA 3버튼은 **본 제품 UX의 베이스라인**. 단, 이어피스가 구현 리스크 크므로 **프레젠엔 "시범 개발 중"으로 명시**.

**S02 복습 모델 — BKT vs DKT vs GKT**
- Claude안: MVP부터 GKT 로드맵 공개 (청중 기대 수준 맞춤)
- Codex안: MVP는 BKT+IRT+불확실성만으로 충분 (실무적)
- **선택**: **Codex안 80% + Claude안 20% 혼합**. MVP = BKT+IRT+**불확실성 간격 시각화** (Codex). 로드맵 = "P1말 GKT 전환, 코호트 50+ 되는 시점" 명시 (Claude). **현재 모델 투명 표시** (Claude 제안) 추가. D-2 결정표를 재작성.

**S07 Shukatsu Forge**
- Claude: 일본어 경어 레벨 3종(です・ます/である/敬語) 자동 조정 + 업계별 문체 전환
- Codex: 채용 윤리 guard (evidence 2종+externally verifiable 1건+confidence 0.7) + 표현 강도 실시간 경고
- **선택**: **Codex 100% + Claude 100% 모두 채택**. 두 안은 **다른 축** — Codex는 정직성 가드, Claude는 표현 적합성. 서로 충돌 없음.

### 폐기해야 할 것

- Claude의 **"S-new6 Bidirectional Instructor-AI (교수자가 AI를 가르친다)"**: 방향은 좋지만 AES 20분 무대에는 **설명 시간 대비 impact가 약함**. 별도 확장 시나리오로 보류 (S-new6 → S19).
- Claude의 **"S-new5 Curriculum Optimizer"**: 학교 레벨 판매·데이터 요구량·3년 이상 누적 필요. **MVP·90일 파일럿에 넣을 수 없음**. P4 확장으로 정식 이동. 프레젠에는 한 줄만 — "미래 확장: 학과 · 학교 · 아시아 메타 비교 가능".

### 최종 "Top 5 신규 시나리오" (AES 발표용)

| 순위 | 시나리오 | 출처 | 발표 배치 |
|---|---|---|---|
| 1 | **Course Co-Creation Studio** (S01+Claude S-new1+Codex N05 통합) | 둘 다 | **데모 1: 감지→생성→검증 폐루프** 대표 |
| 2 | **Learning Companion / Pace Agent** | Claude S-new2 ≈ Codex N01 | **데모 2: 상주 에이전트** |
| 3 | **Counterfactual Intervention Simulator** | Claude S-new3 ≈ Codex N02 | 조용상 교수 디펜스 파트 (정량 증거) |
| 4 | **Multimodal Problem-Solving Coach** | Claude S-new4 ≈ Codex N04 | **데모 3 (선택지)**: STEM 학과 시각 충격 |
| 5 | **Real-time Adaptive Path** | Codex N03 | 데모 2의 sub-sequence로 편입 |

> **데모 3개 최종안**: ① Course Co-Creation Studio (S01 업그레이드) / ② Learning Companion Agent / ③ Shukatsu Forge (기존) — **무대 길이 총 7~8분**.
> Multimodal은 **비디오 클립 10초**로 "확장 가능 영역" 섹션에 삽입.

---

## 3. 화면·CTA·mock 통합

### 3-1. xAI 카드 — Codex안 채택 + Claude 추가

Codex의 "Intervention xAI Card" (line 516-532) 가 **원형**. 여기에 Claude의 **"[AI와 이 판단 토론]" CTA + 음성 반박 모달**을 추가. 최종 버튼 배열:

```
[5分復習を追加 / 5분 복기 추가]                ← 메인 개입
[教材案を生成 / 자료 개선안 생성]              ← Co-Creation Studio 진입
[2週間後に検証 / 2주 후 검증]                  ← 효과 측정 예약
[AIとこの判断を議論 / AI와 이 판단 토론] 🎙️  ← 음성 반박 (Claude안)
[判断が違う / 판단이 다름]                     ← Mei-waku (기존)
```

### 3-2. 학생 카드 — Codex 원형 + Claude 팟캐스트 CTA

Codex의 "ここで少し止まりましたね" mock (line 542-554) 를 원형으로:

```
┌─ ここで少し止まりましたね / 여기서 잠깐 멈췄네요 ───────┐
│ 같은 지점에서 멈춘 학생 중 28명이 '분산 vs 표준오차'를      │
│ 헷갈렸습니다. 어떤 도움이 필요하세요?                       │
├──────────────────────────────────────────────┤
│ [30秒で説明 / 30초 설명]                                    │
│ [例題を1問 / 예제 1문제]                                    │
│ [通学の音声ポッドキャストに追加 / 통학 팟캐스트에 추가] 🎧  ← (Claude)
│ [もう知っている / 이미 알아요]                              │
│ [違うところが難しい / 다른 부분이 어려워요]                 │
└──────────────────────────────────────────────┘
```

학생의 `이미 알아요` 클릭 → 해당 개념 mastery prior 즉시 상향 (Codex 제안). 학생의 `다른 부분이 어려워요` → 음성/텍스트 입력 받아 새 misconception candidate 생성 (Codex 제안) + Claude의 "AI 반박 인터랙션" 스타일 응답.

### 3-3. 교수자 "무시" 의미 확장 — Codex안 전면 채택

Codex의 **§01-E `[무시]` 후 모달 4선택지** (line 596-601) 채택:
- `이미 설명함` → content version/context 반영
- `중요하지 않음` → course objective weight 하향
- `데이터 편향` → cohort anomaly flag
- `개념 매핑 오류` → L5 edge review queue

**이것만으로도 회장님께 "교수자의 모든 행동이 모델 학습 신호"라는 메시지 완성**.

### 3-4. 질문 쏠림 재디자인 — Codex "공동 지식 생성"

Codex의 "표준 질문안 제안 + 입력 크기 n의 정의 부족 언급" mock (line 569-583) 전면 채택. "중복 제거" → **"공동 지식 자산 병합"** 메시지 전환.

### 3-5. Shukatsu Forge mock — Claude 일본어 mock 유지 + Codex guard

Claude R1의 일본어 mock (【問題】【行動】【結果】구조 + 경어 레벨 + 업계별 재구성) 을 **UI 본체**로 쓰고, Codex의 **생성 전 guard** (evidence 2종, externally verifiable 1건, confidence ≥0.7) 을 **생성 버튼 클릭 시 사전 체크**로 붙임:

```
┌─ 가쿠치카 초안 생성 조건 확인 ──────────────────────┐
│ ✅ 근거 이벤트: 18건 (요건: 3건 이상)               │
│ ✅ 증빙 종류: 4종 - 면담·제출·피어·성적 (요건: 2종 이상) │
│ ✅ 외부 검증 가능: 루브릭 성적 1건                   │
│ ✅ 역량 confidence: 0.82 (요건: 0.70 이상)          │
├──────────────────────────────────────────────┤
│ [この条件で生成 / 이 조건으로 생성]                 │
│ [증빙 더 확인 후 생성]                              │
└──────────────────────────────────────────────┘
```

### 3-6. Ambient AI 이어피스 — Claude안 고유, 발표 하이라이트

Codex 리뷰에는 없는 **프레젠 시각 충격 자산**. Round 3 통합안에는 **"Stretch Goal / Pilot 진행 중"** 명시로 보수적 유지. 영상 10초 컷으로만 발표.

### 최종 "발표 데모 3장" 확정

| # | 화면 | 소요 | 강점 |
|---|---|---|---|
| **데모 1** | Course Co-Creation Studio (교수자 Intervention xAI Card + 자료 개선안 생성 → 2주 검증 루프) | 2분 | 폐루프 증명. **회장님이 가장 기억할 장면**. |
| **데모 2** | Shukatsu Forge (일본어 경어 전환 + CLR 검증 링크 + guard 모달) | 2분 | 일본 시장 정확히 타격. CLR 표준과 결합. |
| **데모 3** | Zemi Hub Research Lineage Graph (미니츠 자동 + 선배 연구 계승 인터랙티브 그래프) | 1.5분 | 일본 대학 유니크. Codex가 발굴한 본질. |

**Bonus 10초 영상**: Ambient AI 이어피스 — **"시범 개발 중 · P3 목표"** 자막과 함께.

---

## 4. 데이터·표준 레이어 — 합의와 이견

### 합의 (양쪽 동일 방향)
- xAPI Profile 공식 정의 필요 (문서 현재 `xapi_verb` placeholder 만)
- CASE 매핑이 `concept_id = case_id` 1:1 표현은 잘못됨 → 구조화 필수
- CLR이 S07 전용이 아닌 전 시나리오 결과물로 편입
- OneRoster·LTI Advantage·Caliper는 문서에서 빠져 있음

### Codex 우수 (Claude보다 깊음)
- **CASE association_type 스키마** (`exactMatch / closeMatch / broadMatch / narrowMatch / prerequisiteOf / assessedBy / taughtBy`) — 이 정도 수준이 조용상 교수 앞에서 통함. **전면 채택**.
- **표준 역할 분담 표** (line 706-715) — 8개 표준의 역할을 2줄씩 정리. **프레젠 5분 Defense 섹션의 핵심 슬라이드로 그대로 사용**.
- **CLR evidence type 시나리오 매핑** (S01→LearningAchievementEvidence, S02→CompetencyEvidence, S03→CollaborationEvidence 등) — 이 매핑 자체가 상품 설계. **전면 채택**.
- **이벤트 카탈로그 누락 10개 카테고리** (consent / AI exposure / intervention / agent / content generation / model audit / standard mapping / offline / affective / accessibility) — **전면 채택**, Claude의 목록은 여기 녹임.

### Claude 우수 (Codex보다 깊음)
- **xAPI vs internal event 분리 설계의 구체 구현 스키마** 는 Codex가 더 날카롭지만(line 653-663), Claude는 **"edulms.ai-x xAPI Profile 공식 발행"** 이라는 **액션 아이템**을 더 명확히 함. 두 안 병합.
- **일본 MEXT 교과 표준과 CASE 매핑 부재 → 우리가 최초로 만들겠다** 제안 (Claude line 5-2). Codex엔 없음. **전면 유지**. 조용상 교수 세션에서 KERIS·MEXT 컨소시엄 협업 암시로 강함.

### 최종 "표준 역할 분담 슬라이드" 초안 (1페이지)

```
┌──────────────────────────────────────────────┐
│  AI-X Platform Standards Stack                │
│  "We do not replace standards. We compose them."│
├──────────────────────────────────────────────┤
│                                                │
│  [운영]    OneRoster 1.2 ─── SIS/학적·수강·성적 │
│            Ed-Fi (옵션) ──── 기관 데이터 허브    │
│                                                │
│  [연결]    LTI Advantage ─── Deep Linking /    │
│                                AGS / NRPS     │
│                                                │
│  [이벤트]  Caliper Analytics ─ LMS 내부 표준     │
│            xAPI + LRS ────── LMS 밖 경험 /     │
│                                비정형 경험    │
│                                                │
│  [역량]    CASE (CFItem · CFAssociation) ──    │
│                       L5 concept graph 식별자 │
│                                                │
│  [성취]    CLR 2.0 + Open Badges 3.0 ──       │
│                       휴대 가능한 학습 성과    │
│                                                │
│  [API]     EDU-API ──── 기관 시스템 연동 표준   │
│                                                │
├──────────────────────────────────────────────┤
│ MEXT 교과 표준 × CASE 매핑 ─ OneEdutechKorea가 │
│                            공동 제안 주도 예정 │
└──────────────────────────────────────────────┘
```

→ **이 한 장이 20분 발표의 Defense 5분을 완전 커버**.

---

## 5. 뜬소리 재작성 — 우선 10개 확정

Claude + Codex의 제안을 합쳐 **프레젠·제안서 제출본에서 반드시 교체**해야 할 10개 문장.

| # | 원문 line | 원문 핵심 | 채택 대안 | 출처 |
|---|---|---|---|---|
| 1 | line 24 | "모든 행동을 xAPI로 수집" | "학습·평가·개입 이벤트를 목적별 표준 프로파일로 수집" | **Codex** |
| 2 | line 30 | "Evidence + Reasoning + Action 3종 강제" | "근거 이벤트·모델 버전·불확실성·권장 행동·효과 측정 계획 5요소 렌더링. 측정 불가 추천은 '정보성 인사이트'로만" | **Codex** |
| 3 | line 32 | "BKT/DKT 기반 개념별 숙달 확률" | "응답·시간·힌트·자가 확신도 입력 → 온라인 개념별 숙달도 + 불확실성 → 다음 문항·복습 시점·설명 방식을 정책 모델이 선택" | **Codex** |
| 4 | line 43 | "모든 행동 xAPI Statement + SDK 외 DB 직쓰기 금지" | "학습 이벤트는 SDK 수집, 표준 교환 가치 있는 것은 xAPI/Caliper 프로파일 변환, 내부 운영 이벤트는 별도 audit schema" | **Codex** |
| 5 | line 47 | "일본 문화 특화" | **"5대 일본 특화"**: Meiwaku Awareness · Honne/Tatemae Tone · 敬語 3단계 자동 · 前期後期履修卒論 학사 구조 1급 시민 · 설문 n≥300 Omotenashi 정량검증 | **Claude** |
| 6 | line 90-94 | signal_score 공식 + z-score | "행동·자막·슬라이드·질문 임베딩·선수 개념 숙달을 입력한 `segment_struggle_model` 산출 `P(struggle)` + 원인 개념 예측. z-score는 보조 설명 근거" | **Codex** |
| 7 | line 154 | "Confidence 0.82 / 유사 개선 -45% 예측" | "난관 확률 0.82, calibration error 0.04. 5분 복기 예상 효과는 유사 강좌 12건 기준 재시청률 -18~-32%, overlap 0.71. 2주 후 자동 재측정" | **Codex** |
| 8 | line 348 | "망각 곡선 < 40% + 반 30% 이상" | "개인별·개념별 forgetting rate Bayesian posterior (10응답 수렴, cold start는 그래프 neighbor pooled prior) + 'expected class gain이 큰 개념'으로 정렬" | **Claude + Codex** |
| 9 | line 348 (중복) / line 354 | "지금 5분 복습하면 시험 시점 예측 86%" | "5분 복습 완료 시 시험 시점 예상 정답률 47% → 68~76% (유사 학생 42명 복습 이력 + 현재 오답 패턴 기준)" | **Codex** |
| 10 | line 514 | "L5 Content Graph에 제미 CASE 노드로 편입" | "제미 산출물은 Research Lineage Graph에 저장, 학습성과·연구역량만 CASE-aligned competency item과 연결. CLR 발급은 학생 동의 후 별도 검증 링크" | **Codex** |

> **이 10개를 원문에 직접 반영하는 것은 Round 3 산출물.**

---

## 6. 프레젠 20분 구조 — Claude안 vs Codex안 최종 결정

### Claude안 (R1)
| 시간 | 내용 |
|---|---|
| 0-1분 | Hook + Ambient AI 이어피스 영상 30초 |
| 1-6분 | Proof 3데모 |
| 6-11분 | Defense (xAPI/CASE/CLR) |
| 11-16분 | Pilot proposal |
| 16-20분 | Q&A |

### Codex안 (R1)
1. 도입: "LMS 대체 아님. 학습 운영 지능 레이어."
2. 증명: **하나의 데이터 폐루프** (S01 감지→원인→개입→반응→2주 효과→정책 갱신→CLR evidence)
3. 차별화: 일본 3장 (Liner / Shukatsu / Zemi)
4. 파일럿: 90일 1학과 3가설

### 최종 결정: **Codex 뼈대 + Claude 시간 분배 + 하이브리드 데모**

**Codex의 "하나의 closed loop 끝까지" 원칙**이 **10개 시나리오 나열** 보다 **시니어 청중**에게 설득력 압도적. 채택.

다만 Codex안은 시간 예산이 없음 → Claude의 20분 breakdown을 덧씌움.

```
┌────────────────────────────────────────────────┐
│  AI-X Platform · AES 2026 Presentation         │
│  — 20 minutes to NetLearning Chairman           │
├────────────────────────────────────────────────┤
│ 0:00-1:00  Hook                                  │
│   "LMS 대체가 아닙니다. 학습 운영 지능입니다."     │
│   + Ambient AI 이어피스 영상 10초 (Stretch)      │
│                                                  │
│ 1:00-8:00  Proof — 하나의 폐루프 끝까지 (7분)     │
│   S01 Course Co-Creation Studio 풀 루프:          │
│   감지 → 원인 추론 → 개입 선택 → 학생 반응 →     │
│   2주 효과 검증 → 정책 갱신 → CLR evidence        │
│   + 실시간 xAI 카드 UI (Intervention variant)    │
│                                                  │
│ 8:00-11:00  Japan Differentiators — 3장 (3분)    │
│   1) Shukatsu Forge (일본어 경어 전환 · CLR guard)│
│   2) Zemi Hub Research Lineage Graph              │
│   3) Liner Mode Commute Learning Agent            │
│                                                  │
│ 11:00-14:00 Standards Defense (3분)               │
│   "We compose, not replace"                       │
│   + 1페이지 Standards Stack 슬라이드              │
│   + MEXT × CASE 매핑 OneEdutechKorea 제안         │
│                                                  │
│ 14:00-18:00 Pilot Proposal (4분)                 │
│   · 90일 / 1학과 / 2강좌                          │
│   · 3가설 (정량 측정 계획 포함)                   │
│   · 4자 역할표 (NetLearning · 레코스 · 조용상 · 위키드스톰) │
│   · "P3에서 AmbientAI·Multimodal·Counterfactual 확장"│
│                                                  │
│ 18:00-20:00 Q&A                                  │
└────────────────────────────────────────────────┘
```

### Codex가 잘 잡았지만 강화 필요한 것
- **90일 파일럿 3가설**: Codex 제안 (line 957-959) 그대로 좋음. **가설 1·2·3의 통계 검정력 계산**도 같이 제시해야 교수 앞에서 통함. Round 3에서 추가.
- **4자 역할표**: 현재 Codex안 한 줄로만 끝남 (line 961-962). **레코스=표준배지+CLR인프라**, **조용상 교수=CASE/EDU-API Governance**, **NetLearning=학교 네트워크+일본 학사 know-how**, **위키드스톰=AI/xAI/Agentic 레이어** 같이 **각자의 고유 가치**를 한 줄씩 배치. 이 슬라이드가 회장님 → "왜 같이 해야 하는가"의 답.

---

## 7. Round 3 통합안 작성 지침 (Codex가 쓸 원칙)

1. **원문 파괴 금지**. `AI_LMS_planning_core_summary.md`의 철학·구조(시나리오 카탈로그 · 공통 자산)는 유지. **문장 단위 재작성 + 시나리오 5개 추가 + 1페이지 Standards 슬라이드 + 프레젠 구조 섹션 추가**.
2. **뜬소리 10개는 반드시 교체**. 섹션 5의 표 그대로.
3. **시나리오 판정 근거는 표시하지 않되**, 업그레이드는 원문 본문에 녹여 쓴다. "Mixed → Mixed-upgraded"는 내부 문서용이지 제안서용이 아님.
4. **일본어 CTA 병기**. Codex R1의 5개 mock UI는 일본어/한국어 병기 포맷을 그대로 따름.
5. **"We compose, not replace" 슬로건**이 표준 섹션 첫 줄. Codex line 719.
6. **4자 역할표 + 90일 파일럿 3가설**은 원문에 없던 새 섹션 §8으로 추가 (현재 §7 "다음 액션" 뒤).
7. **Ambient AI / Multimodal / Curriculum Optimizer는 확장 섹션으로만 명시** (P3~P4 로드맵). MVP·90일 파일럿에 포함 금지.
8. **Round 2에서 결정된 Top 5 신규 시나리오** 를 `§2.11` ~ `§2.15` 로 기존 §2 시나리오 카탈로그 하단에 편입 (S-new1~5 네이밍 → **S11~S15**로 재할당).
9. **CLR 전 시나리오 매핑표**는 §4 거버넌스 뒤 §4-B 신규 섹션으로 추가.
10. **평가 지표는 모두 calibration/uplift/PPV 포함**. Recall 단독 사용 금지.

---

## 8. 여전히 미해결 (Round 3 전 사용자 결정 필요)

1. **선배 데이터 공개 기본값 (§01-L, line 266)**: 현재 "기본 on, 학과 정책에 따라 기본 off 프리셋 가능". Codex는 기본 off 권장. → **사용자(위키드스톰/조용상 교수) 판단 필요**.
2. **D-2 숙달 모델 로드맵**: MVP=BKT+IRT (Codex) vs MVP부터 GKT 언급 (Claude). 나는 **Codex안 수용하되 로드맵 명시**로 결론 내렸지만, **발표에서 어느 강도로 말할지** 는 사용자 판단.
3. **Ambient AI 이어피스 영상을 실제 촬영/제작할지**: 데모 파워는 1순위. 제작 리소스·일정 사용자 판단.
4. **Zemi Hub의 CASE 표현 변경** (line 514): Codex 지적대로 "Research Lineage Graph + CASE-aligned competency" 로 분리. **위키드스톰 내부 개발팀과 조용상 교수의 원문 용어 사용 합의 필요**.
5. **파일럿 1호 대학**: 문서 D-1은 "1호 고객 확정 시 L5 시드". 발표 자리에서 **NetLearning이 파일럿 연결을 약속**하게 하는 것이 목표면, 발표 구성에 "공동 선정" 슬롯 필요. 사용자 영업 전략 확인.
6. **가격·비즈니스 모델 별도 문서**: 기획서에는 없음 (Claude R1 지적). 별도 Pitch Deck + Commercial Deck 필요한지 사용자 결정.

---

## 9. 이 라운드 요약 (한 화면)

- **Codex R1은 수학·표준·Codex 뜬소리 재작성에서 우수**. Claude R1은 **데모 임팩트·일본 학사 디테일·비즈니스 맥락**에서 우수. **둘 다 필요**.
- **판정 이견 2건 해소**: S07은 "잠재력 A-, 현재 서술 Mixed → 재작성 후 A-" / S08은 "Codex 판정 수용, 상향".
- **신규 시나리오 Top 5 합의**: Course Co-Creation Studio · Learning Companion Agent · Counterfactual Simulator · Multimodal Coach · Real-time Adaptive Path. **발표 데모 3장 = ① Co-Creation Studio ② Shukatsu Forge ③ Zemi Hub**.
- **표준 슬라이드 1장 확정** (섹션 4-4).
- **프레젠 구조 확정**: Codex의 "하나의 폐루프" 뼈대 + Claude의 20분 시간 분배.
- **Round 3 산출물**: 원문 자체를 10개 문장 교체 + Top 5 시나리오 편입 + Standards 슬라이드 + §4-B CLR 매핑 + §8 파일럿 4자 역할표 신설.

**Round 3 작성자에게**: 위 지침 §7의 10개 원칙을 규칙처럼 지킬 것.
