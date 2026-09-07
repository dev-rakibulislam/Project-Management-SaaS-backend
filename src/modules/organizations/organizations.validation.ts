import { z } from "zod";

export const createOrganizationsSchema = z.object({
	name: z
		.string()
		.min(1)
		.max(255)
		.regex(/^[a-zA-Z0-9 ]+$/, "Only letters, numbers and spaces are allowed"),
	slug: z
		.string()
		.min(5, "Slug is required")
		.regex(
			/^[a-z0-9]+(?:-[a-z0-9]+)*$/,
			"Slug must contain only lowercase letters, numbers, and hyphens",
		)
		.optional(),
});

export type createOrganizationPayload = z.infer<
	typeof createOrganizationsSchema
>;

export type updateOrganizationPayload = z.infer<
	typeof createOrganizationsSchema
>;
