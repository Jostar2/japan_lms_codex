# Codex — 다음 액션 비평 + 독립 제안

## 0. Claude 제안 총평 (2~3줄)
Claude는 **발표 슬라이드·데모·Q&A·MoU**의 중요도는 잘 잡았다.  
다만 NetLearning 회장이 실제로 볼 **통합 난이도·데이터 확보·APPI/IRB·상용 조건**을 과소평가했고, 조용상 교수 관점의 **표준 claim 검증**도 별도 작업으로 분리하지 않았다.  
가장 큰 문제는 “잘 보여주는 일”과 “파일럿을 막히지 않게 여는 일”을 같은 우선순위 체계로 섞은 점이다.

## 1. Claude T0~T4 각 항목별 Codex 판정

| Claude 항목 | 판정 | Codex 조정 |
|---|---|---|
| T0-1 PPT 슬라이드 | 동의 | 단순 슬라이드가 아니라 **20분 발표본 + 정확한 Ask + back-pocket**까지 포함해야 한다. |
| T0-2 Demo A/B/C | 동의 | 최우선급. 단, “구현 데모”와 “클릭형/영상 프로토타입”을 명확히 라벨링해야 신뢰를 잃지 않는다. |
| T0-3 파일럿 대학 타겟 | 누락·보강 | 대학명 리스트보다 **접근 루트·데이터 가능성·법무 난이도·비공개/공개 구분**이 핵심이다. |
| T0-4 Q&A 리허설 | 동의 | 순위는 더 높아도 된다. 회장형 질문과 조용상 교수형 표준 질문을 분리해야 한다. |
| T0-5 Standards Stack 시각화 | 재정렬 | 독립 작업이 아니라 PPT/표준 claim audit에 흡수. 예쁜 그림보다 표준 역할 오남용 방지가 중요하다. |
| T1-1 Commercial Deck | 재정렬 | 발표 후가 아니라 **발표 전 back-pocket 3장**은 있어야 한다. 가격 질문에 “나중에”만 답하면 약하다. |
| T1-2 4자 MoU | 동의 | 중요. 다만 발표 전에는 full MoU가 아니라 **Term Sheet: 역할·IP·데이터·CLR 서명자·수익 원칙**이면 충분하다. |
| T1-3 회장 follow-up 제안서 | 동의 | 발표 후 작성이 아니라 발표 전 초안 완성. 발표 반응만 끼워 넣어 24~72시간 내 발송. |
| T1-4 실시간 피드백/v2.1 | 재정렬 | 유용하지만 conversion-critical은 아니다. v2.1 문서보다 후속 미팅 확정이 먼저다. |
| T2-1 xAPI Profile JSON-LD | 누락·보강 | xAPI만으로 부족. **AsyncAPI/internal event/Caliper 분리**까지 포함한 event spec skeleton이 필요하다. |
| T2-2 CASE alignment sample | 동의 | 조용상 교수 신뢰용으로 중요. full sample은 T2, mini sample은 T1부터 시작. |
| T2-3 xAI Storybook | 동의 | “4-Gate는 말이 아니라 코드”를 증명하는 핵심. T1/T2 상위로 올려야 한다. |
| T2-4 Demo full mockup | 재정렬 | 발표용 Demo와 중복된다. 발표 후 실무진 핸드오프용으로만 유지. |
| T2-5 CLR VC PoC | 재정렬 | 레코스 관점에서는 더 높다. T1에 dummy issuer smoke test, T2에 대학/레코스 연동 PoC. |
| T2-6 4-Gate 위원회 | 누락·보강 | 위원회보다 먼저 Gate 1/2 코드·체크리스트. 외부 위원회는 T1 charter, T2 운영. |
| T3-1 Counterfactual MVP | 동의 | MVP가 아니라 파일럿 중에는 simulation/backtest 수준. 정식은 다학기 데이터 이후. |
| T3-2 GKT/SAKT 연구 | 동의 | 낮은 우선순위가 맞다. BKT+IRT+half-life 투명 운영이 먼저다. |
| T3-3 Pace Agent beta | 재정렬 | 매력적이지만 core pilot 이후. S01/S07/S08 안정 전면화 전에는 범위를 키운다. |
| T3-4 월간 리포트 자동화 | 재정렬 | 파일럿 시작 전 템플릿은 T2에 필요. 운영 중 자동화는 T3. |
| T3-5 채용 윤리 가이드 | 재정렬 | S07을 발표 데모로 쓰므로 T3는 너무 늦다. T1/T2에 커리어센터용 원칙 문서가 필요하다. |
| T4-1 Ambient AI | 동의 | T4 유지. 질문이 나오면 “보수적으로 제외했다”가 오히려 신뢰 신호다. |
| T4-2 Multimodal Coach | 동의 | STEM 확장 카드로만 유지. 이번 파일럿 핵심 아님. |
| T4-3 Institutional Optimizer | 동의 | 다학기·기관 데이터 필요. 지금 전면화하면 과장으로 보인다. |

## 2. Claude가 놓친 작업 (Codex 독립 제안)

| 이름 | 왜 Claude가 놓쳤나 | U/I/C/D · 티어 | 1줄 실행 지침 |
|---|---|---|---|
| **Decision Brief / 정확한 Ask 문서** | Claude는 PPT를 만들라고 했지만, 회장에게 무엇을 결정받을지 분리하지 않았다. | U5/I5/C1/D2 · T0 | “오늘 요청 3개: 파일럿 대학 연결, 기술 담당자 지정, MoU 미팅 날짜”를 1장으로 만든다. |
| **NetLearning Integration Fit Brief** | “compose not replace”를 말했지만 NetLearning 시스템과 어떻게 붙는지 운영 관점 설명이 없다. | U5/I5/C3/D3 · T0 | LTI/OneRoster/EDU-API/SSO/CSV fallback 기준의 1페이지 연동 그림을 준비한다. |
| **Data·APPI·IRB Readiness Pack** | 파일럿은 기술보다 데이터·법무에서 막힌다. Claude가 APPI 법무 검토를 Top 우선순위로 올리지 않았다. | U5/I5/C3/D4 · T0/T1 | 필요 로그, 최소 수집, 동의, 삭제권, 일본 리전, IRB/pre-registration 체크리스트를 만든다. |
| **Standards Claim Audit** | 표준 권위자 앞에서는 “표준을 안다”보다 “과장하지 않는다”가 더 중요하다. | U4/I5/C2/D2 · T0 | xAPI/Caliper/CASE/CLR/EDU-API 각각의 역할·금지 표현·버전 검증 표를 만든다. |
| **일본어 Native UX/Copy Review** | v2에 일본어 CTA는 있지만 실제 일본 대학 톤 검증은 별도다. | U4/I4/C2/D2 · T0 | Demo A/B/C 화면의 일본어, 경어, Meiwaku 표현을 일본 대학 관계자/원어민에게 사전 리뷰받는다. |
| **Build Capacity & Budget Plan** | 회장은 “좋다” 다음에 “누가 언제 얼마로 만들 수 있나”를 묻는다. | U3/I5/C3/D3 · T1 | 90일·6개월·12개월 단위 인력, 비용, 책임자, 제외 범위를 표로 만든다. |
| **파일럿 측정 운영 패키지** | v2에는 가설·검정력이 있지만 실제 운영 문서화가 부족하다. | U4/I4/C2/D3 · T1 | H1~H3 outcome, 분석 방식, 실패 시 보고 방식, 월간 리포트 템플릿을 사전 고정한다. |

## 3. Claude의 우선순위 산정 방식(U+I-0.5C-0.3D)에 대한 평가
이 공식은 작업 목록 정리에는 쓸 수 있지만, 이 맥락의 최종 판단 기준으로는 약하다. 특히 **의존성(D)을 감점**하면 MoU, 데이터 확보, 법무, CLR issuer 결정처럼 오래 걸리는 critical path가 뒤로 밀린다.

더 나은 방식은 “없으면 신뢰가 떨어지는가”를 먼저 보는 **게이트 방식**이다.

1. **Stage Trust Gate**: 발표장에서 없으면 설득이 무너지는가?
2. **Pilot Permission Gate**: 대학·법무·데이터가 허락할 구조인가?
3. **Standards Credibility Gate**: 조용상 교수가 들어도 표준 오남용이 없는가?
4. **Commercial Conversion Gate**: 회장이 다음 미팅을 잡을 이유가 있는가?
5. **Build Feasibility Gate**: 위키드스톰이 실제로 만들 수 있음을 보이는가?

복잡도는 priority를 낮추는 숫자가 아니라, **언제 착수해야 하는지**를 정하는 입력값이다.

## 4. Codex 최종 Top 7 (우선순위 재편성)

| Rank | Task | 티어 | 왜 이 순위 | 소요 예상 |
|---|---|---|---|---|
| 1 | **20분 발표본 + 정확한 Ask + back-pocket Q&A** | T0 | 발표 목적은 감탄이 아니라 다음 의사결정 확보다. | 3~5일 |
| 2 | **Demo A/B/C 영상·클릭 프로토타입 + 일본어 UX 검수** | T0 | S01/S07/S08이 실물처럼 보여야 “AI LMS”가 말이 아닌 장면이 된다. | 7~10일 |
| 3 | **공격형 Q&A 리허설** | T0 | 회장 질문은 사업성·중복·가격, 조용상 교수 질문은 표준·거버넌스다. | 2~3일 |
| 4 | **파일럿 Conversion Packet** | T0/T1 | 대학 타겟, 90일 프로토콜, 후속 미팅 안건, 결정사항을 한 묶음으로 제시해야 한다. | 3~5일 |
| 5 | **Integration + Data/APPI Readiness Brief** | T0/T1 | NetLearning이 가장 현실적으로 걱정할 “붙나, 데이터 되나, 법무 되나”에 답한다. | 3~6일 |
| 6 | **4자 Commercial/MoU Term Sheet** | T1 | 역할·IP·수익·데이터·CLR 서명자 원칙이 없으면 파일럿 직전 멈춘다. | 5~10일 |
| 7 | **P0 Evidence Kit: xAI Storybook + event/xAPI skeleton + CASE/CLR smoke plan** | T1/T2 | 4-Gate와 표준 compose가 “문서 주장”에서 “검증 가능한 산출물”로 바뀐다. | 2~4주 |

## 5. Claude가 Round 2 식으로 물은 5개 질문에 대한 답
① **우선순위 매김에 동의?**  
부분 동의. 발표·데모·Q&A는 맞다. 하지만 데이터/APPI/통합/정확한 Ask가 빠져 있어 실제 파일럿 전환 우선순위로는 불완전하다.

② **놓친 작업?**  
Decision Brief, NetLearning integration brief, Data/APPI/IRB readiness, standards claim audit, 일본어 UX 검수, build/budget plan이 빠졌다.

③ **T0에 너무 많이 넣었는지?**  
full deliverable 기준으로는 너무 많다. T0는 “무대에 필요한 완성본”과 “Q&A 방어용 1페이지”로 쪼개고, full 문서는 T1로 넘겨야 한다.

④ **CLR VC PoC 우선순위?**  
발표 전에는 simulated verification story로 충분하다. 하지만 발표 직후에는 레코스 관점의 핵심 자산이므로 T1 kickoff, T2 end-to-end PoC로 올려야 한다.

⑤ **발표 리허설을 Codex가 모의 회장 역할로?**  
가치 있다. 3회로 나누는 게 좋다: 냉정한 NetLearning 회장, 표준을 파고드는 조용상 교수, 대학 법무/정보시스템 담당자 역할.

## 6. 위험 시나리오 (Claude 제안에 빠진 관점)

- **파일럿 효과 미발견**: 사전등록 outcome을 유지하고, 실패도 공개 가능한 learning report로 전환한다. “효과 없음”을 숨기면 표준·학술 신뢰가 무너진다.
- **회장 미온적 반응**: MoU를 밀지 말고 30분 technical discovery, 담당자 1명, 파일럿 후보 대학 2곳 소개만 요청한다.
- **데이터 미확보**: 과거 로그가 없으면 prospective collection으로 전환하고, S01 causal claim은 낮추며 S07/S08처럼 로그 의존이 낮은 데모를 먼저 살린다.
- **대학·법무 차단**: APPI, 동의, 삭제권, 일본 리전 저장, 개인 위험명단 비노출, opt-in 범위를 1페이지로 제시한다.
- **표준 반박**: xAPI와 internal audit, CASE와 local concept, CLR과 감시 지표를 절대 섞지 않는다. “감시 지표는 CLR 금지”가 핵심 방어 문장이다.
- **데모 실패**: 라이브 의존 금지. 사전 녹화, 클릭 프로토타입, PNG backup flow를 모두 준비한다.
- **4자 역할 충돌**: 파일럿 단계 IP, 상용화 단계 수익, CLR issuer 책임, 데이터 controller/processor를 MoU term sheet에 분리한다.

## 7. Round 3 이후 최종 결론 (2~3줄)
지금 딱 3개만 시작한다면 **발표본+Demo+Q&A**, **파일럿 Conversion Packet**, **Integration/Data/APPI Readiness Brief**다.  
이 3개가 없으면 발표는 멋있어도 NetLearning 회장 입장에서는 “그래서 우리 시스템에 언제, 어떤 책임으로, 어느 대학에서 붙이나?”가 비어 보인다.