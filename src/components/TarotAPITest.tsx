import React, { useState, useEffect } from 'react';
import { tarotAPI } from '../services/tarotAPI';
import { TarotCard } from '../types';

const TarotAPITest: React.FC = () => {
  const [cards, setCards] = useState<TarotCard[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchRandomCards = async () => {
    setLoading(true);
    setError(null);
    try {
      const randomCards = await tarotAPI.getRandomCards(3);
      const convertedCards = randomCards.map(card => tarotAPI.convertToTarotCard(card));
      setCards(convertedCards);
    } catch (err) {
      setError('Failed to fetch cards: ' + (err instanceof Error ? err.message : String(err)));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRandomCards();
  }, []);

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold text-white mb-4">Tarot API Integration Test</h2>
      
      <button
        onClick={fetchRandomCards}
        disabled={loading}
        className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded mb-6 disabled:opacity-50"
      >
        {loading ? 'Loading...' : 'Get Random Cards'}
      </button>

      {error && (
        <div className="bg-red-500 text-white p-4 rounded mb-4">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {cards.map((card, index) => (
          <div key={index} className="bg-white rounded-lg shadow-lg overflow-hidden">
            {/* Card Image */}
            <div className="w-full h-64 bg-gray-200 relative">
              {card.image ? (
                <img
                  src={card.image}
                  alt={card.name}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.style.display = 'none';
                    const fallback = target.nextElementSibling as HTMLElement;
                    if (fallback) fallback.style.display = 'flex';
                  }}
                />
              ) : null}
              
              {/* Fallback display */}
              <div className={`w-full h-full bg-gradient-to-br from-purple-100 to-indigo-100 flex items-center justify-center ${card.image ? 'hidden' : 'flex'}`}>
                <div className="text-center text-purple-600">
                  <div className="text-4xl mb-2">🃏</div>
                  <div className="font-semibold">{card.suit}</div>
                </div>
              </div>
            </div>

            {/* Card Details */}
            <div className="p-4">
              <h3 className="text-xl font-bold text-gray-800 mb-2">{card.name}</h3>
              <div className="space-y-2 text-sm text-gray-600">
                <div><strong>Suit:</strong> {card.suit}</div>
                {card.element && <div><strong>Element:</strong> {card.element}</div>}
                {card.keywords && (
                  <div><strong>Keywords:</strong> {card.keywords.join(', ')}</div>
                )}
                <div className="mt-3">
                  <div className="font-semibold text-green-600">Upright:</div>
                  <div className="text-xs">{card.upright}</div>
                </div>
                <div className="mt-2">
                  <div className="font-semibold text-red-600">Reversed:</div>
                  <div className="text-xs">{card.reversed}</div>
                </div>
                {card.description && (
                  <div className="mt-2">
                    <div className="font-semibold text-blue-600">Description:</div>
                    <div className="text-xs">{card.description}</div>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {cards.length === 0 && !loading && !error && (
        <div className="text-center text-gray-400 py-8">
          Click "Get Random Cards" to test the API integration
        </div>
      )}
    </div>
  );
};

export default TarotAPITest; 