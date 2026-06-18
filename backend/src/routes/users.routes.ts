import { Router } from "express";
import { authMiddleware } from "../middleware/auth";
import { list, getById, create, update, remove } from "../controllers/users.controller";

export const usersRouter = Router();

usersRouter.use(authMiddleware);

usersRouter.get("/", list);
usersRouter.get("/:id", getById);
usersRouter.post("/", create);
usersRouter.put("/:id", update);
usersRouter.delete("/:id", remove);
