import { TarotCard } from '../types';
import { DeepAnalysis, performDeepAnalysis } from './deepAnalysisEngine';
import { BirthData } from '../components/BirthdateInput';
import { AstrologyData } from './evolutionaryAstrology';

// NATURAL AI engine that speaks like a real person about real situations
export const generateEnhancedInitialQuestion = (): string => {
  const questions = [
    "What's going on in your life that you could use some perspective on?",
    "What's been on your mind lately that you'd like to explore?",
    "Tell me what's happening in your world right now.",
    "What situation are you dealing with that could use some clarity?",
    "What's the main thing you're thinking about or working through?",
    "What's going on that brought you here for a reading today?"
  ];
  
  return questions[Math.floor(Math.random() * questions.length)];
};

export const generateEnhancedFollowUpQuestion = (
  cards: TarotCard[], 
  responses: string[],
  analysis: DeepAnalysis
): string => {
  // Extract what they actually said
  const situation = extractActualSituation(responses);
  const mainCard = cards[1]; // Present moment card
  
  console.log('🎯 GENERATING NATURAL FOLLOW-UP:', situation);
  
  // Generate natural follow-up based on what they actually shared
  if (situation.type === 'relationship') {
    return `So with this relationship thing you mentioned - when you look at the ${mainCard.name}, what comes up for you? This card often shows up when we need to trust our gut about someone.`;
  }
  
  if (situation.type === 'work') {
    return `About the work situation - the ${mainCard.name} is interesting here. What would it look like if you approached this from a place of complete self-trust instead of trying to please everyone?`;
  }
  
  if (situation.type === 'decision') {
    return `For this decision you're facing, the ${mainCard.name} is asking: what would you choose if you knew you couldn't make a wrong choice? What feels most true to who you are?`;
  }
  
  if (situation.type === 'family') {
    return `With your family situation, the ${mainCard.name} often appears when we need to set boundaries while staying loving. What would that look like for you?`;
  }
  
  if (situation.type === 'change') {
    return `About the changes happening - the ${mainCard.name} suggests this transition is actually preparing you for something better. What part of you is excited about what's coming?`;
  }
  
  if (situation.type === 'fear') {
    return `What you're scared about - the ${mainCard.name} often shows up to remind us that fear and excitement feel the same in the body. What if this fear is actually anticipation?`;
  }
  
  // Use their actual words if we have them
  if (situation.keyPhrase) {
    return `You said "${situation.keyPhrase}" - the ${mainCard.name} is asking: what would change if you completely trusted yourself in this situation?`;
  }
  
  // Natural default
  return `Looking at the ${mainCard.name} and what you shared - what's your gut telling you about this situation? What feels most true?`;
};

export const generateEnhancedInsight = (
  cards: TarotCard[], 
  responses: string[],
  birthData: BirthData | null,
  astroData: AstrologyData | null
): string => {
  
  // Get their actual situation
  const situation = extractActualSituation(responses);
  const analysis = performDeepAnalysis(responses, birthData, astroData, cards);
  
  console.log('🔍 GENERATING NATURAL INSIGHT FOR:', situation);
  
  // Start with their actual situation
  let insight = '';
  
  // 1) Technical energies in concise point-form first
  insight += `**Technical Energies**\n\n`;
  
  // Astrology snapshot (if we have birth data analysed)
  if (astroData) {
    insight += `• Sun: ${astroData.sunSign}\n`;
    insight += `• Moon: ${astroData.moonSign}\n`;
    insight += `• Rising: ${astroData.risingSign}\n`;
    if (astroData.currentTransits && astroData.currentTransits.length) {
      insight += `• Current Transit: ${astroData.currentTransits[0]}\n`;
    }
  }
  
  // Tarot card energies – succinct keywords
  if (cards && cards.length === 3) {
    insight += `• Past: ${cards[0].name} (${cards[0].keywords?.[0] || ''})\n`;
    insight += `• Present: ${cards[1].name} (${cards[1].keywords?.[0] || ''})\n`;
    insight += `• Guidance: ${cards[2].name} (${cards[2].keywords?.[0] || ''})\n`;
  } else if (cards && cards.length) {
    cards.forEach((c, idx) => {
      insight += `• Card ${idx + 1}: ${c.name} (${c.keywords?.[0] || ''})\n`;
    });
  }
  
  // Energetic signature depth if available
  if (analysis) {
    insight += `• Consciousness: ${Math.round(analysis.psychologicalProfile.consciousnessLevel * 100)}%\n`;
    insight += `• Synchronicity: ${Math.round(analysis.synchronicityLevel * 100)}%\n`;
  }
  
  insight += `\n`; // Spacer before interpretation
  
  if (situation.type && situation.details) {
    insight += `**About your ${situation.type} situation:**\n\n`;
    insight += generateNaturalSituationResponse(situation, cards, analysis);
    insight += `\n\n`;
  }
  
  // Natural card interpretations
  insight += `**What your cards are saying:**\n\n`;
  insight += generateNaturalCardReadings(cards, situation);
  insight += `\n\n`;
  
  // Personal guidance
  insight += `**What this means for you:**\n\n`;
  insight += generatePersonalGuidance(situation, cards, analysis, astroData);
  insight += `\n\n`;
  
  // Next steps
  insight += `**Moving forward:**\n\n`;
  insight += generateNaturalNextSteps(situation, cards);
  
  return insight;
};

// Extract what they actually said in natural language
const extractActualSituation = (responses: string[]): any => {
  const allText = responses.join(' ');
  const lowerText = allText.toLowerCase();
  
  const situation: any = {
    type: null,
    details: '',
    keyPhrase: '',
    emotion: 'neutral'
  };
  
  // Find key phrases they actually used
  const sentences = allText.split(/[.!?]+/).filter(s => s.trim().length > 10);
  if (sentences.length > 0) {
    situation.keyPhrase = sentences.find(s => 
      s.toLowerCase().includes('i ') || 
      s.toLowerCase().includes('my ') ||
      s.toLowerCase().includes('we ')
    ) || sentences[0];
  }
  
  // Detect situation type from natural language
  if (lowerText.match(/(relationship|partner|dating|boyfriend|girlfriend|husband|wife|marriage|love|romantic)/)) {
    situation.type = 'relationship';
    situation.details = extractSentencesContaining(allText, ['relationship', 'partner', 'dating', 'love', 'boyfriend', 'girlfriend', 'husband', 'wife']);
  } else if (lowerText.match(/(work|job|career|boss|office|workplace|business|colleague)/)) {
    situation.type = 'work';
    situation.details = extractSentencesContaining(allText, ['work', 'job', 'career', 'boss', 'office', 'business']);
  } else if (lowerText.match(/(family|mother|father|mom|dad|parents|sister|brother|children|kids)/)) {
    situation.type = 'family';
    situation.details = extractSentencesContaining(allText, ['family', 'mother', 'father', 'mom', 'dad', 'parents']);
  } else if (lowerText.match(/(decision|choose|decide|choice|should i|what should|which)/)) {
    situation.type = 'decision';
    situation.details = extractSentencesContaining(allText, ['decision', 'choose', 'decide', 'choice', 'should']);
  } else if (lowerText.match(/(change|changing|transition|moving|new|different|transform)/)) {
    situation.type = 'change';
    situation.details = extractSentencesContaining(allText, ['change', 'changing', 'transition', 'moving', 'new']);
  } else if (lowerText.match(/(scared|afraid|worry|worried|anxious|fear|nervous)/)) {
    situation.type = 'fear';
    situation.details = extractSentencesContaining(allText, ['scared', 'afraid', 'worry', 'anxious', 'fear']);
  }
  
  // Detect emotional tone
  if (lowerText.includes('excited') || lowerText.includes('happy')) situation.emotion = 'positive';
  if (lowerText.includes('scared') || lowerText.includes('worried')) situation.emotion = 'anxious';
  if (lowerText.includes('frustrated') || lowerText.includes('stuck')) situation.emotion = 'frustrated';
  if (lowerText.includes('confused') || lowerText.includes('unclear')) situation.emotion = 'confused';
  
  return situation;
};

const extractSentencesContaining = (text: string, keywords: string[]): string => {
  const sentences = text.split(/[.!?]+/);
  for (const keyword of keywords) {
    const found = sentences.find(s => s.toLowerCase().includes(keyword));
    if (found && found.trim().length > 10) {
      return found.trim();
    }
  }
  return '';
};

// Generate natural responses about their actual situation
const generateNaturalSituationResponse = (situation: any, cards: TarotCard[], analysis: DeepAnalysis): string => {
  const mainCard = cards[1]; // Present moment card
  
  switch (situation.type) {
    case 'relationship':
      return `The ${mainCard.name} is really interesting for relationship stuff. This card usually shows up when you need to trust your own feelings about someone instead of overthinking it. What's your gut actually telling you about this person or situation? Sometimes we know the answer but we're scared to admit it to ourselves.`;
    
    case 'work':
      return `With work situations, the ${mainCard.name} often means you're being called to show up more authentically. Instead of trying to be what you think they want, what would happen if you just brought your real self to this? Your authentic energy is actually your biggest professional asset.`;
    
    case 'family':
      return `Family stuff is always complex, and the ${mainCard.name} suggests this situation is asking you to find your own center. You can love your family and still have boundaries. What would it look like to stay true to yourself while still being loving?`;
    
    case 'decision':
      return `For decisions, the ${mainCard.name} is basically saying your intuition already knows the answer. All that mental back-and-forth is just noise. What choice feels most like you? What option makes you feel more expansive rather than contracted?`;
    
    case 'change':
      return `Change is uncomfortable but the ${mainCard.name} suggests this transition is actually aligning you with something better. What part of this change feels exciting, even if it's also scary? Sometimes the universe moves us toward what we need even when we resist it.`;
    
    case 'fear':
      return `The ${mainCard.name} often appears when we're afraid of something that's actually good for us. Fear and excitement feel the same in your body - it's just how your mind interprets the energy. What if this fear is actually anticipation for something amazing?`;
    
    default:
      return `The ${mainCard.name} is speaking to whatever you're going through right now. This card usually shows up when you need to trust yourself more and worry about external validation less. Your inner knowing is stronger than you think.`;
  }
};

// Natural card readings that connect to their situation
const generateNaturalCardReadings = (cards: TarotCard[], situation: any): string => {
  let reading = '';
  
  // Foundation card
  reading += `**${cards[0].name}** - This is your foundation right now. `;
  if (situation.type) {
    reading += `For your ${situation.type} situation, this ${cards[0].keywords[0]} energy is what's supporting you. You've got more strength here than you realize.`;
  } else {
    reading += `This ${cards[0].keywords[0]} energy is your secret strength. It's been building in you and now it's ready to be used.`;
  }
  
  reading += `\n\n`;
  
  // Present moment card
  reading += `**${cards[1].name}** - This is what's happening right now. `;
  if (situation.type) {
    reading += `In your ${situation.type} situation, ${cards[1].keywords[0]} energy is exactly what's needed. This isn't random - this card chose you because this energy is your answer.`;
  } else {
    reading += `The ${cards[1].keywords[0]} frequency is what you need to embody right now. Trust this energy completely.`;
  }
  
  reading += `\n\n`;
  
  // Guidance card
  reading += `**${cards[2].name}** - This is your path forward. `;
  if (situation.type) {
    reading += `For your ${situation.type} situation, approach it with ${cards[2].keywords[0]} energy. Don't force outcomes - just embody this frequency and let things unfold naturally.`;
  } else {
    reading += `${cards[2].keywords[0]} is your guidance. When you're not sure what to do, ask yourself: what would ${cards[2].keywords[0]} energy do here?`;
  }
  
  return reading;
};

// Personal guidance that feels like talking to a friend
const generatePersonalGuidance = (situation: any, cards: TarotCard[], analysis: DeepAnalysis, astroData: AstrologyData | null): string => {
  let guidance = '';
  
  if (situation.emotion === 'anxious') {
    guidance += `I can feel the anxiety in what you shared. That's totally normal when you're dealing with something important. `;
  } else if (situation.emotion === 'frustrated') {
    guidance += `The frustration you're feeling makes complete sense. Sometimes we get stuck because we're trying to force something instead of flowing with it. `;
  } else if (situation.emotion === 'confused') {
    guidance += `Confusion usually means you're in a growth phase. Your old ways of thinking aren't working anymore, which means you're evolving. `;
  }
  
  guidance += `The thing about your cards is they're not telling you what to do - they're reflecting what you already know deep down. `;
  
  if (astroData) {
    guidance += `Your ${astroData.sunSign} energy gives you the strength to handle this authentically. `;
  }
  
  guidance += `Trust your gut. It's been right about everything important in your life, even when your mind tried to talk you out of it.`;
  
  if (situation.type) {
    guidance += ` With ${situation.type} stuff, the answer is usually simpler than we make it. What feels most true to who you are?`;
  }
  
  return guidance;
};

// Natural next steps
const generateNaturalNextSteps = (situation: any, cards: TarotCard[]): string => {
  const guidanceCard = cards[2];
  
  let steps = `Here's what I'd focus on:\n\n`;
  
  steps += `1. **Embody ${guidanceCard.keywords[0]} energy** - For the next few days, ask yourself: how would someone with strong ${guidanceCard.keywords[0]} energy handle this?\n\n`;
  
  if (situation.type) {
    switch (situation.type) {
      case 'relationship':
        steps += `2. **Trust your feelings** - Your gut knows if this person is right for you. Stop trying to convince yourself either way.\n\n`;
        break;
      case 'work':
        steps += `2. **Show up authentically** - Stop trying to be what you think they want. Your real self is your competitive advantage.\n\n`;
        break;
      case 'decision':
        steps += `2. **Feel into your options** - Which choice makes you feel expansive? Which one contracts you? Your body knows.\n\n`;
        break;
      default:
        steps += `2. **Take one small authentic action** - What's one tiny step that feels true to who you are?\n\n`;
    }
  } else {
    steps += `2. **Take one aligned action** - What's one small step that feels authentic to you?\n\n`;
  }
  
  steps += `3. **Notice what feels expansive vs. contractive** - Your body is always giving you information about what's right for you.\n\n`;
  
  steps += `4. **Trust the process** - You're exactly where you need to be, even if it doesn't feel like it right now.`;
  
  return steps;
};

// Enhanced text analysis
export const analyzeResponseDepth = (response: string): {
  depth: number;
  authenticity: number;
  readiness: number;
  themes: string[];
} => {
  const words = response.toLowerCase().split(/\s+/);
  
  // Look for emotional vulnerability and specificity
  const vulnerabilityWords = ['feel', 'scared', 'confused', 'hurt', 'lost', 'uncertain', 'struggling', 'worried'];
  const specificityWords = ['because', 'when', 'since', 'after', 'during', 'while', 'yesterday', 'today', 'recently'];
  
  const vulnerabilityCount = words.filter(word => vulnerabilityWords.some(vw => word.includes(vw))).length;
  const specificityCount = words.filter(word => specificityWords.some(sw => word.includes(sw))).length;
  
  const depth = Math.min((vulnerabilityCount + specificityCount) / Math.max(words.length, 1) * 5 + 0.3, 1.0);
  
  // Look for personal language
  const personalWords = ['i', 'me', 'my', 'myself'];
  const personalCount = words.filter(word => personalWords.includes(word)).length;
  const authenticity = Math.min(personalCount / Math.max(words.length, 1) * 4 + 0.4, 1.0);
  
  // Look for action/intention words
  const actionWords = ['will', 'going', 'ready', 'want', 'need', 'plan', 'decide', 'trying'];
  const actionCount = words.filter(word => actionWords.some(aw => word.includes(aw))).length;
  const readiness = Math.min(actionCount / Math.max(words.length, 1) * 4 + 0.3, 1.0);
  
  // Extract actual themes
  const themeWords = ['love', 'work', 'family', 'relationship', 'money', 'health', 'purpose', 'growth', 'change', 'fear'];
  const themes = themeWords.filter(theme => response.toLowerCase().includes(theme));
  
  return { depth, authenticity, readiness, themes };
};

// Generate energy updates
export const generateEnergyUpdate = (analysis: DeepAnalysis): {
  sign: string;
  intensity: number;
  message: string;
} => {
  const { energeticSignature, psychologicalProfile, evolutionaryStage } = analysis;
  
  let primarySign = energeticSignature.primaryFrequency;
  let intensity = 0.7;
  
  // Boost based on consciousness and readiness
  intensity += psychologicalProfile.consciousnessLevel * 0.2;
  intensity += evolutionaryStage.readinessForChange * 0.1;
  
  // Check chakra activations
  const { chakraActivation } = energeticSignature;
  if (chakraActivation.Heart > 0.8) {
    primarySign = 'Leo';
    intensity += 0.1;
  } else if (chakraActivation['Third Eye'] > 0.8) {
    primarySign = 'Pisces';
    intensity += 0.1;
  } else if (chakraActivation.Throat > 0.8) {
    primarySign = 'Gemini';
    intensity += 0.1;
  }
  
  return {
    sign: primarySign,
    intensity: Math.min(intensity, 1.0),
    message: `${primarySign} energy at ${Math.round(intensity * 100)}%`
  };
};