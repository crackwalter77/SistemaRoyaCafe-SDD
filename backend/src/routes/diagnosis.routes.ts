import { Router } from "express";
import { authMiddleware } from "../middleware/auth";
import { uploadMiddleware } from "../middleware/upload";
import { create, getById, list } from "../controllers/diagnosis.controller";

export const diagnosisRouter = Router();

diagnosisRouter.use(authMiddleware);

diagnosisRouter.get("/", list);
diagnosisRouter.get("/:id", getById);
diagnosisRouter.post("/", uploadMiddleware.single("image"), create);
