# Chapter 8. 프론트엔드 연동과 Swagger - Swagger 설정하기

<aside>
<img src="https://www.notion.so/icons/list_gray.svg" alt="https://www.notion.so/icons/list_gray.svg" width="40px" /> **목차**

</aside>

### 👉 Swagger 란?

[API Documentation & Design Tools for Teams | Swagger](https://swagger.io/)

Swagger는 RESTful API를 설계, 빌드, 문서화 및 사용하는 데 도움이 되는 Open API 사양을 중심으로 구축된 오픈 소스 도구입니다.

프로젝트를 만들 때 혼자 다 만들 수 있는 것은 아니잖아요? 프론트엔드와 백엔드, 디자이너, PM 등 다른 많은 팀원들과 함께 하나의 프로젝트를 완성해 나갑니다.

특히 저희는 어떤 방식으로 통신해야 할 지, 어떠한 API를 만들었고 그것이 어떻게 동작하는 지를 알려줘야 하며, 프론트엔드가 어떻게 사용하면 될 지의 정보를 알려줘야 합니다. 이에 대해서 다양한 방법으로 명세를 진행하는데요. Swagger는 이러한 API 명세를 도와주는 도구입니다.

### 👉 Swagger 관련 라이브러리 설치

```bash
npm add \
  swagger-autogen \
  swagger-ui-express
```

2개의 라이브러리를 설치해 사용할 예정인데요, 용도는 아래와 같아요!

- `swagger-autogen`: Express의 라우터 코드에서 Swagger 문서를 자동으로 생성하는 라이브러리
- `swagger-ui-express`: swagger-ui를 Express 프로젝트에 쉽게 적용시킬 수 있도록 하는 라이브러리

### 👉 Swagger 세팅

이제 `src/index.js` 파일을 수정해 Swagger UI가 렌더링 되도록 설정하도록 할게요.

```jsx
import swaggerAutogen from "swagger-autogen";
import swaggerUiExpress from "swagger-ui-express";

// ...

app.use(
  "/docs",
  swaggerUiExpress.serve,
  swaggerUiExpress.setup({}, {
    swaggerOptions: {
      url: "/openapi.json",
    },
  })
);

app.get("/openapi.json", async (req, res, next) => {
  // #swagger.ignore = true
  const options = {
    openapi: "3.0.0",
    disableLogs: true,
    writeOutputFile: false,
  };
  const outputFile = "/dev/null"; // 파일 출력은 사용하지 않습니다.
  const routes = ["./src/index.js"];
  const doc = {
    info: {
      title: "UMC 9th",
      description: "UMC 9th Node.js 테스트 프로젝트입니다.",
    },
    host: "localhost:3000",
  };

  const result = await swaggerAutogen(options)(outputFile, routes, doc);
  res.json(result ? result.data : null);
});

// ...
```

이제 서버를 키고 `localhost:3000/docs`경로에 들어가면 Swagger UI가 렌더링되고, 여기에서 `/openapi.json` 을 다시 동적으로 호출하여 API 서버의 라우트 및 파라미터 정보들을 불러오게 됩니다.

Swagger UI는 아래와 같이 보여야 합니다! 이제 저희의 Node.js 서버에 어떤 API들이 존재하는지 목록을 볼 수 있게 되었습니다 🙌 

![CleanShot 2024-09-14 at 00.20.58@2x.png](Chapter%208%20%ED%94%84%EB%A1%A0%ED%8A%B8%EC%97%94%EB%93%9C%20%EC%97%B0%EB%8F%99%EA%B3%BC%20Swagger%20-%20Swagger%20%EC%84%A4%EC%A0%95%ED%95%98%EA%B8%B0/CleanShot_2024-09-14_at_00.20.582x.png)

### 👉 부족한 내용 채우기

하지만 실제로 API 정보를 하나씩 열어보면 사진처럼 아무런 정보도 없는 것을 알 수 있습니다.

![CleanShot 2024-09-14 at 00.21.56@2x.png](Chapter%208%20%ED%94%84%EB%A1%A0%ED%8A%B8%EC%97%94%EB%93%9C%20%EC%97%B0%EB%8F%99%EA%B3%BC%20Swagger%20-%20Swagger%20%EC%84%A4%EC%A0%95%ED%95%98%EA%B8%B0/CleanShot_2024-09-14_at_00.21.562x.png)

이 정보는 자동으로 채워질 수 없고, 저희가 직접 주석을 통해 정의해야 합니다. 예시로 2개의 API Controller에 대해서 주석으로 Swagger 정보를 추가로 채워보겠습니다!

```jsx
export const handleListStoreReviews = async (req, res, next) => {
  /*
    #swagger.summary = '상점 리뷰 목록 조회 API';
    #swagger.responses[200] = {
      description: "상점 리뷰 목록 조회 성공 응답",
      content: {
        "application/json": {
          schema: {
            type: "object",
            properties: {
              resultType: { type: "string", example: "SUCCESS" },
              error: { type: "object", nullable: true, example: null },
              success: {
                type: "object",
                properties: {
                  data: {
                    type: "array",
                    items: {
                      type: "object",
                      properties: {
                        id: { type: "number" },
                        store: { type: "object", properties: { id: { type: "number" }, name: { type: "string" } } },
                        user: { type: "object", properties: { id: { type: "number" }, email: { type: "string" }, name: { type: "string" } } },
                        content: { type: "string" }
                      }
                    }
                  },
                  pagination: { type: "object", properties: { cursor: { type: "number", nullable: true } }}
                }
              }
            }
          }
        }
      }
    };
  */
  res.success(...);
```

조금 복잡해 보이긴 하지만, 7주차에 만든 표준 응답 객체를 그대로 ‘문서화’ 해 둔 것 뿐입니다. 계층별로 하나씩 뜯어보면서 작성해 보도록 할게요. 

### 💖 1단계: API 제목과 표준 응답 껍데기 만들기

```jsx
/*
  #swagger.summary = '상점 리뷰 목록 조회 API';

  #swagger.responses[200] = {
    description: "상점 리뷰 목록 조회 성공 응답",
    content: {
      "application/json": {
        schema: {
          type: "object",
          properties: {
            // ▼▼▼ 7주차 표준 응답  ▼▼▼
            resultType: { type: "string", example: "SUCCESS" },
            error: { type: "object", nullable: true, example: null },
            success: { type: "object" } // 곧 채울 부분 
          }
        }
      }
    }
  };
*/
```

먼저 API의 제목(`summary` )과 7주차에서 다뤘던 표준 응답의 ‘틀’(`resultType` , `error` , `success`) 부터 만들어 줍니다. 

### 💖 2단계: ‘success’ 객체 채우기

```jsx
/*
  ... (이전 코드 동일) ...
  "success": {
    type: "object",
    properties: {
      // ▼▼▼ 6주차 목록 API 구조 ▼▼▼
      data: { type: "array" }, // 곧 채울 부분
      pagination: { type: "object" } // 곧 채울 부분 
    }
  }
  ...
*/
```

이제 `success` 객체 안에 뭐가 들어갈지 `properties` 를 채워봅시다. `data` 와 `pagination` 이 들어가겠죠? 

### 💖 3단계: ‘data’ 배열 채우기

```jsx
/*
  ... (이전 코드 동일) ...
  "data": {
    type: "array",
    items: {
      // ▼▼▼ 리뷰 '한 개'의 모양 ▼▼▼
      type: "object",
      properties: {
        id: { type: "number" },
        content: { type: "string" }
        // 채울 부분 
      }
    }
  },
  "pagination": { type: "object" }
  ...
*/
```

이제 `data` 배열을 채울 차례입니다. `type: "array"` 에는 `items` 라는 속성으로 배열의 각 항목이 어떻게 생겼는지 설명해 줍니다. 

### 💖 4단계: ’items’와 ‘pagination’ 완성하기(최종)

```jsx
/*
  ... (이전 코드 동일) ...
  "items": {
    type: "object",
    properties: {
      id: { type: "number" },
      // ▼▼▼ 중첩 객체(JOIN 데이터) 마저 채우기 ▼▼▼
      store: { type: "object", properties: { id: { type: "number" }, name: { type: "string" } } },
      user: { type: "object", properties: { id: { type: "number" }, email: { type: "string" }, name: { type: "string" } } },
      content: { type: "string" }
    }
  },
  "pagination": {
    type: "object",
    // ▼▼▼ 페이지네이션 정보 채우기 ▼▼▼
    properties: { 
      cursor: { type: "number", nullable: true } 
    }
  }
  ... (이하 최종 완성본과 동일)
*/
```

이제 Swagger의 구조가 좀 감이 오시나요? 

회원가입 API에도 스웨거를 달아줍시다. 

```jsx
export const handleUserSignUp = async (req, res, next) => {
  /*
    #swagger.summary = '회원 가입 API';
    #swagger.requestBody = {
      required: true,
      content: {
        "application/json": {
          schema: {
            type: "object",
            properties: {
              email: { type: "string" },
              name: { type: "string" },
              gender: { type: "string" },
              birth: { type: "string", format: "date" },
              address: { type: "string" },
              detailAddress: { type: "string" },
              phoneNumber: { type: "string" },
              preferences: { type: "array", items: { type: "number" } }
            }
          }
        }
      }
    };
    #swagger.responses[200] = {
      description: "회원 가입 성공 응답",
      content: {
        "application/json": {
          schema: {
            type: "object",
            properties: {
              resultType: { type: "string", example: "SUCCESS" },
              error: { type: "object", nullable: true, example: null },
              success: {
                type: "object",
                properties: {
                  email: { type: "string" },
                  name: { type: "string" },
                  preferCategory: { type: "array", items: { type: "string" } }
                }
              }
            }
          }
        }
      }
    };
    #swagger.responses[400] = {
      description: "회원 가입 실패 응답",
      content: {
        "application/json": {
          schema: {
            type: "object",
            properties: {
              resultType: { type: "string", example: "FAIL" },
              error: {
                type: "object",
                properties: {
                  errorCode: { type: "string", example: "U001" },
                  reason: { type: "string" },
                  data: { type: "object" }
                }
              },
              success: { type: "object", nullable: true, example: null }
            }
          }
        }
      }
    };
  */
  res.success(...);
};
```

요청의 body는 응답과 거의 비슷하게 정의해주시면 됩니다. 그리고 위 예제에서는 중복 이메일의 경우 회원 가입 API 호출이 실패할 수 있으므로, 실패하는 응답도 정의하고 있습니다.

### 👉 Swagger 확인하기

아래 이미지와 같이 요청 파라미터에 대한 정보, 응답에 대한 정보 등이 잘 표현되어야 합니다. 잘 보이지 않는 경우 오타를 확인해보시고, Node.js 서버의 터미널 로그에 오류가 있지는 않은지 확인해주세요!

![CleanShot 2024-09-14 at 00.33.15@2x.png](Chapter%208%20%ED%94%84%EB%A1%A0%ED%8A%B8%EC%97%94%EB%93%9C%20%EC%97%B0%EB%8F%99%EA%B3%BC%20Swagger%20-%20Swagger%20%EC%84%A4%EC%A0%95%ED%95%98%EA%B8%B0/CleanShot_2024-09-14_at_00.33.152x.png)

![CleanShot 2024-09-14 at 00.33.27@2x.png](Chapter%208%20%ED%94%84%EB%A1%A0%ED%8A%B8%EC%97%94%EB%93%9C%20%EC%97%B0%EB%8F%99%EA%B3%BC%20Swagger%20-%20Swagger%20%EC%84%A4%EC%A0%95%ED%95%98%EA%B8%B0/CleanShot_2024-09-14_at_00.33.272x.png)

### 👉 필요 없는 Route는 숨기기

Swagger UI에서 굳이 보이지 않아도 괜찮은 Controller들은 아래 주석을 추가해서 숨길 수 있습니다. 이미 위 예제에서는 `/openapi.json` 경로의 경우 이 주석을 통해 숨겨두었습니다 👍 

```jsx
// #swagger.ignore = true
```

### 👉 Component로 중복 줄이기

8주차 미션을 진행하다 보면, Swagger 코드가 상당히 중복된다는 것을 깨닫게 될 겁니다.

만약에 10개의 API가 모두 “인증 실패” 에러를 반환할 수 있다면, 10번의 복붙을 해야 한다는 것도요.

만약 나중에 표준 에러 응답에 `timestamp`  필드를 하나 추가하고 싶어진다면 어떻게 할까요? 이 10개의 파일을 모두 찾아서 수정하는 방법밖엔 없을까요?

아닙니다. Swagger에서는 이렇게 중복되는 schema들을 한 곳에서 관리하고, 주석에서는 `$ref` 를 통해 참조만 하여 이용할 수 있도록도 제공하고 있습니다.

User schema를 여기저기서 사용해야 하거나 하는 경우에 유용한데요. 아래 문서를 참고해보시기 바랍니다 :)

[Schemas and Components | Swagger Autogen](https://swagger-autogen.github.io/docs/openapi-3/schemas-and-components/)

### 👉 주석으로 정의하기 귀찮아요..

JavaScript의 슈퍼셋(상위 호환) 언어인 TypeScript를 사용하면, Type 지원을 통해 주석 없이도 자동으로 타입을 추론하여 Swagger 문서를 생성하는 것이 가능합니다. (이를 지원하는 라이브러리들도 아주 많습니다!)

하지만 UMC Node.js 파트에서는 TypeScript는 진입 장벽이 있다고 판단해서 일단은 JavaScript로 워크북을 구성했습니다. 혹시 관심이 있으신 분들은 TypeScript를 따로 공부해 사용하는 것도 좋을 것 같습니다! 

(UMC Node.js 10주차에서도 TypeScirpt를 다룰 예정이긴 합니다!)

[JavaScript With Syntax For Types.](https://www.typescriptlang.org/)