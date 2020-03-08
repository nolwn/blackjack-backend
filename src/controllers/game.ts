import { Router } from "express";

export const games = Router();

games.get("/", (req, res) => {
	res.send("Game boom");
});
