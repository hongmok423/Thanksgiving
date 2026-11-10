# 서울광염교회 2026 추수감사절기구제 통합관리

현재 집행확정 26개 독립사업: 145,025,514원. 오늘을 사는 레위인 하위사업 2건(10-1 11,544,583원, 10-2 2,025,440원)은 4,000만원 상위 배정액에 이미 포함되므로 합계에서 제외합니다. 레위인 하위 집행액은 13,570,023원, 잔여액은 26,429,977원입니다. 예정사업 2건 4,000,000원은 별도 유지합니다.

## GitHub Pages 배포

1. Repository > Settings > Pages
2. Build and deployment > Source를 **GitHub Actions**로 지정
3. Actions 탭에서 **Deploy Thanksgiving dashboard to GitHub Pages** 실행 성공 여부 확인
4. 사이트: https://hongmok423.github.io/Thanksgiving/

GitHub Pages를 일반 공개 사이트로 배포하면 URL을 아는 누구나 사이트의 **초기 사업명과 금액**을 볼 수 있습니다. 공개 사이트에는 개인정보를 넣지 마십시오. 비공개 이용이 필수라면 인증을 갖춘 다른 호스팅 서비스를 쓰세요.

## 현재 저장 상태

- 기본 상태: 변경사항은 해당 기기의 브라우저 localStorage에 즉시 저장됩니다.
- 클라우드 설정이 되지 않으면 아이패드와 맥 기록은 자동으로 공유되지 않습니다.
- JSON 백업 다운로드/불러오기 가능.
- GitHub 코드는 웹사이트 소스이며, 웹사이트에서 체크한 내용은 GitHub에 직접 커밋되지 않습니다.

## 맥과 아이패드 동기화 설정 (Firebase)

> 아직 연결되지 않았습니다. 개인 Google 계정의 Firebase 프로젝트 설정이 필요합니다.

1. https://console.firebase.google.com/ 에서 프로젝트 생성.
2. Authentication > Sign-in method에서 **Google** 제공업체 활성화.
3. Authentication > Settings > Authorized domains에서 사이트 도메인 `hongmok423.github.io` 추가.
4. Cloud Firestore 데이터베이스 생성. 운영 모드 권장.
5. Project Settings > Your apps > Web app에서 Firebase 구성값 확인.
6. 관리자 Google 로그인으로 uid를 확인한 뒤 `firebase-config.js`의 `ownerUid` 및 `firestore.rules`의 `REPLACE_WITH_YOUR_FIREBASE_GOOGLE_UID`를 **동일한 uid**로 지정합니다. (예: Authentication > Users 화면에서 UID 확인)
7. Firebase Console > Firestore Database > Rules에 `firestore.rules`를 적용하고 **Publish**.
8. `firebase-config.js`에 **웹 앱 구성값**을 입력하고 GitHub에 반영합니다. 관리자 비밀번호나 서비스 계정 비밀키는 입력하지 마세요.
9. 클라우드 로그인 이후 '클라우드 동기화 연결됨/저장 완료' 상태를 확인합니다. 다른 기기에서도 **동일한 Google 계정**으로 로그인해 변경이 복원되는지 확인합니다.
10. 우선 JSON 백업을 내려받으세요. 처음 연결 전에 서로 다른 기기에 기록이 있다면 마지막에 수정한 쪽을 수동으로 백업해 복원한 후 연결하는 것이 안전합니다.

Firestore 보안 규칙은 관리자 Google UID만 `thanksgiving/dashboard-2026` 문서를 읽고 쓸 수 있도록 제한합니다. 규칙이 적용되기 전에 실제 민감한 내용을 올리지 마세요.

## 운영 주의사항

- 화면에 있는 초기 사업 데이터는 `index.html`에 공개 코드로 포함되어 있으므로 사이트 자체가 공개라면 누구나 해당 초기 값을 볼 수 있습니다. **온라인 기록**은 별도 Firebase 접근 규칙으로만 보호됩니다.
- 날짜가 비슷한 다른 기기에서 동시에 수정하면 저장 충돌을 방지하는 정교한 버전 관리가 추가로 필요합니다. 동시 편집을 피하고 주기적으로 JSON 파일을 백업해 주세요.
- 구제 대상자의 주민등록번호, 주소, 연락처, 건강정보 등 민감한 개인정보는 등록하지 마세요.
