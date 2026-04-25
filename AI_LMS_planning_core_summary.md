# AI-X Platform 시나리오 명세 (개발 기준)
## ― 일본 대학 시장 타겟 차세대 AI LMS ―

> **이 문서의 방식**
> 이 기획은 "기능 목록"이 아니라 **"현장 시나리오"** 로 설계된다.
> 각 시나리오는 다음 순서로 기술한다.
>
> 1. **페인포인트** — 누가 · 어떤 상황에서 · 무엇이 고통인가
> 2. **감지(Signals)** — 어떤 이벤트를 · 언제 · 어떻게 결합해서 패턴을 잡는가 (구체적 임계값)
> 3. **교수자에게** — 무슨 화면에서 · 어떤 xAI 카드가 · 어떤 행동으로 이어지는가
> 4. **학생에게** — 우측 패널 또는 인라인에서 · 무엇이 · 어떤 톤으로 제공되는가
> 5. **(관리자에게)** — 해당 시 집계 시각화
> 6. **데이터 출처** — 참조 이벤트 · 테이블
> 7. **수용 기준** — 검증 가능한 지표

공통 자산(이벤트 카탈로그·데이터 레이어·xAI 카드 표준·아키텍처)은 §3 참조(References)에 모여 있다.

---

## 0. 제품 한 줄

**제품명**: AI-X Platform (기반 기술: Lecognizer LRS + GROWA LMS + AI/xAI 레이어)

**한 줄**: 학생·교수자의 모든 행동을 xAPI로 수집하고, 그 데이터가 **"왜 이렇게 추천했는지"** 를 언제든 보여주는 일본 대학 전용 AI 학습 플랫폼.

**기존 LMS와의 구조적 차이**

| 항목 | 기존 (Moodle/manaba/Classi) | AI-X Platform |
|---|---|---|
| AI 출력 | 추천 결과만 | Evidence + Reasoning + Action 3종 강제 |
| 데이터 자산 | 콘텐츠·제출물 DB | + 학습 이벤트 Store + 개념 지식 그래프 + 학습자 프로파일 |
| 학습 진단 | 점수 통계 | BKT/DKT 기반 개념별 숙달 확률 |
| 교수자 개입 | 사후 성적 기반 | 행동 신호 기반 주간 리스크 스코어 + 낙인 방지 UX |
| 외부 연동 | SSO + 일부 LTI | xAPI LRS 표준 + LTI 1.3 + Webhook |

---

## 1. 제품 철학 (모든 시나리오가 지켜야 하는 것)

이건 엔지니어링 불변 조항이자 기획 심사 기준이다.

1. **AI 출력에는 반드시 출처(Evidence)가 붙는다.** 출처 없는 AI 응답은 배포 금지.
2. **모든 사용자 행동은 xAPI Statement로 남는다.** SDK 외 경로로 DB 직쓰기 금지.
3. **교수자가 학생 개인 데이터를 볼 때는 목적(purpose) 입력이 필수다.** 감사 로그에 기록.
4. **개별 학생 명단보다 "반 단위 병목"이 먼저 노출된다.** 낙인 방지가 UX 레벨에서 강제.
5. **모든 AI 판단에는 "Mei-waku Care (이의 제기)" 링크가 상시 붙는다.** 오판 회수 경로 보장.
6. **학생 UI의 경고성 단어("위험", "탈락 예측")는 기본 금지.** 일본 문화 특화.

---

## 2. 시나리오 카탈로그

### Scenario 01. 동영상에서 학생이 막히는 지점을 교수자·후배가 함께 본다

> **이 시나리오의 위상**
> 이후 모든 시나리오는 이 항목의 구조·세부 수준을 따라 기술한다. Scenario 01은 템플릿 겸 레퍼런스다.

#### 01-A. 한 줄 정의
동영상 재생 중 되감기·일시정지·질의가 집중된 5초 구간을 자동 탐지해, **교수자에겐** 근거와 개선안을, **학생에겐** 익명화된 선배 질문을 재구성한 보조 자료를, **학과장에겐** 반복 난관 구간 Top10 리포트를 제공한다.

#### 01-B. 페인포인트 (3 actors, 인용체)

*교수자 (학기 말 피드백 수집 중)*
> "내 영상 강의 어디가 잘 전달됐고 어디가 안 됐는지 구체적으로 모른다. 매 학기 비슷한 학생 피드백만 쌓인다."

*학생 (VOD 시청 중)*
> "이 부분 이해가 안 가서 두 번 되돌렸다. 뭐가 빠진 건지 모르겠고, 구글로 찾아도 우리 교수님 강의 맥락은 나오지 않는다."

*후배 학생 (다음 학기 같은 수업)*
> "선배들이 고민했던 질문·메모가 분명 있을 텐데 포럼에서 찾기 어렵다. 답변이 끊기거나 지워진 것도 많다."

#### 01-C. 성공 장면 (도입 3개월 뒤)

- 교수자 A: "이번 학기 자료 개편 우선순위가 학기 말이 아니라 **학기 중에** 잡힌다. 학과장 리포트 작성 시간이 반으로 줄었다."
- 학생 B: "영상에서 막힌 순간 우측 패널이 먼저 답을 준다. 선배들이 남긴 궤적이 바로 보인다."
- 데이터: 적용 세그먼트의 재시청률 -30%, 보조 자료 클릭 후 끝까지 시청률 ≥ 85%.

#### 01-D. 신호 → 추론 → 출력 파이프라인

```
[클라이언트 이벤트]
  content.video.play / pause / seek / rate_change / complete
  ai.ask.submit           (context_anchor: content_id + position_s)
  content.note.create     (anchor)
  forum.thread.create     (tags, 본문 타임스탬프)
      │
      ▼
[Stream Processor] 실시간
  영상별 5초 bucket으로 이벤트 집계
  signal_score = w1·seek_back + w2·pause + w3·rewatch_ratio + w4·ask_count
      │
      ▼
[Nightly Batch]
  코호트 평균·표준편차 계산 → z-score
  +2σ 초과 bucket = "난관 후보 구간" (수강생 n≥20 조건)
  인접 bucket 병합 → "난관 세그먼트"  (예: 12:34–12:42)
      │
      ▼
[Text Analysis]
  세그먼트 내 AI 질의·메모·포럼 텍스트 임베딩
  HDBSCAN 클러스터링 → 대표 토픽
  L5 개념 그래프 매칭 → concept_id 확정
      │
      ▼
[출력 1: 교수자 카드]  [출력 2: 학생 보조 자료 팩]  [출력 3: 관리자 누적]
```

#### 01-E. 교수자 여정

1. **진입**: 코스 대시보드 → "콘텐츠 분석" 탭 (영상 썸네일 그리드).
2. **히트맵 뷰**: 영상을 열면 타임라인 하단에 **난관 히트맵** (빨간 구간).
3. **구간 클릭**: 12:34 구간 클릭 → 우측 패널에 xAI 카드 슬라이드 인.
4. **카드 실제 문구** (§01-H 참조).
5. **액션**:
   - `[강의안 메모에 추가]` → 다음 학기 강의안 편집 화면에 해당 지점이 북마크 + 개선안 텍스트 붙은 상태로 로드됨.
   - `[2주 후 결과 보기]` → 2주 뒤 동일 세그먼트 재측정 결과를 알림 푸시.
   - `[무시]` → 이 세그먼트는 본 교수자 뷰에서 숨김 (감사 로그에만 기록).
6. **누적**: 주간 **"개선 적용 전/후 비교 리포트"** 자동 생성 → 학과장 보고에 그대로 첨부 가능.

#### 01-F. 학생 여정

1. **트리거**: VOD 시청 중, 본인이 **같은 5초 bucket에서 되감기 2회 OR 일시정지 30초 누적** 이면 트리거 충족.
2. **알림**: 우측 AI 패널 상단 배지 (소리 없음, 진동 1회).
3. **카드 실제 문구** (§01-H 참조).
4. **선배 데이터 공개 규칙**:
   - 원문 그대로 노출 ❌ → LLM이 3~5건을 **합성 요약 1개**로 재구성
   - 출처 표기는 "2024년 후기 수강생" 같은 **학기 단위**까지만
   - k-anonymity ≥ 5 (역참조로 개인 특정 불가)
5. **피드백 루프**:
   - 👍 → 해당 hint pack 가중치 + (다른 후배 노출 우선)
   - 👎 + 이유(`already_known` / `not_relevant` / `too_hard`) → 재학습 입력
6. **복귀 루틴**: 5분 보조 영상 시청 후 본 영상 복귀 시 `meta_cognition_calibration` 자가 체크 1-클릭.

#### 01-G. 관리자 여정 (학과장)

월간 리포트에 **"반복 난관 구간 Top 10 (학과 전체)"** 섹션이 자동 삽입.

| 강의명 | 구간 | 반복 학기 | 개념 노드 | 개선 여부 | 개선 후 재시청률 |
|---|---|---|---|---|---|
| 통계학 II | 12:34–12:42 | 3학기 | 신뢰구간 | ✅ 적용 | -42% |
| 미시경제 | 08:10–08:25 | 2학기 | 한계효용 | 🟡 메모만 | — |

용도: 차년도 콘텐츠 제작 예산 배분, 교수별 지원 필요도 판단, 경영위원회 보고.

#### 01-H. xAI 카드 실제 mock

```
[교수자용 — kind: recommendation, tone: neutral]
┌──────────────────────────────────────────────┐
│ 난관 후보 구간 — 12:34–12:42                │
├──────────────────────────────────────────────┤
│ 되감기 +3.2σ · 일시정지 +2.1σ                │
│ 질문 12건 · 메모 3건 · 개념: 신뢰구간         │
│                                              │
│ 📊 근거  ▼ 질문 원문 3건(익명)              │
│ 🧠 추론  ▼ bucket·코호트 분석                │
│ 📈 Confidence ████████░░ 0.82                │
│ 👥 유사 개선 7건: 재시청률 평균 -45% 예측    │
├──────────────────────────────────────────────┤
│ [강의안 메모에 추가] [2주 후 결과] [무시]   │
│ 🚩 이 판단이 오판이면 알려주세요              │
└──────────────────────────────────────────────┘

[학생용 — kind: insight, tone: gentle]
┌──────────────────────────────────────────────┐
│ 이 부분, 혼자만 그런 게 아니에요 🌸         │
├──────────────────────────────────────────────┤
│ 2024년 후기 수강생 47명 중 31명이            │
│ "분산과 표준편차 차이"에서 헷갈렸어요.       │
│                                              │
│ 📊 익명화된 선배 질문 요약  ▼                │
├──────────────────────────────────────────────┤
│ [5분 보조 영상]                              │
│ [요약 메모 PDF]                              │
│ [관련 퀴즈 3문항]                            │
│                                              │
│ 🚩 이 추천이 안 맞으면 알려주세요            │
└──────────────────────────────────────────────┘
```

#### 01-I. 데이터 스키마

**참조 이벤트 (§3-1)**
- 행동: `content.video.seek`, `content.video.pause`, `content.video.play`, `content.video.rate_change`, `content.video.complete`
- 언어: `ai.ask.submit`, `content.note.create`, `forum.thread.create`
- 감사: `instructor.data_access` (교수자 세그먼트 원문 열람 시)

**신규 집계 테이블 (L2 확장)**

```sql
content_video_bucket_stats (
  content_id        uuid,
  bucket_start_s    int,          -- 5초 단위
  cohort_size       int,
  seek_back_count   int,
  pause_count       int,
  rewatch_ratio     float,
  ask_count         int,
  signal_score      float,
  z_score           float,
  is_struggle       boolean,
  updated_at        timestamp,
  PRIMARY KEY (content_id, bucket_start_s)
)

content_struggle_segments (
  segment_id                  uuid PK,
  content_id                  uuid,
  start_s, end_s              int,
  concept_id                  uuid,          -- L5 매핑
  cluster_labels              text[],
  representative_question     text,          -- LLM 합성
  improvement_suggestion      text,
  confidence                  float,
  cohort_size, k_anonymity    int,
  created_at                  timestamp
)
```

#### 01-J. API 엔드포인트

**교수자**
```
GET  /api/v1/courses/{course_id}/contents/{content_id}/struggle-segments
GET  /api/v1/struggle-segments/{segment_id}/evidence
POST /api/v1/struggle-segments/{segment_id}/actions
     body: { action_type: "add_to_lesson_plan" | "dismiss" | "schedule_review" }
POST /api/v1/struggle-segments/{segment_id}/meiwaku
     body: { reason, note }
```

**학생**
```
GET  /api/v1/contents/{content_id}/struggle-hint?position_s=754
     → null (트리거 안 됨) OR { hint_pack: { summary, materials[], source_count } }
POST /api/v1/hints/{hint_id}/feedback
     body: { polarity, reason? }
```

#### 01-K. 처리 로직 세부

**임계값 자동 조정 (false positive 방지)**

| 수강생 n | z-score 기준 | 세그먼트 표시 |
|---|---|---|
| < 20 | — | 비활성 ("측정 중") |
| 20 ≤ n < 50 | +2.5σ (엄격) | 표시 |
| n ≥ 50 | +2σ (기본) | 표시 |

**초기 학기 cold start**
해당 영상이 이 학기 처음 사용이면, L5의 동일 개념 다른 영상에서 관측된 난관 패턴을 조건부 확률로 시드. 교수자에겐 **"예측 히트맵(시드 기반)"** 라벨을 붙여 실측과 구분. 실측 bucket ≥ 30이 쌓이면 자동으로 "실측 히트맵" 전환.

**영상 종류별 처리**

| 유형 | signal 공식 차이 |
|---|---|
| 사전 녹화 VOD | 기본 공식 |
| 라이브 스트림 | seek 제거, pause + 실시간 질의 + 즉석 퀴즈 정답률 조합 (Scenario 05와 공유) |
| 다시보기(라이브 녹화) | VOD 공식 + 라이브 당시 신호를 추가 가중합 |

#### 01-L. 프라이버시·거버넌스

| 항목 | 규칙 |
|---|---|
| 학생 개별 발화 원문을 교수자에게 노출 | ❌ 원문 인용 시도 LLM 합성 요약만, k-anonymity ≥ 5 |
| 선배 → 후배 노출 | 기본 ✅. 단 선배가 메모·질문 작성 시 "공개 동의" 체크박스 (기본 on, 학과 정책에 따라 기본 off 프리셋 가능) |
| 원문 그대로 복사 | 금지 (LLM 프롬프트 가드에 원문 보존 금지 조건 하드코딩) |
| Mei-waku Care | 오분석 신고 시 24h 내 해당 세그먼트에서 해당 발화 제외 + 모델 재학습 입력 |
| 교수자 열람 감사 | `instructor.data_access` 에 segment_id · purpose 기록, purpose 없으면 401 |

#### 01-M. 에지 케이스·실패 모드

**에지 케이스**
- 수강생 < 10명 → 기능 비활성, UI에 "통계적 유의성 부족으로 측정 중" 플레이스홀더.
- 영상 업로드 후 < 3일 → 동일 플레이스홀더.
- 교수자가 영상 교체·편집 → 기존 세그먼트 무효화, 과거 버전 링크로 archive, 새 집계 시작.
- 자막 없는 영상 → 개념 매핑을 파일명·코스 메타 기반으로 fallback, confidence 표시에 반영 (⚠ 자막 없음 뱃지).
- 세션당 이벤트 상한 + `focused` 플래그로 어뷰징(고의 seek 반복) 가중치 감쇠.

**실패 모드**
- 모델 confidence < 0.5 → 교수자 카드 생성 안 함. 히트맵은 표시하되 개선안 영역 빈 상태.
- 클러스터 결속력 낮음 (DBCV < 0.3) → 학생 보조 자료 카드 생성 보류, 대표 질문 없음.
- L5 개념 매핑 실패 → concept_id = null, 학생 카드는 "이 구간 학습 보조" 일반 문구로 제공.

#### 01-N. 측정 지표

**프로덕트**
- 난관 탐지 Recall ≥ 0.75 (교수자 정답셋)
- 교수자 카드 `add_to_lesson_plan` 채택률 ≥ 30%
- 학생 보조 자료 클릭률 ≥ 25% (알림 수신자 기준)
- 보조 자료 클릭 후 이탈률 < 15%

**비즈니스**
- 적용 세그먼트 재시청률 -30% (A/B, 2주 관측)
- 학과장 리포트 작성 시간 -50% (이전 수작업 대비)

**UX**
- 교수자 NPS ("강의 설계에 실제 도움이 되나")
- 학생 "주시감" 설문 분기별 < 2.5/5 (Omotenashi 원칙 검증)

#### 01-O. 확장 포인트

- **콘텐츠 타입 확장**: PDF(페이지 체류 +2σ + 하이라이트 클러스터), 라이브(Scenario 05 연계), 실습 코드(에러 발생 지점을 난관으로 매핑).
- **기관 간 메타 비교**: 여러 학교에서 동일 교재·동일 개념 난관이 재현되면 L5 개념 난도 라벨에 반영.
- **교수자 라이브러리**: 유사 개선 7건의 "before/after 영상 클립"을 라이브러리화해 개선안 카드에 링크 첨부.

#### 01-P. 의존성

**선행 필요**
- 이벤트 SDK (P0)
- L1 수집 안정화 (P0)
- L5 개념 그래프 시드 1학과 분량 (D-1 결정 필요)
- xAI 카드 Storybook (P0)

**후속 시나리오에 공유되는 자산**
- `content_struggle_segments` → Scenario 03(질문 쏠림)에서 concept_id 기준 재사용
- 학생 보조 자료 생성 파이프라인 → Scenario 13(자동 노트)와 파이프라인 공유
- k-anonymity·LLM 합성 요약 룰 → 모든 학생 발화 노출 시나리오에 재사용

#### 01-Q. 개발 견적 (러프)

| 역할 | 투입 | 담당 |
|---|---|---|
| FE | 1 FTE × 6주 | 교수자 히트맵 · 학생 우측 패널 카드 · xAI 카드 특수 variant |
| BE | 1 FTE × 6주 | bucket 집계 배치 · 세그먼트 API · 가중치 튜닝 |
| ML | 1 FTE × 8주 | 클러스터링 · 개념 매핑 · 개선안 템플릿(LLM) |
| QA | 0.5 FTE × 4주 | 정답셋 제작 · Recall 검증 |

#### 01-R. 마이크로 페이즈 (서브 릴리즈)

| # | 목표 | 검증 |
|---|---|---|
| 1.1 | 교수자 히트맵만 (추천 없음) | 교수자 주관 판단과 대체로 일치 |
| 1.2 | 난관 세그먼트 + 근거 카드 (개선안 없음) | 교수자 NPS +10 |
| 1.3 | 교수자 개선안 카드 | 카드 액션 채택률 ≥ 30% |
| 1.4 | 학생 우측 패널 보조 자료 | 클릭률 ≥ 25% |
| 1.5 | 개선 전/후 재측정 루프 | 2주 A/B 정상 가동 |

---

### Scenario 02. 개념이 무너지기 전에 복습이 먼저 찾아온다

**페인포인트**
학생: *"2주 전에 배운 신뢰구간이 이미 머리에서 지워졌다. 시험 2주 전인데 교재 어디부터 다시 볼지 모르겠다."*
교수자: *"반 전체가 어느 개념에서 동시에 이탈 중인지 안 보인다. 기말 성적 보고서야 안다."*

**감지**
DKT(Deep Knowledge Tracing)이 개념별 숙달 확률을 갱신하면서, 최근 14일 대비 `p_mastery` 하락폭 ≥ 15%p인 개념은 **"약화 중"** 으로 태깅한다. 동시에 망각 곡선(`concept_forgetting.predicted_retention_today`) < 40% 면 복습 필수 큐에 편입. 같은 약화 개념을 공유하는 수강생이 반의 30% 이상이면 **"반 병목"** 으로 올려 교수자 쪽에도 신호가 간다.

**교수자에게**
주간 뷰 첫 화면에 **반 병목 개념 Top 3**가 뜬다 (개인 명단보다 먼저 — 철학 원칙 #4). 각 병목엔 "다음 강의 도입 5분 복기" 또는 "관련 퀴즈 자동 생성" 액션이 붙는다.

**학생에게**
아침 홈에 **"오늘의 복습 3"** 카드. *"신뢰구간 · 마지막 학습 11일 전 · 현재 예측 정답률 47% · 시험 D-12 · 지금 5분 복습하면 시험 시점 예측 86%."* 카드 눌러 5분짜리 복습 세션 즉시 시작. 세션 끝나면 `meta_cognition_calibration`에 자가 예측 점수도 기록해서 메타인지 정확도가 누적된다.

**데이터 출처**
- 이벤트: `assessment.response.submit`, `content.video.complete`
- 테이블: L3 `concept_mastery`, `concept_forgetting`

**수용 기준**
- 복습 완료 군의 해당 개념 재평가 정답률이 미복습 대비 +15%p (A/B)
- 교수자 주관 병목 판단과 κ ≥ 0.6 일치

---

### Scenario 03. 같은 질문이 쏠릴 때 교수자와 학생이 동시에 알게 된다

**페인포인트**
교수자: *"같은 질문을 메일·오피스 아워·포럼에서 여러 번 따로따로 답한다. 시간 낭비고 학생마다 답이 일정하지 않다."*
학생: *"이미 누가 물어봤을 것 같은데 찾기가 어렵다. 다시 올리면 눈치가 보인다."*

**감지**
최근 7일치 `ai.ask.submit` + `forum.thread.create` 를 임베딩하고 HDBSCAN 클러스터링. 클러스터 규모가 전주 대비 3배 이상 증가하거나, 해당 개념 노드의 정답률이 동시에 하락 중이면 **"쏠림"** 으로 flag. 클러스터별 대표 질문·빈도·미해결율·관련 개념을 산출한다.

**교수자에게**
"주간 인사이트" 탭 — *"이번 주 질문 47건 중 31건이 'Big O 표기법'. 전주 6건 대비 5배."* 카드를 클릭하면 대표 질문 5개가 원문으로 인용되고, "다음 강의 도입 5분 재설명" 캘린더 자동 예약 버튼.

**학생에게**
질문을 타이핑하는 동안, 제출 전에 인라인으로 **"비슷한 질문이 이미 있어요"** 안내. 선배·동기가 받은 답변 2~3개를 먼저 보여주고, 그래도 부족하다고 판단하면 새 질문으로 제출. 같은 질문 반복을 줄이고 부담도 줄인다.

**데이터 출처**
- 이벤트: `ai.ask.submit`, `forum.thread.create`, `forum.reply.create`
- 테이블: L5 `content_graph`

**수용 기준**
- 중복 질문 비율 -40% (쏠림 감지 적용 전후)
- 재설명 권고 채택률 지표 가동

---

### Scenario 04. 마감 직전 몰아치기를 "부담 없이" 잡아준다

**페인포인트**
학생: *"또 마감 전날 밤에 과제한다. 알면서도 못 고친다. 경고 알림은 스트레스만 준다."*
교수자: *"누가 몰아치는지 명단을 받으면 일일이 개입이 부담이다. 낙인 찍고 싶지 않다."*

**감지**
`deadline_behavior.procrastination_idx` 상승 + 최근 14일 `engagement_intensity_daily.active_ms` 하락이 겹치면 risk 상승. `assignment.save_draft`이 마감 H-48 이전에 0건이면 가산점. Risk 스코어에 따라 3단계 에스컬레이션(Omotenashi Nudge).

**학생에게 — 3단계 부드러운 개입**
- **L1 (risk 0.4~0.6)**: "학습 컨디션 체크" 자가진단 카드 — AI가 판정하는 게 아니라 본인이 체크하는 톤.
- **L2 (0.6~0.8)**: Soft Sakura Pink 테마의 **"오늘 15분만 이 과제에 나눠볼까요"** 카드. 캘린더에 15분 블록 1-click 삽입.
- **L3 (>0.8)**: 상담 슬롯 자동 오픈. 학생이 동의 체크해야만 교수자에게 알림이 간다.
- 모든 단계에 **"이 평가가 오판이면 알려주세요" (Mei-waku Care)** 링크 상시.

**교수자에게**
대시보드 첫 화면은 **"반 전체 몰아치기 지수 추이"** 그래프. 개별 학생 명단은 한 번 더 클릭해야 도달 (낙인 방지 UX 강제, 철학 #4).

**데이터 출처**
- 이벤트: `assignment.save_draft`, `assignment.submit`, `learner.session.heartbeat`
- 테이블: L2 `deadline_behavior`, `engagement_intensity_daily`

**수용 기준**
- 학생 설문 "부담감 지수" 분기별 < 2.5 / 5
- L1/L2 수신 후 24시간 내 과제 진입률 측정
- Mei-waku 회수·반영률 공개

---

### Scenario 05. 강의실 안에서 학생 이해가 흔들리는 순간을 실시간 본다

**페인포인트**
교수자: *"강의 중엔 학생이 이해하는지 모른다. 질문은 끝나야 온다. 재설명 타이밍을 놓친다."*
학생: *"손들기 애매하다. 다른 애들은 이해하는 것 같은데 나만 모르는 게 쪽팔리다."*

**감지**
강의실 모드 입장 시 실시간 스트림이 켜진다. `content.doc.page_view` · `content.scroll.depth` · `ai.ask.submit` · 즉석 퀴즈(`assessment.response.submit`)를 WebSocket으로 흘리고, 슬라이드 체류 +1.5σ · 즉석 퀴즈 정답률 < 50% · 직전 5분 질문 클러스터 존재 중 2개 이상이면 "흔들리는 순간" flag.

**교수자에게**
대형 화면에 슬라이드별 **이해도 히트맵**. 특정 슬라이드 클릭 시 팝업 — *"슬라이드 12 '카이제곱 검정' · 평균 체류 3.2분(+2σ) · 관련 질문 8건 · 즉석 퀴즈 41% · 5분 재설명 권장."*

**학생에게**
**익명 "이해 안 됨" 버튼** 상시 제공 (한 손 탭). 누르면 교수자 카운터에 +1, 개인 ID 절대 식별 안 됨. 교수자가 재설명을 시작하면 학생 화면은 **"지금 이 지점 재설명 중"** 앵커로 자동 이동.

**데이터 출처**
- 이벤트: 위 나열
- 실시간: WebSocket `/ws/classroom/{course_id}/live`

**수용 기준**
- 이벤트 → 대시보드 반영 p95 < 3s
- 동시 접속 500명 강의 안정
- 익명성 검증 (개인 ID 리버싱 불가)

---

### Scenario 06. 통학 전철에서도 학습이 끊기지 않는다 (Liner Mode)

**페인포인트**
학생: *"편도 1시간 반 통학인데 앱이 두 손을 요구한다. 지하 구간 들어가면 영상이 끊긴다. 결국 휴대폰 만지작거리다 끝난다."*

**감지**
모바일 + 세로 모드 감지 시 Liner Mode로 자동 전환. 사용자의 통학 패턴(요일·시간대·자주 여는 위치)을 2주간 학습해 **"곧 통학 시간"** 예측. 네트워크 상태 변화(Navigator.connection)를 실시간으로 감지.

**학생에게**
- **One-Hand UI** — 모든 액션 버튼이 하단 80% 영역에 배치. 엄지로 전부 조작.
- **Audio Capsule** — 오늘 할당된 학습 자료를 TTS + 챕터 북마크로 자동 변환. 백그라운드 재생, 잠금 화면 컨트롤 제공.
- **Smart Pre-fetch** — 통학 출발 10분 전에 오늘 분량 자동 캐싱. 지하 구간에서도 이어 본다.

**교수자에게 (간접 가치)**
콘텐츠 소비 **시간대 히트맵** — *"내 강의는 화요일 아침 7:30~8:30 통학 시간에 50% 재생"* → 강의 길이 / 분할 설계에 활용.

**데이터 출처**
- 이벤트: 기기 메타 (공통 헤더) + `content.video.*` + `learner.session.heartbeat`
- 저장: PWA Service Worker 캐시 전략

**수용 기준**
- 네트워크 off 30분 상태에서도 학습 세션 지속
- 엄지 가동 영역 가이드 준수 (자체 체크리스트)

---

### Scenario 07. 학습 이력이 그대로 취업 ES가 된다 (Shukatsu Forge)

**페인포인트**
학생: *"가쿠치카(学生時代に力を入れたこと)에 쓸 이야기가 없다. 공부는 열심히 한 건 맞는데 글로 못 옮긴다. 증빙도 없다."*

**감지**
학기 내내 쌓인 `learning_episode` 중 **"난관 극복 구간"** 을 자동 추출 — 성적 하락 → 개입 → 회복의 연속 세그먼트. 과제·프로젝트·상호평가·자격 배지를 CLR(1EdTech Comprehensive Learner Record) 표준으로 누적. 역량 Radar를 각 강좌의 learning objective에 매핑.

**학생에게**
커리어 섹션 **"가쿠치카 초안"** 기능. 지망 업계 선택 → **"문제 · 행동 · 결과 3단 구조"** 초안 자동 생성. 예시: *"통계학 II에서 중간 62점(하위 20%) → 2개월간 튜터링 12회 출석 · 과제 전량 정시 제출 · 기말 89점(상위 10%)."* 각 근거에 1-click **CLR 검증 링크** 자동 첨부. 산업군에 따라 문체(です·ます / である) 자동 조정.

**교수자에게 (간접)**
졸업생 CLR 품질이 높아질수록 학과의 **취업 연계 지표**(Scenario 11에서 다룸)가 강화 — 입시 홍보·취업처 개척 자료로 활용.

**데이터 출처**
- 테이블: L2 `learning_episode`, L4 `learner_profile`, CLR store

**수용 기준**
- 초안 생성 시 근거 이벤트 ≥ 3건 인용 (미달 시 생성 거부)
- 증빙 1-click 검증 동작
- 학생 만족도 설문 > 3.8 / 5

---

### Scenario 08. 제미에서 선배의 연구가 사라지지 않는다 (Zemi Hub)

**페인포인트**
제미 학생: *"선배 연구가 졸업과 함께 사라진다. 매년 비슷한 조사를 반복한다. 회의록은 아무도 안 남긴다."*
지도교수: *"제미 지도에 시간은 많이 드는데 아카이빙 체계가 없다."*

**감지 · 처리**
제미 미팅 녹음 → Whisper + Speaker Diarization으로 **Zemi Minutes** 자동 생성 (핵심 논점·다음 과제 추출). 현재 연구 주제 임베딩 vs 과거 제미 산출물 벡터 비교 → **Inheritance Graph**(선배 연구 top-k 추천). 교수·선배 대상 이메일 작성 시 **경어 어시스턴트**가 비즈니스 경어를 검증.

**후배 학생에게**
"연구 주제 등록" 시 자동으로 **"선배 연구 3건 추천"** 카드 — *"2023년 田中 선배가 동일 개념 노드 3개 · 공통 인용 논문 5편이 겹치는 연구를 했어요."* 열람 요청 1-click.

**지도교수에게**
제미별 **Inheritance Graph 시각화**로 "이 연구실의 지식 자산 누적 궤적"을 대시보드에서 확인. 신규 주제 제안 시 자동으로 중복 체크.

**데이터 출처**
- 별도 테넌트: Zemi 네임스페이스 (코스와 분리)
- 이벤트: Zemi Minutes 업로드 · `forum.thread.create` (제미용)
- 저장: L5 Content Graph에 제미 CASE 노드로 편입

**수용 기준**
- 미니츠 핵심 논점 재현율 > 80%
- Inheritance 추천 클릭률 지표 가동

---

### Scenario 09. 채점 일관성이 흔들리는 걸 자기도 모르게 잡는다

**페인포인트**
교수자: *"오전엔 후하게, 오후엔 짜게 주고 있다는 걸 본인이 모른다. 학생이 부당하게 느껴도 말을 꺼내지 못한다."*
학생: *"왜 내 점수가 이렇게 나왔는지 모른다. 옆 친구는 비슷한 답을 썼는데 나보다 5점 높다."*

**감지**
`instructor.grading.submit` 이력에서 시간대별 평균 drift 계산. 동일 과제 내 순서별 drift(앞쪽 답안이 더 관대한 경향). 유사 답안 k-NN 추천 점수 vs 실제 부여 점수 편차.

**교수자에게**
채점 화면 우측 패널에 **추천 점수**와 xAI 카드 — *"78점 권장. 루브릭 5/6 충족 · 유사 답안 12개 평균 76점 · 현재 오전 대비 오후 -9점 drift 진행 중, 재검토 권장."* 수락/거부 한 번 클릭.

**학생에게 (간접)**
성적 공개 후 **"이 점수는 어떻게 나왔나요?"** 링크 — 루브릭 항목별 평가 내역과 익명화된 유사 답안 대비 내 위치를 투명하게 공개. 불만이 있으면 Mei-waku Care로 이의 제기.

**데이터 출처**
- 이벤트: `instructor.grading.submit`, `instructor.feedback.write`
- 테이블: L6 `grading_pattern`

**수용 기준**
- 동일 답안 블라인드 재채점 시 편차 < 3점
- 학생 이의 제기 건수·반영률 공개

---

### Scenario 10. 장기 이탈 조짐은 "반 단위"로 먼저 본다 (Early Warning + Omotenashi)

**페인포인트**
교수자: *"학기 중반에 무너지는 학생을 나중에 알면 만회할 시간이 없다. 그렇다고 데이터로 '위험 학생' 찍어서 부르는 건 부담이다."*
학생: *"내 행동이 계속 감시당하는 느낌이 싫다. 잘못한 것도 없는데 주시받는 기분."*

**감지**
2주 단위 행동 변화(로그인 -N% · 과제 지연 횟수 · 포럼 질문 빈도) · 개념 숙달 정체 · 사회 지표(포럼 응답 무, 그룹 참여 0) feature를 Gradient Boosting으로 스코어링. Label은 과거 학기 D 이하 수렴자의 2주 전 feature. SHAP로 상위 3개 이유를 뽑아 교수자에게 표시.

**교수자에게 (낙인 방지 UX 강제)**
- 첫 화면엔 **"반 전체 공통 병목 개념 Top 3"** 만 뜬다. 개인 명단은 2 클릭 이하로 접근 불가.
- 개별 학생 데이터 열람 시 **목적(purpose) 입력 필수** → `instructor.data_access` 감사 로그에 기록 (APPI 대응).
- 개입 옵션은 "1:1 면담 제안" · "Pace Coach 자동 발송 (S-03)" · **"무개입"** 세 가지. 무개입도 명시적 선택지로 제공.

**학생에게**
- UI에 "위험" 단어 금지
- Omotenashi 3단계 에스컬레이션(Scenario 04 참조)으로만 접촉
- Mei-waku Care 링크 상시

**관리자에게**
학과 단위 위험 분포 · 개입 효과 ROC만 공개. 개인 식별 불가능한 집계 레벨로 제한.

**데이터 출처**
- 이벤트: 세션 · 과제 · 포럼 · 평가 전반
- 감사: `instructor.data_access` (열람 목적 필수)

**수용 기준**
- Recall ≥ 0.7 (D 이하 학생 탐지)
- 개입 후 4주 active_ms 회복률 지표 존재
- 학생 설문 "주시감" 분기별 < 2.5 / 5
- 열람 감사 로그 100% 남음

---

### 확장 예정 시나리오 (상세화 대기)

각 Phase 진입 시점에 위 포맷으로 풀 스펙을 작성한다. 지금은 핵심 한 줄씩만.

| # | 시나리오 | 페인포인트 한 줄 | 주 입력 | 주 출력 |
|---|---|---|---|---|
| 11 | 학과 역량 그래프와 취업 연계 | "우리 학과 졸업생이 뭘 할 수 있는 사람들인지 모른다" | CLR 누적 + 역량 Radar | 학과장 리포트 + 취업처 제공용 시각화 |
| 12 | 개인화 시험 대비 예상 문제 | "뭘 공부해야 시험에 나올지 감이 없다" | 과거 시험 패턴 + 강의 강조(교수자 키워드 빈도) + 약점 | 학생별 예상 문제 세트 + 출제 가능성 % |
| 13 | 동료 학습 매칭 | "혼자 공부하는 게 지친다. 스터디 파트너가 서로 보완되면 좋겠다" | 보완 지식 상태 + 시간대 가용성 | 파트너 추천 + 가용 시간 교차 |
| 14 | 자동 학습 노트 생성 | "강의마다 요약 정리에 시간이 너무 든다" | 자막 + 본인 형광펜 + 약점 개념 | 개인화 요약 노트 (PDF/Markdown) |
| 15 | 콘텐츠 효과성 ROI | "내가 만든 영상 vs PDF 중 어느 쪽이 더 효과가 좋은지 모른다" | 참여 강도 + 사후 평가 점수 변화 | 콘텐츠별 ROI 매트릭스 |
| 16 | 강의자료 개선 제안 | "내 자료의 어느 부분을 고쳐야 하는지 모른다" | 학내 우수 자료 비교 + 이탈 구간 | 슬라이드별 개선 포인트 |
| 17 | 자원 배분 최적화 | "TA 배정, 강의실 배정이 주먹구구" | 이수 인원 · 난이도 · 질문량 | 배치 제안 |
| 18 | 자퇴·휴학 선행 지표 | "조기 경고보다 더 이른 신호를 원한다" | 다학기 누적 행동·성적 | 학과 지원팀 알림 |

---

## 3. 공통 자산 (References)

시나리오가 참조하는 공통 인프라. 시나리오 설계 시 이 섹션의 이벤트명·테이블명을 그대로 인용한다.

### 3-1. 이벤트 카탈로그

**공통 헤더**

```json
{
  "event_id": "uuid",
  "event_name": "content.video.play",
  "timestamp": "ISO8601 (ms)",
  "actor": { "user_id": "uuid", "role": "learner|instructor|admin" },
  "context": {
    "session_id": "uuid",
    "tenant_id": "string",
    "course_id": "uuid",
    "content_id": "uuid or null",
    "device": { "type": "web|mobile|tablet", "os": "string", "ua": "string" }
  },
  "payload": { /* 이벤트별 */ },
  "xapi_verb": "http://adlnet.gov/expapi/verbs/..."
}
```

**수집 SDK**: 웹/모바일 공통 TS SDK. 배치 전송(30초 또는 50건) + 실패 시 IndexedDB/SQLite 재시도 큐.
**엔드포인트**: `POST /xapi/statements` (xAPI 1.0.3 호환).
**거부 조건**: 인증 실패 · 스키마 미스매치 · rate limit(유저당 500/min) 초과.

**핵심 이벤트**

| 이벤트명 | 트리거 | 주요 payload | 저장소 | 유지 |
|---|---|---|---|---|
| `learner.session.start` | 로그인 후 첫 렌더 | entry_url | L1 | 13개월 |
| `learner.session.heartbeat` | 활성 30초마다 | active_seconds, focused | L1 | 3개월 |
| `ui.page.view` | SPA route change | path, referrer | L1 | 6개월 |
| `ui.search.query` | 내부 검색 | query, result_count | L1 | 13개월 |
| `content.video.play` | video.play() | content_id, position_s | L1 | 13개월 |
| `content.video.pause` | video.pause() | position_s, reason | L1 | 13개월 |
| `content.video.seek` | 타임바 이동 >3s | from_s, to_s | L1 | 13개월 |
| `content.video.rate_change` | 배속 변경 | rate | L1 | 13개월 |
| `content.video.complete` | ended 또는 95% | duration_s | L1 | 13개월 |
| `content.doc.page_view` | 문서 페이지 진입 | page_no, view_ms | L1 | 13개월 |
| `content.doc.highlight` | 드래그+저장 | page_no, text, color | L2 | 졸업+1년 |
| `content.note.create` | 인라인 노트 저장 | anchor, text | L2 | 졸업+1년 |
| `content.scroll.depth` | 5% 단위 진입 | max_depth_pct | L1 | 6개월 |
| `assessment.attempt.start` | 퀴즈 시작 | assessment_id | L1 | 13개월 |
| `assessment.response.submit` | 문항 제출 | item_id, response, time_ms, changes, hint_used | L1 | 졸업+1년 |
| `assessment.attempt.submit` | 전체 제출 | attempt_id, score | L1 | 졸업+1년 |
| `ai.ask.submit` | AI 패널 질의 | query, context_anchor | L1 | 13개월 |
| `ai.response.delivered` | AI 응답 완료 | response_id, sources[], confidence | L1 | 13개월 |
| `ai.card.feedback` | 카드 👍/👎 | card_id, polarity, note | L1 | 13개월 |
| `assignment.save_draft` | 과제 임시저장 | assignment_id, len | L1 | 6개월 |
| `assignment.submit` | 과제 제출 | assignment_id, late_h | L1 | 졸업+1년 |
| `forum.thread.create` | 포럼 글 | thread_id, tags | L1 | 졸업+1년 |
| `forum.reply.create` | 답변 | thread_id, reply_id | L1 | 졸업+1년 |
| `peer.review.submit` | 상호평가 | target_user_id, scores | L1 | 졸업+1년 |
| `instructor.grading.submit` | 채점 확정 | submission_id, score, time_ms | L1 | 졸업+1년 |
| `instructor.feedback.write` | 피드백 저장 | submission_id, text_len, tone | L1 | 졸업+1년 |
| `instructor.content.publish` | 강의자료 게시 | content_id, version | L1 | 무기한 |
| `instructor.data_access` | 학생 개인 데이터 열람 | target_user_id, purpose | audit_log | 5년 |
| `inference.knowledge_state.update` | DKT 결과 갱신 | concept_id, p_mastery, delta | L3 | 현재값 |
| `inference.risk_flag.raise` | 주간 배치 | user_id, score, reasons[] | L3 | 2년 |

### 3-2. 데이터 레이어

| Layer | 기술 | 역할 |
|---|---|---|
| L1 Raw Event | ClickHouse 또는 BigQuery | 원시 이벤트 시계열 |
| L2 Aggregated | PostgreSQL | 학습 에피소드·참여 강도·학습 리듬·마감 행동 |
| L3 Knowledge State | PostgreSQL + Redis | 개념 숙달 확률·망각·선수 의존·메타인지 |
| L4 Learner Profile | PostgreSQL | 장기 학습 스타일·인지 부하·끈기 지표 |
| L5 Content Knowledge Graph | Neo4j 또는 pgvector | 개념 노드·선후 관계·평가 매핑 (CASE 표준) |
| L6 Instructor Behavior | PostgreSQL | 채점 패턴·피드백 스타일·콘텐츠 편집 이력 |

**주요 테이블**

- L2: `learning_episode`, `engagement_intensity_daily`, `rhythm_profile`, `deadline_behavior`
- L3: `concept_mastery`, `concept_forgetting`, `concept_dependency_hit`, `meta_cognition_calibration`
- L4: `learner_profile`
- L6: `grading_pattern`, `feedback_style`, `content_edit_history`

### 3-3. xAI 카드 컴포넌트 표준

모든 AI 출력은 동일 컴포넌트로 렌더링한다.

```tsx
<XaiCard
  kind="insight | recommendation | answer | alert"
  tone="neutral | gentle"           // gentle = Omotenashi 모드 (학생 UI 기본)
  title="약점 개념 발견"
  body="통계학 III '신뢰구간' 숙달 32%"
  evidence={[
    { type: "event", ref: "assessment.response.submit/..." },
    { type: "aggregate", ref: "concept_mastery/user/stat-03" },
  ]}
  reasoning="최근 14일 18문항 중 정답 6개, 선수 '표준편차' 41%"
  confidence={{ value: 0.82, method: "bkt_posterior" }}
  comparison={{ cohort: "동일 코스 수강생", delta: -0.18 }}
  actions={[
    { label: "표준편차 5분 복습", dispatch: "scenario/adaptive_review" },
  ]}
  feedback={{ onThumbs }}
  meiwaku={{ onReport }}            // 이의 제기 링크 상시
/>
```

**CI 검증 규칙**
- `evidence.length === 0` → 빌드 실패
- `confidence.value` 누락 → 렌더 skip + Sentry 알림
- `actions.length === 0` → 정보성 카드만 허용
- 학생 role 컨텍스트에서 `tone="neutral"` → 빌드 경고

### 3-4. 3단 UX 구조

**데스크탑 (≥1280px)**
```
┌────────┬──────────────────────┬────────────┐
│  SNB   │      CONTENT         │  AI PANEL  │
│ 240px  │        1fr           │   360px    │
└────────┴──────────────────────┴────────────┘
```

**태블릿 (768~1279)**: SNB 64px 아이콘 모드 / AI PANEL 오버레이.
**모바일 (<768px) = Liner Mode**: SNB 햄버거 / CONTENT 풀스크린 / AI PANEL 플로팅 버튼 + 바텀시트.

**AI 패널 탭**: `Ask` · `Insight` · `Plan` · `Reflect`.

### 3-5. 시스템 아키텍처

```
[Client: Web/Mobile]
     │ (TS Event SDK)
     ▼
[Event Gateway]  ── schema / rate limit / auth
     │
     ▼
[Kafka: events.raw]
     │
     ├──► Stream processor  →  L3 online 근사 (BKT)
     └──► Airflow nightly   →  L2/L4/L6 집계 + DKT 재학습

Storage
 L1: ClickHouse
 L2/3/4/6: PostgreSQL + Redis
 L5: Neo4j + pgvector
 ML Registry: MLflow
 LLM: Azure OpenAI Japan East (1차) / Bedrock Tokyo (fallback)

[API Gateway] (gRPC 내부 / REST 외부)
 ├─ LMS Core (GROWA)
 ├─ LRS (Lecognizer) — xAPI Statements
 ├─ Inference Service
 ├─ xAI Service — Evidence 조립
 └─ LLM Orchestrator — RAG
```

**배포**: 일본 리전(AWS Tokyo 또는 GCP asia-northeast1), 학교 단위 테넌트 격리 (DB schema).
**관측**: OpenTelemetry + Grafana + Sentry.

---

## 4. 거버넌스 (APPI 체크리스트)

| 요구 | 구현 |
|---|---|
| 목적 명시·최소 수집 | 이벤트마다 `purpose` 태그, 런타임 중단 스위치 |
| 학습자 열람·삭제권 | `GET /me/data`, `POST /me/data/delete` (30일 내 완전 삭제) |
| 교수자 접근 로그 | `instructor.data_access` 필수, purpose 없으면 401 |
| AI 결정 감사 | `inference.*` 이벤트 2년 보존, 모델 버전으로 재현 가능 |
| 데이터 주권 | 일본 리전 저장, 국외 이전 시 학교별 동의 필수 |
| 동의 관리 | 기능별 opt-in, 기본은 최소 세트 |
| Mei-waku 권리 | 모든 AI 판단에 이의 제기 링크 상시 보장 |

---

## 5. 개발 우선순위 (Phased Build)

| Phase | 기간 | Exit Criteria | 포함 시나리오 |
|---|---|---|---|
| **P0 인프라** | M0–M3 | 이벤트 SDK 가동 · L1 수집률 99%+ · xAI 카드 Storybook 100% | — |
| **P1 MVP** | M3–M9 | 1학과 1학기 데이터로 S01/S05/S02 시연 | S01, S02, S05 |
| **P2 차별화** | M9–M15 | S04 + S10 결합 · S03 운영 | S03, S04, S10 |
| **P3 일본 특화** | M15–M24 | S06·S07·S08·S09 학내 파일럿 | S06, S07, S08, S09 |
| **P4 기관 확장** | M24+ | 다학기 데이터 기반 확장 시나리오 | S11~S18 |

**규칙**: MVP 시점부터 xAI 카드는 필수. 추후 추가 금지.

---

## 6. 미결·선제 결정 (Open Decisions)

| ID | 결정 대상 | 현재 안 | 결정 시점 |
|---|---|---|---|
| D-1 | L5 초기 시드 전략 | SME 수작업 + GNN 추천 → 교수 승인 | 1호 고객 확정 시 |
| D-2 | 숙달 모델: BKT vs DKT | MVP BKT, 1학기 후 DKT | P1 종료 |
| D-3 | LLM 공급자 | Azure Japan East 1차 · Bedrock Tokyo fallback | P0 종료 전 |
| D-4 | 학사 시스템 연동 | LTI 1.3 advantage 우선 · 레거시는 SAML+CSV | 고객별 |
| D-5 | Zemi Hub 과금 | 학과 라이선스 vs 교수 애드온 | 파일럿 결과 |
| D-6 | Omotenashi 에스컬레이션 임계 | 베이스라인 후 학교별 튜닝 | P2 진입 |

---

## 7. 다음 액션

- [ ] 10개 핵심 시나리오 각각 **스토리보드 2~3 컷** 시안 제작 (제안서 삽입용)
- [ ] 확장 예정 시나리오(S11~S18) 중 영업 우선 2~3개 선정해 풀 스펙 작성
- [ ] 이벤트 카탈로그를 AsyncAPI YAML로 공식화 (`spec/events/`)
- [ ] xAI 카드 Storybook 먼저 완성 후 시나리오 구현 착수
- [ ] 학과 시드용 L5 개념 그래프 샘플 제작(1학과 분량) — 개발 픽스처로 사용
- [ ] APPI 체크리스트 법무 검토 확정

---

> **이 문서의 본질**
> 기능 카탈로그가 아니라 **"교수자와 학생이 매일 만나는 순간"** 을 설계한다.
> 모든 순간에는 데이터가 있고, 데이터에는 근거가 있고, 근거에는 행동이 붙는다. 그게 다른 LMS와의 전부다.
