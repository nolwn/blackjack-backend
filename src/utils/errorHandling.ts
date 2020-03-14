import { Response, Request, NextFunction } from "express";
import { ErrorBody } from "../types/response";

export function handleMissingRoute(
	_req: Request,
	_res: Response,
	next: NextFunction
) {
	const error = {
		status: 404,
		message: "Route not found."
	};

	next(error);
}

export function handleError(
	err: ErrorBody,
	_req: Request,
	res: Response,
	_next: NextFunction
) {
	const error: ErrorBody = {
		status: 500,
		message: "Internal server error."
	};

	error.status = err.status;
	error.message = err.message;
	if (err.stack) {
		error.stack = err.stack;
	}

	res.status(error.status).send();
}

class UserError extends Error {
	constructor(message: string) {
		super(message);
		this.name = "UserError";
		Error.captureStackTrace(this, UserError);
	}
}
