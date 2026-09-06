import { z } from "zod";
import { ProjectStatus } from "../../../generated/enums";

export const createProjectValidationSchema = z
	.object({
		name: z
			.string()
			.min(1, "Project name is required")
			.max(150, "Project name cannot exceed 150 characters"),

		description: z
			.string()
			.max(1000, "Description cannot exceed 1000 characters")
			.optional(),

		teamId: z.string().min(1, "Team ID cannot be empty").optional(),

		status: z
			.enum([
				ProjectStatus.ACTIVE,
				ProjectStatus.CANCELLED,
				ProjectStatus.COMPLETED,
				ProjectStatus.ON_HOLD,
				ProjectStatus.PLANNING,
			])
			.optional(),

		startDate: z.coerce.date().optional(),

		endDate: z.coerce.date().optional(),
	})
	.refine(
		(data) => {
			if (data.startDate && data.endDate) {
				return data.endDate >= data.startDate;
			}

			return true;
		},
		{
			message: "End date must be greater than or equal to start date",
			path: ["endDate"],
		},
	);

export const assignProjectTeamValidation = z.object({
	teamId: z.string().min(1, "Team ID is required"),
});

export type assignProjectTeamValidationPayload = z.infer<
	typeof assignProjectTeamValidation
>;

export type createProjectValidationPayload = z.infer<
	typeof createProjectValidationSchema
>;
