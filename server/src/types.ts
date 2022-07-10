export interface IUser {
  id?: number;
  name?: string;
  roomId?: number;
  gameActive?: boolean;
}

export type CardValue =
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

export type CardSuit = 'clubs' | 'diamonds' | 'spades' | 'hearts';

// export type CardName = `${CardValue}_of_${CardType}`;

export interface ICard {
  value: CardValue;
  suit: CardSuit;
}

export interface IPlayerStats {
  id: number;
  name: string;
  cards: ICard[];
  totalPoints: number;
  chips: number;
  turn: boolean;
}

export interface IDealerStats {
  cards: ICard[];
  bet: number;
  totalPoints: number;
}

export interface IPlayerActionPayload {
  userId: number;
  roomId: number;
}

export interface ITableStats {
  playersStats: IPlayerStats[];
  dealerStats: IDealerStats;
  logs: string;
}

export interface IRoom {
  id: number;
  players: IUser[];
  tableStats: Partial<ITableStats>;
  deck: ICard[];
  gameActive: boolean;
  roundNumber: number;
}

export interface IRegisterPayload {
  name: string;
}
