import { useChallenge } from '../context/ChallengeContext';
import { Map } from 'lucide-react';

export default function GridView() {
  const { platformConfig, userData } = useChallenge();

  // Algorithme de contraste pour garantir la lisibilité des cases validées
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

  // Le jour actuel de l'utilisateur (le premier jour non validé)
  const currentDay = userData.personalDaysValidated + 1;

  // Génération de la grille basée sur la configuration du Leader
  const days = Array.from({ length: platformConfig.totalDays }, (_, i) => {
    const dayNumber = i + 1;
    let status = 'locked'; // Par défaut, non atteint
    
    if (dayNumber <= userData.personalDaysValidated) {
      status = 'reached'; // Validé
    } else if (dayNumber === currentDay) {
      status = 'current'; // Jour en cours
    }
    
    return { dayNumber, status };
  });

  return (
    <div className="flex flex-col gap-6 animate-in fade-in duration-500 max-w-3xl mx-auto">
      
      <header className="mt-2">
        <div className="flex items-center gap-2 mb-2">
          <Map size={24} className="text-accent" />
          <h1 className="text-3xl font-serif text-primary">Le Parcours</h1>
        </div>
        <p className="text-sm text-text-muted leading-relaxed">
          Ton avancée visuelle sur les {platformConfig.totalDays} jours. Chaque pas te rapproche de l'objectif de la tribu.
        </p>
      </header>

      {/* Légende de la carte */}
      <section className="bg-surface p-4 rounded-2xl shadow-sm border border-gray-100 flex flex-wrap gap-4 justify-center">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded-full" style={{ backgroundColor: platformConfig.primaryColor }}></div>
          <span className="text-xs font-medium text-text-muted uppercase tracking-wider">Validé</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded-full border-2" style={{ borderColor: platformConfig.primaryColor, backgroundColor: 'transparent' }}></div>
          <span className="text-xs font-medium text-text-muted uppercase tracking-wider">Aujourd'hui</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded-full bg-gray-100 border border-gray-200"></div>
          <span className="text-xs font-medium text-text-muted uppercase tracking-wider">À venir</span>
        </div>
      </section>

      {/* Grille Dynamique */}
      <section className="bg-surface p-6 rounded-3xl shadow-sm border border-gray-100">
        <div className="grid grid-cols-5 md:grid-cols-7 lg:grid-cols-10 gap-3">
          {days.map((item) => {
            // Style de base de chaque case
            let baseStyle = "aspect-square rounded-xl flex items-center justify-center text-sm font-bold transition-all duration-300";
            let specificStyle = {};

            if (item.status === 'reached') {
              // Case validée
              baseStyle += " shadow-md opacity-90";
              specificStyle = { 
                backgroundColor: platformConfig.primaryColor, 
                color: primaryTextColor 
              };
            } else if (item.status === 'current') {
              // Case du jour
              baseStyle += " border-2 scale-110 z-10 shadow-lg bg-surface";
              specificStyle = { 
                borderColor: platformConfig.primaryColor, 
                color: platformConfig.primaryColor 
              };
            } else {
              // Case future (verrouillée)
              baseStyle += " bg-gray-50 border border-gray-100 text-gray-300";
            }

            return (
              <div
                key={item.dayNumber}
                className={baseStyle}
                style={specificStyle}
              >
                {item.dayNumber}
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}