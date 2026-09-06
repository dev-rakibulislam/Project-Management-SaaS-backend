import { z } from "zod";
import { TaskPriority, TaskStatus } from "../../../generated/enums";

export const createTaskValidation = z.object({
	title: z
		.string()
		.min(1, "Task title is required")
		.max(200, "Task title cannot exceed 200 characters"),

	description: z
		.string()
		.max(2000, "Description cannot exceed 2000 characters")
		.optional(),

	sprintId: z.string().min(1, "Sprint ID is required"),

	assigneeId: z.string().min(1, "Assignee ID is required").optional(),

	status: z
		.enum([
			TaskStatus.TODO,
			TaskStatus.CANCELLED,
			TaskStatus.DONE,
			TaskStatus.IN_PROGRESS,
			TaskStatus.IN_REVIEW,
		])
		.optional(),

	priority: z
		.enum([
			TaskPriority.HIGH,
			TaskPriority.LOW,
			TaskPriority.MEDIUM,
			TaskPriority.URGENT,
		])
		.optional(),

	dueDate: z.coerce.date().optional(),
});

export type CreateTaskInput = z.infer<typeof createTaskValidation>;
