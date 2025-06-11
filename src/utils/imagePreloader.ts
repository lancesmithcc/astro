import { tarotAPI, getCardImageUrl } from '../services/tarotAPI';
import { TarotAPICard } from '../services/tarotAPI';

/**
 * Preloads all tarot card images in the background to ensure they are cached
 * by the browser for instant loading during the user experience.
 */
export const preloadCardImages = async (): Promise<void> => {
  console.log('🔮 Preloading all 78 tarot card images...');
  
  try {
    const allCards = await tarotAPI.getAllCards();

    if (!allCards || allCards.length === 0) {
      console.error('Failed to fetch card list for preloading.');
      return;
    }

    const imagePromises: Promise<void>[] = [];

    allCards.forEach((card: TarotAPICard) => {
      const imageUrl = getCardImageUrl(card.name_short);
      if (imageUrl) {
        const promise = new Promise<void>((resolve) => {
          const img = new Image();
          img.src = imageUrl;
          img.onload = () => resolve();
          img.onerror = () => {
            // We can choose to reject or just log the error and resolve
            // For robustness, we'll log and resolve so one failed image doesn't stop others
            console.warn(`Failed to preload image: ${imageUrl}`);
            resolve(); 
          };
        });
        imagePromises.push(promise);
      }
    });

    await Promise.all(imagePromises);
    console.log(`✅ Successfully initiated preloading for ${imagePromises.length} card images.`);

  } catch (error) {
    console.error('An error occurred during image preloading:', error);
  }
}; 