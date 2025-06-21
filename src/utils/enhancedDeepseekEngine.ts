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

export const generateEnhancedFollowUpQuestion = async (
  cards: TarotCard[], 
  responses: string[],
  analysis: DeepAnalysis,
  finalReadingText: string
): Promise<string> => {

  const prompt = `
    You are a wise, modern, and compassionate spiritual guide. You have just provided a user with the tarot and astrology reading below. Now, you need to ask them a single, powerful, open-ended follow-up question to help them reflect more deeply.

    **The Reading You Provided:**
    ---
    ${finalReadingText}
    ---

    **Original Context (for your reference):**
    - User's situation: ${responses.join(' ')}
    - Cards drawn: ${cards.map(c => c.name).join(', ')}
    - Key psychological theme: The user has a consciousness level of ${Math.round(analysis.psychologicalProfile.consciousnessLevel * 100)}% and is working on their ${analysis.evolutionaryStage.currentLevel}.

    Your Task:
    Based on the reading you provided, formulate one insightful question that encourages the user to look within. The question must be directly related to the specific advice and themes in the reading as it applies to their situation. Do not ask a generic question. Make it personal and thought-provoking. For example, instead of "How does that resonate?", ask "Given the advice about trusting your intuition, what's one small step you could take this week at your job that feels more aligned with that inner knowing?"
  `;

  console.log("🔮 Sending this follow-up prompt to DeepSeek:", prompt);

  const maxRetries = 3;
  for (let attempt = 0; attempt < maxRetries; attempt++) {
    try {
      const response = await fetch("https://api.deepseek.com/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${process.env.DEEPSEEK_API_KEY}`
        },
        body: JSON.stringify({
          model: "deepseek-chat",
          messages: [{ role: "user", content: `${prompt} (Attempt ${attempt + 1})` }],
          max_tokens: 100,
          temperature: 0.8,
        })
      });

      if (!response.ok) {
        console.error(`DeepSeek API error for follow-up on attempt ${attempt + 1}:`, response.status, response.statusText);
        throw new Error('API request failed');
      }

      const data = await response.json();
      console.log(`✅ Received follow-up response from DeepSeek on attempt ${attempt + 1}:`, data);

      if (!data.choices || data.choices.length === 0 || !data.choices[0].message.content) {
        console.error(`❌ DeepSeek follow-up response is missing expected content on attempt ${attempt + 1}.`, data);
        throw new Error('Invalid API response');
      }

      // Clean up the response to ensure it's just the question
      let question = data.choices[0].message.content.trim();
      // Remove potential quotation marks
      if (question.startsWith('"') && question.endsWith('"')) {
        question = question.substring(1, question.length - 1);
      }
      return question;

    } catch (error) {
      console.error(`Error on attempt ${attempt + 1} calling DeepSeek API for follow-up:`, error);
      if (attempt < maxRetries - 1) {
        await new Promise(res => setTimeout(res, 1000));
      }
    }
  }

  console.error("❌ All DeepSeek follow-up retries failed.");
  return "How does this reading land with you?";
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

    Your Task:
    Synthesize all of this information into a cohesive and flowing reading. Your tone should be wise and encouraging, like a modern spiritual guide talking to a friend. Do NOT just list the data. Instead, weave the card meanings, astrological context, and user's situation into a seamless narrative. The final output must be easy to understand and focused on practical, real-world advice.

    Structure your response into these three sections exactly:

    **What your cards are saying:**
    Interpret the three cards in the context of the user's specific situation about their ${situation.type}. ALWAYS tie the interpretation of each card back to their problem. For example, instead of saying 'The Tower means upheaval,' say 'For your situation at work, The Tower suggests an unexpected shake-up is coming.'

    **What this means for you:**
    Make this section extremely personal. Use the user's own words and feelings (e.g., "${situation.keyPhrase}"). Connect the astrological data not as a general fact, but as a direct influence on what they are currently experiencing.

    **Moving forward:**
    Give them 2-3 clear, practical, and empowering next steps that are concrete actions they can take to address their specific situation. Avoid generic advice.

    Speak naturally, like you are talking to a friend. Be encouraging and focus on their inner power and potential.
  `;

  console.log("🔮 Sending this prompt to DeepSeek:", prompt);

  const maxRetries = 3;
  for (let attempt = 0; attempt < maxRetries; attempt++) {
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
              content: `${prompt} (Attempt ${attempt + 1})`,
              role: "user"
            }
          ],
        })
      });

      if (!response.ok) {
        const errorBody = await response.text();
        console.error(`DeepSeek API error on attempt ${attempt + 1}:`, response.status, response.statusText, errorBody);
        throw new Error('API request failed'); // Trigger retry
      }

      const data = await response.json();
      console.log(`✅ Received response from DeepSeek on attempt ${attempt + 1}:`, data);

      if (!data.choices || data.choices.length === 0 || !data.choices[0].message.content) {
        console.error(`❌ DeepSeek response is missing expected content on attempt ${attempt + 1}.`, data);
        throw new Error('Invalid API response'); // Trigger retry
      }

      return data.choices[0].message.content; // Success!

    } catch (error) {
      console.error(`Error on attempt ${attempt + 1} calling DeepSeek API:`, error);
      if (attempt < maxRetries - 1) {
        await new Promise(res => setTimeout(res, 1000)); // Wait 1s before next retry
      }
    }
  }

  console.error("❌ All DeepSeek retries failed.");
  return "It seems there was an issue reaching the divine channels. Let's try again shortly.";
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