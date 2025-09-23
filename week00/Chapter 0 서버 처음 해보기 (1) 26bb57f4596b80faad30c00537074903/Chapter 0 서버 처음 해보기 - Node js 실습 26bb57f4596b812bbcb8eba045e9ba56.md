# Chapter 0. 서버 처음 해보기 - Node.js 실습

<aside>
<img src="https://www.notion.so/icons/list_gray.svg" alt="https://www.notion.so/icons/list_gray.svg" width="40px" /> **목차**

</aside>

### 👉 VSCode, Node.js 설치하기

VSCode는 코드를 입력하고 수정하는 IDE로, Node.js 개발에서는 가장 많이 사용되는 IDE 도구 중 하나예요. 아래 페이지에서 다운로드 하신 후 설치를 진행해주세요.

[](https://code.visualstudio.com/)

Node.js 프로젝트를 설정하기 위해서는 Node.js 설치를 먼저 해야 합니다. 추천드리는 버전은 Node.js v20(최신 LTS 버전)입니다.

아래 Node.js 페이지에서 다운로드 하신 후 설치를 진행해주세요.

[Node.js — Run JavaScript Everywhere](https://nodejs.org/)

### 👉 저장소 다운로드 받기

Git 명령어가 설치되어 있다면, 터미널에서 아래 명령어를 입력해 저장소를 Clone 받아주세요.

```bash
git clone https://github.com/sudosubin/umc-7th-nodejs-first-run
```

Git 명령어를 찾을 수 없다면, 아래 페이지에 직접 접속해 코드를 다운로드 받아주세요.

[GitHub - sudosubin/umc-7th-nodejs-first-run: UMC 7기 Node.js 첫 시작 저장소](https://github.com/sudosubin/umc-7th-nodejs-first-run)

![CleanShot 2024-09-07 at 14.16.36@2x.png](Chapter%200%20%EC%84%9C%EB%B2%84%20%EC%B2%98%EC%9D%8C%20%ED%95%B4%EB%B3%B4%EA%B8%B0%20-%20Node%20js%20%EC%8B%A4%EC%8A%B5%2026bb57f4596b812bbcb8eba045e9ba56/CleanShot_2024-09-07_at_14.16.362x.png)

저장소를 Clone, 또는 코드를 다운로드 받은 후 압축을 해제한 폴더로 이동해 VSCode를 열어주시면 됩니다. `code .` 을 통해 터미널에서 VSCode를 바로 실행할 수도 있고, 우선 VSCode를 여신 후 폴더를 선택해서 여실 수도 있습니다.

![91616.png](Chapter%200%20%EC%84%9C%EB%B2%84%20%EC%B2%98%EC%9D%8C%20%ED%95%B4%EB%B3%B4%EA%B8%B0%20-%20Node%20js%20%EC%8B%A4%EC%8A%B5%2026bb57f4596b812bbcb8eba045e9ba56/91616.png)

![CleanShot 2024-09-07 at 11.43.12@2x.png](Chapter%200%20%EC%84%9C%EB%B2%84%20%EC%B2%98%EC%9D%8C%20%ED%95%B4%EB%B3%B4%EA%B8%B0%20-%20Node%20js%20%EC%8B%A4%EC%8A%B5%2026bb57f4596b812bbcb8eba045e9ba56/CleanShot_2024-09-07_at_11.43.122x.png)

![19968.png](Chapter%200%20%EC%84%9C%EB%B2%84%20%EC%B2%98%EC%9D%8C%20%ED%95%B4%EB%B3%B4%EA%B8%B0%20-%20Node%20js%20%EC%8B%A4%EC%8A%B5%2026bb57f4596b812bbcb8eba045e9ba56/19968.png)

### 👉 의존성 설치하기

VSCode에서 터미널을 열어주세요! 터미널을 열기 위해서는 아래 명령어를 통해 `Command Palette`를 먼저 열어주세요.

- Windows: Ctrl + Shift + P
- macOS: ⌘ + Shift + P

그리고 `View: Toggle Terminal` 를 입력해서 터미널을 여실 수 있습니다.

터미널에 아래의 명령어를 입력해주세요. 명령어의 실행이 실패한다면 Node.js가 잘 설치되어 있는지 다시 한 번 확인해주세요.

- *노드 설치했는데도 오류가 뜬다면?*
    
      일단 정말로 Node.js 설치가 되었는지 제대로 확인해보기 위해 터미널에 
    
    ```jsx
    node -v
    npm -v 
    ```
    
    를 한번 입력해 봅니다. 둘다 버전이 뜨면 설치는 정상적으로 된거에요!  
    
    1. 터미널이 켜져 있는 폴더 위치를 한번 확인해봅시다! 반드시 클론해온 프로젝트 안이어야 해요 
    2. 설치 직후 환경변수가 반영되지 않았을 수 있으니 컴퓨터 재부팅을 한번 해봅시다 

```bash
npm install
```

![이렇게 설치가 잘 마무리되면 성공!](Chapter%200%20%EC%84%9C%EB%B2%84%20%EC%B2%98%EC%9D%8C%20%ED%95%B4%EB%B3%B4%EA%B8%B0%20-%20Node%20js%20%EC%8B%A4%EC%8A%B5%2026bb57f4596b812bbcb8eba045e9ba56/CleanShot_2024-09-07_at_14.18.072x.png)

이렇게 설치가 잘 마무리되면 성공!

### 👉 Node.js 서버 실행하기

의존성이 모두 잘 설치되었다면, 아래 명령어를 입력해 서버를 실행해주세요.

```bash
npm run start
```

![이렇게 서버가 잘 실행되면 성공!](Chapter%200%20%EC%84%9C%EB%B2%84%20%EC%B2%98%EC%9D%8C%20%ED%95%B4%EB%B3%B4%EA%B8%B0%20-%20Node%20js%20%EC%8B%A4%EC%8A%B5%2026bb57f4596b812bbcb8eba045e9ba56/CleanShot_2024-09-07_at_14.18.352x.png)

이렇게 서버가 잘 실행되면 성공!

그리고 브라우저에 들어가서 해당 url(localhost:3000)을 입력하여 접속하고, 다음과 같은 화면이 잘 나오면 성공입니다!

![CleanShot 2024-09-07 at 11.51.38@2x.png](Chapter%200%20%EC%84%9C%EB%B2%84%20%EC%B2%98%EC%9D%8C%20%ED%95%B4%EB%B3%B4%EA%B8%B0%20-%20Node%20js%20%EC%8B%A4%EC%8A%B5%2026bb57f4596b812bbcb8eba045e9ba56/CleanShot_2024-09-07_at_11.51.382x.png)

### 👉 코드 둘러보기

실습을 모두 잘 마쳤다면, VSCode에서 코드를 둘러보며 살펴보세요. 많은 코드가 있지는 않지만 조금씩 수정해보거나, 함수와 모듈들을 Google에 검색해보며 미리 익숙해지는 것도 좋을 거예요 :)

+) 😀 참고로 서버 끄는 단축키는 Ctrl+C 입니다! (Window, MacOS 모두)