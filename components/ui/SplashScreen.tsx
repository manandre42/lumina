import React from 'react';

const SplashScreen: React.FC = () => {
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-lumina-blue text-white overflow-hidden">
        {/* Background Effects */}
        <div className="absolute top-[-20%] left-[-20%] w-[80%] h-[80%] bg-lumina-mint opacity-10 rounded-full blur-[120px] animate-pulse-slow"></div>
        <div className="absolute bottom-[-20%] right-[-20%] w-[80%] h-[80%] bg-lumina-orange opacity-10 rounded-full blur-[120px] animate-pulse-slow" style={{ animationDelay: '1.5s' }}></div>
        
        <div className="relative z-10 flex flex-col items-center animate-fade-in-up">
            <div className="relative mb-6">
                <div className="absolute inset-0 bg-lumina-mint blur-xl opacity-40 animate-pulse"></div>
                <div className="w-28 h-28 bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl flex items-center justify-center shadow-2xl animate-float relative z-10">
                    <i className="fa-solid fa-lightbulb text-6xl text-lumina-mint drop-shadow-[0_0_15px_rgba(63,193,201,0.6)]"></i>
                </div>
            </div>
            
            <h1 className="font-heading text-5xl font-bold tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-white via-lumina-mint to-white drop-shadow-sm mb-2">
                Lumina
            </h1>
            <p className="text-white/60 text-sm font-medium tracking-widest uppercase text-center">Micro-Learning Social</p>
        </div>

        <div className="absolute bottom-10 left-0 right-0 flex justify-center">
            <i className="fa-solid fa-circle-notch fa-spin text-lumina-mint/50 text-xl"></i>
        </div>
    </div>
  );
};

export default SplashScreen;