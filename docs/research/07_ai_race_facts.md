# 07. AI MODEL RACE — 스테이지별 사실 자료 (AI Race Facts)

작성일 2026-09-12. 기계 판독용 데이터: `src/data/people_ai.js` (`PEOPLE_AI`, `VIDEOS_AI`).

## 검증 방법 (How this was verified)
- 날짜·숫자는 1차 출처(논문 arXiv 페이지, 기업 공식 블로그·뉴스룸)를 우선하고, 없으면 영문 Wikipedia와 날짜가 붙은 뉴스 헤드라인(Google News RSS)으로 교차 확인했다. 각 항목 끝의 `[n]`은 아래 출처 번호.
- 2026년 사실 중 1차 출처를 직접 열지 못한 것은 **(미확인)** 또는 "(Wikipedia 기재, 1차 출처 미확인)"으로 표시했다. 추측으로 채운 항목은 없다.
- 모든 YouTube videoId는 `https://www.youtube.com/oembed?url=https://www.youtube.com/watch?v=ID&format=json` 호출로 제목·채널이 반환되는지 확인했다(맨 아래 표는 그 응답을 그대로 적은 것).
- 이 세션은 WebSearch 한도가 소진되어 WebFetch(페이지 직접 열기)와 YouTube 검색 결과 페이지 파싱만 사용했다.

---

## A1. AlphaGo vs 이세돌 (March 2016, Seoul)

**날짜·장소**: 2016-03-09 ~ 03-15, 서울 포시즌스 호텔. 5번기, AlphaGo **4–1** 승(5국 모두 불계). 상금 100만 달러(DeepMind가 유니세프·바둑 단체에 기부), 이세돌은 참가비 15만 + 1승 2만 달러. [1]

**핵심 숫자**
- 2국 **Move 37**(AlphaGo 37수): 해설 마이클 레드먼드 9단이 "creative", "unique"라고 평한, 프로가 두지 않을 어깨짚기. 이세돌이 이례적으로 오래 생각했다. [1]
- 4국 **Move 78**(이세돌 78수): 구리 9단이 **"神의 한 수(divine move)"** 라 부른 중앙 끼움수. 이 판이 인간의 유일한 승리. [1]
- 대국 후 한국기원은 AlphaGo에 **명예 9단**을 수여. [1]
- **하드웨어**: Nature 2016 논문(2016-01-28 게재)의 분산 버전은 **1,202 CPU + 176 GPU**(40 스레드, Elo 3,140); 64 스레드 구성은 1,920 CPU + 280 GPU(Elo 3,168). 단일 머신은 48 CPU + 8 GPU(Elo 2,890). **주의**: 이 수치는 2015년 10월 판후이전 시점의 "AlphaGo Fan"이고, 이세돌전의 "AlphaGo Lee"는 Wikipedia 버전표 기준 **TPU 48개(분산)**, Elo 3,739로 기록돼 있다. 대국 서버는 미국의 Google Cloud에 있었다. [1][2]
- **판후이전**: 2015-10, 5–0. 핸디캡 없는 풀사이즈 반상에서 프로를 이긴 최초의 프로그램. [2]
- **AlphaGo Master**: 2017-05 커제 9단에 3–0(Future of Go Summit). 중국기원 프로 9단 수여. TPU 4개 단일 머신. [2]
- **AlphaGo Zero**: 2017-10-19 Nature. 인간 기보 없이 자기대국만으로 학습, TPU 4개 단일 머신. **3일** 만에 AlphaGo Lee를 **100–0**, 21일 만에 Master 수준. 논문 공저자에 판후이 포함. [2][3]
- **AlphaZero**: 2017-12. 바둑·체스·쇼기를 하나의 알고리즘으로 24시간 안에 초인간 수준. [2]

**쉬운 말로 3–5가지**
1. AlphaGo는 사람 기보를 보고 배운 뒤(지도학습), 자기 자신과 수백만 판을 두면서(강화학습) 더 강해졌다.
2. "다음 수 후보를 고르는 정책망 + 형세를 점치는 가치망 + 트리 탐색"의 조합이다.
3. 인간이 "이상하다"고 느낀 37수는 나중에 명수로 평가됐다. AI가 사람이 못 보던 수를 찾은 상징적 순간.
4. 그 다음 해의 AlphaGo Zero는 사람 기보를 전혀 안 보고도 훨씬 강해졌다. "데이터보다 컴퓨트+자기대국"이라는 교훈.

**재미있는 검증 가능 사실**: 이세돌은 2019-11-19 은퇴를 발표하며 "제가 1위가 되더라도 **이길 수 없는 존재가 있다**"고 말했다. 은퇴 대국 상대는 NHN의 AI **한돌(HanDol)**, 결과 1–2(첫 판은 접바둑으로 승). [1][3]

**하드웨어 요약**: AlphaGo Fan 1,202 CPU/176 GPU(분산) → AlphaGo Lee 48 TPU → Master/Zero 4 TPU. 버전이 올라갈수록 컴퓨트는 줄고 실력은 늘었다. [2]

**왜 중요한가**: 바둑은 "AI가 수십 년 못 풀 것"이라던 게임이었다. 이 대국이 한국·중국·미국의 AI 투자와 여론을 한 번에 바꿨고, GPU/TPU 클러스터로 신경망을 키우는 방식이 주류가 됐다.

---

## A2. 딥러닝의 도약: AlexNet(2012) → ResNet(2015), GPU가 엔진이 되다

- **AlexNet**: Alex Krizhevsky, Ilya Sutskever, Geoffrey Hinton(토론토대). ILSVRC-2012 제출 2012-09-30. **top-5 오류 15.3%**, 2위(26.2%)보다 10.8%p 앞섬. **NVIDIA GTX 580(3 GB) 2장**으로 5–6일 학습. 파라미터 **6,000만**, 뉴런 65만. 논문 인용 19.8만 회 이상(2025 초). [4]
- **ImageNet**: 페이페이 리가 2007년 시작. 1,400만 장 이상, 2.2만 카테고리. [4]
- **DNNresearch**: 2012년 힌턴·크리제브스키·수츠케버가 세운 회사를 2013-03 Google이 4,400만 달러에 인수. [5]
- **ResNet**: Kaiming He 외(Microsoft Research), arXiv 2015-12-10. **152층**, ImageNet top-5 오류 **3.57%**, ILSVRC 2015 1위. "잔차(residual) 연결"로 아주 깊은 망을 학습 가능하게 함. [6]
- **GPU가 엔진이 된 이유**: 신경망 학습은 거대한 행렬곱의 반복이고, GPU는 수천 개 코어로 이를 병렬 처리한다. AlexNet이 게임용 GPU 2장으로 대학 연구실에서 이긴 것이 "GPU = 딥러닝 하드웨어"의 출발점. 이후 CUDA/cuDNN 생태계가 NVIDIA 독주를 만들었다. (챕터 01 GPU 구조 참조)

**재미있는 검증 가능 사실**: 힌턴은 2018 튜링상(르쿤·벤지오와 공동)과 2024 노벨 물리학상(John Hopfield와 공동, 2024-10-08 발표)을 모두 받았고, 2023-05 Google을 떠나 AI 위험을 공개적으로 말하기 시작했다. [5]

**왜 중요한가**: "데이터(ImageNet) + 알고리즘(CNN) + 컴퓨트(GPU)"의 삼각형이 처음 맞물린 사건. 오늘날 모든 LLM 경쟁의 원형.

---

## A3. "Attention Is All You Need" (2017) → BERT (2018)

- **논문**: Vaswani, Shazeer, Parmar, Uszkoreit, Jones, Gomez, Kaiser, Polosukhin — **8명**(Google Brain/Google Research, Gomez는 토론토대). arXiv 1706.03762, 2017-06. 제목의 뜻: 순환(RNN)·합성곱 없이 **어텐션만으로** 번역 모델을 만든다. [7]
- **하드웨어(5.2절)**: **NVIDIA P100 8장** 1대. base 모델 10만 스텝 **12시간**, big 모델 30만 스텝 **3.5일**. WMT14 En-De BLEU 28.4, En-Fr 41.8. [7]
- **BERT**: Devlin 외(Google), arXiv 1810.04805, 2018-10-11. 양방향 Transformer 사전학습, 11개 NLP 태스크 SOTA, GLUE 80.5. [8]
- **저자들의 이후**: 8명 전원 Google을 떠났다. Vaswani → Adept, Essential AI(2026-06 NVIDIA에 acqui-hire, Wikipedia 기재); Shazeer → Character.AI, 2024-08 Google 복귀(27억 달러 라이선스 계약)해 Gemini 공동 리드, 2026-06 OpenAI 합류 발표(Wikipedia 기재, 1차 출처 미확인). [9][10]

**쉬운 말로**: 어텐션은 "문장의 각 단어가 다른 어떤 단어를 얼마나 봐야 하는지"를 한 번에 계산한다. 순서대로 읽을 필요가 없어 GPU 병렬화에 딱 맞고, 그래서 크기를 키우기 쉽다. GPT의 T가 이 Transformer.

**재미있는 검증 가능 사실**: GPT-3(2020)가 수천 장의 GPU를 썼는데, 그 원형인 Transformer는 GPU **8장, 3.5일**이면 됐다. [7]

**왜 중요한가**: 이후 GPT, BERT, Claude, Gemini, Llama, ViT, AlphaFold 2까지 거의 모든 최신 모델이 이 구조 위에 있다.

---

## A4. GPT 계보 (OpenAI)

| 모델 | 날짜 | 파라미터/특징 | 출처 |
|---|---|---|---|
| GPT-1 | 2018-06-11 | **1억 1,700만**, 12층 디코더, BookCorpus | [11][12] |
| GPT-2 | 2019-02-14 | **15억**, WebText 40 GB(800만 웹페이지). 처음엔 "위험하다"며 단계 공개 | [11] |
| GPT-3 | 2020-05-28 | **1,750억**. Microsoft가 OpenAI용으로 지은 Azure 슈퍼컴퓨터(2020-05-19 발표): **CPU 코어 28.5만 개 이상, GPU 1만 장**, 서버당 400 Gbps, TOP500 기준 5위권 | [11][13] |
| ChatGPT | **2022-11-30** | GPT-3.5 기반. 5일 만에 100만 사용자, **2개월 만에 월 1억 사용자**("역사상 가장 빨리 성장한 소비자 앱", UBS 추정) | [14] |
| GPT-4 | 2023-03-14 | 파라미터 비공개. 멀티모달(이미지 입력) | [11][14] |
| GPT-4o | 2024-05 | 음성·이미지·텍스트 실시간("omni") | [14] |
| o1 | 2024-09-12 프리뷰 / 2024-12-05 정식 | "생각하고 답하는" 추론 모델의 시작 | [14] |
| o3 | 2024-12-20 발표 / 2025-04-16 출시 | 추론 모델 2세대 | [14] |
| GPT-4.5 | 2025-02 | 대형 비추론 모델 | [14] |
| **GPT-5** | **2025-08-07** | 빠른 모델 + 깊은 추론 모델 + 실시간 **라우터**(OpenAI 시스템 카드) | [15] |
| GPT-5.1 / 5.2 | 2025-11 / 2025-12 | (Wikipedia 기재) | [14] |
| GPT-5.4 / 5.5 / 5.6 | 2026 | 존재는 Wikipedia 모델 목록에 기재, 날짜 **(미확인)** | [15] |
| GPT-6 "Astra" | 2026-09-03 제한 프리뷰 / 09-04 일반 공개 | Wikipedia 기재; OpenAI 공지 "Path to Astra"(2026-09-01) 인용. openai.com 직접 확인 실패(403) → **1차 출처 미확인** | [16] |

- 사용자 수: ChatGPT 주간 활성 사용자 **9억 명**(2026-02, Wikipedia 기재). [14]
- 하드웨어: GPT-3는 V100 세대 Azure 클러스터(위 1만 GPU), GPT-4는 A100(비공개, 2차 보도), 이후는 H100/GB200과 Stargate(아래 A6 에너지 항목). GPT-4 이후 GPU 수는 공식 미공개 → **(미확인)**.

**쉬운 말로**: 같은 구조를 데이터·컴퓨트만 키워도 성능이 올라간다는 걸 GPT-2→3가 보여줬고, ChatGPT는 그걸 채팅 UI + RLHF로 포장해 대중화했다. o1부터는 "답하기 전에 생각하는 시간"에도 컴퓨트를 쓴다.

**재미있는 검증 가능 사실**: OpenAI 엔지니어들은 ChatGPT가 "그렇게 성공할 줄 몰랐다"(Wikipedia 인용). 출시 2개월 만에 1억 명은 TikTok(9개월)·Instagram(2.5년)보다 빠른 기록. [14]

---

## A5. Claude / Anthropic

- **창업**: 2021-01, 샌프란시스코, 공익법인(PBC). OpenAI 출신 **다리오 아모데이(CEO)·다니엘라 아모데이(사장)** 남매와 Jack Clark, Jared Kaplan, Chris Olah, Sam McCandlish, Tom Brown, Ben Mann 등 7명이 공동 창업. [17]
- **Constitutional AI**: arXiv 2212.08073, **2022-12-15**(제1저자 Yuntao Bai). 사람이 일일이 채점하는 대신 "헌법(원칙 목록)"을 기준으로 AI가 스스로 답을 비평·수정(RLAIF). [18]
- **모델 타임라인** (Wikipedia 기반, 2026 항목은 Anthropic 뉴스룸 확인): [19][20]
  - Claude 1 — 2023-03-14 · Claude 2 — 2023-07-11 · Claude 2.1 — 2023-11-21
  - Claude 3 (Haiku/Sonnet/Opus) — **2024-03-04**
  - Claude 3.5 Sonnet — **2024-06-20** · 3.5 Sonnet(new)/3.5 Haiku — 2024-10-22
  - Claude 3.7 Sonnet — 2025-02-24
  - **Claude Opus 4 / Sonnet 4 — 2025-05-22**
  - Opus 4.1 — 2025-08-05 · Sonnet 4.5 — 2025-09-29 · Haiku 4.5 — 2025-10-15 · Opus 4.5 — 2025-11-24
  - Opus 4.6 — 2026-02-05 · Sonnet 4.6 — 2026-02-17 · Opus 4.7 — 2026-04-16 · Opus 4.8 — 2026-05-28 (Wikipedia 기재)
  - Claude Mythos 5 / Fable 5 — 2026-06-09 · Sonnet 5 — 2026-06-30 (Wikipedia 기재)
  - **Claude Opus 5 — 2026-07-24** (Anthropic 뉴스룸 "Introducing Claude Opus 5" 확인)
  - **Claude Fable 5.1 / Mythos 5.1 — 2026-09-01** (Anthropic 뉴스룸 "Introducing Claude Fable 5.1 and Claude Mythos 5.1" 확인) — **2026-09-12 기준 최신**
- **투자·규모**(Wikipedia 기재): Amazon 총 80억 달러(2023 12.5억 + 2024 40억), Google 20억+10억. 2026-05 Series H 기업가치 **9,650억 달러**. 2025 매출 45억 달러, 2026 직원 약 2,500명. 2026-06 IPO 신청. 2025년 작가 저작권 소송 15억 달러 합의. [17]
- 하드웨어: Anthropic은 Google TPU·AWS Trainium·NVIDIA GPU를 혼용한다고 알려져 있으나 모델별 GPU 수는 비공개 → **(미확인)**. xAI Colossus 1이 2026년 중반 "대부분 Anthropic에 임대"됐다는 Wikipedia 기재 있음(1차 출처 미확인). [21]

**쉬운 말로**: Anthropic은 "안전 연구가 최전선 모델을 만들어야 한다"는 명제로 시작했고, Constitutional AI는 그 방법론. 모델 이름은 크기 순으로 Haiku < Sonnet < Opus, 2026년에 Fable/Mythos 티어가 추가됐다.

**재미있는 검증 가능 사실**: 아모데이 남매는 OpenAI에서 GPT-2/3 연구(다리오)와 안전·정책(다니엘라)을 맡았던 사람들. 이 문서를 만든 모델도 Claude(Fable 5.1)다.

---

## A6. 더 넓은 경주: Gemini · Llama · Grok · DeepSeek · Mistral · 한국 모델 · 스케일링 · 에너지

### Google Gemini [22]
- Bard 2023-03 → **Gemini 1.0 2023-12-06**(Ultra/Pro/Nano) → **Gemini 1.5 2024-02-15**(MoE, **컨텍스트 100만 토큰**, 연구에선 1,000만까지) → Gemini 2.0 Flash 2024-12-11 발표 → **Gemini 2.5 Pro 2025-03-25**(LMArena 1위 데뷔) → **Gemini 3 2025-11-18**(3 Pro / Deep Think) → 3.1 Pro 2026-02-19, 3.5 Flash 2026-05-19, 3.8 Flash 2026-09-02 (2026 항목 Wikipedia 기재).
- 하드웨어: Google 자체 **TPU**로 학습·서빙(세대별 수량 비공개).

### Meta Llama [23][24]
- LLaMA 1 2023-02-24(연구용) → Llama 2 2023-07-18(상업 허용 오픈 웨이트) → Llama 3 2024-04-18 → **Llama 3.1 405B 2024-07-23**: Meta 블로그 "**H100 1만 6천 장 이상**으로 **15조 토큰** 이상 학습", 128K 컨텍스트 → Llama 3.2/3.3(2024) → Llama 4 Scout/Maverick 2025-04-05(MoE) → 2026-04 "Muse Spark"를 Llama 후속으로(Wikipedia 기재, 미확인).
- "오픈소스"라는 표현은 OSI가 라이선스 제한을 이유로 인정하지 않는다.

### xAI Grok & Colossus [21][25]
- **Colossus 1**(멤피스, 옛 Electrolux 공장): **H100 약 10만 장, 122일 만에 구축**(2024). 이후 H200/B200 추가, 20만 장 규모로 확장. **Colossus 2** 2026-01경 가동, GB200급 약 11만 장 + GB300. 2026 중반 두 사이트 합산 **약 1 GW**. 가스터빈·미시시피 1.2 GW 발전소 허가 등 전력 논란.
- Grok-1 2023-11 → Grok-1 오픈 웨이트 2024-03-17(314B) → Grok-2 2024-08 → **Grok 3 2025-02-17**(약 20만 GPU Colossus, Grok-2의 10배 컴퓨트) → **Grok 4 2025-07-09** → Grok 4.1 2025-11-17 → 4.5(2026-07-08)/4.6/4.7(2026-09-12) (2026 항목 Wikipedia 기재).
- 2026-06 Google이 SpaceX로부터 GPU 약 11만 장을 월 9.2억 달러에 임차 계약(2026-10~2029-06)(Wikipedia 기재, 미확인).

### DeepSeek [26][27]
- 창업 2023(항저우), **량원펑**(1985년생, 저장대). 헤지펀드 High-Flyer(2016-02 창업) 소유. 수출규제 전 **A100 약 1만 장** 확보.
- **DeepSeek-V3** 2024-12-26: MoE **671B(활성 37B)**, 14.8조 토큰, **H800 2,048장 · 278.8만 GPU-시간 → 시간당 2달러 가정 시 557.6만 달러**. **주의(논문 자체 명시)**: 이 금액은 최종 학습 1회분이며 **선행 연구·아키텍처/데이터 실험 비용은 제외**. GPU 구매비·인건비도 아님.
- **DeepSeek-R1** 2025-01-20(MIT 라이선스). 2025-01-27 미국 iOS App Store 무료 1위 → 같은 날 **NVIDIA 주가 약 17% 하락**. 이후 V3.1(2025-08-21), V3.2(2025-12-01), V4 프리뷰(2026-04-24).

### Mistral AI [28]
- 2023-04 파리 창업(Arthur Mensch, Guillaume Lample, Timothée Lacroix). Mistral 7B 2023-09-27, Mixtral 8x7B 2023-12, Mistral Large 2024-02, Le Chat. 2025-09 ASML 투자로 기업가치 약 117억 유로(유럽 최고). Mistral Large 3(2025-12, MoE 675B/활성 41B).

### 한국 모델 (실재 확인분) [29][30][31][32][33]
- **Naver HyperCLOVA X**: 2023-08-24 공개(CNBC/KED). HyperCLOVA X THINK 2025-06-30, 옴니모달 HyperCLOVA X 2025-12-29(Naver 공식). 전신 HyperCLOVA(2021, 204B)은 2차 자료 기준.
- **LG AI Research EXAONE**: EXAONE 3.0(2024-08, 7.8B 오픈) → 3.5(2024-12) → EXAONE Deep(2025-03, 추론) → **EXAONE 4.0**(2025-07, 32B) → EXAONE 4.5(2026-04, 멀티모달) → **K-EXAONE 2.0**(2026-07, **750B**, 한국 최대 오픈 모델) — 2026 항목은 뉴스 헤드라인 기준.
- **Upstage Solar**: 2020-10 창업(김성훈). **Solar 10.7B 2023-12**(Hugging Face Open LLM 리더보드 1위 이력), Solar Pro 2 2025-07, Solar Open 2 2026-07.
- **SK Telecom A.X**: **A.X 4.0 2025-07-03**, 72B, **Qwen2.5 기반 한국어 추가학습**(Hugging Face 모델 카드 명시), KMMLU 78.32, 한국어 토큰 GPT-4o 대비 33% 절감. A.X 4.0 Light 7B.
- **정부 '독자 AI 파운데이션 모델' 프로젝트**: 2025-08 5개 컨소시엄 선정(Naver Cloud, SK Telecom, Upstage, LG AI Research, NC AI; Kakao·KT 탈락). **2026-01-15** 1차 평가에서 **Naver·NC 탈락**, LG·SKT·Upstage 진출(공정성 논란 보도). 2026-08-18 Motif 탈락, Upstage·SKT·LG 계속 진출.

### 스케일링 법칙 & 컴퓨트 성장 [34][35][36]
- **Kaplan 외 2020**(OpenAI) "Scaling Laws for Neural Language Models", arXiv 2020-01-23: 손실이 파라미터·데이터·컴퓨트의 **거듭제곱 법칙**으로 예측 가능. 파라미터를 더 공격적으로 키우라고 권고.
- **Chinchilla(Hoffmann 외 2022, DeepMind)**, arXiv 2022-03-29: 파라미터와 토큰을 **같은 비율**로 키워야 최적(**약 20토큰/파라미터**). 70B·1.4조 토큰 Chinchilla가 280B Gopher를 이김.
- Epoch AI 추정: 프런티어 모델 학습 컴퓨트는 최근 **6–7개월마다 2배(연 4–5배)**.

### 에너지 [37][38]
- IEA(2025-04, Wikipedia 인용): 전 세계 데이터센터 전력 **2024년 약 415 TWh(세계 전력의 1.5%)** → **2030년 약 945 TWh**(연 15% 성장). 미국 데이터센터는 2023년 국가 전력의 4.4%, 2028년 6.7–12%(LBNL).
- **Stargate**: 2025-01-21 백악관 발표(OpenAI·SoftBank·Oracle·MGX). 초기 1,000억 → 2029년까지 5,000억 달러. 텍사스 애빌린 등, 2025-09 기준 계획 용량 **약 7 GW**.
- xAI Colossus 1+2 합산 약 1 GW(2026 중반). "1 GW ≈ 원전 1기 출력"이 감 잡기 좋은 비교.

**왜 중요한가**: 2023년까진 "누가 가장 큰 모델을 갖나"였다면, 2025년부터는 (a) 추론 모델, (b) 오픈 웨이트(Llama/DeepSeek/Mistral/EXAONE), (c) 전력·GPU 확보(Colossus/Stargate/한국 26만 장)의 세 갈래 경주가 됐다.

---

## A7. 한국과 AI·반도체 생태계

### SK그룹·SK하이닉스·최태원 [39][40][41][42]
- SK하이닉스는 H100용 **HBM3**(2022–23)를 공급했고, **2024-03 HBM3E 8단 세계 최초 양산·NVIDIA 공급**, **2024-09-26 HBM3E 12단 세계 최초 양산**, **2025-09 HBM4 개발 완료·양산 준비 세계 최초**(NVIDIA Rubin용). 2025 Q2 DRAM 점유율 38%. 2026 Q1 영업이익 약 250억 달러, 2026 연간 전망 1,690억 달러(Wikipedia 기재).
- **최태원(1960-12-03생, SK그룹 회장·대한상의 회장)** 과 젠슨 황: **2024-11-04 SK AI Summit**에서 "젠슨 황이 HBM4 공급을 **6개월 앞당겨 달라**고 요청했다"고 공개(Reuters 11-03, CNBC/연합 11-04) → SK하이닉스 주가 6.5% 급등. **2026-02-09 실리콘밸리 '치맥' 회동**(두 사람의 딸 동석, 매일경제 02-11), **2026-03 GTC 2026 참석·회동**(Businesskorea 03-05; 서울경제TV 보도상 첫 GTC 참석), **2026-06-01 GTC Taipei 2026 키노트 참석**(SK하이닉스 공식) 및 06-02 '깐부' 2차 회동. **GTC 2024/2025 회동은 확인 못함 (미확인)**; 2024-04 NVIDIA 본사 방문도 이번 세션 1차 확인 실패 (미확인).
- **곽노정 SK하이닉스 CEO**: **2026-07-10 나스닥 ADR 상장**(265억 달러, 미국 2위 규모 주식 매각)에서 오프닝 벨. 2026-08-27 인디애나 웨스트라파예트 40억 달러 HBM 패키징 공장 착공. "2030년까지 메모리 부족, 2027년이 최악의 공급 부족 해" 전망. 출생연도 **(미확인)**.

### 삼성전자·이재용 [43][44]
- **이재용(1968-06-23생)**, 2022-10 회장 취임. 2025-07-17 대법원 무죄 확정.
- **HBM3E 12단 NVIDIA 퀄 통과**: 2025-09-19 보도(KED/Wccftech "reportedly") — 삼성 공식 발표가 아니라 **보도 기준**. HBM4는 2025-08 샘플 평가 통과 보도, **2026-03 TrendForce: 삼성·SK하이닉스 모두 NVIDIA Rubin HBM4 공급사**. 삼성은 Google TPU용 HBM3E의 60% 이상 공급(TrendForce 2025-12).
- **2025-10-30 "치맥 회동"**: APEC 기간 서울 삼성동 깐부치킨에서 젠슨 황·이재용·정의선. Korea Herald(10-30), Fortune·NYT(10-31 "Three Billionaires Walk Into a Fried Chicken Restaurant"). 치킨 주문 급증, 육계주 상승, 해당 테이블 시간제한(중앙일보 11-04). GTC 2026에서 젠슨 황이 "삼성에 감사"(TV조선 보도).

### 정부·26만 장 GPU [45][46]
- **2025-02-18 Reuters**: 정부, 국가 AI 컴퓨팅센터용 **GPU 1만 장** 확보 계획. 2025-05 GPU 조달 10억 달러. 2026 GPU 예산 약 27억 달러, Vera Rubin 1만 장 목표(2026-07 보도).
- **2025-10-31 APEC(경주)**: 젠슨 황, 한국에 **NVIDIA GPU 26만 장** 공급 발표(Yonhap/TechCrunch). 정부 약 5만 장(독자 파운데이션 모델·국가 AI 데이터센터), 나머지 20만+ 장은 삼성·SK·현대차그룹·네이버(회사별 배분은 2차 보도 → **(미확인)**). 2025-11-27 GPU 태스크포스 구성. 2030년까지 배치 목표.

### 네이버·카카오·LG AI연구원
- 네이버: 최수연 대표(1981년생, 2022-03 취임; 생년은 2차 자료). HyperCLOVA X(위 A6). 젠슨 황 APEC 방한 때 네이버 투자 언급(Bloomberg 인터뷰).
- LG AI연구원: EXAONE(위 A6), 2026-07 K-EXAONE 2.0 750B.
- 카카오: 정부 독자 모델 프로젝트 2025-08 선정에서 탈락(Businesskorea). 자체 모델 상세는 **(미확인)**.

**왜 중요한가**: GPU 한 장의 성능은 HBM 대역폭이 좌우하고, HBM은 SK하이닉스·삼성·마이크론 3사뿐이다. 그래서 GPU 경주의 병목이 곧 한국 메모리 산업이다(챕터 02 HBM 항목 참조).

---

## A8. 로봇 + LLM의 수렴 (Physical AI) — 요약, 상세는 챕터 04

- **NVIDIA GR00T**: 2024-03-18 GTC "Project GR00T" 발표 → **GR00T N1 2025-03-18**(세계 최초 오픈 휴머노이드 파운데이션 모델, 2.2B) → N1.5/N1.6/N1.7(2026-03 GA) → N2(2026 말 목표). 상세: `04_physical_ai_and_story_facts.md` 4절.
- **Figure Helix**: 2025-02-20. VLM(7B, 7–9 Hz) + 제어 트랜스포머(80M, 200 Hz), 온보드 GPU. 04 문서 [16].
- **Tesla Optimus**: 2021-08-19 AI Day 발표 → 2022-09 프로토타입 → 2023-12 Gen 2(손 자유도 11→22) → 2026-04 프리몬트 라인 설치(연 100만 대 목표, Wikipedia 기재). 자체 FSD 컴퓨터 사용(NVIDIA 아님). [47]
- 연결점: LLM/VLM이 "System 2(느린 생각)"로, 작은 액션 모델이 "System 1(빠른 반사)"로 들어가는 구조가 GR00T·Helix의 공통점. 즉 이 챕터의 LLM 경주가 그대로 로봇 두뇌 경주로 이어진다.

---

## 인물 메모 (PEOPLE_AI)
- 생년 확인: Hassabis 1976-07-27, 이세돌 1983-03-02, Silver 1976, 판후이 1981-12-27, Hinton 1947-12-06, 최태원 1960-12-03, 이재용 1968-06-23, 량원펑 1985, Vaswani 1986, Shazeer 1975/76(Wikipedia "1975 or 1976"), Daniela Amodei 1987 — 모두 Wikipedia. 나머지(Krizhevsky 1986, Sutskever 1986, LeCun 1960, Bengio 1964, Fei-Fei Li 1976, Altman 1985, Brockman 1987, Dario 1983, Karpathy 1986, Pichai 1972, Zuckerberg 1984, Musk 1971, Jensen 1963, Suleyman 1984)는 일반 상식 수준이며 이번 세션에서 재확인하지 않음. **곽노정 생년 미확인(`—`)**, **최수연 1981은 2차(YouTube 제목) 기준**.
- 인용문은 검증된 것만: 이세돌(Wikipedia, 2019 은퇴), 판후이(Wikipedia, 2015), Hinton(CHM 블로그, 05 문서에서 기검증), Jensen(GTC 단골 문구, 05 문서에서 기검증). 나머지는 생략.
- 영상 언어: 이세돌(Google Korea 인터뷰), 최수연(한경)은 한국어 → `lang: 'ko'`. 이세돌 영어 대안: TRT World `PUaCQUal7rM`(5m). 이재용은 영어 인터뷰가 없어 Arirang News 영어 뉴스(2m)를 배정. 곽노정은 Nasdaq 영어 영상.
- David Silver: Lex #86 `uPUEq8d73JI`는 oEmbed 401(임베드 불가)이라 DeepMind 공식 `zzXyPGEtseI`로 대체.
- 대안 영상(모두 oEmbed 확인): Hassabis — Lex #475 `-HzgcbRXUK8`, Stanford GSB `DsewHeVbL-0`; Dario — Lex #452 `ugvHCXCOmm4`(315m); Pichai — BBC `BYx63PKKPvg`; Vaswani — AI Summit Seoul 키노트 `vY_OZ2pcTEU`; Jensen — 60 Minutes `DpQQi2scsHo`; 최태원·젠슨 황 치맥 `3bduBPUYeaQ`(KOREA NOW), Computex 2026 재회 `co6oxSyWtug`(SK hynix); 이재용 치맥 MBN `FOdgOXP5fMw`; 판후이 EGC2016 발표 `V0-IWQ9TvLo`.

---

## 출처 (Sources)
1. Wikipedia, "AlphaGo versus Lee Sedol" — https://en.wikipedia.org/wiki/AlphaGo_versus_Lee_Sedol
2. Wikipedia, "AlphaGo" (하드웨어 표·버전 표) — https://en.wikipedia.org/wiki/AlphaGo ; Silver et al., Nature 529 (2016-01-28) — https://www.nature.com/articles/nature16961
3. Wikipedia, "Lee Sedol" — https://en.wikipedia.org/wiki/Lee_Sedol ; Wikipedia, "Fan Hui" — https://en.wikipedia.org/wiki/Fan_Hui
4. Wikipedia, "AlexNet" — https://en.wikipedia.org/wiki/AlexNet
5. Wikipedia, "Geoffrey Hinton" — https://en.wikipedia.org/wiki/Geoffrey_Hinton
6. He et al., "Deep Residual Learning for Image Recognition", arXiv:1512.03385 (2015-12-10) — https://arxiv.org/abs/1512.03385
7. Vaswani et al., "Attention Is All You Need", arXiv:1706.03762 (2017-06) — https://arxiv.org/abs/1706.03762 (5.2절 하드웨어; ar5iv HTML로 확인 https://ar5iv.labs.arxiv.org/html/1706.03762)
8. Devlin et al., "BERT", arXiv:1810.04805 (2018-10-11) — https://arxiv.org/abs/1810.04805
9. Wikipedia, "Ashish Vaswani" — https://en.wikipedia.org/wiki/Ashish_Vaswani
10. Wikipedia, "Noam Shazeer" — https://en.wikipedia.org/wiki/Noam_Shazeer
11. Wikipedia, "Generative pre-trained transformer" — https://en.wikipedia.org/wiki/Generative_pre-trained_transformer
12. Wikipedia, "GPT-1" — https://en.wikipedia.org/wiki/GPT-1
13. Microsoft, "Microsoft announces new supercomputer..." (2020-05-19) — https://news.microsoft.com/source/features/innovation/openai-azure-supercomputer/
14. Wikipedia, "ChatGPT" — https://en.wikipedia.org/wiki/ChatGPT
15. Wikipedia, "GPT-5" — https://en.wikipedia.org/wiki/GPT-5 (GPT-5 시스템 카드 2025-08-07 인용)
16. Wikipedia, "GPT-6" — https://en.wikipedia.org/wiki/GPT-6 (openai.com은 403으로 직접 확인 실패)
17. Wikipedia, "Anthropic" — https://en.wikipedia.org/wiki/Anthropic
18. Bai et al., "Constitutional AI: Harmlessness from AI Feedback", arXiv:2212.08073 (2022-12-15) — https://arxiv.org/abs/2212.08073
19. Wikipedia, "Claude (language model)" — https://en.wikipedia.org/wiki/Claude_(language_model)
20. Anthropic Newsroom — https://www.anthropic.com/news ("Introducing Claude Opus 5" 2026-07-24; "Introducing Claude Fable 5.1 and Claude Mythos 5.1" 2026-09-01)
21. Wikipedia, "Colossus (supercomputer)" — https://en.wikipedia.org/wiki/Colossus_(supercomputer)
22. Wikipedia, "Gemini (language model)" — https://en.wikipedia.org/wiki/Gemini_(language_model)
23. Wikipedia, "Llama (language model)" — https://en.wikipedia.org/wiki/Llama_(language_model)
24. Meta AI, "Introducing Llama 3.1" (2024-07-23) — https://ai.meta.com/blog/meta-llama-3-1/
25. Wikipedia, "Grok (chatbot)" — https://en.wikipedia.org/wiki/Grok_(chatbot)
26. DeepSeek-AI, "DeepSeek-V3 Technical Report", arXiv:2412.19437 — https://arxiv.org/abs/2412.19437
27. Wikipedia, "DeepSeek" — https://en.wikipedia.org/wiki/DeepSeek ; "Liang Wenfeng" — https://en.wikipedia.org/wiki/Liang_Wenfeng
28. Wikipedia, "Mistral AI" — https://en.wikipedia.org/wiki/Mistral_AI
29. Google News RSS 헤드라인 "Naver HyperCLOVA X" (CNBC/KED 2023-08-24; Korea JoongAng Daily 2025-06-30; NAVER Corp. 2025-12-29) — https://news.google.com/rss/search?q=Naver+HyperCLOVA+X+launch+THINK+model
30. Google News RSS 헤드라인 "LG EXAONE" (MarkTechPost 2024-08; LG 2024-12; Yonhap 2025-03; SiliconANGLE 2025-07; 조선일보/Korea Times 2026-04; Korea Herald 2026-07) — https://news.google.com/rss/search?q=LG+EXAONE+release+model ; LG AI Research — https://www.lgresearch.ai/exaone
31. Wikipedia, "Upstage (company)" — https://en.wikipedia.org/wiki/Upstage_(company)
32. Hugging Face, "skt/A.X-4.0" 모델 카드 — https://huggingface.co/skt/A.X-4.0
33. Google News RSS 헤드라인 독자 AI 파운데이션 모델 (Businesskorea 2025-08; Korea Herald 2026-01-15; Korea Times 2026-01-14; Chosunbiz 2026-08-18) — https://news.google.com/rss/search?q=Korea+independent+AI+foundation+model+project+Naver+SK+Telecom+Upstage+LG+NC+AI
34. Kaplan et al., "Scaling Laws for Neural Language Models", arXiv:2001.08361 (2020-01-23) — https://arxiv.org/abs/2001.08361
35. Hoffmann et al., "Training Compute-Optimal Large Language Models", arXiv:2203.15556 (2022-03-29) — https://arxiv.org/abs/2203.15556
36. Wikipedia, "Neural scaling law" (Epoch AI 인용) — https://en.wikipedia.org/wiki/Neural_scaling_law
37. Wikipedia, "Data center" (IEA Energy and AI 2025 인용) — https://en.wikipedia.org/wiki/Data_center (IEA 원문 https://www.iea.org/reports/energy-and-ai 은 403으로 직접 확인 실패)
38. Wikipedia, "Stargate LLC" — https://en.wikipedia.org/wiki/Stargate_LLC
39. Wikipedia, "SK hynix" — https://en.wikipedia.org/wiki/SK_hynix
40. Wikipedia, "Chey Tae-won" — https://en.wikipedia.org/wiki/Chey_Tae-won
41. Google News RSS 헤드라인 (Reuters 2024-11-03 "Nvidia's Huang asked SK Hynix to bring forward supply of HBM4 chips by 6 months, SK's chairman says"; CNBC/Yonhap/KED 2024-11-04) — https://news.google.com/rss/search?q=Chey+Tae-won+Jensen+Huang+HBM4+six+months+earlier+SK+AI+Summit
42. Google News RSS 헤드라인 (Businesskorea 2026-02-09, 2026-03-05; 매일경제 2026-02-11, 2026-06-02; SK hynix 2026-06-01; Korea Herald 2026-06-02; Chosunbiz 2026-06-07; Kwak Noh-jung: Nasdaq 2026-07-10, Indiana 2026-08-27, Future Forum 2026-09-09) — https://news.google.com/rss/search?q=Chey+Tae-won+Jensen+Huang+chimaek+daughters ; https://news.google.com/rss/search?q=Kwak+Noh-jung+SK+hynix+CEO
43. Wikipedia, "Lee Jae-yong (businessman)" — https://en.wikipedia.org/wiki/Lee_Jae-yong_(businessman) ; Google News RSS (Korea Herald 2025-10-30; Fortune/NYT/Korea Times/Chosunbiz 2025-10-31; Korea JoongAng Daily 2025-10-31, 11-04) — https://news.google.com/rss/search?q=Jensen+Huang+Lee+Jae-yong+Chung+Euisun+chimaek+fried+chicken+beer
44. Google News RSS 헤드라인 삼성 HBM3E/HBM4 (Wccftech/KED 2025-09-19; TechSpot 2025-09-23; TrendForce 2025-08-21, 2025-11-04, 2025-12-01, 2026-03-09; KED 2026-01-25) — https://news.google.com/rss/search?q=Samsung+HBM3E+NVIDIA+qualification+supply ; Wikipedia, "High Bandwidth Memory" — https://en.wikipedia.org/wiki/High_Bandwidth_Memory
45. Google News RSS 헤드라인 (Reuters 2025-02-18 "South Korea to secure 10,000 GPUs for national AI computing centre"; Korea Herald 2025-11-27; DongA Science; finance.biggo 2026-07-19) — https://news.google.com/rss/search?q=Korea+national+AI+computing+center+10,000+GPUs+government
46. TechCrunch, "Nvidia expands AI ties with Hyundai, Samsung, SK, Naver" (2025-10-31) — https://techcrunch.com/2025/10/31/nvidia-expands-ai-ties-with-hyundai-samsung-sk-naver/ ; Yonhap "[APEC 2025] Nvidia to deploy 260,000 GPUs..." (2025-10-31); KED Global (2025-10-31)
47. Wikipedia, "Optimus (robot)" — https://en.wikipedia.org/wiki/Optimus_(robot) ; 로봇 상세는 `docs/research/04_physical_ai_and_story_facts.md`

---

## 영상 검증 표 (oEmbed 응답 그대로, 2026-09-12)

아래 표는 `src/data/people_ai.js`에 들어간 모든 videoId에 대해 oEmbed를 재호출한 결과다. 제목·채널은 응답값을 가공 없이 적었다.

| videoId | oEmbed title | oEmbed author | 사용처 |
|---|---|---|---|
| [PqVbypvxDto](https://www.youtube.com/watch?v=PqVbypvxDto) | The future of intelligence \| Demis Hassabis (Co-founder and CEO of DeepMind) | Google DeepMind | PEOPLE_AI:hassabis |
| [arCR-CuHLM0](https://www.youtube.com/watch?v=arCR-CuHLM0) | [INTERVIEW] 이세돌과의 TALK: 이세돌이 전하는 알파고와의 대결 그 순간, 그리고 AI | Google Korea | PEOPLE_AI:leesedol |
| [zzXyPGEtseI](https://www.youtube.com/watch?v=zzXyPGEtseI) | Is human data enough? \| David Silver | Google DeepMind | PEOPLE_AI:silver |
| [SF486mbvAOI](https://www.youtube.com/watch?v=SF486mbvAOI) | Ke Jie and DeepMind's Go Ambassador Fan Hui review the 2nd AlphaGo vs Ke Jie game | Google DeepMind | PEOPLE_AI:fanhui |
| [XDE9DjpcSdI](https://www.youtube.com/watch?v=XDE9DjpcSdI) | Nobel Prize lecture: Geoffrey Hinton, Nobel Prize in Physics | Nobel Prize | PEOPLE_AI:hinton |
| [UZDiGooFs54](https://www.youtube.com/watch?v=UZDiGooFs54) | The moment we stopped understanding AI [AlexNet] | Welch Labs | PEOPLE_AI:krizhevsky, VIDEOS_AI.alexnet |
| [aR20FWCCjAs](https://www.youtube.com/watch?v=aR20FWCCjAs) | Ilya Sutskever – We're moving from the age of scaling to the age of research | Dwarkesh Patel | PEOPLE_AI:sutskever |
| [JS12eb1cTLE](https://www.youtube.com/watch?v=JS12eb1cTLE) | deeplearning.ai's Heroes of Deep Learning: Yann LeCun | DeepLearningAI | PEOPLE_AI:lecun |
| [qe9QSCF-d88](https://www.youtube.com/watch?v=qe9QSCF-d88) | The Catastrophic Risks of AI — and a Safer Path \| Yoshua Bengio \| TED | TED | PEOPLE_AI:bengio |
| [40riCqvRoMs](https://www.youtube.com/watch?v=40riCqvRoMs) | How we teach computers to understand pictures \| Fei Fei Li | TED | PEOPLE_AI:feifei |
| [bYmeuc5voUQ](https://www.youtube.com/watch?v=bYmeuc5voUQ) | RAAIS 2019 - Ashish Vaswani, Senior Research Scientist at Google AI | The Research and Applied AI Summit - RAAIS | PEOPLE_AI:vaswani |
| [v0gjI__RyCY](https://www.youtube.com/watch?v=v0gjI__RyCY) | Jeff Dean & Noam Shazeer — 25 years at Google: from PageRank to AGI | Dwarkesh Patel | PEOPLE_AI:shazeer |
| [5MWT_doo68k](https://www.youtube.com/watch?v=5MWT_doo68k) | OpenAI’s Sam Altman Talks ChatGPT, AI Agents and Superintelligence — Live at TED2025 | TED | PEOPLE_AI:altman |
| [dnSpKF5pWNQ](https://www.youtube.com/watch?v=dnSpKF5pWNQ) | How Close Are We to True Artificial General Intelligence? \| OpenAI’s Greg Brockman Speaks to TIME | TIME | PEOPLE_AI:brockman |
| [x2VHFgyawPE](https://www.youtube.com/watch?v=x2VHFgyawPE) | Inside the Mind of Anthropic CEO Dario Amodei \| The Circuit \| Extended Interview | Bloomberg Originals | PEOPLE_AI:dario |
| [qUDG06BvWxc](https://www.youtube.com/watch?v=qUDG06BvWxc) | Anthropic co-founder Daniela Amodei on responsible AI and Anthropic's first Super Bowl ad | ABC News | PEOPLE_AI:daniela |
| [LCEmiRjPEtQ](https://www.youtube.com/watch?v=LCEmiRjPEtQ) | Andrej Karpathy: Software Is Changing (Again) | Y Combinator | PEOPLE_AI:karpathy, VIDEOS_AI.agents |
| [1IxG7ywSNXk](https://www.youtube.com/watch?v=1IxG7ywSNXk) | Google CEO Sundar Pichai on the future of search, AI agents, and selling Chrome | Decoder with Nilay Patel | PEOPLE_AI:pichai |
| [Vy3OkbtUa5k](https://www.youtube.com/watch?v=Vy3OkbtUa5k) | Mark Zuckerberg on Llama 3.1, Open Source, AI Agents, Safety, and more | The Rundown AI | PEOPLE_AI:zuckerberg, VIDEOS_AI.llama |
| [tRsxLLghL1k](https://www.youtube.com/watch?v=tRsxLLghL1k) | Elon Musk on xAI: We will win \| Lex Fridman Podcast | Lex Clips | PEOPLE_AI:musk |
| [hd1-CKDyHXE](https://www.youtube.com/watch?v=hd1-CKDyHXE) | How A Chinese Villager Shook Silicon Valley [DeepSeek Founder] | ColdFusion | PEOPLE_AI:liang, VIDEOS_AI.deepseek |
| [N5UhBCbxdIA](https://www.youtube.com/watch?v=N5UhBCbxdIA) | Nvidia CEO Jensen Huang Talks AI Golden Age in South Korea, New Naver Investment (Full Interview) | Bloomberg Podcasts | PEOPLE_AI:jensen, VIDEOS_AI.korea_ai |
| [FWrZTOIVgNg](https://www.youtube.com/watch?v=FWrZTOIVgNg) | SK Group Chairman Chey Tae-won on SK Hynix's massive memory expansion — full interview | CNBC Television | PEOPLE_AI:chey |
| [Jf0dS4TLI9s](https://www.youtube.com/watch?v=Jf0dS4TLI9s) | Nvidia CEO meets with Samsung, Hyundai Motor chiefs over fried chicken | Arirang News | PEOPLE_AI:leejy |
| [eSWFPJVIOUQ](https://www.youtube.com/watch?v=eSWFPJVIOUQ) | SK hynix CEO Kwak Noh-Jung shares his vision for the AI era | Nasdaq | PEOPLE_AI:kwak |
| [AWCz9VELvCQ](https://www.youtube.com/watch?v=AWCz9VELvCQ) | 네이버 AI 어떻게 개선할 겁니까? 최수연 대표의 답변 \| 안재광의 대기만성's | 한경 코리아마켓 | PEOPLE_AI:choi |
| [KKNCiRWd_j0](https://www.youtube.com/watch?v=KKNCiRWd_j0) | What Is an AI Anyway? \| Mustafa Suleyman \| TED | TED | PEOPLE_AI:suleyman |
| [WXuK6gekU1Y](https://www.youtube.com/watch?v=WXuK6gekU1Y) | AlphaGo - The Movie \| Full award-winning documentary | Google DeepMind | VIDEOS_AI.alphago |
| [qoinGjj60Fo](https://www.youtube.com/watch?v=qoinGjj60Fo) | 10 years of AlphaGo: The turning point for AI \| Thore Graepel & Pushmeet Kohli | Google DeepMind | VIDEOS_AI.alphago |
| [Pd-kOPyVvRc](https://www.youtube.com/watch?v=Pd-kOPyVvRc) | Lee Sedol vs. AlphaGo: What Really Happened in the Match | Go Magic | VIDEOS_AI.alphago |
| [gC_PoPye_CQ](https://www.youtube.com/watch?v=gC_PoPye_CQ) | The ImageNet Moment with Geoff Hinton \| Best Bits | The Robot Brains Podcast | VIDEOS_AI.alexnet |
| [wjZofJX0v4M](https://www.youtube.com/watch?v=wjZofJX0v4M) | Transformers, the tech behind LLMs \| Deep Learning Chapter 5 | 3Blue1Brown | VIDEOS_AI.transformer |
| [eMlx5fFNoYc](https://www.youtube.com/watch?v=eMlx5fFNoYc) | Attention in transformers, step-by-step \| Deep Learning Chapter 6 | 3Blue1Brown | VIDEOS_AI.transformer |
| [rURRYI66E54](https://www.youtube.com/watch?v=rURRYI66E54) | AI Language Models & Transformers - Computerphile | Computerphile | VIDEOS_AI.transformer |
| [kCc8FmEb1nY](https://www.youtube.com/watch?v=kCc8FmEb1nY) | Let's build GPT: from scratch, in code, spelled out. | Andrej Karpathy | VIDEOS_AI.gpt |
| [zjkBMFhNj_g](https://www.youtube.com/watch?v=zjkBMFhNj_g) | [1hr Talk] Intro to Large Language Models | Andrej Karpathy | VIDEOS_AI.gpt |
| [LPZh9BOjkQs](https://www.youtube.com/watch?v=LPZh9BOjkQs) | Large Language Models explained briefly | 3Blue1Brown | VIDEOS_AI.gpt |
| [7xTGNNLPyMI](https://www.youtube.com/watch?v=7xTGNNLPyMI) | Deep Dive into LLMs like ChatGPT | Andrej Karpathy | VIDEOS_AI.chatgpt |
| [viJt_DXTfwA](https://www.youtube.com/watch?v=viJt_DXTfwA) | ChatGPT with Rob Miles - Computerphile | Computerphile | VIDEOS_AI.chatgpt |
| [om2lIWXLLN4](https://www.youtube.com/watch?v=om2lIWXLLN4) | Building Anthropic \| A conversation with our co-founders | Anthropic | VIDEOS_AI.claude |
| [Tjsox6vfsos](https://www.youtube.com/watch?v=Tjsox6vfsos) | Constitutional AI - Daniela Amodei (Anthropic | Stanford eCorner | VIDEOS_AI.claude |
| [nNHBb_2hMWI](https://www.youtube.com/watch?v=nNHBb_2hMWI) | RLAIF vs. RLHF: the technology behind Anthropic’s Claude (Constitutional AI Explained) | AssemblyAI | VIDEOS_AI.claude |
| [cogrixfRvWw](https://www.youtube.com/watch?v=cogrixfRvWw) | How developers are using Gemini 1.5 Pro’s 1 million token context window | Google | VIDEOS_AI.gemini |
| [8hfpLa5wPGo](https://www.youtube.com/watch?v=8hfpLa5wPGo) | Gemini co-leads on project origins and what's next | Google for Developers | VIDEOS_AI.gemini |
| [eIUqw3_YcCI](https://www.youtube.com/watch?v=eIUqw3_YcCI) | Sundar Pichai Opening Remarks \| I/O 2025 Keynote | Google | VIDEOS_AI.gemini |
| [WaJOONFllLc](https://www.youtube.com/watch?v=WaJOONFllLc) | Llamacon 2025 - Conversation with Mark Zuckerberg and Satya Nadella | Meta Developers | VIDEOS_AI.llama |
| [Jf8EPSBZU7Y](https://www.youtube.com/watch?v=Jf8EPSBZU7Y) | Inside the World's Largest AI Supercluster xAI Colossus | ServeTheHome | VIDEOS_AI.grok |
| [q5XP8xDcRJE](https://www.youtube.com/watch?v=q5XP8xDcRJE) | How Elon Musk's AI Empire In Memphis Became A Cautionary Tale | CNBC | VIDEOS_AI.grok |
| [gY4Z-9QlZ64](https://www.youtube.com/watch?v=gY4Z-9QlZ64) | DeepSeek is a Game Changer for AI - Computerphile | Computerphile | VIDEOS_AI.deepseek |
| [fTjPEE0fk-U](https://www.youtube.com/watch?v=fTjPEE0fk-U) | How Did They Do It? DeepSeek V3 and R1 Explained | No Hype AI | VIDEOS_AI.deepseek |
| [GrloGdp5wdc](https://www.youtube.com/watch?v=GrloGdp5wdc) | Scaling Laws of AI explained \| Dario Amodei and Lex Fridman | Lex Clips | VIDEOS_AI.scaling |
| [5eqRuVp65eY](https://www.youtube.com/watch?v=5eqRuVp65eY) | AI can't cross this line and we don't know why. | Welch Labs | VIDEOS_AI.scaling |
| [7hbf4klU3ks](https://www.youtube.com/watch?v=7hbf4klU3ks) | Lec 20. Scaling Laws | MIT OpenCourseWare | VIDEOS_AI.scaling |
| [8JiyJejo-e0](https://www.youtube.com/watch?v=8JiyJejo-e0) | Inside SK Hynix: We Went To Korea To See The World's Biggest AI Memory Buildout | CNBC | VIDEOS_AI.korea_ai |
| [wS57SInZt8g](https://www.youtube.com/watch?v=wS57SInZt8g) | Why Samsung Is Falling Behind in the AI Chips Race | Bloomberg Originals | VIDEOS_AI.korea_ai |
| [Cg5tAujp6Go](https://www.youtube.com/watch?v=Cg5tAujp6Go) | SK hynix and the HBM Revolution | Asianometry | VIDEOS_AI.hbm_race |
| [yAw63F1W_Us](https://www.youtube.com/watch?v=yAw63F1W_Us) | The Special Memory Powering the AI Revolution | Asianometry | VIDEOS_AI.hbm_race |
| [1mbkSEkTWHE](https://www.youtube.com/watch?v=1mbkSEkTWHE) | 세계 1위 'HBM 신화'의 비밀..SK하이닉스 이야기 / 소비더머니 | 소비더머니 | VIDEOS_AI.hbm_race |
| [xCRvOUykOX0](https://www.youtube.com/watch?v=xCRvOUykOX0) | How do thinking and reasoning models work? | Google for Developers | VIDEOS_AI.reasoning |
| [jrA47yocyV0](https://www.youtube.com/watch?v=jrA47yocyV0) | Explaining OpenAI's o1 Reasoning Models | Sam Witteveen | VIDEOS_AI.reasoning |
| [RveLjcNl0ds](https://www.youtube.com/watch?v=RveLjcNl0ds) | How to Train LLMs to "Think" (o1 & DeepSeek-R1) | Shaw Talebi | VIDEOS_AI.reasoning |
| [uhJJgc-0iTQ](https://www.youtube.com/watch?v=uhJJgc-0iTQ) | Building more effective AI agents | Anthropic | VIDEOS_AI.agents |
| [D7_ipDqhtwk](https://www.youtube.com/watch?v=D7_ipDqhtwk) | How We Build Effective Agents: Barry Zhang, Anthropic | AI Engineer | VIDEOS_AI.agents |

총 63개 ID, 전부 HTTP 200. 실패 없음.
