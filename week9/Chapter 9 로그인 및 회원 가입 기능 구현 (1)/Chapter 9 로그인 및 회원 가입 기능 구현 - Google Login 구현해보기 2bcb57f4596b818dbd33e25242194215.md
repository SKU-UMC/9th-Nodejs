# Chapter 9. 로그인 및 회원 가입 기능 구현 - Google Login 구현해보기

<aside>
<img src="https://www.notion.so/icons/list_gray.svg" alt="https://www.notion.so/icons/list_gray.svg" width="40px" /> **목차**

</aside>

### 👉 Passport 라이브러리

Express에서 인증을 처리할 때에는 보통 Passport라는 라이브러리를 사용합니다. 일관된 인터페이스로 다양한 소셜 로그인 서비스들을 연동할 수 있어 편리합니다!

```bash
npm install \
  passport \
  passport-google-oauth20 \
  jsonwebtoken \
  passport-jwt
```

위에서는 Passport 기본 라이브러리, Google 로그인을 연동하는 라이브러리, 그리고 9주차의 핵심인 JWT(토큰)를 생성하고(`jsonwebtoken`) 검증(`passport-jwt`)하기 위한 라이브러리들을 설치했습니다. 

자세한 내용은 아래 문서를 참고하셔도 좋을 것 같습니다.

[Documentation](https://www.passportjs.org/docs/)

### 👉 Google 로그인 인증 키 발급

우리의 서버와 Google 서버가 데이터를 주고 받고 사용자의 정보를 전달받기 위해서는, Google에 우리 서버를 등록하고 Key를 발급 받아야 합니다.

이를 위해, 저희는 Google Cloud Platform에 접속해보도록 하겠습니다.

### 1️⃣ **Google Cloud Platform 접속하기**

[](https://console.cloud.google.com/welcome)

위 페이지에 접속해보시고, 처음으로 접속하시는 경우에는 회원 가입을 진행해주세요!

### 2️⃣ Project 생성하기

![CleanShot 2024-09-16 at 19.12.56@2x.png](Chapter%209%20%EB%A1%9C%EA%B7%B8%EC%9D%B8%20%EB%B0%8F%20%ED%9A%8C%EC%9B%90%20%EA%B0%80%EC%9E%85%20%EA%B8%B0%EB%8A%A5%20%EA%B5%AC%ED%98%84%20-%20Google%20Login%20%EA%B5%AC%ED%98%84%ED%95%B4%EB%B3%B4%EA%B8%B0/CleanShot_2024-09-16_at_19.12.562x.png)

프로젝트가 있으신 분들은 기존 프로젝트를 적절히 선택해주시고, 그렇지 않은 경우 새로운 프로젝트를 생성해주세요. 프로젝트 이름은 자유롭게 지어주셔도 괜찮습니다.

### 3️⃣ OAuth 2.0 Client ID 생성하기

`APIs and services`를 누르거나, [https://console.cloud.google.com/apis/dashboard](https://console.cloud.google.com/apis/dashboard) 로 이동하여 API 대시보드로 이동해주세요.

![CleanShot 2024-09-16 at 19.17.05@2x.png](Chapter%209%20%EB%A1%9C%EA%B7%B8%EC%9D%B8%20%EB%B0%8F%20%ED%9A%8C%EC%9B%90%20%EA%B0%80%EC%9E%85%20%EA%B8%B0%EB%8A%A5%20%EA%B5%AC%ED%98%84%20-%20Google%20Login%20%EA%B5%AC%ED%98%84%ED%95%B4%EB%B3%B4%EA%B8%B0/CleanShot_2024-09-16_at_19.17.052x.png)

좌측의 Credentials 탭을 클릭한 후, 상단 Create Credentials 버튼을 클릭한 후, OAuth client ID 항목을 선택해주세요.

![CleanShot 2024-09-16 at 19.18.11@2x.png](Chapter%209%20%EB%A1%9C%EA%B7%B8%EC%9D%B8%20%EB%B0%8F%20%ED%9A%8C%EC%9B%90%20%EA%B0%80%EC%9E%85%20%EA%B8%B0%EB%8A%A5%20%EA%B5%AC%ED%98%84%20-%20Google%20Login%20%EA%B5%AC%ED%98%84%ED%95%B4%EB%B3%B4%EA%B8%B0/CleanShot_2024-09-16_at_19.18.112x.png)

그리고 위와 같이 항목들을 입력해주세요! `Name`의 경우에는 자유롭게 작성해주셔도 괜찮습니다. Authorised JavaScript origins, Authorised redirect URIs 등은 생성한 이후에도 수정이 가능하므로 우선은 위와 같이 간단히 적어주세요.

### 4️⃣ Client ID, Client secret 조회하기

![CleanShot 2024-09-16 at 19.21.13@2x.png](Chapter%209%20%EB%A1%9C%EA%B7%B8%EC%9D%B8%20%EB%B0%8F%20%ED%9A%8C%EC%9B%90%20%EA%B0%80%EC%9E%85%20%EA%B8%B0%EB%8A%A5%20%EA%B5%AC%ED%98%84%20-%20Google%20Login%20%EA%B5%AC%ED%98%84%ED%95%B4%EB%B3%B4%EA%B8%B0/CleanShot_2024-09-16_at_19.21.132x.png)

생성을 하고 나면 팝업이 뜨면서 Client ID와 Client secret을 조회할 수 있습니다. 나중에도 각 OAuth client를 클릭해 들어가도 두 정보를 언제든지 확인할 수 있습니다.

이 두 값을, 저희 프로젝트의 `.env`에 아래와 같이 반영해주세요!

```bash
PORT=3000
DATABASE_URL="..."
PASSPORT_GOOGLE_CLIENT_ID="<여기에 Client ID>"
PASSPORT_GOOGLE_CLIENT_SECRET="<여기에 Client secret>"
# 9주차 이론에서 배운 'Signature'를 만드는 비밀 키입니다
JWT_SECRET="<여기의 나만의 JWT 비밀 키>"
```

### 👉 인증을 위한 코드 추가

먼저 `src/auth.config.js` 파일을 생성하여 인증과 관련한 구성 파일을 추가해주도록 하겠습니다.

이 파일에는 **(1) JWT 토큰 생성 함수**와 **(2) Passport의 Google 로그인 전략**을 모두 정의할 것입니다. 

1. **JWT 토큰 생성 함수 정의하기**

먼저, 9주차 이론에서 배운 **Access Token**과 **Refresh Token**을 생성하는 **헬퍼 함수**들을 정의합니다. 

```jsx
import dotenv from "dotenv";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import { prisma } from "./db.config.js";
import jwt from "jsonwebtoken"; // JWT 생성을 위해 import 

dotenv.config();
const secret = process.env.JWT_SECRET; // .env의 비밀 키 

export const generateAccessToken = (user) => {
  return jwt.sign(
    { id: user.id, email: user.email }, 
    secret,                           
    { expiresIn: '1h' }                 
  );
};

export const generateRefreshToken = (user) => {
  return jwt.sign(
    { id: user.id },                   
    secret,
    { expiresIn: '14d' }                
  );
};
```

- `jsonwebtoken` 라이브러리: `jwt.sign()` 함수를 사용해 토큰을 생성하기 위해 `import` 합니다.
- `secret`: `env` 파일에 저장된 `JWT_SECRET` 값을 가져옵니다. 이 비밀 키는 9주차 이론에서 배운 ‘Signature(서명)’를 만드는 데 사용됩니다.
- `generateAccessToken(user)` :
    - Payload (실제 정보)로 `{ id: user.id, email: user.email }` 을 담습니다.
    - `expiresIn: '1h'` (1시간)의 **짧은** 유효 기간을 갖는 Access Token을 생성합니다.
- `generateRefreshToken(user)` :
    - Payload로 `{ id: user.id }` (최소한의 정보)만 담습니다.
    - `expiresIn: '14d'` (2주)의 긴 유효 기간을 갖는 Refresh Token을 생성합니다.

1. **Google 로그인 전략(Strategy) 정의하기** 

```jsx
// GoogleVerify 
const googleVerify = async (profile) => {
  const email = profile.emails?.[0]?.value;
  if (!email) {
    throw new Error(`profile.email was not found: ${profile}`);
  }

  const user = await prisma.user.findFirst({ where: { email } });
  if (user !== null) {
    return { id: user.id, email: user.email, name: user.name };
  }

  const created = await prisma.user.create({
    data: {
      email,
      name: profile.displayName,
      gender: "추후 수정",
      birth: new Date(1970, 0, 1),
      address: "추후 수정",
      detailAddress: "추후 수정",
      phoneNumber: "추후 수정",
    },
  });

  return { id: created.id, email: created.email, name: created.name };
};

// GoogleStrategy 

export const googleStrategy = new GoogleStrategy(
  {
    clientID: process.env.PASSPORT_GOOGLE_CLIENT_ID,
    clientSecret: process.env.PASSPORT_GOOGLE_CLIENT_SECRET,
    callbackURL: "/oauth2/callback/google", 
    scope: ["email", "profile"],
  },
  

  async (accessToken, refreshToken, profile, cb) => {
    try {
     
      const user = await googleVerify(profile);
      
      
      const jwtAccessToken = generateAccessToken(user);
      const jwtRefreshToken = generateRefreshToken(user);

     
      return cb(null, {
        accessToken: jwtAccessToken,
        refreshToken: jwtRefreshToken,
      });

    } catch (err) {
      return cb(err);
    }
  }
);
```

위에서 아직 다 구현하지 않은 `googleVerify` 함수는 위와 같이 구현해봤습니다. 저의 경우 Prisma 상에서 `User` 모델을 위와 같은 형태로 사용하고 있는데, 챌린저 분들은 자신의 `User` 모델에 맞게 코드를 수정해서 사용해주세요!

`googleVerify` 함수는 먼저 Google 로그인 후 전달 받은 사용자의 프로필 정보에 이메일이 포함되어 있는지 확인하고, 이메일을 이용해서 사용자를 조회해봅니다. 그리고 사용자가 존재하지 않으면 기본 값과 함께 사용자 정보를 자동으로 생성하는 간단한 함수입니다.

그리고 `passport-google-oauth20` 라이브러리가 제공하는 `GoogleStrategy` 를 이용해 Google Cloud에서 발급받은 `clientID` 와 `clientSecret` 을 설정합니다. 

### 👉 Passport 사용하기 - Route

이제 Passport를 본격적으로 사용할 때인데, 먼저 로그인을 할 수 있는 경로들을 먼저 작성해보겠습니다.

```jsx
app.get("/oauth2/login/google", 
  passport.authenticate("google", { 
    session: false 
  })
);
app.get(
  "/oauth2/callback/google",
  passport.authenticate("google", {
	  session: false,
    failureRedirect: "/login-failed",
  }),
  (req, res) => {
    const tokens = req.user; 

    res.status(200).json({
      resultType: "SUCCESS",
      error: null,
      success: {
          message: "Google 로그인 성공!",
          tokens: tokens, // { "accessToken": "...", "refreshToken": "..." }
      }
    });
  }
);
```

이 코드는 어디든 적절히 배치해주시면 되는데, 저는 `/api/...` 와 `/docs`, `/openapi.json` 사이에 배치해두었습니다.

- `/oauth2/login/google` 로 접속하면 자동으로 Google 로그인 주소로 이동하여 사용자가 Google 로그인을 할 수 있도록 해줍니다.
- `oauth2/callback/google` 는 Google 로그인이 성공하면 자동으로 되돌아오는 주소입니다. 여기에서는 쿼리 파라미터로 전달된 code 값을 이용해 Google API를 호출하여 사용자의 프로필 정보를 조회해 오게 됩니다.

### 👉 Passport 사용하기 - 미들웨어

```jsx
import passport from "passport";
import { googleStrategy } from "./auth.config.js";
import { prisma } from "./db.config.js";

dotenv.config();

passport.use(googleStrategy);

const app = express();
...
```

- `passport.use(...)` 는 passport 라이브러리에 저희가 정의한 로그인 방식을 등록하는 코드입니다. 지금은 Google 로그인 방식을 등록했고, 추후에 네이버 로그인, 카카오 로그인, Apple 로그인 등의 다양한 로그인 방식도 추가할 수 있습니다.

```jsx
app.use(cors()); // cors 방식 허용
app.use(express.static("public")); // 정적 파일 접근
app.use(express.json()); // request의 본문을 json으로 해석할 수 있도록 함 (JSON 형태의 요청 body를 파싱하기 위함)
app.use(express.urlencoded({ extended: false })); // 단순 객체 문자열 형태로 본문 데이터 해석

app.use(passport.initialize());

```

```bash
PORT=3000
DATABASE_URL="..."
PASSPORT_GOOGLE_CLIENT_ID="<여기에 Client ID>"
PASSPORT_GOOGLE_CLIENT_SECRET="<여기에 Client secret>"
JWT_SECRET="<여기에 나만의 비밀 키>"
```

### 👉 테스트 해보기

1. JWT 검증 미들웨어 만들기( `passport-jwt` 사용)

```jsx
import { Strategy as JwtStrategy, ExtractJwt } from 'passport-jwt';

const jwtOptions = {
  // 요청 헤더의 'Authorization'에서 'Bearer <token>' 토큰을 추출
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: process.env.JWT_SECRET,
};

export const jwtStrategy = new JwtStrategy(jwtOptions, async (payload, done) => {
  try {
    const user = await prisma.user.findFirst({ where: { id: payload.id } });

    if (user) {
      return done(null, user);
    } else {
      return done(null, false);
    }
  } catch (err) {
    return done(err, false);
  }
});
```

1. `index.js` 에 JWT Strategy 등록

`passport.use(googleStrategy)` 아래에 `jwtStrategy` 도 등록합니다.

```jsx
import { googleStrategy, jwtStrategy } from "./auth.config.js";

passport.use(googleStrategy);
passport.use(jwtStrategy); 
// ... 
```

`src/index.js`

1. 보호된 라우트(Test) 만들고 `isLogin` 미들웨어 적용

이제 7주차의 `isLogin` 역할을 `passport.authenticate('jwt', ...)` 가 대신합니다.

```jsx
const isLogin = passport.authenticate('jwt', { session: false });

app.get('/mypage', isLogin, (req, res) => {
  res.status(200).success({
    message: `인증 성공! ${req.user.name}님의 마이페이지입니다.`,
    user: req.user,
  });
});
```

`src/index.js`

1. 실제 테스트 흐름
    1. 브라우저에서 `http://localhost:3000/oauth2/login/google` 에 접속하여 Google 로그인을 완료합니다.
    2. 로그인이 성공하면, [`http://localhost:3000/oauth2/callback/google`](http://localhost:3000/oauth2/callback/google) 로 이동되고, 브라우저에 **JSON 형태**로 `accessToken` 과 `refreshToken` 이 출력됩니다. 
    
    ![image.png](Chapter%209%20%EB%A1%9C%EA%B7%B8%EC%9D%B8%20%EB%B0%8F%20%ED%9A%8C%EC%9B%90%20%EA%B0%80%EC%9E%85%20%EA%B8%B0%EB%8A%A5%20%EA%B5%AC%ED%98%84%20-%20Google%20Login%20%EA%B5%AC%ED%98%84%ED%95%B4%EB%B3%B4%EA%B8%B0/image.png)
    
    c. `accessToken` 값을 복사합니다. 
    
    d. Postman이나 8주차에 다뤘던 Swagger UI를 엽니다.
    
    e. 가장 중요한 부분인데요. 요청의 Headers에 다음 과 같이 “Authorization” 헤더를 추가합니다. 
    
    저는 Postman을 이용해 보겠습니다 
    
    ![image.png](Chapter%209%20%EB%A1%9C%EA%B7%B8%EC%9D%B8%20%EB%B0%8F%20%ED%9A%8C%EC%9B%90%20%EA%B0%80%EC%9E%85%20%EA%B8%B0%EB%8A%A5%20%EA%B5%AC%ED%98%84%20-%20Google%20Login%20%EA%B5%AC%ED%98%84%ED%95%B4%EB%B3%B4%EA%B8%B0/image%201.png)
    
    이런 식으로 설정해 주시면 됩니다. 그리고 Send 버튼을 누르면~
    
    f. 이런 식으로 성공 응답이 뜰 거에요.
    
    ![image.png](Chapter%209%20%EB%A1%9C%EA%B7%B8%EC%9D%B8%20%EB%B0%8F%20%ED%9A%8C%EC%9B%90%20%EA%B0%80%EC%9E%85%20%EA%B8%B0%EB%8A%A5%20%EA%B5%AC%ED%98%84%20-%20Google%20Login%20%EA%B5%AC%ED%98%84%ED%95%B4%EB%B3%B4%EA%B8%B0/image%202.png)
    

만약 토큰 없이 `/mypage` 를 요청하면 어떻게 될까요? 

`isLogin` 미들웨어가 “Unauthorized” 응답을 보내겠죠? 

### 👉 오류가 발생한다면?

Google Cloud Platform에서 생성한 OAuth Client에 `Authorised redirect URIs` 항목이 잘 들어가 있는지, 코드에서 사용 중인 `callbackURL` 변수가 그와 동일하게 잘 들어가있는지 확인해주세요!

보통은 이 두 값이 서로 달라 오류가 발생하는 경우가 많습니다.

### 👉 ”세션” vs “JWT”

그럼 이런 의문이 생길 수가 있죠. 

JSON으로 토큰만 띄워주면, 새로고침하거나 뒤로 가기 누르면 다 날아가는 거 아닌가요? 라고요.

맞습니다.

아까 개념을 다룰 때 세션 방식에 대해 잠깐 알아봤었죠. 세션 방식과 JWT 방식은 ‘로그인 유지’의 책임을 지는 주체가 완전히 다른데요. 

세션 방식부터 보면, 이 방식에서는 서버가 세션 DB를 직접 운영하고 관리해야 했습니다. 서버가 모든 상태(State)를 기억해야 하니까요. 그리고 클라이언트는 쿠키만 받아서 사용하면 되기 때문에 서버가 로그인 유지의 모든 몫을 지게 됩니다.

그렇지만 JWT 방식에서는 서버는 로그인 시 딱 한 번만 신분을 확인하고, `userId` 가 적힌 JWT를 발급해 줍니다. 그러면 클라이언트가 이 JWT를 `localStorage` 로 활용할 수 있죠. 이 방식에서는 클라이언트가 로그인 유지의 몫을 넘겨받는 것입니다.

무엇이 좋다고 딱 잘라 말하기는 어렵습니다. 둘 다 장단점이 있기 때문인데요! 그 중에 저희는 JWT 방식을 구현해 봤구나~ 정도로 이해하면 좋을 것 같습니다.