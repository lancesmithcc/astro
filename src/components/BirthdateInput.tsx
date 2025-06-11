import React, { useState } from 'react';
import { Calendar, MapPin, Clock } from 'lucide-react';
import { gsap } from 'gsap';

interface BirthdateInputProps {
  onBirthdateSubmit: (birthData: BirthData) => void;
}

export interface BirthData {
  date: string;
  time: string;
  location: string;
  latitude?: number;
  longitude?: number;
}

const BirthdateInput: React.FC<BirthdateInputProps> = ({ onBirthdateSubmit }) => {
  const [birthData, setBirthData] = useState<BirthData>({
    date: '',
    time: '',
    location: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!birthData.date || !birthData.time || !birthData.location) return;

    setIsSubmitting(true);
    
    // Animate submission
    gsap.to('.birthdate-form', {
      scale: 0.95,
      opacity: 0.8,
      duration: 0.3,
      ease: 'power2.out'
    });

    setTimeout(() => {
      onBirthdateSubmit(birthData);
    }, 500);
  };

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="glass-effect rounded-2xl p-6 border border-cosmic-500/30">
        <div className="text-center mb-6">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full cosmic-gradient flex items-center justify-center">
            <Calendar className="w-8 h-8 text-white" />
          </div>
          <h3 className="text-xl font-bold text-cosmic-200 mb-2">
            Your Cosmic Blueprint
          </h3>
          <p className="text-sm text-cosmic-400">
            Let's map your soul's journey through the stars
          </p>
        </div>

        <form onSubmit={handleSubmit} className="birthdate-form space-y-4">
          <div>
            <label className="block text-sm font-medium text-cosmic-300 mb-2">
              <Calendar className="w-4 h-4 inline mr-2" />
              Birth Date
            </label>
            <input
              type="date"
              value={birthData.date}
              onChange={(e) => setBirthData(prev => ({ ...prev, date: e.target.value }))}
              className="w-full bg-void-800 border border-cosmic-500 rounded-lg p-3 text-cosmic-100 
                       focus:border-aurora-400 focus:outline-none transition-colors"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-cosmic-300 mb-2">
              <Clock className="w-4 h-4 inline mr-2" />
              Birth Time
            </label>
            <input
              type="time"
              value={birthData.time}
              onChange={(e) => setBirthData(prev => ({ ...prev, time: e.target.value }))}
              className="w-full bg-void-800 border border-cosmic-500 rounded-lg p-3 text-cosmic-100 
                       focus:border-aurora-400 focus:outline-none transition-colors"
              required
            />
            <p className="text-xs text-cosmic-500 mt-1">
              Exact time creates more precise readings
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-cosmic-300 mb-2">
              <MapPin className="w-4 h-4 inline mr-2" />
              Birth Location
            </label>
            <input
              type="text"
              value={birthData.location}
              onChange={(e) => setBirthData(prev => ({ ...prev, location: e.target.value }))}
              placeholder="City, Country"
              className="w-full bg-void-800 border border-cosmic-500 rounded-lg p-3 text-cosmic-100 
                       placeholder-cosmic-500 focus:border-aurora-400 focus:outline-none transition-colors"
              required
            />
          </div>

          <button
            type="submit"
            disabled={!birthData.date || !birthData.time || !birthData.location || isSubmitting}
            className="w-full cosmic-gradient py-3 rounded-lg font-semibold text-white
                     hover:scale-105 transition-all duration-300 disabled:opacity-50 
                     disabled:cursor-not-allowed disabled:hover:scale-100"
          >
            {isSubmitting ? (
              <div className="flex items-center justify-center">
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                Calculating your cosmic signature...
              </div>
            ) : (
              'Begin Your Reading'
            )}
          </button>
        </form>

        <div className="mt-4 text-xs text-cosmic-500 text-center">
          <p>Your birth data creates your unique astrological blueprint.</p>
          <p>We use evolutionary astrology with the Galactic Center at 27° Sagittarius.</p>
        </div>
      </div>
    </div>
  );
};

export default BirthdateInput;