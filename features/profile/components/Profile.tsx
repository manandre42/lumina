
import React, { useState } from 'react';
import { User, Lesson } from '../../../types/index';

interface ProfileProps {
  user: User;
  likedLessons: Lesson[];
  createdLessons: Lesson[];
  onBack: () => void;
}

const Profile: React.FC<ProfileProps> = ({ user, likedLessons, createdLessons, onBack }) => {
  const [activeTab, setActiveTab] = useState<'liked' | 'created'>('liked');

  const displayedLessons = activeTab === 'liked' ? likedLessons : createdLessons;

  return (
    <div className="pb-24 pt-4 px-4 max-w-md mx-auto min-h-screen bg-lumina-bg">
      <div className="flex justify-between items-center mb-6">
          <button 
            onClick={onBack}
            className="w-10 h-10 rounded-full bg-white shadow-sm border border-gray-100 flex items-center justify-center text-gray-600 hover:text-lumina-blue transition-colors"
          >
              <i className="fa-solid fa-arrow-left"></i>
          </button>
          <div className="text-sm font-bold text-gray-400 uppercase tracking-widest">Seu Perfil</div>
          <div className="w-10"></div>
      </div>

      <div className="flex flex-col items-center mb-8">
        <div className="w-24 h-24 rounded-full border-4 border-white shadow-lg overflow-hidden mb-4">
          <img src={user.avatarUrl} alt={user.name} className="w-full h-full object-cover" />
        </div>
        <h2 className="text-2xl font-heading font-bold text-lumina-blue">{user.name}</h2>
        <p className="text-gray-500 text-sm mb-4">Aprendiz Vitalício</p>
        
        <div className="flex space-x-6 w-full justify-center">
          <button 
            onClick={() => setActiveTab('liked')}
            className={`text-center p-3 rounded-xl shadow-sm border min-w-[80px] transition-all ${activeTab === 'liked' ? 'bg-lumina-blue/5 border-lumina-blue/20' : 'bg-white border-gray-100'}`}
          >
            <span className={`block text-xl font-bold ${activeTab === 'liked' ? 'text-lumina-blue' : 'text-gray-700'}`}>{likedLessons.length}</span>
            <span className="text-xs text-gray-400 font-medium uppercase">Curtidos</span>
          </button>
          
          <button 
            onClick={() => setActiveTab('created')}
            className={`text-center p-3 rounded-xl shadow-sm border min-w-[80px] transition-all ${activeTab === 'created' ? 'bg-lumina-mint/10 border-lumina-mint/30' : 'bg-white border-gray-100'}`}
          >
             <span className={`block text-xl font-bold ${activeTab === 'created' ? 'text-lumina-mint' : 'text-gray-700'}`}>{createdLessons.length}</span>
             <span className="text-xs text-gray-400 font-medium uppercase">Criados</span>
          </button>
        </div>
      </div>

      <div className="mb-6">
        <div className="flex items-center space-x-4 mb-4 border-b border-gray-200 pb-1">
            <button 
                onClick={() => setActiveTab('liked')}
                className={`font-heading font-bold text-lg pb-2 transition-colors ${activeTab === 'liked' ? 'text-lumina-blue border-b-2 border-lumina-blue' : 'text-gray-400'}`}
            >
                Curtidas
            </button>
            <button 
                onClick={() => setActiveTab('created')}
                className={`font-heading font-bold text-lg pb-2 transition-colors ${activeTab === 'created' ? 'text-lumina-mint border-b-2 border-lumina-mint' : 'text-gray-400'}`}
            >
                Minhas Criações
            </button>
        </div>
        
        {displayedLessons.length === 0 ? (
          <div className="text-center py-10 bg-white rounded-2xl border border-dashed border-gray-300">
            <i className={`fa-regular ${activeTab === 'liked' ? 'fa-heart' : 'fa-pen-to-square'} text-4xl text-gray-300 mb-3`}></i>
            <p className="text-gray-500 text-sm">
                {activeTab === 'liked' ? 'Nenhuma lição curtida ainda.' : 'Você ainda não criou nenhum conteúdo.'}
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {displayedLessons.map(lesson => (
              <div key={lesson.id} className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex items-center space-x-4">
                <div className={`w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0 ${activeTab === 'liked' ? 'bg-lumina-blue/10 text-lumina-blue' : 'bg-lumina-mint/20 text-lumina-mint'}`}>
                   <i className={`fa-solid ${activeTab === 'liked' ? 'fa-book' : 'fa-microphone'}`}></i>
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="font-bold text-gray-800 truncate">{lesson.title}</h4>
                  <p className="text-xs text-gray-500 truncate">{lesson.summary}</p>
                  <div className="flex items-center mt-1 space-x-2">
                     <span className="text-[10px] px-1.5 py-0.5 bg-gray-100 rounded text-gray-500 uppercase">{lesson.category}</span>
                     {lesson.source && <span className="text-[10px] text-gray-400"><i className="fa-solid fa-link mr-0.5"></i> {lesson.source}</span>}
                  </div>
                </div>
                {activeTab === 'created' && (
                    <div className="text-gray-300 text-xs">
                        {lesson.likes} <i className="fa-solid fa-heart text-red-400 ml-0.5"></i>
                    </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
      
      <div className="mb-6">
        <h3 className="font-heading font-bold text-lg text-gray-800 mb-3 flex items-center">
          <i className="fa-solid fa-tags text-lumina-orange mr-2"></i> Interesses
        </h3>
        <div className="flex flex-wrap gap-2">
            {user.interests.map(i => (
                <span key={i} className="px-3 py-1 bg-white border border-gray-200 rounded-full text-xs font-medium text-gray-600">
                    {i}
                </span>
            ))}
        </div>
      </div>
    </div>
  );
};

export default Profile;
