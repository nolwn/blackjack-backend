import {
	Response,
	RequestHandler,
	ErrorRequestHandler,
	NextFunction
} from "express";
import { ErrorBody } from "../types/response";

export const handleMissingRoute: RequestHandler = (_req, _res, next) => {
	const error = {
		status: 404,
		message: "Route not found."
	};

	next(error);
};

export const handleError: ErrorRequestHandler = (
	err: any,
	_req: any,
	res: Response,
	_next: NextFunction
) => {
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
};
