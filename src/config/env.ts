import z from "zod";
import dotenv from "dotenv";

dotenv.config();

const envSchema = z.object({
	NODE_ENV: z.enum(["development", "production"]).default("development"),
	PORT: z.coerce.number().default(3000),
	DATABASE_URL: z.string().min(1),
	JWT_ACCESS_SECRET: z.string().min(8),
	JWT_ACCESS_EXPIRES_IN: z.string().default("7d"),
	GOOGL_CLIENT_ID: z.string(),
	JWT_REFRESH_SECRET: z.string().min(8),
	JWT_REFRESH_EXPIRES_IN: z.string().default("7d"),
	BCRYPT_SALT_ROUNDS: z.coerce.number(),
	CLIENT_URL: z.string().default("http://localhost:3000"),
	API_URL: z.string().default("http://localhost:4000"),
	STORE_ID: z.string(),
	STORE_PASSWD: z.string(),
	SSL_PRODUCT_AMOUNT: z.coerce.number(),
	CURRENCY: z.string(),
	SUCCESS_URL: z.string(),
	FAIL_URL: z.string(),
	SANDBOX_API_URL: z.string(),
	LIVE_API_URL: z.string(),
	CLOUDINARY_CLOUD_NAME: z.string(),
	CLOUDINARY_API_KEY: z.string(),
	CLOUDINARY_API_SECRET: z.string(),
});

export const env = envSchema.parse(process.env);
