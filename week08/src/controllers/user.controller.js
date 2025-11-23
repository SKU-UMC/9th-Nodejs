import { StatusCodes } from "http-status-codes";
import { bodyToUser } from "../dtos/user.dto.js";
import { userSignUp } from "../services/user.service.js";

export const handleUserSignUp = async (req, res, next) => {
  /*
    #swagger.summary = "회원가입"
    #swagger.tags = ["Auth"]
    #swagger.requestBody = {
      required: true,
      content:{
        "application/json": {
          schema:{
            type: "object",
            properties: {
              email : {type:"string", example: "hamh1121@gmail.com"},
              name : {type:"string", example: "호시"},
              password: {type:"string", example: "1234"},
              gender: {type:"string", example: "MALE"},
              birth: {type:"string", example : "2002-03-28"},
              address: {type:"number", example: 1},
              detailAddress : {type:"string", example: "세부주소1"},
              phoneNumber: {type : "string", example : "01051592710"},
              preferences: {type:"array", items:{
                type: "number",
                example : 1
              }}
            }
          }
        }
      }
    }
    #swagger.responses[200] = {
      description: "회원가입 성공 응답",
      content: {
        "application/json":{
          schema:{
            type: "object",
            properties: {
              resultType: { type: "string", example: "SUCCESS"},
              error: {type: "object", nullable : true, example:null},
              data : {
                type: "object",
                properties : {
                  result :{
                    type: "object",
                    properties :{
                      id : {type:"number", example : 1},
                      preferences: {type:"array", items:{
                        type:"string", example: "한식"
                      }}
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
    #swagger.responses[500] = {
      description: "회원가입 실패 응답 (이메일 중복)",
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
                  reason:{type:"string", example:"이미 존재하는 이메일입니다."},
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
  console.log("회원가입을 요청했습니다!");
  console.log("body:", req.body); // 값이 잘 들어오나 확인하기 위한 테스트용

  const user = await userSignUp(bodyToUser(req.body));
  res.status(StatusCodes.OK).success({ result: user });
};
