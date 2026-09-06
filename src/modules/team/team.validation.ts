import { z } from "zod";

export const createTeamValidationSchema = z.object({
	name: z
		.string()
		.min(1, "Team name is required")
		.max(100, "Team name cannot exceed 100 characters"),

	description: z
		.string()
		.max(500, "Description cannot exceed 500 characters")
		.optional(),
});

export const updateTeamSchema = z.object({
	// TODO
});

export type createTeamPayload = z.infer<typeof createTeamValidationSchema>;
