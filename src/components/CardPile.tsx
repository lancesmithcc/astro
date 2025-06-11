import React, { useState, useEffect } from 'react';
import { gsap } from 'gsap';
import { TarotCard } from '../types';
import { tarotAPI } from '../services/tarotAPI';
import TarotCardModal from './TarotCardModal';

interface CardPileProps {
  onCardsSelected: (cards: TarotCard[]) => void;
}

const CardPile: React.FC<CardPileProps> = ({ onCardsSelected }) => {
  const [deckCards, setDeckCards] = useState<TarotCard[]>([]);
  const [selectedCards, setSelectedCards] = useState<TarotCard[]>([]);
  const [revealedIndices, setRevealedIndices] = useState<Set<number>>(new Set());
  const [isLoading, setIsLoading] = useState(true);
  const [expandedCard, setExpandedCard] = useState<TarotCard | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    fetchTarotDeck();
  }, []);

  const fetchTarotDeck = async () => {
    try {
      // Use our new tarot API service
      const apiCards = await tarotAPI.getAllCards();
      
      console.log('API Response:', apiCards); // Debug log
      
      // Transform API data to match our TarotCard interface with images
      const transformedCards: TarotCard[] = apiCards.map((apiCard) => {
        return tarotAPI.convertToTarotCard(apiCard);
      });
      
      // Shuffle the deck
      const shuffled = transformedCards.sort(() => Math.random() - 0.5);
      setDeckCards(shuffled);
      setIsLoading(false);

      // Animate cards into wild pile after loading
      setTimeout(() => {
        gsap.fromTo('.card-pile-item', 
          { 
            opacity: 0, 
            scale: 0.3,
            rotation: () => Math.random() * 180 - 90,
            x: () => Math.random() * 400 - 200,
            y: () => Math.random() * 400 - 200
          }, 
          { 
            opacity: 0.9, 
            scale: 1,
            rotation: () => Math.random() * 60 - 30,
            x: () => Math.random() * 120 - 60,
            y: () => Math.random() * 120 - 60,
            duration: 2,
            ease: 'back.out(1.2)',
            stagger: {
              amount: 1.5,
              from: "random"
            }
          }
        );
      }, 100);
    } catch (error) {
      console.error('Failed to fetch tarot cards:', error);
      // Fallback to a basic deck structure if API fails
      const fallbackCards = generateFallbackDeck();
      setDeckCards(fallbackCards);
      setIsLoading(false);
    }
  };

  const generateFallbackDeck = (): TarotCard[] => {
    const fallbackCards = [
      { name: "The Fool", suit: "Major Arcana", keywords: ["new beginnings", "adventure"] },
      { name: "The Magician", suit: "Major Arcana", keywords: ["manifestation", "willpower"] },
      { name: "The High Priestess", suit: "Major Arcana", keywords: ["intuition", "mystery"] },
      { name: "The Empress", suit: "Major Arcana", keywords: ["abundance", "nurturing"] },
      { name: "The Emperor", suit: "Major Arcana", keywords: ["authority", "structure"] },
      { name: "The Hierophant", suit: "Major Arcana", keywords: ["tradition", "wisdom"] },
      { name: "The Lovers", suit: "Major Arcana", keywords: ["love", "harmony"] },
      { name: "The Chariot", suit: "Major Arcana", keywords: ["control", "determination"] },
      { name: "Strength", suit: "Major Arcana", keywords: ["courage", "inner strength"] },
      { name: "The Hermit", suit: "Major Arcana", keywords: ["introspection", "guidance"] },
      { name: "Wheel of Fortune", suit: "Major Arcana", keywords: ["change", "destiny"] },
      { name: "Justice", suit: "Major Arcana", keywords: ["balance", "fairness"] },
      { name: "The Hanged Man", suit: "Major Arcana", keywords: ["surrender", "perspective"] },
      { name: "Death", suit: "Major Arcana", keywords: ["transformation", "endings"] },
      { name: "Temperance", suit: "Major Arcana", keywords: ["balance", "moderation"] },
      { name: "The Devil", suit: "Major Arcana", keywords: ["temptation", "bondage"] },
      { name: "The Tower", suit: "Major Arcana", keywords: ["upheaval", "revelation"] },
      { name: "The Star", suit: "Major Arcana", keywords: ["hope", "inspiration"] },
      { name: "The Moon", suit: "Major Arcana", keywords: ["illusion", "intuition"] },
      { name: "The Sun", suit: "Major Arcana", keywords: ["joy", "success"] },
      { name: "Judgement", suit: "Major Arcana", keywords: ["rebirth", "awakening"] },
      { name: "The World", suit: "Major Arcana", keywords: ["completion", "fulfillment"] },
      { name: "Ace of Cups", suit: "Cups", keywords: ["new love", "emotions"] },
      { name: "Two of Cups", suit: "Cups", keywords: ["partnership", "connection"] },
      { name: "Three of Cups", suit: "Cups", keywords: ["celebration", "friendship"] }
    ];

    return fallbackCards.map(card => ({
      ...card,
      upright: `Positive energy related to ${card.keywords[0]}`,
      reversed: `Blocked or internal ${card.keywords[0]}`,
      element: getElementFromSuit(card.suit)
    }));
  };

  const getElementFromSuit = (suit: string): string => {
    if (!suit) return 'Spirit';
    const suitLower = suit.toLowerCase();
    if (suitLower.includes('wand') || suitLower.includes('rod')) return 'Fire';
    if (suitLower.includes('cup') || suitLower.includes('chalice')) return 'Water';
    if (suitLower.includes('sword')) return 'Air';
    if (suitLower.includes('pentacle') || suitLower.includes('coin')) return 'Earth';
    return 'Spirit';
  };

  const handleCardClick = (card: TarotCard, index: number) => {
    if (selectedCards.length >= 3 || revealedIndices.has(index)) return;

    setRevealedIndices(prev => new Set([...prev, index]));
    
    // Animate card selection - just flip in place, keep in pile
    gsap.to(`.pile-card-${index}`, {
      scale: 1.1,
      rotation: 0,
      zIndex: 200 + selectedCards.length,
      duration: 0.6,
      ease: 'back.out(1.5)'
    });

    // Slightly fade out other unselected cards
    gsap.to('.card-pile-item:not(.selected)', {
      opacity: 0.6,
      duration: 0.3
    });

    const newSelected = [...selectedCards, card];
    setSelectedCards(newSelected);
    
    if (newSelected.length === 3) {
      setTimeout(() => onCardsSelected(newSelected), 1000);
    }
  };

  const handleCardExpand = (card: TarotCard, e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent triggering the card selection
    setExpandedCard(card);
    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setExpandedCard(null);
  };

  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement>) => {
    const img = e.target as HTMLImageElement;
    const fallbackDiv = img.nextElementSibling as HTMLElement;
    if (fallbackDiv) {
      img.style.display = 'none';
      fallbackDiv.style.display = 'flex';
    }
  };

  if (isLoading) {
    return (
      <div className="text-center">
        <div className="w-16 h-16 border-4 border-cosmic-400 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
        <p className="text-cosmic-200">Shuffling the cosmic deck...</p>
      </div>
    );
  }

  return (
    <div className="relative">
      <div className="relative w-96 h-96 mx-auto">
        {/* Wild card pile - showing 25 cards in chaotic overlay */}
        {deckCards.slice(0, 25).map((card, index) => (
          <div
            key={`${card.name}-${index}`}
            className={`pile-card-${index} card-pile-item absolute cursor-pointer transition-all duration-300 hover:z-50 ${
              revealedIndices.has(index) ? 'selected' : ''
            }`}
            style={{
              left: '50%',
              top: '50%',
              transform: 'translate(-50%, -50%)',
              zIndex: revealedIndices.has(index) ? 200 + selectedCards.indexOf(card) : Math.floor(Math.random() * 25),
            }}
            onClick={() => handleCardClick(card, index)}
            onDoubleClick={(e) => handleCardExpand(card, e)}
          >
            <div className="w-20 h-32 relative group">
              {revealedIndices.has(index) ? (
                <div className="w-full h-full rounded-lg overflow-hidden mystical-shadow 
                               border-2 border-aurora-400 animate-glow relative">
                  {/* Try to load the image first */}
                  {card.image && (
                    <img 
                      src={card.image} 
                      alt={card.name}
                      className="w-full h-full object-cover rounded-lg"
                      onError={handleImageError}
                      crossOrigin="anonymous"
                    />
                  )}
                  
                  {/* Fallback gradient card - always present but hidden if image loads */}
                  <div className="w-full h-full bg-gradient-to-b from-cosmic-600 to-aurora-600 
                                 rounded-lg p-2 flex flex-col justify-between absolute inset-0"
                       style={{ display: card.image ? 'none' : 'flex' }}>
                    <div className="text-center">
                      <h4 className="text-xs font-bold text-white mb-1 leading-tight">{card.name}</h4>
                      <p className="text-xs text-cosmic-100">{card.suit}</p>
                    </div>
                    <div className="text-center">
                      <p className="text-xs text-cosmic-200">{card.keywords[0]}</p>
                    </div>
                  </div>
                  
                  {/* Overlay with card name for images */}
                  {card.image && (
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent 
                                   flex flex-col justify-between p-2 rounded-lg">
                      <div className="text-right opacity-0 group-hover:opacity-100 transition-opacity">
                        <span className="text-xs text-white/80">Double-click to expand 🔍</span>
                      </div>
                      <h4 className="text-xs font-bold text-white leading-tight">{card.name}</h4>
                    </div>
                  )}
                </div>
              ) : (
                <div className="w-full h-full rounded-lg overflow-hidden mystical-shadow 
                               group-hover:scale-110 group-hover:rotate-0 transition-all duration-300 
                               border border-cosmic-500/50 relative">
                  {/* Card back design */}
                  <div className="w-full h-full cosmic-gradient flex items-center justify-center relative">
                    {/* Mystical pattern overlay */}
                    <div className="absolute inset-0 opacity-30">
                      <div className="w-full h-full bg-gradient-to-br from-transparent via-white/10 to-transparent"></div>
                      <div className="absolute inset-2 border border-white/20 rounded"></div>
                      <div className="absolute inset-4 border border-white/10 rounded-full"></div>
                    </div>
                    
                    <div className="text-white text-center relative z-10">
                      <div className="w-6 h-6 border-2 border-white rounded-full mx-auto mb-1 
                                     flex items-center justify-center">
                        <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                      </div>
                      <div className="text-xs opacity-0 group-hover:opacity-100 transition-opacity">
                        Choose
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {selectedCards.length > 0 && (
        <div className="mt-16 text-center">
          <p className="text-cosmic-300 mb-8 text-xl font-semibold">
            {selectedCards.length === 3 ? '✨ Your Chosen Trinity ✨' : `${selectedCards.length} of 3 cards chosen`}
          </p>
          <div className="flex justify-center space-x-8">
            {selectedCards.map((card, index) => (
              <div key={index} className="text-center transform hover:scale-105 transition-transform duration-300 group">
                <div 
                  className="w-24 h-36 rounded-lg overflow-hidden mystical-shadow border-2 border-aurora-400 relative bg-gradient-to-b from-cosmic-800 to-cosmic-900 cursor-pointer" 
                  onClick={(e) => handleCardExpand(card, e)}
                >
                  {card.image ? (
                    <>
                      <img 
                        src={card.image} 
                        alt={card.name}
                        className="w-full h-full object-cover rounded-lg"
                        onError={handleImageError}
                        crossOrigin="anonymous"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent 
                                     flex flex-col justify-between p-2 rounded-lg group-hover:from-black/80">
                        <div className="text-right opacity-0 group-hover:opacity-100 transition-opacity">
                          <span className="text-xs text-white/80">Click to expand 🔍</span>
                        </div>
                        <h5 className="text-xs font-bold text-white leading-tight shadow-text">{card.name}</h5>
                      </div>
                    </>
                  ) : (
                    <div className="w-full h-full bg-gradient-to-b from-cosmic-600 to-aurora-600 p-2 flex flex-col justify-between">
                      <div className="text-center">
                        <h5 className="text-xs font-bold text-white mb-1 leading-tight">{card.name}</h5>
                        <p className="text-xs text-cosmic-100 mb-2">{card.suit}</p>
                      </div>
                      <p className="text-xs text-cosmic-200 text-center">{card.keywords && card.keywords[0]}</p>
                    </div>
                  )}
                </div>
                <div className="mt-3">
                  <p className="text-sm font-semibold text-aurora-300 mb-1">
                    {index === 0 ? '🌙 Past' : index === 1 ? '⭐ Present' : '🔮 Future'}
                  </p>
                  <p className="text-xs text-cosmic-400 leading-relaxed max-w-24">
                    {card.keywords && card.keywords[0]}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <TarotCardModal
        card={expandedCard}
        isOpen={isModalOpen}
        onClose={handleModalClose}
      />
    </div>
  );
};

export default CardPile;