import { BirthData } from '../components/BirthdateInput';

export interface AstrologyData {
  sunSign: string;
  moonSign: string;
  risingSign: string;
  northNode: string;
  southNode: string;
  galacticAlignment: string;
  currentTransits: string[];
  evolutionaryTheme: string;
  soulPurpose: string;
  currentLessons: string[];
  karmaticPatterns: string[];
}

// Galactic Center at 27° Sagittarius - the cosmic center point
const GALACTIC_CENTER = {
  sign: 'Sagittarius',
  degree: 27,
  significance: 'The cosmic center of our galaxy - source of evolutionary impulses'
};

// Current planetary positions (simplified - in real app would use ephemeris)
const getCurrentTransits = (): string[] => {
  const today = new Date();
  const month = today.getMonth();
  const day = today.getDate();
  
  // Simplified current transits based on approximate positions
  const transits = [];
  
  // Add some current cosmic weather
  if (month >= 10 || month <= 1) {
    transits.push('Pluto in Capricorn - final degrees of systemic transformation');
  }
  
  if (month >= 2 && month <= 4) {
    transits.push('Jupiter expanding consciousness through current sign');
  }
  
  transits.push('Galactic Center activation - evolutionary downloads available');
  transits.push('Collective awakening frequencies intensifying');
  
  return transits;
};

export const calculateEvolutionaryAstrology = (birthData: BirthData): AstrologyData => {
  // Parse birth date
  const birthDate = new Date(birthData.date);
  const birthMonth = birthDate.getMonth() + 1;
  const birthDay = birthDate.getDate();
  
  // Calculate sun sign (simplified)
  const sunSign = calculateSunSign(birthMonth, birthDay);
  
  // Generate evolutionary insights based on birth data
  const evolutionaryData: AstrologyData = {
    sunSign,
    moonSign: generateMoonSign(birthData),
    risingSign: generateRisingSign(birthData),
    northNode: generateNorthNode(sunSign),
    southNode: generateSouthNode(sunSign),
    galacticAlignment: calculateGalacticAlignment(sunSign, birthMonth),
    currentTransits: getCurrentTransits(),
    evolutionaryTheme: generateEvolutionaryTheme(sunSign),
    soulPurpose: generateSoulPurpose(sunSign),
    currentLessons: generateCurrentLessons(sunSign),
    karmaticPatterns: generateKarmaticPatterns(sunSign)
  };
  
  return evolutionaryData;
};

const calculateSunSign = (month: number, day: number): string => {
  if ((month === 3 && day >= 21) || (month === 4 && day <= 19)) return 'Aries';
  if ((month === 4 && day >= 20) || (month === 5 && day <= 20)) return 'Taurus';
  if ((month === 5 && day >= 21) || (month === 6 && day <= 20)) return 'Gemini';
  if ((month === 6 && day >= 21) || (month === 7 && day <= 22)) return 'Cancer';
  if ((month === 7 && day >= 23) || (month === 8 && day <= 22)) return 'Leo';
  if ((month === 8 && day >= 23) || (month === 9 && day <= 22)) return 'Virgo';
  if ((month === 9 && day >= 23) || (month === 10 && day <= 22)) return 'Libra';
  if ((month === 10 && day >= 23) || (month === 11 && day <= 21)) return 'Scorpio';
  if ((month === 11 && day >= 22) || (month === 12 && day <= 21)) return 'Sagittarius';
  if ((month === 12 && day >= 22) || (month === 1 && day <= 19)) return 'Capricorn';
  if ((month === 1 && day >= 20) || (month === 2 && day <= 18)) return 'Aquarius';
  return 'Pisces';
};

const generateMoonSign = (birthData: BirthData): string => {
  // Simplified moon sign calculation based on birth time
  const timeHour = parseInt(birthData.time.split(':')[0]);
  const signs = ['Aries', 'Taurus', 'Gemini', 'Cancer', 'Leo', 'Virgo', 
                'Libra', 'Scorpio', 'Sagittarius', 'Capricorn', 'Aquarius', 'Pisces'];
  return signs[timeHour % 12];
};

const generateRisingSign = (birthData: BirthData): string => {
  // Simplified rising sign based on birth time and location hash
  const timeMinutes = parseInt(birthData.time.split(':')[1]);
  const locationHash = birthData.location.length;
  const signs = ['Aries', 'Taurus', 'Gemini', 'Cancer', 'Leo', 'Virgo', 
                'Libra', 'Scorpio', 'Sagittarius', 'Capricorn', 'Aquarius', 'Pisces'];
  return signs[(timeMinutes + locationHash) % 12];
};

const generateNorthNode = (sunSign: string): string => {
  const nodeMap: { [key: string]: string } = {
    'Aries': 'Libra - Learning cooperation and balance',
    'Taurus': 'Scorpio - Embracing transformation and depth',
    'Gemini': 'Sagittarius - Seeking higher wisdom and meaning',
    'Cancer': 'Capricorn - Building structure and authority',
    'Leo': 'Aquarius - Serving the collective consciousness',
    'Virgo': 'Pisces - Developing intuition and compassion',
    'Libra': 'Aries - Cultivating independence and leadership',
    'Scorpio': 'Taurus - Finding stability and simplicity',
    'Sagittarius': 'Gemini - Mastering communication and details',
    'Capricorn': 'Cancer - Nurturing emotional intelligence',
    'Aquarius': 'Leo - Expressing authentic creativity',
    'Pisces': 'Virgo - Grounding dreams in practical service'
  };
  return nodeMap[sunSign] || 'Evolutionary growth path';
};

const generateSouthNode = (sunSign: string): string => {
  const nodeMap: { [key: string]: string } = {
    'Aries': 'Libra - Past life mastery of relationships',
    'Taurus': 'Scorpio - Karmic understanding of power',
    'Gemini': 'Sagittarius - Previous wisdom teaching',
    'Cancer': 'Capricorn - Authority from past incarnations',
    'Leo': 'Aquarius - Collective service experience',
    'Virgo': 'Pisces - Spiritual devotion mastery',
    'Libra': 'Aries - Warrior energy from past lives',
    'Scorpio': 'Taurus - Material world mastery',
    'Sagittarius': 'Gemini - Communication gifts carried forward',
    'Capricorn': 'Cancer - Nurturing wisdom from past',
    'Aquarius': 'Leo - Creative leadership experience',
    'Pisces': 'Virgo - Service and healing mastery'
  };
  return nodeMap[sunSign] || 'Karmic gifts from past lives';
};

const calculateGalacticAlignment = (sunSign: string, birthMonth: number): string => {
  // Calculate relationship to Galactic Center at 27° Sagittarius
  if (sunSign === 'Sagittarius') {
    return 'Direct alignment with Galactic Center - you\'re a cosmic download receiver';
  }
  
  if (sunSign === 'Gemini') {
    return 'Opposition to Galactic Center - you translate cosmic wisdom for others';
  }
  
  if (['Virgo', 'Pisces'].includes(sunSign)) {
    return 'Square to Galactic Center - you challenge and refine cosmic information';
  }
  
  if (['Leo', 'Libra'].includes(sunSign)) {
    return 'Supportive angle to Galactic Center - you harmonize with cosmic frequencies';
  }
  
  return 'Unique relationship with Galactic Center - your own cosmic mission';
};

const generateEvolutionaryTheme = (sunSign: string): string => {
  const themes: { [key: string]: string } = {
    'Aries': 'Pioneering consciousness - breaking through old paradigms',
    'Taurus': 'Grounding new earth frequencies - stabilizing change',
    'Gemini': 'Bridging dimensions - translating cosmic information',
    'Cancer': 'Nurturing collective healing - emotional alchemy',
    'Leo': 'Radiating authentic self - creative leadership',
    'Virgo': 'Perfecting service to evolution - practical mysticism',
    'Libra': 'Harmonizing opposites - relationship as spiritual path',
    'Scorpio': 'Transforming shadow into light - death/rebirth mastery',
    'Sagittarius': 'Expanding consciousness - philosophical evolution',
    'Capricorn': 'Building new structures - responsible leadership',
    'Aquarius': 'Innovating for humanity - collective awakening',
    'Pisces': 'Dissolving illusions - compassionate transcendence'
  };
  return themes[sunSign] || 'Unique evolutionary path';
};

const generateSoulPurpose = (sunSign: string): string => {
  const purposes: { [key: string]: string } = {
    'Aries': 'To initiate new cycles of consciousness and inspire others to break free from limitation',
    'Taurus': 'To anchor higher frequencies into physical reality and create sustainable abundance',
    'Gemini': 'To connect diverse perspectives and facilitate communication between different worlds',
    'Cancer': 'To heal ancestral patterns and nurture the collective emotional body',
    'Leo': 'To express divine creativity and inspire others to shine their authentic light',
    'Virgo': 'To perfect systems of service and help others integrate spiritual wisdom practically',
    'Libra': 'To create harmony and teach the art of conscious relationship',
    'Scorpio': 'To transform collective shadow and guide others through deep healing',
    'Sagittarius': 'To expand human consciousness and share universal wisdom',
    'Capricorn': 'To build structures that support collective evolution and responsible stewardship',
    'Aquarius': 'To innovate solutions for humanity and anchor future consciousness',
    'Pisces': 'To dissolve separation and embody unconditional love and compassion'
  };
  return purposes[sunSign] || 'To contribute your unique gifts to collective evolution';
};

const generateCurrentLessons = (sunSign: string): string[] => {
  const lessons: { [key: string]: string[] } = {
    'Aries': ['Balancing independence with cooperation', 'Channeling warrior energy constructively', 'Leading with heart wisdom'],
    'Taurus': ['Embracing change while maintaining stability', 'Sharing resources generously', 'Finding security within'],
    'Gemini': ['Deepening beyond surface connections', 'Integrating scattered knowledge', 'Speaking truth with compassion'],
    'Cancer': ['Setting healthy emotional boundaries', 'Healing without absorbing others\' pain', 'Trusting intuitive guidance'],
    'Leo': ['Expressing creativity without ego attachment', 'Sharing spotlight with others', 'Leading through authentic example'],
    'Virgo': ['Accepting imperfection in service', 'Trusting intuition alongside analysis', 'Serving without martyrdom'],
    'Libra': ['Making decisions from inner knowing', 'Maintaining self while in relationship', 'Creating harmony without people-pleasing'],
    'Scorpio': ['Transforming without destroying', 'Sharing power rather than controlling', 'Healing through vulnerability'],
    'Sagittarius': ['Grounding wisdom in practical action', 'Teaching through lived experience', 'Expanding without losing focus'],
    'Capricorn': ['Leading with compassion', 'Building without rigidity', 'Achieving while nurturing relationships'],
    'Aquarius': ['Balancing innovation with tradition', 'Connecting individually while serving collectively', 'Grounding visions in reality'],
    'Pisces': ['Maintaining boundaries while being compassionate', 'Discerning truth from illusion', 'Serving without sacrificing self']
  };
  return lessons[sunSign] || ['Integrating your unique gifts', 'Serving your highest purpose', 'Balancing self and others'];
};

const generateKarmaticPatterns = (sunSign: string): string[] => {
  const patterns: { [key: string]: string[] } = {
    'Aries': ['Impatience with others\' pace', 'Tendency to act before thinking', 'Difficulty with collaboration'],
    'Taurus': ['Resistance to necessary change', 'Attachment to material security', 'Stubbornness in beliefs'],
    'Gemini': ['Scattered energy and focus', 'Superficial connections', 'Avoiding emotional depth'],
    'Cancer': ['Over-nurturing others', 'Emotional manipulation', 'Living in the past'],
    'Leo': ['Need for constant validation', 'Drama and attention-seeking', 'Pride blocking growth'],
    'Virgo': ['Perfectionism and criticism', 'Worry and anxiety patterns', 'Serving others while neglecting self'],
    'Libra': ['Avoiding conflict and decisions', 'People-pleasing patterns', 'Losing self in relationships'],
    'Scorpio': ['Control and manipulation', 'Holding grudges', 'Fear of vulnerability'],
    'Sagittarius': ['Preaching without practicing', 'Avoiding commitment', 'Intellectual arrogance'],
    'Capricorn': ['Workaholism and achievement addiction', 'Emotional coldness', 'Authoritarian tendencies'],
    'Aquarius': ['Emotional detachment', 'Rebelliousness without purpose', 'Superiority complex'],
    'Pisces': ['Victim consciousness', 'Escapism and avoidance', 'Boundary dissolution']
  };
  return patterns[sunSign] || ['Patterns ready for transformation', 'Old habits seeking evolution', 'Shadow aspects becoming conscious'];
};

export const generateAstrologyInsight = (astroData: AstrologyData, responses: string[]): string => {
  const insight = `
Your cosmic blueprint is absolutely wild... let me break down what the universe downloaded about your soul's journey:

**Your Galactic Signature:**
Sun in ${astroData.sunSign}, Moon in ${astroData.moonSign}, Rising ${astroData.risingSign} - this combo is giving ${astroData.evolutionaryTheme.toLowerCase()}.

**Soul Mission Status:**
Your North Node in ${astroData.northNode} is literally your soul's GPS coordinates for this lifetime. You came here to ${astroData.soulPurpose.toLowerCase()}.

**Galactic Center Connection:**
${astroData.galacticAlignment} - the cosmic center at 27° Sagittarius is ${astroData.galacticAlignment.includes('Direct') ? 'directly downloading' : 'working through you to'} upgrade human consciousness.

**Current Cosmic Weather:**
${astroData.currentTransits.join('. ')}. The universe is literally serving up the exact frequencies you need for your next evolution.

**What Your Responses Revealed:**
Your words are showing ${astroData.currentLessons[0].toLowerCase()} energy is activated. The way you're processing your experience tells me you're in a major ${astroData.evolutionaryTheme.split(' - ')[0].toLowerCase()} phase.

**Karmic Patterns Ready for Upgrade:**
${astroData.karmaticPatterns[0]} - this old programming is literally asking to be rewritten. Your soul is done with this frequency.

**The Real Tea:**
Your birth chart isn't just random cosmic placement - it's your soul's chosen curriculum for this incarnation. Every challenge, every gift, every weird synchronicity is part of your evolutionary design.

The Galactic Center activation means you're receiving direct downloads from the cosmic source. Trust those random insights, those sudden knowings, those moments when you just *know* something without knowing how you know it.

Your current life situation is literally your soul's chosen classroom. The universe isn't happening TO you - you're co-creating WITH it based on your pre-birth soul contracts.

The path forward: ${astroData.currentLessons.slice(0, 2).join(' and ').toLowerCase()}. Your higher self already knows the way - your job is to trust the process and follow the breadcrumbs of synchronicity.
  `.trim();
  
  return insight;
};