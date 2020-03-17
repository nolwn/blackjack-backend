import { ObjectID } from "mongodb";
import {
	GamePost,
	GameResponse,
	Card,
	Value,
	Suit,
	GameRecord
} from "../types";
import { BadGameStateError, ResourceNotFoundError } from "../utils";
import _ from "lodash";
import { getDB } from "../db";

const NUMBER_OF_HANDS = 2;
const DEAL_PER_HAND = 2;

/************************
 * 	 EXPORT FUNCTIONS	*
 ************************/

export async function getGames(): Promise<GameRecord[]> {
	const db = await getDB();
	const gameCollection = db.collection("game");
	const games: GameRecord[] = await gameCollection.find({}).toArray();

	return games;
}

export async function getGame(gameID: string): Promise<GameRecord> {
	const db = await getDB();
	const gameCollection = db.collection("game");
	const game: GameRecord | null = await gameCollection.findOne({
		_id: new ObjectID(gameID)
	});

	if (_.isNil(game)) throw Error("Game not found.");

	return game;
}

export async function createGame(participantId: string): Promise<string> {
	const db = await getDB();
	const gameCollection = db.collection("game");
	const newGame: GamePost = {
		participantId,
		player: [],
		dealer: [],
		bankroll: 600,
		bet: 300,
		hand: 1,
		winnings: 0
	};

	const deck: Card[] = shuffleNewDeck();

	const existingGame = await gameCollection.findOne({ participantId });

	if (existingGame) throw new Error("Game already exists");

	const gameID = await gameCollection.insertOne({ ...newGame, deck });

	return gameID.insertedId;
}

export async function deal(gameId: string): Promise<GameRecord> {
	const db = await getDB();
	const gameCollection = db.collection("game");

	const game: GameRecord | null = await gameCollection.findOne({
		_id: new ObjectID(gameId)
	});

	if (_.isNil(game)) throw new ResourceNotFoundError("Game not found.");

	const canDeal = checkCards(game);
	const enoughCards = DEAL_PER_HAND * NUMBER_OF_HANDS >= game.deck.length;

	if (!canDeal) throw new BadGameStateError("Cards have already been dealt");

	if (!enoughCards) {
		const reshuffle = shuffle(game.discard);
		game.discard = [];
		game.deck = [...reshuffle, ...game.deck];
	}

	for (let hand = 0; hand < NUMBER_OF_HANDS; hand++) {
		for (let deal = 0; deal < DEAL_PER_HAND; deal++) {
			if (hand === 0) {
				game.dealer.push(game.deck.pop() as Card);
			} else {
				game.player.push(game.deck.pop() as Card);
			}
		}
	}

	await gameCollection.updateOne(
		{ _id: new ObjectID(gameId) },
		{ $set: game },
		{ upsert: false }
	);

	return game;
}

/************************
 * 	 HELPER FUNCTIONS	*
 ************************/

function checkCards(game: GameRecord) {
	const boardClear = !game.player.length && !game.dealer.length;

	console.log(game.player);

	return boardClear;
}

function shuffleNewDeck(): Card[] {
	const cards = [];
	const suits = [Suit.Diamonds, Suit.Hearts, Suit.Clubs, Suit.Spades];
	const values = [
		Value.Ace,
		Value.Two,
		Value.Three,
		Value.Four,
		Value.Five,
		Value.Six,
		Value.Seven,
		Value.Eight,
		Value.Nine,
		Value.Ten,
		Value.Jack,
		Value.Queen,
		Value.King
	];

	for (const suit of suits) {
		for (const value of values) {
			cards.push({ suit, value });
		}
	}

	return shuffle(cards);
}

function shuffle(cards: Card[]): Card[] {
	return _.shuffle(cards);
}
