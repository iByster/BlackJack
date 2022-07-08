
import { NUMBER_OF_DECK } from '../consts';
import { ICard } from '../types';
import deck from './deck.json'

export const generateDecks = () => {
    const decks = [];
    for (let i = 0; i < NUMBER_OF_DECK; ++i) {
      decks.push(deck);
    }
  
    return decks.flat() as ICard[];
  };