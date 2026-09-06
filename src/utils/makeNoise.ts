import { prisma } from "../lib/prisma";
import type { CreateActivityLogParams } from "../modules/activitylog/activitylog.interface";

export const makeNoise = async (data: CreateActivityLogParams) => {
	return prisma.activityLog.create({
		data,
	});
};
