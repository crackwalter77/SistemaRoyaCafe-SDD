import axios from "axios";
import { env } from "../config/env";

const CLASS_MAP: Record<string, string> = {
  sana: "Sana",
  leve: "Leve",
  moderado: "Moderado",
  severo: "Severo",
};

function mapClass(label: string): string {
  return CLASS_MAP[label.toLowerCase()] || label;
}

function cleanBase64(raw: string): string {
  const jpegMarker = "/9j/";
  const pngMarker = "iVBOR";
  const bmpMarker = "Qk";
  for (const marker of [jpegMarker, pngMarker, bmpMarker]) {
    const idx = raw.indexOf(marker);
    if (idx !== -1) return raw.substring(idx);
  }
  return raw;
}

export async function classifyImage(imageBuffer: Buffer): Promise<{
  resultado: string;
  confianza: number;
}> {
  const base64Image = cleanBase64(imageBuffer.toString("base64"));
  const params = { api_key: env.ROBOFLOW_API_KEY };
  const headers = { "Content-Type": "application/x-www-form-urlencoded" };
  const timeout = 30000;

  let data: any;

  console.log("Base64 first 80 chars after clean:", base64Image.substring(0, 80));
  console.log("Base64 length after clean:", base64Image.length);

  for (const endpoint of ["detect", "classify"]) {
    try {
      const url = `https://${endpoint}.roboflow.com/${env.ROBOFLOW_MODEL_ID}`;
      console.log(`Trying ${endpoint}: ${url}`);
      const res = await axios.post(url, base64Image, { params, headers, timeout });
      data = res.data;
      console.log("Roboflow success:", JSON.stringify(data));
      break;
    } catch (err: any) {
      console.log("Roboflow error:", err.response?.status, JSON.stringify(err.response?.data));
      if (endpoint === "classify") throw err;
    }
  }

  const predictions: any[] = data.predictions;

  if (!predictions || predictions.length === 0) {
    return { resultado: "Sana", confianza: 0 };
  }

  const best = predictions.reduce(
    (max: any, p: any) => (p.confidence > max.confidence ? p : max)
  );

  return {
    resultado: mapClass(best.class || best.predicted_class || best.label || ""),
    confianza: Math.round((best.confidence || 0) * 10000) / 100,
  };
}
