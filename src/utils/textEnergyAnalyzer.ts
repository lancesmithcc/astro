// Text analysis utility to detect astrological energies in responses
export interface EnergySignature {
  primarySign: string;
  secondarySign?: string;
  intensity: number;
  keywords: string[];
}

// Keywords associated with each astrological sign
const SIGN_KEYWORDS = {
  'Aries': ['action', 'start', 'begin', 'lead', 'fight', 'courage', 'bold', 'first', 'pioneer', 'energy', 'fire', 'passion', 'drive', 'initiative', 'competitive'],
  'Taurus': ['stable', 'steady', 'comfort', 'security', 'money', 'material', 'earth', 'practical', 'stubborn', 'luxury', 'beauty', 'sensual', 'slow', 'reliable'],
  'Gemini': ['communicate', 'talk', 'think', 'learn', 'curious', 'quick', 'change', 'adapt', 'social', 'mental', 'ideas', 'information', 'versatile', 'witty'],
  'Cancer': ['home', 'family', 'mother', 'nurture', 'care', 'emotional', 'sensitive', 'protect', 'comfort', 'intuitive', 'moody', 'past', 'memory', 'feelings'],
  'Leo': ['creative', 'shine', 'center', 'attention', 'dramatic', 'proud', 'generous', 'heart', 'performance', 'leadership', 'confidence', 'royal', 'sun', 'radiant'],
  'Virgo': ['perfect', 'detail', 'analyze', 'organize', 'service', 'health', 'work', 'practical', 'critical', 'precise', 'helpful', 'systematic', 'pure', 'modest'],
  'Libra': ['balance', 'harmony', 'relationship', 'partner', 'beauty', 'fair', 'justice', 'peace', 'diplomatic', 'social', 'aesthetic', 'cooperation', 'elegant'],
  'Scorpio': ['deep', 'intense', 'transform', 'mystery', 'power', 'secret', 'death', 'rebirth', 'passionate', 'magnetic', 'psychic', 'hidden', 'penetrating'],
  'Sagittarius': ['freedom', 'adventure', 'travel', 'philosophy', 'truth', 'expand', 'explore', 'optimistic', 'spiritual', 'higher', 'meaning', 'wisdom', 'journey'],
  'Capricorn': ['achieve', 'goal', 'ambition', 'structure', 'authority', 'responsibility', 'discipline', 'mountain', 'climb', 'success', 'traditional', 'mature'],
  'Aquarius': ['unique', 'different', 'future', 'technology', 'humanitarian', 'rebel', 'innovative', 'group', 'friendship', 'eccentric', 'progressive', 'detached'],
  'Pisces': ['dream', 'intuitive', 'spiritual', 'compassionate', 'artistic', 'escape', 'flow', 'emotional', 'psychic', 'sacrifice', 'boundless', 'mystical']
};

// Planetary keywords for additional energy detection
const PLANETARY_KEYWORDS = {
  'Mars': ['anger', 'fight', 'aggressive', 'warrior', 'conflict', 'assertive', 'competitive', 'direct'],
  'Venus': ['love', 'beauty', 'relationship', 'harmony', 'pleasure', 'artistic', 'romantic', 'attractive'],
  'Mercury': ['communication', 'quick', 'mental', 'clever', 'information', 'travel', 'messenger', 'witty'],
  'Moon': ['emotional', 'intuitive', 'nurturing', 'cyclical', 'receptive', 'subconscious', 'maternal'],
  'Sun': ['confident', 'radiant', 'central', 'vital', 'creative', 'leadership', 'ego', 'identity'],
  'Jupiter': ['expand', 'optimistic', 'philosophical', 'generous', 'abundant', 'wisdom', 'growth'],
  'Saturn': ['discipline', 'structure', 'limitation', 'responsibility', 'authority', 'traditional', 'mature'],
  'Uranus': ['sudden', 'revolutionary', 'innovative', 'eccentric', 'breakthrough', 'shocking', 'progressive'],
  'Neptune': ['mystical', 'dreamy', 'illusion', 'spiritual', 'compassionate', 'artistic', 'escapist'],
  'Pluto': ['transformation', 'power', 'death', 'rebirth', 'intense', 'hidden', 'regeneration']
};

export const analyzeTextEnergy = (text: string): EnergySignature => {
  const words = text.toLowerCase().split(/\s+/);
  const signScores: { [key: string]: number } = {};
  const foundKeywords: string[] = [];

  // Score each sign based on keyword matches
  Object.entries(SIGN_KEYWORDS).forEach(([sign, keywords]) => {
    let score = 0;
    keywords.forEach(keyword => {
      const matches = words.filter(word => 
        word.includes(keyword) || keyword.includes(word)
      ).length;
      if (matches > 0) {
        score += matches;
        foundKeywords.push(keyword);
      }
    });
    signScores[sign] = score;
  });

  // Add planetary influence
  Object.entries(PLANETARY_KEYWORDS).forEach(([planet, keywords]) => {
    keywords.forEach(keyword => {
      const matches = words.filter(word => 
        word.includes(keyword) || keyword.includes(word)
      ).length;
      if (matches > 0) {
        foundKeywords.push(keyword);
        // Add planetary influence to corresponding signs
        switch (planet) {
          case 'Mars':
            signScores['Aries'] += matches * 0.8;
            signScores['Scorpio'] += matches * 0.5;
            break;
          case 'Venus':
            signScores['Taurus'] += matches * 0.8;
            signScores['Libra'] += matches * 0.8;
            break;
          case 'Mercury':
            signScores['Gemini'] += matches * 0.8;
            signScores['Virgo'] += matches * 0.8;
            break;
          case 'Moon':
            signScores['Cancer'] += matches * 0.8;
            break;
          case 'Sun':
            signScores['Leo'] += matches * 0.8;
            break;
          case 'Jupiter':
            signScores['Sagittarius'] += matches * 0.8;
            signScores['Pisces'] += matches * 0.5;
            break;
          case 'Saturn':
            signScores['Capricorn'] += matches * 0.8;
            signScores['Aquarius'] += matches * 0.5;
            break;
          case 'Uranus':
            signScores['Aquarius'] += matches * 0.8;
            break;
          case 'Neptune':
            signScores['Pisces'] += matches * 0.8;
            break;
          case 'Pluto':
            signScores['Scorpio'] += matches * 0.8;
            break;
        }
      }
    });
  });

  // Find top scoring signs
  const sortedSigns = Object.entries(signScores)
    .sort(([,a], [,b]) => b - a)
    .filter(([,score]) => score > 0);

  if (sortedSigns.length === 0) {
    return {
      primarySign: 'Sagittarius', // Default to galactic center
      intensity: 0.2,
      keywords: []
    };
  }

  const [primarySign, primaryScore] = sortedSigns[0];
  const secondarySign = sortedSigns.length > 1 ? sortedSigns[1][0] : undefined;
  
  // Calculate intensity based on keyword density
  const totalWords = words.length;
  const keywordDensity = foundKeywords.length / Math.max(totalWords, 1);
  const intensity = Math.min(Math.max(keywordDensity * 2 + 0.3, 0.2), 1.0);

  return {
    primarySign,
    secondarySign,
    intensity,
    keywords: foundKeywords.slice(0, 5) // Top 5 keywords
  };
};

// Analyze multiple text responses for cumulative energy
export const analyzeCumulativeEnergy = (responses: string[]): EnergySignature => {
  if (responses.length === 0) {
    return {
      primarySign: 'Sagittarius',
      intensity: 0.2,
      keywords: []
    };
  }

  const allText = responses.join(' ');
  const baseAnalysis = analyzeTextEnergy(allText);
  
  // Boost intensity for multiple responses showing consistent energy
  const consistencyBoost = Math.min(responses.length * 0.1, 0.3);
  
  return {
    ...baseAnalysis,
    intensity: Math.min(baseAnalysis.intensity + consistencyBoost, 1.0)
  };
};