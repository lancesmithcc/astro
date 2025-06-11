import React, { useEffect, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import ChatInterface from './components/ChatInterface';
import MandalaBackground from './components/MandalaBackground';
import AstrologicalBackground from './components/AstrologicalBackground';
import TarotAPITest from './components/TarotAPITest';
import { TarotCard } from './types';

gsap.registerPlugin(ScrollTrigger);

function App() {
  const [currentSign, setCurrentSign] = useState<string>('Sagittarius');
  const [energyIntensity, setEnergyIntensity] = useState<number>(0.8); // Start with HIGH visible intensity
  const [selectedCards, setSelectedCards] = useState<TarotCard[]>([]);

  useEffect(() => {
    console.log('🚀 App initialized with MAXIMUM energy activation:', { currentSign, energyIntensity });
  }, []);

  // Function to update sign from child components
  const updateAstrologicalSign = (sign: string) => {
    console.log('🔄 MAXIMUM FORCE sign update to:', sign);
    setCurrentSign(sign);
    setEnergyIntensity(0.9); // MAXIMUM intensity when actively working with a sign
  };

  // Function to update selected cards
  const updateSelectedCards = (cards: TarotCard[]) => {
    console.log('🃏 MAXIMUM FORCE cards update:', cards.map(c => c.name));
    setSelectedCards(cards);
    setEnergyIntensity(1.0); // MAXIMUM intensity when cards are active
  };

  return (
    <div className="min-h-screen text-white overflow-x-hidden relative">
      {/* Astrological background - deepest layer - MAXIMUM ACTIVATION */}
      <AstrologicalBackground 
        currentSign={currentSign} 
        intensity={energyIntensity}
        selectedCards={selectedCards}
      />
      
      {/* Mandala background - middle layer */}
      <MandalaBackground />
      
      {/* Main content - top layer */}
      <div className="min-h-screen relative z-10">
        {/* Temporary test component */}
        <div className="p-4">
          <TarotAPITest />
        </div>
        
        <ChatInterface 
          onSignChange={updateAstrologicalSign}
          onCardsChange={updateSelectedCards}
        />
      </div>
    </div>
  );
}

export default App;