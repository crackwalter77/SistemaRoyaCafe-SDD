import express from "express";
import cors from "cors";
import path from "path";
import { env } from "./config/env";
import { authRouter } from "./routes/auth.routes";
import { farmersRouter } from "./routes/farmers.routes";
import { diagnosisRouter } from "./routes/diagnosis.routes";
import { usersRouter } from "./routes/users.routes";

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/uploads", express.static(path.resolve(env.UPLOAD_DIR)));

app.use("/api/auth", authRouter);
app.use("/api/farmers", farmersRouter);
app.use("/api/diagnosis", diagnosisRouter);
app.use("/api/users", usersRouter);

app.get("/api/health", (_req, res) => {
  res.json({ status: "ok" });
});

app.listen(env.PORT, () => {
  console.log(`Backend running on http://localhost:${env.PORT}`);
});
