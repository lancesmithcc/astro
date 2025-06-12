export interface TarotAPICard {
  name: string;
  name_short: string;
  type: string;
  suit?: string;
  meaning_up: string;
  meaning_rev: string;
  desc: string;
  value: string;
  value_int: number;
}

export interface TarotAPIResponse {
  nhits: number;
  cards: TarotAPICard[];
}

class TarotAPIService {
  private readonly BASE_URL = 'https://tarotapi.dev/api/v1';
  
  /**
   * Fetch a single random tarot card
   */
  async getRandomCard(): Promise<TarotAPICard> {
    try {
      const response = await fetch(`${this.BASE_URL}/cards/random?n=1`);
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
      const data = await response.json();
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
      const response = await fetch(`${this.BASE_URL}/cards/random?n=${count}`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      return data.cards;
    } catch (error) {
      console.error('Error fetching random cards:', error);
      throw error;
    }
  }

  /**
   * Convert API card to our internal TarotCard format.
   * We derive human-friendly keywords from the upright meaning so the guidance
   * language never falls back to cryptic numbers like "1 energy".
   */
  convertToTarotCard(apiCard: TarotAPICard): import('../types').TarotCard {
    return {
      name: apiCard.name,
      suit: apiCard.suit || apiCard.type,
      keywords: this.extractKeywords(apiCard),
      upright: apiCard.meaning_up,
      reversed: apiCard.meaning_rev,
      element: this.getElementFromSuit(apiCard.suit || apiCard.type),
      image: this.getCardImageUrl(apiCard.name_short),
      description: apiCard.desc
    };
  }

  /**
   * Build a concise list of descriptive keywords for the card.
   * 1. Split the upright meaning on commas and grab the first few descriptors.
   * 2. Fallback to card value/name when no descriptors are found.
   * 3. Filter out any numeric strings so we never show "1 energy" etc.
   */
  private extractKeywords(apiCard: TarotAPICard): string[] {
    const raw = (apiCard.meaning_up || '').split(',').map(s => s.trim()).filter(Boolean);

    // Filter out purely numeric or roman-numeral values
    const cleaned = raw.filter(word => !/^[0-9ivxlcdm]+$/i.test(word));

    if (cleaned.length > 0) {
      // Capitalise first letter for nicer display and limit to 3 keywords.
      return cleaned.slice(0, 3).map(k => k.charAt(0).toUpperCase() + k.slice(1));
    }

    // Fallbacks – use card value (e.g., "Ace") or the full name
    const fallback = apiCard.value && !/^[0-9]+$/.test(apiCard.value)
      ? apiCard.value
      : apiCard.name;

    return [fallback];
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
    // Use an image proxy (images.weserv.nl) to reliably fetch Rider–Waite public-domain images
    // The proxy caches remote assets and sidesteps occasional CORS / connectivity issues to sacred-texts.com
    const rawUrl = `ssl:www.sacred-texts.com/tarot/pkt/img/${nameShort}.jpg`;
    return `https://images.weserv.nl/?url=${rawUrl}`;
  }
}

export const tarotAPI = new TarotAPIService();

/**
 * Constructs the full image URL for a given card's short name.
 * Uses the public domain Rider-Waite deck images from sacred-texts.com.
 * @param nameShort - The short name of the card (e.g., 'ar01', 'cu02').
 * @returns The full URL to the card's image.
 */
export const getCardImageUrl = (nameShort: string): string => {
  const rawUrl = `ssl:www.sacred-texts.com/tarot/pkt/img/${nameShort}.jpg`;
  return `https://images.weserv.nl/?url=${rawUrl}`;
}; 