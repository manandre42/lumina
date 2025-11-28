import { useState, useEffect, useRef } from 'react';
import { User, Lesson, ViewState, MOCK_USER } from '../types/index';
import { generateLessonContent } from '../services/geminiService';

export const useAppLogic = () => {
  const [showSplash, setShowSplash] = useState(true); // Splash screen state
  const [user, setUser] = useState<User>(MOCK_USER);
  const [view, setView] = useState<ViewState>('onboarding');
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [likedLessons, setLikedLessons] = useState<Lesson[]>([]);
  const [isLoadingFeed, setIsLoadingFeed] = useState(false);
  const feedContainerRef = useRef<HTMLDivElement>(null);
  
  const [isCreating, setIsCreating] = useState(false);
  const [remixSource, setRemixSource] = useState<Lesson | null>(null);

  // Splash Screen Logic
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowSplash(false);
    }, 2500); // 2.5 seconds splash
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const storedInterests = localStorage.getItem('lumina_interests');
    if (storedInterests) {
        setUser(prev => ({ ...prev, interests: JSON.parse(storedInterests) }));
        setView('feed');
    }
  }, []);

  useEffect(() => {
    if (view === 'feed' && lessons.length === 0 && user.interests.length > 0) {
      fetchInitialLessons();
    }
  }, [view, user.interests]);

  const fetchInitialLessons = async () => {
    setIsLoadingFeed(true);
    const newLessons: Lesson[] = [];
    const sourceInterests = user.interests.length > 0 ? user.interests : ['Tecnologia', 'Ciência', 'História'];
    const interestsToFetch = sourceInterests.sort(() => 0.5 - Math.random()).slice(0, 3);
    
    for (const interest of interestsToFetch) {
        const content = await generateLessonContent(interest);
        if (content) {
            newLessons.push({
                id: Math.random().toString(36).substr(2, 9),
                title: content.title || 'Lição Sem Título',
                summary: content.summary || 'Sem resumo disponível.',
                fullContent: content.fullContent || 'Conteúdo indisponível.',
                category: content.category || interest,
                likes: Math.floor(Math.random() * 100),
                comments: [],
                isLiked: false,
                isLoadingAudio: false,
                isUserCreated: false
            });
        }
    }
    
    if (newLessons.length === 0) {
        newLessons.push({
            id: 'demo-1',
            title: 'A Técnica Pomodoro',
            summary: 'Um método de gestão de tempo que usa intervalos.',
            fullContent: 'A Técnica Pomodoro é um método de gerenciamento de tempo desenvolvido por Francesco Cirillo. A técnica usa um cronômetro para dividir o trabalho em intervalos, tradicionalmente de 25 minutos.',
            category: 'Produtividade',
            source: 'Wikipedia',
            likes: 42,
            comments: [],
            isLiked: false,
            isUserCreated: false
        });
    }

    setLessons(newLessons);
    setIsLoadingFeed(false);
  };

  const handleOnboardingComplete = (interests: string[]) => {
    setUser(prev => ({ ...prev, interests }));
    localStorage.setItem('lumina_interests', JSON.stringify(interests));
    setView('feed');
  };

  const handleLike = (id: string) => {
    setLessons(prev => prev.map(l => {
      if (l.id === id) {
        const isLiked = !l.isLiked;
        const newLikes = isLiked ? l.likes + 1 : l.likes - 1;
        if (isLiked) {
            setLikedLessons(current => [...current, { ...l, isLiked: true, likes: newLikes }]);
        } else {
            setLikedLessons(current => current.filter(item => item.id !== id));
        }
        return { ...l, isLiked, likes: newLikes };
      }
      return l;
    }));
  };

  const handleShare = (id: string) => {
      alert("Link copiado! (Simulado)");
  };

  const handleRemix = (lesson: Lesson) => {
    setRemixSource(lesson);
    setIsCreating(true);
  };

  const handleFabAction = () => {
    setRemixSource(null);
    setIsCreating(true);
  };

  const handlePublish = (title: string, content: string, source: string, tag: string) => {
    const newLesson: Lesson = {
        id: Math.random().toString(36).substr(2, 9),
        title: title,
        summary: content.substring(0, 50) + "...", 
        fullContent: content,
        category: tag,
        source: source,
        likes: 0,
        comments: [],
        isLiked: false,
        isUserCreated: true,
        referencedLesson: remixSource ? {
          id: remixSource.id,
          title: remixSource.title,
          author: 'Instrutor IA'
        } : undefined
    };

    setLessons(prev => [newLesson, ...prev]);
    if (feedContainerRef.current) feedContainerRef.current.scrollTop = 0;
    
    setIsCreating(false);
    setRemixSource(null);
  };

  const userCreatedLessons = lessons.filter(l => l.isUserCreated);

  return {
    showSplash,
    user,
    view,
    setView,
    lessons,
    likedLessons,
    userCreatedLessons,
    isLoadingFeed,
    feedContainerRef,
    isCreating,
    setIsCreating,
    remixSource,
    fetchInitialLessons,
    handleOnboardingComplete,
    handleLike,
    handleShare,
    handleRemix,
    handleFabAction,
    handlePublish
  };
};