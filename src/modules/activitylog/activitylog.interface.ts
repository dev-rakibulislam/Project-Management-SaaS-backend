import type { Prisma } from "../../../generated/client";
import type { ActivityAction, ActivityEntityType } from "../../../generated/enums";

export interface CreateActivityLogParams {
	organizationId: string;
	userId: string;
	action: ActivityAction;
	entityType: ActivityEntityType;
	entityId: string;
	metadata?: Prisma.InputJsonValue;
}
