import { ObjectID } from "mongodb";
import { GamePost } from "../types";
import _ from "lodash";
import { getDB } from "../db";

export async function getGames() {
	const db = await getDB();
	const gameCollection = db.collection("game");
	const games = await gameCollection.find({}).toArray();

	return games;
}

export async function getGame(
	gameID: string
): Promise<{ _id: string; alive: boolean }> {
	const db = await getDB();
	const gameCollection = db.collection("game");
	const game = await gameCollection.findOne({ _id: new ObjectID(gameID) });

	return game;
}

export async function createGame(participantId: string): Promise<string> {
	const db = await getDB();
	const gameCollection = db.collection("game");
	const newGame: GamePost = {
		participantId,
		scriptID: "",
		player: [],
		house: [],
		bankroll: 600,
		bet: 300,
		hand: 1,
		winnings: 0
	};

	const existingGame = await gameCollection.findOne({ participantId });

	if (existingGame) throw new Error("Game already exists");

	const gameID = await gameCollection.insertOne(newGame);

	return gameID.insertedId;
}
