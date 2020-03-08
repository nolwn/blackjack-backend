import { Router } from "express";

export const logs = Router();

logs.get("/", (req, res) => {
	res.send("Log boom");
});
