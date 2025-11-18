# Chapter 7. Express 미들웨어 & API 응답 통일 & 에러 핸들링 - API 응답 통일 & 에러 핸들링 (1)

<aside>
<img src="https://www.notion.so/icons/list_gray.svg" alt="https://www.notion.so/icons/list_gray.svg" width="40px" /> **목차**

</aside>

### 👉 기존 API 응답

기존 `POST /api/v1/users/signup` 경로의 API 응답은 어떠했나요?

```json
{
  "result": {
    "email": "test@example.com",
    "name": "엘빈",
    "preferCategory": ["과일", "생선"]
  }
}
```

이런 식이었을 거예요. 여러분들이 직접 구현한 다른 API의 응답은 어떠했나요? 아무래도 꼼꼼하게 신경쓰지 못헀다면, 응답의 모양이 제각각일 수 있을 것 같습니다.

이를 개선하기 위해서는 미들웨어를 통해 모든 API 응답의 모양을 강제로 통일하는 것이 필요합니다. 이렇게 통일하면 나중에 프론트엔드, 클라이언트에서 API를 사용할 때 훨씬 쉽게 통합하고 개발할 수 있게 됩니다.

API가 성공했을 때 어디는 “OK”라고 하고, 어디는 “Success”라고 한다면 일관성이 없어 이게 성공인건지 저게 성공인건지 많이 헷갈리겠죠?

### 👉 API 응답 통일 준비

API 응답은 프로젝트에 따라 정할 수 있지만, UMC Node.js 파트에서는 다음과 같이 API 응답을 통일해보겠습니다.

```json
{
  "resultType": "SUCCESS",
  "error": null,
  "success": {...}
}
```

```json
{
  "resultType": "FAIL",
  "error": {
    "errorCode": "A100",
    "reason": "오류 원인",
    "data": {...}
  },
  "success": null
}
```

- `resultType`: 요청의 성공 여부를 반환합니다.
- `error`: 실패한 경우, 오류와 관련한 데이터를 선택적으로 담습니다.
    - `errorCode`: 오류를 식별할 수 있는 코드를 담습니다.
    - `reason`: 발생한 오류의 메시지를 담습니다.
    - `data`: 추가적으로 응답이 내려가야 하는 경우, 이곳에 담습니다.
- `success`: 성공한 경우, 성공 응답을 그대로 담습니다.

### 👉 API 응답 통일

응답을 통일하기 위해, 우선 `src/controllers/user.controller.js` 파일을 아래와 같이 수정해보겠습니다.

```jsx
import { StatusCodes } from "http-status-codes";
import { bodyToUser } from "../dtos/user.dto.js";
import { userSignUp } from "../services/user.service.js";

export const handleUserSignUp = async (req, res, next) => {
  console.log("회원가입을 요청했습니다!");
  console.log("body:", req.body); // 값이 잘 들어오나 확인하기 위한 테스트용

  const user = await userSignUp(bodyToUser(req.body));

  res.status(StatusCodes.OK).json({
    resultType: "SUCCESS",
    error: null,
    success: user,
  });
};
```

하지만 이렇게 수정하면 모든 Controller에서 매번 응답을 설정하기도 힘들고, 코드를 복붙하면서 실수하거나 파편화가 일어날 가능성도 커지게 됩니다.

그래서 이를 개선하기 위해, 먼저 공통 함수를 만들어보겠습니다. `src/index.js` 파일을 아래와 같이 수정해주세요.

```jsx
import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import { handleUserSignUp } from "./controllers/user.controller.js";

dotenv.config();

const app = express();
const port = process.env.PORT;

/**
 * 공통 응답을 사용할 수 있는 헬퍼 함수 등록
 */
app.use((req, res, next) => {
  res.success = (success) => {
    return res.json({ resultType: "SUCCESS", error: null, success });
  };

  res.error = ({ errorCode = "unknown", reason = null, data = null }) => {
    return res.json({
      resultType: "FAIL",
      error: { errorCode, reason, data },
      success: null,
    });
  };

  next();
});

app.use(cors()); // cors 방식 허용
app.use(express.static("public")); // 정적 파일 접근
app.use(express.json()); // request의 본문을 json으로 해석할 수 있도록 함 (JSON 형태의 요청 body를 파싱하기 위함)
app.use(express.urlencoded({ extended: false })); // 단순 객체 문자열 형태로 본문 데이터 해석

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.post("/api/v1/users/signup", handleUserSignUp);

/**
 * 전역 오류를 처리하기 위한 미들웨어
 */
app.use((err, req, res, next) => {
  if (res.headersSent) {
    return next(err);
  }

  res.status(err.statusCode || 500).error({
    errorCode: err.errorCode || "unknown",
    reason: err.reason || err.message || null,
    data: err.data || null,
  });
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});

```

상단에는 `res` 객체에 `success`, `error` 함수를 등록해 쉽게 공통 응답을 내려줄 수 있도록 제공합니다. 이 미들웨어가 실행된 이후의 다른 Controller, 미들웨어 등에서는 `res.json`, `res.error` 함수를 사용할 수 있습니다.

모든 Controller가 등록된 후, 하단에는 전역 오류를 처리하기 위한 미들웨어를 등록합니다. 이 미들웨어는 Controller 내에서 별도로 처리하지 않은 오류가 발생할 경우, 모두 잡아서 공통된 오류 응답으로 내려주게 됩니다.

`src/controllers/user.controller.js` 파일은 다시 아래와 같이 수정해주세요. (위에서 사용했던 `res.success` 함수를 사용하도록 수정했습니다.)

```jsx
import { StatusCodes } from "http-status-codes";
import { bodyToUser } from "../dtos/user.dto.js";
import { userSignUp } from "../services/user.service.js";

export const handleUserSignUp = async (req, res, next) => {
  console.log("회원가입을 요청했습니다!");
  console.log("body:", req.body); // 값이 잘 들어오나 확인하기 위한 테스트용
	
  const user = await userSignUp(bodyToUser(req.body));
  
  res.status(StatusCodes.OK).success(user);

  };
```

### 👉 테스트 해보기

이제 저희가 적용한 API 응답이 예상대로 잘 내려오는지 학인해보도록 하겠습니다.

API 응답이 성공하는 경우, 아래와 같이 응답이 반환되어야 합니다. `success` 내에 기존 응답이 포함되어 있는 것을 볼 수 있습니다.

```json
{
  "resultType": "SUCCESS",
  "error": null,
  "success": {
    "email": "test@example.com",
    "name": "엘빈",
    "preferCategory": ["a"]
  }
}
```

API가 실패하는 경우, 아래와 같이 오류 응답이 반환되어야 합니다.

```json
{
  "resultType": "FAIL",
  "error": {
    "errorCode": "unknown",
    "reason": "이미 존재하는 이메일입니다.",
    "data": null
  },
  "success": null
}
```

충분히 잘 구현되었지만, `errorCode` 등이 기본값으로 들어가 다소 아쉬움이 있습니다. 추후에 프론트엔드, 클라이언트에서 오류의 종류에 따라 적절히 처리하기에도 어려워 보입니다.

### 👉 오류 응답 개선하기

전역 오류를 처리하는 미들웨어는 다음과 같이 구현했습니다.

```jsx
/**
 * 전역 오류를 처리하기 위한 미들웨어
 */
app.use((err, req, res, next) => {
  if (res.headersSent) {
    return next(err);
  }

  res.status(err.statusCode || 500).error({
    errorCode: err.errorCode || "unknown",
    reason: err.reason || err.message || null,
    data: err.data || null,
  });
});
```

`err`에 `errorCode`, `data`와 같은 값들을 넣을 수 있으면 좋을 것 같은데, 그렇게 할 수 있는 방법이 하나 있습니다. 바로 우리만의 `Error` 객체를 만들어서 사용하는 것이죠!

`src/errors.js` 파일을 생성해서, 아래와 같이 입력해주세요. `errorCode`는 고정된 값을 넣고, 생상자(`constructor`)를 통해 필요에 따라 오류 데이터를 추가로 담을 수 있도록 구현했습니다.

```jsx
export class DuplicateUserEmailError extends Error {
  errorCode = "U001";

  constructor(reason, data) {
    super(reason);
    this.reason = reason;
    this.data = data;
  }
}
```

그리고 `src/services/user.service.js` 파일을 아래와 같이 수정해주세요. 기존의 오류 원인을 표시하는 문자열은 그대로 포함하면서, 처리에 실패한 `data` 변수를 오류 응답에도 포함시켜서 프론트엔드, 클라이언트에서 더 디버깅하기 쉽도록 개선했습니다.

```jsx
import { responseFromUser } from "../dtos/user.dto.js";
import { DuplicateUserEmailError } from "../errors.js";
import {
  addUser,
  getUser,
  getUserPreferencesByUserId,
  setPreference,
} from "../repositories/user.repository.js";

export const userSignUp = async (db, data) => {
  const joinUserId = await addUser(db, {
    email: data.email,
    name: data.name,
    gender: data.gender,
    birth: data.birth,
    address: data.address,
    detailAddress: data.detailAddress,
    phoneNumber: data.phoneNumber,
  });

  if (joinUserId === null) {
    throw new DuplicateUserEmailError("이미 존재하는 이메일입니다.", data);
  }

  for (const preference of data.preferences) {
    await setPreference(db, joinUserId, preference);
  }

  const user = await getUser(db, joinUserId);
  const preferences = await getUserPreferencesByUserId(db, joinUserId);

  return responseFromUser({ user, preferences });
};
```

이제 오류가 발생하면, 아래와 같이 오류 응답이 표시될 거예요. API 오류를 받았을 때 더 확인하고 처리하기 쉬워졌어요!

```jsx
{
  "resultType": "FAIL",
  "error": {
    "errorCode": "U001",
    "reason": "이미 존재하는 이메일입니다.",
    "data": {
      "email": "test@example.com",
      "name": "엘빈",
      "gender": "남성",
      "birth": "2000-02-03T00:00:00.000Z",
      "address": "주소1",
      "detailAddress": "세부주소1",
      "phoneNumber": "010-1234-1234",
      "preferences": [1]
    }
  },
  "success": null
}
```

### 👉 이렇게 에러 코드를 분리해야 할 필요가 있을까요?

워크북을 진행하면서 “U001”처럼 `errorCode` 를 따로 만든 이유가 바로 여기에 있습니다.

만약 모든 오류가 ‘unknown’으로 응답된다면, 프론트엔드 개발자는 사용자에게 ‘서버 오류가 발생했습니다’ 라는 말밖에 띄워줄 수 없습니다.

하지만 이렇게 `errorCode` 를 명확하게 내려준다면, 프론트엔드에서는 이 코드를 보고 분기 처리를 할 수 있습니다.

- `U001`  (이메일 중복)을 받으면 “이미 존재하는 이메일입니다.” 라는 알림을,
- `U002` (비밀번호 규칙 위반)을 받으면 “비밀번호는 8자 이상이어야 합니다” 와 같은

구체적이고 친절한 안내를 사용자에게 보여줄 수 있게 되는 것입니다.