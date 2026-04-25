import type { StudentLectureViewModel } from "./view-model.js";

interface StudentLectureRouteProps {
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

export function StudentLectureAside({ viewModel }: StudentLectureRouteProps) {
  return (
    <aside className="app-aside lecture-aside" aria-label="Student lecture AI panel">
      <div className="aside-head">
        <div>
          <div className="aside-title">{viewModel.aside.title}</div>
          <div className="aside-sub">{viewModel.aside.subtitle}</div>
        </div>
      </div>

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
        <section className="aside-mini-card" data-ai-target={card.targetId} key={card.targetId}>
          <div className="aside-mini-card-head">{card.title}</div>
          <div>{card.body}</div>
          <div className="muted">{card.metric}</div>
        </section>
      ))}

      <section className="xai-panel peer-panel" data-ai-target={viewModel.aside.peerCluster.targetId}>
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
      </section>

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
