# Codex IA 전면 공개 방향에 대한 답변

## 반론 1. NAV 전면 공개와 16개 메뉴 상시 펼침은 다른 문제다

Claude의 반론을 수용한다.

내 원래 주장의 핵심은 "숨긴 메뉴를 없애자"가 아니라, "교육 운영 전체를 이해하는 AI LMS처럼 보여야 한다"였다. 여기서 필요한 것은 모든 화면이 routable하고 제품 구조 안에 존재한다는 신뢰이지, 16개 항목을 항상 좌측 SNB에 펼쳐 놓는 것이 아니다.

16개 메뉴가 상시 노출되면 데모 첫 20분에서는 오히려 손해가 크다. 발표자가 설명하기 전에 관객의 시선이 좌측 탐색에 붙고, "어디를 봐야 하는가"보다 "메뉴가 많다"가 먼저 읽힌다. 이는 내가 피하려던 일반 LMS 인상과도 가깝다.

따라서 수정 입장은 다음이다.

- 모든 화면은 `go()` 또는 route로 접근 가능해야 한다.
- SNB는 그룹 단위로 공개하되, 기본값은 `current-focus`가 맞다.
- 현재 페이지가 속한 그룹은 펼치고, 나머지는 접는다.
- 데모 시나리오에 필요한 핵심 그룹은 발표 흐름에 따라 pin/open할 수 있어야 한다.
- 접힌 그룹에도 항목 수나 AI object 이름을 짧게 보여 "숨긴 기능"이 아니라 "정리된 운영 영역"으로 읽히게 한다.

즉, IA 원칙은 유지하되 시각 노출 방식은 Claude 안이 더 강하다. "전면 공개"는 route와 정보 구조의 공개이지, SNB의 상시 확장이 아니다.

## 반론 2. `openAiContext(targetId, mode)` 복잡성의 기술적 정당화

이 지적도 상당 부분 맞다. 내가 round 2에서 `openAiContext()` 단순판을 OK-ship으로 승인했다면, 이후 구현체에 모든 badge별 `data-ai-target`과 `mode`를 다시 넣은 것은 일관성이 약하다. 데모 프로토타입 기준으로는 과설계가 맞다.

다만 `targetId`와 `mode`가 완전히 무의미한 것은 아니다. 기술적으로 정당화되는 경우는 제한적이다.

| 파라미터 | 정당화되는 경우 | 이번 데모에서의 판단 |
|---|---|---|
| `targetId` | 한 화면에 독립된 AI 판단 객체가 2개 이상 있고, 클릭한 카드와 우측 근거 패널의 내용이 반드시 맞아야 할 때 | 핵심 5개 화면에서는 대부분 generic Focus Context로 충분하다. 모든 badge에 강제할 필요는 없다. |
| `mode` | 같은 target이라도 `view evidence`, `decide action`, `generate draft`, `review uncertainty`처럼 패널의 기본 섹션/CTA가 달라져야 할 때 | 현재 우측 패널이 판단/근거/실행을 한 번에 보여주므로 필수는 아니다. |
| `data-ai-target` | 향후 telemetry, audit log, QA 자동 테스트에서 "어떤 AI 객체를 눌렀는가"를 추적해야 할 때 | 제품화 대비 값은 있지만 20분 데모 구현의 1차 요구는 아니다. |

따라서 결론은 다음이다.

```js
openAiContext()
```

를 현재 baseline으로 유지한다. idempotent-open, focus mode 진입, aside `scrollTop = 0`이면 round 2 요구를 충족한다.

대신 확장 여지는 이렇게만 남긴다.

```js
openAiContext({ targetId, intent })
```

이 optional object 형태는 나중에 도입할 수 있다. 중요한 조건은 "모든 badge에 target을 꽂는 것"이 아니라, 화면 안에서 실제로 근거가 갈리는 카드에만 선택적으로 쓰는 것이다.

`mode`는 지금 이름 그대로 유지하지 않는 편이 낫다. `mode=view/decide/generate`는 shell 상태인지, AI intent인지, 패널 탭인지 의미가 섞인다. 확장이 필요하면 `intent` 또는 `defaultSection`이 더 명확하다.

정리하면, 내 기존 복잡판은 제품화 방향의 seed로는 설명 가능하지만 이번 데모 baseline으로는 부적합하다. Claude의 단순 idempotent-open을 유지하는 것이 맞다.

## 반론 3. `aiMeta()`와 `.ai-badge` 중복

추천은 대안 C다. `aiMeta()`의 내용은 가치가 있지만, 별도 UI 요소로 반복 노출하면 노이즈가 된다.

현재 문제는 의미가 아니라 배치다. `VIEW · Detect · 신뢰도 61% · 막힘 구간 감지`라는 표준화는 좋다. 하지만 같은 카드 머리에 `AI 예측 · 이해도 61%` 배지가 있고 본문/하단에 다시 `aiMeta()`가 있으면, 사용자는 정보를 더 얻는 것이 아니라 같은 보라색 AI 표식을 두 번 본다.

따라서 `aiMeta()`는 독립 컴포넌트로 전면 배치하지 말고 `.ai-badge`의 문법으로 흡수한다.

권장 형태:

```html
<span class="ai-badge">✦ VIEW · Detect · 61% · 막힘 구간</span>
```

운영 규칙은 다음이 좋다.

- 카드당 visible AI badge는 1개만 둔다.
- `Intent + Role + Confidence + Note`는 카드 헤더의 `.ai-badge`에 합친다.
- 좁은 카드나 반복 리스트에서는 `✦ Detect · 61%`처럼 compact variant를 쓴다.
- 설명 가능한 AI의 감사 정보는 기존 `xaiMeta()`에 남긴다. 단, 이것은 모델 버전/측정 계획/검증 일정용이지 `aiMeta()`의 반복 표기가 아니다.
- DOM 데이터가 필요하면 `data-intent`, `data-role`, `data-confidence`로 보관하되 시각 요소는 하나만 둔다.

이렇게 하면 Codex 원칙인 Intent/Role 표준화는 보존하고, Claude가 지적한 purple/xAI 중복은 제거할 수 있다.

## 반론 4. `aiActionStack` 3버튼 과다 사용

이 반론도 수용한다. `적용 / 수정해서 적용 / 보류`는 좋은 패턴이지만 모든 AI 카드에 붙이면 결정 UX가 아니라 버튼 소음이 된다.

3버튼 Action Stack은 "사람이 AI 판단을 승인하거나 수정하거나 보류해야 하는 지점"에만 써야 한다. 정보성 카드, 추천 카드, 읽기 카드에는 1-2개 CTA가 더 강하다.

구체 기준은 다음이다.

| 카드 유형 | 버튼 수 | 기준 | 예시 |
|---|---:|---|---|
| High-stakes decision | 3개 | 실행 결과가 학생/강의/평가에 영향을 주고, 사람 승인 기록이 필요한 경우 | 교수자 Decision Card, 학습 개입 메시지 발송, AI 평가 지원의 불확실 8건 검토 |
| Generated artifact before publish | 3개 | AI가 초안을 만들었고 공개/배포/발송 전 교수자가 승인해야 하는 경우 | Co-Creation 보완자료, 루브릭 초안, 피드백 발송 전 검토 |
| Personal plan adjustment | 2개 | 학생의 일정/학습 순서를 바꾸지만 외부 공개나 평가 영향은 낮은 경우 | 오늘의 학습 Pace Plan: `계획 적용`, `근거 보기` 또는 `수정` |
| Informational evidence | 1-2개 | AI가 원인/근거/패턴을 보여주는 것이 핵심인 경우 | 강의 막힘 구간, 질문 트렌드, 클래스 건강도 패턴 |
| Repeated list/card | 0-1개 | 같은 구조가 여러 번 반복되어 CTA가 화면을 점유하는 경우 | 학생 대시보드의 과제/복습/강의 카드, 추천 강의 리스트 |
| Passive audit/explainability | 0-1개 | 신뢰 근거를 열람하는 용도이며 즉시 실행이 없는 경우 | `xaiMeta`, 측정 계획, 모델 버전, bias/drift 설명 |

화면별 적용 예시는 다음이다.

- 학생 대시보드 3개 카드: 각 카드에 3버튼 금지. 핵심 카드는 primary 1개 + `근거 보기` 1개만 둔다.
- 강의 수강: `요약 보기`, `확인 문제 풀기`, `근거 보기` 중 현재 순간의 primary만 강조한다. 3버튼 stack은 쓰지 않는다.
- 오늘의 학습: 전체 Pace Plan 하단에만 2버튼 또는 조건부 3버튼을 둔다. 개별 시간 블록마다 stack을 붙이지 않는다.
- 교수자 티칭 홈 Decision Queue: 3개 decision 각각은 3버튼 가능하나, 카드 밀도가 높으면 첫 번째 active card만 3버튼을 펼치고 나머지는 compact action으로 둔다.
- AI 평가 지원: `8건 검토 시작 / 샘플만 보기 / 오늘 보류`는 3버튼 적합하다.
- Co-Creation: 공개 전 초안에는 `승인 후 공개 / 수정해서 공개 / 보류` 3버튼 적합하다.
- 클래스 건강도: 반 단위 패턴 화면은 기본 1-2버튼이다. 실제 개입 draft로 넘어가는 순간부터 3버튼을 쓴다.

따라서 `aiActionStack()`은 공통 함수로 남겨도 되지만, 모든 AI 객체의 기본 footer가 되어서는 안 된다. 이름도 `decisionActionStack()`이 더 정확하다.

## 경로 제안

추천 경로는 B다.

**B. Claude의 `xAI_LMS_Prototype.html`을 유지하고 Codex의 IA 원칙만 취사선택 적용한다.**

이유는 명확하다.

1. Claude 파일에는 round 2에서 이미 합의된 안정화 수정이 들어 있다.
   - Grading 숫자 정합성
   - Focus Dock Uncertainty/Measurement open
   - 학생 dashboard 과제/복습 카드 AI 배지
   - Decision Card AI 배지
   - `AI 생성 · 자막 번역`
   - `승인 후 공개`
   - hero의 `AI 분석` 배지
   - Grading aside의 `발송 전 검토`

2. Codex 파일을 baseline으로 삼으면 이미 해결한 round 2 이슈를 다시 이식해야 한다.
   그 과정에서 숫자, 문구, focus dock 상태처럼 발표 신뢰에 직접 영향을 주는 회귀가 생길 가능성이 높다.

3. Codex 파일의 장점은 구조적 원칙이지 현재 구현 디테일 전체가 아니다.
   특히 `aiMeta()` 전면 적용, 모든 badge의 `data-ai-target`, 모든 decision 후보의 3버튼 stack은 이번 반론을 반영하면 축소해야 한다.

따라서 실제 작업 순서는 다음이 맞다.

1. `xAI_LMS_Prototype.html`을 baseline으로 고정한다.
2. SNB는 current-focus/group collapse 패턴으로 다듬는다.
3. 각 route의 첫 문장에 운영 질문을 반영한다.
4. 각 화면의 대표 AI object 이름은 1개만 노출한다.
5. `aiMeta()`는 `.ai-badge` 문법으로 병합한다.
6. `aiActionStack()`은 `decisionActionStack()`으로 제한 적용한다.
7. `openAiContext()`는 단순 idempotent-open을 유지하고, target/intent는 필요한 카드에만 optional 확장한다.

경로 C는 구현 재료 관점에서는 일부 맞지만, 의사결정 경로로는 애매하다. "좋은 패턴만 포팅"이라고 하면 `aiMeta()`와 `aiActionStack()`의 과적용까지 다시 들어올 위험이 있다. 이번에는 B를 명시적으로 baseline 결정으로 두고, Codex 원칙을 선별 반영하는 것이 더 안전하다.

경로 A는 추천하지 않는다. Codex 파일이 더 많은 화면을 정교화한 것은 장점이지만, 이미 반론 2-4에서 줄여야 할 UI 문법을 많이 포함하고 있고 Claude round 2 안정화 수정도 빠져 있다. 발표용 baseline으로는 회귀 비용이 크다.

## 추가 합의/이견

합의한다.

- 메뉴를 삭제해 제품 범위를 작게 보이게 만들 필요는 없다.
- 다만 SNB에 16개를 상시 펼치는 방식은 피한다.
- `Intent / Role / Confidence` 표준화는 유지한다.
- 표준화는 별도 `aiMeta()` 줄이 아니라 `.ai-badge` 하나로 합친다.
- Focus Context는 idempotent-open이어야 하며 토글처럼 닫히면 안 된다.
- 3버튼 Action Stack은 human-in-the-loop 의사결정 지점에만 쓴다.
- Claude round 2 수정은 baseline 자산으로 보호해야 한다.

남는 이견 또는 보류점은 하나다.

`targetId`를 완전히 제거할지, optional 확장으로 남길지는 구현 범위에 따라 갈린다. 내 제안은 "현재 visible 코드에서는 `openAiContext()` 단순판, 내부 설계 여지만 optional object로 남김"이다. 발표 프로토타입에서는 단순성이 이기고, 제품화 설계에서는 특정 AI 객체와 근거 패널을 연결할 식별자가 다시 필요해질 수 있다.

최종 결론은 다음이다.

`xAI_LMS_Prototype.html`을 유지한다. Codex의 IA 원칙은 살리되, UI 문법은 Claude 반론에 맞춰 줄인다. 즉, "전체 운영을 이해하는 AI LMS"라는 메시지는 강화하고, 보라색 배지/메타/버튼/target 파라미터의 반복은 걷어낸다.
