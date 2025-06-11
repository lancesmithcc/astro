export interface TarotAPICard {
  name: string;
  name_short: string;
  type: string;
  suit?: string;
  meaning_up: string;
  meaning_rev: string;
  desc: string;
  image?: string;
}

export interface TarotAPIResponse {
  nhits: number;
  cards: TarotAPICard[];
}

class TarotAPIService {
  private readonly BASE_URL = 'https://tarotapi.netlify.app/api/v1';
  
  /**
   * Fetch a single random tarot card
   */
  async getRandomCard(): Promise<TarotAPICard> {
    try {
      const response = await fetch(`${this.BASE_URL}/cards/random`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      return data.cards[0]; // API returns array with one card
    } catch (error) {
      console.error('Error fetching random card:', error);
      throw error;
    }
  }

  /**
   * Fetch all tarot cards
   */
  async getAllCards(): Promise<TarotAPICard[]> {
    try {
      const response = await fetch(`${this.BASE_URL}/cards`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data: TarotAPIResponse = await response.json();
      return data.cards;
    } catch (error) {
      console.error('Error fetching all cards:', error);
      throw error;
    }
  }

  /**
   * Fetch multiple random cards
   */
  async getRandomCards(count: number = 3): Promise<TarotAPICard[]> {
    try {
      const cards: TarotAPICard[] = [];
      const promises = Array(count).fill(null).map(() => this.getRandomCard());
      const results = await Promise.all(promises);
      return results;
    } catch (error) {
      console.error('Error fetching random cards:', error);
      throw error;
    }
  }

  /**
   * Convert API card to our internal TarotCard format
   */
  convertToTarotCard(apiCard: TarotAPICard): import('../types').TarotCard {
    return {
      name: apiCard.name,
      suit: apiCard.suit || apiCard.type,
      keywords: [apiCard.name_short],
      upright: apiCard.meaning_up,
      reversed: apiCard.meaning_rev,
      element: this.getElementFromSuit(apiCard.suit || apiCard.type),
      image: this.getCardImageUrl(apiCard.name_short),
      description: apiCard.desc
    };
  }

  /**
   * Get element from suit
   */
  private getElementFromSuit(suit: string): string {
    const suitElements: { [key: string]: string } = {
      'wands': 'fire',
      'cups': 'water', 
      'swords': 'air',
      'pentacles': 'earth',
      'major': 'spirit'
    };
    
    const lowerSuit = suit.toLowerCase();
    return suitElements[lowerSuit] || 'spirit';
  }

  /**
   * Generate image URL for card
   */
  private getCardImageUrl(nameShort: string): string {
    // The API provides images at a predictable URL pattern
    return `https://sacred-texts.com/tarot/pkt/img/${nameShort.toLowerCase().replace(/\s+/g, '')}.jpg`;
  }
}

export const tarotAPI = new TarotAPIService(); 