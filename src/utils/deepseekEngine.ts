import { TarotCard } from '../types';

// Creative questioning techniques to access the subconscious
const QUESTIONING_TECHNIQUES = [
  'metaphorical',
  'sensory',
  'temporal',
  'emotional',
  'symbolic',
  'archetypal'
];

const INITIAL_QUESTIONS = [
  "Yo, what's that one thing that's been living rent-free in your head lately? Like, the universe is literally trying to slide into your DMs about it.",
  "If your soul could drop a voice note right now, what would it be saying? No cap.",
  "There's some main character energy trying to emerge in your life... what's the plot twist you're sensing?",
  "Something's shifting in your reality - I can feel it through the screen. What's the vibe check your intuition is giving you?",
  "What question would you ask if you knew the cosmos was about to spill all the tea?",
  "Your inner knowing is trying to serve you some truth... what's it whispering?",
  "If you could peek at your future self's story, what chapter would you most want to read?",
  "What situation keeps showing up in your mental feed like it's the algorithm trying to tell you something?",
  "There's a frequency shift happening in your life - what part feels like it's asking for a complete rebrand?",
  "Your higher self is trying to send you a notification... what's the message you keep dismissing?"
];

export const generateInitialQuestion = (): string => {
  const question = INITIAL_QUESTIONS[Math.floor(Math.random() * INITIAL_QUESTIONS.length)];
  return question;
};

export const generateFollowUpQuestion = (cards: TarotCard[], responses: string[]): string => {
  const technique = QUESTIONING_TECHNIQUES[Math.floor(Math.random() * QUESTIONING_TECHNIQUES.length)];
  const themes = extractThemes(responses);
  const cardEnergies = cards.map(card => card.keywords[0]);
  
  switch (technique) {
    case 'metaphorical':
      return `If your whole situation was a video game level, would you be in the tutorial, mid-boss fight, or final boss energy? What power-up does your character need to level up?`;
    
    case 'sensory':
      return `Close your eyes for a sec. When you think about ${themes[0] || 'your situation'}, what's the energy? Is it giving warm coffee vibes, electric storm energy, or that quiet before-dawn feeling?`;
    
    case 'temporal':
      return `Imagine your past self could see you now - what would absolutely break their brain in the best way? What would they be most curious about?`;
    
    case 'emotional':
      return `There's an emotion you're keeping on read instead of responding to... what is it? And what would happen if you actually let it have its moment?`;
    
    case 'symbolic':
      return `If ${cardEnergies[0]} and ${cardEnergies[1]} were having a group chat about your life, what would the conversation look like? Which energy usually leaves the other on read?`;
    
    case 'archetypal':
      return `There's a part of you that's ready to be the main character, and another part that's still in supporting role mode. What would each version of you say in their TED talk?`;
    
    default:
      return `What truth are you ghosting that actually wants to be your bestie?`;
  }
};

export const generateInsight = (cards: TarotCard[], responses: string[]): string => {
  const themes = extractThemes(responses);
  const emotionalTone = analyzeEmotionalTone(responses);
  const cardSynergy = analyzeCardSynergy(cards);
  
  const insight = `
The universe just dropped some serious lore about your journey...

${cards[0].name} is giving major ${cards[0].keywords[0]} energy - this has been your origin story foundation. Your words are revealing ${themes[0] ? `some deep ${themes[0]} programming` : 'layers that go way deeper than the surface level'} that's been running in the background.

${cards[1].name} is illuminating your current main character moment with ${cards[1].keywords[0]} vibes. The way you're speaking your truth shows ${emotionalTone.primary} energy is dominant, but I'm sensing some ${emotionalTone.hidden} frequencies trying to break through.

${cards[2].name} is pointing toward ${cards[2].keywords[0]} as your next-level unlock. ${generatePersonalizedGuidance(cards, responses, themes)}

The cosmic algorithm is showing you that ${cardSynergy.message}

Your subconscious just served up something profound: ${extractSubconsciousInsight(responses)}

The path forward is asking you to ${generateActionableWisdom(cards, themes, emotionalTone)}.

Here's the thing - you already know what's up. These symbols are just helping you remember what your soul has been trying to tell you. The answers aren't out there in some external validation... they're literally coded into your being.

Trust the download you're receiving. Your intuition isn't glitching - it's upgrading.
  `.trim();
  
  return insight;
};

const extractThemes = (responses: string[]): string[] => {
  const allText = responses.join(' ').toLowerCase();
  const themeWords = [
    'love', 'relationship', 'career', 'family', 'change', 'fear', 'growth', 
    'decision', 'future', 'past', 'healing', 'purpose', 'creativity', 'money',
    'health', 'spirituality', 'freedom', 'responsibility', 'trust', 'forgiveness'
  ];
  
  return themeWords.filter(theme => allText.includes(theme)).slice(0, 3);
};

const analyzeEmotionalTone = (responses: string[]): { primary: string; hidden: string } => {
  const allText = responses.join(' ').toLowerCase();
  
  const emotions = {
    'ready-to-level-up': ['hope', 'excited', 'ready', 'positive', 'forward', 'new'],
    'processing-mode': ['unsure', 'confused', 'maybe', 'don\'t know', 'unclear'],
    'anxiety-spiral': ['scared', 'afraid', 'worry', 'anxious', 'nervous', 'fear'],
    'main-character': ['will', 'must', 'need to', 'have to', 'determined'],
    'deep-thinking': ['think', 'feel', 'sense', 'wonder', 'consider'],
    'resistance-mode': ['but', 'however', 'can\'t', 'won\'t', 'difficult', 'hard']
  };
  
  let primaryEmotion = 'deep-thinking';
  let hiddenEmotion = 'ready-to-level-up';
  let maxCount = 0;
  
  Object.entries(emotions).forEach(([emotion, words]) => {
    const count = words.reduce((acc, word) => acc + (allText.includes(word) ? 1 : 0), 0);
    if (count > maxCount) {
      hiddenEmotion = primaryEmotion;
      primaryEmotion = emotion;
      maxCount = count;
    }
  });
  
  return { primary: primaryEmotion, hidden: hiddenEmotion };
};

const analyzeCardSynergy = (cards: TarotCard[]): { message: string } => {
  const elements = cards.map(card => card.element).filter(Boolean);
  const suits = cards.map(card => card.suit);
  
  if (elements.includes('Fire') && elements.includes('Water')) {
    return { message: 'your passion and intuition are both trying to collab - it\'s giving integration energy' };
  }
  
  if (suits.filter(suit => suit === 'Major Arcana').length >= 2) {
    return { message: 'major plot twist energy is activated - this is giving main character development vibes' };
  }
  
  if (elements.includes('Air') && elements.includes('Earth')) {
    return { message: 'your thoughts are asking to touch grass - time to make ideas reality' };
  }
  
  return { message: 'the energies are asking for some serious balance and conscious choice-making' };
};

const extractSubconsciousInsight = (responses: string[]): string => {
  const insights = [
    'you already have the cheat codes, you\'re just waiting for permission to use them',
    'this isn\'t about the external situation - it\'s about your relationship with not knowing the outcome',
    'your soul is literally trying to upgrade you to the next version of yourself',
    'what looks like an ending is actually the universe clearing space for something more authentic',
    'your intuition has better WiFi than your doubt, even when the connection feels weak',
    'the thing you\'re avoiding might actually be your greatest teacher trying to slide into your DMs',
    'you\'re ready for a level of truth that past-you couldn\'t handle'
  ];
  
  return insights[Math.floor(Math.random() * insights.length)];
};

const generateActionableWisdom = (cards: TarotCard[], themes: string[], emotionalTone: { primary: string; hidden: string }): string => {
  const actions = [
    'honor both your need for security and your call to evolve - it\'s not either/or energy',
    'trust the process even when the universe is giving you zero spoilers',
    'listen to that quiet voice that\'s been trying to get your attention',
    'embrace the unknown as your personal expansion pack',
    'integrate the wisdom of your experience with the courage of your dreams',
    'unsubscribe from what no longer serves your highest timeline',
    'step forward with both compassion for your journey and excitement for your destination'
  ];
  
  return actions[Math.floor(Math.random() * actions.length)];
};

const generatePersonalizedGuidance = (cards: TarotCard[], responses: string[], themes: string[]): string => {
  if (themes.includes('relationship') || themes.includes('love')) {
    return 'Your heart knows the difference between love that dims your light and love that amplifies it. Trust that inner knowing - it\'s not glitching.';
  }
  
  if (themes.includes('career') || themes.includes('work')) {
    return 'Your work is meant to be an expression of your authentic self, not a betrayal of it. The world needs what you uniquely bring.';
  }
  
  if (themes.includes('change') || themes.includes('decision')) {
    return 'Change isn\'t something happening to you - you\'re an active participant in co-creating your reality.';
  }
  
  return 'The path of greatest resistance often leads to the most meaningful transformation. Your soul knows this.';
};