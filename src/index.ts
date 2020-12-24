import bodyParser from "body-parser";
import dotEnv from "dotenv";
import express from "express";

dotEnv.config();

import { game, log } from "./controllers";
import { handleMissingRoute, handleError } from "./utils";

const port = 3001;
const app = express();

// Middlewares
app.use(bodyParser.json());

// Controllers
app.use("/game", game);
app.use("/log", log);

// Error handling
app.use(handleMissingRoute);
app.use(handleError);

app.listen(port, () => console.log(`Listening on port ${port}!`));
