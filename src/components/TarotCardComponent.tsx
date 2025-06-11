import React, { useState, useEffect } from 'react';
import { TarotCard } from '../types';

interface TarotCardComponentProps {
  card: TarotCard;
  isFlipped?: boolean;
  isSelected?: boolean;
  onClick?: () => void;
  size?: 'small' | 'medium' | 'large';
  showDetails?: boolean;
  className?: string;
}

const TarotCardComponent: React.FC<TarotCardComponentProps> = ({ 
  card, 
  isFlipped = false, 
  isSelected = false, 
  onClick, 
  size = 'medium', 
  showDetails = true, 
  className = '' 
}) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);

  const getSizeClasses = (size: string) => {
    switch (size) {
      case 'small': return 'w-16 h-28';
      case 'large': return 'w-32 h-52';
      default: return 'w-24 h-40';
    }
  };

  useEffect(() => {
    setImageLoaded(false);
    setImageError(false);
  }, [card.image]);

  const handleImageLoad = () => {
    setImageLoaded(true);
    setImageError(false);
  };

  const handleImageError = () => {
    setImageError(true);
    setImageLoaded(false);
  };

  return (
    <div
      className={`
        relative transform-gpu transition-all duration-300 ease-out
        ${getSizeClasses(size)}
        ${onClick ? 'cursor-pointer hover:scale-105' : ''}
        ${isSelected ? 'ring-4 ring-purple-400 ring-opacity-70' : ''}
        ${className}
      `}
      onClick={onClick}
    >
      <div className={`
        relative w-full h-full transition-transform duration-700 transform-style-preserve-3d
        ${isFlipped ? 'rotate-y-180' : ''}
      `}>
        {/* Card Back */}
        <div className="absolute inset-0 w-full h-full backface-hidden">
          <div className="w-full h-full bg-gradient-to-br from-purple-900 via-indigo-900 to-blue-900 rounded-lg border-2 border-purple-300 shadow-lg">
            <div className="w-full h-full flex items-center justify-center p-2">
              <div className="text-center text-white opacity-80">
                <div className="text-lg font-bold">🌟</div>
                <div className="text-xs font-semibold">TAROT</div>
              </div>
            </div>
          </div>
        </div>

        {/* Card Front */}
        <div className="absolute inset-0 w-full h-full backface-hidden rotate-y-180">
          <div className="w-full h-full bg-gradient-to-br from-amber-50 to-amber-100 rounded-lg border-2 border-amber-300 shadow-lg overflow-hidden">
            {/* Card Image */}
            <div className="relative w-full h-3/5 bg-white">
              {card.image && !imageError ? (
                <>
                  <img
                    src={card.image}
                    alt={card.name}
                    className={`w-full h-full object-cover ${imageLoaded ? 'opacity-100' : 'opacity-0'} transition-opacity duration-300`}
                    onLoad={handleImageLoad}
                    onError={handleImageError}
                  />
                  {!imageLoaded && (
                    <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
                      <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-purple-600"></div>
                    </div>
                  )}
                </>
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-purple-100 to-indigo-100">
                  <div className="text-center text-purple-600">
                    <div className="text-2xl mb-1">🃏</div>
                    <div className="text-xs font-semibold">{card.suit}</div>
                  </div>
                </div>
              )}
            </div>

            {/* Card Details */}
            <div className="p-2 h-2/5">
              <h3 className="text-xs font-bold text-gray-800 text-center mb-1 leading-tight">
                {card.name}
              </h3>
              
              {showDetails && size !== 'small' && (
                <div className="text-xs text-gray-600 space-y-1">
                  <div className="flex justify-between">
                    <span className="font-semibold">Suit:</span>
                    <span>{card.suit}</span>
                  </div>
                  {card.element && (
                    <div className="flex justify-between">
                      <span className="font-semibold">Element:</span>
                      <span className="capitalize">{card.element}</span>
                    </div>
                  )}
                  {card.keywords && card.keywords.length > 0 && (
                    <div className="text-center">
                      <div className="bg-purple-100 px-1 py-0.5 rounded text-xs">
                        {card.keywords[0]}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Selection Glow Effect */}
      {isSelected && (
        <div className="absolute inset-0 bg-purple-400 opacity-20 rounded-lg animate-pulse pointer-events-none"></div>
      )}
    </div>
  );
};

export default TarotCardComponent; 