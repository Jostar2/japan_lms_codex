# Codex Round 2 — Claude 리뷰 교차 비평 지시서

## 맥락
이 프로젝트는 일본 NetLearning 회장님을 청중으로 하는 AES 발표용 AI LMS 기획서를 고도화하는 작업입니다.

- 원문: `AI_LMS_planning_core_summary.md`
- **본인(Codex)의 Round 1 독립 리뷰**: `review/round1_codex.md`
- **상대(Claude)의 Round 1 독립 리뷰**: `review/round1_claude.md` ← 이번 라운드에서 읽어야 할 대상

## 당신의 임무 (중요: 파일 쓰기 시도하지 말 것)
Round 1에서는 두 리뷰어가 독립적으로 작성했습니다. 이번 Round 2에서는 **Claude의 Round 1 리뷰를 정독하고, 본인의 관점으로 비평/보강/반박**합니다.

- **파일 생성·편집·apply·patch 도구 사용 금지.** 최종 응답(last message)에 전체 내용을 Markdown으로 출력 — 호출자가 파일로 저장합니다.
- 최종 응답은 `# Codex Round 2 — Claude 리뷰 교차 비평` 헤더로 시작. 서론·메타코멘트 금지.

## 리뷰 접근

### 기본 원칙
- 본인(Codex)의 Round 1은 참조 가능. 본인 의견이 유지되는지, Claude 의견에 따라 수정되는지 명시.
- Claude 의견에 동의할 때는 **왜**를 명시하고 가능하면 **추가 근거나 강화안** 제시.
- 이견일 때는 **왜 틀렸다고 보는지 + 대안** 제시. 단순 반박 금지.
- "두 의견 다 맞음"은 도망가는 답변. **어느 쪽이 이 청중(NetLearning 회장·조용상 교수)에게 더 유효한지** 판단 내리기.

### 필수 섹션

```markdown
# Codex Round 2 — Claude 리뷰 교차 비평

## 0. Claude 리뷰 총평 (한 단락)
Claude 리뷰의 강점·약점·관점 차이를 2~3줄로.

## 1. 시나리오별 판정 대조표
| # | Codex R1 판정 | Claude R1 판정 | Codex R2 재판정 | 결정 근거 (1줄) |
|---|---|---|---|---|
| S01 | ... | ... | ... | ... |
... (S01~S10)

각 시나리오 아래에 필요 시 상세 코멘트 (특히 이견이 큰 시나리오).

## 2. 시나리오 업그레이드안 — 두 리뷰 통합/선택
Claude와 Codex가 각각 제안한 업그레이드를 비교.
- 합쳐야 할 것
- 둘 중 하나를 선택해야 할 것 (+ 선택 근거)
- 폐기해야 할 것
- **특히 다음 충돌 포인트**:
  - S01: Claude의 "난관 해소 에이전트 (5분 미니 강의 즉석 생성)" vs Codex의 "Struggle Segment Model + Bayesian change-point"
  - S04: Claude의 "Contextual Bandit (LinUCB/Thompson)" vs Codex의 "survival + uplift"
  - S10: Claude의 "Uplift Forest" vs Codex의 "Support Policy Simulator"

## 3. 신규 시나리오 제안 — 통합 매핑
Claude 제안: S-new1 Lecture Design Co-Pilot, S-new2 Learning Companion Agent, S-new3 Counterfactual What-If, S-new4 Multimodal Coach, S-new5 Curriculum Optimizer, (+S-new6 Bidirectional Instructor-AI)
Codex 제안: N01 Pace Agent, N02 반사실 개입 시뮬레이터, N03 Real-time Adaptive Path, N04 멀티모달, N05 Co-Creation Studio

- 사실상 동일한 것 / 병합해야 할 것 (예: Claude S-new2 ≈ Codex N01, Claude S-new3 ≈ Codex N02, Claude S-new4 ≈ Codex N04, Claude S-new1 ≈ Codex N05)
- 한쪽에만 있는데 **반드시 포함**해야 할 것
- 둘 다 제안했지만 **버릴** 것 (우선순위 낮음)
- 최종 "Top 5 신규 시나리오" 제안 (AES 20분 발표에 세 개까지 데모 가능)

## 4. 화면·CTA·mock 비교
- Claude의 "Ambient AI 이어피스" vs Codex의 "Live Understanding State + 교수자 CTA"
- Claude의 "AI와 반박하기 음성 인터랙션" vs Codex의 "개입 실험 카드 + 무시 이유 선택"
- 일본어 CTA 수준 비교 (Codex가 더 다양함)
- Shukatsu Forge mock 통합안
- **최종 "발표 데모 3장"** 확정: 어느 화면을 골라 무대에 올릴지

## 5. 데이터·표준 레이어 — 합의 vs 이견
- Claude: xAPI Profile 정의·CASE Registry API 연동·CLR 전면·OneRoster/Ed-Fi 스택
- Codex: xAPI와 internal event 분리·CASE alignment 스키마 구조화·표준 역할 분담 테이블·CLR 시나리오별 매핑
- **통합 권고**: 최종 제안서에 들어갈 한 장짜리 "표준 역할 분담 슬라이드" 초안 제시.

## 6. 뜬소리 재작성 — 우선 10개 확정
양쪽이 지적한 원문 문장들 중 가장 시급한 10개를 라인 번호로 확정 + 대체 문장.

## 7. 프레젠 20분 구조 — Claude안 vs Codex안
- Claude: Hook(1분) + Proof 3데모(5분) + Defense 표준(5분) + Pilot(5분) + Q&A(4분)
- Codex: 도입(LMS 보완) + 증명(1 closed loop) + 일본 차별 3장 + 90일 파일럿
- **Codex R2의 최종 결정**: 어느 뼈대가 더 설득력 있는지 + 세부 조정

## 8. Round 3 통합안 작성 지침
Round 3에서 통합 최종안을 쓸 때 **반드시 지켜야 할 원칙 5가지** 제시.

## 9. 여전히 미해결인 Open Question
본인도 Claude도 명확히 답하지 못한 부분 (Round 3에서 사용자 판단이 필요한 포인트).
```

## 엄수 규칙
1. **round1_codex.md (본인)과 round1_claude.md (상대) 둘 다 읽을 것**.
2. 모호한 "둘 다 좋음" 답변 금지. 판단 내리기.
3. 원문 `AI_LMS_planning_core_summary.md`도 필요 시 다시 조회.
4. 한국어. 일본어 CTA는 그대로 유지.
5. 파일 쓰기 시도 금지. 최종 응답으로만 출력.
6. 최종 응답은 `# Codex Round 2 — Claude 리뷰 교차 비평` 로 바로 시작.

지금 시작하세요.
