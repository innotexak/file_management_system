import dotenv from "dotenv";

dotenv.config();

export const isDev = process.env.NODE_ENV !== "production";

const requiredEnvs = [
  "MONGO_URL",
  "PORT",
  "AWS_ACCESS_KEY_ID",
  "AWS_BUCKET_NAME",
  "AWS_SECRET_ACCESS_KEY",
  "AWS_REGION",
  "AWS_FRONT_END_CORS",
  "BASE_ADMIN_URL"
] as const;

interface Envs {
  [key: string]: string;
}

const envs: Envs = requiredEnvs.reduce((acc: Envs, key: string) => {
  acc[key] = process.env[key] as string;
  return acc;
}, {});

const missingEnvs: string[] = requiredEnvs.filter((key) => !envs[key]);

if (missingEnvs.length > 0) {
  console.error("ENV Error, the following ENV variables are not set:");
  console.table(missingEnvs);
  throw new Error("Fix Env and rebuild");
}

export const {
  MONGO_URL,
  PORT,
  AWS_ACCESS_KEY_ID,
  AWS_BUCKET_NAME,
  AWS_SECRET_ACCESS_KEY,
  AWS_REGION,
  AWS_FRONT_END_CORS,
  BASE_ADMIN_URL
} = process.env;
