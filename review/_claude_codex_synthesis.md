# Claude × Codex 합의 — 프로토타입 고도화 방향 메모

> 사용자 지시 응답: "어떤 방향으로 고도화할지, 둘이 판단해서 결과 알려줘"
> 입력 자료: `_claude_to_codex_upgrade_brief.md` (Claude 발신) → `_codex_upgrade_proposal.md` (Codex 응신).
> 이 문서는 합의 결론 + 분기 지점 + 사용자 결정 필요 항목만 정리한다.

---

## 0. 사용자 의도 — 두 AI 동일하게 본 것

"고도화"는 **기능 추가가 아니라**, NetLearning 회장이 "AI가 운영에 실제 개입한다"고 한눈에 느끼게 만드는 일.

핵심 기준은 한 문장: **`AI 판단 → 근거 → 실행 → 효과 측정`이 한 흐름으로 이어지고, 텍스트보다 시각 변화·클릭 시연이 앞선다.**

> ⚠️ 전제 가정 (사용자 확인 필요): "고도화" 타깃은 **AES 발표·시연용**이다. 제품 로드맵 전반이라면 우선순위 재정렬 필요. 두 AI 모두 발표 트랙으로 가정하고 답했다.

---

## 1. 결론 — 1순위 합의

> **방향 A 중심 + 방향 B를 S01 안에서만 제한 결합 + C는 hygiene 트랙으로 병행.**

- 방향 A = S01 폐루프 시간축 데모 시퀀스 (`감지→근거→승인→배포→2주 후 효과→정책 갱신`)
- 방향 B = AI Liveness 시각 레이어 (heatmap·sparkline·uncertainty 분포·decision stack 변화)
- 방향 C = 발표 5라우트 visual polish (이미 `claude_design_brief.md`가 commission한 작업)

**합의 이유**: NetLearning 회장에게 가장 강한 한 장면은 "기능 16개"가 아니라 **manaba 위에 AI 운영 레이어가 닫힌 루프로 굴러간다는 한 폐루프**. S01이 학생 로그·교수자 결정·생성형 자료 개선·효과 검증을 모두 품기 때문에, 자원 분산보다 S01에 깊이를 만드는 것이 ROI 최대.

방향 B는 단독이면 "또 하나의 AI 대시보드". A의 폐루프 안에 들어가야 살아남는다. C는 design_brief가 이미 잡은 트랙이라 신규 고도화의 **delta가 아니다** — 병행 hygiene으로만 다룸.

---

## 2. Codex가 Claude보다 정확하게 짚은 3가지 (수용)

Claude의 잠정안에는 없었거나 약했던 것들.

### ① Target-aware AI Context (★ 가장 중요)
Codex 지적: 현재 `openAiContext()`는 **페이지 단위**로만 AI 컨텍스트를 연다. 그래서 같은 페이지의 `근거 보기`/`검토 시작`/`승인 후 공개`를 눌러도 Focus Dock 내용이 바뀌지 않는 것처럼 느껴짐.

수용 결정: AI Focus가 **타깃 ID 단위**로 컨텍스트를 바꿔야 한다. 예: `struggle-segment-22pct`, `draft-variant-a`, `measurement-after-2w`. 같은 페이지 안에서 클릭한 객체에 따라 Focus Dock의 Judgment·Action·Evidence가 동기 변경되어야 "AI가 지금 *이 항목*을 보고 있다"는 체감이 생긴다.

구현 노트: `openAiContext()` 시그니처 확장 — `openAiContext(targetId?)`. `FOCUS_CONTEXT`를 페이지 키 + 타깃 ID 키 dual-keyed map으로. 락 조건 (`idempotent-open`, `state.navCollapsed` 단일 진실원) 유지.

### ② 공통 사건 Spine
Codex 지적: `student.lecture`, `instructor.dashboard`, `instructor.cocreation`이 모두 **W7/Lec2 같은 난관**을 다루지만 같은 사건으로 묶이지 않음. 시연 중 라우트 전환 시 인과 사슬이 끊김.

수용 결정: **공통 incident object** (`incident:w7-lec2-22pct`)를 state에 두고, 4개 라우트 (`student.lecture`, `instructor.dashboard`, `instructor.cocreation`, `instructor.classhealth`)가 같은 incident의 다른 단면을 보여줌. "회장이 라우트를 옮길 때 같은 사건이 따라온다"가 핵심.

### ③ Scripted Prototype 표현 수위
Codex 지적 (advisor도 같은 우려): "Live data" 오해를 키우면 회장이 즉시 간파. **솔직하게 "90일 파일럿에서 검증할 클릭 프로토타입"으로 말하는 편이 더 강하다.**

수용 결정: 모든 motion은 **사전 정의된 scripted state transition** (클릭/`다음` 키로 트리거). RNG·setInterval·라이브 피드 절대 금지. 화면 어딘가에 작은 Demo Mode 표시. `next_steps_final.md`의 "라이브 데모 절대 금지" 원칙 직접 충돌 회피.

---

## 3. Claude가 Codex보다 미세하게 강조한 1가지

**데모 시퀀스의 결말 = 정책 갱신**까지 끌고 가야 한다.
- "자료 공개" 또는 "효과 측정" 화면에서 끝나면 폐루프가 미완.
- 마지막 한 컷: "이번 결과를 다음 학기 강좌 설계에 반영" CTA + 이번 코호트의 effect delta CI 표시.
- Codex 도 §1·§2·§3에서 정책 갱신을 언급했지만, 데모 시퀀스의 "결말 시점" 위치를 Claude가 더 강조.

---

## 4. 두 AI가 명시적으로 차이를 둔 곳

| 항목 | Claude | Codex |
|---|---|---|
| 방향 B의 위상 | "1순위 결합 요소" | "보조재 — 단독 추진은 위험" |
| 방향 C의 처리 | "발표 5라우트 깊이 강화" | "Hygiene 트랙. design_brief 이미 commission" |
| 시각화 강도 | 차트·sparkline 강하게 | 실행 판단을 바꾸는 시각화만 |
| 타깃 단위 컨텍스트 | 언급 없음 | **명시 (수용)** |
| 사건 spine | 언급 없음 | **명시 (수용)** |

Claude가 안으로 받아들인 결과: 방향 B는 **A의 폐루프 안에서 4종 시각 컴포넌트로만 한정** — heatmap (lecture 22%), priority strip (dashboard), uncertainty distribution (grading), uplift comparison (cocreation). 그 외 dashboard 장식 차트는 추가하지 않음.

---

## 5. 락 조건 — 절대 건드리지 않을 것 (재확인)

방향 A 추진 중에도 다음은 유지:

- 3-column shell (`248 / fluid / 344`, focus mode `72 / fluid / 480`)
- 16 nav items 모두 visible
- `state.navCollapsed` 단일 진실원
- `openAiContext()` idempotent-open 계약 (시그니처는 확장 가능, 닫힘 동작 절대 금지)
- Round-2 락 카피 전 항목 (`확정 가능 24·검토 필수 8·미실행 20`, `承認後に公開·승인 후 공개`, etc.)
- 회화형 Companion 위치 (`student.lecture` + `instructor.cocreation`만)
- No load-bearing tooltips, No badge inflation, No live data

---

## 6. 7~10일 착수 단위 (Codex 표 + Claude 미세 보강)

| # | 작업 | 영향 파일/섹션 | 추정 | 의존성 |
|---|---|---|---:|---|
| 1 | Demo state contract (incident + step + targetId 3축 state) | `state`, `renderPage()`, `FOCUS_CONTEXT` | 0.5일 | — |
| 2 | 공통 사건 spine (4 라우트 동기) | `student.lecture`, `instructor.dashboard`, `instructor.cocreation`, `instructor.classhealth` | 0.5일 | #1 |
| 3 | Lecture 난관 감지 + 동료 분포 heatmap | video frame, progress marker, lecture aside | 1일 | #2 |
| 4 | Dashboard 결정 큐 표면화 + priority strip | decision cards, right aside | 1일 | #2 |
| 5 | Co-Creation 시간축화 (1~5 + 2주 후 효과 + 정책 갱신) | cocreation, pastCoCreation, NEW measurement-after-2w | 1.5일 | #2 |
| 6 | Target-aware AI Focus | `openAiContext(targetId?)`, `focusModeDock()`, `FOCUS_CONTEXT` dual-key | 1일 | #1 |
| 7 | Grading uncertainty distribution + Cocreation uplift comparison | grading aside, cocreation step 5 | 1일 | #5 |
| 8 | Demo controls + PNG 백업 | next/prev/reset key, 시연 캡처 목록 | 1일 | 1~7 |

총 ~7.5일. 1인 풀타임 기준. 병렬 가능한 부분은 #3·#4 (둘 다 #2 완료 후).

**이 7~8개 작업이 끝나면 도달 상태**: 회장 앞에서 1번 키를 누르면 W7/Lec2 사건이 학생→교수자→Co-Creation→2주 후 효과→정책 갱신까지 5컷으로 흐른다. 각 컷마다 Focus Dock의 Judgment·Action·Evidence·Uncertainty·Measurement가 그 시점 그 객체 기준으로 갱신된다.

---

## 7. 사용자에게 즉시 결정해야 할 항목

| # | 결정 | 두 AI 추천 | 영향 |
|---|---|---|---|
| 1 | **"고도화" 타깃이 AES 발표용 맞나?** | 두 AI 모두 그렇게 가정. 다르면 우선순위 재정렬 필요. | 전체 방향 결정 |
| 2 | **첫 데모 spine = S01 단독?** | 추천: S01 4~5분 단독. S07(Career)·S09(Grading)는 60~90초 보조 장면. | 어느 라우트에 자원 집중할지 |
| 3 | **첫 화면 = `student.lecture` 22% 막힘?** | 추천: yes. 학생 시점에서 시작해 교수자 결정으로 넘어가는 순서가 회장 몰입 강함. | 시연 시퀀스 첫 컷 |
| 4 | **"클릭 프로토타입" disclaimer 노출?** | 추천: yes. 라이브 데이터 오해 회피가 신뢰도 더 높임. | 화면 표기 + 발표 멘트 |

---

## 8. 다음 액션 (사용자 신호 기다림)

위 7번의 4개 결정이 yes로 떨어지면 작업 #1 (Demo state contract)부터 즉시 착수 가능. no/조정이 있으면 7~10일 산출물 표를 그에 맞게 재구성.

**현 상태에서 다음 메시지로 사용자가 "go"라고 하면, 작업 #1~#2부터 패치 시작 권장.**

---

## 부록 — 참조

- 입력: `review/_claude_to_codex_upgrade_brief.md`, `review/_codex_upgrade_proposal.md`
- 락 정책: `review/claude_design_brief.md`, `review/codex_to_claude_affordance_handoff.md`, `review/round3_integrated.md`
- 라이브 데모 금지 원칙: `review/next_steps_final.md` §3
- 현재 프로토타입: `xAI_LMS_Prototype.html` (4,009 lines)
