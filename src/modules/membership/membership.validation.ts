import { z } from "zod";
import { OrganizationRole } from "../../../generated/enums";

export const createMembershipSchema = z.object({
	userId: z.string({
		error: (i) =>
			i.input == null ? " userId is required" : "userId must be a string",
	}),
	role: z.enum([OrganizationRole.MEMBER, OrganizationRole.ORG_ADMIN]),
});

export type createMembershipPayload = z.infer<typeof createMembershipSchema>;
