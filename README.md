# Scene Suite 확장 버전

Roll20에서 대사, 스탠딩, 오디오, 배경, APNG, 핸드아웃, 컷인, 캐릭터 이미지를 함께 다루는 Mod 스크립트 모음입니다.

각 코드는 단독으로 설치할 수 있으며, `00_scene_director.js`를 함께 설치해 각 코드를 연결해 관리가 가능합니다.

## 사용법

1. 필요한 기능을 선택
3. 필요한 값들을 기입
4. `코드 복사` 또는 `파일 받기` 버튼을 누름
5. Roll20 방에서 `새 모드 스크립트`에 붙여 넣고 저장

## 기능

| 파일 | 역할 | 단독 사용 가능 |
| --- | --- | --- |
| `00_scene_director.js` | 설치 상태, 공통 시간, 도움말, 기능 연결 | 가능 |
| `01_narrator_director.js` | 순차 출력, 일시정지, 취소, 같은 타이밍의 연출 | 가능 |
| `02_audio_bridge.js` | 쥬크박스 제목으로 재생, 중지, 반복, 볼륨, 페이드 | 가능 |
| `03_visual_dialogue_compatible.js` | 대사창, 스탠딩, 표정, 배경, 스크립트 출력 | 가능 |
| `04_image_switcher_compatible.js` | 카드덱과 같은 이름의 토큰 이미지 전환 | 가능 |
| `05_dialog_overlay_compatible.js` | 별도 대사창과 스크립트 출력 | 가능 |
| `06_apng_director.js` | 전체 화면 또는 지정 영역 애니메이션 | 가능 |
| `07_handout_director.js` | 핸드아웃 보기 권한과 공개 알림 | 가능 |
| `08_cutin_director.js` | 카드, URL, 핸드아웃 표지 컷인 | 가능 |
| `09_avatar_director.js` | 캐릭터 이미지와 맵 토큰 변경 | 가능 |
| `10_sheet_helper.js` | 방에 적용된 시트를 인식해 명령어로 실행, 자동 트래킹 | 가능 |

## 출처와 배포 조건

`01_narrator_director.js`, `03_visual_dialogue_compatible.js`, `04_image_switcher_compatible.js`는 양천일염님의 공개 스크립트를 바탕으로 만든 확장 버전입니다. 자세한 주소는 [THIRD_PARTY_NOTICE.md](THIRD_PARTY_NOTICE.md)에 적었습니다.

가공 및 재배포는 [원본 재배포 정책](https://github.com/kibkibe/roll20-api-scripts/wiki/API-%EC%8A%A4%ED%81%AC%EB%A6%BD%ED%8A%B8-%EA%B0%80%EA%B3%B5-%EB%B0%8F-%EC%9E%AC%EB%B0%B0%ED%8F%AC-%EC%A0%95%EC%B1%85)에 따라 허용되며, 원본이 포함된 확장 코드는 CC BY-NC 조건으로 배포합니다.
