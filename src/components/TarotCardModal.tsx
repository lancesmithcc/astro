import React from 'react';
import { TarotCard } from '../types';

interface TarotCardModalProps {
  card: TarotCard | null;
  isOpen: boolean;
  onClose: () => void;
}

const TarotCardModal: React.FC<TarotCardModalProps> = ({ card, isOpen, onClose }) => {
  if (!isOpen || !card) return null;

  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement>) => {
    const img = e.target as HTMLImageElement;
    const fallback = img.nextElementSibling as HTMLElement;
    if (fallback) {
      img.style.display = 'none';
      fallback.style.display = 'flex';
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/80 backdrop-blur-sm"
        onClick={onClose}
      ></div>
      
      {/* Modal Content */}
      <div className="relative bg-gradient-to-br from-cosmic-900 via-void-900 to-cosmic-800 rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto border border-aurora-400/30">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 w-10 h-10 bg-cosmic-800 hover:bg-cosmic-700 rounded-full flex items-center justify-center transition-all duration-300 border border-aurora-400/50 hover:border-aurora-300"
        >
          <span className="text-aurora-300 text-xl font-bold">×</span>
        </button>

        <div className="p-8">
          <div className="grid md:grid-cols-2 gap-8">
            {/* Card Image */}
            <div className="flex justify-center">
              <div className="relative">
                <div className="w-64 h-96 rounded-xl overflow-hidden mystical-shadow border-2 border-aurora-400 bg-gradient-to-b from-cosmic-800 to-cosmic-900">
                  {card.image ? (
                    <>
                      <img
                        src={card.image}
                        alt={card.name}
                        className="w-full h-full object-cover rounded-xl"
                        onError={handleImageError}
                        crossOrigin="anonymous"
                      />
                      {/* Fallback for card image */}
                      <div className="w-full h-full bg-gradient-to-br from-purple-100 to-indigo-100 flex items-center justify-center absolute inset-0 rounded-xl" style={{ display: 'none' }}>
                        <div className="text-center text-purple-600">
                          <div className="text-6xl mb-4">🃏</div>
                          <div className="font-semibold text-lg">{card.suit}</div>
                        </div>
                      </div>
                    </>
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-purple-100 to-indigo-100 flex items-center justify-center">
                      <div className="text-center text-purple-600">
                        <div className="text-6xl mb-4">🃏</div>
                        <div className="font-semibold text-lg">{card.suit}</div>
                      </div>
                    </div>
                  )}
                </div>
                
                {/* Mystical glow effect */}
                <div className="absolute inset-0 bg-aurora-400/20 rounded-xl blur-xl animate-pulse"></div>
              </div>
            </div>

            {/* Card Details */}
            <div className="space-y-6">
              {/* Header */}
              <div className="text-center md:text-left">
                <h2 className="text-3xl font-bold text-aurora-300 mb-2">{card.name}</h2>
                <div className="flex flex-wrap gap-3 justify-center md:justify-start">
                  <span className="px-3 py-1 bg-cosmic-700 rounded-full text-sm text-cosmic-200 border border-aurora-500/30">
                    {card.suit}
                  </span>
                  {card.element && (
                    <span className="px-3 py-1 bg-cosmic-700 rounded-full text-sm text-cosmic-200 border border-aurora-500/30 capitalize">
                      {card.element}
                    </span>
                  )}
                </div>
              </div>

              {/* Keywords */}
              {card.keywords && card.keywords.length > 0 && (
                <div>
                  <h3 className="text-lg font-semibold text-aurora-300 mb-3">✨ Keywords</h3>
                  <div className="flex flex-wrap gap-2">
                    {card.keywords.map((keyword, index) => (
                      <span
                        key={index}
                        className="px-2 py-1 bg-aurora-600/20 border border-aurora-400/40 rounded-lg text-aurora-200 text-sm"
                      >
                        {keyword}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Meanings */}
              <div className="space-y-4">
                {/* Upright */}
                <div className="bg-cosmic-800/50 rounded-lg p-4 border border-green-500/30">
                  <h3 className="text-lg font-semibold text-green-400 mb-2 flex items-center">
                    <span className="mr-2">⬆️</span> Upright Meaning
                  </h3>
                  <p className="text-cosmic-100 leading-relaxed">{card.upright}</p>
                </div>

                {/* Reversed */}
                <div className="bg-cosmic-800/50 rounded-lg p-4 border border-red-500/30">
                  <h3 className="text-lg font-semibold text-red-400 mb-2 flex items-center">
                    <span className="mr-2">⬇️</span> Reversed Meaning
                  </h3>
                  <p className="text-cosmic-100 leading-relaxed">{card.reversed}</p>
                </div>
              </div>

              {/* Description */}
              {card.description && (
                <div className="bg-cosmic-800/50 rounded-lg p-4 border border-aurora-500/30">
                  <h3 className="text-lg font-semibold text-aurora-300 mb-2 flex items-center">
                    <span className="mr-2">📜</span> Description
                  </h3>
                  <p className="text-cosmic-100 leading-relaxed">{card.description}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TarotCardModal; 