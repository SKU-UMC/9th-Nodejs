import { StatusCodes } from "http-status-codes";
import {
  addReview,
  getReviews,
  getMyReviews,
} from "../services/review.service.js";
import {
  addReviewRequestDto,
  getReviewsRequestDto,
  getMyReviewsRequestDto,
} from "../dtos/review.dto.js";

export const handleAddReview = async (req, res, next) => {
  /*
    #swagger.summary = "특정 가게의 리뷰 추가"
    #swagger.tags = ["Reviews"]  
    #swagger.requestBody = {
      required:true,
      content:{
        "application/json": {
          schema: {
            type: "object",
            properties: {
              score: {type:"number", example:4.5},
              content: {type:"string", example:"최고입니다!"},
              userId:{type:"number", example:1}
            }
          }
        }
      }
    }
    #swagger.responses[201] = {
      description: "특정 가게의 리뷰 추가 성공",
      content:{
        "application/json":{
          schema:{
            type:"object",
            properties:{
              resultType: { type: "string", example: "SUCCESS"},
              error: {type: "object", nullable : true, example:null},
              data:{
                type:"object",
                properties:{
                  id:{type:"number", example:1},
                  createdAt:{type:"string", example:"2025-11-20T00:27:13.905Z"}
                }
              }
            }
          }
        }
      }
    }
    #swagger.responses[500] = {
      description: "특정 가게의 리뷰 추가 실패 (존재하지 않는 식당)",
      content :{
        "application/json":{
          schema:{
            type: "object",
            properties: {
              resultType: {type:"string", example: "FAIL"},
              error: {
                type:"object",
                properties:{
                  errorCode:{type:"string", example:"unknown"},
                  reason:{type:"string", example:"존재하지 않는 식당 입니다."},
                  data:{type:"object", nullable:true, example:null}
                }
              },
              data : {type:"object", nullable:true, example:null}
            }
          }
        }
      }
    }
  */
  const review = await addReview(
    addReviewRequestDto(req.body, req.params, req.user)
  );
  res.status(StatusCodes.CREATED).success(review);
};
export const handleGetReviews = async (req, res, next) => {
  /*
    #swagger.summary = "특정 가게 리뷰 가져오기"
    #swagger.tags = ["Reviews"]
    #swagger.parameters["cursor"] = {
      in:"query",
      required:false,
      description:"페이지네이션 커서"
    }
    #swagger.parameters["storeId"] = {
      in:"path",
      required:true,
      description:"스토어 ID"
    }
    #swagger.responses[200] = {
      description: "특정 가게 리뷰 가져오기 성공",
      content:{
        "application/json":{
          schema:{
            type:"object",
            properties:{
              resultType: { type: "string", example: "SUCCESS"},
              error: {type: "object", nullable : true, example:null},
              data:{
                type:"array",
                items:{
                  type:"object",
                  properties:{
                    id:{type:"number", example:1},
                    score:{type:"number", example:4.5},
                    content:{type:"string", example:"최고입니다!"},
                    createdAt:{type:"string", example:"2025-11-20T00:27:13.905Z"},
                  }
                }
              }
            }
          }
        }
      }
    }
  */
  const reviews = await getReviews(getReviewsRequestDto(req.params, req.query));
  res.status(StatusCodes.OK).success(reviews);
};
export const handleGetMyReviews = async (req, res, next) => {
  /*
    #swagger.summary = "나의 리뷰 가져오기"
    #swagger.tags = ["Reviews"]
    #swagger.requestBody = {
      required:true,
      content:{
        "application/json": {
          schema: {
            type: "object",
            properties: {
              userId: {type:"number", example:1},
            }
          }
        }
      }
    }
    #swagger.responses[200] = {
      description: "나의 리뷰 가져오기 성공",
      content:{
        "application/json":{
          schema:{
            type:"object",
            properties:{
              resultType: { type: "string", example: "SUCCESS"},
              error: {type: "object", nullable : true, example:null},
              data:{
                type:"array",
                items:{
                  type:"object",
                  properties:{
                    id:{type:"number", example:1},
                    restaurant:{type:"string", example:"오렌지 베이글"},
                    score:{type:"number", example:4.5},
                    content:{type:"string", example:"최고입니다!"},
                    createdAt:{type:"string", example:"2025-11-20T00:27:13.905Z"},
                  }
                }
              }
            }
          }
        }
      }
    }
  */
  const reviews = await getMyReviews(
    getMyReviewsRequestDto(req.user, req.query)
  );
  res.status(StatusCodes.OK).success(reviews);
};
