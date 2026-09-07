import AppError from "../../error/appError";
import { prisma } from "../../lib/prisma";
import { getPagination, getPaginationMeta } from "../../utils/pagination";
import { QueryParams } from "../../utils/query";

const getAllUsersService = async (query: QueryParams) => {
	const { page, limit } = query;

	const {
		page: currentPage,
		limit: currentLimit,
		skip,
	} = getPagination(page, limit);

	const allowedSortFields = ["createdAt", "updatedAt", "name", "email"];

	const sortBy = allowedSortFields.includes(query.sortBy || "")
		? query.sortBy!
		: "createdAt";

	const where = {
		...(query.search && {
			OR: [
				{
					name: {
						contains: query.search,
						mode: "insensitive" as const,
					},
				},
				{
					email: {
						contains: query.search,
						mode: "insensitive" as const,
					},
				},
			],
		}),
	};

	const [users, totalUsers] = await prisma.$transaction([
		prisma.user.findMany({
			where,
			skip,
			take: currentLimit,
			orderBy: {
				[sortBy]: query.sortOrder,
			},
			select: {
				id: true,
				name: true,
				email: true,
				platformRole: true,
				createdAt: true,
				updatedAt: true,
			},
		}),

		prisma.user.count({
			where,
		}),
	]);

	return {
		meta: getPaginationMeta(currentPage, currentLimit, totalUsers),
		users,
	};
};

const getAllOrganizationsService = async (query: QueryParams) => {
	const { page, limit } = query;

	const {
		page: currentPage,
		limit: currentLimit,
		skip,
	} = getPagination(page, limit);

	const allowedSortFields = ["createdAt", "updatedAt", "name"];

	const sortBy = allowedSortFields.includes(query.sortBy || "")
		? query.sortBy!
		: "createdAt";

	const where = {
		...(query.search && {
			name: {
				contains: query.search,
				mode: "insensitive" as const,
			},
		}),
	};

	const [organizations, totalOrganizations] = await prisma.$transaction([
		prisma.organization.findMany({
			where,
			skip,
			take: currentLimit,

			orderBy: {
				[sortBy]: query.sortOrder,
			},

			select: {
				id: true,
				name: true,
				slug: true,
				createdAt: true,
				updatedAt: true,

				_count: {
					select: {
						memberships: true,
					},
				},
			},
		}),

		prisma.organization.count({
			where,
		}),
	]);

	return {
		meta: getPaginationMeta(currentPage, currentLimit, totalOrganizations),

		organizations,
	};
};

const getPlatformStatisticsService = async () => {
	const [
		totalUsers,
		totalOrganizations,
		activeOrganizations,
		totalProjects,
		totalTasks,
		totalTeams,
		totalMoney,
	] = await prisma.$transaction([
		prisma.user.count(),

		prisma.organization.count(),

		prisma.organization.count({
			where: {
				deletedAt: null,
			},
		}),

		prisma.project.count({
			where: {
				deletedAt: null,
			},
		}),

		prisma.task.count({
			where: {
				deletedAt: null,
			},
		}),

		prisma.team.count({
			where: {
				deletedAt: null,
			},
		}),
		prisma.payment.aggregate({
			where: { status: "SUCCESS" },
			_sum: { amount: true },
		}),
	]);

	return {
		totalUsers,
		totalOrganizations,
		activeOrganizations,
		totalProjects,
		totalTasks,
		totalTeams,
		totalMoneyRevenue:totalMoney._sum.amount,
	};
};

const suspendUserService = async (userId: string) => {
	const user = await prisma.user.findUnique({
		where: {
			id: userId,
		},
		select: {
			id: true,
			platformRole: true,
			isActive: true,
		},
	});

	if (!user) {
		throw new AppError(404, "User not found.");
	}

	if (user.platformRole === "SUPER_ADMIN") {
		throw new AppError(403, "Platform admin cannot be suspended.");
	}

	if (!user.isActive) {
		throw new AppError(400, "User is already suspended.");
	}

	return prisma.user.update({
		where: {
			id: userId,
		},
		data: {
			isActive: false,
		},
		select: {
			id: true,
			name: true,
			email: true,
			platformRole: true,
			isActive: true,
			updatedAt: true,
		},
	});
};

const restoreUserService = async (userId: string) => {
	const user = await prisma.user.findUnique({
		where: {
			id: userId,
		},
		select: {
			id: true,
			platformRole: true,
			isActive: true,
		},
	});

	if (!user) {
		throw new AppError(404, "User not found.");
	}

	if (user.isActive) {
		throw new AppError(400, "User is already active.");
	}

	return prisma.user.update({
		where: {
			id: userId,
		},
		data: {
			isActive: true,
		},
		select: {
			id: true,
			name: true,
			email: true,
			platformRole: true,
			isActive: true,
			updatedAt: true,
		},
	});
};

const getAllPaymentsService = async (query: QueryParams) => {
	const { page, limit } = query;

	const {
		page: currentPage,
		limit: currentLimit,
		skip,
	} = getPagination(page, limit);

	const allowedSortFields = ["createdAt", "updatedAt", "amount", "status"];

	const sortBy = allowedSortFields.includes(query.sortBy || "")
		? query.sortBy!
		: "createdAt";

	const where = {
		...(query.search && {
			OR: [
				{
					transactionId: {
						contains: query.search,
						mode: "insensitive" as const,
					},
				},
				{
					organization: {
						name: {
							contains: query.search,
							mode: "insensitive" as const,
						},
					},
				},
				{
					user: {
						email: {
							contains: query.search,
							mode: "insensitive" as const,
						},
					},
				},
			],
		}),
	};

	const [payments, totalPayments] = await prisma.$transaction([
		prisma.payment.findMany({
			where,
			skip,
			take: currentLimit,
			orderBy: {
				[sortBy]: query.sortOrder,
			},
			select: {
				id: true,
				transactionId: true,
				amount: true,
				currency: true,
				provider: true,
				status: true,
				createdAt: true,
				updatedAt: true,
			},
		}),
		prisma.payment.count({ where }),
	]);

	return {
		meta: getPaginationMeta(currentPage, currentLimit, totalPayments),
		payments,
	};
};

export const superAdminService = {
	getAllUsersService,
	getAllOrganizationsService,
	getPlatformStatisticsService,
	suspendUserService,
	restoreUserService,
	getAllPaymentsService,
};
