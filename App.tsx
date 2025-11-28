import React from 'react';
import Onboarding from './features/onboarding/components/Onboarding';
import Profile from './features/profile/components/Profile';
import LessonCard from './features/feed/components/LessonCard';
import CreateModal from './features/studio/components/CreateModal';
import SplashScreen from './components/ui/SplashScreen';
import { useAppLogic } from './hooks/useAppLogic';

const App: React.FC = () => {
  const {
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
  } = useAppLogic();

  if (showSplash) {
    return <SplashScreen />;
  }

  return (
    <div className="h-[100dvh] w-full bg-black font-sans text-lumina-text relative overflow-hidden">
      
      {view === 'onboarding' && (
        <div className="absolute inset-0 z-50 animate-fade-in">
           <Onboarding onComplete={handleOnboardingComplete} />
        </div>
      )}

      {view === 'feed' && (
        <div 
          ref={feedContainerRef}
          className="h-full w-full overflow-y-scroll snap-y snap-mandatory no-scrollbar bg-black"
        >
          <header className="fixed top-0 left-0 right-0 z-40 p-4 bg-gradient-to-b from-black/60 to-transparent pointer-events-none">
            <div className="flex justify-between items-center pointer-events-auto">
               <h1 className="font-heading font-bold text-xl text-white tracking-tight drop-shadow-md">Lumina</h1>
               <div className="flex space-x-4 text-white/80 text-sm font-bold shadow-sm">
                 <button className="opacity-50 hover:opacity-100 transition-opacity">Seguindo</button>
                 <button className="border-b-2 border-white">Para Você</button>
               </div>
               <div className="w-6"></div>
            </div>
          </header>

          {isLoadingFeed ? (
            <div className="h-full flex flex-col items-center justify-center text-white space-y-4">
               <i className="fa-solid fa-circle-notch fa-spin text-4xl text-lumina-mint"></i>
               <p className="animate-pulse">Curando conhecimento...</p>
            </div>
          ) : (
            <>
              {lessons.map((lesson) => (
                <LessonCard 
                  key={lesson.id} 
                  lesson={lesson} 
                  onLike={handleLike} 
                  onShare={handleShare}
                  onRemix={handleRemix}
                  onProfile={() => setView('profile')}
                  onCreate={handleFabAction}
                  isActive={true}
                />
              ))}
              
              <div className="h-32 w-full snap-start flex items-center justify-center bg-black text-white">
                 <button onClick={fetchInitialLessons} className="px-6 py-3 border border-white/30 rounded-full hover:bg-white/10 transition-colors">
                    Carregar Mais
                 </button>
              </div>
            </>
          )}
        </div>
      )}

      {view === 'profile' && (
        <div className="absolute inset-0 z-50 bg-lumina-bg overflow-y-auto animate-slide-up">
           <Profile 
              user={user} 
              likedLessons={likedLessons} 
              createdLessons={userCreatedLessons}
              onBack={() => setView('feed')} 
           />
        </div>
      )}

      <CreateModal 
        isOpen={isCreating}
        onClose={() => setIsCreating(false)}
        remixSource={remixSource}
        onPublish={handlePublish}
      />
    </div>
  );
};

export default App;