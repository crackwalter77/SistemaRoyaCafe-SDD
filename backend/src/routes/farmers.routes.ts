import { Router } from "express";
import { authMiddleware } from "../middleware/auth";
import { list, create, update, remove } from "../controllers/farmers.controller";

export const farmersRouter = Router();

farmersRouter.use(authMiddleware);

farmersRouter.get("/", list);
farmersRouter.post("/", create);
farmersRouter.put("/:id", update);
farmersRouter.delete("/:id", remove);
