import type { AuthenticatedUser } from "./auth";

declare global {
	namespace Express {
		interface Request {
			user: AuthenticatedUser;

			organizationMembership?: {
				id: string;
				userId: string;
				organizationId: string;
				role: OrganizationRole;
				status: MembershipStatus;
				deleteAt: Date | null;
			};
		}
	}
}
