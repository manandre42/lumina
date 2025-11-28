
import React, { useState } from 'react';
import { Lesson, INTERESTS_LIST } from '../../../types/index';

interface CreateModalProps {
  isOpen: boolean;
  onClose: () => void;
  remixSource: Lesson | null;
  onPublish: (title: string, content: string, source: string, tag: string) => void;
}

const CreateModal: React.FC<CreateModalProps> = ({ isOpen, onClose, remixSource, onPublish }) => {
  const [newPost, setNewPost] = useState({ 
    title: '', 
    content: '', 
    source: remixSource ? `Baseado em: ${remixSource.title}` : '', 
    tag: remixSource ? remixSource.category : 'Comunidade' 
  });

  if (!isOpen) return null;

  const handleSuggestSource = () => {
    const currentTag = newPost.tag.toLowerCase();
    let sources = ["Google Acadêmico", "Wikipedia"];
    
    if (currentTag.includes('ciência')) sources = ["Nature", "Science Magazine", "NASA", "Scientific American"];
    else if (currentTag.includes('arte')) sources = ["MoMA", "Louvre Archives", "Google Arts & Culture"];
    else if (currentTag.includes('história')) sources = ["History Channel", "Smithsonian", "National Archives"];
    else if (currentTag.includes('tec')) sources = ["MIT Tech Review", "Wired", "TechCrunch"];
    else if (currentTag.includes('filosofia')) sources = ["Stanford Encyclopedia", "The School of Life"];
    else if (currentTag.includes('literatura')) sources = ["Project Gutenberg", "Goodreads"];

    if (newPost.title.toLowerCase().includes("espaço")) sources.push("Space.com");
    if (newPost.title.toLowerCase().includes("cérebro")) sources.push("Neuroscience News");

    const randomSource = sources[Math.floor(Math.random() * sources.length)];
    setNewPost(prev => ({ ...prev, source: randomSource }));
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-sm">
        <div className="bg-white w-full max-w-lg rounded-t-2xl sm:rounded-2xl shadow-2xl animate-slide-up flex flex-col h-[90vh]">
            
            <div className="flex justify-between items-center p-4 border-b border-gray-100">
                <h2 className="font-heading text-lg font-bold text-lumina-blue">
                  {remixSource ? 'Expandir Conhecimento' : 'Nova Ideia'}
                </h2>
                <button 
                    onClick={onClose}
                    className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 hover:bg-gray-200"
                >
                    <i className="fa-solid fa-times"></i>
                </button>
            </div>

            {remixSource && (
              <div className="bg-lumina-blue/5 border-l-4 border-lumina-blue p-3 m-4 mb-0 rounded-r-lg">
                <div className="flex items-center text-xs text-lumina-blue font-bold uppercase mb-1">
                  <i className="fa-solid fa-quote-right mr-2"></i> Citando Lição
                </div>
                <p className="text-gray-800 font-medium text-sm line-clamp-1">{remixSource.title}</p>
                <p className="text-gray-500 text-xs italic truncate">"{remixSource.summary}"</p>
              </div>
            )}

            <div className="p-5 overflow-y-auto flex-1">
                
                <div className="mb-4">
                  <label className="block text-xs font-bold text-gray-400 uppercase mb-2">Topico / Tag</label>
                  <div className="flex overflow-x-auto space-x-2 pb-2 no-scrollbar">
                    {INTERESTS_LIST.map(tag => (
                      <button
                        key={tag}
                        onClick={() => setNewPost({...newPost, tag})}
                        className={`px-3 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-colors border ${
                          newPost.tag === tag 
                          ? 'bg-lumina-blue text-white border-lumina-blue' 
                          : 'bg-white text-gray-500 border-gray-200'
                        }`}
                      >
                        {tag}
                      </button>
                    ))}
                  </div>
                </div>

                <label className="block text-xs font-bold text-gray-400 uppercase mb-1">Título</label>
                <input 
                    type="text" 
                    placeholder={remixSource ? `Sobre: ${remixSource.title}` : "Ex: O Efeito Borboleta"}
                    className="w-full text-lg font-bold border-b-2 border-gray-100 focus:border-lumina-mint outline-none py-2 mb-6 placeholder-gray-300 bg-transparent"
                    value={newPost.title}
                    onChange={(e) => setNewPost({...newPost, title: e.target.value})}
                />

                <label className="block text-xs font-bold text-gray-400 uppercase mb-1">
                  {remixSource ? 'Sua Análise / Expansão' : 'Explicação'}
                </label>
                <textarea 
                    placeholder="Escreva seus pensamentos..."
                    className="w-full h-32 bg-gray-50 rounded-xl p-4 text-sm text-gray-700 outline-none focus:ring-2 focus:ring-lumina-mint/20 mb-6 resize-none"
                    value={newPost.content}
                    onChange={(e) => setNewPost({...newPost, content: e.target.value})}
                ></textarea>

                <label className="block text-xs font-bold text-gray-400 uppercase mb-1">Fonte</label>
                <div className="flex gap-2">
                    <div className="relative flex-1">
                        <i className="fa-solid fa-link absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-300 text-xs"></i>
                        <input 
                            type="text" 
                            placeholder="Link ou referência..."
                            className="w-full bg-gray-50 rounded-lg pl-8 pr-4 py-2.5 text-sm border border-transparent focus:bg-white focus:border-lumina-mint/50 outline-none transition-all"
                            value={newPost.source}
                            onChange={(e) => setNewPost({...newPost, source: e.target.value})}
                        />
                    </div>
                    <button 
                        onClick={handleSuggestSource}
                        className="px-3 py-2 bg-lumina-blue/5 text-lumina-blue rounded-lg text-xs font-bold whitespace-nowrap hover:bg-lumina-blue/10 transition-colors"
                    >
                        <i className="fa-solid fa-wand-magic-sparkles mr-1"></i>
                        Sugerir
                    </button>
                </div>
            </div>

            <div className="p-4 border-t border-gray-100 bg-gray-50 rounded-b-2xl">
                <button 
                    onClick={() => onPublish(newPost.title, newPost.content, newPost.source, newPost.tag)}
                    disabled={!newPost.title || !newPost.content}
                    className={`w-full py-3.5 rounded-xl font-bold text-sm shadow-lg transition-all transform active:scale-95 flex items-center justify-center space-x-2
                        ${(!newPost.title || !newPost.content) 
                            ? 'bg-gray-300 text-gray-500 cursor-not-allowed shadow-none' 
                            : 'bg-lumina-blue text-white hover:bg-lumina-blue/90 hover:shadow-xl'}`}
                >
                    <span>{remixSource ? 'Publicar Resposta' : 'Publicar'}</span>
                    <i className="fa-solid fa-paper-plane"></i>
                </button>
            </div>
        </div>
    </div>
  );
};

export default CreateModal;
