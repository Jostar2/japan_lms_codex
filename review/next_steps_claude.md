# 다음 액션 — Claude 독립 제안

> **질문**: AES 발표용 v2 제안서(`AI_LMS_planning_v2_enhancement.md`)가 완성된 지금, **발표 당일까지** · **발표 직후** · **파일럿 착수까지** 어떤 작업을 어떤 순서로 해야 하는가?
>
> **답변 프레임**: T0 (발표 직전 필수) → T1 (발표 직후 7일) → T2 (파일럿 착수 전 2~3개월) → T3 (파일럿 운영 중) → T4 (P3 이후).

---

## 0. 우선순위 산정 기준

각 후보 작업에 다음 4지표를 매긴다.

| 지표 | 의미 |
|---|---|
| **시급성 (U)** | 발표일 기준 필수도 (1~5) |
| **임팩트 (I)** | 성공적 제안·계약 체결에 기여도 (1~5) |
| **복잡도 (C)** | 위키드스톰 리소스 투입량 (1~5, 낮을수록 쉬움) |
| **의존성 (D)** | 선행 결정·타자 협업 필요도 (1~5, 낮을수록 단독 진행 가능) |

**총점 = U + I - 0.5C - 0.3D**. 상위 작업이 우선.

---

## T0 — 발표 직전 필수 (AES 발표 당일까지 반드시)

### T0-1. 발표용 PPT 슬라이드 (20분 구조)
- U=5, I=5, C=3, D=2 → **T0 최우선**
- **산출물**: PPT 16~20장
  - 표지 · Hook 슬라이드 · Standards Stack 1페이지 · 3 Demo 전환 슬라이드 · 90일 파일럿 + 4자 역할 · Ask · Q&A Back-pocket 6장
- **작업**: v2 §9 프레젠 구조를 그대로 슬라이드화. 각 섹션당 2~3장. 배포본과 발표본 분리.

### T0-2. Demo A/B/C 영상 스크립트 + 녹화 구체 계획
- U=5, I=5, C=4, D=3 → **T0 2순위**
- **산출물**: 3편 스크립트 + 녹화·편집 일정
  - Demo A (90초): Course Co-Creation closed loop — 학생 시점 → 교수자 히트맵 → Intervention xAI Card → 자료 생성 → 배포 → 2주 uplift
  - Demo B (60초): Shukatsu Forge Guard — 학생 생성 버튼 → 조건 모달 → 일본어 초안 → 업계 전환 → CLR 검증 링크
  - Demo C (60초): Zemi RLG — 주제 입력 → 선행 연구 그래프 → 미해결 질문 → 회의 안건
- **주의**: 실제 구현 없으면 **클릭형 프로토타입** 으로 갈 수밖에 없음. Figma Prototype 또는 Keynote Animation.

### T0-3. 1호 파일럿 대학 **잠재 타겟 3~5개** 리스트
- U=5, I=4, C=2, D=4 → **T0 3순위**
- **산출물**: 내부용 1페이지
  - 각 대학별: 학과 · 규모 · 현재 LMS · 예상 접근 루트 (NetLearning 기존 고객 vs 조용상 교수 네트워크 vs 레코스 배지 파일럿 대학)
  - 우선 추천 1곳 + 대안 2곳
  - "발표 중 'X 대학을 이미 접촉 중' 라는 신뢰 시그널을 줄 수 있는지" 판단
- **주의**: **발표에서 구체 대학명 언급 여부** 는 NetLearning 회장 반응에 달림. 공개·비공개 두 버전 준비.

### T0-4. Q&A Rehearsal + 모의 회장 인터뷰
- U=4, I=5, C=2, D=1 → **T0 4순위**
- **산출물**: 예상 Q&A 30개 + 리허설 영상 자체 평가
  - 예상 질문: Early Warning 차별화 / Ambient AI 실현성 / 가격 모델 / NetLearning 기존 시스템 중첩 / 일본어 처리 검증 / 파일럿 데이터 요건
  - 조용상 교수 톤 질문 (표준 디펜스)
  - **mock audience로 위키드스톰 내부 1~2인이 회장 역할**
- **Why**: 회장님이 냉정하므로, 공격형 질문에 얼어붙으면 치명적.

### T0-5. Standards Stack 1페이지 시각 디자인
- U=4, I=4, C=2, D=1 → **T0 5순위**
- **산출물**: v2 §3-5 표를 **한 장 다이어그램**으로. 청중이 스크린 보자마자 "이 팀은 표준을 안다"가 느껴지는 비주얼.
- **제안**: 좌측 LMS — 우측 AI-X, 가운데 표준 스택 7층 배치. 가장 아래 APPI/CASE/CLR, 위로 OneRoster, LTI, Caliper, xAPI.

---

## T1 — 발표 직후 7일 (모멘텀 확보 구간)

### T1-1. Commercial Deck 초안 (가격·비즈니스 모델)
- U=4, I=5, C=4, D=3
- **산출물**: Commercial Deck 10~12장 — 발표에서는 안 보여주고 **Q&A 대비 + 발표 직후 NetLearning 측근 배포**
  - 가격 모델: 학교 라이선스 vs 학과 라이선스 vs SaaS per-student
  - 모듈별 SKU: Core (S01·S02·S05·S07) / 표준 Governance / 에이전트 (S12) / Co-Creation (S11) / Support Policy Simulator (S10)
  - ROI 계산 프레임: 교수 시간 절감 · 학과 리텐션 · CLR 발급 수익
  - 파일럿 무상 범위 vs 유료 전환 조건

### T1-2. 4자 역할 MoU 초안 뼈대
- U=4, I=5, C=3, D=5
- **산출물**: 1페이지 MoU Term Sheet
  - 4자 (NetLearning · 레코스 · 조용상 교수 · 위키드스톰) 역할·기여·권리
  - 파일럿 단계 IP 공동 소유 + 상용화 시 별도 합의
  - 데이터 소유권 · 대학 측 권리 · 학생 권리
  - 수익 분배 원칙 (최종안은 상용화 논의 시)
- **주의**: "발표 후 즉시 MoU" 약속을 지켜야 함. 발표 전에 미리 4자 내부 합의 필요.

### T1-3. NetLearning 회장 **구체 follow-up 제안서** (2~3장)
- U=3, I=5, C=2, D=2
- **산출물**: 발표 후 3일 내 이메일·대면 전달
  - 발표 요약 (1장) + 구체 다음 미팅 제안 (1장) + 90일 파일럿 타임라인 (1장)
  - "다음 회의에서 결정해야 할 3가지" 명시

### T1-4. 실시간 피드백 수집 + 반영 v2.1
- U=3, I=4, C=1, D=1
- **산출물**: 발표 후 AES 참석자 10명 단편 인터뷰 요약 + v2.1 업데이트
  - 슬라이드 반응 · Q&A 질문 패턴 · 일본 업계인 반응
  - v2 문서에 *"AES 2026 피드백 반영 diff"* 섹션 추가

---

## T2 — 파일럿 착수 전 2~3개월

### T2-1. xAPI Profile `edulms.ai-x.v1` 공식 정의 (JSON-LD)
- U=4, I=5, C=4, D=2
- **산출물**: `spec/xapi-profile/edulms.ai-x.v1.jsonld`
  - §3-1의 50+ 이벤트를 xAPI verb · activity type · context extension · result extension 으로 공식 정의
  - 1EdTech 표준 위원회 검토 요청
- **Why**: 조용상 교수 약속 · 표준 레퍼런스로 아시아 첫 사례 선점 가능.

### T2-2. CASE alignment sample (1학과 분량)
- U=3, I=4, C=4, D=4
- **산출물**: 통계학 / 경제학 1개 학과의 개념 노드 40~60개 × CASE 정렬
  - 실제 SME (교수) 1인 + 조용상 교수 검토 필요
  - MEXT 교과 표준과의 매핑 샘플 포함
- **Why**: 파일럿 가동의 전제 조건. CASE 파싱·발행·검증 파이프라인 end-to-end.

### T2-3. xAI 카드 5요소 Storybook 구현
- U=4, I=4, C=3, D=1
- **산출물**: React Storybook (TS) — `kind * tone` 조합 ≥ 20종
  - 각 카드의 evidence · modelVersion · uncertainty · actionPlan · dialogue mock
  - CI로 "5요소 누락 시 빌드 실패" 검증 동작
- **Why**: Gate 1 (Build CI) 구현 증명. 이게 있으면 "4-Gate Governance는 약속이 아닌 코드"를 데모 가능.

### T2-4. Demo A/B/C Figma/Sketch 풀 mockup
- U=4, I=4, C=3, D=1
- **산출물**: 3 시나리오 각각 10~15 스크린 인터랙션 prototype
  - 발표 직후 배포 가능한 수준
  - 실제 구현 단계에서 FE team 참조 가능
- **Why**: 발표 후 NetLearning 실무진이 "구체 화면 보여주세요" 요청 시 즉시 대응.

### T2-5. CLR VC 서명 파이프라인 PoC (레코스와 공동)
- U=3, I=5, C=4, D=5
- **산출물**: W3C Verifiable Credential 발급 end-to-end PoC
  - 학생이 S07 가쿠치카 → CLR export → 외부 verifier가 검증
  - 레코스의 Open Badges 3.0 인프라와 통합 설계
- **Why**: 레코스 vs 위키드스톰 공동 성과의 구체 증거. 배지 산업에서 일본 첫 사례 가능.

### T2-6. 4-Gate Governance 위원회 구성 + 운영 규정
- U=3, I=4, C=2, D=5
- **산출물**: 위원회 Charter + 외부 멤버 섭외
  - 외부 멤버 최소 2인 (ML Ethicist · 교육 법무)
  - 월간 미팅 템플릿 · Bias/drift audit 체크리스트
  - 1차 회의 실시 → 회의록 공개
- **Why**: Gate 3 실체화. 발표에서 "외부 감사 연간 공개" 약속의 출발점.

---

## T3 — 파일럿 운영 중 (6개월)

### T3-1. Counterfactual Simulator (S13) 시뮬레이션 모드 MVP
- U=2, I=4, C=5, D=4
- **산출물**: 과거 데이터 기반 "만약 ~이라면?" 시뮬레이션 UI + causal forest MVP
  - 파일럿 학기 데이터로 ex-post 검증
  - 공식 상용은 P3 이후

### T3-2. GKT / SAKT 전환 연구 트랙
- U=2, I=4, C=5, D=2
- **산출물**: BKT + IRT → GKT transition 논문급 문서 + 파일럿 데이터 백테스트
  - D-2 전환 시점 결정 근거
  - 공식 전환은 코호트 50+ 수렴 시

### T3-3. Pace Agent (S12) 베타
- U=3, I=4, C=4, D=2
- **산출물**: 파일럿 학생 opt-in 20~30명 대상 Pace Agent 운영
  - episodic memory · 매일 밤 reflection · bandit nudge 학습
  - 6주차·12주차 효과 보고서

### T3-4. 파일럿 월간 리포트 자동화
- U=2, I=3, C=2, D=1
- **산출물**: 매월 자동 생성 리포트 (H1·H2·H3 중간 결과 · 4-Gate Gate 3 log · Mei-waku 통계)
  - NetLearning · 조용상 교수 · 내부 스테이크홀더 공유

### T3-5. 채용 윤리 가이드라인 공식화 (S07)
- U=3, I=4, C=3, D=5
- **산출물**: 대학 커리어센터 + 일본 경단련 참조 가이드라인
  - AI 보조 허용 범위 · 학생 투명성 · 검증 링크 의무
  - 대학·NetLearning·커리어센터 3자 합의 문서

---

## T4 — P3 이후 (1년+ 후)

### T4-1. Ambient AI R&D 트랙
- 개인정보 · 시연 안정성 · 하드웨어 조사 · concept video 제작
### T4-2. Multimodal Problem-Solving Coach
- 필기·수식·코드 OCR · STEM 학과 확장
### T4-3. Institutional Curriculum Optimizer
- 다학기·다학과 데이터 확보 후 causal graph

---

## 전체 우선순위 표

| Rank | Task | U | I | C | D | Score |
|---|---|---|---|---|---|---|
| 1 | **T0-1 PPT 슬라이드** | 5 | 5 | 3 | 2 | **7.9** |
| 2 | **T0-2 Demo A/B/C 영상 스크립트** | 5 | 5 | 4 | 3 | **7.1** |
| 3 | **T0-4 Q&A Rehearsal + 모의 회장 인터뷰** | 4 | 5 | 2 | 1 | **7.7** |
| 4 | **T0-5 Standards Stack 1페이지 시각 디자인** | 4 | 4 | 2 | 1 | **6.7** |
| 5 | T0-3 1호 파일럿 대학 타겟 리스트 | 5 | 4 | 2 | 4 | 6.8 |
| 6 | T1-1 Commercial Deck | 4 | 5 | 4 | 3 | 6.1 |
| 7 | T1-2 4자 MoU 뼈대 | 4 | 5 | 3 | 5 | 6.0 |
| 8 | T2-1 xAPI Profile JSON-LD | 4 | 5 | 4 | 2 | 6.4 |
| 9 | T2-3 xAI 카드 5요소 Storybook | 4 | 4 | 3 | 1 | 6.2 |
| 10 | T2-4 Demo Figma full mockup | 4 | 4 | 3 | 1 | 6.2 |
| 11 | T2-5 CLR VC 서명 PoC (레코스 공동) | 3 | 5 | 4 | 5 | 4.5 |
| 12 | T2-6 4-Gate Governance 위원회 | 3 | 4 | 2 | 5 | 4.5 |
| 13 | T2-2 CASE alignment 샘플 1학과 | 3 | 4 | 4 | 4 | 3.8 |
| 14 | T1-3 회장 follow-up 제안서 | 3 | 5 | 2 | 2 | 6.4 |
| 15 | T3-1 Counterfactual Simulator MVP | 2 | 4 | 5 | 4 | 2.3 |
| 16 | T3-3 Pace Agent 베타 | 3 | 4 | 4 | 2 | 4.4 |

---

## Claude가 지금 추천하는 Top 5 (발표일 기준 순서)

| # | 작업 | 왜 지금 | 소요 (예상) |
|---|---|---|---|
| **1** | **T0-1 PPT 슬라이드 작성** | 발표 당일 없으면 치명적. v2 §9 구조대로 바로 제작 가능. | 3~5일 |
| **2** | **T0-2 Demo A/B/C 영상 스크립트 + 클릭 프로토타입** | 발표의 중심. 구현 없이 Figma·Keynote로 **impression 영상**. | 7~10일 (병렬) |
| **3** | **T0-4 Q&A Rehearsal** | 회장님 방어 라인 통과의 실질적 방패. 모의 회장 역할로 3회 리허설. | 2~3일 |
| **4** | **T0-3 1호 파일럿 대학 타겟 + 접근 루트 정리** | 발표 중 공개 여부·Q&A 대비. 조용상 교수·NetLearning 네트워크 탐색. | 5~7일 |
| **5** | **T1-2 4자 MoU Term Sheet (발표 전 내부 합의)** | 발표에서 "다음 회의에 MoU"를 약속하려면 **내부 미리 합의**가 필수. | 7~10일 |

**발표 후 90일 파일럿을 실제로 시작하려면** 동시에 T2-1 (xAPI Profile) · T2-3 (xAI Storybook) · T2-6 (4-Gate 위원회) 를 발표 전후부터 병행 착수해야 함. 이 3개가 파일럿 MVP의 가장 큰 blocking 요소.

---

## Claude 판단의 근거 2가지

1. **이 제안서는 "약속" 문서다**. AES 발표 후 NetLearning 회장이 "그럼 구체 증거는?" 질문 시 **즉시 보여줄 실물**이 있어야 신뢰. Figma mockup · xAI Storybook · xAPI Profile 초안은 "말이 아닌 물건"의 증거.
2. **4자 구조 자체가 자산**. 각자 자신의 강점을 명확히 서면화하지 않으면 파일럿 착수 후 역할 분쟁 위험. MoU가 비상구.

## Round 2 식으로 Codex에 묻고 싶은 것

1. Codex가 내 **우선순위 매김(T0~T4)** 에 동의하는지? 재정렬 제안 있는지?
2. 내가 놓친 작업이 있는지? (예: 위기 관리, 특허 출원, 이벤트 카탈로그 AsyncAPI 공식화, 개발팀 채용 등)
3. **T0 단계에 내가 너무 많이 넣었는지**? 발표일 기준 리소스 분배는 현실적인지?
4. **CLR VC PoC (T2-5)** 우선순위가 낮은 편인데, 레코스 관점에서는 최우선일 수 있음. 의견은?
5. **발표 리허설을 Codex가 가상 회장 역할로 시뮬레이션**해볼 가치 있는지?
