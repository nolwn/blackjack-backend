export interface Resource {
	id: string;
}

export interface Record {
	_id: string;
}

export interface ResponseItem {
	data: Resource;
}

export interface ResponseItems {
	data: Resource[];
}

export interface GamePost {
	participantId: string;
	scriptID: string;
	house: Array<Card>;
	player: Array<Card>;
	bankroll: number;
	bet: number;
	winnings: number;
	hand: number;
}

export interface GameRecord extends GamePost, Record {}
export interface GameResponse extends GamePost, Resource {}

interface Card {
	suit: Suit;
	value: Value;
}

enum Suit {
	Spades = "Spades",
	Hearts = "Hearts",
	Clubs = "Clubs",
	Diamonds = "Diamonds"
}

enum Value {
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
