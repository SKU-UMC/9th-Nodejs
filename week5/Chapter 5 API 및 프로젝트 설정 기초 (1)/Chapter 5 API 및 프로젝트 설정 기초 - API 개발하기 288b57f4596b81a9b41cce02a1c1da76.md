# Chapter 5. API 및 프로젝트 설정 기초 - API 개발하기

<aside>
<img src="https://www.notion.so/icons/list_gray.svg" alt="https://www.notion.so/icons/list_gray.svg" width="40px" /> **목차**

</aside>

### 👉 라이브러리 설치하기

이번 주차의 실습에 필요한 라이브러리들은 아래와 같아요. 한 번에 설치하시길 원한다면, 아래 스크립트를 복사해 실행해주세요!

```bash
npm install \
  cors \ 
  dotenv \
  http-status-codes \
  mysql2
```

✨ 설치하는 이유 

- `cors` → **보안 정책(CORS) 해결**
- `dotenv` → **환경 변수 관리**
- `http-status-codes` → **HTTP 코드 가독성**
- `mysql2` → **DB 연결**

### 👉 환경 변수 넣기

서버 프로젝트에는 다양한 상수와 비밀 값들이 필요해요. DB에 연결하기 위한 DB 호스트 및 계정 정보도 필요하고, 다른 서버와 연동하는 경우에는 해당 서버의 주소 정보, API Key 정보 등도 필요하게 돼요.

이러한 값들은 **GitHub에 업로드 되어선 안 되는데요**, 그렇지만 매번 입력하면서 개발을 하기에도 불편해요. 이를 위해 일반적으로 프로젝트에 `.env` 파일을 만들어서 상수, 비밀 값들을 기록하고, 이 `.env` 파일은 GitHub에 업로드 되지 않도록 설정해요.

가장 먼저, `.gitignore` 파일을 작업 공간의 가장 최상단에 생성해주세요.

![CleanShot 2024-09-07 at 20.44.36@2x.png](Chapter%205%20API%20%EB%B0%8F%20%ED%94%84%EB%A1%9C%EC%A0%9D%ED%8A%B8%20%EC%84%A4%EC%A0%95%20%EA%B8%B0%EC%B4%88%20-%20API%20%EA%B0%9C%EB%B0%9C%ED%95%98%EA%B8%B0/CleanShot_2024-09-07_at_20.44.362x.png)

그리고 이 `.gitignore` 파일에는 아래 내용을 추가해주세요. (혹은, [이 링크](https://www.toptal.com/developers/gitignore/api/node)의 내용을 모두 복사해주셔도 좋습니다.)

```
# dependency directories
node_modules/

# dotenv environment variable files
.env
.env.*
```

`.env` 파일도 같은 폴더에 생성해주세요.

- ✨의문 1 : node_modules/는 여기 왜 포함되는 건가요?
    
    이유 1: 용량이 너무 커요
    
    - node_modules 는 프로젝트에서 쓰는 **모든 라이브러리 + 의존성**이 설치되는 폴더입니다
    - 수천, 수만 개의 파일이 들어가고 용량이 수백 MB 이상이 될 수도 있습니다.
        - 아마 .env에 node_modules를 추가하지 않았을 때 깃에서 푸시가 막힐 수도 있어요. 반대로 얘기하면? 푸시되지 않는 원인은 node_modules 때문일 수 있습니다.
    - 이런 걸 GitHub에 업로드하면 불필요하게 저장소 용량이 커지고, clone/pull 할 때 속도도 매우 느려집니다.
    
    이유 2: 자동으로 다시 설치할 수 있어요
    
    - node_modules 안에 있는 패키지들은 **package.json과 package-lock.json*에 이미 기록돼 있어요.
    - 다른 개발자가 프로젝트를 받으면 npm install 만 실행하면 똑같이 설치됩니다.

![CleanShot 2024-09-07 at 20.44.36@2x.png](Chapter%205%20API%20%EB%B0%8F%20%ED%94%84%EB%A1%9C%EC%A0%9D%ED%8A%B8%20%EC%84%A4%EC%A0%95%20%EA%B8%B0%EC%B4%88%20-%20API%20%EA%B0%9C%EB%B0%9C%ED%95%98%EA%B8%B0/CleanShot_2024-09-07_at_20.44.362x%201.png)

그리고 이 `.env` 파일에는 아래 내용을 추가해주세요.

```bash
PORT=3000
```

`PORT` 환경 변수는 Express 서버가 어떤 포트로 열릴지를 설정하기 위한 값이에요. 기본적으로는 3000 포트로 서버 포트가 구성되지만, 앞으로는 환경 변수를 통해 변경할 수 있도롤 하고자 해요. 이를 위해서, `index.js` 파일을 다음과 같이 수정해주세요.

```jsx
import dotenv from "dotenv";
import express from "express";

dotenv.config();

const app = express();
const port = process.env.PORT;

app.use(cors());                            // cors 방식 허용
app.use(express.static('public'));          // 정적 파일 접근
app.use(express.json());                    // request의 본문을 json으로 해석할 수 있도록 함 (JSON 형태의 요청 body를 파싱하기 위함)
app.use(express.urlencoded({ extended: false })); // 단순 객체 문자열 형태로 본문 데이터 해석

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
```

`dotenv` 라이브러리는 `.env` 파일로부터 환경 변수를 읽어들이고, 이를 `process.env.` 객체를 통해 접근할 수 있도록 하는 역할을 해요. (`dotenv.config()` 부분이 바로 그 동작을 하는 부분이에요.)

이제 `.env` 파일의 `PORT` 값을 바꾸고 저장해보면서 포트가 잘 반영되는지 확인해보세요! (ex. 3001)

![CleanShot 2024-09-07 at 20.46.04@2x.png](Chapter%205%20API%20%EB%B0%8F%20%ED%94%84%EB%A1%9C%EC%A0%9D%ED%8A%B8%20%EC%84%A4%EC%A0%95%20%EA%B8%B0%EC%B4%88%20-%20API%20%EA%B0%9C%EB%B0%9C%ED%95%98%EA%B8%B0/CleanShot_2024-09-07_at_20.46.042x.png)

이는 `PORT=3001 npm run start` 로 실행하는 것과 동일하게 동작해요. 단지 터미널에 매번 환경 변수를 일일이 입력하기 번거롭기 떄문에, `.env` 파일을 이용해 저장해두는 것이에요.

### 👉 DB 연결하기

DB를 연결할 때 사용할 파일로는 `src` 폴더에 `db.config.js` 파일을 작성할게요.

![CleanShot 2024-09-07 at 21.04.03@2x.png](Chapter%205%20API%20%EB%B0%8F%20%ED%94%84%EB%A1%9C%EC%A0%9D%ED%8A%B8%20%EC%84%A4%EC%A0%95%20%EA%B8%B0%EC%B4%88%20-%20API%20%EA%B0%9C%EB%B0%9C%ED%95%98%EA%B8%B0/CleanShot_2024-09-07_at_21.04.032x.png)

`db.config.js` 파일에는 아래의 내용을 복사해주세요.

```jsx
import mysql from "mysql2/promise";
import dotenv from "dotenv";

dotenv.config();

export const pool = mysql.createPool({
  host: process.env.DB_HOST || "localhost", // mysql의 hostname
  user: process.env.DB_USER || "root", // user 이름
  port: process.env.DB_PORT || 3306, // 포트 번호
  database: process.env.DB_NAME || "umc_9th", // 데이터베이스 이름
  password: process.env.DB_PASSWORD || "password", // 비밀번호
  waitForConnections: true,
  // Pool에 획득할 수 있는 connection이 없을 때,
  // true면 요청을 queue에 넣고 connection을 사용할 수 있게 되면 요청을 실행하며, false이면 즉시 오류를 내보내고 다시 요청
  connectionLimit: 10, // 몇 개의 커넥션을 가지게끔 할 것인지
  queueLimit: 0, // getConnection에서 오류가 발생하기 전에 Pool에 대기할 요청의 개수 한도
});

```

여기에서도 환경 변수가 필요한데요, 이 환경 변수들 역시 `.env` 파일을 통해서 반영하도록 할게요. 아래에는 임의로 값들을 채워두었는데요, `DB_PASSWORD`, `DB_NAME`에는 여러분의 로컬 환경의 데이터베이스 정보를 입력해주세요.

```jsx
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD={비밀번호}
DB_NAME={데이터베이스_이름}
PORT=3000
```

다시 코드로 돌아가, 위의 코드에서는 `mysql.createPool`을 이용하고 있죠?

이 코드는 MySQL DB에 연결하기 위해 Connection Pool을 생성하여 사용하는 코드인데요, 간단히 설명드리면 매번 Connection을 생성하여 맺고 끊는 대신, DB 과부하를 방지하고 유동적으로 Connection을 관리하기 위해 사용하는 방법으로 이해해주시면 돼요.

### 👉 어떻게 API를 짤지 생각해보기

이제, API를 본격적으로 구현해보도록 할게요. 3주차에서 여러분이 직접 설계했던 API URL들을 떠올려주세요! (복사하여 아래에 붙여 넣어 주세요!)

- 박태경의 3주차 API URL 설계 내용
    
    [API 명세서 예시](Chapter%205%20API%20%EB%B0%8F%20%ED%94%84%EB%A1%9C%EC%A0%9D%ED%8A%B8%20%EC%84%A4%EC%A0%95%20%EA%B8%B0%EC%B4%88%20-%20API%20%EA%B0%9C%EB%B0%9C%ED%95%98%EA%B8%B0/API%20%EB%AA%85%EC%84%B8%EC%84%9C%20%EC%98%88%EC%8B%9C%2028ab57f4596b801fa8d6c2ed61233c0f.csv)
    

---

그러면 이제 API URL에 전달한 데이터에 대해 고민해볼게요.

회원 가입 기능을 구현하기 위해서는 사용자의 정보를 입력해서 제출해야 할 거예요. 하지만 현재 구조에서는 소셜 로그인만 있기 때문에 `email` 값을 받을 수는 없을 것 같은데요, 이 부분은 자유롭게 생각해주세요. `email` 값도 입력을 받는다고 생각해도 괜찮고, `null` 값이 들어외도 되도록 설정해주셔도 괜찮아요.

그러면, 이제 회원 가입 로직을 어떻게 짤지 조금 더 구체적으로 고민해볼게요. 크게 3가지를 고민해주세요. ➊ API URL (경로), ➋ HTTP 메소드, 그리고 ➌ 요청에 전달 받을 데이터, 이렇게 3가지예요.

- OOO의 생각
- UMC Node.js 파트장의 생각
    - API URL: `/api/v1/user/signup` 으로 하면 좋을 것 같아요. (여러분은 API URL 만큼은 꼭 3주차의 본인 설계 내용을 사용해주세요!)
    - HTTP 메소드: `POST` 로 하면 좋을 것 같아요.
    - 요청 데이터: 아래의 예시를 생각해봤어요.
        
        ```json
        {
          "email": "이메일@example.com",
          "password": "비밀번호",
          "name": "이름",
          "gender": "남성/여성",
          "birth": "2000-02-03",
          "address": "주소1",
          "detailAddress": "세부주소1",
          "phoneNumber": "010-1234-1234",
          "preferences": [1, 2, 5]
        }
        ```
        

### 👉 Controller 구현

생각이 끝났다면, 가장 먼저 API 요청을 받기 위한 길을 터주기 위해 `src/index.js` 파일을 수정해볼게요.

```jsx
import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import { handleUserSignUp } from "./controllers/user.controller.js";

dotenv.config();

const app = express();
const port = process.env.PORT;

app.use(cors()); // cors 방식 허용
app.use(express.static("public")); // 정적 파일 접근
app.use(express.json()); // request의 본문을 json으로 해석할 수 있도록 함 (JSON 형태의 요청 body를 파싱하기 위함)
app.use(express.urlencoded({ extended: false })); // 단순 객체 문자열 형태로 본문 데이터 해석

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.post("/api/v1/users/signup", handleUserSignUp);

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
```

Controller는 아직 구현하지 않았지만, 잠시 후에 만들 것을 예상하고 미리 가져왔어요. 정해진 URL로 `POST` 요청을 보내면 `handleUserSignUp` 함수가 실행될 거예요.

Controller도 마저 구현하기 위해, 이번에는 `src/controllers/user.controller.js` 파일을 수정해볼게요.

```jsx
import { StatusCodes } from "http-status-codes";
import { bodyToUser } from "../dtos/user.dto.js";
import { userSignUp } from "../services/user.service.js";

export const handleUserSignUp = async (req, res, next) => {
  console.log("회원가입을 요청했습니다!");
  console.log("body:", req.body); // 값이 잘 들어오나 확인하기 위한 테스트용

  const user = await userSignUp(bodyToUser(req.body));
  res.status(StatusCodes.OK).json({ result: user });
};
```

코드를 하나씩 뜯어볼까요?

의존성 부분부터 한번 봅시당.

`http-status-codes` 부분은 아까 위에서 라이브러리를 설치할 때 봤을 거에요. HTTP 응답 상태 코드를 상수로 편하게 가져다 쓰기 위해 사용합니다. 예시를 들어 `StatusCodes.OK` 같은 코드들을 → 숫자 `200` 으로 사용할 수 있어요. 

그리고 아직은 구현하지 않은 Service인 `userSignUp` 함수를 사용하고 있고, `userSignUp` 함수에 인자를 넘길 때 `bodyToUser` DTO를 이용해서 요청 데이터를 한 번 변환하여 전달하고 있어요.

`handleUserSignUp` 는 회원가입 요청이 들어왔을 때 실행되는 함수에요. 참고로 Controller는 `async`, `await`을 사용해서 비동기 함수로 구현했어요. 비동기에 대해 궁금한 분들은 아래 블로그 글들을 참고해보셔도 좋아요.

- 비동기 처리 (참고)
    
    [📚 자바스크립트 Async/Await 개념 & 문법 정복](https://inpa.tistory.com/entry/JS-📚-비동기처리-async-await)
    
    [Node.js: 비동기 프로그래밍 이해](https://www.nextree.co.kr/p7292/)
    
    [(TIL) 동기, 비동기와 Node.js에서의 비동기처리 방법](https://velog.io/@whdgh9595/TIL-동기-비동기와-Node.js에서의-비동기처리-방법)
    

`req`: HTTP 요청 데이터(헤더, 파라미터, 바디 등). 여기선 `req.body`에 회원가입 데이터가 담겨 있습니다.
그리고 res는 응답을 보내는 객체에요. 상태코드/헤더/JSON 바디를 설정합니다. 

`next`는 에러를 전역 에러 핸들러로 위임할 때 사용해요. 컨트롤러 내부에서 예외가 발생하거나, 검증 실패/중복 등 오류 상황을 next(err)로 넘기면 일관된 형태로 응답을 만들어 줄 수 있어요. 

+) 이 경우는 저번주에 봤던 프로젝트 구조에서 Controller에서 DTO를 만드는 경우구나! 라고 생각했으면 만점입니다. ㅎㅎ 

### 👉 DTO 구현

DTO는 입력 데이터를 정형화된 형태로 파싱, 검증하여 전달하는 역할을 해요. `birth` 필드를 `Date`로 파싱해서 변환하고, 그 외에 필수 값들은 `""`와 같이 빈 문자열이라도 전달되도록 구현하고 있어요.

```jsx
export const bodyToUser = (body) => {
  const birth = new Date(body.birth); //날짜 변환

  return {
    email: body.email, //필수 
    name: body.name, // 필수
    gender: body.gender, // 필수
    birth, // 필수
    address: body.address || "", //선택 
    detailAddress: body.detailAddress || "", //선택 
    phoneNumber: body.phoneNumber,//필수
    preferences: body.preferences,// 필수 
  };
};
```

### 👉 Service 구현

보내준 데이터를 이용해서 실제 로직을 구현하는 것은 바로 Service에서 이루어져요. 사용자를 추가하고, 사용자가 제대로 추가되었다면 선호하는 음식 카테고리를 연결(매핑)해줄 거예요.

선호 음식 카테고리가 모두 추가된 후, 요청한 명령을 다 수행했으니 제대로 잘 처리했다는 응답을 반환해주는 것으로 생각했습니다.

```jsx
import { responseFromUser } from "../user.dto.js";
import {
  addUser,
  getUser,
  getUserPreferencesByUserId,
  setPreference,
} from "../repositories/user.repository.js";

export const userSignUp = async (data) => {
  const joinUserId = await addUser({
    email: data.email,
    name: data.name,
    gender: data.gender,
    birth: data.birth,
    address: data.address,
    detailAddress: data.detailAddress,
    phoneNumber: data.phoneNumber,
  });

  if (joinUserId === null) {
    throw new Error("이미 존재하는 이메일입니다.");
  }

  for (const preference of data.preferences) {
    await setPreference(joinUserId, preference);
  }

  const user = await getUser(joinUserId);
  const preferences = await getUserPreferencesByUserId(joinUserId);

  return responseFromUser({ user, preferences });
};
```

`userSignUp` 함수에서는 여러 Repository 함수들을 호출하며 DB로부터 값을 조회하거나 생성하며 작업을 수행하고, 마지막으로는 `responseFromUser` DTO를 다시 사용해 데이터를 변환한 후 반환하고 있습니다.

사용자가 중복으로 회원 가입 할 수 없도록, 이메일을 기준으로 이미 가입한 사용자면 오류를 발생시키고 있습니다.

### 👉 Repository 구현

저희는 Repository를 통해 DB에 접근할 거예요. 하지만 저희가 원하는 결과를 얻으려면, 이를 위한 SQL 쿼리가 필요합니다.

아래 Repository에서는 함수 내에서 SQL 쿼리를 실행하고, 그 결과를 이용하고 있습니다.

```jsx
import { pool } from "../db.config.js";

// User 데이터 삽입
export const addUser = async (data) => {
  const conn = await pool.getConnection();

  try {
    const [confirm] = await pool.query(
      `SELECT EXISTS(SELECT 1 FROM user WHERE email = ?) as isExistEmail;`,
      data.email
    );

    if (confirm[0].isExistEmail) {
      return null;
    }

    const [result] = await pool.query(
      `INSERT INTO user (email, name, gender, birth, address, detail_address, phone_number) VALUES (?, ?, ?, ?, ?, ?, ?);`,
      [
        data.email,
        data.name,
        data.gender,
        data.birth,
        data.address,
        data.detailAddress,
        data.phoneNumber,
      ]
    );

    return result.insertId;
  } catch (err) {
    throw new Error(
      `오류가 발생했어요. 요청 파라미터를 확인해주세요. (${err})`
    );
  } finally {
    conn.release();
  }
};

// 사용자 정보 얻기
export const getUser = async (userId) => {
  const conn = await pool.getConnection();

  try {
    const [user] = await pool.query(`SELECT * FROM user WHERE id = ?;`, userId);

    console.log(user);

    if (user.length == 0) {
      return null;
    }

    return user;
  } catch (err) {
    throw new Error(
      `오류가 발생했어요. 요청 파라미터를 확인해주세요. (${err})`
    );
  } finally {
    conn.release();
  }
};

// 음식 선호 카테고리 매핑
export const setPreference = async (userId, foodCategoryId) => {
  const conn = await pool.getConnection();

  try {
    await pool.query(
      `INSERT INTO user_favor_category (food_category_id, user_id) VALUES (?, ?);`,
      [foodCategoryId, userId]
    );

    return;
  } catch (err) {
    throw new Error(
      `오류가 발생했어요. 요청 파라미터를 확인해주세요. (${err})`
    );
  } finally {
    conn.release();
  }
};

// 사용자 선호 카테고리 반환
export const getUserPreferencesByUserId = async (userId) => {
  const conn = await pool.getConnection();

  try {
    const [preferences] = await pool.query(
      "SELECT ufc.id, ufc.food_category_id, ufc.user_id, fcl.name " +
        "FROM user_favor_category ufc JOIN food_category fcl on ufc.food_category_id = fcl.id " +
        "WHERE ufc.user_id = ? ORDER BY ufc.food_category_id ASC;",
      userId
    );

    return preferences;
  } catch (err) {
    throw new Error(
      `오류가 발생했어요. 요청 파라미터를 확인해주세요. (${err})`
    );
  } finally {
    conn.release();
  }
};

```

`addUser`, `getUser`, `setPreference`, `getUserPreferencesByUserId` 함수들을 하나씩 잘 읽고 이해해보세요!

### 👉 DTO 구현 (추가)

위에서 `responseFromUser` 함수는 구현하지 않고 넘어갔었습니다. `responseFromUser` 함수는 여러분들께서 직접 구현해보시기 바랍니다.

힌트: `responseFromUser`는 **Service에서 받아온 유저 정보 + 선호 카테고리 리스트**를 **클라이언트에게 보여줄 수 있는 형식으로 변환**해주는 DTO 함수입니다! 

### 👉 DB 구축하기

자! 이제 다 됐으니 테스트를 한번 돌려볼까요?

> **Postman**
> 

테스트를 위해 Body 탭을 선택합니다! [**여기](Chapter%205%20API%20%EB%B0%8F%20%ED%94%84%EB%A1%9C%EC%A0%9D%ED%8A%B8%20%EC%84%A4%EC%A0%95%20%EA%B8%B0%EC%B4%88%20-%20Postman%20%EC%9D%B4%ED%95%B4%ED%95%98%EA%B8%B0%20288b57f4596b81108024e44f172262d0.md)** 에서 말했듯이  Body는 **POST, PUT, PATCH 요청**을 보낼 때 **데이터를 담아 보내는 곳입니다.** 

![image.png](Chapter%205%20API%20%EB%B0%8F%20%ED%94%84%EB%A1%9C%EC%A0%9D%ED%8A%B8%20%EC%84%A4%EC%A0%95%20%EA%B8%B0%EC%B4%88%20-%20API%20%EA%B0%9C%EB%B0%9C%ED%95%98%EA%B8%B0/image.png)

```sql
{
  "email": "jerry@example.com",
  "name": "제리",
  "gender": "여성",
  "birth": "2025-03-08",
  "address": "주소1",
  "detailAddress": "세부주소1",
  "phoneNumber": "010-1234-1234",
  "preferences": [1, 2, 5]
}
```

![image.png](Chapter%205%20API%20%EB%B0%8F%20%ED%94%84%EB%A1%9C%EC%A0%9D%ED%8A%B8%20%EC%84%A4%EC%A0%95%20%EA%B8%B0%EC%B4%88%20-%20API%20%EA%B0%9C%EB%B0%9C%ED%95%98%EA%B8%B0/image%201.png)

 이렇게 데이터를 넣고 send를 누르면!

![image.png](Chapter%205%20API%20%EB%B0%8F%20%ED%94%84%EB%A1%9C%EC%A0%9D%ED%8A%B8%20%EC%84%A4%EC%A0%95%20%EA%B8%B0%EC%B4%88%20-%20API%20%EA%B0%9C%EB%B0%9C%ED%95%98%EA%B8%B0/image%202.png)

이런 오류를 만나게 되실 분들이 계실텐데요. (미리 테이블을 만들어놓으셨다면 이 부분은 넘어가셔도 좋습니다!)

오류 메세지를 한번 잘 봐볼까요?

```vbnet
Error: 오류가 발생했어요. 요청 파라미터를 확인해주세요. 
(Error: Table 'umc9th.user' doesn't exist)
```

맞습니다. 이 오류는 MySQL에서 `user` 라는 테이블이 아직 생성되지 않았거나 현재 접속중인 데이터베이스에 `user` 테이블이 존재하지 않을때 뜨는 오류입니다. 

테이블이 없는데 레포지토리 코드에서 쿼리를 실행하려고 하니까 오류가 나는거예요. 

그럼 테스트에 필요한 테이블만 한번 빠르게 만들어볼까요?

MySQL CLI나 Workbench, Datagrip 등을 이용해 직접 SQL로 테이블을 생성할 수 있습니다. 

조금 번거로운 작업이죠..! 다음 주차 워크북에서 이 번거로운 작업을 하지 않아도 되는 좋은 도구를 배울 예정이니 이번주까지만 한번 버텨봅시다 😜

```sql
-- user 테이블 

CREATE TABLE user (
  id INT AUTO_INCREMENT PRIMARY KEY,
  email VARCHAR(255) NOT NULL UNIQUE,
  name VARCHAR(100) NOT NULL,
  gender ENUM('남성', '여성') NOT NULL,
  birth DATE NOT NULL,
  address VARCHAR(255),
  detail_address VARCHAR(255),
  phone_number VARCHAR(20)
);

--food_category 테이블 
CREATE TABLE food_category (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(50) NOT NULL
);

-- user_favor_category 테이블 
CREATE TABLE user_favor_category (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT,
  food_category_id INT,
  FOREIGN KEY (user_id) REFERENCES user(id),
  FOREIGN KEY (food_category_id) REFERENCES food_category(id)
);

```

예시로 써본 DB config문입니다! 꼭 이렇게 하시지 않으셔도 됩니다. 

### 👉 테스트 해보기

이제 DB에 테이블까지 넣었으니 정말로 구현한 API를 테스트해 보겠습니다. 

데이터를 넣고, Send 버튼을 누르면, 이렇게 **기분 좋은 200** 이 나옵니다~

![image.png](Chapter%205%20API%20%EB%B0%8F%20%ED%94%84%EB%A1%9C%EC%A0%9D%ED%8A%B8%20%EC%84%A4%EC%A0%95%20%EA%B8%B0%EC%B4%88%20-%20API%20%EA%B0%9C%EB%B0%9C%ED%95%98%EA%B8%B0/image%201.png)

![image.png](Chapter%205%20API%20%EB%B0%8F%20%ED%94%84%EB%A1%9C%EC%A0%9D%ED%8A%B8%20%EC%84%A4%EC%A0%95%20%EA%B8%B0%EC%B4%88%20-%20API%20%EA%B0%9C%EB%B0%9C%ED%95%98%EA%B8%B0/image%203.png)

DB에 데이터가 잘 들어갔는지도 확인! 

![image.png](Chapter%205%20API%20%EB%B0%8F%20%ED%94%84%EB%A1%9C%EC%A0%9D%ED%8A%B8%20%EC%84%A4%EC%A0%95%20%EA%B8%B0%EC%B4%88%20-%20API%20%EA%B0%9C%EB%B0%9C%ED%95%98%EA%B8%B0/image%204.png)

![image.png](Chapter%205%20API%20%EB%B0%8F%20%ED%94%84%EB%A1%9C%EC%A0%9D%ED%8A%B8%20%EC%84%A4%EC%A0%95%20%EA%B8%B0%EC%B4%88%20-%20API%20%EA%B0%9C%EB%B0%9C%ED%95%98%EA%B8%B0/image%205.png)

user_favor_category에 잘 매핑됐는지도 확인이 됐습니다. (이 API를 테스트하기 위해서는 food_category에 카테고리 더미데이터가 필요하단 사실 눈치채셨죠!?) 

아래 데이터도 넣어 봅시다.

```sql
{
  "email": "jerry@example.com",
  "name": "엘빈",
  "gender": "남성",
  "birth": "2000-02-03",
  "address": "주소1",
  "detailAddress": "세부주소1",
  "phoneNumber": "010-1234-1235",
  "preferences": [1, 2, 5]
}
```

**데이터가 잘 들어가나요?** 

 send 버튼을 누르면, 아래와 같은 응답을 받을 수 있습니다. 왜 이럴까요?

![image.png](Chapter%205%20API%20%EB%B0%8F%20%ED%94%84%EB%A1%9C%EC%A0%9D%ED%8A%B8%20%EC%84%A4%EC%A0%95%20%EA%B8%B0%EC%B4%88%20-%20API%20%EA%B0%9C%EB%B0%9C%ED%95%98%EA%B8%B0/image%206.png)

**엘빈과 제리**의 데이터 필드 값을 **비교**하며, 확인해봅시다!  감이 잡히시나요?💡

vscode 터미널에서 제대로 확인해봅시다!

![image.png](Chapter%205%20API%20%EB%B0%8F%20%ED%94%84%EB%A1%9C%EC%A0%9D%ED%8A%B8%20%EC%84%A4%EC%A0%95%20%EA%B8%B0%EC%B4%88%20-%20API%20%EA%B0%9C%EB%B0%9C%ED%95%98%EA%B8%B0/image%207.png)

이메일은 사용자별로 고유해야 하므로, **이메일 필드에는 UNIQUE 제약 조건이 설정되어 있습니다.**

따라서 **엘빈과 제리는 같은 이메일을 사용할 수 없습니다!** 🤩

> curl을 이용한 API 테스트 (사실상 Postman과 같은 방법이지만 이 방법도 익혀두면 좋습니다!)
> 

```bash
curl -X POST "http://localhost:3000/api/v1/users/signup" \
  -H "content-type: application/json" \
  -d '{
  "email": "test@example.com",
  "name": "엘빈",
  "gender": "남성",
  "birth": "2000-02-03",
  "address": "주소1",
  "detailAddress": "세부주소1",
  "phoneNumber": "010-1234-1234",
  "preferences": [1, 2, 5]
}'
```

Express 서버를 실행한 상태에서 새로운 터미널을 열고, 스크립트를 실행해주세요. API URL, 요청 데이터 등은 적절히 변경해주세요. `curl` 스크립트를 호출한 결과는 어떤가요? 잘 동작하나요?

아마 예시 응답은 아래와 같을 거예요.

- ✅ 성공하는 경우
    
    ```bash
    $ curl -X POST "http://localhost:3000/api/v1/users/signup" -H "content-type: application/json" -d '{
      "email": "test@example.com",
      "name": "엘빈",
      "gender": "남성",
      "birth": "2000-02-03",
      "address": "주소1",
      "detailAddress": "세부주소1",
      "phoneNumber": "010-1234-1234",
      "preferences": [1, 2, 5]
    }'
    {"result":{"email":"test@example.com","name":"엘빈","preferCategory":["한식","중식","치킨"]}}
    ```
    
- 🚨 실패하는 경우
    
    ```bash
    $ curl -X POST "http://localhost:3000/api/v1/users/signup" -H "content-type: application/json" -d '{
      "email": "test@example.com",
      "name": "엘빈",
      "gender": "남성",
      "birth": "2000-02-03",
      "address": "주소1",
      "detailAddress": "세부주소1",
      "phoneNumber": "010-1234-1234",
      "preferences": [1, 2, 5]
    }'
    <!DOCTYPE html>
    <html lang="en">
    <head>
    <meta charset="utf-8">
    <title>Error</title>
    </head>
    <body>
    <pre>Error: 이미 존재하는 이메일입니다.<br> &nbsp; &nbsp;at call (/playground-umc-7th-nodejs/playground-umc-7th-nodejs/src/user/user.service.js:21:11)<br> &nbsp; &nbsp;at tryCatch (/playground-umc-7th-nodejs/playground-umc-7th-nodejs/src/user/user.service.js:2:1)<br> &nbsp; &nbsp;at Generator._invoke (/playground-umc-7th-nodejs/playground-umc-7th-nodejs/src/user/user.service.js:2:1)<br> &nbsp; &nbsp;at Generator.next (/playground-umc-7th-nodejs/playground-umc-7th-nodejs/src/user/user.service.js:2:1)<br> &nbsp; &nbsp;at asyncGeneratorStep (/playground-umc-7th-nodejs/playground-umc-7th-nodejs/src/user/user.service.js:2:1)<br> &nbsp; &nbsp;at _next (/playground-umc-7th-nodejs/playground-umc-7th-nodejs/src/user/user.service.js:2:1)<br> &nbsp; &nbsp;at processTicksAndRejections (node:internal/process/task_queues:95:5)</pre>
    </body>
    </html>
    ```