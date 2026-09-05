import type { NextFunction, Request, Response } from "express";

type AsyncRoute = (
	req: Request,
	res: Response,
	next: NextFunction,
) => Promise<unknown>;

export function catchAsync(fn: AsyncRoute) {
	return (req: Request, res: Response, next: NextFunction) => {
		fn(req, res, next).catch(next);
	};
}
