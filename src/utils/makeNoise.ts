import type { Prisma } from "../../generated/client";
import { prisma } from "../lib/prisma";
import type { CreateActivityLogParams } from "../modules/activitylog/activitylog.interface";

export const makeNoise = async (data: CreateActivityLogParams) => {
	return prisma.activityLog.create({
		data: data as Prisma.ActivityLogCreateInput,
	});
};
