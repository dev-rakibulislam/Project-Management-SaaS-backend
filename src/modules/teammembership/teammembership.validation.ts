import { z } from "zod";

export const addTeamMemberValidationSchema = z.object({
	membershipId: z.string().min(1, "user ID is required"),
});

export type addTeamMemberValidationPayload = z.infer<
	typeof addTeamMemberValidationSchema
>;
