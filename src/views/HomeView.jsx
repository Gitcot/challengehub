import { useEffect, useState } from 'react';
import { Quote, Flame, Target, Award } from 'lucide-react';
import { useChallenge, supabase } from '../context/ChallengeContext';

export default function HomeView() {
  const { userData, platformConfig } = useChallenge();
  const [welcomeMessage, setWelcomeMessage] = useState('');

  useEffect(() => {
    const fetchTribeDetails = async () => {
      if (!userData?.squadId) return;

      try {
        // Récupération du mot du leader depuis la table tribes via le profil
        const { data: profile } = await supabase
          .from('profiles')
          .select('tribe_id')
          .eq('id', userData.id)
          .single();

        if (profile?.tribe_id) {
          const { data: tribe } = await supabase
            .from('tribes')
            .select('welcome_message')
            .eq('id', profile.tribe_id)
            .single();

          if (tribe?.welcome_message) {
            setWelcomeMessage(tribe.welcome_message);
          }
        }
      } catch (err) {
        console.error("Erreur mot du leader:", err);
      }
    };

    fetchTribeDetails();
  }, [userData]);

  return (
    <div className="flex flex-col gap-6 animate-in fade-in duration-300">
      
      {/* Mot du Leader */}
      <div className="bg-surface p-6 rounded-3xl border border-gray-100 shadow-xs relative overflow-hidden">
        <div className="flex items-start gap-4">
          <div className="p-3 bg-accent/10 text-accent rounded-2xl shrink-0">
            <Quote size={24} />
          </div>
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-accent block mb-1">
              Mot du Leader
            </span>
            <p className="text-sm md:text-base font-serif italic text-primary leading-relaxed">
              "{welcomeMessage || platformConfig.welcomeMessage || 'Bienvenue dans l\'aventure ! Ensemble, repoussons nos limites chaque jour.'}"
            </p>
          </div>
        </div>
      </div>

      {/* Cartes d'Impact */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-surface p-5 rounded-2xl border border-gray-100 shadow-xs flex items-center gap-4">
          <div className="p-3 bg-orange-50 text-orange-600 rounded-xl">
            <Flame size={22} />
          </div>
          <div>
            <span className="text-xs text-text-muted font-semibold block">Série Actuelle</span>
            <span className="text-lg font-bold text-primary">{userData.streakDays || 0} Jours</span>
          </div>
        </div>

        <div className="bg-surface p-5 rounded-2xl border border-gray-100 shadow-xs flex items-center gap-4">
          <div className="p-3 bg-blue-50 text-blue-600 rounded-xl">
            <Target size={22} />
          </div>
          <div>
            <span className="text-xs text-text-muted font-semibold block">Objectif Quotidien</span>
            <span className="text-lg font-bold text-primary">1 Validation / jour</span>
          </div>
        </div>

        <div className="bg-surface p-5 rounded-2xl border border-gray-100 shadow-xs flex items-center gap-4">
          <div className="p-3 bg-purple-50 text-purple-600 rounded-xl">
            <Award size={22} />
          </div>
          <div>
            <span className="text-xs text-text-muted font-semibold block">Escouade</span>
            <span className="text-lg font-bold text-primary">{userData.squadName}</span>
          </div>
        </div>
      </div>

    </div>
  );
}