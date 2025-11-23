# Chapter 8. 프론트엔드 연동과 Swagger - CORS 실습

그동안 만든 백엔드 API가 클라이언트(프론트엔드)와 어떻게 통신하는지, 그리고 7주차에 만들었던 ‘표준 에러 핸들링’이 왜 필요했는지 간단한 실습을 통해 확인해 볼게요. 

### 👉 실습 환경 세팅

테스트는 저희가 이전 주차에서 만들었던 회원가입 API로 한번 해보겠습니다.

```html
<!DOCTYPE html>
<html lang="ko">
<head>
    <meta charset="UTF-8">
    <title>내 API 테스트하기</title>
</head>
<body>
    <h1>회원가입 테스트</h1>
    <button id="signupButton">가입 요청 (성공)</button>
    <button id="signupButtonFail">가입 요청 (실패 - 이메일 중복)</button>

    <script>
       
        const API_URL = 'http://localhost:3000';

        // 성공 테스트 
        document.getElementById('signupButton').onclick = async () => {
            const userData = {
                email: `test_${Date.now()}@test.com`, // 매번 다른 이메일
                name: "UMC",
                gender: "여성",
                birth: "2000-01-01",
                address: "서울시",
                detailAddress: "UMC구 챌린저동 화이팅아파트",
                phoneNumber: "010-1234-5678",
                preferences: [1]
            };
            
            await callAPI('/api/v1/users/signup', userData);
        };

        // 2. 실패 테스트 (이메일 중복)
        document.getElementById('signupButtonFail').onclick = async () => {
            const userData = {
                email: "test@example.com", // 이미 가입된 이메일 사용 
                name: "UMC",
                gender: "여성",            
                birth: "2000-01-01", 
                address: "서울시",
                detailAddress: "UMC구 챌린저동 화이팅아파트",
                phoneNumber: "010-1234-5678",
                preferences: [1]
            };
            
            await callAPI('/api/v1/users/signup', userData);
        };

        // 3. API 호출 함수
        async function callAPI(path, data) {
            console.log(`%c[요청] ${path}`, 'color: blue;', data);
            
            try {
                const response = await fetch(API_URL + path, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json' 
                    },
                    body: JSON.stringify(data) 
                });

                
                const responseData = await response.json();

                if (!response.ok) { 
                    throw responseData; // 7장에서 만든 에러 객체가 여기로!
                }

                console.log('%c[응답] 성공:', 'color: green;', responseData);

            } catch (error) {
        
                // 여기서 7장에서 만든 { resultType: "FAIL", error: { ... } } 객체가 찍힙니다.
                console.error('%c[응답] 실패:', 'color: red;', error);
            }
        }
    </script>
</body>
</html>
```

`test.html`

일단 서버를 먼저 킵시다.

그리고 라이브러리를 하나 다운해줄게요! 

### 👉 ’Live Server’ VSCode 확장 프로그램 설치

이번 실습의 핵심은 `test.html` 파일을 다른 출처(Origin)에서 실행해 보는 것이 포인트에요.

그러기 위해서는 우리의 서버는 `http://localhost:3000` 에서 실행되지만, `test.html` 파일은 `http://127.0.0.1:5500` 처럼 전혀 다른 포트에서 열어야 합니다.

이걸 가장 쉽게 할 수 있는 도구가 바로 VSCode의 Live Server라는 확장 프로그램이에요!

![image.png](Chapter%208%20%ED%94%84%EB%A1%A0%ED%8A%B8%EC%97%94%EB%93%9C%20%EC%97%B0%EB%8F%99%EA%B3%BC%20Swagger%20-%20CORS%20%EC%8B%A4%EC%8A%B5/image.png)

이 프로그램을 깔아주시면 됩니다!

### 👉 실습

설치가 끝났으면, 탐색기에서 `test.html` 파일을 우클릭하고 맨 위의 **Open with Live Server**을 눌러주면 됩니다.

![image.png](Chapter%208%20%ED%94%84%EB%A1%A0%ED%8A%B8%EC%97%94%EB%93%9C%20%EC%97%B0%EB%8F%99%EA%B3%BC%20Swagger%20-%20CORS%20%EC%8B%A4%EC%8A%B5/image%201.png)

![image.png](Chapter%208%20%ED%94%84%EB%A1%A0%ED%8A%B8%EC%97%94%EB%93%9C%20%EC%97%B0%EB%8F%99%EA%B3%BC%20Swagger%20-%20CORS%20%EC%8B%A4%EC%8A%B5/image%202.png)

그럼 이런 화면을 만나게 될거에요.

이제 개발자 도구를 열고 콘솔 탭으로 들어간 다음 가입 요청 성공과 가입 요청 실패 버튼을 둘 다 눌러봅시다. 

![image.png](Chapter%208%20%ED%94%84%EB%A1%A0%ED%8A%B8%EC%97%94%EB%93%9C%20%EC%97%B0%EB%8F%99%EA%B3%BC%20Swagger%20-%20CORS%20%EC%8B%A4%EC%8A%B5/image%203.png)

어때요? 저희가 만들었던 에러 처리 부분을 잘 확인할 수 있죠? 

이렇게 백엔드가 ‘친절한 에러’를 내려줘야, 프론트엔드가 그걸 받아서 사용자에게 적절한 안내를 해줄 수 있답니다 :) 

실습을 완료한 뒤에는 `test.html` 은 지워 주셔도 괜찮습니다!