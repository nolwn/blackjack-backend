import { Router } from "express";

export const scripts = Router();

scripts.get("/", (req, res) => {
	res.send("Sripts boom");
});
