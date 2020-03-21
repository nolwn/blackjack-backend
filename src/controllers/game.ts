import { Router, NextFunction, Request, Response } from "express";
import {
	HttpResponse,
	ResponseItems,
	GameRecord,
	GameResponse,
	Hand
} from "../types";
import { getGames, getGame, createGame, deal, hit } from "../models/game";

export const game = Router();

game.get("/", async (req, res) => {
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

game.post("/", async (req: Request, res: Response, next: NextFunction) => {
	const participantId = req.body.participantId;

	try {
		const gameID = await createGame(participantId);
		const response: HttpResponse = {
			data: { id: gameID }
		};
		res.status(201).send(response);
	} catch (err) {
		const message = err.message || "Could not create game.";

		console.error(message, err);
		next({ message: "Could not create game." });
	}
});

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
	"/:gameid/playerhit",
	async (req: Request, res: Response, next: NextFunction) => {
		const gameId: string = req.params.gameid;

		try {
			const { _id, ...gameData } = await hit(gameId, Hand.Player);

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
	return records.map(record => prepareResponse(record));
}
