import { getDB } from "../db";

export const getGames = async () => {
	const db = await getDB();
	const gameCollection = db.collection("game");
	const games = await gameCollection.find({}).toArray();

	return games;
};

export const getGame = async (gameID: string) => {
	const db = await getDB();

	console.log(db);

	const gameCollection = db.collection("game");
	const [game] = await gameCollection.find({ _id: gameID }).toArray();

	return game;
};

// export const openGames = async games => {

// };
