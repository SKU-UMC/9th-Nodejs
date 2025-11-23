import { StatusCodes } from "http-status-codes";
import {
  acceptMissionRequestDto,
  addMissionRequestDto,
  getMissionsRequestDto,
  getMyMissionsRequestDto,
  completeMissionRequestDto,
} from "../dtos/mission.dto.js";
import {
  acceptMission,
  addMission,
  getMissions,
  getMyMissions,
  completeMission,
} from "../services/mission.service.js";

export const handleAddMission = async (req, res, next) => {
  /*
    #swagger.summary = "가게에 새로운 미션 추가"
    #swagger.tags = ["Biz","Missions"]
    #swagger.parameters["storeId"] = {
      in:"params",
      required:true,
      description:"가게 ID"
    }
    #swagger.requestBody = {
      required:true,
      content:{
        "application/json": {
          schema: {
            type: "object",
            properties: {
              endAt: {type:"string", example:"2025-11-25 19:00:00"},
              goal: {type:"number", example:10000},
              reward: {type:"number", example:100}
            }
          }
        }
      }
    }
    #swagger.responses[201] = {
      description: "새로운 미션 추가 성공",
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
  */
  const mission = await addMission(addMissionRequestDto(req.body, req.params));
  res.status(StatusCodes.CREATED).success(mission);
};

export const handleAcceptMission = async (req, res, next) => {
  /*
    #swagger.summary = "미션 수락"
    #swagger.tags = ["Missions"]
    #swagger.parameters["missionId"] = {
      in:"path",
      required:true,
      description:"미션 ID"
    }
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
    #swagger.responses[202] = {
      description: "미션 수락 성공",
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
                  acceptedAt:{type:"string", example:"2025-11-20T00:27:13.905Z"}
                }
              }
            }
          }
        }
      }
    }
    #swagger.responses[500] = {
      description: "미션 수락 실패 응답 (이미 수락한 미션)",
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
                  reason:{type:"string", example:"이미 수락한 미션 입니다."},
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
  const acceptedMission = await acceptMission(
    acceptMissionRequestDto(req.body, req.params)
  );
  res.status(StatusCodes.ACCEPTED).success(acceptedMission);
};
export const handleGetMissions = async (req, res, next) => {
  /*
    #swagger.summary = "특정 가게 미션 가져오기"
    #swagger.tags = ["Missions"]
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
      description: "특정 가게 미션 가져오기 성공",
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
                    createdAt:{type:"string", example:"2025-11-20T00:27:13.905Z"},
                    endAt:{type:"string", example:"2025-11-25T19:00:00.000Z"},
                    goal : {type:"number", example:10000},
                    reward : {type:"number", example: 100}
                  }
                }
              }
            }
          }
        }
      }
    }
  */
  const missions = await getMissions(
    getMissionsRequestDto(req.params, req.query)
  );
  res.status(StatusCodes.OK).success(missions);
};
export const handleMyMissions = async (req, res, next) => {
  /*
    #swagger.summary = "나의 진행중 미션 가져오기"
    #swagger.tags = ["Missions"]
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
      description: "특정 가게 미션 가져오기 성공",
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
                    createdAt:{type:"string", example:"2025-11-20T00:27:13.905Z"},
                    endAt:{type:"string", example:"2025-11-20T00:27:13.905Z"},
                    goal:{type:"number", example:10000},
                    reward:{type:"number", example:100}
                  }
                }
              }
            }
          }
        }
      }
    }
  */
  const missions = await getMyMissions(
    getMyMissionsRequestDto(req.body, req.query)
  );
  res.status(StatusCodes.OK).success(missions);
};
export const handleCompleteMission = async (req, res, next) => {
  /*
    #swagger.summary = "미션 완료 처리"
    #swagger.tags = ["Biz","Missions"]
    #swagger.requestBody = {
      required:true,
      content:{
        "application/json": {
          schema: {
            type: "object",
            properties: {
              code: {type:"string", example:"597640909"},
            }
          }
        }
      }
    }
    #swagger.responses[202] = {
      description: "미션 완료 처리 성공",
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
                  completedAt:{type:"string", example:"2025-11-20T00:27:13.905Z"}
                }
              }
            }
          }
        }
      }
    }
    #swagger.responses[500] = {
      description: "미션 완료 처리 실패 (존재하지 않는 인증 코드)",
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
                  reason:{type:"string", example:"존재하지 않는 인증 코드 입니다."},
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
  const mission = await completeMission(completeMissionRequestDto(req.body));
  res.status(StatusCodes.ACCEPTED).success(mission);
};
