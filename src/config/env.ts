import z from "zod";
import dotenv from "dotenv";

dotenv.config();

const envSchema = z.object({
	NODE_ENV: z.enum(["development", "production"]).default("development"),
	PORT: z.coerce.number().default(3000),
	DATABASE_URL: z.string().min(1),
	JWT_SECRET: z.string().min(8),
	JWT_EXPIRES_IN: z.string().default("7d"),
	CLIENT_URL: z.string().default("http://localhost:3000"),
	API_URL: z.string().default("http://localhost:4000"),
	SSLCOMMERZ_STORE_ID: z.string().optional().default(""),
	SSLCOMMERZ_STORE_PASSWD: z.string().optional().default(""),
	SSLCOMMERZ_IS_SANDBOX: z
		.string()
		.optional()
		.default("true")
		.transform((v) => v !== "false"),
});

export const env = envSchema.parse(process.env);
