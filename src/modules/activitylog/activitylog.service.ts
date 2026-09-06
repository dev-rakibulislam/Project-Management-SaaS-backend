// const getActivityLogsByEntityService = async (
// 	organizationId: string,
// 	entityType: string,
// 	entityId: string,
// ) => {
// 	const activityLogs = await prisma.activityLog.findMany({
// 		where: {
// 			organizationId,
// 			entityType,
// 			entityId,
// 		},
// 		orderBy: {
// 			createdAt: "desc",
// 		},
// 	});

// 	return activityLogs;
// };
// const getActivityLogService = async (
// 	organizationId: string,
// 	activityLogId: string,
// ) => {
// 	const activityLog = await prisma.activityLog.findFirst({
// 		where: {
// 			id: activityLogId,
// 			organizationId,
// 		},
// 	});

// 	if (!activityLog) {
// 		throw new AppError(404, "Activity log not found.");
// 	}

// 	return activityLog;
// };

export const activityLogService = {

	// getActivityLogsByEntityService,
	// getActivityLogService,
};
