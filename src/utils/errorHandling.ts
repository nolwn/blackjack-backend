import { Response, Request, NextFunction } from "express";
import { ErrorResponse } from "../types/response";

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
	err: Error | ServerError,
	_req: Request,
	res: Response,
	_next: NextFunction
) {
	const error: ErrorResponse = {
		status: 500,
		message: "Internal Server Error"
	};

	if ("statusCode" in err) {
		error.status = err.statusCode;
	}

	if ("stack" in err) {
		error.stack = err.stack;
	}

	error.message = err.message;

	res.status(error.status).send(error);
}

class ServerError extends Error {
	statusCode: number;

	constructor(message: string, status: number) {
		super(message);
		this.statusCode = status;
	}
}

export class ResourceNotFoundError extends ServerError {
	constructor(message: string) {
		super(message, 404);
		this.name = "ResourceNotFoundError";
		Error.captureStackTrace(this, ResourceNotFoundError);
	}
}

export class BadGameStateError extends ServerError {
	constructor(message: string) {
		super(message, 400);
		this.name = "BadGameStateError";
		Error.captureStackTrace(this, BadGameStateError);
	}
}
