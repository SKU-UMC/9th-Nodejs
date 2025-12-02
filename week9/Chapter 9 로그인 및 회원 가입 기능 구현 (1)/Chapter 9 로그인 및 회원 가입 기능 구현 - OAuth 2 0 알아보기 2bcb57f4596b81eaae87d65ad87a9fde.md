# Chapter 9. 로그인 및 회원 가입 기능 구현 - OAuth 2.0 알아보기

<aside>
<img src="https://www.notion.so/icons/list_gray.svg" alt="https://www.notion.so/icons/list_gray.svg" width="40px" /> **목차**

</aside>

### 👉 OAuth 2.0 알아보기

이제 9주차의 핵심인 JWT를 발급받기 위한 **첫 번째 관문, 소셜 로그인**에 대해 알아보겠습니다. 

웹 서비스들을 사용하다 보면 “Google로 로그인” 같은 버튼을 보셨을 겁니다. 다른 시스템(Google, Kakao 등)의 계정으로 우리가 만드는 앱에서 로그인하는 기능이죠.

대부분의 소셜 로그인은 **OAuth 2.0**이라는 표준을 따릅니다. 

### 👉 들어가기에 앞서

우리가 만든 서버와 다른 사람이 만든 Google이 있다고 생각해볼게요. 그리고 어떤 데이터가 어떻게 오가는지 상상해보겠습니다.

1. 사용자는 Google 로그인을 하고 난 후, 우리가 만든 서버에게 Google 로그인 정보를 전달해야 합니다.

가장 기본이 되는 조건이죠? 적어도 어떤 사용자가 어떻게 Google 로그인을 했는지를 알아야, 서버에서 사용자를 구분할 수 있을 테니까요!

하지만 이를 위해서는 서버와 Google이 미리 한 가지 약속을 해둘 필요가 있습니다. 사용자가 Google 로그인을성공했을 때, Google에서는 어떤 서버에게 로그인 정보를 전송할지 알 수 없기 때문입니다.

1. Google은 미리 정의된 서버에게 로그인 정보를 전달해야 합니다.

어떻게 데이터를 전달할지에 대해서는 잠시 후에 알아보도록 하겠습니다.

또 필요한 것은, 어떤 데이터를 전달할지도 정의해야 합니다. 사용자가 Google 로그인을 했는데, 이 정보를 이용해서 서버가 사용자의 모든 데이터를 얻어가버리면 문제가 되겠죠? 의도하지 않은 사진첩의 정보, 연락처 정보, 위치 정보까지 모두 다 긁어가면 문제가 될 거예요!

1. 사용자가 인지할 수 있는 형태의 서버 권한 동의가 필요합니다. 로그인 할 때 동의를 받으면 좋겠네요!

### 👉 OAuth 2.0

![[https://developers.google.com/identity/protocols/oauth2](https://developers.google.com/identity/protocols/oauth2)](Chapter%209%20%EB%A1%9C%EA%B7%B8%EC%9D%B8%20%EB%B0%8F%20%ED%9A%8C%EC%9B%90%20%EA%B0%80%EC%9E%85%20%EA%B8%B0%EB%8A%A5%20%EA%B5%AC%ED%98%84%20-%20OAuth%202%200%20%EC%95%8C%EC%95%84%EB%B3%B4%EA%B8%B0/52895.png)

[https://developers.google.com/identity/protocols/oauth2](https://developers.google.com/identity/protocols/oauth2)

OAuth 2.0의 도식도는 꽤 복잡한데요, 한 번 천천히 하나씩 알아보도록 하겠습니다. 사실 한 번에 이해하기는 어려울 수 있어서, 이후에 실습을 통해서 더 이해하고, 여러 번 반복하면서 이해하게 될 거예요.

1. **User login & consent (사용자 로그인 및 동의)**
    - **누가: 사용자가 Google 서버**에게
    - 사용자는 특정한 URL을 통해 Google 로그인 화면으로 이동합니다.
    - 일반적인 Google 로그인 화면과는 다르게, 특정한 서버에게 이러 이러한 데이터들이 공유된다는 화면이 뜨게 됩니다. “이 앱이 당신의 이메일과 프로필 정보를 요청합니다. 동의하십니까?” 라는 **권한 동의** 화면이라고 생각하시면 됩니다.
2. **Authorization code (권한 코드 발급)**
    - **누가: Google 서버가 사용자의 브라우저를 통해 우리 앱 서버로**
    - Google 로그인을 마치면 Google 서버는 Authorization code를 것을 미리 등록된 우리 서버의 주소(Redirect URI(Callback URL))로 전달합니다.
    - 만약 저희가 Callback URL을 `https://example.com/callback` 으로 등록했다면, 사용자가 Google 로그인을 마치면 `https://example.com/callback?code=foo-bar-googlecode` 와 같은 주소로 이동한다고 보면 됩니다.
    - `code= ...`  부분은 일회용 코드라고 생각하시면 됩니다.
3. **Exchange code for token (코드를 토큰으로 교환)**
    - **누가: 우리 앱 서버가 Google 서버에게**
    - 그러면 쿼리 파라미터를 통해 Google이 전달해준 `Authorization code`를 얻을 수 있겠죠?
    - 이 `Authorization code`를 이용해서 Google 서버의 특정 API를 호출하면, 이제 실제로 사용 가능한 Access Token을 얻을 수 있습니다.
4. **Use token to call Google API (Google 토큰으로 정보 요청)** 
    - **누가: 우리 앱 서버가 Google 서버에게**
    - 이 Access Token을 이용해서 Google API를 호출하면, Google 로그인을 했던 사용자의 프로필 정보 등을 조회할 수 있게 됩니다.

여기까지가 OAuth의 역할입니다.

우리 서버는 드디어 사용자의 프로필 정보(예: 이메일, 이름)를 확보했습니다.

이제 이어지는 실습에서 이 정보를 바탕으로 우리 DB의 사용자를 찾거나 회원가입시키고, 9주차 이론에서 배운 “우리 서버의 JWT(Access/Refresh Token)”를 사용자에게 발급해 주게 됩니다 :) 

### 👉 OAuth 2.0 FAQ

Authorization code와 Access Token이 굳이 따로 있는 이유는 무엇일까요? 그냥 Authorization code를 이용해서 바로 Google API를 호출하면 안 되는 것일까요?

💡 Authorization code는 쿼리 파라미터를 통해 전달되는데, 브라우저의 주소에 남는 문제도 있고, 네트워크를 해킹한 해커가 요청 로그만을 보고 탈취할 수 있는 위험도 있습니다.

💡 이러한 이유로 Authorization code는 Access Token을 얻기 위한 중간 단계로만 사용하는 것이고, 이 Authorization code는 한 번 Access Token으로 교환하게 되면 다시 사용할 수 없는 일회용 Code로 존재하게 됩니다.

더 자세한 내용은 이제 실습을 통해 직접 개발해보면서 알아보도록 하겠습니다!