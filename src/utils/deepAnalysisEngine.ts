import { TarotCard } from '../types';
import { BirthData } from '../components/BirthdateInput';
import { AstrologyData } from './evolutionaryAstrology';

export interface DeepAnalysis {
  psychologicalProfile: PsychologicalProfile;
  energeticSignature: EnergeticSignature;
  evolutionaryStage: EvolutionaryStage;
  currentChallenges: Challenge[];
  hiddenPatterns: Pattern[];
  soulPurpose: SoulPurpose;
  actionableInsights: ActionableInsight[];
  synchronicityLevel: number;
}

export interface PsychologicalProfile {
  dominantArchetype: string;
  shadowAspects: string[];
  consciousnessLevel: number;
  emotionalMaturity: number;
  mentalClarity: number;
  spiritualAwareness: number;
  integrationNeeded: string[];
}

export interface EnergeticSignature {
  primaryFrequency: string;
  secondaryFrequencies: string[];
  blockages: string[];
  flowStates: string[];
  chakraActivation: { [chakra: string]: number };
  auricField: string;
}

export interface EvolutionaryStage {
  currentLevel: string;
  nextEvolution: string;
  karmaticLessons: string[];
  soulAge: string;
  incarnationPurpose: string;
  readinessForChange: number;
}

export interface Challenge {
  type: 'emotional' | 'mental' | 'spiritual' | 'physical' | 'relational';
  description: string;
  rootCause: string;
  transformationPath: string;
  timeframe: string;
  intensity: number;
}

export interface Pattern {
  name: string;
  description: string;
  origin: string;
  manifestation: string[];
  breakingPoint: string;
  newPattern: string;
}

export interface SoulPurpose {
  primaryMission: string;
  secondaryMissions: string[];
  gifts: string[];
  servicePath: string;
  creativeExpression: string;
  relationshipLessons: string[];
}

export interface ActionableInsight {
  category: 'immediate' | 'short-term' | 'long-term' | 'spiritual';
  action: string;
  reasoning: string;
  expectedOutcome: string;
  timing: string;
  priority: number;
}

// Advanced linguistic analysis patterns
const CONSCIOUSNESS_INDICATORS = {
  'victim': ['can\'t', 'impossible', 'stuck', 'trapped', 'helpless', 'unfair', 'why me'],
  'survivor': ['trying', 'struggling', 'fighting', 'difficult', 'hard', 'managing'],
  'creator': ['choosing', 'creating', 'manifesting', 'intending', 'designing', 'building'],
  'transcendent': ['allowing', 'flowing', 'trusting', 'surrendering', 'being', 'witnessing']
};

const EMOTIONAL_MATURITY_MARKERS = {
  'reactive': ['angry', 'frustrated', 'upset', 'mad', 'hate', 'can\'t stand'],
  'responsive': ['feel', 'sense', 'notice', 'aware', 'understand', 'recognize'],
  'integrated': ['compassion', 'acceptance', 'peace', 'love', 'gratitude', 'joy'],
  'transcendent': ['oneness', 'unity', 'bliss', 'divine', 'sacred', 'infinite']
};

const SPIRITUAL_AWARENESS_LEVELS = {
  'material': ['money', 'success', 'achievement', 'status', 'possession', 'security'],
  'emotional': ['relationship', 'love', 'connection', 'family', 'friendship', 'belonging'],
  'mental': ['understanding', 'knowledge', 'learning', 'growth', 'wisdom', 'insight'],
  'spiritual': ['purpose', 'meaning', 'soul', 'divine', 'universe', 'consciousness'],
  'cosmic': ['galactic', 'multidimensional', 'quantum', 'infinite', 'eternal', 'source']
};

// Helper functions - moved to top to be available before use
const analyzeChakraActivation = (text: string, keywords: string[]): number => {
  const matches = keywords.filter(keyword => text.includes(keyword)).length;
  return Math.min(matches * 0.2 + 0.3, 1.0);
};

const identifyShadowAspects = (text: string, archetype: string): string[] => {
  const shadowMap: { [key: string]: string[] } = {
    'Victim': ['Powerlessness', 'Blame', 'Helplessness'],
    'Warrior': ['Aggression', 'Impatience', 'Conflict'],
    'Creator': ['Perfectionism', 'Control', 'Ego'],
    'Sage': ['Detachment', 'Superiority', 'Isolation'],
    'Seeker': ['Restlessness', 'Dissatisfaction', 'Escapism']
  };
  return shadowMap[archetype] || ['Unknown patterns'];
};

const identifyIntegrationNeeded = (consciousness: number, emotional: number, spiritual: number): string[] => {
  const needs: string[] = [];
  if (consciousness < 0.6) needs.push('Consciousness expansion');
  if (emotional < 0.6) needs.push('Emotional healing');
  if (spiritual < 0.6) needs.push('Spiritual development');
  if (Math.abs(consciousness - emotional) > 0.3) needs.push('Mind-heart integration');
  if (Math.abs(spiritual - consciousness) > 0.3) needs.push('Spiritual-mental alignment');
  return needs;
};

const getCardAstrologicalCorrespondence = (cardName: string): string | null => {
  // Simplified correspondence mapping
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

const extractRecurringThemes = (responses: string[]): string[] => {
  const themes = ['love', 'work', 'family', 'change', 'fear', 'growth', 'relationship', 'money', 'health', 'purpose'];
  const allText = responses.join(' ').toLowerCase();
  return themes.filter(theme => allText.includes(theme));
};

const identifyEnergeticBlockages = (text: string, chakras: { [key: string]: number }): string[] => {
  const blockages: string[] = [];
  Object.entries(chakras).forEach(([chakra, activation]) => {
    if (activation < 0.4) {
      blockages.push(`${chakra} chakra underactive`);
    }
  });
  return blockages;
};

const identifyFlowStates = (text: string, cards: TarotCard[]): string[] => {
  const flowIndicators = ['flow', 'ease', 'natural', 'effortless', 'smooth', 'harmony'];
  const flows: string[] = [];
  flowIndicators.forEach(indicator => {
    if (text.includes(indicator)) {
      flows.push(`${indicator} state detected`);
    }
  });
  return flows;
};

const determineAuricField = (chakras: { [key: string]: number }, astroData: AstrologyData | null): string => {
  const avgActivation = Object.values(chakras).reduce((acc, val) => acc + val, 0) / Object.values(chakras).length;
  if (avgActivation > 0.8) return 'Radiant and expansive';
  if (avgActivation > 0.6) return 'Balanced and clear';
  if (avgActivation > 0.4) return 'Developing and strengthening';
  return 'Contracted and healing';
};

const getNextEvolutionaryStep = (currentLevel: string, profile: PsychologicalProfile): string => {
  const evolutionMap: { [key: string]: string } = {
    'Awakening': 'Integration',
    'Integration': 'Service',
    'Service': 'Mastery',
    'Mastery': 'Transcendence'
  };
  return evolutionMap[currentLevel] || 'Continued growth';
};

const determineSoulAge = (profile: PsychologicalProfile, text: string): string => {
  const complexity = profile.spiritualAwareness + profile.consciousnessLevel;
  if (complexity > 1.6) return 'Old Soul';
  if (complexity > 1.2) return 'Mature Soul';
  if (complexity > 0.8) return 'Young Soul';
  return 'New Soul';
};

const calculateReadinessForChange = (text: string, profile: PsychologicalProfile): number => {
  const changeWords = ['ready', 'change', 'transform', 'new', 'different', 'evolve'];
  const matches = changeWords.filter(word => text.includes(word)).length;
  return Math.min((matches * 0.2) + (profile.consciousnessLevel * 0.5), 1.0);
};

const identifyNaturalGifts = (profile: PsychologicalProfile, cards: TarotCard[]): string[] => {
  const gifts: string[] = [];
  if (profile.spiritualAwareness > 0.7) gifts.push('Spiritual insight');
  if (profile.emotionalMaturity > 0.7) gifts.push('Emotional wisdom');
  if (profile.mentalClarity > 0.7) gifts.push('Mental clarity');
  if (profile.consciousnessLevel > 0.7) gifts.push('Conscious awareness');
  
  // Add gifts based on cards
  cards.forEach(card => {
    if (card.keywords.includes('creativity')) gifts.push('Creative expression');
    if (card.keywords.includes('healing')) gifts.push('Healing abilities');
    if (card.keywords.includes('wisdom')) gifts.push('Teaching wisdom');
  });
  
  return [...new Set(gifts)]; // Remove duplicates
};

const determineServicePath = (profile: PsychologicalProfile, astroData: AstrologyData | null): string => {
  if (profile.spiritualAwareness > 0.8) return 'Spiritual teaching and guidance';
  if (profile.emotionalMaturity > 0.8) return 'Emotional healing and support';
  if (profile.mentalClarity > 0.8) return 'Mental clarity and wisdom sharing';
  return astroData?.soulPurpose || 'Service through personal example';
};

const determineCreativeExpression = (cards: TarotCard[], profile: PsychologicalProfile): string => {
  const creativeCards = cards.filter(card => 
    card.keywords.some(keyword => 
      ['creativity', 'art', 'expression', 'beauty', 'inspiration'].includes(keyword)
    )
  );
  
  if (creativeCards.length > 0) return 'Artistic and creative expression';
  if (profile.spiritualAwareness > 0.7) return 'Spiritual and mystical expression';
  if (profile.emotionalMaturity > 0.7) return 'Emotional and relational expression';
  return 'Authentic self-expression';
};

export const performDeepAnalysis = (
  responses: string[],
  birthData: BirthData | null,
  astroData: AstrologyData | null,
  selectedCards: TarotCard[]
): DeepAnalysis => {
  
  const allText = responses.join(' ').toLowerCase();
  const words = allText.split(/\s+/);
  
  console.log('🧠 DEEP ANALYSIS INITIATED:', { 
    responseCount: responses.length, 
    wordCount: words.length,
    hasAstroData: !!astroData,
    cardCount: selectedCards.length 
  });

  // Analyze psychological profile
  const psychologicalProfile = analyzePsychologicalProfile(allText, words);
  
  // Analyze energetic signature
  const energeticSignature = analyzeEnergeticSignature(allText, astroData, selectedCards);
  
  // Analyze evolutionary stage
  const evolutionaryStage = analyzeEvolutionaryStage(allText, astroData, psychologicalProfile);
  
  // Identify current challenges
  const currentChallenges = identifyCurrentChallenges(responses, psychologicalProfile);
  
  // Detect hidden patterns
  const hiddenPatterns = detectHiddenPatterns(responses, astroData);
  
  // Determine soul purpose
  const soulPurpose = determineSoulPurpose(astroData, selectedCards, psychologicalProfile);
  
  // Generate actionable insights
  const actionableInsights = generateActionableInsights(
    psychologicalProfile, 
    evolutionaryStage, 
    currentChallenges,
    astroData
  );
  
  // Calculate synchronicity level
  const synchronicityLevel = calculateSynchronicityLevel(
    astroData, 
    selectedCards, 
    responses, 
    psychologicalProfile
  );

  const analysis: DeepAnalysis = {
    psychologicalProfile,
    energeticSignature,
    evolutionaryStage,
    currentChallenges,
    hiddenPatterns,
    soulPurpose,
    actionableInsights,
    synchronicityLevel
  };

  console.log('🔮 DEEP ANALYSIS COMPLETE:', analysis);
  
  return analysis;
};

const analyzePsychologicalProfile = (allText: string, words: string[]): PsychologicalProfile => {
  // Analyze consciousness level
  let consciousnessLevel = 0.5;
  let dominantArchetype = 'Seeker';
  
  Object.entries(CONSCIOUSNESS_INDICATORS).forEach(([level, indicators]) => {
    const matches = indicators.filter(indicator => allText.includes(indicator)).length;
    if (matches > 0) {
      switch (level) {
        case 'victim': consciousnessLevel = Math.max(consciousnessLevel, 0.2); dominantArchetype = 'Victim'; break;
        case 'survivor': consciousnessLevel = Math.max(consciousnessLevel, 0.4); dominantArchetype = 'Warrior'; break;
        case 'creator': consciousnessLevel = Math.max(consciousnessLevel, 0.7); dominantArchetype = 'Creator'; break;
        case 'transcendent': consciousnessLevel = Math.max(consciousnessLevel, 0.9); dominantArchetype = 'Sage'; break;
      }
    }
  });

  // Analyze emotional maturity
  let emotionalMaturity = 0.5;
  Object.entries(EMOTIONAL_MATURITY_MARKERS).forEach(([level, markers]) => {
    const matches = markers.filter(marker => allText.includes(marker)).length;
    if (matches > 0) {
      switch (level) {
        case 'reactive': emotionalMaturity = Math.max(emotionalMaturity, 0.3); break;
        case 'responsive': emotionalMaturity = Math.max(emotionalMaturity, 0.6); break;
        case 'integrated': emotionalMaturity = Math.max(emotionalMaturity, 0.8); break;
        case 'transcendent': emotionalMaturity = Math.max(emotionalMaturity, 0.95); break;
      }
    }
  });

  // Analyze spiritual awareness
  let spiritualAwareness = 0.5;
  Object.entries(SPIRITUAL_AWARENESS_LEVELS).forEach(([level, concepts]) => {
    const matches = concepts.filter(concept => allText.includes(concept)).length;
    if (matches > 0) {
      switch (level) {
        case 'material': spiritualAwareness = Math.max(spiritualAwareness, 0.2); break;
        case 'emotional': spiritualAwareness = Math.max(spiritualAwareness, 0.4); break;
        case 'mental': spiritualAwareness = Math.max(spiritualAwareness, 0.6); break;
        case 'spiritual': spiritualAwareness = Math.max(spiritualAwareness, 0.8); break;
        case 'cosmic': spiritualAwareness = Math.max(spiritualAwareness, 0.95); break;
      }
    }
  });

  // Calculate mental clarity based on sentence structure and coherence
  const sentences = allText.split(/[.!?]+/).filter(s => s.trim().length > 0);
  const avgSentenceLength = sentences.reduce((acc, s) => acc + s.split(' ').length, 0) / sentences.length;
  const mentalClarity = Math.min(Math.max((avgSentenceLength - 5) / 15, 0.3), 0.9);

  // Identify shadow aspects and integration needs
  const shadowAspects = identifyShadowAspects(allText, dominantArchetype);
  const integrationNeeded = identifyIntegrationNeeded(consciousnessLevel, emotionalMaturity, spiritualAwareness);

  return {
    dominantArchetype,
    shadowAspects,
    consciousnessLevel,
    emotionalMaturity,
    mentalClarity,
    spiritualAwareness,
    integrationNeeded
  };
};

const analyzeEnergeticSignature = (
  allText: string, 
  astroData: AstrologyData | null, 
  selectedCards: TarotCard[]
): EnergeticSignature => {
  
  // Analyze chakra activation based on themes
  const chakraActivation = {
    'Root': analyzeChakraActivation(allText, ['security', 'survival', 'grounding', 'stability', 'fear']),
    'Sacral': analyzeChakraActivation(allText, ['creativity', 'sexuality', 'pleasure', 'emotion', 'flow']),
    'Solar': analyzeChakraActivation(allText, ['power', 'confidence', 'will', 'control', 'identity']),
    'Heart': analyzeChakraActivation(allText, ['love', 'compassion', 'connection', 'healing', 'forgiveness']),
    'Throat': analyzeChakraActivation(allText, ['communication', 'truth', 'expression', 'voice', 'speaking']),
    'Third Eye': analyzeChakraActivation(allText, ['intuition', 'vision', 'insight', 'psychic', 'seeing']),
    'Crown': analyzeChakraActivation(allText, ['spiritual', 'divine', 'consciousness', 'enlightenment', 'unity'])
  };

  // Determine primary frequency based on astrological data and text analysis
  const primaryFrequency = astroData?.sunSign || 'Sagittarius';
  
  // Identify secondary frequencies from cards and text
  const secondaryFrequencies = selectedCards.map(card => 
    getCardAstrologicalCorrespondence(card.name)
  ).filter(Boolean);

  // Identify energetic blockages
  const blockages = identifyEnergeticBlockages(allText, chakraActivation);
  
  // Identify flow states
  const flowStates = identifyFlowStates(allText, selectedCards);

  // Determine auric field quality
  const auricField = determineAuricField(chakraActivation, astroData);

  return {
    primaryFrequency,
    secondaryFrequencies,
    blockages,
    flowStates,
    chakraActivation,
    auricField
  };
};

const analyzeEvolutionaryStage = (
  allText: string, 
  astroData: AstrologyData | null, 
  psychProfile: PsychologicalProfile
): EvolutionaryStage => {
  
  // Determine current evolutionary level
  let currentLevel = 'Awakening';
  if (psychProfile.consciousnessLevel > 0.8) currentLevel = 'Integration';
  if (psychProfile.spiritualAwareness > 0.8) currentLevel = 'Service';
  if (psychProfile.consciousnessLevel > 0.9 && psychProfile.spiritualAwareness > 0.9) currentLevel = 'Mastery';

  // Determine next evolution
  const nextEvolution = getNextEvolutionaryStep(currentLevel, psychProfile);

  // Extract karmatic lessons from astrological data
  const karmaticLessons = astroData?.karmaticPatterns || ['Self-awareness', 'Compassion', 'Authenticity'];

  // Determine soul age based on complexity of responses and awareness
  const soulAge = determineSoulAge(psychProfile, allText);

  // Determine incarnation purpose
  const incarnationPurpose = astroData?.soulPurpose || 'Learning and growth through experience';

  // Calculate readiness for change
  const readinessForChange = calculateReadinessForChange(allText, psychProfile);

  return {
    currentLevel,
    nextEvolution,
    karmaticLessons,
    soulAge,
    incarnationPurpose,
    readinessForChange
  };
};

const identifyCurrentChallenges = (responses: string[], psychProfile: PsychologicalProfile): Challenge[] => {
  const challenges: Challenge[] = [];
  const allText = responses.join(' ').toLowerCase();

  // Emotional challenges
  if (psychProfile.emotionalMaturity < 0.6) {
    challenges.push({
      type: 'emotional',
      description: 'Emotional reactivity and regulation',
      rootCause: 'Unprocessed emotional patterns from past experiences',
      transformationPath: 'Mindfulness practice and emotional awareness development',
      timeframe: '3-6 months',
      intensity: 1 - psychProfile.emotionalMaturity
    });
  }

  // Mental challenges
  if (psychProfile.mentalClarity < 0.6) {
    challenges.push({
      type: 'mental',
      description: 'Mental clarity and decision-making',
      rootCause: 'Overthinking and mental confusion',
      transformationPath: 'Meditation and mental discipline practices',
      timeframe: '2-4 months',
      intensity: 1 - psychProfile.mentalClarity
    });
  }

  // Spiritual challenges
  if (psychProfile.spiritualAwareness < 0.5) {
    challenges.push({
      type: 'spiritual',
      description: 'Spiritual disconnection and purpose confusion',
      rootCause: 'Lack of spiritual practice and inner connection',
      transformationPath: 'Spiritual exploration and practice development',
      timeframe: '6-12 months',
      intensity: 1 - psychProfile.spiritualAwareness
    });
  }

  // Relational challenges (detected from text patterns)
  if (allText.includes('relationship') || allText.includes('people') || allText.includes('family')) {
    challenges.push({
      type: 'relational',
      description: 'Relationship dynamics and boundaries',
      rootCause: 'Unclear boundaries and communication patterns',
      transformationPath: 'Conscious communication and boundary setting',
      timeframe: '4-8 months',
      intensity: 0.6
    });
  }

  return challenges.slice(0, 3); // Top 3 challenges
};

const detectHiddenPatterns = (responses: string[], astroData: AstrologyData | null): Pattern[] => {
  const patterns: Pattern[] = [];
  const allText = responses.join(' ').toLowerCase();

  // Detect recurring themes
  const themes = extractRecurringThemes(responses);
  
  themes.forEach(theme => {
    patterns.push({
      name: `${theme} Pattern`,
      description: `Recurring focus on ${theme} indicates a core life theme`,
      origin: 'Soul-level programming and past-life experiences',
      manifestation: [`Repeated ${theme} situations`, `Strong emotional charge around ${theme}`],
      breakingPoint: `Conscious awareness and choice around ${theme}`,
      newPattern: `Mastery and wisdom in ${theme} area`
    });
  });

  // Add astrological patterns
  if (astroData) {
    patterns.push({
      name: 'Karmatic Pattern',
      description: astroData.karmaticPatterns[0] || 'Core karmatic lesson',
      origin: 'Past-life experiences and soul contracts',
      manifestation: ['Repetitive life situations', 'Emotional triggers', 'Relationship patterns'],
      breakingPoint: 'Conscious choice and new responses',
      newPattern: astroData.currentLessons[0] || 'Evolved consciousness'
    });
  }

  return patterns.slice(0, 3);
};

const determineSoulPurpose = (
  astroData: AstrologyData | null,
  selectedCards: TarotCard[],
  psychProfile: PsychologicalProfile
): SoulPurpose => {
  
  const primaryMission = astroData?.soulPurpose || 'Awakening consciousness and serving others';
  
  const secondaryMissions = [
    'Healing ancestral patterns',
    'Creative expression and inspiration',
    'Teaching through example'
  ];

  const gifts = identifyNaturalGifts(psychProfile, selectedCards);
  
  const servicePath = determineServicePath(psychProfile, astroData);
  
  const creativeExpression = determineCreativeExpression(selectedCards, psychProfile);
  
  const relationshipLessons = astroData?.currentLessons || ['Authentic communication', 'Healthy boundaries'];

  return {
    primaryMission,
    secondaryMissions,
    gifts,
    servicePath,
    creativeExpression,
    relationshipLessons
  };
};

const generateActionableInsights = (
  psychProfile: PsychologicalProfile,
  evolutionaryStage: EvolutionaryStage,
  challenges: Challenge[],
  astroData: AstrologyData | null
): ActionableInsight[] => {
  
  const insights: ActionableInsight[] = [];

  // Immediate actions
  insights.push({
    category: 'immediate',
    action: 'Begin daily 10-minute mindfulness practice',
    reasoning: 'Increases present-moment awareness and emotional regulation',
    expectedOutcome: 'Greater clarity and emotional stability within 2 weeks',
    timing: 'Start today',
    priority: 1
  });

  // Short-term actions based on challenges
  challenges.forEach((challenge, index) => {
    insights.push({
      category: 'short-term',
      action: challenge.transformationPath,
      reasoning: `Addresses core ${challenge.type} challenge: ${challenge.description}`,
      expectedOutcome: `Significant improvement in ${challenge.type} well-being`,
      timing: challenge.timeframe,
      priority: challenge.intensity
    });
  });

  // Long-term spiritual development
  insights.push({
    category: 'long-term',
    action: 'Develop consistent spiritual practice aligned with your path',
    reasoning: `Your evolutionary stage (${evolutionaryStage.currentLevel}) is ready for deeper spiritual work`,
    expectedOutcome: 'Accelerated spiritual growth and purpose clarity',
    timing: '6-12 months',
    priority: 0.8
  });

  // Astrological timing
  if (astroData) {
    insights.push({
      category: 'spiritual',
      action: `Work with your ${astroData.northNode.split(' - ')[0]} North Node energy`,
      reasoning: 'Aligns with your soul\'s evolutionary direction',
      expectedOutcome: 'Accelerated soul growth and life purpose fulfillment',
      timing: 'Ongoing',
      priority: 0.9
    });
  }

  return insights.sort((a, b) => b.priority - a.priority).slice(0, 5);
};

const calculateSynchronicityLevel = (
  astroData: AstrologyData | null,
  selectedCards: TarotCard[],
  responses: string[],
  psychProfile: PsychologicalProfile
): number => {
  
  let synchronicityScore = 0.5;

  // Astrological alignment
  if (astroData) {
    synchronicityScore += 0.2;
    if (astroData.galacticAlignment.includes('Direct')) synchronicityScore += 0.1;
  }

  // Card-astrology correspondence
  selectedCards.forEach(card => {
    const correspondence = getCardAstrologicalCorrespondence(card.name);
    if (correspondence && astroData) {
      if (correspondence === astroData.sunSign || 
          correspondence === astroData.moonSign || 
          correspondence === astroData.risingSign) {
        synchronicityScore += 0.1;
      }
    }
  });

  // Consciousness level alignment
  if (psychProfile.spiritualAwareness > 0.7) synchronicityScore += 0.1;
  if (psychProfile.consciousnessLevel > 0.7) synchronicityScore += 0.1;

  // Response coherence and depth
  const avgResponseLength = responses.reduce((acc, r) => acc + r.length, 0) / responses.length;
  if (avgResponseLength > 100) synchronicityScore += 0.1;

  return Math.min(synchronicityScore, 1.0);
};