import { prisma } from "../../lib/prisma";
import type { createTeamPayload } from "./team.validation";

const createTeamService = async (
	organizationId: string,
	data: createTeamPayload,
) => {
	const team = await prisma.team.create({
		data: {
			name: data.name,
			description: data.description,
			organizationId,
		},
	});

	return team;
};

export const teamService = {
	createTeamService,
};
