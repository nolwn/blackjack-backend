import { Router, NextFunction, Request, Response } from "express";
import swaggerValidation from "express-ajv-swagger-validation";

import {
	HttpResponse,
	ResponseItems,
	GameRecord,
	GameResponse,
	GamePost,
	HitUpdate,
} from "../types";
import { getGames, getGame, createGame, deal, hit } from "../models/game";
import { InvalidBodyError } from "../utils";

export const game = Router();

// Setup validator
swaggerValidation.init("./swagger.yaml");

game.get("/", async (_req, res) => {
	const games = await getGames();

	const response: ResponseItems = { data: prepareResponses(games) };

	res.status(200).send(response);
});

game.get(
	"/:gameid",
	async (req: Request, res: Response, next: NextFunction) => {
		const gameId = req.params.gameid;
		const { _id, ...gameData } = await getGame(gameId);

		if (!game) {
			return next({ status: 404, message: "Game not found." });
		}

		const bodyData: GameResponse = { id: _id, ...gameData };
		const response: HttpResponse = { data: bodyData };

		res.status(200).send(response);
	}
);

game.post(
	"/",
	swaggerValidation.validate,
	async (req: Request, res: Response, next: NextFunction) => {
		const { participantId } = req.body;

		try {
			if (typeof participantId !== "string") {
				throw new InvalidBodyError("Could not create game.");
			}

			const gameID = await createGame(participantId);
			const response: HttpResponse = {
				data: { id: gameID },
			};
			res.status(201).send(response);
		} catch (err) {
			next(err);
		}
	}
);

game.patch(
	"/:gameid/deal",
	async (req: Request, res: Response, next: NextFunction) => {
		const gameId: string = req.params.gameid;

		try {
			const newGameState = await deal(gameId);
			res.status(200).send(newGameState);
		} catch (err) {
			next(err);
		}
	}
);

game.patch(
	"/:gameid/hit",
	async (req: Request, res: Response, next: NextFunction) => {
		const gameId: string = req.params.gameid;
		const { hand } = req.body;

		if (hand !== "player" || hand !== "hand") {
			throw new InvalidBodyError(
				'Property "hand" needs to be either "player" or "dealer."'
			);
		}

		const hitPatch: HitUpdate = { hand };

		try {
			const { _id, ...gameData } = await hit(gameId, hand);
			const bodyData: GameResponse = { id: _id, ...gameData };
			const response: HttpResponse = { data: bodyData };

			res.status(200).send(response);
		} catch (err) {
			next(err);
		}
	}
);

function prepareResponse(record: GameRecord): GameResponse {
	const response: any = { ...record };
	response.id = record._id;

	delete response.deck;
	delete response._id;

	return response;
}

function prepareResponses(records: GameRecord[]): GameResponse[] {
	return records.map((record) => prepareResponse(record));
}
