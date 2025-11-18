# Chapter 7. Express 미들웨어 & API 응답 통일 & 에러 핸들링 - Express 미들웨어 (1)

<aside>
<img src="https://www.notion.so/icons/list_gray.svg" alt="https://www.notion.so/icons/list_gray.svg" width="40px" /> **목차**

</aside>

## 👉 미들웨어 사용해보기

![Untitled](Chapter%207%20Express%20%EB%AF%B8%EB%93%A4%EC%9B%A8%EC%96%B4%20&%20API%20%EC%9D%91%EB%8B%B5%20%ED%86%B5%EC%9D%BC%20&%20%EC%97%90%EB%9F%AC%20%ED%95%B8%EB%93%A4%EB%A7%81%20-%20Expr/Untitled.png)

Express 내에서 미들웨어는 요청과 응답에 대한 정보를 사용해서 필요한 처리를 진행할 수 있도록 분리된 독립적인 함수입니다.

요청과 응답의 중간에서 요청과 응답 객체를 처리하거나, 다음 미들웨어를 실행시킬 수 있도록 하죠. HTTP 응답이 마무리 될 때까지 미들웨어 동작 사이클이 실행됩니다.

아래 예제가 어떻게 흘러가는지 볼까요?

```jsx
import express from 'express';

const app = express();
const port = 3000;

const myLogger = (req, res, next) => {
    console.log("LOGGED");
    next();
}

app.use(myLogger);

app.get('/', (req, res) => {
    console.log("/");
    res.send('Hello UMC!');
});

app.get('/hello', (req, res) => {
    console.log("/hello");
    res.send('Hello world!');
});

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
});
```

미들웨어는`app.use` 와 함께 사용됩니다. 이 코드에서는 `app.use(myLogger)` 가 됩니다. 

`app.use` 에 매개변수가 req, res, next인 함수를 넣으면 됩니다. 

그러면 클라이언트가 요청을 보낼 때마다 `LOGGED`라는 메시지를 콘솔에 출력합니다.

그 후 `/`에 접속 시 화면에 `/` 경로의 미들웨어 함수가 실행됩니다.

![Untitled](Chapter%207%20Express%20%EB%AF%B8%EB%93%A4%EC%9B%A8%EC%96%B4%20&%20API%20%EC%9D%91%EB%8B%B5%20%ED%86%B5%EC%9D%BC%20&%20%EC%97%90%EB%9F%AC%20%ED%95%B8%EB%93%A4%EB%A7%81%20-%20Expr/Untitled%201.png)

만약, `/hello`로 접속한다면 `LOGGED` 라는 메시지가 콘솔에 출력되고, `/hello` 경로의 미들웨어 함수가 실행되겠죠.

![Untitled](Chapter%207%20Express%20%EB%AF%B8%EB%93%A4%EC%9B%A8%EC%96%B4%20&%20API%20%EC%9D%91%EB%8B%B5%20%ED%86%B5%EC%9D%BC%20&%20%EC%97%90%EB%9F%AC%20%ED%95%B8%EB%93%A4%EB%A7%81%20-%20Expr/Untitled%202.png)

만약 `myLogger`의 `next()`를 없애면 어떻게 될까요? 그건 한 번 해보세요! `next()`가 다음 미들웨어로 넘어가게끔 하는 함수임을 알 수 있습니다! 

아래 링크를 보면, Express에서 미들웨어가 어떻게 사용되는지 자세히 살펴볼 수 있습니다.

[Express 미들웨어 사용](https://expressjs.com/ko/guide/using-middleware.html)

## 👉  자주 사용되는 미들웨어

### 1) morgan

`morgan`은 **클라이언트의 요청과 서버의 응답 정보를 자동으로 콘솔에 기록**해 주는 미들웨어입니다. 
요청 로그를 보기 좋게 정리해주기 때문에, **개발 중 디버깅할 때 매우 유용**합니다.

**설치**

```bash
npm install morgan
```

```jsx
import express from 'express';
import morgan from 'morgan';

const app = express();
app.use(morgan('dev'));  // 로그 포맷: dev

app.get('/test', (req, res) => {
  res.send('Hello!');
});
```

`index.js`

dev, combined 등의 로그 포맷을 제공합니다. 개발 환경에서는 dev, 배포 환경에서는 combined를 사용한다거나 하는 식으로 활용할 수 있습니다. 

morgan을 사용하면 이런 식으로 응답이 옵니다.

![[HTTP 메서드] [주소] [HTTP 상태 코드] [응답 속도] - [응답 바이트] 를 의미합니다.](Chapter%207%20Express%20%EB%AF%B8%EB%93%A4%EC%9B%A8%EC%96%B4%20&%20API%20%EC%9D%91%EB%8B%B5%20%ED%86%B5%EC%9D%BC%20&%20%EC%97%90%EB%9F%AC%20%ED%95%B8%EB%93%A4%EB%A7%81%20-%20Expr/image.png)

[HTTP 메서드] [주소] [HTTP 상태 코드] [응답 속도] - [응답 바이트] 를 의미합니다.

요청과 응답을 한눈에 볼 수 있어 편리한 기능입니다.ㅎㅎ 

### 2) cookie-parser

`cookie-parser` 는 이름 그대로 **브라우저가 서버로 보낸 쿠키(cookie)를 파싱(parse,해석)해서 다루기 쉽게 만들어주는** 미들웨어입니다. 

이걸 이해하기 위해서는 일단 쿠키가 왜 필요한지에 대해 이해하고 있으면 좋은데요.

서버는 기본적으로 클라이언트(브라우저)의 이전 요청을 기억하지 못합니다. 그래서 “방금 로그인한 사람”과 “지금 게시글 쓰는 사람”이 같은 사람인지 모릅니다. 

그래서 서버는 로그인 같은 중요한 요청이 성공하면, 브라우저에게 비유하자면 **“이름표”**와 같은 것을 만들어서 줍니다(예시: `userId=123` ) 이게 `res.cookie(...)` 가 하는 일입니다.

브라우저는 이 “이름표”를 잘 보관하고 있다가, **앞으로 이 서버에 요청을 보낼 때마다** 그 이름표를 HTTP 요청 헤더(Header)에 붙여서 보냅니다. 그러면 서버는 브라우저가 보낸 “이름표”를 보고 “아, `userId` 가 123번인 회원이구나!”하고 알아챕니다. 이것이 바로 `req.cookies` 가 필요한 이유입니다.

그런데 문제가 하나 있습니다. 브라우저는 쿠키를 서버로 다시 보낼 때 **“하나의 긴 문자열”** 형태로 보내주는데요. 

예를 들어 브라우저가 `userId=123` 과 `theme=dark` (다크 모드) 라는 두 개의 쿠키를 가지고 있다면, 서버의 `req.headers.cookie` 에는 이런 문자열이 찍힙니다.

<aside>

‘userId=123; theme=dark’

</aside>

이걸 서버에서 사용하기 위해서는 개발자가 직접 이 문자열을  `;` 로 쪼개고  `=` 로도 쪼갠 다음 공백을 제거하는 귀찮은 작업을 해야 합니다.

슬슬 감이 오시나요? `cookie-parser` 는 이 귀찮은 파싱(Parsing) 작업을 대신해 줍니다. 

**설치** 

```bash
npm install cookie-parser
```

`cookie-parser` 또한 `morgan` 처럼 `app.use()` 로 등록합니다.

```jsx
import express from 'express';
import cookieParser from 'cookie-parser';
import morgan from 'morgan';

const app = express();
app.use(morgan('dev'));  // 로그 포맷: dev
app.use(cookieParser()); 

app.get('/test', (req, res) => {
  res.send('Hello!');
});

// 쿠키 만드는 라우터 
app.get('/setcookie', (req, res) => {
    // 'myCookie'라는 이름으로 'hello' 값을 가진 쿠키를 생성
    res.cookie('myCookie', 'hello', { maxAge: 60000 }); // 60초간 유효
    res.send('쿠키가 생성되었습니다!');
});

// 쿠키 읽는 라우터 
app.get('/getcookie', (req, res) => {
    // cookie-parser 덕분에 req.cookies 객체에서 바로 꺼내 쓸 수 있음
    const myCookie = req.cookies.myCookie; 
    
    if (myCookie) {
        console.log(req.cookies); // { myCookie: 'hello' }
        res.send(`당신의 쿠키: ${myCookie}`);
    } else {
        res.send('쿠키가 없습니다.');
    }
});

```

브라우저에서 `/setcookie` 를 먼저 방문한 다음, `/getcookie` 를 방문해 봅시다.

![image.png](Chapter%207%20Express%20%EB%AF%B8%EB%93%A4%EC%9B%A8%EC%96%B4%20&%20API%20%EC%9D%91%EB%8B%B5%20%ED%86%B5%EC%9D%BC%20&%20%EC%97%90%EB%9F%AC%20%ED%95%B8%EB%93%A4%EB%A7%81%20-%20Expr/image%201.png)

![image.png](Chapter%207%20Express%20%EB%AF%B8%EB%93%A4%EC%9B%A8%EC%96%B4%20&%20API%20%EC%9D%91%EB%8B%B5%20%ED%86%B5%EC%9D%BC%20&%20%EC%97%90%EB%9F%AC%20%ED%95%B8%EB%93%A4%EB%A7%81%20-%20Expr/image%202.png)

`signedCookies` 라는 서명된 쿠키 기능도 있는데, **이것은 쿠키가 클라이언트(브라우저)에서 `userId` 같은 값을 마음대로 위조할 수 있다는 보안 문제를 해결하기 위한 기능**입니다.

이 기능은 한번 사용하시면서 직접 알아보면 더 좋을 것 같습니다. 

### 3) express.json()과 express.urlencoded()

`morgan` 이 요청을 기록하고 `cookie-parser` 가 쿠키를 해석했다면, 이번엔 **클라이언트가 보낸 데이터를 해석**할 차례입니다. 

여러분이 로그인 폼에 ID와 비밀번호를 입력하고 ‘제출’버튼을 누르거나, 앱에서 서버로 JSON 데이터를 보낼 때, 이 데이터는 요청의 **본문**에 담겨서 서버로 전송됩니다. 

하지만 Express는 기본적으로 이 ‘본문’을 해석하는 기능이 없습니다. 그래서 이 미들웨어의 도움 없이는 `req.body` 를 콘솔에 찍어봐도 `undefined` 만 나오게 되죠.

`express.json()` 과 `express.urlencoded()` 는 `req.body` 에 클라이언트가 보낸 데이터를 파싱해서 넣어주는, 아주 중요한 미들웨어입니다. 

**설치**

이 미들웨어들은 예전에는 `body-parser` 라는 별도의 패키지였지만, 지금은 Express에 내장되어 있기 때문에 별도 설치를 하지 않아도 괜찮습니다. 

그리고 사실 저희는 이 미들웨어를 이미 세팅한 바가 있습니다.

```jsx
app.use(express.json());  
app.use(express.urlencoded({ extended: false }));
```

`src/index.js` 파일의 바로 이 부분입니다.

다시 한 번 되짚어 보자면, `express.json()` 은 json 형태의 데이터를 파싱합니다. 

그리고 `exress.urlencoded` 는 <form> 형태의 데이터를 파싱합니다.

어떠신가요? 이제 미들웨어가 어떤 건지 조금이나마 감이 오시나요?

마지막으로, 지금까지 배운 미들웨어를 응용해서 아주 실용적인 예제를 하나만 더 살펴보고 마치겠습니다.

## 👉 응용하기: 특정 라우트만 보호하는 ‘인증 미들웨어’

지금까지 저희가 사용했던 미들웨어는 `app.use()` 로 등록해서 모든 요청에 대해 실행되었습니다.

하지만 “마이페이지”나 “글쓰기 페이지” 처럼 로그인한 사용자만 접근을 허용하고 싶을 땐 어떻게 해야 할까요?

이럴 때 바로 미들웨어를 활용할 수 있습니다. `app.get()` , `app.post()` 같은 라우트 메서드에 미들웨어를 직접 끼워 넣는 방식이죠.

그럼 한번 어떻게 적용되는지 보겠습니다. 

```jsx
import express from 'express';
import cookieParser from 'cookie-parser';
import morgan from 'morgan'; 

const app = express();
const port = 3000;

app.use(morgan('dev'));       
app.use(cookieParser());    

const isLogin = (req, res, next) => {
    // cookie-parser가 만들어준 req.cookies 객체에서 username을 확인
    const { username } = req.cookies; 

    if (username) {
     
        console.log(`[인증 성공] ${username}님, 환영합니다.`);
        next(); 
    } else {
    
        console.log('[인증 실패] 로그인이 필요합니다.');
        res.status(401).send('<script>alert("로그인이 필요합니다!");location.href="/login";</script>');
    }
};

app.get('/', (req, res) => {
    res.send(`
        <h1>메인 페이지</h1>
        <p>이 페이지는 로그인이 필요 없습니다.</p>
        <ul>
            <li><a href="/mypage">마이페이지 (로그인 필요)</a></li>
        </ul>
    `);
});

app.get('/login', (req, res) => {
    res.send('<h1>로그인 페이지</h1><p>로그인이 필요한 페이지에서 튕겨나오면 여기로 옵니다.</p>');
});

app.get('/mypage', isLogin, (req, res) => {
    res.send(`
        <h1>마이페이지</h1>
        <p>환영합니다, ${req.cookies.username}님!</p>
        <p>이 페이지는 로그인한 사람만 볼 수 있습니다.</p>
    `);
});

app.get('/set-login', (req, res) => {
    res.cookie('username', 'UMC9th', { maxAge: 3600000 });
    res.send('로그인 쿠키(username=UMC9th) 생성 완료! <a href="/mypage">마이페이지로 이동</a>');
});

app.get('/set-logout', (req, res) => {
    res.clearCookie('username');
    res.send('로그아웃 완료 (쿠키 삭제). <a href="/">메인으로</a>');
});

```

먼저 메인 페이지에 접속해 보겠습니다.

코드에 의하면 메인 페이지에 접속해 로그인 쿠키를 생성하지 않고(로그인을 하지 않고) 마이페이지 버튼을 클릭합니다.

![image.png](Chapter%207%20Express%20%EB%AF%B8%EB%93%A4%EC%9B%A8%EC%96%B4%20&%20API%20%EC%9D%91%EB%8B%B5%20%ED%86%B5%EC%9D%BC%20&%20%EC%97%90%EB%9F%AC%20%ED%95%B8%EB%93%A4%EB%A7%81%20-%20Expr/image%203.png)

그러면 로그인이 필요합니다! 라는 알림 창이 뜰텐데요. 

그리고 그 다음으로 주소창에 [http://localhost:3000/set-login을](http://localhost:3000/set-login을) 입력해 접속합니다.

그러면 로그인 쿠키 생성이 완료되었다는 메세지가 뜰 것이고, 이 상태에서 마이페이지로 이동하면 마이페이지가 정상적으로 보일 것입니다.

마지막으로 로그인 된 상태에서, 주소창에 [http://localhost:3000/set-logout을](http://localhost:3000/set-logout을) 입력해 접속하면

“로그아웃 완료” 라는 메세지가 뜰 것입니다.

그리고 다시 마이페이지로 접속을 시도하면 처음과 동일하게 로그인이 필요합니다! 라는 알림 창이 뜰 것입니다.

방금의 예제는 `cookie-parser` 와 미들웨어의 동작 방식과 ‘패턴’을 이해하기 위한 간단한 예제였는데요.

실제 서비스에서는 쿠키 값을 누구나 위조할 수 있기 때문에 이보다 훨씬 더 안전하고 표준적인 방식인 **JWT**를 사용해 인증/ 인가를 구현합니다. 

본격적인 로그인 및 JWT는 9주차에서 자세히 배울 예정이니, 지금은 “미들웨어를 라우트 보호용으로  사용할 수 있구나!” 라는 개념만 확실하게 하고 넘어가봅시다.