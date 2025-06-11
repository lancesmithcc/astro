import React, { useState } from 'react';
import { TarotCard } from '../types';

interface TarotCardModalProps {
  card: TarotCard | null;
  isOpen: boolean;
  onClose: () => void;
}

const TarotCardModal: React.FC<TarotCardModalProps> = ({ card, isOpen, onClose }) => {
  const [imageError, setImageError] = useState(false);
  const [imageLoading, setImageLoading] = useState(true);

  // Reset image states when card changes or modal opens
  React.useEffect(() => {
    if (isOpen) {
      setImageError(false);
      setImageLoading(true);
      console.log('Modal is open, resetting image state for card:', card?.name);
    }
  }, [card?.name, isOpen]);

  // All hooks must be called before any early returns.
  if (!isOpen || !card) {
    return null;
  }

  // Debug: log card data
  console.log('Rendering modal with card data:', {
    name: card.name,
    image: card.image,
    suit: card.suit,
    hasKeywords: card.keywords?.length > 0,
    hasUpright: !!card.upright,
    hasReversed: !!card.reversed
  });

  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement>) => {
    console.log('Image failed to load:', card?.image, 'for card:', card?.name);
    setImageError(true);
    setImageLoading(false);
  };

  const handleImageLoad = () => {
    console.log('Image loaded successfully:', card.image);
    setImageError(false);
    setImageLoading(false);
  };

  return (
    <div className="fixed inset-0 z-[999] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-[#111111]"
        onClick={onClose}
      ></div>
      
      {/* Modal Content */}
      <div className="relative rounded-full shadow-2xl w-full max-w-6xl border border-gray-800 flex flex-col md:flex-row h-auto max-h-[90vh] md:max-h-[80vh]">
        {/* Close Button - positioned absolutely within the modal content area */}
        <div className="absolute top-2 right-2 z-10">
          <button
            onClick={onClose}
            className="w-10 h-10 bg-black/50 hover:bg-gray-800/70 rounded-full flex items-center justify-center transition-all duration-300 border border-gray-700 hover:border-gray-500 backdrop-blur-sm"
          >
            <span className="text-gray-400 text-2xl font-bold -mt-1">×</span>
          </button>
        </div>
        
        {/* Left Side: Card Image - now a flex item, not in a grid */}
        <div className="w-full md:w-[35%] lg:w-[40%] flex-shrink-0 p-4 md:p-6 flex justify-center items-center">
          <div className="w-full max-w-[320px] md:max-w-full aspect-[2/3.5] rounded-xl overflow-hidden shadow-lg border-2 border-gray-700 bg-black">
            {card.image && !imageError ? (
              <>
                {imageLoading && (
                  <div className="w-full h-full flex items-center justify-center bg-black">
                    <div className="animate-spin w-8 h-8 border-2 border-white border-t-transparent rounded-full"></div>
                  </div>
                )}
                <img
                  src={card.image}
                  alt={card.name}
                  loading="lazy"
                  className="w-full h-full object-cover"
                  onLoad={handleImageLoad}
                  onError={handleImageError}
                  style={{ display: imageLoading ? 'none' : 'block' }}
                />
              </>
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-black p-4">
                <div className="text-center text-gray-400">
                  <div className="text-6xl mb-4">🃏</div>
                  <div className="font-bold text-xl text-gray-200 mb-2">{card.name}</div>
                  <div className="text-xs mt-2 opacity-60">
                    {imageError ? 'Image unavailable' : 'No image URL'}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right Side: Card Details - now a flex item that scrolls */}
        <div className="flex-1 overflow-y-auto no-scrollbar p-4 md:p-6 space-y-6">
          <div className="text-center md:text-left">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-100 mb-2">{card.name}</h2>
            <div className="flex flex-wrap gap-3 justify-center md:justify-start">
              <span className="px-3 py-1 bg-black rounded-full text-sm text-gray-300 border border-gray-800">
                {card.suit}
              </span>
              {card.element && (
                <span className="px-3 py-1 bg-black rounded-full text-sm text-gray-300 border border-gray-800 capitalize">
                  {card.element}
                </span>
              )}
            </div>
          </div>

          {card.keywords && card.keywords.length > 0 && (
            <div className="bg-black rounded-lg p-4 border border-gray-800">
              <h3 className="text-lg font-semibold text-gray-200 mb-3">✨ Keywords</h3>
              <div className="flex flex-wrap gap-2">
                {card.keywords.map((keyword, index) => (
                  <span key={index} className="px-2 py-1 bg-[#111111] border border-gray-700 rounded-lg text-gray-300 text-sm">
                    {keyword}
                  </span>
                ))}
              </div>
            </div>
          )}

          <div className="space-y-4">
            {card.upright && (
              <div className="bg-black rounded-lg p-4 border border-gray-800">
                <h3 className="text-lg font-semibold text-green-400 mb-2 flex items-center">
                  <span className="mr-2">⬆️</span> Upright
                </h3>
                <p className="text-gray-300 leading-relaxed">{card.upright}</p>
              </div>
            )}
            {card.reversed && (
              <div className="bg-black rounded-lg p-4 border border-gray-800">
                <h3 className="text-lg font-semibold text-red-400 mb-2 flex items-center">
                  <span className="mr-2">⬇️</span> Reversed
                </h3>
                <p className="text-gray-300 leading-relaxed">{card.reversed}</p>
              </div>
            )}
          </div>

          {/* Description */}
          {card.description && (
            <div className="bg-black rounded-lg p-4 border border-gray-800">
              <h3 className="text-lg font-semibold text-gray-200 mb-2 flex items-center">
                <span className="mr-2">📜</span> Description
              </h3>
              <p className="text-gray-300 leading-relaxed">{card.description}</p>
            </div>
          )}

          {/* Debug info - can be toggled on/off as needed */}
          {false && (
            <div className="bg-black/30 rounded-lg p-3 border border-orange-500/30 text-xs">
              <h4 className="text-orange-400 font-semibold mb-1">Debug Info:</h4>
              <div className="text-gray-300 space-y-1">
                <div>Image URL: {card?.image || 'None'}</div>
                <div>Image Error: {imageError ? 'Yes' : 'No'}</div>
                <div>Loading: {imageLoading ? 'Yes' : 'No'}</div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TarotCardModal; 