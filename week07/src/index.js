import dotenv from "dotenv";
import express from "express";
import morgan from "morgan";
import cors from "cors";
import { handleUserSignUp } from "./controllers/user.controller.js";
import { handleAddStore } from "./controllers/store.controller.js";
import {
  handleAddReview,
  handleGetReviews,
  handleGetMyReviews,
} from "./controllers/review.controller.js";
import {
  handleAcceptMission,
  handleAddMission,
  handleGetMissions,
  handleMyMissions,
  handleCompleteMission,
} from "./controllers/mission.controller.js";
import cookieParser from "cookie-parser";
import compression from "compression";
dotenv.config();

const app = express();
const port = process.env.PORT;
app.use(morgan("dev"));
app.use(cookieParser());
app.use(
  compression({
    level: 6,
    threshold: 500,
    filter: (req, res) => {
      if (req.headers["x-no-compression"]) return false;
      return compression.filter(req, res);
    },
  })
);
app.use((req, res, next) => {
  res.success = (success) => {
    return res.json({ resultType: "SUCCESS", error: null, data: success });
  };

  res.error = ({ errorCode = "unknown", reason = null, data = null }) => {
    return res.json({
      resultType: "FAIL",
      error: { errorCode, reason, data },
      data: null,
    });
  };

  next();
});

app.use(cors()); // cors 방식 허용
app.use(express.static("public")); // 정적 파일 접근
app.use(express.json()); // request의 본문을 json으로 해석할 수 있도록 함 (JSON 형태의 요청 body를 파싱하기 위함)
app.use(express.urlencoded({ extended: false })); // 단순 객체 문자열 형태로 본문 데이터 해석

const myLogger = (req, res, next) => {
  console.log("LOGGED");
  next();
};

app.use(myLogger);

app.get("/", (req, res) => {
  res.send("Hello World!");
});
app.post("/api/v1/users/signup", handleUserSignUp);
app.post("/api/v1/biz/stores", handleAddStore); // 특정 지역에 가게 추가하기 API
app.post("/api/v1/stores/:storeId/reviews", handleAddReview); // 가게에 리뷰 추가하기 API
app.post("/api/v1/biz/stores/:storeId/missions", handleAddMission); // 가게에 미션 추가하기 API
app.post("/api/v1/missions/:missionId", handleAcceptMission); // 가게의 미션을 도전 중인 미션에 추가 (미션 도전하기) API
app.get("/api/v1/stores/:storeId/reviews", handleGetReviews);
app.get("/api/v1/reviews/me", handleGetMyReviews);
app.get("/api/v1/stores/:storeId/missions", handleGetMissions);
app.get("/api/v1/missions/me", handleMyMissions);
app.patch("/api/v1/biz/missions", handleCompleteMission);

// 쿠키 만드는 라우터
app.get("/setcookie", (req, res) => {
  // 'myCookie'라는 이름으로 'hello' 값을 가진 쿠키를 생성
  res.cookie("myCookie", "hello", { maxAge: 60000 }); // 60초간 유효
  res.send("쿠키가 생성되었습니다!");
});
// 쿠키 읽는 라우터
app.get("/getcookie", (req, res) => {
  // cookie-parser 덕분에 req.cookies 객체에서 바로 꺼내 쓸 수 있음
  const myCookie = req.cookies.myCookie;

  if (myCookie) {
    console.log(req.cookies); // { myCookie: 'hello' }
    res.send(`당신의 쿠키: ${myCookie}`);
  } else {
    res.send("쿠키가 없습니다.");
  }
});

const isLogin = (req, res, next) => {
  // cookie-parser가 만들어준 req.cookies 객체에서 username을 확인
  const { username } = req.cookies;

  if (username) {
    console.log(`[인증 성공] ${username}님, 환영합니다.`);
    next();
  } else {
    console.log("[인증 실패] 로그인이 필요합니다.");
    res
      .status(401)
      .send(
        '<script>alert("로그인이 필요합니다!");location.href="/login";</script>'
      );
  }
};

app.get("/", (req, res) => {
  res.send(`
        <h1>메인 페이지</h1>
        <p>이 페이지는 로그인이 필요 없습니다.</p>
        <ul>
            <li><a href="/mypage">마이페이지 (로그인 필요)</a></li>
        </ul>
    `);
});

app.get("/login", (req, res) => {
  res.send(
    "<h1>로그인 페이지</h1><p>로그인이 필요한 페이지에서 튕겨나오면 여기로 옵니다.</p>"
  );
});

app.get("/mypage", isLogin, (req, res) => {
  res.send(`
        <h1>마이페이지</h1>
        <p>환영합니다, ${req.cookies.username}님!</p>
        <p>이 페이지는 로그인한 사람만 볼 수 있습니다.</p>
    `);
});

app.get("/set-login", (req, res) => {
  res.cookie("username", "UMC9th", { maxAge: 3600000 });
  res.send(
    '로그인 쿠키(username=UMC9th) 생성 완료! <a href="/mypage">마이페이지로 이동</a>'
  );
});

app.get("/set-logout", (req, res) => {
  res.clearCookie("username");
  res.send('로그아웃 완료 (쿠키 삭제). <a href="/">메인으로</a>');
});

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
