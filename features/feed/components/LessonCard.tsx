
import React, { useState, useEffect, useRef } from 'react';
import { Lesson } from '../../../types/index';
import { generateLessonAudio } from '../../../services/geminiService';

interface LessonCardProps {
  lesson: Lesson;
  onLike: (id: string) => void;
  onShare: (id: string) => void;
  onRemix: (lesson: Lesson) => void;
  onProfile: () => void;
  onCreate: () => void;
  isActive: boolean;
}

const getCategoryStyles = (category: string) => {
  const normalized = category.split(' ')[0].toLowerCase();
  
  const styles: Record<string, { bg: string, text: string }> = {
    'tecnologia': { bg: 'from-blue-900 to-cyan-800', text: 'text-cyan-400' },
    'ciência': { bg: 'from-emerald-900 to-teal-800', text: 'text-emerald-400' },
    'história': { bg: 'from-amber-900 to-orange-800', text: 'text-amber-400' },
    'filosofia': { bg: 'from-violet-900 to-purple-800', text: 'text-violet-400' },
    'psicologia': { bg: 'from-rose-900 to-pink-800', text: 'text-rose-400' },
    'negócios': { bg: 'from-slate-900 to-gray-800', text: 'text-slate-400' },
    'arte': { bg: 'from-fuchsia-900 to-pink-800', text: 'text-fuchsia-400' },
    'literatura': { bg: 'from-indigo-900 to-blue-800', text: 'text-indigo-400' },
    'saúde': { bg: 'from-green-900 to-lime-800', text: 'text-green-400' },
    'comunidade': { bg: 'from-gray-900 to-gray-800', text: 'text-lumina-mint' }
  };

  return styles[normalized] || { bg: 'from-gray-900 to-blue-900', text: 'text-blue-400' };
};

const base64ToUint8Array = (base64: string) => {
  const binaryString = window.atob(base64);
  const len = binaryString.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes;
};

const LessonCard: React.FC<LessonCardProps> = ({ lesson, onLike, onShare, onRemix, onProfile, onCreate, isActive }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [loadingAudio, setLoadingAudio] = useState(false);
  const [showFullText, setShowFullText] = useState(false);

  const audioContextRef = useRef<AudioContext | null>(null);
  const sourceNodeRef = useRef<AudioBufferSourceNode | null>(null);

  const theme = getCategoryStyles(lesson.category);

  useEffect(() => {
    return () => {
      stopAudio();
      if (audioContextRef.current?.state !== 'closed') {
        audioContextRef.current?.close();
      }
    };
  }, []);

  useEffect(() => {
    if (!isActive && isPlaying) {
      stopAudio();
    }
  }, [isActive]);

  const stopAudio = () => {
    if (sourceNodeRef.current) {
      try {
        sourceNodeRef.current.stop();
        sourceNodeRef.current.disconnect();
      } catch (e) {
      }
      sourceNodeRef.current = null;
    }
    setIsPlaying(false);
  };

  const playPCMData = async (base64Data: string) => {
    try {
        if (!audioContextRef.current) {
            audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
        }
        
        const ctx = audioContextRef.current;
        if (ctx.state === 'suspended') {
            await ctx.resume();
        }

        const uint8Array = base64ToUint8Array(base64Data);
        const int16Array = new Int16Array(uint8Array.buffer);
        
        const audioBuffer = ctx.createBuffer(1, int16Array.length, 24000);
        const channelData = audioBuffer.getChannelData(0);
        
        for (let i = 0; i < int16Array.length; i++) {
            channelData[i] = int16Array[i] / 32768.0;
        }

        const source = ctx.createBufferSource();
        source.buffer = audioBuffer;
        source.connect(ctx.destination);
        source.onended = () => setIsPlaying(false);
        
        sourceNodeRef.current = source;
        source.start();
        setIsPlaying(true);

    } catch (error) {
        console.error("Audio playback error:", error);
        setIsPlaying(false);
    }
  };

  const handlePlayAudio = async (e?: React.MouseEvent) => {
    e?.stopPropagation();
    
    if (isPlaying) {
      stopAudio();
      return;
    }

    if (lesson.audioBase64) {
      playPCMData(lesson.audioBase64);
      return;
    }

    setLoadingAudio(true);
    const generatedAudio = await generateLessonAudio(lesson.fullContent);
    setLoadingAudio(false);

    if (generatedAudio) {
      lesson.audioBase64 = generatedAudio;
      playPCMData(generatedAudio);
    }
  };

  return (
    <div className={`w-full h-[100dvh] snap-start relative flex flex-col justify-end bg-gradient-to-br ${theme.bg} overflow-hidden`}>
      
      <div className="absolute inset-0 opacity-20 pointer-events-none">
         <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-white rounded-full blur-[100px] mix-blend-overlay animate-pulse"></div>
         <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-black rounded-full blur-[80px] mix-blend-overlay"></div>
      </div>

      <div className="relative z-10 p-5 pb-10 w-full max-w-md mx-auto flex flex-col justify-end h-full pointer-events-none">
        
        <div className="pointer-events-auto">
            {lesson.referencedLesson && (
            <div className="mb-4 bg-white/10 backdrop-blur-sm border-l-4 border-lumina-orange p-3 rounded-r-lg max-w-[85%]">
                <div className="text-[10px] text-gray-300 uppercase font-bold mb-1">
                <i className="fa-solid fa-reply mr-1"></i> Respondendo a
                </div>
                <p className="text-white text-xs font-bold line-clamp-1">{lesson.referencedLesson.title}</p>
                <p className="text-white/60 text-[10px]">@{lesson.referencedLesson.author}</p>
            </div>
            )}

            <div className="flex justify-between items-center mb-3">
            <div className="flex items-center space-x-2">
                <span className={`px-3 py-1 rounded-full bg-black/40 backdrop-blur-md text-xs font-bold uppercase tracking-wider ${theme.text} border border-white/10`}>
                {lesson.category}
                </span>
                {lesson.source && (
                <span className="text-[10px] text-white/50 bg-black/20 px-2 py-0.5 rounded flex items-center gap-1">
                    <i className="fa-solid fa-link"></i> {lesson.source}
                </span>
                )}
            </div>
            </div>

            <h2 className="text-2xl font-heading font-bold text-white mb-2 leading-tight drop-shadow-md pr-12">
            {lesson.title}
            </h2>

            <div className="bg-black/20 backdrop-blur-sm rounded-xl p-4 border border-white/5 mb-2">
                <p className="text-white/90 text-sm font-medium italic mb-2">
                "{lesson.summary}"
                </p>
                
                <div className={`text-white/70 text-sm leading-relaxed transition-all duration-300 overflow-y-auto ${showFullText ? 'max-h-60' : 'max-h-20 mask-linear-fade'}`}>
                {showFullText ? lesson.fullContent : lesson.fullContent.substring(0, 100) + '...'}
                </div>
                
                <button 
                onClick={() => setShowFullText(!showFullText)}
                className="mt-2 text-xs font-bold text-white/80 hover:text-white flex items-center"
                >
                {showFullText ? 'Ler menos' : 'Ler tudo'} 
                <i className={`ml-1 fa-solid fa-chevron-${showFullText ? 'up' : 'down'}`}></i>
                </button>
            </div>
        </div>

      </div>

      <div className="absolute right-4 bottom-24 z-20 flex flex-col items-center space-y-6">
        
        <div className="flex items-center space-x-2 mb-2">
            <button 
                onClick={handlePlayAudio}
                className="w-10 h-10 rounded-full bg-white/20 hover:bg-white/30 backdrop-blur-md border border-white/20 flex items-center justify-center text-white transition-all shadow-lg"
                aria-label={isPlaying ? "Pausar" : "Ouvir"}
            >
                {loadingAudio ? (
                    <i className="fa-solid fa-circle-notch fa-spin text-xs"></i>
                ) : (
                    <i className={`fa-solid ${isPlaying ? 'fa-pause' : 'fa-play'} text-sm`}></i>
                )}
            </button>

            <button 
               onClick={() => onRemix(lesson)}
               className="h-10 px-3 bg-white/20 hover:bg-white/30 backdrop-blur-md rounded-full border border-white/20 text-white text-xs font-bold flex items-center transition-all shadow-lg"
            >
               <i className="fa-solid fa-quote-right mr-1.5"></i>
               <span>CITAR</span>
            </button>
        </div>

        <div className="relative group">
           <div className="w-10 h-10 rounded-full border-2 border-white p-0.5 overflow-hidden">
             <img src={`https://picsum.photos/seed/${lesson.id}/100`} alt="Avatar" className="w-full h-full rounded-full object-cover" />
           </div>
        </div>

        <button onClick={() => onLike(lesson.id)} className="flex flex-col items-center group">
          <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${lesson.isLiked ? 'text-red-500' : 'text-white bg-black/40 hover:bg-black/60'}`}>
            <i className={`text-2xl fa-solid fa-heart ${lesson.isLiked ? 'animate-heart-beat' : ''}`}></i>
          </div>
          <span className="text-white text-xs font-bold drop-shadow-md mt-1">{lesson.likes}</span>
        </button>

        <button onClick={onCreate} className="flex flex-col items-center group">
          <div className="w-10 h-10 rounded-full bg-lumina-mint flex items-center justify-center text-white hover:bg-lumina-mint/80 transition-all border-2 border-white">
            <i className="text-xl fa-solid fa-plus"></i>
          </div>
          <span className="text-white text-xs font-bold drop-shadow-md mt-1">Criar</span>
        </button>

        <button onClick={onProfile} className="flex flex-col items-center group">
           <div className="w-10 h-10 rounded-full bg-black/40 flex items-center justify-center text-white hover:bg-lumina-blue transition-all border border-transparent hover:border-lumina-mint">
             <i className="text-xl fa-solid fa-user"></i>
           </div>
           <span className="text-white text-xs font-bold drop-shadow-md mt-1">Perfil</span>
        </button>

      </div>
    </div>
  );
};

export default LessonCard;
