import React, { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { TarotCard } from '../types';

interface AstrologicalBackgroundProps {
  currentSign?: string;
  intensity?: number;
  selectedCards?: TarotCard[];
}

// DARKENED astrological colors for dark mode - maintaining energy while keeping dark aesthetic
const ASTROLOGICAL_ENERGIES = {
  'Aries': { color: '#4A0E0E', frequency: 65.41, note: 'C2' }, // Dark red
  'Taurus': { color: '#4A2A0E', frequency: 69.30, note: 'C#2' }, // Dark orange-red
  'Gemini': { color: '#4A3A0E', frequency: 73.42, note: 'D2' }, // Dark orange
  'Cancer': { color: '#4A4A0E', frequency: 77.78, note: 'D#2' }, // Dark yellow
  'Leo': { color: '#4A4A0E', frequency: 82.41, note: 'E2' }, // Dark yellow
  'Virgo': { color: '#2A4A2A', frequency: 92.50, note: 'F#2' }, // Dark green
  'Libra': { color: '#0E4A0E', frequency: 87.31, note: 'F2' }, // Dark green
  'Scorpio': { color: '#0E4A4A', frequency: 98.00, note: 'G2' }, // Dark cyan
  'Sagittarius': { color: '#0E0E4A', frequency: 103.83, note: 'G#2' }, // Dark blue
  'Capricorn': { color: '#2A0E4A', frequency: 110.00, note: 'A2' }, // Dark indigo
  'Aquarius': { color: '#4A0E4A', frequency: 116.54, note: 'A#2' }, // Dark violet
  'Pisces': { color: '#4A0E3A', frequency: 123.47, note: 'B2' }, // Dark magenta

  // Planetary correspondences with darkened colors
  'Mars': { color: '#4A0E0E', frequency: 65.41, note: 'C2' }, // Dark red like Aries
  'Mercury': { color: '#4A3A0E', frequency: 73.42, note: 'D2' }, // Dark orange like Gemini
  'Venus': { color: '#0E4A0E', frequency: 87.31, note: 'F2' }, // Dark green like Libra
  'Moon': { color: '#0E0E4A', frequency: 103.83, note: 'G#2' }, // Dark blue like Sagittarius
  'Sun': { color: '#4A4A0E', frequency: 82.41, note: 'E2' }, // Dark yellow like Leo
  'Jupiter': { color: '#4A0E4A', frequency: 116.54, note: 'A#2' }, // Dark violet like Aquarius
  'Saturn': { color: '#2A0E4A', frequency: 110.00, note: 'A2' }, // Dark indigo like Capricorn
  'Uranus': { color: '#4A0E4A', frequency: 116.54, note: 'A#2' }, // Dark violet like Aquarius
  'Neptune': { color: '#4A0E3A', frequency: 123.47, note: 'B2' }, // Dark magenta like Pisces
  'Pluto': { color: '#0E4A4A', frequency: 98.00, note: 'G2' } // Dark cyan like Scorpio
};

const AstrologicalBackground: React.FC<AstrologicalBackgroundProps> = ({ 
  currentSign = 'Sagittarius', 
  intensity = 0.3,
  selectedCards = []
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const oscillatorRef = useRef<OscillatorNode | null>(null);
  const gainNodeRef = useRef<GainNode | null>(null);
  const lfoGainRef = useRef<GainNode | null>(null); // For 4Hz modulation
  const lfoOscillatorRef = useRef<OscillatorNode | null>(null); // 4Hz LFO
  const modulatedGainRef = useRef<GainNode | null>(null); // Final modulated gain
  const [isAudioEnabled, setIsAudioEnabled] = useState(false);

  console.log('🎨 AstrologicalBackground render:', { currentSign, intensity, selectedCards: selectedCards.length });

  // Get current energy
  const currentEnergy = ASTROLOGICAL_ENERGIES[currentSign as keyof typeof ASTROLOGICAL_ENERGIES] || 
                       ASTROLOGICAL_ENERGIES.Sagittarius;

  // Initialize audio context with AUDIBLE 4Hz volume oscillation
  const initializeAudio = async () => {
    try {
      if (!audioContextRef.current) {
        audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
      }

      if (audioContextRef.current.state === 'suspended') {
        await audioContextRef.current.resume();
      }

      // Clean up existing audio
      cleanupAudio();

      const audioContext = audioContextRef.current;

      // Create main oscillator (the frequency tone)
      const oscillator = audioContext.createOscillator();
      oscillator.type = 'sine';
      oscillator.frequency.setValueAtTime(currentEnergy.frequency, audioContext.currentTime);

      // Create main gain node for base volume - AUDIBLE LEVEL
      const mainGain = audioContext.createGain();
      mainGain.gain.setValueAtTime(0, audioContext.currentTime);
      mainGain.gain.linearRampToValueAtTime(0.05, audioContext.currentTime + 2); // AUDIBLE base volume

      // Create LFO (Low Frequency Oscillator) for 4Hz modulation
      const lfoOscillator = audioContext.createOscillator();
      lfoOscillator.type = 'sine';
      lfoOscillator.frequency.setValueAtTime(4, audioContext.currentTime); // 4Hz oscillation

      // Create LFO gain node to control modulation depth - AUDIBLE MODULATION
      const lfoGain = audioContext.createGain();
      lfoGain.gain.setValueAtTime(0.03, audioContext.currentTime); // AUDIBLE modulation depth

      // Create final gain node that will be modulated
      const modulatedGain = audioContext.createGain();
      modulatedGain.gain.setValueAtTime(0.05, audioContext.currentTime); // AUDIBLE center point

      // Connect the audio chain:
      // Main oscillator -> Main gain -> Modulated gain -> Destination
      // LFO oscillator -> LFO gain -> Modulated gain (for modulation)
      oscillator.connect(mainGain);
      mainGain.connect(modulatedGain);
      modulatedGain.connect(audioContext.destination);

      // Connect LFO for volume modulation
      lfoOscillator.connect(lfoGain);
      lfoGain.connect(modulatedGain.gain); // Modulate the gain

      // Start both oscillators
      oscillator.start();
      lfoOscillator.start();
      
      // Store references
      oscillatorRef.current = oscillator;
      gainNodeRef.current = mainGain;
      lfoGainRef.current = lfoGain;
      lfoOscillatorRef.current = lfoOscillator;
      modulatedGainRef.current = modulatedGain;

      setIsAudioEnabled(true);

      console.log('🎵 AUDIBLE audio with 4Hz oscillation initialized:', currentEnergy.frequency, 'Hz');

    } catch (error) {
      console.log('Audio initialization failed:', error);
    }
  };

  // Clean up audio
  const cleanupAudio = () => {
    if (oscillatorRef.current) {
      try {
        oscillatorRef.current.stop();
      } catch (e) {
        // Oscillator might already be stopped
      }
      oscillatorRef.current = null;
    }
    
    if (lfoOscillatorRef.current) {
      try {
        lfoOscillatorRef.current.stop();
      } catch (e) {
        // LFO might already be stopped
      }
      lfoOscillatorRef.current = null;
    }
    
    if (gainNodeRef.current) {
      gainNodeRef.current.disconnect();
      gainNodeRef.current = null;
    }
    
    if (lfoGainRef.current) {
      lfoGainRef.current.disconnect();
      lfoGainRef.current = null;
    }

    if (modulatedGainRef.current) {
      modulatedGainRef.current.disconnect();
      modulatedGainRef.current = null;
    }
  };

  // Handle user interaction to enable audio
  const handleUserInteraction = () => {
    if (!isAudioEnabled) {
      initializeAudio();
    }
  };

  useEffect(() => {
    // Add event listeners for user interaction
    document.addEventListener('click', handleUserInteraction);
    document.addEventListener('keydown', handleUserInteraction);
    document.addEventListener('touchstart', handleUserInteraction);

    return () => {
      document.removeEventListener('click', handleUserInteraction);
      document.removeEventListener('keydown', handleUserInteraction);
      document.removeEventListener('touchstart', handleUserInteraction);
      cleanupAudio();
    };
  }, []);

  // Update frequency when sign changes (with smooth transition)
  useEffect(() => {
    if (oscillatorRef.current && audioContextRef.current) {
      // Smooth frequency transition
      oscillatorRef.current.frequency.linearRampToValueAtTime(
        currentEnergy.frequency, 
        audioContextRef.current.currentTime + 3
      );
      console.log('🎵 Frequency transitioning to:', currentEnergy.frequency, 'Hz with AUDIBLE 4Hz oscillation');
    }
  }, [currentSign]);

  // Enhanced fade-out effect with AUDIBLE levels
  useEffect(() => {
    if (gainNodeRef.current && audioContextRef.current && isAudioEnabled) {
      const currentTime = audioContextRef.current.currentTime;
      
      // If intensity is very low, gradually fade to silence
      if (intensity < 0.2) {
        console.log('🔇 Fading audio to silence due to low intensity');
        gainNodeRef.current.gain.linearRampToValueAtTime(0, currentTime + 4);
        
        // Also reduce LFO modulation depth
        if (lfoGainRef.current) {
          lfoGainRef.current.gain.linearRampToValueAtTime(0, currentTime + 4);
        }
      } else {
        // Maintain AUDIBLE volume with 4Hz oscillation
        const targetVolume = Math.max(intensity * 0.08, 0.03); // AUDIBLE levels
        gainNodeRef.current.gain.linearRampToValueAtTime(targetVolume, currentTime + 2);
        
        // Adjust LFO modulation depth based on intensity - AUDIBLE MODULATION
        if (lfoGainRef.current) {
          const modulationDepth = targetVolume * 0.8; // Strong modulation for audible effect
          lfoGainRef.current.gain.linearRampToValueAtTime(modulationDepth, currentTime + 2);
        }

        // Update modulated gain center point
        if (modulatedGainRef.current) {
          modulatedGainRef.current.gain.setValueAtTime(targetVolume, currentTime);
        }
      }
    }
  }, [intensity, isAudioEnabled]);

  // DARK MODE BACKGROUND UPDATE - maintains dark aesthetic with energy colors
  useEffect(() => {
    console.log('🎨 DARK MODE background update:', currentSign, currentEnergy.color, 'intensity:', intensity);
    
    // Convert hex to rgba with proper opacity for dark mode
    const hexToRgba = (hex: string, alpha: number) => {
      const r = parseInt(hex.slice(1, 3), 16);
      const g = parseInt(hex.slice(3, 5), 16);
      const b = parseInt(hex.slice(5, 7), 16);
      return `rgba(${r}, ${g}, ${b}, ${alpha})`;
    };

    // Calculate responsive intensity - more subtle for dark mode
    const responsiveIntensity = Math.max(intensity * 0.6, 0.2); // Visible but not overwhelming
    
    // Create the dark energy-responsive gradient
    const darkEnergyGradient = `
      radial-gradient(
        ellipse 140% 110% at 50% 50%, 
        ${hexToRgba(currentEnergy.color, responsiveIntensity)} 0%, 
        ${hexToRgba(currentEnergy.color, responsiveIntensity * 0.8)} 25%, 
        ${hexToRgba(currentEnergy.color, responsiveIntensity * 0.5)} 50%, 
        ${hexToRgba(currentEnergy.color, responsiveIntensity * 0.2)} 75%, 
        #0f0f23 100%
      )
    `;

    // FORCE APPLICATION to multiple targets with dark mode colors
    const forceBackgroundUpdate = () => {
      console.log('🌙 FORCING dark mode background application with gradient:', darkEnergyGradient);
      
      // 1. Container element
      if (containerRef.current) {
        containerRef.current.style.background = darkEnergyGradient;
        containerRef.current.style.setProperty('background', darkEnergyGradient, 'important');
      }
      
      // 2. Document body - FORCE
      document.body.style.background = darkEnergyGradient;
      document.body.style.setProperty('background', darkEnergyGradient, 'important');
      
      // 3. HTML element - FORCE
      document.documentElement.style.background = darkEnergyGradient;
      document.documentElement.style.setProperty('background', darkEnergyGradient, 'important');
      
      // 4. Root element - FORCE
      const root = document.getElementById('root');
      if (root) {
        root.style.background = darkEnergyGradient;
        root.style.setProperty('background', darkEnergyGradient, 'important');
      }

      // 5. Find and update any other background elements
      const allElements = document.querySelectorAll('*');
      allElements.forEach(element => {
        const computedStyle = window.getComputedStyle(element);
        if (computedStyle.position === 'fixed' && 
            (computedStyle.zIndex === '-20' || computedStyle.zIndex === '-10')) {
          (element as HTMLElement).style.setProperty('background', darkEnergyGradient, 'important');
        }
      });
      
      console.log('✨ DARK MODE background update complete for:', currentEnergy.color);
    };

    // Apply immediately
    forceBackgroundUpdate();
    
    // Apply again after delays to override any other styles
    setTimeout(forceBackgroundUpdate, 50);
    setTimeout(forceBackgroundUpdate, 200);
    setTimeout(forceBackgroundUpdate, 500);

  }, [currentSign, intensity, currentEnergy.color]);

  // GSAP animation for smooth transitions
  useEffect(() => {
    if (containerRef.current) {
      gsap.to(containerRef.current, {
        duration: 2,
        ease: 'power2.out',
        onComplete: () => {
          console.log('🌈 Background transition animation complete');
        }
      });
    }
  }, [currentSign]);

  // Get brighter version of color for the indicator
  const getBrighterColor = (darkColor: string): string => {
    // Convert dark color to brighter version for indicator
    const colorMap: { [key: string]: string } = {
      '#4A0E0E': '#FF4444', // Aries - bright red
      '#4A2A0E': '#FF8844', // Taurus - bright orange-red
      '#4A3A0E': '#FFAA44', // Gemini - bright orange
      '#4A4A0E': '#FFFF44', // Cancer/Leo - bright yellow
      '#2A4A2A': '#44FF44', // Virgo - bright green
      '#0E4A0E': '#44FF44', // Libra - bright green
      '#0E4A4A': '#44FFFF', // Scorpio - bright cyan
      '#0E0E4A': '#4444FF', // Sagittarius - bright blue
      '#2A0E4A': '#8844FF', // Capricorn - bright indigo
      '#4A0E4A': '#FF44FF', // Aquarius - bright violet
      '#4A0E3A': '#FF44AA', // Pisces - bright magenta
    };
    return colorMap[darkColor] || '#4444FF';
  };

  return (
    <>
      {/* Main astrological background - DARK MODE ENERGY COLORS */}
      <div 
        ref={containerRef}
        className="fixed inset-0 pointer-events-none overflow-hidden"
        style={{
          zIndex: -20,
          background: `radial-gradient(ellipse 140% 110% at 50% 50%, 
            rgba(${parseInt(currentEnergy.color.slice(1, 3), 16)}, ${parseInt(currentEnergy.color.slice(3, 5), 16)}, ${parseInt(currentEnergy.color.slice(5, 7), 16)}, ${Math.max(intensity * 0.6, 0.2)}) 0%, 
            rgba(${parseInt(currentEnergy.color.slice(1, 3), 16)}, ${parseInt(currentEnergy.color.slice(3, 5), 16)}, ${parseInt(currentEnergy.color.slice(5, 7), 16)}, ${Math.max(intensity * 0.6, 0.2) * 0.8}) 25%, 
            rgba(${parseInt(currentEnergy.color.slice(1, 3), 16)}, ${parseInt(currentEnergy.color.slice(3, 5), 16)}, ${parseInt(currentEnergy.color.slice(5, 7), 16)}, ${Math.max(intensity * 0.6, 0.2) * 0.5}) 50%, 
            rgba(${parseInt(currentEnergy.color.slice(1, 3), 16)}, ${parseInt(currentEnergy.color.slice(3, 5), 16)}, ${parseInt(currentEnergy.color.slice(5, 7), 16)}, ${Math.max(intensity * 0.6, 0.2) * 0.2}) 75%, 
            #0f0f23 100%)`,
          width: '100vw',
          height: '100vh',
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0
        }}
      />
      
      {/* Enhanced energy indicator - shows current active energy with bright colors and audio status */}
      <div className="fixed top-4 right-4 z-50 glass-effect rounded-lg p-3 text-xs text-cosmic-200">
        <div className="flex items-center space-x-3">
          <div 
            className="w-6 h-6 rounded-full border-2 border-white/50 flex items-center justify-center relative"
            style={{ 
              backgroundColor: getBrighterColor(currentEnergy.color),
              boxShadow: `0 0 12px ${getBrighterColor(currentEnergy.color)}60`
            }}
          >
            <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
            {/* 4Hz oscillation indicator */}
            {isAudioEnabled && (
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-400 rounded-full animate-pulse border border-white/50" 
                   title="4Hz Audio Oscillation Active" />
            )}
          </div>
          <div>
            <div className="font-bold text-white">{currentSign}</div>
            <div className="text-cosmic-300">{Math.round(intensity * 100)}% active</div>
          </div>
        </div>
        <div className="mt-2 text-xs text-cosmic-400">
          {currentEnergy.frequency.toFixed(1)} Hz • {currentEnergy.note}
          {isAudioEnabled && (
            <div className="text-green-400 mt-1">4Hz oscillation AUDIBLE</div>
          )}
        </div>
      </div>

      {/* Enhanced audio activation hint */}
      {!isAudioEnabled && (
        <div className="fixed bottom-4 right-4 z-50 text-xs text-cosmic-400 opacity-60 bg-black/20 rounded px-2 py-1">
          Click for AUDIBLE 4Hz frequency oscillation
        </div>
      )}
    </>
  );
};

export default AstrologicalBackground;