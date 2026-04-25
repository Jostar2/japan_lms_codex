import { AiInteractionPanel, type AiInteractionContext } from "../../app/AiInteractionPanel.js";
import type { StudentLectureViewModel } from "./view-model.js";

interface StudentLectureRouteProps {
  activeAiTarget?: string;
  viewModel: StudentLectureViewModel;
}

export function StudentLectureRoute({ viewModel }: StudentLectureRouteProps) {
  return (
    <div className="lecture-page">
      <div className="page-head lecture-page-head">
        <div>
          <div className="page-eyebrow">{viewModel.page.eyebrow}</div>
          <h1>{viewModel.page.title}</h1>
          <p>{viewModel.page.subtitle}</p>
        </div>
        <div className="lecture-actions">
          <button className="btn" type="button">
            자막
          </button>
          <button className="btn btn-student" type="button" data-ai-target="quick-review-5min">
            Quick 5분
          </button>
          <button className="icon-btn" type="button" aria-label="More lecture actions">
            ⋯
          </button>
        </div>
      </div>

      <section className="session-strip" aria-label="Current learning session">
        <div className="session-pill">
          <span>현재 구간</span>
          <strong>{viewModel.player.currentTime}</strong>
        </div>
        <div className="session-pill">
          <span>진행률</span>
          <strong>{viewModel.player.progressPercent}%</strong>
        </div>
        <div className="session-pill priority">
          <span>AI 판단</span>
          <strong>{viewModel.segment.concept}</strong>
        </div>
        <div className="session-pill">
          <span>개인정보</span>
          <strong>집계 신호만</strong>
        </div>
      </section>

      <div className="lecture-focus-grid">
        <div className="lecture-primary-column">
          <section className="lecture-video" aria-label="Lecture player">
            <div className="lecture-video-title">{viewModel.player.title}</div>
            <div className="lecture-play-button" aria-hidden="true">
              ▶
            </div>
            <div className="lecture-controls">
              <span>{viewModel.player.currentTime}</span>
              <div className="lecture-progress" aria-label={`${viewModel.player.progressPercent}% watched`}>
                <div className="lecture-progress-fill" style={{ width: `${viewModel.player.progressPercent}%` }} />
                {viewModel.player.cues
                  .filter((cue) => cue.percent > 0 && cue.percent < 100)
                  .map((cue) => (
                    <button
                      aria-label={`${cue.percent}% ${cue.label}`}
                      className={`lecture-progress-mark ${cue.emphasis === "primary" ? "active" : ""}`}
                      data-ai-target={cue.targetId}
                      key={cue.targetId}
                      style={{ left: `${cue.percent}%` }}
                      type="button"
                    />
                  ))}
              </div>
              <span>{viewModel.player.duration}</span>
            </div>
          </section>

          <button className="seg-callout" type="button" data-ai-target={viewModel.callout.targetId}>
            <span className="ai-spark-dot" aria-hidden="true" />
            <span>{viewModel.callout.label}</span>
            <span className="spacer" />
            <span className="tag tag-xai">{viewModel.callout.badge}</span>
          </button>
        </div>

        <section className="learning-plan-panel" aria-label="Recommended recovery path">
          <div className="card-head">
            <div>
              <div className="card-title">추천 학습 경로</div>
              <div className="card-sub">막힌 구간을 회복한 뒤 강의로 돌아갑니다.</div>
            </div>
            <span className="tag">5분</span>
          </div>
          <ol className="learning-step-list">
            <li>
              <span>1</span>
              <div>
                <strong>정의 카드 확인</strong>
                <small>{viewModel.guidance.recommendedAction}</small>
              </div>
            </li>
            <li>
              <span>2</span>
              <div>
                <strong>확인 문제 2개</strong>
                <small>정답률과 자신감을 함께 기록합니다.</small>
              </div>
            </li>
            <li>
              <span>3</span>
              <div>
                <strong>18:12로 복귀</strong>
                <small>추천 결과는 개인 학습에만 사용합니다.</small>
              </div>
            </li>
          </ol>
          <div className="learning-plan-actions">
            <button className="btn btn-student" type="button" data-ai-target="quick-review-5min">
              회복 경로 시작
            </button>
            <button className="btn btn-ghost" type="button" data-ai-target="prereq-entropy">
              근거 확인
            </button>
          </div>
        </section>
      </div>

      <section className="lecture-resource-strip" aria-label="Lecture learning resources">
        <div>
          <span>교재</span>
          <strong>§4.2 의사결정 트리</strong>
        </div>
        <div>
          <span>자막</span>
          <strong>한 · EN · 日 · 中</strong>
        </div>
        <div>
          <span>과제 연결</span>
          <strong>과제 3 실험 설계</strong>
        </div>
      </section>

      <div className="lecture-grid">
        <section className="lecture-card" aria-label="Lecture summary">
          <div className="card-head">
            <div>
              <span className="ai-badge">요약 87%</span>
              <div className="card-title">핵심 5가지</div>
            </div>
            <div className="row compact-actions">
              <button className="btn btn-sm btn-ghost" type="button" aria-label="Helpful summary">
                좋음
              </button>
              <button className="btn btn-sm btn-ghost" type="button" aria-label="Unhelpful summary">
                보완
              </button>
            </div>
          </div>
          <div className="summary-list">
            {viewModel.summaryBullets.map((item) => (
              <div className="summary-bullet" key={item.index}>
                <div className="sb-num">{item.index}</div>
                <div className="sb-text">{item.text}</div>
              </div>
            ))}
          </div>
        </section>

        <section className="lecture-card" aria-label="Live transcript">
          <div className="card-head">
            <div>
              <span className="ai-badge">자막 번역</span>
              <div className="card-title">라이브 스크립트</div>
            </div>
            <div className="segment-tabs" role="group" aria-label="Transcript language">
              {viewModel.transcript.languageTabs.map((tab, index) => (
                <button className={index === 0 ? "active" : ""} key={tab} type="button">
                  {tab}
                </button>
              ))}
            </div>
          </div>
          <div className="transcript-list">
            {viewModel.transcript.rows.map((row) => (
              <div
                className={`transcript-row ${row.active ? "active" : ""}`}
                data-ai-target={row.targetId}
                key={row.timestamp}
                role={row.targetId ? "button" : undefined}
                tabIndex={row.targetId ? 0 : undefined}
              >
                <div className="transcript-time">{row.timestamp}</div>
                <div>{row.text}</div>
              </div>
            ))}
          </div>
          <div className="row transcript-actions">
            <button className="btn btn-sm btn-ghost" type="button">
              내 음성 노트 추가
            </button>
            <button className="btn btn-sm btn-ghost" type="button">
              이 구간 저장
            </button>
          </div>
        </section>
      </div>

      <section className="meta-check-panel" aria-label="Metacognition check">
        <div className="meta-check-head">
          <span>메타인지 체크 · {viewModel.metacognition.cadence}</span>
          <span className="tag">xAI 연구 검증</span>
        </div>
        <div className="meta-check-q">{viewModel.metacognition.question}</div>
        <div className="meta-scale" role="group" aria-label="Metacognition scale">
          {viewModel.metacognition.scale.map((label, index) => {
            const value = index + 1;
            const selected = value === viewModel.metacognition.selectedValue;
            return (
              <button
                className={`meta-dot ${selected ? "selected" : ""}`}
                data-ai-target={selected ? viewModel.metacognition.targetId : undefined}
                key={label}
                type="button"
              >
                {label}
              </button>
            );
          })}
        </div>
        <div className="muted">{viewModel.metacognition.privacyCopy}</div>
      </section>

      <section className="cohort-bridge" aria-label="Instructor aggregate bridge">
        <div>
          <div className="cohort-bridge-label">{viewModel.instructorBridge.label}</div>
          <div className="cohort-bridge-body">{viewModel.instructorBridge.body}</div>
          <div className="muted">{viewModel.instructorBridge.privacyCopy}</div>
        </div>
        <button className="btn btn-instructor" type="button" data-ai-target={viewModel.instructorBridge.targetId}>
          같은 패턴을 교수자 집계에서 보기
        </button>
      </section>
    </div>
  );
}

export function StudentLectureAside({ activeAiTarget = "seg-22pct", viewModel }: StudentLectureRouteProps) {
  const aiContext = getStudentAiContext(viewModel, activeAiTarget);

  return (
    <aside className="app-aside lecture-aside" aria-label="Student lecture AI panel">
      <div className="aside-head">
        <div>
          <div className="aside-title">AI 학습 동반자</div>
          <div className="aside-sub">선택 맥락 · {aiContext.scope}</div>
        </div>
      </div>

      <AiInteractionPanel context={aiContext} key={activeAiTarget} tone="student" />

      <section className="struggle-heatmap-react" aria-label="구간별 학습 신호" data-ai-target="seg-22pct">
        <div className="heatmap-label">구간별 학습 신호</div>
        <div className="heatmap-track">
          {viewModel.aside.heatmap.map((cue) => (
            <button
              aria-label={`${cue.percent}% ${cue.label}`}
              className={`heatmap-cue ${cue.emphasis === "primary" ? "active" : ""}`}
              data-ai-target={cue.targetId}
              key={cue.targetId}
              style={{ left: `${cue.percent}%` }}
              type="button"
            >
              <span className="heatmap-dot" />
              <span>{cue.percent}%</span>
            </button>
          ))}
        </div>
        <div className="struggle-timeline-label">22% 구간 · Gini/Entropy 정의</div>
        <div className="muted">정지/반복 42%</div>
        <div className="muted">표본 n=128 · 신뢰도 82%</div>
        <div className="muted">집계 신호 · 개인 식별 없음</div>
      </section>

      {viewModel.aside.cards.map((card) => (
        <button className="aside-mini-card" data-ai-target={card.targetId} key={card.targetId} type="button">
          <div className="aside-mini-card-head">{card.title}</div>
          <div>{card.body}</div>
          <div className="muted">{card.metric}</div>
        </button>
      ))}

      <div
        className="xai-panel peer-panel"
        data-ai-target={viewModel.aside.peerCluster.targetId}
        role="button"
        tabIndex={0}
      >
        <div className="xai-panel-head">동료 학습자 힌트</div>
        <div className="xai-panel-body">{viewModel.aside.peerCluster.body}</div>
        <div className="source-list">
          {viewModel.aside.peerCluster.hints.map((hint) => (
            <div className="source-item" key={hint.prompt}>
              <span>{hint.prompt}</span>
              <span className="source-weight">{hint.count}</span>
            </div>
          ))}
        </div>
        <div className="confidence">
          <span>표본 신뢰도</span>
          <div className="confidence-bar">
            <div
              className="confidence-bar-fill"
              style={{ width: `${viewModel.aside.peerCluster.confidencePercent}%` }}
            />
          </div>
          <span className="confidence-value">{viewModel.aside.peerCluster.confidencePercent}%</span>
        </div>
      </div>

      <section className="companion-card" aria-label={viewModel.aside.companion.title}>
        <div className="aside-mini-card-head">{viewModel.aside.companion.title}</div>
        <div className="muted">{viewModel.aside.companion.subtitle}</div>
        <div className="companion-thread">
          {viewModel.aside.companion.messages.map((message, index) => (
            <div className={`message ${message.who}`} key={`${message.who}-${index}`}>
              <div>{message.body}</div>
              {message.citation ? <small>{message.citation}</small> : null}
            </div>
          ))}
        </div>
        <div className="preset-row">
          {viewModel.aside.companion.presets.map((preset) => (
            <button className="preset-chip" key={preset} type="button">
              {preset}
            </button>
          ))}
        </div>
      </section>
    </aside>
  );
}

function getStudentAiContext(viewModel: StudentLectureViewModel, targetId: string): AiInteractionContext {
  const contexts: Record<string, AiInteractionContext> = {
    "seg-22pct": {
      actionLabel: "정의 카드 열기",
      body: "18:12 구간에서 지니와 엔트로피 정의가 처음 연결됩니다. 같은 구간에서 정지/반복이 높아 개인 회복 경로를 먼저 제안합니다.",
      confidenceLabel: "82%",
      evidence: ["현재 위치 18:12 / 52:08", "반복·정지 집계 42%", "동료 질문 상위: 정의 차이, log2, 가중 평균"],
      modeLabel: "구간 AI",
      prompts: ["왜 여기서 막히나요?", "1분 카드로 설명", "확인 문제 만들어줘"],
      response:
        "먼저 두 지표가 모두 '섞임'을 측정한다는 공통점을 잡고, 차이는 계산 방식으로만 분리해 보세요. 1분 정의 카드 후 확인 문제 2개를 풀면 본 강의로 돌아갈 수 있습니다.",
      scope: "22% 구간 · Gini/Entropy",
      title: "현재 구간을 설명합니다",
    },
    "quick-review-5min": {
      actionLabel: "5분 복습 시작",
      body: "강의를 멈추고 긴 보충 강의로 이동하지 않습니다. 정의 카드, 예시 1개, 확인 문제 2개로 막힌 구간만 회복합니다.",
      confidenceLabel: "5분",
      evidence: ["추천 근거: 막힌 구간 22%", "확인 문제 결과로 다음 추천 갱신", "개인 응답은 교수자에게 비공개"],
      modeLabel: "복습 AI",
      prompts: ["5분 계획 짜줘", "쉬운 예시로 바꿔줘", "내가 이해했는지 확인"],
      response:
        "복습 순서는 정의 60초, 지니 계산 예시 90초, 엔트로피 직관 60초, 확인 문제 2개입니다. 정답률과 자신감이 낮으면 과제 3 전에 한 번 더 노출합니다.",
      scope: "Quick Review",
      title: "짧은 회복 경로를 만듭니다",
    },
    "transcript-18m12": {
      actionLabel: "이 문장 저장",
      body: "자막의 핵심 문장을 강의 구간, 교재 절, 확인 문제와 연결합니다. 번역보다 개념 연결을 우선합니다.",
      confidenceLabel: "자막",
      evidence: ["자막 타임스탬프 18:12", "교재 §4.2와 연결", "후속 예시 19:03"],
      modeLabel: "자막 AI",
      prompts: ["이 문장을 쉽게 풀어줘", "일본어로 비교해줘", "교재 위치 알려줘"],
      response:
        "이 문장은 '한 노드 안에 서로 다른 클래스가 섞여 있는 정도'를 불순도라고 부르는 정의입니다. 다음 19:03 예시에서 두 지표가 비슷한 분할을 고르는 이유가 이어집니다.",
      scope: "자막 18:12",
      title: "선택한 자막을 해석합니다",
    },
    "prereq-entropy": {
      actionLabel: "선수 개념 카드",
      body: "엔트로피 정의가 약하면 지니와의 차이가 계산식 차이로만 보입니다. 정보량 관점의 직관을 먼저 회복합니다.",
      confidenceLabel: "P=0.71",
      evidence: ["진단 4문항 기반", "엔트로피 질문 27건", "과제 3 실험 설계와 연결"],
      modeLabel: "선수개념 AI",
      prompts: ["엔트로피 직관 설명", "log2를 왜 쓰나요?", "지니와 표로 비교"],
      response:
        "엔트로피는 '예측하기 어려울수록 정보량이 크다'는 관점입니다. log2는 선택지를 이진 질문 수로 해석하게 해 주며, 수업에서는 상대 비교만 이해해도 충분합니다.",
      scope: "선수 개념",
      title: "엔트로피 기반을 보강합니다",
    },
    "confirm-q-2": {
      actionLabel: "문제 풀기",
      body: "막힘 원인을 추정만 하지 않고, 구간 직후 확인 문제로 정답률과 자신감을 함께 기록합니다.",
      confidenceLabel: "2문항",
      evidence: ["post-segment 문제", "정답률 + 자신감 동시 기록", "결과로 추천 경로 갱신"],
      modeLabel: "점검 AI",
      prompts: ["문제 2개 내줘", "오답이면 어디로 가나요?", "자신감도 왜 묻나요?"],
      response:
        "첫 문제는 불순도 정의, 두 번째는 가중 평균 적용입니다. 정답이어도 자신감이 낮으면 짧은 예시를 한 번 더 보여주고, 오답이면 정의 카드로 되돌립니다.",
      scope: "확인 문제",
      title: "이해 여부를 점검합니다",
    },
    "peer-struggle-cluster": {
      actionLabel: "동료 질문 보기",
      body: "동료 패턴은 개인 비교가 아니라, 어느 설명이 많이 막히는지 알려주는 익명 집계 신호입니다.",
      confidenceLabel: "n=128",
      evidence: ["정지/반복 42%", "질문 군집 3개", "개인 식별 없음"],
      modeLabel: "집계 AI",
      prompts: ["많이 묻는 질문 보여줘", "내 기록과 비교되나요?", "교수자에게 뭘 전달하나요?"],
      response:
        "교수자에게는 개인 기록이 아니라 22% 구간의 익명 집계만 전달됩니다. 학생에게는 '나만 막힌 게 아니다'라는 힌트와 회복 경로만 제공합니다.",
      scope: "동료 집계",
      title: "익명 학습 패턴을 설명합니다",
    },
    "metacog-check-3": {
      actionLabel: "응답 저장",
      body: "메타인지 응답은 추천 문제 생성에만 쓰입니다. 교수자에게 개별 응답으로 공유되지 않습니다.",
      confidenceLabel: "비공개",
      evidence: ["선택값 3 · 대체로", "개인 점검용", "교수자 공유 없음"],
      modeLabel: "메타인지 AI",
      prompts: ["왜 자신감을 묻나요?", "다음 문제 난이도 조정", "친구에게 설명 연습"],
      response:
        "자신감은 정답률과 다른 신호입니다. 맞았지만 자신감이 낮으면 쉬운 예시를 더 주고, 틀렸지만 자신감이 높으면 오개념 가능성을 확인합니다.",
      scope: "메타인지",
      title: "이해 자신감을 반영합니다",
    },
    "decision-w7-cocreation": {
      actionLabel: "교수자 집계 보기",
      body: "이 학생 화면의 막힘은 교수자 화면에서 반 단위 자료 개선 결정으로 이어집니다. 개인 식별 정보는 전달하지 않습니다.",
      confidenceLabel: "집계",
      evidence: ["학생 개인: 회복 경로", "교수자: 익명 반 단위 패턴", "측정: 재시청률·정답률"],
      modeLabel: "연계 AI",
      prompts: ["교수자에게 무엇이 보이나요?", "개인정보는 안전한가요?", "자료 개선 효과는 어떻게 재나요?"],
      response:
        "교수자에게는 'W7/Lec2 22% 구간에서 집계 막힘이 높다'는 사실과 개선 후보만 보입니다. 학생 이름, 개별 응답, 개인 자신감은 전달되지 않습니다.",
      scope: "교수자 연계",
      title: "학생-교수자 연결을 설명합니다",
    },
  };

  return contexts[targetId] ?? contexts["seg-22pct"];
}
