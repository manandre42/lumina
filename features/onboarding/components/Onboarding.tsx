import React, { useState } from 'react';
import { INTERESTS_LIST } from '../../../types/index';

interface OnboardingProps {
  onComplete: (interests: string[]) => void;
}

const Onboarding: React.FC<OnboardingProps> = ({ onComplete }) => {
  const [selectedInterests, setSelectedInterests] = useState<string[]>([]);

  const toggleInterest = (interest: string) => {
    setSelectedInterests(prev => 
      prev.includes(interest) 
        ? prev.filter(i => i !== interest)
        : [...prev, interest]
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-lumina-blue to-[#0f1e4a] flex flex-col items-center justify-center p-6 text-white relative overflow-hidden">
      {/* Background Orbs */}
      <div className="absolute top-0 left-0 w-80 h-80 bg-lumina-mint opacity-20 rounded-full blur-[100px] -translate-x-1/2 -translate-y-1/2 animate-pulse-slow"></div>
      <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-lumina-orange opacity-15 rounded-full blur-[120px] translate-x-1/3 translate-y-1/3 animate-pulse-slow" style={{ animationDelay: '2s' }}></div>

      <div className="z-10 w-full max-w-md flex flex-col h-full justify-center">
        
        {/* Logo Section */}
        <div className="mb-12 text-center">
          <div className="relative inline-block mb-6">
             <div className="absolute inset-0 bg-lumina-mint blur-md opacity-50 rounded-full"></div>
             <div className="w-20 h-20 bg-white/10 backdrop-blur-xl rounded-2xl flex items-center justify-center border border-white/20 shadow-2xl relative z-10">
               <i className="fa-solid fa-lightbulb text-4xl text-lumina-mint drop-shadow-[0_0_10px_rgba(63,193,201,0.8)]"></i>
             </div>
          </div>
          <h1 className="font-heading text-4xl font-bold mb-3 tracking-tight">Bem-vindo ao Lumina</h1>
          <p className="text-white/70 text-base font-light max-w-xs mx-auto">
            Personalize seu feed de conhecimento. O que você quer descobrir hoje?
          </p>
        </div>

        {/* Interests Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-12">
          {INTERESTS_LIST.map((interest) => {
            const isSelected = selectedInterests.includes(interest);
            return (
              <button
                key={interest}
                onClick={() => toggleInterest(interest)}
                className={`group relative p-3 rounded-xl text-sm font-semibold transition-all duration-300 border backdrop-blur-sm overflow-hidden
                  ${isSelected 
                    ? 'bg-lumina-mint/20 border-lumina-mint text-white shadow-[0_0_15px_rgba(63,193,201,0.3)]' 
                    : 'bg-white/5 border-white/10 text-gray-300 hover:bg-white/10 hover:border-white/30'}`}
              >
                <div className={`absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent translate-x-[-100%] transition-transform duration-700 ${isSelected ? 'group-hover:translate-x-[100%]' : ''}`}></div>
                <span className="relative z-10">{interest}</span>
                {isSelected && <i className="fa-solid fa-check absolute top-2 right-2 text-[10px] text-lumina-mint"></i>}
              </button>
            );
          })}
        </div>

        {/* Action Button */}
        <button
          onClick={() => onComplete(selectedInterests)}
          disabled={selectedInterests.length === 0}
          className={`w-full py-4 rounded-2xl font-bold text-lg transition-all duration-300 shadow-xl flex items-center justify-center space-x-2
            ${selectedInterests.length > 0 
              ? 'bg-gradient-to-r from-lumina-mint to-teal-500 text-white hover:shadow-lumina-mint/40 hover:-translate-y-1' 
              : 'bg-white/10 text-white/30 cursor-not-allowed border border-white/5'}`}
        >
          <span>Começar Jornada</span>
          <i className={`fa-solid fa-arrow-right transition-transform ${selectedInterests.length > 0 ? 'group-hover:translate-x-1' : ''}`}></i>
        </button>
      </div>
    </div>
  );
};

export default Onboarding;