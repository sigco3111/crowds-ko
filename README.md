# 군중과 길찾기 (Crowds and navigation) — 한국어판

Patch의 [Crowds and navigation](https://patch.gg/patch/crowds)을 한국어로 옮긴 비공식 한글판입니다. 원작자 및 Patch와 무관한 번역본입니다.

**플레이:** https://sigco3111.github.io/crowds-ko/

## 소개

three.js로 만든 작은 디오라마 위에서 마네킹 군중이 벽과 서로를 피해 길을 찾아 흘러가는 데모입니다. 게임 엔진들이 쓰는 길찾기 라이브러리 Recast & Detour가 브라우저에서 그대로 돌아갑니다.

- 왼쪽 클릭: 군중을 그곳으로 보냅니다
- 오른쪽 클릭: 돌 블록을 놓아 길을 막습니다 (다시 클릭하면 치웁니다)
- 드래그: 화면 회전, 스크롤: 확대/축소

## 주요 기능

- 레벨 3종: 장터(집 뒤 골목), 성벽(성벽 위까지 오르는 경사로), 생울타리 미로(길이 여러 갈래)
- 군중 규모 10~200명, 속도 1~6 m/s 조절
- 실시간 장애물: 블록을 놓으면 내비메시가 즉시 다시 깎이고 군중이 다른 길을 찾습니다
- 내비메시(걸을 수 있는 영역) 표시, 개인 공간, 어슬렁거리기 설정
- 도착한 사람들은 한 자리를 두고 밀지 않고 각자 자리에 섭니다

## 스크린샷

(배포본 화면은 docs/screenshots/ 에 있습니다)

## 설치 및 실행

```bash
npm install
npm run build   # dist/ 에 정적 파일 생성
```

개발 서버: `npm run dev` (http://127.0.0.1:5381)

빌드 결과물은 상대 경로를 쓰는 완전 정적 파일이라 어디에나 올릴 수 있습니다. 이 저장소는 docs/ 폴더를 GitHub Pages로 배포합니다.

## 기술 메모

- 길찾기: Recast & Detour (Mikko Mononen, zlib)를 recast-navigation-js 0.44.0 (Isaac Mason, MIT)의 단일 스레드 빌드로 사용 — WebAssembly가 내장돼 별도 파일 요청이 없습니다
- three.js 0.186.1, N8AO(앰비언트 오클루전), vite 8 빌드
- 길찾기 API와 군중 로직: src/navigation.js, src/crowd.js (화면을 그리지 않는 순수 로직)
- 인스턴스드 마네킹: src/figures.js, public/models/mannequin.glb
- 사운드 없음

## 라이선스 및 원작 크레딧

- 이 저장소의 코드: MIT © 2026 Patch ([LICENSE](LICENSE))
- Recast & Detour: zlib © 2009 Mikko Mononen과 기여자들 — third-party/LICENSE-recastnavigation.txt
- recast-navigation-js: MIT © 2025 Isaac Mason — third-party/LICENSE-recast-navigation-js.txt
- N8AO: MIT (N8python), postprocessing: Zlib (Raoul van Rüschen), three.js: MIT
- 마을 모델: Kenney Fantasy Town Kit 2.0 (CC0), 성 모델: Kenney Castle Kit (CC0)
- 마네킹: Patch (CC0), 애니메이션 클립: Quaternius Universal Animation Library 1·2 (CC0)
- 폰트: Red Hat Mono (SIL Open Font License 1.1) — fonts/OFL-red-hat-mono.txt
- 부품별 출처 정리: [LICENCE-NOTES.md](LICENCE-NOTES.md), [CREDITS.txt](CREDITS.txt)
