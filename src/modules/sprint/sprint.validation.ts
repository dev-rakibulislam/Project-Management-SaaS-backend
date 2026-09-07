import { z } from "zod";
import { SprintStatus } from "../../../generated/enums";

export const createSprintValidation = z
	.object({
		name: z
			.string()
			.min(1, "Sprint name is required")
			.max(150, "Sprint name cannot exceed 150 characters"),

		goal: z.string().max(1000, "Goal cannot exceed 1000 characters").optional(),

		status: z
			.enum([
				SprintStatus.CANCELLED,
				SprintStatus.COMPLETED,
				SprintStatus.PLANNED,
				SprintStatus.ACTIVE,
			])
			.optional(),
		startDate: z.coerce.date().optional(),

		endDate: z.coerce.date().optional(),
	})
	.refine(
		(data) =>
			!data.startDate || !data.endDate || data.endDate >= data.startDate,
		{
			message: "End date must be greater than or equal to start date",
			path: ["endDate"],
		},
	);


export type CreateSprintInputPayload = z.infer<typeof createSprintValidation>;
export type updateSprintValidationPayload = z.infer<
	typeof createSprintValidation
>;
