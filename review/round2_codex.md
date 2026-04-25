# Codex Round 2 — Claude 리뷰 교차 비평

## 0. Claude 리뷰 총평 (한 단락)
Claude 리뷰의 강점은 “분석 플랫폼처럼 보이는 부분”을 생성·에이전트·causal/uplift 데모로 끌어올려야 한다는 무대 감각이다. 약점은 일부 제안이 구현 난이도와 개인정보 리스크를 과소평가한다는 점이다. 내 Round 1은 모델·표준·정책 학습의 방어 가능성을 더 중시했고, Round 2에서도 그 기준은 유지하되 Claude의 “보이는 AI-native 장면” 요구는 수용한다.

## 1. 시나리오별 판정 대조표

| # | Codex R1 판정 | Claude R1 판정 | Codex R2 재판정 | 결정 근거 (1줄) |
|---|---|---|---|---|
| S01 | Mixed | C+ | C+/Mixed | 현재는 z-score heatmap이 핵심이라 Claude의 저평가가 맞고, Codex의 Struggle Model 없이는 방어가 안 된다. |
| S02 | Mixed | B- | B- | 지식추적은 AI 후보지만 BKT/DKT 로드맵 혼선과 반사실 효과 과장이 약점이다. |
| S03 | Rule-based에 가까운 Mixed | C | C+ | clustering은 평범하고, 생성형 표준답변·5분 재설명 생성까지 가야 한다. |
| S04 | Rule-based | C+ | C+ | Claude의 bandit은 필요하지만 핵심은 survival+uplift 기반 개입 효과 추정이다. |
| S05 | Mixed | B | B- | UX는 좋지만 실시간 threshold dashboard라서 AI-native 데모로는 아직 약하다. |
| S06 | Mixed | C- | C+ | 통학 UX는 일본 시장에 유효하지만, AI-native는 개인 생성 Audio Capsule이 붙어야 성립한다. |
| S07 | Mixed, 시장 차별성 강함 | A- | B+ | Claude처럼 대표 데모로 밀되, “LLM ES 작성기”가 아니라 CLR 근거 narrative로 제한해야 한다. |
| S08 | AI-native에 가장 가까운 후보 | B | B+ | Claude보다 높게 본다. 일본 제미 문화와 연구 계보 그래프는 NetLearning 청중에게 강하다. |
| S09 | Mixed | B+ | B | 공정성 angle은 좋지만 rubric-calibrated grading과 불확실성 없이는 과장 위험이 있다. |
| S10 | Rule-based에 가까운 고전 모델 | C+ | C+ | GBT+SHAP early warning은 낡았다. Support Policy Simulator로 전환해야 한다. |

S01은 Claude의 “난관 해소 에이전트”가 발표 장면으로 더 강하다. 다만 최종 설계의 중심은 Codex R1의 `Struggle Segment Model + Bayesian change-point`여야 한다. 생성형 미니 강의는 모델 출력 이후의 action layer로 흡수한다.

S07은 Claude가 더 정확히 무대 가치를 봤다. 단 A-까지 올리려면 “지원서 자동 작성”이 아니라 “검증 가능한 학습 성취를 일본식 문체로 구조화”한다는 가드가 필요하다.

S08은 Codex R1 판단을 유지한다. 일본 대학 회장에게는 generic multimodal보다 제미 지식 계승이 더 제품 전략적으로 유효하다.

## 2. 시나리오 업그레이드안 — 두 리뷰 통합/선택

**합쳐야 할 것**
- S01: Codex의 원인 추정 모델 + Claude의 5분 재설명 자료 생성 + 2주 효과 검증을 하나의 closed loop로 묶는다.
- S03: Codex의 Knowledge Debt Graph + Claude의 generative co-answer를 결합한다.
- S05: Codex의 Live Understanding State를 기본 화면으로 두고, Claude의 Ambient AI는 미래형 concept clip으로만 사용한다.
- S06: Codex의 Commute Learning Agent와 Claude의 Personalized Audio Capsule은 사실상 같은 방향이므로 병합한다.
- S08: Codex의 Research Lineage Graph에 Claude의 상주 연구 조교 에이전트를 붙인다.
- S09: Codex의 rubric/IRT 기반 채점 copilot에 Claude의 drift 교정 문제의식을 유지한다.

**둘 중 하나를 선택해야 할 것**
- S01 충돌: Claude안이 데모에는 강하지만, 최종 문서의 기술 근거는 Codex안으로 간다. `Struggle Segment Model`이 원인과 불확실성을 산출하고, “5분 미니 강의 생성”은 교수자 승인 action으로 배치한다.
- S04 충돌: `survival + uplift`를 선택한다. Contextual Bandit은 톤·시간·카드 변형 선택에는 적합하지만, 학생 지원 개입은 지연 outcome과 harm risk가 있어 causal/uplift가 우선이다.
- S10 충돌: Codex의 `Support Policy Simulator`를 선택한다. Claude의 Uplift Forest는 그 안의 모델 컴포넌트로 넣는다. 화면은 “위험 학생 리스트”가 아니라 “이번 주 효과가 큰 지원 정책 3개”여야 한다.

**폐기해야 할 것**
- “5분 내 TTS+슬라이드 자동 합성 영상”을 MVP 약속처럼 쓰는 표현은 폐기한다. 초안 생성·교수자 승인·효과 검증으로 낮춘다.
- Ambient AI 이어피스를 1순위 라이브 데모로 세우는 것은 폐기한다. 개인정보·강의실 녹음·시연 안정성이 부담이다.
- “MVP부터 GKT” 주장은 폐기한다. MVP는 BKT+IRT+불확실성으로 투명하게 말하고, P2 GKT 로드맵을 공개한다.
- “모든 성취가 자동 CLR”은 폐기한다. 학생에게 유리하고 검증 가능한 성취만 동의 기반으로 CLR화한다.

## 3. 신규 시나리오 제안 — 통합 매핑

**사실상 동일하거나 병합할 것**
- Claude S-new1 Lecture Design Co-Pilot ≈ Codex N05 Course Co-Creation Studio
- Claude S-new2 Learning Companion Agent ≈ Codex N01 Pace Agent
- Claude S-new3 Counterfactual What-If ≈ Codex N02 반사실 개입 시뮬레이터
- Claude S-new4 Multimodal Coach ≈ Codex N04 멀티모달 풀이 이해

**한쪽에만 있는데 반드시 포함할 것**
- Codex N03 Real-time Adaptive Path: response-level adaptation을 보여주는 가장 직접적인 AI-native 학습 장면이다.
- Claude S-new6 Bidirectional Instructor-AI: 별도 대형 시나리오보다 “교수자 스타일 프로필” 기능으로 전 시나리오에 깔아야 한다.

**둘 다 제안했지만 우선순위 낮게 둘 것**
- Multimodal Coach는 AES 20분 핵심에서는 후순위다. 데모 파워는 높지만 Photomath/Khanmigo류 problem solver로 보일 위험이 있고, NetLearning의 LMS 전략·일본 특화·표준 디펜스와 연결이 약하다.
- Curriculum Optimizer는 P4다. 다학기·다학과 데이터가 없으면 약속이 커 보인다.

**최종 Top 5 신규 시나리오**
1. Course Co-Creation Studio: 난관 탐지 → 자료 생성 → 교수자 승인 → 효과 검증.
2. Learning Companion / Pace Agent: 학생별 계획·복습·마감 회수.
3. Support Policy / Counterfactual Simulator: 개입별 uplift와 불확실성 비교.
4. Real-time Adaptive Path: 문항 1개마다 다음 문제·힌트·난이도 조정.
5. Instructor-AI Teaching Profile: 교수법 철학과 말투를 AI 출력에 반영.

AES 20분에서 데모 가능한 것은 1, 3, 그리고 기존 S07 Shukatsu Forge다.

## 4. 화면·CTA·mock 비교

- Claude의 Ambient AI 이어피스보다 Codex의 Live Understanding State + 교수자 CTA가 더 유효하다. 이어피스는 멋있지만 개인정보·하드웨어·시연 리스크가 크다.
- Claude의 “AI와 반박하기” 음성 인터랙션보다 Codex의 “개입 실험 카드 + 무시 이유 선택”이 우선이다. 음성 반박은 governance demo로 좋지만, 무시 이유 선택은 바로 모델 label과 CASE mapping review queue로 연결된다.
- 일본어 CTA는 Codex안이 더 다양하고 제품 화면에 바로 넣기 쉽다. Claude안은 Shukatsu mock의 일본어 설득력이 강하므로 해당 화면에 집중 반영한다.
- Shukatsu Forge는 Claude의 일본어 mock을 기본으로 쓰되, Codex의 `根拠を確認してから下書き生成`, `この表現は強すぎます` 가드를 붙인다.

**최종 발표 데모 3장**
1. `教材改善案をAIと作成 / AI와 강의자료 개선`: S01/S03/S05를 하나의 closed loop로 압축.
2. `ガクチカ草案 v2 — CLRで検証可能`: 일본 취업·경어·CLR을 한 화면에서 증명.
3. `介入効果シミュレーション / Support Policy Simulator`: 위험 예측이 아니라 개입 효과·불확실성·낙인 방지를 보여준다.

## 5. 데이터·표준 레이어 — 합의 vs 이견

Claude의 xAPI Profile·CASE Registry·CLR 전면·OneRoster/Ed-Fi 보강은 맞다. 다만 Codex R1처럼 xAPI와 internal event를 분리하고, CASE를 L5 노드 이름이 아니라 alignment schema로 다뤄야 조용상 교수 앞에서 방어된다.

**표준 역할 분담 슬라이드 초안**

| 레이어 | 표준/스키마 | AI-X 역할 | 적용 시나리오 | 가드레일 |
|---|---|---|---|---|
| 학사·수강 | OneRoster, EDU-API | 사용자·강좌·등록·역할 동기화 | 전체 | xAPI로 roster를 대체하지 않음 |
| 도구 연결 | LTI Advantage | NetLearning/manaba에서 AI-X 기능 launch | 전체 | Deep Linking/AGS/NRPS 명시 |
| 학습 이벤트 | Caliper + xAPI Profile | 교환 가치 있는 학습 경험 기록 | S01~S10 | internal event와 분리 |
| 내부 감사 | internal audit schema | AI 호출·모델 버전·권한·purpose 기록 | S01, S10 | LRS에 억지 저장 금지 |
| 역량 정렬 | CASE | local concept와 공식 역량 item 매핑 | S02, S07, S08 | exact/close/broad/narrowMatch 구분 |
| 성취 증명 | CLR + Open Badges | 학생에게 유리한 검증 가능 evidence 발급 | S07 중심, 일부 확장 | 감시 지표는 CLR 금지 |
| 개인정보 | APPI controls | 동의·열람·삭제·목적 제한 | 전체 | 기본 최소 수집 |

## 6. 뜬소리 재작성 — 우선 10개 확정

| 라인 | 원문 문제 | 대체 문장 |
|---|---|---|
| 24 | “모든 행동을 xAPI로 수집”은 감시·표준 오용으로 읽힘 | 학습·평가·개입 이벤트를 목적별 표준 프로파일로 수집하고, 각 AI 판단의 근거·불확실성·권장 행동·효과 검증 계획을 설명하는 일본 대학용 학습 운영 AI 레이어. |
| 30, 785 | “Evidence + Reasoning + Action 강제”가 선언적임 | 모든 AI 출력은 근거 이벤트, 모델 버전, 불확실성, 권장 행동, 효과 측정 계획을 포함하며, 스키마 CI와 bias/drift review를 통과한 카드만 배포한다. |
| 32, 348, 794 | BKT/DKT 운영 상태가 충돌함 | MVP는 BKT+IRT+개인 half-life로 숙달도와 불확실성을 갱신하고, P2부터 GKT/SAKT로 전환한다. 현재 사용 모델명과 한계는 UI와 문서에 표시한다. |
| 43, 620, 625 | xAPI를 모든 이벤트 저장소처럼 씀 | 모든 학습 관련 이벤트는 SDK로 수집하되, 교환 가치 있는 이벤트만 xAPI/Caliper 프로파일로 변환하고 운영·AI 감사 이벤트는 internal audit schema에 보존한다. |
| 47 | “일본 문화 특화”가 Omotenashi 단어에 의존 | 일본 특화는 Meiwaku 이의제기, Honne/Tatemae 톤 조절, 前期/後期·ゼミ·就活·敬語 레벨을 스키마와 UX의 1급 요소로 구현한다. |
| 76, 158 | 효과 수치가 인과 검증 없이 단정적임 | 효과 수치는 section×content 단위 cluster-randomized trial과 2주 사전 등록 outcome으로 검증하며, 불확실성 구간과 overlap을 함께 표시한다. |
| 90, 94 | S01이 z-score dashboard로 보임 | 구간별 난관 확률은 행동 시퀀스, 자막/슬라이드, 질문 임베딩, 선수 개념 상태를 입력한 `segment_struggle_model`이 산출하고, z-score는 보조 evidence로만 사용한다. |
| 354 | “5분 복습하면 86%”는 반사실 과장 | 지금 5분 복습 시 시험 시점 예상 정답률은 68~76%입니다. 유사 학생 42명과 현재 오답 패턴 기준이며, 신뢰구간이 넓으면 추천하지 않습니다. |
| 398, 407, 554, 574 | risk score와 Recall 중심은 낙인 위험 | 마감·이탈 위험 예측은 보조 신호로 두고, 교수자 화면은 개입별 expected uplift, 학생 부담 증가 가능성, false-positive regret, calibration error를 기준으로 정렬한다. |
| 514 | CASE를 연구 산출물 저장소처럼 표현 | 제미 산출물은 Research Lineage Graph에 저장하고, 관련 연구역량만 CASE-aligned competency item과 연결한다. CLR evidence는 학생 동의 후 검증 링크로 발급한다. |

## 7. 프레젠 20분 구조 — Claude안 vs Codex안

최종 결정은 Codex 뼈대가 더 설득력 있다. NetLearning 회장에게 첫 메시지는 “LMS 대체”가 아니라 “기존 LMS 위에 붙는 학습 운영 AI 레이어”여야 한다. 다만 Claude의 시간 배분과 3데모 구성은 채택한다.

**Codex R2 최종 구조**
- 0:00–2:00: NetLearning/manaba를 대체하지 않고 AI 운영 지능을 얹는 제안.
- 2:00–7:00: 데모 1, Course Co-Creation closed loop.
- 7:00–10:00: 데모 2, Shukatsu Forge + CLR + 敬語.
- 10:00–13:00: 데모 3, Support Policy Simulator.
- 13:00–16:00: 표준 역할 분담 1장 + APPI/Meiwaku 방어.
- 16:00–19:00: 90일 검증 파일럿 + 6개월 공동 파일럿 옵션.
- 19:00–20:00: 역할 분담과 ask.

## 8. Round 3 통합안 작성 지침

1. 기능 카탈로그를 쓰지 말고 `감지 → 원인 추정 → 개입 → 효과 검증 → 정책 갱신` closed loop로 재구성한다.
2. 데모 가능한 것과 P2/P4 로드맵을 분리한다. GKT, causal, Ambient AI는 데이터 요구를 명시한다.
3. 모든 AI 출력은 evidence, uncertainty, action, measurement plan을 갖게 한다.
4. xAPI/internal event, CASE/local concept, CLR/audit evidence를 절대 섞지 않는다.
5. 일본 특화는 Shukatsu, Zemi, Liner, Meiwaku, 敬語로 증명하고 Omotenashi 단어만 반복하지 않는다.

## 9. 여전히 미해결인 Open Question

- 1호 파일럿 대학·학과·강좌가 어디인지, 과거 학기 데이터와 intervention log가 있는지.
- NetLearning, 위키드스톰, 레코스, 조용상 교수의 역할·IP·수익 배분을 어디까지 발표에 넣을지.
- Shukatsu Forge에서 AI 작성 보조가 채용 윤리와 대학 커리어센터 정책에 어떻게 맞는지.
- CLR 발급 주체가 대학인지 플랫폼인지, 검증 링크의 법적·운영 책임은 누가 지는지.
- CASE와 일본 MEXT 교육과정/대학 역량 체계 매핑을 실제로 누가 승인할지.
- Ambient AI/강의실 음성 수집을 concept video로만 둘지, 파일럿 범위에 넣을지.
- 선배 질문·메모 공개 동의의 기본값을 off로 바꿀지, 학교 정책 프리셋으로 둘지.