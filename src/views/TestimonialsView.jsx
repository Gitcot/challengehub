import { useState } from 'react';
import { Heart, Flame, Send, UserCircle2, Shield } from 'lucide-react';
import { sanitizeInput } from '../utils/security';
import { useChallenge } from '../context/ChallengeContext';

export default function TestimonialsView() {
  const { platformConfig, userData } = useChallenge();
  const [message, setMessage] = useState('');

  // Algorithme de contraste pour le bouton "Envoyer"
  const getDynamicTextColor = (hexColor) => {
    if (!hexColor) return '#FFFFFF';
    const hex = hexColor.replace('#', '');
    const r = parseInt(hex.substring(0, 2), 16);
    const g = parseInt(hex.substring(2, 2), 16);
    const b = parseInt(hex.substring(4, 2), 16);
    const yiq = ((r * 299) + (g * 587) + (b * 114)) / 1000;
    return yiq >= 128 ? '#0C3C2E' : '#FFFFFF';
  };

  const primaryTextColor = getDynamicTextColor(platformConfig.primaryColor);

  // Simulation d'une base de données de messages avec une tentative de piratage
  const [feed, setFeed] = useState([
    {
      id: 1,
      name: 'sarah',
      squad: 'Les Lions',
      date: 'À l\'instant',
      content: "La lecture d'aujourd'hui m'a vraiment fortifiée. <b>Le chapitre 4</b> résonne particulièrement en moi. Courage à toute la tribu !",
      likes: 14,
      hasLeaderResponse: true,
      leaderResponse: "Superbe assiduité Sarah ! Ton escouade peut être fière de toi."
    },
    {
      id: 2,
      name: 'hacker_anonyme',
      squad: 'Sans Escouade',
      date: 'Il y a 2h',
      content: "Ceci est un test de faille. <script>alert('Votre site est piraté !')</script> Cliquez ici.", 
      likes: 0,
      hasLeaderResponse: false
    },
    {
      id: 3,
      name: 'marc',
      squad: 'Les Panthères',
      date: 'Il y a 5h',
      content: "J'ai eu du mal à maintenir le rythme cette semaine, mais je m'accroche. Mon escouade m'a envoyé un boost hier, merci !",
      likes: 5,
      hasLeaderResponse: false
    }
  ]);

  const handleSendMessage = () => {
    if (message.trim().length === 0) return;

    const newMessage = {
      id: Date.now(),
      name: userData.name,
      squad: userData.squadName,
      date: 'À l\'instant',
      content: message,
      likes: 0,
      hasLeaderResponse: false
    };

    setFeed([newMessage, ...feed]);
    setMessage('');
  };

  return (
    <div className="flex flex-col gap-6 animate-in fade-in duration-500 max-w-3xl mx-auto">
      
      <header className="mt-2">
        <h1 className="text-3xl font-serif text-primary mb-2">La Tribu</h1>
        <p className="text-sm text-text-muted leading-relaxed">
          Un mot, une victoire, une difficulté ? Partagez avec la communauté. Chaque message renforce nos liens.
        </p>
      </header>

      {/* Zone de saisie */}
      <section className="bg-surface p-4 rounded-3xl shadow-sm border border-gray-100 relative z-20">
        <textarea
          className="w-full bg-gray-50/50 border border-gray-100 text-primary placeholder-gray-400 rounded-2xl p-4 text-sm focus:outline-none focus:ring-2 transition-shadow resize-none h-28"
          style={{ '--tw-ring-color': platformConfig.primaryColor }}
          placeholder="Partagez votre avancée avec la tribu..."
          maxLength={2000}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />
        <div className="flex items-center justify-between mt-3 px-1">
          <span className="text-xs text-text-muted font-medium">
            {message.length}/2000
          </span>
          <button 
            onClick={handleSendMessage}
            disabled={message.trim().length === 0}
            style={message.trim().length > 0 ? { backgroundColor: platformConfig.primaryColor, color: primaryTextColor } : {}}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-full font-bold text-sm transition-all ${
              message.trim().length > 0 
                ? 'shadow-md hover:opacity-90' 
                : 'bg-gray-100 text-gray-400 cursor-not-allowed'
            }`}
          >
            <Send size={16} />
            Publier
          </button>
        </div>
      </section>

      {/* Flux de la communauté */}
      <section className="flex flex-col gap-4 relative z-10">
        <h2 className="text-sm font-bold text-text-muted tracking-wide uppercase px-1 mb-1">Dernières publications</h2>
        
        {feed.map((item) => (
          <article key={item.id} className="bg-surface p-5 rounded-3xl shadow-sm border border-gray-100 flex flex-col gap-3 transition-transform hover:shadow-md">
            
            {/* En-tête du message */}
            <div className="flex justify-between items-start">
              <div className="flex flex-col">
                <span className="font-serif font-bold text-primary text-lg capitalize">{item.name}</span>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <Shield size={12} className="text-accent" />
                  <span className="text-[10px] text-text-muted font-bold uppercase tracking-wider">{item.squad}</span>
                </div>
              </div>
              <span className="text-[10px] text-text-muted font-medium">{item.date}</span>
            </div>

            {/* Contenu Sécurisé */}
            <p 
              className="text-sm text-primary/90 leading-relaxed mt-2"
              dangerouslySetInnerHTML={{ __html: sanitizeInput(item.content) }} 
            />

            {/* Réponse du Guide */}
            {item.hasLeaderResponse && (
              <div className="mt-3 bg-accent/10 border border-accent/20 p-4 rounded-2xl flex flex-col gap-2">
                <div className="flex items-center gap-2">
                  <UserCircle2 size={16} className="text-accent" />
                  <span className="text-[10px] font-bold text-accent uppercase tracking-wider">Réponse du Guide</span>
                </div>
                <p className="text-sm text-primary font-medium leading-relaxed">
                  {item.leaderResponse}
                </p>
              </div>
            )}

            {/* Actions */}
            <div className="flex items-center gap-4 mt-2 pt-3 border-t border-gray-50">
              <button className="flex items-center gap-1.5 text-text-muted hover:text-red-500 transition-colors">
                <Heart size={16} />
                <span className="text-xs font-medium">{item.likes > 0 ? item.likes : 'Soutenir'}</span>
              </button>
              <button className="flex items-center gap-1.5 text-text-muted hover:text-accent transition-colors">
                <Flame size={16} />
                <span className="text-xs font-medium">Booster</span>
              </button>
            </div>
          </article>
        ))}
      </section>

    </div>
  );
}