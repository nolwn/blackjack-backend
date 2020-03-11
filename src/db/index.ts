import { MongoClient, Db } from "mongodb";

const user = process.env.DB_USER;
const password = process.env.DB_PASSWORD;
const host = process.env.DB_HOST;
const port = process.env.DB_PORT;
const database = process.env.DB_NAME;

let attemptConnection: Promise<void | MongoClient> = MongoClient.connect(
	`mongodb://${user}:${password}@${host}:${port}/${database}`,
	{ useNewUrlParser: true, useUnifiedTopology: true }
).catch(err => console.log("Database connection failed", err));

export const getDB = async (): Db => {
	const connection = await attemptConnection;
	if (isMongoClient(connection)) {
		return connection.db(database);
	} else {
		throw new Error("Failed for form connection");
	}
};

const isMongoClient = (
	connection: MongoClient | void
): connection is MongoClient => {
	return !!connection;
};
