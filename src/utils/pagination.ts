export const getPagination = (page = 1, limit = 20) => {
	const currentPage = Math.max(1, page);
	const currentLimit = Math.min(Math.max(1, limit), 100);

	const skip = (currentPage - 1) * currentLimit;

	return {
		page: currentPage,
		limit: currentLimit,
		skip,
	};
};

export const getPaginationMeta = (
	page: number,
	limit: number,
	total: number,
) => {
	return {
		page,
		limit,
		total,
		totalPages: Math.ceil(total / limit),
	};
};
