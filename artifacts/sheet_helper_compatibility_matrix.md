# Sheet Helper CoC 호환성 대조표

검증 대상은 실제 시트 원본 두 개입니다.

- 천툴루: `D:\훙냥냥\마렌상\티알\[중요]커스텀시트\CoC\천툴루(디자인 헤윰님 자체제작)\html.html`
- 공개 공식(legacy) 시트: `D:\훙냥냥\마렌상\roll20-character-sheets-master\Call_of_Cthulhu_7th_Ed\coc_7th_ed.html`

| 항목 | 천툴루 커스텀 시트 | 공개 공식(legacy) CoC 7판 시트 |
|---|---|---|
| 시트 판별 | 실제 `template_common`, `template_other`, `rand_maddess` 계약 사용 | 실제 `showskills` 속성이 있을 때만 공식 시트로 판별 |
| 기본 판정 | 시트와 같은 `coc` 템플릿과 `dice_type` 사용 | 시트와 같은 단일 굴림 `coc-1` 사용 |
| 보너스·패널티 | 시트의 `dice_type` 값을 읽어 3개 굴림 생성 | 공식 시트의 `coc` 3개 굴림과 선택값 사용 |
| 단축 명령 | `!!관찰력 보너스1`처럼 바로 실행 | 동일 |
| 자유 주사위 | 실제 `free_dice`와 `cocOther/free_roll` 사용 | `toggledr=1`일 때만 표시하고 `coc-dice-roll/diceroll` 사용 |
| 광기 발작 | `rand_maddess=1/2`에 따라 실시간·요약 실행 | `!!광기실시간`, `!!광기요약`으로 실제 시대·Pulp·혼합 템플릿 선택 |
| 일시적·장기적 광기 | 굴림 메뉴로 만들지 않고 시트 상태로 취급 | `temp_insane`, `indef_insane`을 굴림 종류로 취급하지 않음 |
| 명중부위 | 원본에 없으므로 표시·실행하지 않음 | `toggledr=1`일 때만 표시하고 `coc-body-hit-loc` 사용 |
| 행운 결정 | 원본에 없으므로 표시·임의 공식 생성 없음 | 원본에 없으므로 표시·임의 공식 생성 없음 |
| 광기 관련 기록 | 실제 3개 필드 중 값이 생성된 항목 표시 | `current_mental_condition` 포함 원본 4개 필드 표시 |
| 원본 버튼 결과 추적 | `cocOther`의 광기·자유 주사위 결과 인식 | `coc-dice-roll`, `coc-body-hit-loc`, 공식 광기·판정·공격 결과 인식 |
| 모호한 3개 굴림 | 선택된 주사위가 확인될 때만 성공수준 연결 | `dice_type`이 없는 네이티브 3개 굴림은 잘못 추측하지 않고 건너뜀 |
| 자동 검사 | 통과 | 통과 |
| Roll20 실검증 | 판정, 실시간·요약 광기, 자유 주사위, 없는 메뉴 예외처리, 광기 기록 변경 감지 확인 | 시트 파일 업로드 권한이 없어 아직 미실행 |

## 검증 결과

- `node tools/check-sheet-helper.js`: 통과
- `node tools/check-sheet-cutin.js`: 통과
- `node tools/check.js`: 통과
- 천툴루 Roll20 방: `!!관찰력 보너스1`, `!!광기실시간`, `!!광기요약`, `!!자유주사위` 실행 확인
- 천툴루 Roll20 방: `phobias_manias` 변경값이 `!!상태`에 즉시 반영되는 것을 확인하고 테스트 속성까지 원복
- 천툴루 Roll20 방: 최종 API 콘솔 추가 오류 0건
- 공개 공식 시트: 원본 HTML 계약과 로컬 실행 검사까지 확인. Roll20 방 교체 검증은 Chrome 확장 프로그램의 파일 URL 접근 권한이 필요합니다.
