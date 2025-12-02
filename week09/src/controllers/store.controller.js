import { StatusCodes } from "http-status-codes";
import { addStoreRequestDto } from "../dtos/store.dto.js";
import { addStore } from "../services/store.service.js";

export const handleAddStore = async (req, res, next) => {
  /*
    #swagger.summary = "가게 추가 하기"
    #swagger.tags = ["Biz"]
    #swagger.requestBody = {
      required:true,
      content:{
        "application/json": {
          schema: {
            type: "object",
            properties: {
              name:{type:"string", example:"오렌지 베이글"},
              foodType: {type:"number", example:1},
              address: {type:"number", example:1},
              detailAddress:{type:"string", example:"세부 주소"},
              openTime:{type:"string", example:"09:00:00"},
              closeTime:{type:"string", example:"21:00:00"}
            }
          }
        }
      }
    }
      #swagger.responses[201] = {
      description: "가게 추가 하기 성공",
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
                    name:{type:"string", example:"오렌지 베이글"},
                  }
                }
              }
            }
          }
        }
      }
    }
  */
  const store = await addStore(addStoreRequestDto(req.body));
  res.status(StatusCodes.CREATED).success(store);
};
