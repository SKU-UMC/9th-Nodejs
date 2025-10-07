# Chapter 3. API URL의 설계 & 프로젝트 세팅 - Node.js

0주차에서 깃허브에서 클론받아오는 형식으로 프로젝트를 실행해보셨던 분들도 다시 한 번 해보는 것을 추천드립니다! 

<aside>
<img src="https://www.notion.so/icons/list_gray.svg" alt="https://www.notion.so/icons/list_gray.svg" width="40px" /> **목차**

</aside>

### Node.js 설치

Node.js 프로젝트를 설정하기 위해서는 Node.js 설치를 먼저 해야 합니다. 추천드리는 버전은 Node.js v22(최신 LTS 버전)입니다.

아래 Node.js 페이지에서 다운로드 하신 후 설치를 진행해주세요.

[Node.js — Run JavaScript Everywhere](https://nodejs.org/)

다운로드가 완료되면 터미널에서 아래 명령어를 통해 Node.js, npm이 잘 설치되었는지 확인하실 수 있습니다. (npm은 Node.js를 설치할 때 함께 자동으로 설치됩니다.)

```bash
node -v
npm -v
```

```bash
$ node -v
v22.18.0

$ npm -v
10.9.3
```

### Node.js 설정 (VSCode)

이제 VSCode를 켜신 후, 터미널을 이용해 작업을 하고 싶은 폴더의 경로로 접근해주세요. 폴더 이름은 자유롭게 정해주세요.

![원하는 경로(폴더)에서 터미널 접속](Chapter%203%20API%20URL%EC%9D%98%20%EC%84%A4%EA%B3%84%20&%20%ED%94%84%EB%A1%9C%EC%A0%9D%ED%8A%B8%20%EC%84%B8%ED%8C%85%20-%20Node%20js%20278b57f4596b81f0b45ef08657e5c317/CleanShot_2024-09-07_at_14.20.552x.png)

원하는 경로(폴더)에서 터미널 접속

Node.js 프로젝트에는 가장 먼저 `package.json` 파일이 필요합니다. `package.json` 파일을 생성하기 위해서, VSCode에 열린 터미널에서 아래 명령어를 입력해주세요.

```bash
npm init
```

이후 CLI에서는 엔터를 입력해 질문들을 확인하며 넘어가주시면 됩니다.

![CleanShot 2024-08-28 at 00.44.52@2x.png](Chapter%203%20API%20URL%EC%9D%98%20%EC%84%A4%EA%B3%84%20&%20%ED%94%84%EB%A1%9C%EC%A0%9D%ED%8A%B8%20%EC%84%B8%ED%8C%85%20-%20Node%20js%20278b57f4596b81f0b45ef08657e5c317/CleanShot_2024-08-28_at_00.44.522x.png)

위의 터미널 결과에서 `"main": "index.js"` 부분은 서버를 실행할 메인 파일이라고 생각해주세요. 기본 값은 `index.js` 이지만, 추후 `package.json` 파일을 수정해 변경할 수 있습니다.

이후 작업 디렉토리에는 `package.json` 파일이 생성되어 있을텐데, `package.json` 파일은 **프로젝트의 정보**를 나타내고 **다양한 의존성(라이브러리, 패키지) 버전**을 관리하고 설치하기 위해 사용하는 파일입니다.

npm을 통해 어떤 라이브러리들을 설치했는지, 어떤 버전으로 설치되었는지 등의 정보를 알 수 있습니다.

![`package.json` 파일이 생성되어 있다.](Chapter%203%20API%20URL%EC%9D%98%20%EC%84%A4%EA%B3%84%20&%20%ED%94%84%EB%A1%9C%EC%A0%9D%ED%8A%B8%20%EC%84%B8%ED%8C%85%20-%20Node%20js%20278b57f4596b81f0b45ef08657e5c317/CleanShot_2024-08-28_at_00.49.482x.png)

`package.json` 파일이 생성되어 있다.

npm 이외에도 yarn, pnpm, bun 등의 다양한 다른 패키지 매니저들도 유사하게 사용할 수 있습니다. 단, 같이 협업하는 다른 개발자들과 협의하여 하나의 패키지 매니저만 통일하여 사용해야 합니다. (본 워크북에서는 npm을 사용할 예정이에요.)

다양한 패키지 매니저들에 대해 궁금하신 분들은 아래 글을 참고해주세요.

[[React] JavaScript 패키지 매니저 비교](https://velog.io/@yeonddori/React-JavaScript-패키지-매니저-비교)

### Express

이번에 설치할 것은 Express라는 Node.js 서버 프레임워크입니다. 전세계에서 가장 보편적으로 많이 사용되는 Node.js 서버 프레임워크라고 보아도 될 것 같습니다.

[Express - Node.js 웹 애플리케이션 프레임워크](https://expressjs.com/ko/)

설치는 아래 명령어를 통해 진행해주세요.

```bash
npm install express@^5.0.0
```

<aside>
🚨

express는 꼭 `^5.0.0` 버전을 설치해주세요. 비동기 핸들러의 오류 핸들링을 정상적으로 처리하기 위해 꼭 필요합니다. (버전을 지정하지 않고 설치할 경우, 구버전인 `^4.x.x` 버전이 설치됩니다.)

</aside>

![CleanShot 2024-09-07 at 14.23.22@2x.png](Chapter%203%20API%20URL%EC%9D%98%20%EC%84%A4%EA%B3%84%20&%20%ED%94%84%EB%A1%9C%EC%A0%9D%ED%8A%B8%20%EC%84%B8%ED%8C%85%20-%20Node%20js%20278b57f4596b81f0b45ef08657e5c317/CleanShot_2024-09-07_at_14.23.222x.png)

`package.json` 파일을 확인해보면 아래와 같이 `dependencies` 부분에 `express` 패키지가 추가된 것을 볼 수 있습니다.

```json
{
  "name": "playground-umc-7th-nodejs",
  "version": "1.0.0",
  "description": "UMC 테스트 프로젝트",
  "main": "index.js",
  "scripts": {
    "test": "echo \"Error: no test specified\" && exit 1"
  },
  "author": "",
  "license": "ISC",
  "dependencies": {
    "express": "^5.0.1"
  }
}
```

→ 실행할 때 필요한 라이브러리들이 로컬 컴퓨터에 깔려있지 않더라도, 명령어만 치면 `package.json`에 명시된 내용을 보고 다시 라이브러리들을 설치할 수 있습니다!

그래서 프로젝트를 GitHub에 올릴 때, `.gitignore` 파일에는 `node_modules/`가 들어가게 됩니다. `package.json` 파일만 있으면 라이브러리들은 다시 그대로 설치가 가능하기 때문!

### Express 초기 파일 생성

가장 먼저, `src` 폴더 내에 `index.js` 파일을 생성해주세요.

![CleanShot 2024-09-07 at 20.52.16@2x.png](Chapter%203%20API%20URL%EC%9D%98%20%EC%84%A4%EA%B3%84%20&%20%ED%94%84%EB%A1%9C%EC%A0%9D%ED%8A%B8%20%EC%84%B8%ED%8C%85%20-%20Node%20js%20278b57f4596b81f0b45ef08657e5c317/CleanShot_2024-09-07_at_20.52.162x.png)

초기 파일을 생성해보겠습니다! 아래 Express 페이지에 공식 예제가 존재하는데, 이를 사용해보도록 하겠습니다. 아래의 코드를 복사해 `src/index.js`에 붙여넣어 주세요.

[Express "Hello World" 예제](https://expressjs.com/ko/starter/hello-world.html)

단, 기존 예제에서는 `express` 모듈을 불러올 때 CommonJS 방식을 사용하고 있어요. 최근에는 ES Module 방식을 주로 사용하므로, 해당 부분을 수정하도록 하겠습니다.

```jsx
// const express = require('express')  // -> CommonJS
import express from 'express'          // -> ES Module

const app = express()
const port = 3000

app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
```

실행을 해볼까요? 아래 명령어를 입력하고 결과를 기다려보겠습니다.

```bash
node src/index.js
```

잘 돌아가나요? 그럴 리 없어요! 

저는 아래와 같이 오류가 발생하는데, 여러분들도 동일하게 발생할까요? 오류를 잘 읽어보면, ES Module을 불러올 때 문제가 발생한 것 같습니다.

![CleanShot 2024-09-07 at 20.49.48@2x.png](Chapter%203%20API%20URL%EC%9D%98%20%EC%84%A4%EA%B3%84%20&%20%ED%94%84%EB%A1%9C%EC%A0%9D%ED%8A%B8%20%EC%84%B8%ED%8C%85%20-%20Node%20js%20278b57f4596b81f0b45ef08657e5c317/CleanShot_2024-09-07_at_20.49.482x.png)

아니면 실행은 됐는데, 뭔가 찝찝하게 경고문 같은 것이 떴을거에요!

![image.png](Chapter%203%20API%20URL%EC%9D%98%20%EC%84%A4%EA%B3%84%20&%20%ED%94%84%EB%A1%9C%EC%A0%9D%ED%8A%B8%20%EC%84%B8%ED%8C%85%20-%20Node%20js%20278b57f4596b81f0b45ef08657e5c317/image.png)

이렇게 되는 이유는 예전 버전에서는 무조건 밑에서 설명할 것처럼 “type”: “module”을 명시해 주어야만 실행이 되었는데요.

그런데 Node.js 버전이 올라가면서(특히 Node 20 이후) 정책이 조금 완화되어,

- `package.json`에 `"type": "module"`이 없어도
- 코드 안에서 `import` / `export`가 보이면
    
    👉 일단 **ESM으로 재해석해서 실행**해 주도록 정책이 바뀌었어요. 
    

다만, 이렇게 하면 정확한 타입 지정이 없으니 **성능 오버헤드**(“Reparsing as ES module…” 경고)가 생기고, 그래서 경고를 띄우는 거예요. 

아무튼 CommonJS가 아닌 ES Module을 사용하기 위해서는 별도의 처리가 필요합니다. 저희는 이를 위해 `package.json` 파일을 아래와 같이 수정해주도록 하겠습니다.

```jsx
{
  "name": "playground-umc-7th-nodejs",
  "type": "module",
  "version": "1.0.0",
  "description": "UMC 테스트 프로젝트",
  "main": "index.js",
  "scripts": {
    "test": "echo \"Error: no test specified\" && exit 1"
  },
  "author": "",
  "license": "ISC",
  "dependencies": {
    "express": "^5.0.1"
  }
}
```

ES Module을 사용하기 위해 `package.json` 파일에 `"type": "module"` 라인을 추가해주었습니다. 이후 개발에 신경써야 할 부분이 하나 있는데요, 미리 VSCode 설정도 추가해주도록 하겠습니다.

`.vscode` 폴더를 생성하고, 그 안에 `settings.json` 파일을 생성해주세요. 그리고 아래의 내용을 복사해주세요. 이 설정을 통해 앞으로 VSCode에서 자동으로 import 하는 모듈들은 `.js` 확장자와 함께 import 될 거예요. (ES Module 설정을 위해 필요한 내용)

```json
{
  "javascript.preferences.importModuleSpecifierEnding": "js"
}
```

![CleanShot 2024-09-07 at 20.51.23@2x.png](Chapter%203%20API%20URL%EC%9D%98%20%EC%84%A4%EA%B3%84%20&%20%ED%94%84%EB%A1%9C%EC%A0%9D%ED%8A%B8%20%EC%84%B8%ED%8C%85%20-%20Node%20js%20278b57f4596b81f0b45ef08657e5c317/CleanShot_2024-09-07_at_20.51.232x.png)

### Express 서버 실행하기

모든 세팅이 끝났으니 실행해봅시다! 먼저 `package.json` 파일의 `scripts`를 수정해주세요.

```json
{
  "name": "playground-umc-7th-nodejs",
  "type": "module",
  "version": "1.0.0",
  "description": "UMC 테스트 프로젝트",
  "main": "index.js",
  "scripts": {
    "test": "echo \"Error: no test specified\" && exit 1",
    "start": "node src/index.js"
  },
  "author": "",
  "license": "ISC",
  "dependencies": {
    "express": "^5.0.1"
  }
}
```

그리고 터미널에 아래 명령어를 입력해 Express 서버를 실행해보세요!

```bash
npm run start
```

![CleanShot 2024-09-07 at 14.42.20@2x.png](Chapter%203%20API%20URL%EC%9D%98%20%EC%84%A4%EA%B3%84%20&%20%ED%94%84%EB%A1%9C%EC%A0%9D%ED%8A%B8%20%EC%84%B8%ED%8C%85%20-%20Node%20js%20278b57f4596b81f0b45ef08657e5c317/CleanShot_2024-09-07_at_14.42.202x.png)

그리고 터미널에서 실행시켜주면 끝! 브라우저에서 `localhost:3000`에 접속하면 `Hello World!`가 떠 있을 거예요!

![CleanShot 2024-08-28 at 01.30.13@2x.png](Chapter%203%20API%20URL%EC%9D%98%20%EC%84%A4%EA%B3%84%20&%20%ED%94%84%EB%A1%9C%EC%A0%9D%ED%8A%B8%20%EC%84%B8%ED%8C%85%20-%20Node%20js%20278b57f4596b81f0b45ef08657e5c317/CleanShot_2024-08-28_at_01.30.132x.png)

### Nodemon

Nodemon은 간단히 말해, 여러분들을 편하게 만들어줄 모듈입니다. 프로젝트를 수정하고 저장할 때마다, Node.js 서버도 다시 재실행해주는 라이브러리입니다! 짱!

```bash
npm install --save-dev nodemon
```

그리고 `package.json` 파일의 `scripts`를 수정해주세요.

```json
{
  "name": "playground-umc-7th-nodejs",
  "type": "module",
  "version": "1.0.0",
  "description": "UMC 테스트 프로젝트",
  "main": "index.js",
  "scripts": {
    "test": "echo \"Error: no test specified\" && exit 1",
    "start": "node src/index.js",
    "dev": "nodemon --exec node src/index.js"
  },
  "author": "",
  "license": "ISC",
  "dependencies": {
    "express": "^5.0.1"
  },
  "devDependencies": {
    "nodemon": "^3.1.4"
  }
}
```

그리고 아래 명령어를 통해 실행해보세요!

```bash
npm run dev
```

![CleanShot 2024-09-07 at 14.44.40@2x.png](Chapter%203%20API%20URL%EC%9D%98%20%EC%84%A4%EA%B3%84%20&%20%ED%94%84%EB%A1%9C%EC%A0%9D%ED%8A%B8%20%EC%84%B8%ED%8C%85%20-%20Node%20js%20278b57f4596b81f0b45ef08657e5c317/CleanShot_2024-09-07_at_14.44.402x.png)

`src/index.js` 같은 파일들을 조금씩 수정하고 저장하면, Nodemon이 자동으로 서버를 다시 시작해줍니다. 아주 편리한 친구예요 :)