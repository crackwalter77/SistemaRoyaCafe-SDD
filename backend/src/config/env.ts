import dotenv from "dotenv";
import path from "path";

dotenv.config({ path: path.resolve(__dirname, "../../../.env") });

export const env = {
  PORT: parseInt(process.env.PORT || "4000", 10),
  DATABASE_URL: process.env.DATABASE_URL || "postgresql://roya_user:roya_pass@localhost:5432/roya_cafe",
  JWT_SECRET: process.env.JWT_SECRET || "dev-secret-change-in-production",
  JWT_EXPIRES_IN: "24h",
  ROBOFLOW_API_KEY: process.env.ROBOFLOW_API_KEY || "",
  ROBOFLOW_MODEL_ID: process.env.ROBOFLOW_MODEL_ID || "",
  UPLOAD_DIR: path.resolve(__dirname, "../../uploads"),
};
