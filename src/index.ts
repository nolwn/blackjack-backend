import express from "express";
import { games, logs, scripts } from "./controllers";
import bodyParser from "body-parser";

const port = 3001;
const app = express();

// Middlewares
app.use(bodyParser.json());

// Controllers
app.use("/game", games);
app.use("/log", logs);
app.use("/script", scripts);

// Error handling
app.use((_req, res, next) => {
	return res.send("Route not found.");
});

app.listen(port, () => console.log(`Listening on port ${port}!`));
