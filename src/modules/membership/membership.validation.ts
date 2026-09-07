import { z } from "zod";
import { MembershipStatus, OrganizationRole } from "../../../generated/enums";

export const createMembershipSchema = z.object({
	userId: z.string({
		error: (i) =>
			i.input == null ? " userId is required" : "userId must be a string",
	}),
	role: z.enum([OrganizationRole.MEMBER, OrganizationRole.ORG_ADMIN]),
});

export const updateMemberShipRoleSchema = z.object({
	role: z.enum([OrganizationRole.MEMBER, OrganizationRole.ORG_ADMIN]),
});

export const updateMemberShipStatusSchema = z.object({
	status: z.enum([MembershipStatus.ACTIVE, MembershipStatus.BLOCK]),
});

export type createMembershipPayload = z.infer<typeof createMembershipSchema>;
export type updateMemberShipRolePayload = z.infer<
typeof updateMemberShipRoleSchema
>;

export type updateMemberShipStatusPayload = z.infer<typeof updateMemberShipStatusSchema>;