import { Router } from "express";

export const script = Router();

script.get("/", (req, res) => {
	res.send("Sripts boom");
});
