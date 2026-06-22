import { Router } from "express";
import { authMiddleware } from "../middleware/auth";
import { getProfile, updateProfile, deleteProfile } from "../controllers/profile.controller";

export const profileRouter = Router();

profileRouter.use(authMiddleware);

profileRouter.get("/", getProfile);
profileRouter.put("/", updateProfile);
profileRouter.delete("/", deleteProfile);
