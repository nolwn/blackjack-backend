export interface Resource {
	id: string;
}

export interface Record {
	_id: string;
	deck: Card[];
	discard: Card[];
}

export interface ResponseItem {
	data: Resource;
}

export interface ResponseItems {
	data: Resource[];
}

export interface GamePost {
	bankroll: number;
	bet: number;
	hand: number;
	dealer: Array<Card>;
	participantId: string;
	player: Array<Card>;
	winnings: number;
}

export interface GameRecord extends GamePost, Record {}
export interface GameResponse extends GamePost, Resource {}

export interface Card {
	suit: Suit | null;
	value: Value | null;
}

export enum Suit {
	Clubs = "Clubs",
	Diamonds = "Diamonds",
	Hearts = "Hearts",
	Spades = "Spades"
}

export enum Value {
	Ace = "Ace",
	Two = "2",
	Three = "3",
	Four = "4",
	Five = "5",
	Six = "6",
	Seven = "7",
	Eight = "8",
	Nine = "9",
	Ten = "10",
	Jack = "Jack",
	Queen = "Queen",
	King = "King"
}
