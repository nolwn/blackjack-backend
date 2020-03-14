import { Router, NextFunction, Request, Response } from "express";
import { ResponseItem, ResponseItems } from "../types";
import { getGames, getGame, createGame } from "../models/game";
import { fixIds } from "../utils";

export const game = Router();

game.get("/", async (req, res) => {
	const games = await getGames();

	const response: ResponseItems = { data: fixIds(games) };

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

		const response: ResponseItem = { data: { id: _id, ...gameData } };

		res.status(200).send(response);
	}
);

game.post("/", async (req: Request, res: Response, next: NextFunction) => {
	const participantId = req.body.participantId;

	try {
		const gameID = await createGame(participantId);
		const response: ResponseItem = {
			data: { id: gameID }
		};
		res.status(201).send(response);
	} catch (err) {
		const message = err.message || "Could not create game.";

		console.error(message, err);
		next({ message: "Could not create game." });
	}
});
