import express, { NextFunction, Response, Handler } from "express";
import bodyParser from "body-parser";
import dotEnv from "dotenv";
dotEnv.config();

import { game, log, script } from "./controllers";
import { ErrorBody } from "./types/response";
import { connectDB } from "./db";
connectDB();

const port = 3001;
const app = express();

// Middlewares
app.use(bodyParser.json());

// Controllers
app.use("/game", game);
app.use("/log", log);
app.use("/script", script);

// Error handling
app.use((_req, _res, next) => {
	const error = {
		status: 404,
		message: "Route not found."
	};

	next(error);
});

const handleError: Handler = (
	err: any,
	_req: Request,
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

app.use(handleError);

app.listen(port, () => console.log(`Listening on port ${port}!`));
