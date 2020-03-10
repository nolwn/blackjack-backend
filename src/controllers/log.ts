import { Router } from "express";

export const log = Router();

log.get("/", (req, res) => {
	res.send("Log boom");
});
