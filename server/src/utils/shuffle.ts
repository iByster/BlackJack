import { ICard } from '../types';

export function riffleShuffle(deck: ICard[]) {
  const cutDeckVariant = deck.length / 2 + Math.floor(Math.random() * 9) - 4;
  const leftHalf = deck.splice(0, cutDeckVariant);
  let leftCount = leftHalf.length;
  let rightCount = deck.length - Math.floor(Math.random() * 4);
  while (leftCount > 0) {
    const takeAmount = Math.floor(Math.random() * 4);
    deck.splice(rightCount, 0, ...leftHalf.splice(leftCount, takeAmount));
    leftCount -= takeAmount;
    rightCount = rightCount - Math.floor(Math.random() * 4) + takeAmount;
  }
  deck.splice(rightCount, 0, ...leftHalf);
  return deck;
}

export function spliceShuffle(deck: ICard[]) {
  let count = deck.length;
  let tempX;
  while (count) {
    tempX = deck.splice(Math.floor(Math.random() * count), 1);
    deck.splice(count, 0, tempX[0]);
    count -= 1;
  }
  return deck;
}

export function stackShuffle(deck: ICard[]) {
  let count = deck.length;
  while (count) {
    deck.push(deck.splice(Math.floor(Math.random() * count), 1)[0]);
    count -= 1;
  }
  return deck;
}

export function dealersShuffle(Deck: ICard[]) {
  for (let i = 0; i < 8; ++i) {
    if (i % 2 == 0) {
      Deck = riffleShuffle(Deck);
    } else {
      Deck = stackShuffle(Deck);
    }
  }
  Deck = spliceShuffle(Deck);

  return Deck;
}

export const canculatePointByCards = (cards: ICard[]) => {
  let totalValue = 0;
  for (let i = 0; i < cards.length; ++i) {
    const { value } = cards[i];
    let intValue = 0;

    if (value === 'jack' || value === 'king' || value === 'queen') {
      intValue = 10;
    } else if (value === 'ace') {
      if (11 + totalValue > 21) {
        intValue = 1;
      } else {
        intValue = 11;
      }
    } else {
      intValue = parseInt(value);
    }

    totalValue += intValue;
  }

  return totalValue;
};
