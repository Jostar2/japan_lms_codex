# Codex 고도화 방향 제안

## 1. 사용자 의도 추론

사용자가 말한 "고도화"는 기능 추가가 아니라, 보는 사람이 즉시 "AI가 교육 운영에 실제로 개입한다"고 느끼게 만드는 일이다. 핵심은 `AI 판단 -> 근거 -> 실행 -> 효과 측정`이 한 흐름으로 이어지고, 텍스트보다 시각 변화와 클릭 시연이 앞서는 것이다.

NetLearning 회장에게 "요약 생성", "대시보드 분석", "챗봇"은 약하다. 설득 메시지는 manaba 대체가 아니라, 기존 LMS 위에 AI 운영 레이어를 얹어 `감지 -> 원인 추정 -> 교수자 승인 -> 배포 -> 효과 측정 -> 정책 갱신`까지 닫힌 루프를 만든다는 점이다.

따라서 16개 라우트 균등 폴리싱보다 S01 Course Co-Creation 폐루프 하나를 작동하는 시스템처럼 보이게 만드는 것이 우선이다.

## 2. 현 프로토타입 약점 진단 (Claude의 5개에 대한 동의/반박/추가)

1. **AI liveness 부족: 동의.** xAI 카드와 Focus Dock은 구조는 좋지만 정적이다. "방금 감지했고 우선순위가 바뀌었다"가 보여야 한다.

2. **폐루프 시연성 부족: 강하게 동의.** `instructor.cocreation`의 1~5단계와 2주 후 검증은 정적 보고서처럼 읽힌다. 시간축 전환이 필요하다.

3. **인과 사슬 분리: 동의.** `student.lecture`, `instructor.dashboard`, `instructor.cocreation`이 같은 W7/Lec2 난관을 다루지만 하나의 사건처럼 묶이지 않는다.

4. **시각 요소 부족: 조건부 동의.** 차트 수를 늘리는 것은 위험하다. 필요한 것은 struggle heatmap, expected uplift 비교, CI가 있는 effect delta처럼 실행 판단을 바꾸는 시각화다.

5. **결말 부족: 동의.** "자료 공개"에서 끝나면 약하다. 2주 후 효과와 정책 갱신까지 보여야 한다.

추가 약점은 target-aware AI context다. 현재 Focus Dock은 페이지 단위라 `근거 보기`, `검토 시작`, `승인 후 공개`가 서로 다른 판단을 여는 느낌이 약하다.

## 3. 방향 후보 2~3개

### 방향 A. S01 폐루프를 시간축 데모 시퀀스로 만든다

정의: W7/Lec2 난관을 중심으로 학생 막힘 감지, 교수자 결정, Co-Creation 승인, 2주 후 효과 측정을 scripted click flow로 연결한다.

근거: "1 폐루프 증명 + 일본 3장 + 90일 파일럿" 합의와 가장 잘 맞는다. 기능 수보다 한 폐루프가 운영에 들어갈 수 있다는 증거가 강하다.

첫 7~10일 산출물: demo state, 공통 사건 ID, lecture heatmap, decision queue, cocreation timeline, measurement panel.

Trade-off: 코드량이 크고 scripted fake처럼 보일 수 있다. 모델 버전, 불확실성, 사람 승인 원칙을 노출해야 한다. Confidence: 높음.

### 방향 B. AI Liveness 시각 레이어를 핵심 화면에 추가한다

정의: heatmap, sparkline, uncertainty distribution, animated decision stack으로 정적 xAI 카드를 살아 보이게 만든다.

근거: "텍스트 ↓ / 시각 요소 ↑" 요구에 직접 대응한다. 현재 논리 구조가 좋아 표면 변화만으로도 체감이 크다.

첫 7~10일 산출물: lecture heatmap, dashboard priority strip, grading uncertainty, cocreation uplift comparison.

Trade-off: 단독 추진하면 예쁜 분석 화면에 머문다. 실행을 바꾸는 이유가 없으면 또 하나의 AI dashboard가 된다. Confidence: 중상.

### 방향 C. 발표용 5라우트만 깊게 다듬는다

정의: `instructor.cocreation`, `instructor.grading`, `instructor.dashboard`, `student.dashboard`, `student.lecture`에 집중한다.

근거: `claude_design_brief.md`의 polish order와 정합적이고, 16개 nav item visible 원칙을 해치지 않는다.

첫 7~10일 산출물: CTA 정리, tooltip 제거, decision card 표면화, 클릭 순서와 스크린샷 백업.

Trade-off: 안정적이지만 고도화 강도는 약하다. 화면 완성도는 올라가도 폐루프 증명은 부족할 수 있다. Confidence: 중.

## 4. 1순위 추천과 그 이유

1순위는 **방향 A 중심 + 방향 B를 S01 안에 제한 결합**이다.

회장에게 필요한 것은 "AI 기능이 많다"가 아니라 "manaba 위 레이어가 수업 운영 문제를 닫힌 루프로 개선한다"는 한 장면이다. S01은 학생 로그, 교수자 의사결정, 생성형 자료 개선, 효과 검증을 모두 품는다.

방향 B는 보조재다. 폐루프 없는 시각화는 버즈워드 위험을 키운다. 방향 C는 위생 작업으로 유지하되 첫 1주는 S01에 집중해야 한다.

## 5. 1순위에 대한 착수 단위 5~7개

| 작업명 | 영향 받는 파일/섹션 | 추정 | 의존성 |
|---|---|---:|---|
| S01 demo state contract | `state`, `renderPage()`, `FOCUS_CONTEXT` | 0.5일 | 없음 |
| 공통 사건 spine | `student.lecture`, `instructor.dashboard`, `instructor.cocreation` | 0.5일 | state |
| Lecture 난관 감지 강화 | video frame, progress marker, aside xAI | 1일 | spine |
| Dashboard 결정 큐 표면화 | decision cards, right aside | 1일 | spine |
| Co-Creation 시간축화 | 1~5단계, pastCoCreation | 1.5일 | spine |
| Target-aware AI Focus | `openAiContext()`, `focusModeDock()` | 1일 | state |
| 데모 컨트롤·백업 | next/reset, 키보드, 캡처 목록 | 1일 | 앞 작업 |

락된 조건은 유지한다. 3-column shell, 16개 nav item, companion 위치, Round-2 copy, `openAiContext()` idempotent-open은 건드리면 안 된다.

## 6. Claude의 잠정 1순위(A+B 결합)에 대한 명시적 평가

**조건부 동의.** 한 폐루프가 돌아가는 장면에 liveness를 집중하는 것이 현재 ROI가 가장 높다.

조건은 세 가지다. B를 전체 장식 패키지로 확산하지 않는다. 효과 검증은 CI, overlap, posterior, 관찰 한계를 남긴다. 결말은 "교수자 승인 -> 효과 측정 -> 다음 정책 반영"이어야 한다.

Claude가 약하게 본 지점은 target-aware context다. `struggle-segment`, `draft-variant-a`, `measurement-after-2w`처럼 대상이 바뀌어야 관찰자가 "AI가 지금 이 항목을 보고 있다"고 느낀다.

## 7. 사용자에게 즉시 결정해야 할 미해결 1~3개

1. **첫 데모 spine:** 추천은 S01 단독 4~5분. S07/S09는 60~90초 보조 장면.

2. **scripted prototype 표현 수위:** "라이브 데이터"로 오해시키지 말고, "90일 파일럿에서 검증할 클릭 프로토타입"으로 말하는 편이 안전하다.

3. **첫 화면:** 추천은 `student.lecture` 22% 막힘 감지에서 시작해 `instructor.dashboard`, `instructor.cocreation`, 2주 후 효과 검증으로 끝내는 순서다.
