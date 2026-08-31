# 시트 헬퍼 34종 호환성 기준표

- 기준일: 2026-08-31
- 배포 대상: `public/scripts/10_sheet_helper.js` 0.6.17

이 문서는 배포용 10번에 내장된 CoC 시트 34종의 원본 입력과 현재 자동 검사 결과를 기록한다. 이름만 보고 시트를 고른 결과가 아니라, 각 원본 HTML·CSS·번역 파일에서 읽은 속성, 굴림, 선택 방식을 기준으로 한다.

중요: 아래의 **로컬 원본 확인**과 **자동 검사**는 Roll20 실측이 아니다. 0.6.17에서 34종 전체를 차례로 Sheet Sandbox에 적용하지는 않았고, 구조가 다른 대표 4종만 실제 교체·API 재기동·명령 응답까지 확인했다.

## 결과 요약

- 내장 시트: 34종
- 원본 입력 확인: 34/34
- 대표 굴림 결과 생성·컷인 연결 자동 하네스: 34/34 통과
- 저장 항목이 없는 빈 캐릭터 기준: 정확히 한 종 일치 9/34, 안전하게 모호 처리 25/34, 다른 시트 오선택 0/34
- 현행 0.6.17 Roll20 Sheet Sandbox 교체 실측: 대표 4/34
- 이번 성능 최적화 범위에서 새로 넣지 않는 로컬 CoC 원본: 3종

추출 수치는 `속성 / 굴림 / 선택 방식` 순서다. 선택 방식은 원본 굴림이 직접 참조한 선택값의 합계이며, 시트 헬퍼가 임의로 추가한 기능 수가 아니다.

## 원본 경로 약칭

- `C` = 로컬 `[중요]커스텀시트\CoC` 원본 모음
- `T` = 로컬 `티알\0 CoC` 원본 모음
- `M` = 로컬 `roll20-character-sheets-master` 원본 모음

## 34종 전체 매핑과 현재 결과

`빈 캐릭터 일치`는 저장된 시트 속성이 전혀 없는 자동 하네스에서 한 종만 골랐다는 뜻이다. `안전 모호`는 후보가 둘 이상이라 임의 선택하지 않았다는 뜻이며 실패나 오선택으로 계산하지 않는다. 실제 Roll20에서는 시트 워커가 만든 저장 항목 때문에 결과가 달라질 수 있다.

| # | 내장 식별값 | 시트 변형 | 로컬 원본 입력 | 추출 수치 | 자동 분리 실행 | 빈 캐릭터 인식 | 현행 Roll20 실검증 |
|---:|---|---|---|---:|---|---|---|
| 1 | `b3cd19dc20eb2710` | 자체제작 애정은 병열 | `C\[자체제작]애정은 병열\html.html`<br>`C\[자체제작]애정은 병열\css.css` | 334 / 81 / 405 | 통과 | 안전 모호 | 미실시 |
| 2 | `c31fd05b084bc43c` | 자체제작 영시영 | `C\[자체제작]영시영\html.html`<br>`C\[자체제작]영시영\css.css` | 209 / 81 / 405 | 통과 | 일치 | 미실시 |
| 3 | `63a2085d7f5fcc59` | 자체제작 호질 | `C\[자체제작]호질\html.html`<br>`C\[자체제작]호질\css.css` | 339 / 81 / 405 | 통과 | 안전 모호 | 미실시 |
| 4 | `5cab2ac801cda404` | Roll20 크툴루 뉴스 테마 | `C\[roll20] 크툴루 뉴스 테마 커스텀 시트\coc_7th_ed.html`<br>`...\coc_7th_ed.css`<br>`...\ko__chae.json` | 242 / 159 / 196 | 통과 | 일치 | 미실시 |
| 5 | `6bfaa0279ec11623` | 12시의 도밍게즈 | `C\12시의 도밍게즈(자체제작)\html.txt`<br>`...\css.txt` | 383 / 90 / 424 | 통과 | 안전 모호 | 미실시 |
| 6 | `42f7d7a429602033` | 겨울 테마 | `C\겨울 테마\[ⓒDAY9] 겨울 커스텀시트_html.txt`<br>`...\[ⓒDAY9] 겨울 커스텀시트_css.txt` | 388 / 91 / 424 | 통과 | 안전 모호 | 미실시 |
| 7 | `99888fc8321bfa35` | 람피온의 저택 | `C\람피온의 저택\html.html`<br>`...\css.css`<br>`...\번역.txt` | 1134 / 870 / 716 | 통과 | 안전 모호 | 미실시 |
| 8 | `db283d90e7ce3ebf` | 로튼 레이크 | `C\로튼 레이크\HTML.txt`<br>`...\CSS.txt`<br>`...\translation.txt` | 458 / 284 / 348 | 통과 | 일치 | 미실시 |
| 9 | `9b09d7edc1403192` | 섬툴루 | `C\섬툴루\sheet.html`<br>`...\style.css` | 406 / 252 / 638 | 통과 | 일치 | 미실시 |
| 10 | `897a7f3b9c6a8d78` | 수중단맛 | `C\수중단맛\html.html`<br>`...\css.css`<br>`...\번역.txt` | 1124 / 870 / 716 | 통과 | 안전 모호 | 미실시 |
| 11 | `cb64ac50518f0b60` | 스태그필드 | `C\스태그필드\스태그필드_html.txt`<br>`...\스태그필드_css.txt`<br>`...\translation.txt` | 202 / 119 / 172 | 통과 | 안전 모호 | 미실시 |
| 12 | `5627b5447e29051b` | 얼붙용 | `C\얼붙용\sheet.html`<br>`...\style.css` | 404 / 252 / 638 | 통과 | 안전 모호 | 미실시 |
| 13 | `4055c5e84d37f613` | 영삼영 | `C\영삼영(자체제작)\영삼영(함께 제작)\html.txt`<br>`...\css.txt` | 312 / 209 / 590 | 통과 | 안전 모호 | 미실시 |
| 14 | `43cc84d495364321` | 오사이비자 | `C\오사이비자\html.txt`<br>`...\css.txt`<br>`...\translation.txt` | 200 / 119 / 172 | 통과 | 안전 모호 | 미실시 |
| 15 | `280aaa54543fa2cb` | 천툴루, 헤윰 디자인 | `C\천툴루(디자인 헤윰님 자체제작)\html.html`<br>`...\css.css` | 187 / 72 / 374 | 통과 | 일치 | 미실시 |
| 16 | `985cd27c28db2ec5` | 크리그어 시트 1 | `C\크리그어 시트1\html.txt`<br>`...\css.txt`<br>`...\translation.txt` | 200 / 119 / 172 | 통과 | 안전 모호 | 미실시 |
| 17 | `333b740f1e467d01` | 타텍님 CoC 원본 | `C\타텍님 CoC 원본\html.html`<br>`...\css.css` | 388 / 91 / 424 | 통과 | 안전 모호 | 미실시 |
| 18 | `ff0b26c52105b05d` | Blue29 | `C\Blue29(자체제작)\html.html`<br>`...\css.css` | 360 / 244 / 638 | 통과 | 안전 모호 | 교체·재기동·현황 응답 확인 |
| 19 | `0a09356ad817043a` | CoC 블러디 메리 캐슬 | `C\CoC_블러디매리캐슬\html.html`<br>`...\css.css` | 422 / 253 / 2928 | 통과 | 일치 | 교체·재기동·현황 응답 확인 |
| 20 | `29faeb0167cef992` | CoC 일드네쥬 | `C\CoC_일드네쥬\html.html`<br>`...\css.css`<br>`...\ko.json` | 346 / 520 / 620 | 통과 | 안전 모호 | 미실시 |
| 21 | `5a49a6311b033377` | CoC Pair Custom Sheet v1.0.0 | `C\CoC_pair_custom_sheet 판매 v.1.0.0\html.html.txt`<br>`...\style.css.txt` | 206 / 129 / 246 | 통과 | 안전 모호 | 미실시 |
| 22 | `21cbd9bcaf5c2ed4` | 천량성님 커스텀시트 | `T\망종\천량성님 커스텀시트\coc.html`<br>`...\coc.css` | 331 / 90 / 424 | 통과 | 일치 | 교체·재기동·현황 응답 확인 |
| 23 | `4ef69d1ea6666110` | 영시영 H님 커미션 1부 | `T\영시영\H님 커미션\시트\1부 HTML.html`<br>`...\1부 CSS.css`<br>`...\번역.txt` | 1004 / 808 / 180 | 통과 | 일치 | 미실시 |
| 24 | `4ffca055eb552326` | Roll20 공개 Call of Cthulhu | `M\Call_of_Cthulhu\Call_of_Cthulhu.html`<br>`...\Call_of_Cthulhu.css` | 201 / 63 / 0 | 통과 | 안전 모호 | 미실시 |
| 25 | `982a8cbae9128aea` | Roll20 공개 Call of Cthulhu 2th Ed French | `M\Call_of_Cthulhu_2th_Ed_French\Call_of_cthulhu_french.html`<br>`...\Call_of_cthulhu_french.css` | 200 / 63 / 223 | 통과 | 안전 모호 | 미실시 |
| 26 | `c236bcff42e9a873` | Roll20 공개 Call of Cthulhu 6th Ed | `M\Call_of_Cthulhu_6th_Ed\call_of_cthulhu_v6.html`<br>`...\call_of_cthulhu_v6.css`<br>`...\translation.json`<br>`...\translations\ko.json` | 267 / 99 / 198 | 통과 | 안전 모호 | 미실시 |
| 27 | `e1376f830eba05c9` | Roll20 공개 Call of Cthulhu 6th Ed French | `M\Call_of_Cthulhu_6th_Ed_French\Call_of_Cthulhu_V6.html`<br>`...\Call_of_Cthulhu_V6.css` | 258 / 98 / 99 | 통과 | 안전 모호 | 미실시 |
| 28 | `c653c0852b277de6` | Roll20 공개 Call of Cthulhu 7th Ed | `M\Call_of_Cthulhu_7th_Ed\coc_7th_ed.html`<br>`...\coc_7th_ed.css`<br>`...\translation.json`<br>`...\translations\ko.json` | 1613 / 879 / 744 | 통과 | 일치 | 교체·재기동·현황·근력 굴림 확인 |
| 29 | `3916f9196f8c21ed` | Roll20 공개 Call of Cthulhu 7th Ed German | `M\Call_of_Cthulhu_7th_Ed - German\coc_7th_ed.html`<br>`...\coc_7th_ed.css` | 193 / 65 / 116 | 통과 | 안전 모호 | 미실시 |
| 30 | `2f86ba472bdc1c42` | Roll20 공개 Call of Cthulhu 7th Ed Traditional Chinese | `M\Call_of_Cthulhu_7th_Ed_Chinese_Traditional\coc_7th_ed.html`<br>`...\coc_7th_ed.css`<br>`...\translation.json`<br>`...\translations\ko.json` | 311 / 155 / 1517 | 통과 | 안전 모호 | 미실시 |
| 31 | `f08a8b2d95ebc3cb` | Roll20 공개 Call of Cthulhu 7th Ed French | `M\Call_of_Cthulhu_7th_Ed_French\coc_7th_ed.html`<br>`...\coc_7th_ed.css`<br>`...\Translation.json`<br>`...\translations\ko.json` | 194 / 65 / 116 | 통과 | 안전 모호 | 미실시 |
| 32 | `1b678812ac2dada9` | Roll20 공개 Call of Cthulhu Dark Ages | `M\Call_of_Cthulhu_DA\Call_of_Cthulhu_Dark_Ages.html`<br>`...\Call_of_Cthulhu_Dark_Ages.css` | 251 / 434 / 99 | 통과 | 안전 모호 | 미실시 |
| 33 | `8165ce77b3301b5d` | Roll20 공개 Call of Cthulhu Spanish | `M\Call_of_Cthulhu_Spanish\Call_of_Cthulhu.html`<br>`...\Call_of_Cthulhu.css`<br>`...\translation.json`<br>`...\translations\ko.json` | 223 / 66 / 104 | 통과 | 안전 모호 | 미실시 |
| 34 | `cf240692b20596fc` | Roll20 공개 Achtung! Cthulhu CoC 7 | `M\achtung-cthulhu-coc7\achtung-cthulhu-coc7.html`<br>`...\achtung-cthulhu-coc7.css`<br>`...\translation.json`<br>`...\translations\ko.json` | 1097 / 179 / 551 | 통과 | 안전 모호 | 미실시 |

## 현재 자동 검사 명령과 결과

2026-08-31 현행 작업 파일에서 아래 명령을 다시 실행했다.

| 명령 | 종료 코드 | 결과 |
|---|---:|---|
| `node tools/check-sheet-contract.js` | 0 | HTML·CSS·번역·반복 행·선택 방식 추출 검사 통과 |
| `node tools/check-sheet-room-recognition.js` | 0 | 방 저장 항목 기반 인식 검사 통과 |
| `node tools/check-sheet-helper.js` | 0 | 내장 34종 순서·내용 해시, 손상 데이터 거부, 34종 대표 굴림 결과와 컷인 키, 빈 캐릭터 안전 처리 검사 통과 |
| `node tools/check-sheet-cutin.js` | 0 | 판정 결과 전달, 비밀 판정 제외, 안정 키 우선순위와 구형 설정 보존 검사 통과 |
| `node tools/check.js` | 0 | 위 시트 검사, Handout/Cutin 최적화 검사, 전체 Scene Suite 릴리스 검사 통과 |

`tools/check-sheet-helper.js`는 34종의 순서와 디코딩된 내장 데이터 SHA-256 `1b50e8a19c41e13f899e67ead7cab6875e27134b5af36e82bf660c9966ce523e`를 고정한다. 각 시트를 하나씩 분리해 대표 굴림 결과와 컷인 연결 키를 검사하지만, 34종 후보가 동시에 있는 실제 Roll20 캐릭터를 대신하지는 않는다. 더 깊은 명령·상태 검사는 천량성, 자체제작 호질, Blue29, 블러디 메리 캐슬, 천툴루, Roll20 공개 7판 같은 대표 구조를 중심으로 한다.

## Roll20 실검증 증거와 남은 절차

2026-08-31 개발용 Sheet Sandbox에서 로컬 HTML·CSS·번역을 실제 적용하고 Mod API를 재시작한 뒤, 현재 `As` 캐릭터로 `!!새로고침`, `!!상태`를 실행했다.

- Blue29: 기능/판정 66개와 현재 수치 응답 확인.
- 천량성님 커스텀시트: 기능/판정 66개, 광기 `실시간/요약`, 기타 주사위 4개, 보너스·패널티 4개 응답 확인.
- CoC 블러디 메리 캐슬: 기능/판정 66개, 광기 `일반/펄프 × 실시간/요약` 4개, 기타 주사위 3개, 보너스·패널티 4개 응답 확인.
- Roll20 공개 7판: API 명령 응답, 현재 저장된 캐릭터에서 기능/판정 10개와 현재 수치 응답, `!!근력`의 후보 선택 뒤 원본 `STR Roll` 템플릿 실행 확인.

공식 7판 적용 직후 기존 캐릭터에 없는 시트 필드를 읽는 Roll20 시트 워커 경고가 다수 출력됐지만 `SyntaxError`나 스크립트 비활성화는 없었고, 시트 헬퍼 명령과 굴림은 응답했다. 이 실측은 대표 구조 4종의 증거이며 나머지 30종의 Roll20 실측을 대신하지 않는다.

- 이전 문서의 0.6.6 실측은 현행 0.6.17의 통과 증거로 재사용하지 않았다.
- 남은 30종, 특히 빈 캐릭터에서 안전 모호였던 시트는 실제 시트 워커가 생성한 저장 항목으로 후보가 하나로 좁혀지는지 후속 확인해야 한다.
- 각 원본 HTML·CSS·번역을 Sheet Sandbox에 적용한 뒤 Mod API를 재시작하고 `!!점검`, `!!상태`, 대표 일반·비밀·선택 방식 굴림, 시트 원본 버튼 직접 굴림, 컷인 수신을 확인한다.
- 반복 구역이 있는 시트는 행 추가·수정·이름 변경·복제·순서 이동·삭제 뒤 다시 확인한다.
- 시대·펄프·공개 범위에 따라 항목이 바뀌는 시트와 굴림 수가 큰 시트는 각 상태를 따로 확인한다.
- 기존 실제 캠페인 방은 관찰 전용으로 두고, 검증은 Sheet Sandbox 또는 별도 시험 방에서만 수행한다.

## 이번 범위에 넣지 않는 로컬 원본 3종

아래 3종은 접근 가능한 유효한 CoC 원본이지만 현재 34종에는 들어 있지 않다. 이번 성능 최적화 범위에서는 새로 넣지 않으며, 호환된다고 간주하지도 않는다. 추출 수치가 다른 내장 시트와 같더라도 굴림 구조가 같은 것으로 확인되지 않았으므로 수치만으로 합치면 안 된다.

| 후속 식별값 | 로컬 원본 입력 | 추출 수치 | 현재 상태와 검증 공백 |
|---|---|---:|---|
| `d96cc183b7a4f74d` | `C\영시영(조공)\html.txt`<br>`...\css.txt` | 404 / 252 / 638 | 미내장. 자동 실행·동시 인식·Roll20 Sheet Sandbox 후속 검증 필요 |
| `f7859df3b6e4b842` | `C\호질\html.txt`<br>`...\css.txt`<br>`...\translation.txt` | 200 / 119 / 172 | 미내장. 자동 실행·동시 인식·Roll20 Sheet Sandbox 후속 검증 필요 |
| `e892a4bebf8b6a01` | `C\Libra for Vendetta(자체제작)\html.html`<br>`...\css.css` | 312 / 209 / 590 | 미내장. 자동 실행·동시 인식·Roll20 Sheet Sandbox 후속 검증 필요 |

참고로 `C\html.html`과 `C\css.css`는 속성 5개, 굴림 0개의 조각 파일이라 완성 시트로 세지 않았으며 후속 3종에도 포함하지 않았다.

## 증거 등급

- **로컬 원본 확인**: 위 경로의 실제 HTML·CSS·번역 파일을 읽어 얻은 시트 정의와 추출 수치다.
- **자동 검사**: Node 기반 파서와 Roll20 API 모의 하네스에서 얻은 결과다. 구문·해시·모의 실행의 통과이며 실제 브라우저, 시트 워커, Roll20 채팅 렌더링의 통과가 아니다.
- **Roll20 실검증**: 같은 버전의 배포 코드를 Sheet Sandbox 또는 별도 시험 방에 넣고, 시트 적용과 Mod API 재시작 뒤 UI·채팅·콘솔 결과를 직접 확인한 경우에만 기록한다. 현행 0.6.17은 대표 4종에 이 등급의 증거가 있고 나머지 30종은 아직 없다.
