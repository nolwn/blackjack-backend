import { ObjectID, Collection } from "mongodb";
import { GamePost, Card, Value, Suit, GameRecord, Hand } from "../types";
import {
	BadGameStateError,
	ResourceNotFoundError,
	isGameRecord
} from "../utils";
import _ from "lodash";
import { getDB } from "../db";

const NUMBER_OF_HANDS = 2;
const DEAL_PER_HAND = 2;
const MAX_HAND_VALUE = 21;
const ACE_HIGH = 11;
const ACE_LOW = 1;

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

	const canDeal = getCanDeal(game);
	const deckHasCards = DEAL_PER_HAND * NUMBER_OF_HANDS >= game.deck.length;

	if (!canDeal) throw new BadGameStateError("Cards have already been dealt");

	if (!deckHasCards) {
		reshuffle(game);
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

	await saveUpdatedGame(gameCollection, game);

	return game;
}

export async function hit(gameId: string, hand: Hand): Promise<GameRecord> {
	const db = await getDB();
	const gameCollection = db.collection("game");

	const game: GameRecord | null = await gameCollection.findOne({
		_id: new ObjectID(gameId)
	});

	if (!isGameRecord(game)) throw new ResourceNotFoundError("Game not found.");

	console.log(hand, game[hand]);

	console.log("game", game);

	const canHit = getCanHit(game, game[hand]);

	if (!canHit) throw new BadGameStateError("Player cannot take another card.");

	game[hand].push(game.deck.pop() as Card); // Guarenteed to be a Card by `canHit.`

	await saveUpdatedGame(gameCollection, game);

	return game;
}

/************************
 * 	 HELPER FUNCTIONS	*
 ************************/

function getCanDeal(game: GameRecord) {
	const boardClear = !game.player.length && !game.dealer.length;

	console.log(game.player);

	return boardClear;
}

function getCanHit({ deck, discard }: GameRecord, hand: Card[]) {
	const belowMax = countHand(hand) < MAX_HAND_VALUE;
	const deckHasCards = !!deck.length;

	console.log("handCount", countHand(hand));

	if (!belowMax) return false;

	if (!deckHasCards) {
		if (!discard)
			throw new BadGameStateError(
				"Neither the draw nor the discard pile has any cards"
			);

		shuffleInDiscard(deck, discard);
	}

	return true;
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

function shuffleInDiscard(deck: Card[], discard: Card[]) {
	deck = [...shuffle(discard), ...deck];
	discard = [];
}

function shuffle(cards: Card[]): Card[] {
	return _.shuffle(cards);
}

function reshuffle(game: GameRecord) {
	const reshuffle = shuffle(game.discard);
	game.discard = [];
	game.deck = [...reshuffle, ...game.deck];
}

function countHand(hand: Card[]): number {
	let sum: number = 0;
	let aces: number = 0;

	console.log(hand);

	for (const card of hand) {
		switch (card.value) {
			case "King":
			case "Queen":
			case "Jack":
			case "10":
				sum += 10;
				break;
			case "Ace":
				aces += 1;
				break;
			default:
				console.log("value", card.value);
				sum += Number(card.value);
				break;
		}
	}

	while (aces) {
		if (ACE_HIGH * aces <= MAX_HAND_VALUE) {
			sum += ACE_HIGH * aces;
		} else {
			sum += ACE_LOW;
		}
		aces -= 1;
	}

	return sum;
}

async function saveUpdatedGame(
	gameCollection: Collection<any>,
	game: GameRecord
): Promise<void> {
	const { _id } = game;

	await gameCollection.updateOne(
		{ _id: new ObjectID(_id) },
		{ $set: game },
		{ upsert: false }
	);
}
