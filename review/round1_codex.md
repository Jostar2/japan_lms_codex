# Codex Round 1 리뷰 (독립)

## 0. 리뷰어의 한 줄 진단

이 문서는 현재 **좋은 LA 명세, 약한 AI 제품** 상태.

## 1. 시나리오별 AI-native 성적표

### S01. 동영상 난관 구간 - **Mixed, 현재는 규칙 기반 히트맵에 가깝다**

근거: §01-D에서 `signal_score = w1·seek_back + ...`로 집계하고(line 90), 코호트 평균·표준편차와 `+2σ`로 난관 후보를 잡는다(line 94). §01-K의 z-score 기준표도 수강생 수별 임계값 조정이다(line 244). 이는 학습분석 대시보드로는 좋지만, NetLearning 회장 입장에서는 “그건 10년 전 LA heatmap 아닌가?”라고 볼 가능성이 높다.

AI-native 요소도 있다. 텍스트 임베딩, HDBSCAN, L5 개념 매핑(line 99~101), cold start 시 동일 개념 다른 영상의 난관 패턴을 시드로 쓰는 설계(line 250)는 방향이 좋다. 다만 핵심 판단은 아직 “집계 이상치 탐지”다.

업그레이드안:

- `+2σ bucket`을 최종 판단으로 두지 말고, `Struggle Segment Model`을 별도 모델로 둔다.
- 입력: 영상 자막, 슬라이드 OCR, 음성 속도/침묵, seek/pause, 질문 임베딩, 이전 개념 숙달도, 선수 개념 상태.
- 모델: Bayesian change-point detection + sequence transformer. 구간별 `P(struggle | behavior, transcript, learner_state)`를 산출한다.
- 출력: “이 구간이 어려움”이 아니라 “어떤 선수 개념이 비어 있어 이 구간이 어려웠는지”를 예측한다.
- 개입 학습: 교수자가 `[강의안 메모에 추가]`, `[무시]`, 학생이 `already_known / not_relevant / too_hard`로 피드백하는 루프(line 130~133)를 bandit reward로 사용한다.
- xAI 카드의 “유사 개선 7건: 재시청률 평균 -45% 예측”(§01-H, line 145 이후)은 causal estimate 없이는 위험하다. `예상 효과: -18%~-32%, 유사 강좌 12건, doubly robust estimator, overlap 0.71`처럼 근거 모델을 명시해야 한다.

대체 문장:

> “난관 구간은 seek/pause 이상치만으로 표시하지 않는다. 영상·자막·질문·개념 숙달 상태를 함께 입력한 구간별 Struggle Segment Model이 `P(struggle)`와 원인 개념을 예측하고, 교수자 개입 후 2주 효과를 다시 학습해 다음 추천 정책을 갱신한다.”

---

### S02. 개념 복습 - **Mixed, AI 모델 이름은 있으나 정책이 약하다**

근거: DKT가 개념별 숙달 확률을 갱신한다는 문장(line 348)은 AI-native 가능성이 있다. 그러나 바로 뒤의 `p_mastery 하락폭 ≥ 15%p`, `predicted_retention_today < 40%`, “반의 30% 이상”은 규칙 기반 큐다(line 348). 학생 카드의 “지금 5분 복습하면 시험 시점 예측 86%”(line 354)는 반사실 효과를 말하지만, 실제 문서에는 그 인과 추정 방법이 없다.

판정: 지식추적 엔진은 AI-native 후보지만, 제품 경험은 아직 “복습 알림”이다.

업그레이드안:

- `복습 필수 큐`를 `Adaptive Review Policy`로 바꾼다.
- 모델: BKT/DKT + IRT item difficulty + spaced repetition half-life model + contextual bandit.
- 정책 목표: “오늘 5분을 어디에 쓰면 시험 시점 expected mastery gain이 최대인가?”
- 불확실성: `p_mastery=0.47 ±0.09`, `retention_at_exam=0.62~0.74`처럼 interval로 표시.
- 임계값: 단순 `<40%` 대신 `expected_gain_per_min >= 0.025`이고 `uncertainty <= 0.15`일 때만 자동 추천.
- 학생이 “너무 쉬움 / 너무 어려움 / 이미 앎”을 누르면 item difficulty와 개인 half-life를 즉시 갱신한다.
- 교수자 Top 3는 “많이 약한 개념”이 아니라 “5분 복기 개입의 expected class gain이 큰 개념”으로 정렬한다.

CTA 예시:

- 일본어: `5分だけ復習する`, `問題の難しさを調整する`, `この予測は合っていません`
- 한국어: `5분만 복습하기`, `문항 난이도 조정`, `이 예측은 맞지 않아요`

---

### S03. 질문 쏠림 - **Rule-based에 가까운 Mixed**

근거: 최근 7일 질문과 포럼 글을 임베딩하고 HDBSCAN으로 클러스터링한 뒤, 전주 대비 3배 증가하면 flag로 처리한다(line 373). “비슷한 질문이 이미 있어요” 인라인 안내(line 379)는 UX는 좋지만, AI라기보다 semantic duplicate detection이다.

회장님 관점의 위험: manaba, Moodle 플러그인, Slack/Teams Q&A bot도 유사 질문 묶기와 FAQ 추천은 이미 한다. “클러스터 규모 3배”는 특히 대시보드 냄새가 강하다.

업그레이드안:

- 질문 클러스터를 `Knowledge Debt Graph`로 승격한다.
- 각 질문을 `intent`, `misconception`, `missing prerequisite`, `answer status`, `conflict status`로 구조화한다.
- 모델: embedding clustering + LLM-based misconception extraction + L5 concept graph grounding + answer quality classifier.
- 새로운 출력:
  - “중복 질문이 많다”가 아니라 “Big O 질문 31건 중 22건은 ‘상수항 무시’가 아니라 ‘입력 크기 n의 정의’ 오개념이다.”
  - “교수님 답변 3개가 서로 다르게 설명되어 학생 혼란 가능성이 있다.”
- 교수자 CTA:
  - `この質問を標準回答に統合` / `이 질문을 표준 답변으로 통합`
  - `次回授業の5分説明を生成` / `다음 강의 5분 설명 생성`
- 학생 CTA:
  - `既存の回答で解決` / `기존 답변으로 해결`
  - `まだ解決しないので追加質問` / `아직 해결 안 되어 추가 질문`

---

### S04. 몰아치기 - **Rule-based**

근거: `procrastination_idx` 상승, `active_ms` 하락, H-48 이전 draft 0건이면 risk 가산(line 398). 이후 risk 0.4~0.6, 0.6~0.8, >0.8의 3단계 에스컬레이션(line 400~403)이다. 이 구조는 전형적인 규칙 기반 리텐션 nudging이다.

좋은 점: 일본 시장용 “부담 없는 개입” 톤, 학생 동의 후 교수자 알림, 반 전체 지수 우선 노출(line 407)은 매우 중요하다.

업그레이드안:

- risk score를 “누가 위험한가”가 아니라 “어떤 개입이 이 학생에게 도움이 되는가”로 바꿔야 한다.
- 모델: survival analysis로 마감 실패 hazard 예측 + uplift model로 nudge별 개입 효과 예측.
- 금지: `risk > 0.8이면 상담 슬롯 자동 오픈` 같은 일괄 룰.
- 추천 정책:
  - `P(submit_on_time | no intervention)=0.42`
  - `P(submit_on_time | 15min calendar block)=0.61`
  - `P(stress_increase | notification)=0.18`
  - expected utility가 양수일 때만 개입.
- 학생별 tone selection은 contextual bandit으로 학습한다. 어떤 학생은 “15분만”이 좋고, 어떤 학생은 “자료 1개만 열기”가 더 낫다.
- 수용 기준에 “마감 준수율”만 넣지 말고 `stress uplift <= +0.05`, `nudge opt-out rate < 12%`, `intervention helpfulness >= 3.6/5`를 넣는다.

---

### S05. 실시간 강의 이해 흔들림 - **Mixed**

근거: 슬라이드 체류 +1.5σ, 퀴즈 정답률 < 50%, 질문 클러스터 중 2개 이상이면 flag(line 427). 실시간 WebSocket과 p95 < 3s(line 440)는 구현 기준으로 좋지만, 핵심 판단은 여전히 threshold 조합이다.

AI-native로 보이려면 “실시간 대시보드”가 아니라 “강의 흐름을 재계획하는 모델”이어야 한다.

업그레이드안:

- `Live Understanding State`를 만든다.
- 입력: 슬라이드별 체류, 익명 이해 안 됨 버튼(line 433), 즉석 퀴즈 응답 분포, 질문 임베딩, 이전 선수 개념 숙달도.
- 모델: online BKT/IRT + Bayesian uncertainty update.
- 출력:
  - 현재 슬라이드 이해도 점수
  - 어느 오개념인지
  - 2분 재설명, 예시 교체, 즉석 문제, 다음 슬라이드 진행 중 expected gain 비교
- 교수자 CTA:
  - `2分で例を変えて説明` / `2분 예시 바꿔 설명`
  - `確認問題を1問出す` / `확인 문제 1개 출제`
  - `このまま進む` / `그대로 진행`
- 학생 화면:
  - 교수자가 선택한 재설명 경로에 맞춰 학생 노트의 해당 concept anchor가 자동 생성된다.

---

### S06. Liner Mode - **Mixed, 일본 특화 UX로는 강하지만 AI-native는 약하다**

근거: 모바일+세로 모드 자동 전환, 통학 패턴 2주 학습, 네트워크 감지(line 452), One-Hand UI, Audio Capsule, Smart Pre-fetch(line 455~457). 일본 대학생 통학 맥락에는 매우 좋다. 다만 현재는 context-aware UX와 캐싱에 가깝다.

AI-native 업그레이드안:

- `Commute Learning Agent`로 바꾼다.
- 학생의 통학 시간, 네트워크 예측, 오늘 과제, 약점 개념, 음성 선호를 결합해 “통학 23분 학습 패키지”를 자동 편성한다.
- 모델: route/time prediction + content summarization + mastery gain ranking.
- threshold:
  - `predicted_commute_window >= 20min`
  - `network_loss_probability >= 0.35`
  - `available_micro_content >= 3`
  - `expected_mastery_gain >= 0.05`
- Audio Capsule은 단순 TTS가 아니라 개인 약점 개념 중심으로 재구성한다.
- 학생이 잠금화면에서 `わかった / まだ不安`을 누르면 L3 `meta_cognition_calibration`과 L3 knowledge state가 갱신된다.

---

### S07. Shukatsu Forge - **Mixed, 시장 차별성은 강하다**

근거: `learning_episode`에서 난관 극복 구간을 추출하고 CLR로 누적(line 478), 가쿠치카 초안을 생성하고 CLR 검증 링크를 붙인다(line 481). 일본 대학 시장에서는 강한 시나리오다. NetLearning 회장이 “일본 대학에는 이게 먹힌다”고 느낄 가능성이 있다.

위험: 현재는 “LLM이 ES 초안 써준다”로 보일 수 있다. 채용 문서 자동 생성은 이미 흔하다. 차별성은 CLR 근거와 학습 에피소드 그래프에 있어야 한다.

업그레이드안:

- `Evidence-backed Career Narrative Model`로 정의한다.
- 학습 이벤트를 `challenge -> strategy -> evidence -> outcome -> competency` 구조로 변환한다.
- CASE 역량, 과제 루브릭, peer review, 배지, 출석, 회복 곡선을 모두 CLR assertion으로 연결한다.
- 생성 전 guard:
  - 근거 이벤트 3건 이상(line 490)은 좋지만 부족하다.
  - 최소 `2종류 이상의 evidence source`, `1개 이상의 externally verifiable achievement`, `competency confidence >= 0.7` 조건 추가.
- 학생 편집 루프:
  - 학생이 문장을 수정하면 “과장 위험”, “근거 부족”, “역량 표현 약함”을 실시간 표시.
- CTA:
  - `根拠を確認してから下書き生成` / `근거 확인 후 초안 생성`
  - `この表現は強すぎます` / `이 표현은 근거보다 강합니다`

---

### S08. Zemi Hub - **AI-native에 가장 가까운 후보**

근거: Whisper + speaker diarization, 연구 주제 임베딩, 과거 산출물 벡터 비교, Inheritance Graph(line 503), 신규 주제 중복 체크(line 509). 일본 대학의 제미 문화를 정면으로 잡은 점도 좋다.

위험: `L5 Content Graph에 제미 CASE 노드로 편입`(line 514)은 표준 관점에서 부정확해 보인다. CASE는 교육과정/역량 표준 교환이지, 제미 연구 산출물 자체를 무리하게 CASE item으로 넣는 저장소가 아니다.

업그레이드안:

- `Research Lineage Graph`로 명명한다.
- 노드:
  - research_question
  - method
  - dataset
  - theory
  - cited_paper
  - finding
  - unresolved_issue
  - competency alignment
- 엣지:
  - extends
  - contradicts
  - reuses_dataset
  - shares_method
  - cites
  - supervised_by
- AI-native 포인트:
  - 단순 top-k 추천이 아니라 “이 주제는 2022년 선배 연구의 미해결 질문을 이어받는다”를 설명한다.
  - 새 연구 주제 입력 시 novelty score와 duplication risk를 동시에 표시한다.
- CTA:
  - `先行研究の系譜を見る` / `선행 연구 계보 보기`
  - `未解決の問いを引き継ぐ` / `미해결 질문 이어받기`
  - `重複ではなく発展案に変換` / `중복이 아닌 발전안으로 바꾸기`

---

### S09. 채점 일관성 - **Mixed, 잘 키우면 AI-native**

근거: 시간대별 평균 drift, 순서별 drift, 유사 답안 k-NN 점수 편차(line 529), 추천 점수와 유사 답안 평균을 제시(line 532). 이는 실제 교수자의 고통을 정확히 찌른다.

위험: k-NN 유사 답안 평균은 “AI 추천 점수”로 포장하기 쉽지만, 루브릭 정렬과 평가 공정성 검증이 없으면 위험하다.

업그레이드안:

- `Rubric-Calibrated Grading Copilot`으로 바꾼다.
- 모델:
  - rubric criterion classifier
  - embedding-based similar answer retrieval
  - Many-Facet Rasch / IRT로 채점자 severity drift 추정
  - uncertainty-calibrated score interval
- 추천은 단일 점수 78점이 아니라 `74~80점, 중심 77점, 불확실성 높음/낮음`으로 표시한다.
- 교수자가 추천을 거부하면 이유를 선택하게 한다.
  - `rubric_exception`
  - `creative_answer`
  - `model_missed_point`
  - `similar_answer_not_relevant`
- 이 피드백은 다음 anchor set 재학습에 들어간다.
- 수용 기준 `동일 답안 블라인드 재채점 편차 < 3점`(line 542)은 좋다. 여기에 `rubric criterion agreement κ >= 0.72`를 추가한다.

---

### S10. Early Warning - **Rule-based에 가까운 고전 모델**

근거: 2주 행동 변화, 과제 지연, 포럼 빈도, 개념 숙달 정체, 사회 지표를 Gradient Boosting으로 스코어링하고 SHAP로 이유를 표시한다(line 554). 회장님은 이걸 “2016년식 early warning system에 SHAP 붙인 것”으로 볼 가능성이 높다.

좋은 점: 개인 명단보다 반 병목을 먼저 보여주고, 열람 목적 입력과 감사 로그를 강제하는 UX(line 556~559)는 강하다.

업그레이드안:

- `Risk Prediction`을 전면에 세우지 말고 `Support Policy Simulator`로 바꾼다.
- 모델:
  - risk model: `P(D_or_lower)`
  - uplift model: `P(recovery | intervention) - P(recovery | no intervention)`
  - fairness model: 학과, 성별, 유학생, 장학 상태 등 민감/준민감 변수별 calibration audit
  - uncertainty model: sparse data 학생에 대한 예측 보류
- 교수자 화면은 “위험 학생”이 아니라 “이번 주 반 전체에 효과가 큰 개입 3개”로 시작한다.
- 학생 개인 접근 시:
  - `예측 점수`보다 `지원 근거`, `권장 접촉 톤`, `개입 예상 효과`, `오판 가능성`을 표시한다.
- 수용 기준 `Recall ≥ 0.7`(line 574)은 너무 위험하다. Recall만 최적화하면 false positive 낙인이 늘어난다.
- 추가 기준:
  - `positive predictive value >= 0.45`
  - `false positive contact regret < 8%`
  - `calibration error <= 0.05`
  - `intervention uplift >= +10%p`
  - `student perceived surveillance <= 2.5/5`는 이미 좋으므로 유지(line 576).

## 2. 빠진 AI-native 시나리오 신규 제안

### N01. 상주형 Pace Agent - 학생 대신 계획하고, 확인하고, 회수한다

한 줄 정의: 단발 추천 카드가 아니라, 학기 내내 학생의 과제·복습·시험 대비를 추적하고 실행까지 회수하는 개인 학습 에이전트.

페인포인트:

- 학생: “추천은 많은데 뭘 먼저 해야 할지 모르고, 미루면 아무도 회수하지 않는다.”
- 교수자: “학생에게 계속 리마인드하기 어렵고, 개별 계획을 봐줄 시간이 없다.”
- 학교: “LMS 접속은 있는데 실제 학습 진전이 보이지 않는다.”

감지 -> 추론 -> 출력:

- 신호:
  - `assignment.due_date`, `assignment.save_draft`, `assessment.response.submit`, `content.video.complete`
  - calendar availability
  - S02의 `concept_mastery`, S04의 `deadline_behavior`, S06의 통학 시간 예측
- 모델:
  - task graph planner
  - DKT/BKT mastery state
  - contextual bandit for nudge timing/tone
  - LLM tool-calling agent for calendar block, review set generation, draft checklist
- 임계값:
  - `expected_late_probability >= 0.35`
  - `available_time_block >= 15min`
  - `expected_mastery_gain_per_min >= 0.02`
  - `student_opt_in = true`
- 출력:
  - 오늘 할 일 3개를 자동 재정렬
  - 학생이 실행하지 않으면 6시간 뒤 더 작은 행동으로 쪼개 재제안
  - 48시간 미응답이면 학생 동의 기반으로 TA/교수자 지원 권유

학생 화면 mock:

```text
┌─ 今日のAI学習プラン / 오늘의 AI 학습 계획 ─────────────┐
│ 18:40-18:55  統計学: 信頼区間 3問だけ                  │
│ 근거: 어제 오답 2개, 시험 D-9, 통학 예상 22분           │
│ 예상효과: 시험 시점 숙달 +6~9%p                         │
├──────────────────────────────────────────────┤
│ [このまま始める / 이대로 시작]                          │
│ [5分に短くする / 5분으로 줄이기]                         │
│ [今日は無理 / 오늘은 어려움]                             │
└──────────────────────────────────────────────┘
```

교수자 화면 CTA:

- `支援が必要な計画だけ見る` / `지원 필요한 계획만 보기`
- `クラス共通の遅延要因を見る` / `반 공통 지연 요인 보기`

공유 데이터 자산: S02 `concept_mastery`, S04 `deadline_behavior`, S06 Liner Mode, §3-3 xAI 카드, §3-1 assignment/session events.

---

### N02. 반사실 개입 시뮬레이터 - “이 개입을 하면 성적이 바뀌는가?”

한 줄 정의: 교수자가 강의 개입을 선택하기 전에, 유사 학기·유사 학생·유사 개념 데이터를 바탕으로 expected impact와 불확실성을 보여준다.

페인포인트:

- 교수자: “5분 복기, 추가 퀴즈, 보조 영상 중 뭘 해야 실제로 효과가 있는지 모른다.”
- 학과장: “콘텐츠 개선 예산을 어디에 써야 할지 근거가 약하다.”
- NetLearning: “AI LMS의 차별성은 예측보다 개입 효과 증명에 있다.”

감지 -> 추론 -> 출력:

- 신호:
  - S01 난관 세그먼트
  - S02 mastery 변화
  - S05 live quiz 결과
  - S15 콘텐츠 ROI 예정 데이터
  - 교수자 액션 로그
- 모델:
  - causal graph: prerequisite, content exposure, prior ability, intervention, outcome
  - doubly robust estimation
  - causal forest / uplift modeling
  - propensity overlap check
- 임계값:
  - `overlap_score >= 0.6`
  - `n_similar_cases >= 30`
  - `effect_ci_width <= 0.18`
  - 조건 미달 시 “효과 추정 불가”로 표시
- 출력:
  - 개입 후보별 expected gain
  - confidence interval
  - 근거가 되는 유사 케이스
  - 적용 후 2주 재측정 계획 자동 생성

교수자 화면 mock:

```text
┌─ 介入効果シミュレーション / 개입 효과 시뮬레이션 ─────┐
│ 개념: 신뢰구간, 대상: 2학년 통계학 II                  │
│ 후보 A: 다음 강의 5분 복기                              │
│   예상 재평가 정답률 +8~14%p, overlap 0.74               │
│ 후보 B: 보조 영상 5분                                    │
│   예상 재시청률 -12~22%, 학습효과 근거 약함              │
│ 후보 C: 퀴즈 3문항                                       │
│   예상 정답률 +5~9%p, 부담감 증가 가능성 낮음             │
├──────────────────────────────────────────────┤
│ [5分復習を授業計画に追加 / 5분 복기를 강의계획에 추가]   │
│ [2週間後に効果検証 / 2주 후 효과 검증]                   │
└──────────────────────────────────────────────┘
```

공유 데이터 자산: S01 segment, S02 mastery, S05 live quiz, S10 intervention outcomes, §3-1 inference/intervention events.

---

### N03. 응답 1건마다 경로가 바뀌는 Real-time Adaptive Path

한 줄 정의: 퀴즈 한 문항을 풀 때마다 다음 문항, 힌트, 설명 방식, 난이도를 즉시 재계산한다.

페인포인트:

- 학생: “추천 복습은 있는데 지금 내가 틀린 이유에 맞는 다음 문제가 아니다.”
- 교수자: “개인화가 있다고 하지만 결국 같은 문제 세트를 풀린다.”
- 회장님: “진짜 AI라면 response-level adaptation을 보여줘야 한다.”

감지 -> 추론 -> 출력:

- 신호:
  - `assessment.response.submit`: response, time_ms, changes, hint_used
  - self confidence: `잘 안다 / 애매하다 / 찍었다`
  - L5 concept prerequisites
  - item metadata: difficulty, discrimination, misconception tag
- 모델:
  - IRT 2PL/3PL for item parameters
  - online BKT/DKT for concept mastery
  - RL/bandit policy for next best item
  - LLM hint generator constrained by misconception tag
- 임계값:
  - `P(misconception_x) >= 0.55`이면 targeted hint
  - `mastery_uncertainty >= 0.20`이면 diagnostic item 우선
  - `frustration_proxy >= 0.65`이면 난이도 하향 및 설명형 문항
- 출력:
  - 다음 문제 자동 선택
  - 힌트 생성
  - 개념 그래프상 선수 개념으로 임시 후퇴
  - 완료 후 CLR/competency evidence 업데이트

학생 화면 CTA:

```text
┌─ 次の1問をAIが調整しました / 다음 1문항을 조정했습니다 ─┐
│ 방금 오답은 계산 실수보다 '표준오차' 개념 혼동 가능성이 큽니다. │
│ 다음 문제는 난이도를 낮추고, 표준오차만 분리해서 확인합니다.   │
├──────────────────────────────────────────────┤
│ [次の問題へ / 다음 문제]                                    │
│ [先に30秒説明 / 먼저 30초 설명]                             │
│ [難しすぎる / 너무 어려움]                                  │
└──────────────────────────────────────────────┘
```

공유 데이터 자산: S02 mastery, S05 quiz stream, L5 concept graph, §3-1 assessment events.

---

### N04. 멀티모달 풀이 이해 - 필기·음성·수식·코드까지 본다

한 줄 정의: 학생이 문제를 푸는 과정의 필기, 음성 설명, 코드 실행, 수식 전개를 함께 이해해 오개념을 잡는다.

페인포인트:

- 학생: “정답은 틀렸는데 어디서 틀렸는지 모르겠다.”
- 교수자: “결과 점수만 보고는 학생 사고 과정을 볼 수 없다.”
- STEM/정보계 학과: “코드·수식·그림 풀이가 LMS에 갇히지 않는다.”

감지 -> 추론 -> 출력:

- 신호:
  - tablet handwriting stroke
  - image upload/OCR
  - ASR transcript
  - code AST, compile error, test failure
  - math expression parse tree
- 모델:
  - handwriting OCR + math parser
  - code embedding + AST error classifier
  - multimodal transformer for solution step alignment
  - misconception graph mapped to CASE/L5 concept
- 임계값:
  - `step_alignment_confidence >= 0.65`
  - `misconception_probability >= 0.6`
  - `privacy_mode = local processing` for sensitive audio if required
- 출력:
  - 최종 답이 아니라 “틀린 단계”에 피드백
  - 교수자에게 반 전체 공통 풀이 오류 heatmap
  - 학생에게 1단계 힌트만 제공

학생 화면 CTA:

```text
┌─ 解き方の途中でつまずきを検出 / 풀이 중 막힌 지점 감지 ──┐
│ 3번째 줄에서 n과 n-1의 자유도를 바꿔 사용했습니다.       │
│ 같은 실수는 이번 반에서 18명에게 나타났습니다.            │
├──────────────────────────────────────────────┤
│ [この行だけヒント / 이 줄만 힌트]                         │
│ [30秒で復習 / 30초 복습]                                  │
│ [自分で続ける / 직접 계속 풀기]                           │
└──────────────────────────────────────────────┘
```

공유 데이터 자산: S02 concept mastery, S09 rubric grading, L5 graph, §3-1 assessment events.

---

### N05. Course Co-Creation Studio - 강의자료가 AI와 함께 개선된다

한 줄 정의: 난관 구간을 찾는 데서 끝나지 않고, 교수자가 AI와 함께 대체 설명·퀴즈·슬라이드·오디오 캡슐을 생성하고 효과를 검증한다.

페인포인트:

- 교수자: “어디가 문제인지는 알겠는데, 고칠 시간이 없다.”
- 학생: “보조 자료가 기존 강의와 말투·범위가 달라 더 헷갈린다.”
- 학과장: “콘텐츠 개선의 전후 효과가 누적되지 않는다.”

감지 -> 추론 -> 출력:

- 신호:
  - S01 struggle segment
  - S03 question cluster
  - S05 live confusion
  - 교수자 기존 자료, syllabus, rubric, CASE objective
- 모델:
  - RAG over course material
  - LLM content generation constrained by CASE objective and professor style
  - item generation + IRT calibration
  - A/B or switchback test for efficacy
- 임계값:
  - `source_coverage >= 0.8`
  - `alignment_to_objective >= 0.75`
  - `hallucination_check = pass`
  - `professor_approval = required`
- 출력:
  - 5분 대체 설명
  - 3문항 formative quiz
  - 일본어/한국어/영어 용어 glossary
  - 다음 학기 강의안 patch
  - 2주 효과 검증 자동 예약

교수자 화면 CTA:

```text
┌─ 教材改善案をAIと作成 / AI와 강의자료 개선 ───────────┐
│ 난관: 12:34-12:42, 개념: 신뢰구간                       │
│ 학생 오개념: 분산과 표준오차 혼동                         │
│ 생성 후보: 5분 설명 1개, 확인문항 3개, 슬라이드 2장        │
├──────────────────────────────────────────────┤
│ [このトーンで生成 / 이 톤으로 생성]                       │
│ [もっと数式中心 / 수식 중심으로]                          │
│ [学生向けにやさしく / 학생용으로 쉽게]                    │
│ [公開して効果測定 / 공개 후 효과 측정]                    │
└──────────────────────────────────────────────┘
```

공유 데이터 자산: S01, S02, S03, S05, L5 CASE mapping, §3-3 xAI card, §3-5 LLM Orchestrator.

## 3. 화면·CTA·인터랙션 차별화 제안

### 3-1. §01-H xAI 카드는 “설명 카드”에서 “개입 실험 카드”로 바꿔야 한다

현재 §01-H 카드(line 145 이후)는 근거, 추론, confidence, 유사 개선을 보여준다. 형태는 좋지만 회장님에게는 “예쁜 analytics card”로 보일 수 있다. 핵심은 confidence가 아니라 **다음 행동의 예상 효과와 검증 루프**다.

개선 mock:

```text
[교수자용 - Intervention xAI Card]

┌─ 12:34-12:42 難所候補 / 난관 후보 ─────────────────────┐
│ 원인 추정: '표준오차' 선수 개념 혼동 가능성 0.71          │
│ 근거: 되감기 +3.2σ, 질문 12건, 오답 패턴 18건             │
│ 모델: segment_struggle_v3, calibration error 0.04         │
├─ 개입 후보별 예상 효과 ────────────────────────────────┤
│ A. 5분 복기: 재평가 정답률 +8~14%p, 근거 강함             │
│ B. 보조 영상: 이탈률 -9~18%, 학습효과 근거 중간           │
│ C. 퀴즈 3문항: 정답률 +5~9%p, 부담 증가 낮음              │
├──────────────────────────────────────────────┤
│ [5分復習を追加 / 5분 복기 추가]                           │
│ [教材案を生成 / 자료 개선안 생성]                          │
│ [2週間後に検証 / 2주 후 검증]                              │
│ [判断が違う / 판단이 다름]                                 │
└──────────────────────────────────────────────┘
```

차별점: “AI가 봤다”가 아니라 “AI가 개입 후보를 비교하고, 교수자가 선택하면 효과를 다시 학습한다”는 순간이 보인다.

---

### 3-2. 학생이 무심코 누른 “어려움”이 모델 학습으로 바뀌는 순간

현재 학생 카드에는 추천이 안 맞으면 알려달라는 링크가 있다(line 163~164). 이를 모델 학습 이벤트로 더 분명히 보여줘야 한다.

```text
[학생 VOD 우측 패널]

┌─ ここで少し止まりましたね / 여기서 잠깐 멈췄네요 ───────┐
│ 같은 지점에서 멈춘 학생들은 보통 '분산 vs 표준오차'를 헷갈렸습니다. │
│ 지금 필요한 도움을 하나만 골라 주세요.                    │
├──────────────────────────────────────────────┤
│ [30秒で説明 / 30초 설명]                                  │
│ [例題を1問 / 예제 1문제]                                  │
│ [もう知っている / 이미 알아요]                             │
│ [違うところが難しい / 다른 부분이 어려워요]                 │
└──────────────────────────────────────────────┘
```

학습 루프:

- `30초 설명` 클릭: hint type reward +1
- `이미 알아요`: 이 학생의 해당 개념 mastery prior 상향 또는 추천 억제
- `다른 부분이 어려워요`: free-text/voice input을 받아 새로운 misconception candidate 생성
- 교수자에게는 개인명이 아니라 “오개념 분포 변화”만 표시

---

### 3-3. 질문 입력 중 “중복 제거”가 아니라 “공동 지식 생성”으로 보이게 한다

현재 S03은 “비슷한 질문이 이미 있어요”(line 379)다. 이 문구는 검색 보조처럼 보인다. “내 질문이 코스 지식 자산으로 병합된다”는 느낌이 필요하다.

```text
[질문 작성창]

┌─ 似た質問があります / 비슷한 질문이 있습니다 ───────────┐
│ 기존 질문 14건은 같은 오개념으로 묶입니다.                │
│ AI가 표준 질문으로 정리하면 다음 학생도 바로 찾을 수 있습니다. │
├──────────────────────────────────────────────┤
│ 표준 질문안: "Big O에서 상수항을 무시해도 되는 이유는?"    │
│ 부족한 부분: 입력 크기 n의 정의                            │
├──────────────────────────────────────────────┤
│ [この質問に統合して投稿 / 이 질문에 합쳐 올리기]            │
│ [新しい観点として投稿 / 새 관점으로 올리기]                 │
│ [先生に5分説明を依頼 / 교수님께 5분 설명 요청]              │
└──────────────────────────────────────────────┘
```

---

### 3-4. 교수자의 “무시”도 AI 학습 신호가 되어야 한다

§01-E의 `[무시]` 액션(line 115)은 감사 로그에만 기록된다고 되어 있다. 이건 낭비다. 무시는 가장 귀한 negative label이다.

개선:

```text
[무시 클릭 후 작은 모달]

┌─ この候補を表示しない理由 / 이 후보를 숨기는 이유 ───────┐
│ [既に授業で説明済み / 이미 수업에서 설명함]                │
│ [重要ではない / 중요하지 않음]                             │
│ [データが偏っている / 데이터가 편향됨]                     │
│ [概念の紐づけが違う / 개념 매핑이 다름]                    │
└──────────────────────────────────────────────┘
```

이유별 모델 반영:

- 이미 설명함: content version/context 반영
- 중요하지 않음: course objective weight 하향
- 데이터 편향: cohort anomaly flag
- 개념 매핑 오류: L5 graph edge review queue 생성

---

### 3-5. Early Warning 화면은 “학생 리스트”가 아니라 “개입 선택판”이어야 한다

S10은 낙인 방지 원칙이 좋다(line 556~559). 하지만 회장님은 early warning 자체를 이미 많이 봤다. 화면 첫 순간부터 다르게 보여야 한다.

```text
[교수자 주간 지원 화면]

┌─ 今週のクラス支援 / 이번 주 반 지원 ───────────────────┐
│ 개인명은 숨긴 상태입니다. 먼저 반 전체에 효과가 큰 개입을 봅니다. │
├──────────────────────────────────────────────┤
│ 1. 과제 시작 장벽 낮추기                                  │
│    대상 패턴: draft 0건 + 개념 숙달 정체 28명              │
│    예상 효과: 제출 지연 -9~13%p                            │
│    [15分スタート枠を送る / 15분 시작 블록 보내기]          │
│                                                            │
│ 2. 신뢰구간 5분 복기                                      │
│    대상 패턴: 선수 개념 표준오차 약화 34명                 │
│    예상 효과: 재평가 정답률 +8~14%p                         │
│    [次回授業に追加 / 다음 수업에 추가]                     │
├──────────────────────────────────────────────┤
│ [個別支援が必要な学生を見る / 개별 지원 필요 학생 보기]    │
│ 목적 입력 후 열람됩니다.                                  │
└──────────────────────────────────────────────┘
```

## 4. 데이터·표준 디펜시블리티 강화

### 4-1. xAPI는 “모든 로그를 담는 통”이 아니다

현재 문서는 “모든 사용자 행동은 xAPI Statement로 남는다”(line 43), `xapi_verb` placeholder(line 620), `POST /xapi/statements`(line 625)를 둔다. 그러나 지금 구조는 xAPI를 의미 있는 학습 경험 표준이라기보다 이벤트 저장소 장식으로 쓰는 인상이다.

강화안:

- 모든 내부 이벤트를 xAPI로 억지 변환하지 말고, `internal_event`와 `xAPI_statement`를 분리한다.
- xAPI에는 Actor, Verb, Object, Result, Context, Extensions를 명확히 설계한다.
- 예: `content.video.seek`는 xAPI core verb가 애매하므로 custom profile verb로 정의하고, `object`는 content segment URI, `context.contextActivities.category`에 course, CASE item, content version을 넣는다.
- `ai.response.delivered`는 일반 학습 경험이라기보다 AI system event다. xAPI로 보낼지, internal audit event로 둘지 구분해야 한다.
- “xAPI Statement 100%”보다 “분석과 이식에 의미 있는 statement profile”이 중요하다.

대체 구조:

```text
raw_event_id
event_name
event_payload
xapi_profile_id
xapi_statement_id nullable
caliper_event_id nullable
case_item_uri nullable
clr_evidence_id nullable
```

### 4-2. CASE 매핑은 L5 concept_id와 1:1이 아니다

현재 L5는 “개념 노드·선후 관계·평가 매핑 (CASE 표준)”이라고만 되어 있다(line 671). S01에서는 L5 개념 그래프 매칭으로 `concept_id`를 확정한다(line 101). 이 정도로는 조용상 교수님 앞에서 약하다.

정확한 설계:

- `local_concept_id`: 플랫폼 내부 개념 노드
- `case_framework_uri`: 공식 교육과정/역량 프레임워크
- `case_item_uri`: CASE CFItem identifier
- `association_type`:
  - exactMatch
  - closeMatch
  - broadMatch
  - narrowMatch
  - prerequisiteOf
  - assessedBy
  - taughtBy
- `alignment_confidence`
- `approved_by`
- `version`

예시:

```text
local_concept: confidence_interval
case_item_uri: case:jp-stat-2026:inferential-statistics:ci
association: exactMatch
prerequisite: standard_error, sampling_distribution
assessed_by: quiz_item_104, midterm_q3
taught_by: content_video_12 segment 754-762s
approved_by: instructor or SME
```

핵심 메시지: CASE는 “그래프 DB에 들어간 노드 이름”이 아니라, 학교·과목·평가·CLR을 관통하는 역량 식별자 체계다.

### 4-3. EDU-API / Ed-Fi / OneRoster / LTI Advantage / Caliper가 빠져 있다

검색 기준으로 EDU-API, Ed-Fi, OneRoster, Caliper, LTI Advantage라는 명칭은 문서에 없다. 외부 연동은 `xAPI LRS + LTI 1.3 + Webhook`(line 34), 미결 결정은 `LTI 1.3 advantage 우선`(line 796) 정도다. NetLearning 회장 앞에서는 이 역할 분담이 바로 질문으로 나온다.

권장 역할 분담:

| 표준 | 역할 | AI-X에서의 위치 |
|---|---|---|
| OneRoster | 수업, 반, 사용자, 등록, 역할 동기화 | SIS/LMS roster bootstrap |
| LTI Advantage | 외부 도구 launch, Deep Linking, Assignment and Grade Services, Names and Roles | NetLearning/manaba와 AI-X 기능 연결 |
| Caliper Analytics | IMS 생태계의 학습 이벤트 센서 표준 | LMS 내부 학습 이벤트 표준화 |
| xAPI | LMS 밖 경험, 비정형/세밀 학습 경험, LRS 중심 이력 | 통학, 제미, 커리어, 멀티모달 학습 경험 |
| CASE | 역량/학습목표/표준 교환 | L5 concept graph의 공식 식별자 |
| CLR | 학습 성과의 휴대 가능한 검증 기록 | S07뿐 아니라 전 시나리오의 성취 evidence export |
| EDU-API | 기관 시스템 간 교육 운영 데이터 API | 코스, 섹션, 평가, 성적, 프로그램 구조 연동 |
| Ed-Fi | 주로 K-12 운영 데이터 모델, 필요 시 기관 데이터 허브 참고 | 일본 대학 시장에서는 보조/참조 성격 |

프레젠 문장:

> “AI-X는 xAPI 하나로 모든 표준을 대체하지 않습니다. OneRoster와 EDU-API는 운영 데이터를, LTI Advantage는 도구 연결을, Caliper와 xAPI는 학습 이벤트를, CASE는 역량 식별자를, CLR은 검증 가능한 학습 성과를 담당합니다.”

### 4-4. CLR은 S07 전용 기능이 아니라 전 시나리오의 결과물이어야 한다

현재 CLR은 S07(line 478, 481, 487)과 S11 확장(line 587)에만 나온다. 그러나 진짜 방어 가능한 구조는 모든 시나리오가 CLR evidence 후보를 만든다는 것이다.

시나리오별 CLR 연결:

- S01: 난관 구간 극복 후 재평가 향상 -> `LearningAchievementEvidence`
- S02: spaced review 완료와 mastery 회복 -> `CompetencyEvidence`
- S03: 표준 답변 기여, 동료 질문 해결 -> `CollaborationEvidence`
- S05: 실시간 퀴즈 후 개념 숙달 개선 -> `AssessmentEvidence`
- S07: 커리어 narrative artifact -> `VerifiablePresentation`
- S08: 제미 연구 기여, 발표, 미팅 액션 완료 -> `ResearchContributionEvidence`
- S09: 루브릭 기반 과제 성취 -> `RubricCriterionEvidence`
- S10: 지원 개입 후 회복은 조심스럽게 내부 evidence로만, 외부 CLR에는 학생 동의 시 export

중요: CLR로 내보낼 것은 “감시 지표”가 아니라 “학생에게 유리한 검증 가능한 성취”다.

### 4-5. 이벤트 카탈로그에 빠진 카테고리

§3-1 이벤트 카탈로그(line 602 이후)는 학습 행동 중심으로 잘 잡았지만, AI-native 제품 운영에는 다음 이벤트가 빠져 있다.

추가 제안:

| 카테고리 | 이벤트 예시 | 필요한 이유 |
|---|---|---|
| 동의/권리 | `consent.grant`, `consent.revoke`, `data.export.request`, `data.delete.request` | APPI와 학생 신뢰 |
| AI 노출 | `ai.card.impression`, `ai.explanation.expand`, `ai.recommendation.dismiss` | 추천 효과 denominator 확보 |
| 개입 | `intervention.offer`, `intervention.accept`, `intervention.complete`, `intervention.snooze` | uplift/causal 모델 학습 |
| 에이전트 | `agent.plan.create`, `agent.tool.execute`, `agent.plan.revise` | agentic 시나리오의 감사 가능성 |
| 콘텐츠 생성 | `content.variant.generate`, `content.variant.approve`, `content.variant.publish`, `content.variant.abtest.assign` | co-creation과 효과 검증 |
| 모델 감사 | `model.prediction.emit`, `model.override`, `model.feedback.label`, `model.version.deploy` | 재현성과 책임성 |
| 표준 매핑 | `case.alignment.propose`, `case.alignment.approve`, `clr.evidence.issue` | 조용상 교수님 관점의 핵심 |
| 오프라인/통학 | `offline.cache.prefetch`, `audio_capsule.play`, `audio_capsule.bookmark` | S06의 실효성 측정 |
| 정서/인지부하 | `learner.self_report.confidence`, `learner.self_report.load` | “주시감”과 적응형 난이도 |
| 접근성 | `accessibility.caption.enable`, `screenreader.use`, `font_size.change` | 일본 대학 도입 시 필수 품질 |

## 5. 재작성이 필요한 뜬소리 문장

### 5-1. line 24

원문:

> “학생·교수자의 모든 행동을 xAPI로 수집하고, 그 데이터가 ‘왜 이렇게 추천했는지’를 언제든 보여주는 일본 대학 전용 AI 학습 플랫폼.”

문제: “모든 행동”은 과수집·감시 인상을 준다. xAPI도 모든 행동 저장소처럼 보인다.

대안:

> “학습·평가·개입 이벤트를 목적별 표준 프로파일로 수집하고, 각 AI 추천에 사용된 근거·불확실성·다음 행동을 교수자와 학생에게 분리해 설명하는 일본 대학용 AI 학습 운영 레이어.”

---

### 5-2. line 30

원문:

> “AI 출력 | 추천 결과만 | Evidence + Reasoning + Action 3종 강제”

문제: “Evidence + Reasoning + Action”은 좋은 원칙이지만, 회장님에게는 xAI 체크박스처럼 보일 수 있다.

대안:

> “모든 AI 출력은 `근거 이벤트`, `모델 버전`, `불확실성`, `권장 행동`, `행동 후 효과 측정 계획`을 함께 렌더링한다. 효과 측정이 불가능한 추천은 ‘정보성 인사이트’로만 표시한다.”

---

### 5-3. line 32

원문:

> “학습 진단 | 점수 통계 | BKT/DKT 기반 개념별 숙달 확률”

문제: BKT/DKT 이름만으로는 AI-native가 아니다. 어떤 입력, 어떤 업데이트, 어떤 행동으로 연결되는지가 없다.

대안:

> “문항 응답·소요시간·힌트 사용·자가 확신도를 입력으로 개념별 숙달도와 불확실성을 온라인 갱신하고, 다음 문항·복습 시점·설명 방식을 정책 모델이 선택한다.”

---

### 5-4. line 43

원문:

> “모든 사용자 행동은 xAPI Statement로 남는다. SDK 외 경로로 DB 직쓰기 금지.”

문제: 표준적으로도 운영적으로도 과하다. xAPI Statement와 내부 telemetry/event는 구분해야 한다.

대안:

> “모든 학습 관련 이벤트는 SDK를 통해 수집하고, 표준 교환 가치가 있는 이벤트는 xAPI/Caliper 프로파일로 변환한다. 내부 운영 이벤트는 별도 audit schema로 보존하며 DB 직쓰기는 금지한다.”

---

### 5-5. line 90~94

원문:

> “signal_score = w1·seek_back + w2·pause + w3·rewatch_ratio + w4·ask_count”  
> “코호트 평균·표준편차 계산 → z-score”

문제: 이 문장이 S01을 고전 대시보드로 보이게 만든다.

대안:

> “구간별 난관 확률은 행동 시퀀스, 자막/슬라이드 의미, 질문 임베딩, 학습자 선수 개념 상태를 입력한 `segment_struggle_model`이 산출한다. z-score는 설명 가능한 보조 근거로만 표시한다.”

---

### 5-6. line 154 부근 §01-H

원문:

> “Confidence 0.82”  
> “유사 개선 7건: 재시청률 평균 -45% 예측”

문제: confidence가 무엇의 확률인지 불명확하고, -45% 예측은 인과 추정 없이 말하면 과장이다.

대안:

> “난관 확률 0.82, calibration error 0.04. 5분 복기 개입의 예상 효과는 유사 강좌 12건 기준 재시청률 -18~-32%, overlap 0.71. 효과 검증을 위해 2주 후 동일 세그먼트를 자동 재측정한다.”

---

### 5-7. line 354

원문:

> “지금 5분 복습하면 시험 시점 예측 86%.”

문제: 반사실 예측이다. 인과 모델과 불확실성 없이 단정하면 신뢰를 잃는다.

대안:

> “지금 5분 복습을 완료하면 시험 시점 예상 정답률은 현재 47%에서 68~76%로 올라갈 가능성이 큽니다. 유사 학생 42명의 복습 이력과 현재 오답 패턴을 기준으로 계산했습니다.”

---

### 5-8. line 398~403

원문:

> “Risk 스코어에 따라 3단계 에스컬레이션(Omotenashi Nudge).”

문제: risk score 기반 에스컬레이션은 감시/통제 UX로 읽힐 수 있다.

대안:

> “마감 실패 가능성과 개입별 예상 도움 효과를 분리해 계산한다. 학생 부담 증가 가능성이 낮고 expected uplift가 양수일 때만 가장 작은 행동 단위의 제안을 보낸다.”

---

### 5-9. line 514

원문:

> “L5 Content Graph에 제미 CASE 노드로 편입”

문제: CASE를 연구 산출물 저장소처럼 쓰는 표현이다.

대안:

> “제미 연구 산출물은 Research Lineage Graph에 저장하고, 관련 학습성과·연구역량만 CASE-aligned competency item과 연결한다. CLR 발급 대상 evidence는 학생 동의 후 별도 검증 링크로 내보낸다.”

---

### 5-10. line 554

원문:

> “Gradient Boosting으로 스코어링. Label은 과거 학기 D 이하 수렴자의 2주 전 feature. SHAP로 상위 3개 이유를 뽑아 교수자에게 표시.”

문제: 전형적 early warning 설명이다. 회장님이 이미 많이 본 구조다.

대안:

> “D 이하 위험 예측은 보조 신호로만 사용하고, 교수자 화면은 개입별 회복 uplift와 불확실성을 중심으로 정렬한다. SHAP 이유 대신 ‘어떤 지원이 실제로 도움이 될 가능성이 높은가’를 표시한다.”

## 6. 회장님 시뮬레이션

### “그건 이미 다 해봤어”가 나올 위험 지점 3개

1. **S01/S03/S05의 heatmap, clustering, threshold 조합**

   §01-D의 signal score와 z-score(line 90~94), S03의 HDBSCAN+3배 증가(line 373), S05의 +1.5σ/정답률<50%/2개 이상 flag(line 427)는 학습분석 제품에서 익숙한 문법이다. 회장님은 “AI가 아니라 analytics rule 아닌가?”라고 물을 것이다.

2. **S10 Early Warning**

   Gradient Boosting + SHAP + D 이하 예측(line 554)은 너무 익숙하다. 특히 일본 대학에서 개인 리스크 예측은 도입 저항이 크다. 지금 강점은 낙인 방지 UX이지 모델 자체가 아니다.

3. **표준 레이어의 선언적 사용**

   xAPI, LTI, CASE, CLR이 등장하지만 역할 분담이 모호하다. OneRoster, Caliper, EDU-API가 빠져 있고, CASE와 L5의 매핑 구조도 부족하다(line 671). NetLearning 회장은 바로 “우리 기존 LMS/SIS와 어떻게 붙나?”를 물을 것이다.

### “오, 이건 다르네”가 나올 강점 지점 3개

1. **Mei-waku Care와 낙인 방지 UX**

   목적 입력, 개인 명단보다 반 병목 우선, 위험 단어 금지, 이의 제기 링크(line 43~47)는 일본 시장에 맞는 감각이 있다. 이건 기능보다 도입 전략으로 강하다.

2. **Shukatsu Forge**

   학습 이력에서 난관 극복 구간을 뽑아 CLR 기반 가쿠치카 초안으로 연결하는 S07(line 478~481)은 일본 대학의 취업 문화를 정확히 찌른다. 단, “LLM ES 작성기”가 아니라 “검증 가능한 학습 성취 narrative”로 포지셔닝해야 한다.

3. **Zemi Hub**

   제미 지식 계승, 미팅 자동 minutes, Inheritance Graph(line 503~509)는 일본 대학 특유의 연구실/제미 문화와 맞다. 이것은 글로벌 generic LMS보다 일본 시장에서 더 강하게 들릴 수 있다.

### 프레젠 구조 관점의 치명적 약점

현재 문서는 개발 명세로는 촘촘하지만, 20분 AES 발표 구조로는 “AI 기능이 많다”는 인상을 줄 위험이 크다. 발표는 기능 카탈로그가 아니라 다음 3단 논증이어야 한다.

1. **도입: NetLearning이 이미 가진 LMS 위에 필요한 것은 AI 기능이 아니라 학습 운영 지능이다**

   시작 문장 예:

   > “우리는 LMS를 대체하러 온 것이 아닙니다. manaba와 NetLearning이 이미 가진 학습 운영 접점을, 개입 효과를 학습하는 AI 레이어로 진화시키자는 제안입니다.”

2. **증명: 하나의 데이터 루프를 끝까지 보여준다**

   S01 하나를 골라 `감지 -> 원인 추론 -> 교수자 개입 -> 학생 반응 -> 2주 효과 검증 -> 다음 추천 정책 갱신 -> CLR/CASE evidence`까지 보여줘야 한다. 지금 문서는 각 시나리오가 끊겨 있고, “학습하는 시스템”의 폐루프가 약하다.

3. **차별화: 일본 대학만의 3개 장면을 보여준다**

   - Liner Mode: 통학
   - Shukatsu Forge: 가쿠치카/CLR
   - Zemi Hub: 제미 지식 계승

   이 3개는 generic AI LMS와 다른 일본 시장 장면이다.

4. **파일럿 제안: 90일, 1학과, 3개 가설**

   제안 구조:

   - 기간: 90일
   - 범위: 1학과, 2개 강좌, VOD+퀴즈+과제
   - 가설 1: S01 개입 후 난관 구간 재시청률 -20% 이상
   - 가설 2: S02 adaptive review 후 개념 재평가 +10%p 이상
   - 가설 3: S07 CLR evidence 기반 가쿠치카 초안 만족도 3.8/5 이상
   - 표준 검증: OneRoster/LTI/CASE/CLR/xAPI mapping sample 제출
   - NetLearning 역할: 기존 LMS 접점, 일본 대학 파일럿, 표준/운영 검증
   - WickedStorm/OneEdutechKorea 역할: AI/xAI/LRS/CLR 실험 레이어

## 7. Round 2로 넘기는 공개 질문

1. **S01 판정 이견 가능성**

   S01은 문서상 가장 완성도가 높다. 다른 리뷰어는 AI-native로 볼 수 있다. 내 판정은 Mixed다. 이유는 핵심 탐지가 아직 z-score 기반이고(line 90~94), 학습 루프가 “피드백 수집” 수준이지 정책 최적화까지 가지 않았기 때문이다.

2. **S02의 DKT를 MVP에 넣을지**

   문서는 MVP는 BKT, 1학기 후 DKT라고도 한다(line 793의 D-2). 그런데 S02 본문은 DKT를 이미 전제로 쓴다(line 348). 발표에서는 둘 중 하나로 정리해야 한다. MVP 데모라면 BKT+IRT+불확실성만으로도 충분하다.

3. **xAPI 중심 전략을 유지할지, Caliper/OneRoster/LTI Advantage를 전면에 세울지**

   NetLearning 회장 대상이라면 xAPI 단독 강조는 약하다. LMS 업계 청중에게는 LTI Advantage, OneRoster, Caliper의 역할 분담을 먼저 말하고, xAPI는 LMS 밖 경험까지 포괄하는 LRS 전략으로 배치하는 편이 낫다.

4. **선배 데이터 공개 기본값**

   §01-L은 선배 메모·질문 공개 동의 체크박스를 기본 on으로 둘 수 있다고 한다(line 268 부근). 일본 대학 도입에서는 기본 on이 민감할 수 있다. 기본 off 또는 학교 정책별 프리셋이 더 안전할 가능성이 높다.

5. **S07의 생성형 ES가 채용 윤리와 충돌하지 않는지**

   Shukatsu Forge는 강력하지만, “AI가 ES 써준다”로 들리면 위험하다. 반드시 “학생 본인의 검증 가능한 학습 증거를 구조화하고 표현을 돕는다”로 제한해야 한다.

6. **Zemi Hub의 CASE 표현**

   제미 산출물을 CASE 노드로 넣는 표현(line 514)은 표준 전문가 앞에서 공격받을 수 있다. Research Lineage Graph와 CASE-aligned competency를 분리하는 것이 맞는지 Round 2에서 표준 관점 검증이 필요하다.

7. **Early Warning의 성공 지표**

   S10의 Recall ≥ 0.7(line 574)은 제품적으로 위험하다. 회장님은 false positive, 학생 반발, 교수자 업무 증가를 물을 것이다. Recall보다 uplift, calibration, student perceived surveillance, false positive regret를 중심 지표로 바꾸는 데 이견이 있을 수 있다.