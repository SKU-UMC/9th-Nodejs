import { StatusCodes } from "http-status-codes";
import { addStoreRequestDto } from "../dtos/store.dto.js";
import { addStore } from "../services/store.service.js";

export const handleAddStore = async (req, res, next) => {
  const store = await addStore(addStoreRequestDto(req.body));
  res.status(StatusCodes.CREATED).success(store);
};
