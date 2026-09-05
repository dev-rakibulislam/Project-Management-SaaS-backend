import { prisma } from "../lib/prisma";

export type getExistingUserType = { email?: string; id?: string };

export const getExistingUserFromDB = async (
	payload: getExistingUserType,
	include?: any,
) => {
	const orClauses = [];

	if (payload.email) {
		orClauses.push({
			email: payload.email,
		});
	}
	if (payload.id) {
		orClauses.push({
			id: payload.id,
		});
	}
	const where = orClauses.length ? { OR: orClauses } : { id: "" };

	return await prisma.user.findFirst({
		where,
		...(include && { include }),
	});
};
