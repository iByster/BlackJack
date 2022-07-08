import { ICard } from "../types";

class DeckService {
    getFirstCard(deck: ICard[]) {
        return deck.shift();
    }
}

export default DeckService;