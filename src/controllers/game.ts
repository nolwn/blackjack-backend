import { Router } from "express";
import { getGames, getGame } from "../models/game";

export const game = Router();

game.get("/", async (req, res) => {
	const games = await getGames();

	res.status(200).send({ data: games });
});

game.get("/:gameid", async (req, res, next) => {
	const gameID = req.params.gameID;
	const game = await getGame(gameID);

	if (!game) {
		return next({ status: 404, message: "Game not found." });
	}

	res.status(200).send({ data: game });
});
