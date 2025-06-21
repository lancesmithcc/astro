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

export const generateEnhancedInsight = async (
  cards: TarotCard[], 
  responses: string[],
  birthData: BirthData | null,
  astroData: AstrologyData | null
): Promise<string> => {
  
  const situation = extractActualSituation(responses);
  const analysis = performDeepAnalysis(responses, birthData, astroData, cards);

  const prompt = `
    You are a wise, modern, and compassionate spiritual guide. Your goal is to provide a tarot and astrology reading that is insightful, empowering, and easy to understand. Avoid overly technical jargon. Focus on practical, real-life application.

    Here is the user's situation based on their own words:
    - Initial concern: ${responses[0]}
    - Their follow-up thoughts: "${situation.keyPhrase}"
    - The core topic seems to be: ${situation.type}
    - Their emotional state appears to be: ${situation.emotion}

    Here is the energetic and astrological context for this person:
    - Sun Sign: ${astroData?.sunSign}, Moon Sign: ${astroData?.moonSign}, Rising Sign: ${astroData?.risingSign}
    - Evolutionary Theme: ${astroData?.evolutionaryTheme}
    - Current relevant transit: ${astroData?.currentTransits[0]}
    - Deep analysis shows a consciousness level of ${Math.round(analysis.psychologicalProfile.consciousnessLevel * 100)}% and synchronicity level of ${Math.round(analysis.synchronicityLevel * 100)}%.

    Here are the tarot cards they have drawn:
    - Past/Foundation: ${cards[0].name} (Keywords: ${cards[0].keywords.join(', ')})
    - Present/Challenge: ${cards[1].name} (Keywords: ${cards[1].keywords.join(', ')})
    - Future/Guidance: ${cards[2].name} (Keywords: ${cards[2].keywords.join(', ')})

    Please synthesize all of this information into a cohesive and flowing reading. Structure your response into three sections with these exact titles:

    **What your cards are saying:**
    Interpret the three cards in the context of the user's situation. Explain how the past foundation, present challenge, and future guidance cards tell a story about their current life circumstances.

    **What this means for you:**
    Connect the card reading and astrological data directly to their life. Provide personal, actionable guidance. How can they apply this wisdom? What does this mean for their relationships, work, or personal growth?

    **Moving forward:**
    Give them 2-3 clear, practical, and empowering next steps. What is the most important thing for them to focus on right now?

    Speak naturally, like you are talking to a friend. Be encouraging and focus on their inner power and potential.
  `;

  try {
    const response = await fetch("https://api.deepseek.com/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${process.env.DEEPSEEK_API_KEY}`
      },
      body: JSON.stringify({
        model: "deepseek-chat",
        messages: [
          {
            content: prompt,
            role: "user"
          }
        ],
      })
    });

    if (!response.ok) {
      console.error('DeepSeek API error:', response.status, response.statusText);
      const errorBody = await response.text();
      console.error('Error Body:', errorBody);
      return "I'm having a little trouble connecting with the cosmic energies right now. Please try again in a moment.";
    }

    const data = await response.json();
    return data.choices[0].message.content;

  } catch (error) {
    console.error('Error calling DeepSeek API:', error);
    return "It seems there was an issue reaching the divine channels. Let's try again shortly.";
  }
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