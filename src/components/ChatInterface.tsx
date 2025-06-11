import React, { useState, useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { Send, Sparkles, Star, Brain, Zap, MessageCircle } from 'lucide-react';
import { TypeAnimation } from 'react-type-animation';
import CardPile from './CardPile';
import BirthdateInput, { BirthData } from './BirthdateInput';
import { generateEnhancedInitialQuestion, generateEnhancedFollowUpQuestion, generateEnhancedInsight, analyzeResponseDepth, generateEnergyUpdate } from '../utils/enhancedDeepseekEngine';
import { calculateEvolutionaryAstrology, generateAstrologyInsight, AstrologyData } from '../utils/evolutionaryAstrology';
import { performDeepAnalysis, DeepAnalysis } from '../utils/deepAnalysisEngine';
import { analyzeTextEnergy, analyzeCumulativeEnergy } from '../utils/textEnergyAnalyzer';
import { TarotCard } from '../types';
import { preloadCardImages } from '../utils/imagePreloader';
import { getDailyGradient } from '../utils/dailyColor';

interface Message {
  id: string;
  type: 'mystic' | 'user' | 'card-selection' | 'analysis' | 'astrology' | 'deep-analysis' | 'clarifying-response';
  content: string;
  timestamp: Date;
  cards?: TarotCard[];
  astroData?: AstrologyData;
  energySignature?: any;
  deepAnalysis?: DeepAnalysis;
  responseMetrics?: {
    depth: number;
    authenticity: number;
    readiness: number;
    themes: string[];
  };
}

interface ChatInterfaceProps {
  onSignChange?: (sign: string) => void;
  onCardsChange?: (cards: TarotCard[]) => void;
}

const ChatInterface: React.FC<ChatInterfaceProps> = ({ onSignChange, onCardsChange }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [currentInput, setCurrentInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [currentStep, setCurrentStep] = useState<'birthdate' | 'initial' | 'cards' | 'deeper' | 'final' | 'clarifying'>('birthdate');
  const [selectedCards, setSelectedCards] = useState<TarotCard[]>([]);
  const [userResponses, setUserResponses] = useState<string[]>([]);
  const [birthData, setBirthData] = useState<BirthData | null>(null);
  const [astroData, setAstroData] = useState<AstrologyData | null>(null);
  const [currentEnergySignature, setCurrentEnergySignature] = useState<any>(null);
  const [deepAnalysis, setDeepAnalysis] = useState<DeepAnalysis | null>(null);
  const [analysisIntensity, setAnalysisIntensity] = useState<number>(0.5);
  const [readingComplete, setReadingComplete] = useState<boolean>(false);
  const [finalReading, setFinalReading] = useState<string>(''); // Store the final reading for reference
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);

  // Set the daily gradient and preload images on initial app load
  useEffect(() => {
    // Set daily gradient
    const { colorStart, colorEnd } = getDailyGradient();
    document.documentElement.style.setProperty('--gradient-start', colorStart);
    document.documentElement.style.setProperty('--gradient-end', colorEnd);

    // Preload card images
    preloadCardImages();
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // IMMEDIATE background activation on app start
  useEffect(() => {
    console.log('🚀 ChatInterface mounted - IMMEDIATE background activation');
    if (onSignChange) {
      onSignChange('Sagittarius'); // Start with galactic center energy
    }
  }, [onSignChange]);

  // ENHANCED CONTINUOUS ANALYSIS - runs after every user response with IMMEDIATE background updates
  useEffect(() => {
    if (userResponses.length > 0) {
      console.log('🧠 PERFORMING ENHANCED DEEP ANALYSIS - Response count:', userResponses.length);
      
      // Perform comprehensive analysis
      const analysis = performDeepAnalysis(userResponses, birthData, astroData, selectedCards);
      setDeepAnalysis(analysis);
      
      // Update analysis intensity based on depth
      const avgDepth = userResponses.reduce((acc, response) => {
        const metrics = analyzeResponseDepth(response);
        return acc + metrics.depth;
      }, 0) / userResponses.length;
      
      setAnalysisIntensity(Math.min(avgDepth + 0.3, 1.0));
      
      // Generate energy update from analysis with IMMEDIATE background activation
      const energyUpdate = generateEnergyUpdate(analysis);
      console.log('⚡ ENHANCED ENERGY UPDATE:', energyUpdate);
      
      // FORCE IMMEDIATE background update with analyzed energy
      if (onSignChange) {
        console.log('🌟 FORCING IMMEDIATE analyzed energy activation:', energyUpdate.sign, 'at intensity:', energyUpdate.intensity);
        onSignChange(energyUpdate.sign);
        
        // Update current energy signature for display
        setCurrentEnergySignature({
          primarySign: energyUpdate.sign,
          intensity: energyUpdate.intensity,
          message: energyUpdate.message
        });
      }
      
      console.log('🔮 ENHANCED DEEP ANALYSIS COMPLETE:', {
        consciousnessLevel: analysis.psychologicalProfile.consciousnessLevel,
        evolutionaryStage: analysis.evolutionaryStage.currentLevel,
        synchronicityLevel: analysis.synchronicityLevel,
        energySignature: analysis.energeticSignature.primaryFrequency,
        backgroundActivated: energyUpdate.sign
      });
    }
  }, [userResponses, birthData, astroData, selectedCards, onSignChange]);

  // Update background when astro data changes - IMMEDIATE ACTIVATION
  useEffect(() => {
    if (astroData && onSignChange) {
      console.log('🔮 IMMEDIATE astrological energy activation:', astroData.sunSign);
      onSignChange(astroData.sunSign);
    }
  }, [astroData, onSignChange]);

  // Update background when cards change - IMMEDIATE ACTIVATION
  useEffect(() => {
    if (selectedCards.length > 0 && onCardsChange) {
      console.log('🃏 IMMEDIATE card energies activation:', selectedCards.map(c => c.name));
      onCardsChange(selectedCards);
      
      // Also update background based on primary card energy
      if (onSignChange && selectedCards[0]) {
        const cardEnergy = getCardAstrologicalSign(selectedCards[0].name);
        if (cardEnergy) {
          console.log('🎴 IMMEDIATE card-based background activation:', cardEnergy);
          onSignChange(cardEnergy);
        }
      }
    }
  }, [selectedCards, onCardsChange, onSignChange]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const addMysticMessage = (content: string, type: 'mystic' | 'analysis' | 'astrology' | 'deep-analysis' | 'clarifying-response' = 'mystic', astroData?: AstrologyData, deepAnalysis?: DeepAnalysis) => {
    setIsTyping(true);
    
    // Analyze the mystic response for energy too with IMMEDIATE background activation
    const responseEnergy = analyzeTextEnergy(content);
    console.log('🔮 Mystic response energy detected:', responseEnergy);
    
    // Short delay to allow the "isTyping" indicator to appear briefly before animation starts
    setTimeout(() => {
      const newMessage: Message = {
        id: Date.now().toString(),
        type,
        content,
        timestamp: new Date(),
        astroData,
        energySignature: responseEnergy,
        deepAnalysis: deepAnalysis
      };
      setMessages(prev => [...prev, newMessage]);
      setIsTyping(false);
      
      // FORCE IMMEDIATE background update based on mystic response energy
      if (responseEnergy.intensity > 0.1 && onSignChange) {
        console.log('🌟 FORCING IMMEDIATE mystic energy background activation:', responseEnergy.primarySign);
        onSignChange(responseEnergy.primarySign);
      }
    }, 500); // Reduced delay from ~2s to 0.5s
  };

  const handleBirthdateSubmit = (birthInfo: BirthData) => {
    setBirthData(birthInfo);
    
    // Calculate evolutionary astrology
    const astrology = calculateEvolutionaryAstrology(birthInfo);
    setAstroData(astrology);

    // IMMEDIATELY activate the astrological background
    if (onSignChange) {
      console.log('🎯 IMMEDIATE birth chart activation:', astrology.sunSign);
      onSignChange(astrology.sunSign);
    }

    // Add welcome message with astrological context and enhanced AI
    const welcomeMessage = `Welcome, ${astrology.sunSign} soul! I'm immediately picking up your ${astrology.sunSign} Sun, ${astrology.moonSign} Moon, and ${astrology.risingSign} Rising energy...

Your cosmic blueprint shows ${astrology.evolutionaryTheme.split(' - ')[0].toLowerCase()} as your primary evolutionary theme, and with ${astrology.galacticAlignment.toLowerCase()}, you're here for some serious consciousness work.

The current cosmic weather - ${astrology.currentTransits[0].toLowerCase()} - is literally designed to support exactly what you're going through right now.

${generateEnhancedInitialQuestion()}`;

    addMysticMessage(welcomeMessage, 'astrology', astrology);
    setCurrentStep('initial');
  };

  const generateClarifyingResponse = (userQuestion: string, cards: TarotCard[], analysis: DeepAnalysis | null, finalReadingText: string): string => {
    const questionLower = userQuestion.toLowerCase();
    
    console.log('🤔 GENERATING CLARIFYING RESPONSE FOR:', userQuestion);
    
    // Analyze what they're asking about
    if (questionLower.includes('card') || questionLower.includes(cards[0]?.name.toLowerCase()) || questionLower.includes(cards[1]?.name.toLowerCase()) || questionLower.includes(cards[2]?.name.toLowerCase())) {
      // They're asking about a specific card
      const cardName = cards.find(card => questionLower.includes(card.name.toLowerCase()))?.name || cards[1].name;
      const card = cards.find(c => c.name === cardName) || cards[1];
      
      return `About the ${card.name} - this card chose you because ${card.keywords[0]} energy is exactly what you need right now. In your specific situation, this means trusting your ${card.keywords[0]} instincts rather than overthinking. 

The ${card.name} often appears when we need to stop second-guessing ourselves and just move forward with what feels authentic. What part of your situation would benefit from more ${card.keywords[0]} energy?`;
    }
    
    if (questionLower.includes('what') && (questionLower.includes('do') || questionLower.includes('should'))) {
      // They're asking what to do
      return `Based on your reading, the main thing is to trust your ${cards[1].keywords[0]} instincts. Your cards aren't telling you what to do - they're reflecting what you already know deep down.

The ${cards[2].name} as your guidance card suggests approaching this with ${cards[2].keywords[0]} energy. Instead of forcing an outcome, what would it look like to embody this energy and let things unfold naturally?

What feels most authentic to who you are in this situation?`;
    }
    
    if (questionLower.includes('why') || questionLower.includes('mean')) {
      // They want deeper meaning
      return `The deeper meaning here is about your soul's evolution. Your ${cards[0].name} shows you have the foundation of ${cards[0].keywords[0]} energy already built within you. The ${cards[1].name} is activating this in your current situation.

This isn't just about solving a problem - it's about you stepping into a new level of authenticity and self-trust. Your situation is actually your soul's chosen classroom for developing ${cards[1].keywords[0]} mastery.

What part of this resonates most with what you're experiencing?`;
    }
    
    if (questionLower.includes('how') || questionLower.includes('when')) {
      // They want practical guidance
      return `Practically speaking, start by embodying the ${cards[1].keywords[0]} energy in small ways. Ask yourself throughout the day: "How would someone with strong ${cards[1].keywords[0]} energy handle this?"

The timing isn't about waiting for the perfect moment - it's about trusting yourself enough to take aligned action. Your ${cards[2].name} guidance suggests the path will become clear as you move forward with ${cards[2].keywords[0]} intention.

What's one small step you could take today that would feel authentic to who you are?`;
    }
    
    if (questionLower.includes('relationship') || questionLower.includes('love') || questionLower.includes('partner')) {
      // Relationship clarification
      return `For relationships, your cards are saying trust your gut feelings about this person. The ${cards[1].name} often appears when we need to stop analyzing and start feeling into what's actually true.

Your ${cards[0].name} foundation gives you the ${cards[0].keywords[0]} strength to be authentic in relationships. Don't dim your light to make someone else comfortable.

What is your intuition telling you about this relationship that your mind keeps trying to talk you out of?`;
    }
    
    // General clarification
    return `Looking at your reading again, the main message is about trusting yourself more deeply. Your ${cards[1].name} in the present position is asking you to stop seeking external validation and start honoring your inner knowing.

The situation you're dealing with is actually perfect for developing this self-trust. Every challenge is your soul's way of strengthening your authentic power.

What part of your reading felt most true to you? That's usually where the real guidance is.`;
  };

  const handleSendMessage = () => {
    if (!currentInput.trim()) return;

    // ENHANCED ANALYSIS of user input IMMEDIATELY with background activation
    const inputMetrics = analyzeResponseDepth(currentInput);
    const inputEnergy = analyzeTextEnergy(currentInput);
    
    console.log('💬 ENHANCED INPUT ANALYSIS:', {
      metrics: inputMetrics,
      energy: inputEnergy,
      analysisIntensity: analysisIntensity,
      currentStep: currentStep
    });

    // Add user message with comprehensive analysis
    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: currentInput,
      timestamp: new Date(),
      energySignature: inputEnergy,
      responseMetrics: inputMetrics
    };
    setMessages(prev => [...prev, userMessage]);
    setUserResponses(prev => [...prev, currentInput]);

    // FORCE IMMEDIATE background update based on analyzed energy
    if (inputEnergy.intensity > 0.05 && onSignChange) {
      console.log('⚡ FORCING IMMEDIATE analyzed energy background activation:', inputEnergy.primarySign);
      onSignChange(inputEnergy.primarySign);
    }

    // Process response based on current step with ENHANCED SITUATIONAL AI
    if (currentStep === 'initial') {
      // After first response, show card selection with RELEVANT analysis
      setTimeout(() => {
        const cardMessage: Message = {
          id: (Date.now() + 1).toString(),
          type: 'card-selection',
          content: `I can feel the ${inputEnergy.primarySign} energy in your response... your soul is ready for some real clarity.

Your ${astroData?.sunSign} Sun is resonating at ${Math.round(inputMetrics.depth * 100)}% depth and ${Math.round(inputMetrics.authenticity * 100)}% authenticity - this tells me you're ready for truth, not just comfort.

Time to let three cards choose you. Your ${astroData?.moonSign} Moon knows exactly which ones are meant for your situation. Trust that first instinct - your ${astroData?.risingSign} Rising is your cosmic antenna.`,
          timestamp: new Date()
        };
        setMessages(prev => [...prev, cardMessage]);
        setCurrentStep('cards');
      }, 1000);
    } else if (currentStep === 'deeper') {
      // Generate enhanced deeper insight with SITUATIONAL analysis
      if (deepAnalysis) {
        const followUp = generateEnhancedFollowUpQuestion(selectedCards, userResponses, deepAnalysis);
        const astroContext = astroData ? `Your ${astroData.northNode.split(' - ')[0]} North Node is asking: ${followUp}` : followUp;
        addMysticMessage(astroContext, 'deep-analysis', astroData || undefined, deepAnalysis || undefined);
      }
      setCurrentStep('final');
    } else if (currentStep === 'final') {
      // Generate ENHANCED final reading with COMPLETE SITUATIONAL analysis
      setTimeout(() => {
        const enhancedInsight = generateEnhancedInsight(selectedCards, [...userResponses, currentInput], birthData, astroData);
        setFinalReading(enhancedInsight); // Store the final reading
        addMysticMessage(enhancedInsight, 'analysis', astroData || undefined, deepAnalysis || undefined);
        
        // Mark reading as complete and switch to clarifying mode
        setReadingComplete(true);
        setCurrentStep('clarifying');
      }, 2000);
    } else if (currentStep === 'clarifying') {
      // USER ASKS CLARIFYING QUESTIONS - AI responds to their questions about the reading
      setTimeout(() => {
        const clarifyingResponse = generateClarifyingResponse(currentInput, selectedCards, deepAnalysis, finalReading);
        addMysticMessage(clarifyingResponse, 'clarifying-response', astroData || undefined, deepAnalysis || undefined);
      }, 1500);
    }

    setCurrentInput('');
  };

  const handleCardsSelected = (cards: TarotCard[]) => {
    setSelectedCards(cards);
    
    // IMMEDIATELY activate card energies AND background
    if (onCardsChange) {
      console.log('🎴 IMMEDIATE card activation:', cards.map(c => c.name));
      onCardsChange(cards);
    }
    
    // FORCE IMMEDIATE background activation based on primary card
    if (onSignChange && cards[0]) {
      const cardSign = getCardAstrologicalSign(cards[0].name);
      if (cardSign) {
        console.log('🃏 FORCING IMMEDIATE card-based background activation:', cardSign);
        onSignChange(cardSign);
      }
    }
    
    // Add cards to chat with enhanced astrological context
    const cardMessage: Message = {
      id: Date.now().toString(),
      type: 'mystic',
      content: `Perfect... ${cards.map(c => c.name).join(', ')} chose you. Your ${astroData?.sunSign} energy is in complete resonance with these frequencies.

${cards[0].name} is reflecting your ${astroData?.southNode.split(' - ')[0]} karmic mastery... ${cards[1].name} is illuminating your current ${astroData?.evolutionaryTheme.split(' - ')[0].toLowerCase()} process... and ${cards[2].name} is pointing toward your ${astroData?.northNode.split(' - ')[0]} soul growth edge.

The synchronicity level is already off the charts - these cards are speaking directly to your situation.`,
      timestamp: new Date(),
      cards
    };
    setMessages(prev => [...prev, cardMessage]);

    // Generate ENHANCED SITUATIONAL analysis of cards
    setTimeout(() => {
      // Perform analysis with cards included
      const cardsAnalysis = performDeepAnalysis(userResponses, birthData, astroData, cards);
      
      // Generate energy update and FORCE background activation
      const energyUpdate = generateEnergyUpdate(cardsAnalysis);
      if (onSignChange) {
        console.log('🌟 FORCING card analysis background activation:', energyUpdate.sign);
        onSignChange(energyUpdate.sign);
      }
      
      const cardAnalysis = `The cosmic conversation between your cards and your actual situation is incredible...

**SITUATIONAL CARD ANALYSIS:**

${cards[0].name} + your ${astroData?.southNode.split(' - ')[0]} past mastery = This ${cards[0].keywords[0]} energy is exactly what you've been drawing from to handle your current situation. Your soul already knows how to navigate this.

${cards[1].name} + your present reality = The ${cards[1].keywords[0]} frequency is what's needed RIGHT NOW for what you're going through. This isn't random - this card is speaking directly to your current experience.

${cards[2].name} + your ${astroData?.northNode.split(' - ')[0]} growth edge = This ${cards[2].keywords[0]} energy is your path forward. Instead of trying to control how things unfold, what if you approached your situation with complete ${cards[2].keywords[0]} trust?

**CONSCIOUSNESS ACTIVATION: ${Math.round(cardsAnalysis.psychologicalProfile.consciousnessLevel * 100)}%**
**SYNCHRONICITY LEVEL: ${Math.round(cardsAnalysis.synchronicityLevel * 100)}%**

Your ${astroData?.moonSign} Moon is asking: When you look at these three cards and think about your actual situation - what's the first insight that hits you? What do these symbols make you realize about what you're really dealing with?`;
      
      addMysticMessage(cardAnalysis, 'deep-analysis', astroData || undefined, cardsAnalysis || undefined);
      setCurrentStep('deeper');
    }, 3000);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  // Helper function to get astrological sign from card
  const getCardAstrologicalSign = (cardName: string): string | null => {
    const correspondences: { [key: string]: string } = {
      'The Fool': 'Aquarius',
      'The Magician': 'Gemini',
      'The High Priestess': 'Cancer',
      'The Empress': 'Taurus',
      'The Emperor': 'Aries',
      'The Hierophant': 'Taurus',
      'The Lovers': 'Gemini',
      'The Chariot': 'Cancer',
      'Strength': 'Leo',
      'The Hermit': 'Virgo',
      'Wheel of Fortune': 'Sagittarius',
      'Justice': 'Libra',
      'The Hanged Man': 'Pisces',
      'Death': 'Scorpio',
      'Temperance': 'Sagittarius',
      'The Devil': 'Capricorn',
      'The Tower': 'Aries',
      'The Star': 'Aquarius',
      'The Moon': 'Pisces',
      'The Sun': 'Leo',
      'Judgement': 'Scorpio',
      'The World': 'Capricorn'
    };
    return correspondences[cardName] || null;
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* Enhanced Header with Analysis Display */}
      <div className="p-6 text-center border-b border-cosmic-700/30">
        <div className="flex items-center justify-center space-x-2 mb-2">
          <Star className="w-6 h-6 text-cosmic-400 animate-pulse" />
          <h1 className="text-[55px] font-bold bg-gradient-to-r from-cosmic-800 to-aurora-800 bg-clip-text text-transparent leading-tight">
            {currentStep === 'clarifying' ? 'Ask Questions About Your Reading' : 'AstroScan'}
          </h1>
          {currentStep === 'clarifying' ? (
            <MessageCircle className="w-6 h-6 text-green-400 animate-pulse" />
          ) : (
            <Brain className="w-6 h-6 text-aurora-400 animate-pulse" />
          )}
        </div>
        
        {astroData && (
          <div className="mt-2 text-xs text-cosmic-400">
            {astroData.sunSign} ☉ • {astroData.moonSign} ☽ • {astroData.risingSign} ↗
          </div>
        )}
        
        {/* Enhanced Analysis Intensity Indicator */}
        {deepAnalysis && (
          <div className="mt-3 flex items-center justify-center space-x-4 text-xs">
            <div className="flex items-center space-x-1">
              <Zap className="w-3 h-3 text-aurora-400" />
              <span className="text-cosmic-300">Consciousness: {Math.round(deepAnalysis.psychologicalProfile.consciousnessLevel * 100)}%</span>
            </div>
            <div className="flex items-center space-x-1">
              <Brain className="w-3 h-3 text-cosmic-400" />
              <span className="text-cosmic-300">Analysis: {Math.round(analysisIntensity * 100)}%</span>
            </div>
            <div className="flex items-center space-x-1">
              <Sparkles className="w-3 h-3 text-aurora-400" />
              <span className="text-cosmic-300">Sync: {Math.round(deepAnalysis.synchronicityLevel * 100)}%</span>
            </div>
            {readingComplete && (
              <div className="flex items-center space-x-1">
                <MessageCircle className="w-3 h-3 text-green-400" />
                <span className="text-green-300">Q&A Mode</span>
              </div>
            )}
          </div>
        )}
        
        {/* Show current active energy signature */}
        {currentEnergySignature && (
          <div className="mt-2 text-xs text-cosmic-300">
            <span className="opacity-60">Active energy: </span>
            <span className="text-aurora-400 font-semibold">{currentEnergySignature.primarySign}</span>
            <span className="opacity-60"> • {Math.round(currentEnergySignature.intensity * 100)}% intensity</span>
          </div>
        )}
      </div>

      {/* Messages */}
      <div 
        ref={chatContainerRef}
        className="flex-1 overflow-y-auto p-6 space-y-6"
      >
        {currentStep === 'birthdate' && (
          <div className="flex justify-center">
            <BirthdateInput onBirthdateSubmit={handleBirthdateSubmit} />
          </div>
        )}

        {messages.map((message, index) => (
          <div
            key={message.id}
            className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            {message.type === 'card-selection' ? (
              <div className="w-full max-w-2xl mx-auto">
                <div className="glass-effect rounded-2xl p-6 text-center mb-4">
                  <p className="text-cosmic-200 mb-6 whitespace-pre-line">{message.content}</p>
                  <CardPile onCardsSelected={handleCardsSelected} />
                </div>
              </div>
            ) : (
              <div
                className={`max-w-md rounded-2xl p-4 ${
                  message.type === 'user'
                    ? 'bg-cosmic-600 text-white ml-auto'
                    : message.type === 'analysis'
                    ? 'glass-effect border border-aurora-400/30'
                    : message.type === 'deep-analysis'
                    ? 'glass-effect border border-cosmic-400/50 bg-cosmic-900/20'
                    : message.type === 'clarifying-response'
                    ? 'glass-effect border border-green-400/30 bg-green-900/10'
                    : message.type === 'astrology'
                    ? 'glass-effect border border-cosmic-400/30'
                    : 'glass-effect'
                }`}
              >
                {message.type === 'analysis' && (
                  <div className="flex items-center mb-3">
                    <Sparkles className="w-4 h-4 text-aurora-400 mr-2" />
                    <span className="text-sm text-aurora-400 font-semibold">Complete Reading</span>
                  </div>
                )}

                {message.type === 'deep-analysis' && (
                  <div className="flex items-center mb-3">
                    <Brain className="w-4 h-4 text-cosmic-400 mr-2 animate-pulse" />
                    <span className="text-sm text-cosmic-400 font-semibold">Deep Situational Analysis</span>
                    {message.deepAnalysis && (
                      <div className="ml-auto text-xs text-cosmic-500">
                        {Math.round(message.deepAnalysis.synchronicityLevel * 100)}% sync
                      </div>
                    )}
                  </div>
                )}

                {message.type === 'clarifying-response' && (
                  <div className="flex items-center mb-3">
                    <MessageCircle className="w-4 h-4 text-green-400 mr-2" />
                    <span className="text-sm text-green-400 font-semibold">Reading Clarification</span>
                  </div>
                )}

                {message.type === 'astrology' && (
                  <div className="flex items-center mb-3">
                    <Star className="w-4 h-4 text-cosmic-400 mr-2" />
                    <span className="text-sm text-cosmic-400 font-semibold">Cosmic Blueprint</span>
                  </div>
                )}

                {/* Enhanced response metrics for user messages */}
                {message.type === 'user' && message.responseMetrics && (
                  <div className="flex items-center mb-2 text-xs opacity-70 space-x-3">
                    <div className="flex items-center">
                      <div className="w-2 h-2 rounded-full bg-aurora-400 mr-1"></div>
                      <span>Depth: {Math.round(message.responseMetrics.depth * 100)}%</span>
                    </div>
                    <div className="flex items-center">
                      <div className="w-2 h-2 rounded-full bg-cosmic-400 mr-1"></div>
                      <span>Auth: {Math.round(message.responseMetrics.authenticity * 100)}%</span>
                    </div>
                    {message.responseMetrics.themes.length > 0 && (
                      <div className="text-cosmic-300">
                        Themes: {message.responseMetrics.themes.slice(0, 2).join(', ')}
                      </div>
                    )}
                  </div>
                )}

                {/* Enhanced energy signature display */}
                {message.energySignature && message.energySignature.intensity > 0.2 && (
                  <div className="flex items-center mb-2 text-xs opacity-70">
                    <div className="w-2 h-2 rounded-full bg-aurora-400 mr-2 animate-pulse"></div>
                    <span>{message.energySignature.primarySign} energy detected</span>
                    {message.energySignature.secondarySign && (
                      <span className="ml-1 opacity-50">• {message.energySignature.secondarySign}</span>
                    )}
                  </div>
                )}
                
                <p className="text-cosmic-100 leading-relaxed whitespace-pre-line">
                  {['mystic', 'analysis', 'astrology', 'deep-analysis', 'clarifying-response'].includes(message.type) && index === messages.length - 1 ? (
                    <TypeAnimation
                      sequence={[message.content]}
                      wrapper="span"
                      speed={99}
                      cursor={true}
                      repeat={0}
                      style={{ display: 'inline-block' }}
                    />
                  ) : (
                    message.content
                  )}
                </p>
                
                {message.cards && (
                  <div className="flex space-x-2 mt-4 justify-center">
                    {message.cards.map((card, index) => (
                      <div key={index} className="w-16 h-24 rounded-lg overflow-hidden mystical-shadow border border-aurora-400/50 relative">
                        {(card as any).image ? (
                          <>
                            <img 
                              src={(card as any).image} 
                              alt={card.name}
                              className="w-full h-full object-cover"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent 
                                           flex flex-col justify-end p-1">
                              <p className="text-xs text-white font-semibold leading-tight">{card.name}</p>
                            </div>
                          </>
                        ) : (
                          <div className="w-full h-full bg-gradient-to-b from-cosmic-600 to-aurora-600 p-2 text-center flex flex-col justify-between">
                            <p className="text-xs text-white font-semibold leading-tight">{card.name}</p>
                            <p className="text-xs text-cosmic-200">{card.keywords[0]}</p>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
                
                <div className="text-xs text-cosmic-400 mt-2">
                  {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </div>
              </div>
            )}
          </div>
        ))}

        {isTyping && (
          <div className="flex justify-start">
            <div className="glass-effect rounded-2xl p-4 max-w-md">
              <div className="flex items-center space-x-2">
                {currentStep === 'clarifying' ? (
                  <MessageCircle className="w-4 h-4 text-green-400 animate-pulse" />
                ) : (
                  <Brain className="w-4 h-4 text-cosmic-400 animate-pulse" />
                )}
                <span className="text-xs text-cosmic-300">
                  {currentStep === 'clarifying' ? 'Clarifying your reading...' : 'Analyzing your situation...'}
                </span>
              </div>
              <div className="flex space-x-1 mt-2">
                <div className="w-2 h-2 bg-cosmic-400 rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-cosmic-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                <div className="w-2 h-2 bg-cosmic-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Enhanced Input */}
      {currentStep !== 'birthdate' && (
        <div className="p-6 border-t border-cosmic-700/30">
          <div className="flex space-x-4">
            <textarea
              value={currentInput}
              onChange={(e) => setCurrentInput(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder={
                currentStep === 'clarifying' 
                  ? "Ask questions about your reading - what would you like clarified?" 
                  : "share what's really going on in your situation..."
              }
              className="flex-1 bg-void-800 border border-cosmic-500 rounded-xl p-4 text-cosmic-100 
                       placeholder-cosmic-400 focus:border-aurora-400 focus:outline-none resize-none"
              rows={2}
            />
            <button
              onClick={handleSendMessage}
              disabled={!currentInput.trim()}
              className={`p-4 rounded-xl hover:scale-105 transition-all duration-300 
                       disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2 ${
                currentStep === 'clarifying' 
                  ? 'bg-gradient-to-r from-green-600 to-green-500' 
                  : 'cosmic-gradient'
              }`}
            >
              {currentStep === 'clarifying' ? (
                <MessageCircle className="w-5 h-5" />
              ) : (
                <Send className="w-5 h-5" />
              )}
              {deepAnalysis && (
                <div className="text-xs">
                  {Math.round(analysisIntensity * 100)}%
                </div>
              )}
            </button>
          </div>
          
          {/* Enhanced analysis hint */}
          <div className="mt-2 text-xs text-cosmic-500 text-center">
            {currentStep === 'clarifying' 
              ? "Ask about specific cards, meanings, next steps, or anything you'd like clarified about your reading"
              : "The more specific you are about your actual situation, the more relevant the guidance becomes"
            }
          </div>
        </div>
      )}
    </div>
  );
};

export default ChatInterface;