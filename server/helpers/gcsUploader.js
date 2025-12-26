import { Storage } from "@google-cloud/storage";
import path from "path";
import dotenv from "dotenv";
dotenv.config();

const storage = new Storage({
  keyFilename: path.join(process.cwd(), "google-key.json"),
  projectId: process.env.GCP_PROJECT_ID,
});

const bucket = storage.bucket(process.env.GCP_BUCKET);

export const uploadToGCS = async (buffer, fileName) => {
  const file = bucket.file(`reports/${fileName}`);
  await file.save(buffer, { resumable: false, contentType: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" });
  await file.makePublic();
  return `https://storage.googleapis.com/${process.env.GCP_BUCKET}/reports/${fileName}`;
};
