type CardValue =
  | '2'
  | '3'
  | '4'
  | '5'
  | '6'
  | '7'
  | '8'
  | '9'
  | '10'
  | 'jack'
  | 'queen'
  | 'king'
  | 'ace';

type CardSuit = 'clubs' | 'diamonds' | 'spades' | 'hearts';

// export Suit CardName = `${CardNumber}_of_${CardSuit}`;

export interface ICard {
  value: CardValue;
  suit: CardSuit;
}

export interface IPlayerStats {
  id: number;
  name: string;
  cards: ICard[];
  chips: number;
  turn: boolean;
  totalPoints: number;
}

export interface IDealerStats {
  cards: ICard[];
  bet: number;
  totalPoints: number;
}

export interface ITableStats {
  playersStats: IPlayerStats[];
  dealerStats: IDealerStats;
  logs: string;
}
