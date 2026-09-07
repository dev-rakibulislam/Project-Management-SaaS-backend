export type QueryParams = {
	page: number;
	limit: number;
	search?: string;
	sortBy?: string;
	sortOrder: "asc" | "desc";
};

export const getQueryParams = (query: Record<string, unknown>): QueryParams => {
	return {
		page: Number(query.page) || 1,
		limit: Number(query.limit) || 20,

		search:
			typeof query.search === "string"
				? query.search.trim() || undefined
				: undefined,

		sortBy: typeof query.sortBy === "string" ? query.sortBy : undefined,

		sortOrder: query.sortOrder === "asc" ? "asc" : "desc",
	};
};
