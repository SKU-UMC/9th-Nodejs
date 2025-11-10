import dotenv from "dotenv";
import express from "express";
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
dotenv.config();

const app = express();
const port = process.env.PORT;

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
