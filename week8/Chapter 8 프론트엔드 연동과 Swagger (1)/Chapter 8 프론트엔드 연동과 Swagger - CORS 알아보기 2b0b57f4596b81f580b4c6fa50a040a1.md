# Chapter 8. 프론트엔드 연동과 Swagger - CORS 알아보기

<aside>
<img src="https://www.notion.so/icons/list_gray.svg" alt="https://www.notion.so/icons/list_gray.svg" width="40px" /> **목차**

</aside>

### 👉 CORS란?

예전 워크북에서 이미 저희는 Express.js 서버의 CORS 설정을 마쳐둔 상태였습니다. 바로 이렇게요!

```
app.use(cors()); // cors 방식 허용
app.use(express.static("public")); // 정적 파일 접근
app.use(express.json()); // request의 본문을 json으로 해석할 수 있도록 함 (JSON 형태의 요청 body를 파싱하기 위함)
app.use(express.urlencoded({ extended: false })); // 단순 객체 문자열 형태로 본문 데이터 해석
```

하지만 이렇게 설정만 마치고 바로 넘어갔다보니, CORS에 대해 아직 저희는 잘 모르는 상태일 거예요.

CORS는 Cross-Origin Resource Sharing의 줄임말로, 서로 다른 주소에 있는 서버와 웹 사이트들이 통신할 때 이를 허용하는 개념이에요.

![개발을 하다 보면 한 번쯤 보았을만한 CORS 오류](Chapter%208%20%ED%94%84%EB%A1%A0%ED%8A%B8%EC%97%94%EB%93%9C%20%EC%97%B0%EB%8F%99%EA%B3%BC%20Swagger%20-%20CORS%20%EC%95%8C%EC%95%84%EB%B3%B4%EA%B8%B0/72782.png)

개발을 하다 보면 한 번쯤 보았을만한 CORS 오류

### 👉 동일 출처 정책(SOP)

사실 여기까지 읽었을 땐 아직 감이 오지 않아요.

이걸 이해하기 위해서는 먼저 브라우저의 동일 출처 정책(Same-Origin Policy)이라는 중요한 보안 규칙을 알아야 합니다.

웹 브라우저(크롬, 사파리 등)는 기본적으로 ‘출처(Origin)’가 다른 곳으로는 리소스(데이터) 요청을 보내지 못하도록 막아버려요. 이것이 바로 SOP입니다.

예를 들어, `https://neordinary.co.kr`에서 `https://api.umc.com` 서버를 호출한다면, 서로 다른 주소에 있기 때문에 브라우저는 요청을 기본적으로 차단해요. 그리고 이 요청을 허용하기 위해서는 서버의 CORS 설정이 필요해요.

보통은 프론트엔드와 서버는 서로 다른 도메인에 배포되어 통신하다보니 특히 더 필요한 개념이기도 해요.

### 👉 CORS 헤더란?

CORS는 서버의 응답 헤더를 통해 동작합니다.

기본적으로 프론트엔드는 서버에 실제 요청(`GET`, `PUT`, `POST`, `DELETE`, …)을 전송하기 전, 동일한 Path에 `OPTIONS` 메소드로 요청합니다. 이 요청은 아무런 동작을 하지 않고, CORS 등의 정보를 미리 알기 위한 Preflight 요청입니다.

여기서 Preflight 요청이 무엇인지 궁금하신 분들도 계실텐데요.

쉽게 말해서 진짜 요청을 보내기 전 미리 확인 요청을 보내보고, 통과하면 요청을 보내는 방식이라고 생각하면 됩니다.

이렇게 하는 이유는, 다른 출처(origin)에서 보내는 요청이 보안상 위험할 수 있기 때문이에요. 

그래서 브라우저는 바로 요청을 보내지 않고 먼저 `OPTIONS` 메소드로 한 번 “허락받는” 절차를 거치는 것입니다. 

이 Preflight 요청의 응답에는 다음과 같은 헤더들이 포함됩니다. 이 헤더들을 통해 프론트엔드에서 서버에 요청할 때 어떤 주소가 허용되는지, 어떤 메소드가 허용되는지, 어떤 헤더가 허용되는지와 같은 정보들을 알 수 있고, 브라우저가 이를 기반으로 판단하게 됩니다.

- Access-Control-Allow-Origin
    
    : 우리 서버가 **어떤 출처**( 사이트, 예: `https://neordinary.co.kr` 또는 `*` )**의 요청**을 허용할지 알려줍니다.
    
- Access-Control-Allow-Methods
    
    : 허용되는 **HTTP 요청 방식**(`GET`, `POST`, `PUT` 등)**의 목록**을 알려줍니다.
    
- Access-Control-Allow-Headers
    
    : 요청에 `Content-Type`이나 `Authorization`(인증 토큰) 같은 **특정 헤더를 포함해도 되는지** 알려줍니다.
    
- Access-Control-Allow-Credentials
    
    : 요청에 '쿠키' 같은 **자격 증명 정보(credentials)를 포함**하는 것을 허용할지 여부를 알려줍니다.
    
    조금 더 자세히 설명하자면, 브라우저는 **보안을 위해** 기본적으로 다른 출처(`Cross-Origin`)로 요청을 보낼 때, 쿠키나 HTTP 인증 정보 같은 민감한 데이터를 **절대 보내지 않습니다.**
    
    이걸 가능하게 하려면 **프론트엔드와 백엔드 양쪽 모두 동의**해야 합니다.
    
    1. **프론트엔드**는 요청 시 "쿠키를 꼭 같이 보낼게요!"라는 옵션(예: `fetch(url, { credentials: 'include' })`)을 켜야 합니다.
    2. **백엔드**는 응답으로 `Access-Control-Allow-Credentials: true`를 보내 "쿠키 포함 요청, 허락합니다"라고 응답해야 합니다.
- Access-Control-Max-Age
    
    : 이 '허락' 응답(Preflight)을 브라우저가 **얼마 동안 기억(캐시)해도 되는지** 알려줍니다. (이 시간 동안은 OPTIONS 요청을 생략합니다.)
    
    왜 필요한지 간단하게 설명해보자면, `POST` , `PUT` , `DELETE`  같은 값을 변경하는 중요한 요청들은 요청을 보내기 전에 `OPTIONS` 라는 테스트 콜을 먼저 보내잖아요?
    
    이는 사실 2번의 통신이 필요하죠. 예시를 들어보면요
    
    1. `OPTIONS` 요청
    2. `OPTIONS` 응답
    3. `POST` 요청
    4. `POST`  응답
    
    그런데 만약 사용자가 글쓰기 버튼 같은 것을 10번 누르면, 이 행위를 20번이나 반복해야 하는 일이 생기는 것이죠. 
    
    그래서 `Max-Age`는 이 '테스트 콜'의 결과를 브라우저에 캐시(저장)하라고 명령합니다.
    
    그래서 예를 들어 Max-Age가 3600(1시간)이라고 하면, 1시간 동안은 사용자가 `POST` 요청을 할 때 브라우저는 `OPTIONS` 요청을 생략하고 바로 3단계로 돌입하는 것입니다.
    
    이 덕분에 불필요한 네트워크 통신이 절반으로 줄어들어 앱 성능이 훨씬 빨라집니다. 
    

더 자세한 정보를 알고 싶다면 아래 문서를 참고해주세요!

[Cross-Origin Resource Sharing (CORS) - HTTP | MDN](https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS)

### 👉 CORS 설정하기

Express에서 CORS를 설정하려면 `cors` 모듈을 이용해 미들웨어를 사용해야 합니다. 이 `cors` 미들웨어는 위에서 설명한 CORS 헤더를 설정해주는 역할을 합니다.

```jsx
app.use(cors());
```

특정 프론트엔드 주소를 허용하고자 한다면, 아래와 같이 사용해주시면 됩니다.

```jsx
app.use(cors({
  origin: ['http://localhost:3000', 'http://example.com']
}));
```

그 외에 더 자세한 정보를 알고 싶다면 아래 GitHub 저장소 `README` 문서를 참고해주세요!

[GitHub - expressjs/cors: Node.js CORS middleware](https://github.com/expressjs/cors)

### 👉 Case 1. Access to fetch at '…' from origin '…' has been blocked by CORS policy: No 'Access-Control-Allow-Origin' header is present on the requested resource. If an opaque response serves your needs, set the request's mode to 'no-cors' to fetch the resource with CORS disabled.

![CleanShot 2024-09-13 at 18.17.25@2x.png](Chapter%208%20%ED%94%84%EB%A1%A0%ED%8A%B8%EC%97%94%EB%93%9C%20%EC%97%B0%EB%8F%99%EA%B3%BC%20Swagger%20-%20CORS%20%EC%95%8C%EC%95%84%EB%B3%B4%EA%B8%B0/CleanShot_2024-09-13_at_18.17.252x.png)

이런 경우, 이 요청을 호출하고 있는 프론트엔드의 주소 정보를 알아와 아래와 같이 수정해주시면 됩니다.

```jsx
app.use(
  cors({
    origin: ["<프론트엔드_주소_및_포트>"],
  })
);
```

### 👉 Case 2. Access to fetch at '…' from origin '…' has been blocked by CORS policy: Request header field x-auth-token is not allowed by Access-Control-Allow-Headers in preflight response.

![CleanShot 2024-09-13 at 18.24.22@2x.png](Chapter%208%20%ED%94%84%EB%A1%A0%ED%8A%B8%EC%97%94%EB%93%9C%20%EC%97%B0%EB%8F%99%EA%B3%BC%20Swagger%20-%20CORS%20%EC%95%8C%EC%95%84%EB%B3%B4%EA%B8%B0/CleanShot_2024-09-13_at_18.24.222x.png)

이런 경우, 이 요청을 호출하고 있는 프론트엔드에서 어떤 Header 정보들을 보내고 있는지 확인하여 아래와 같이 수정해주시면 됩니다.

```jsx
app.use(
  cors({
    allowedHeaders: ["x-auth-token", ...],
  })
);
```

### 👉 Case 3. ...blocked by CORS policy: The value of the 'Access-Control-Allow-Origin' header... must not be the wildcard '*' when the request's credentials mode is 'include'.

![image.png](Chapter%208%20%ED%94%84%EB%A1%A0%ED%8A%B8%EC%97%94%EB%93%9C%20%EC%97%B0%EB%8F%99%EA%B3%BC%20Swagger%20-%20CORS%20%EC%95%8C%EC%95%84%EB%B3%B4%EA%B8%B0/image.png)

이 에러는 프론트엔드에서 “쿠키를 포함해서” API를 요청할 때 자주 만나게 될 에러입니다. 

이 에러가 뜨게 된 이유는 프론트엔드에서 `fetch(url, { credentials: 'include' })`처럼 쿠키를 포함해 요청을 보냈는데, 백엔드의 `cors()` 설정이 2가지 규칙을 어겼기 때문입니다. 

- `Access-Control-Allow-Origin` 값이  (전체 허용)으로 되어 있거나,
- `Access-Control-Allow-Credentials: true` 설정이 빠져있습니다.

브라우저는 보안상 쿠키 같은 민감한 정보가 오고 갈 때에는 `Origin`을 `*` (모든 사이트 허용)로 설정하는 것을 절대로 허용하지 않습니다.

이 오류가 떴을 때에는 첫 번째로 `cors` 설정을 정확한 주소를 사용해 주어야 하고, 두 번째로는 `credentials: true` 옵션을 사용해 주어야 합니다. 

```jsx
app.use(
  cors({
    //1. origin을 * 대신 정확한 주소 사용 
    origin: ["http://127.0.0.1:5500", "http://localhost:3000"], 

    // 2. 쿠키를 허용하는 credentials 옵션 켜기
    credentials: true, 
  })
);
```

### 👉 어려운 CORS

이외의 다른 케이스를 만나게 되면 직접 검색하여 해결해보시는 것을 추천드립니다! 그리고 해결이 되지 않는다면 UMC 디스코드에서 지식IN 채널에서 여쭤보시는 것을 추천!

CORS는 한 번에 이해하고 정복하고 넘어가기는 어려운데요, 추후에 프로젝트를 진행하면서 CORS 문제가 발생하면 그 때 다시 한 번 이 워크북을 살펴보는 것도 좋을 것 같습니다!