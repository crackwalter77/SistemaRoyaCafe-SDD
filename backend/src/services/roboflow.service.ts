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

function cleanImageBuffer(buf: Buffer): Buffer {
  const jpegMagic = Buffer.from([0xff, 0xd8, 0xff]);
  const pngMagic = Buffer.from([0x89, 0x50, 0x4e, 0x47]);
  const idxJpeg = buf.indexOf(jpegMagic);
  if (idxJpeg !== -1) return buf.subarray(idxJpeg);
  const idxPng = buf.indexOf(pngMagic);
  if (idxPng !== -1) return buf.subarray(idxPng);
  return buf;
}

export async function classifyImage(imageBuffer: Buffer): Promise<{
  resultado: string;
  confianza: number;
}> {
  const cleanedBuffer = cleanImageBuffer(imageBuffer);
  const base64 = cleanedBuffer.toString("base64");
  const params = { api_key: env.ROBOFLOW_API_KEY };
  const timeout = 30000;

  let data: any;

  for (const endpoint of ["detect", "classify"]) {
    try {
      const url = `https://${endpoint}.roboflow.com/${env.ROBOFLOW_MODEL_ID}`;
      const res = await axios.post(url, base64, {
        params,
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        timeout,
      });
      data = res.data;
      break;
    } catch (err: any) {
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
