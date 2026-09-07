import type { Prisma } from "../../../generated/client";
import type {
	ActivityAction,
	ActivityEntityType,
} from "../../../generated/enums";

export interface CreateActivityLogParams {
	organizationId: string;
	userId: string;
	action: ActivityAction | any;
	entityType: ActivityEntityType | any;
	entityId: string;
	metadata?: Prisma.InputJsonValue;
}
