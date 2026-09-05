import { z } from "zod";

export const userLoginSchema = z.object({
	email: z.email({
		error: (i) =>
			i.input == null ? "Email is required" : "Please provide a valid email",
	}),

	password: z
		.string("Password is required")
		.min(6, "Password must be at least 6 characters long")
		.max(32, "Password must be less than 32 characters long"),
});

export const userRegisterSchema = userLoginSchema.extend({
	name: z
		.string({
			error: (i) =>
				i.input == null ? " name is required" : "Name must be a string",
		})
		.trim()
		.min(3, "First name must be at least 3 characters long")
		.max(255, "First name must be less than 255 characters long"),

});

export const ProfileUpdateSchema = z.object({
	//todo
});

export type UserLoginPayload = z.infer<typeof userLoginSchema>;
export type UserRegisterPayload = z.infer<typeof userRegisterSchema>;
export type ProfileUpdateSchemaPayload = z.infer<typeof ProfileUpdateSchema>;
