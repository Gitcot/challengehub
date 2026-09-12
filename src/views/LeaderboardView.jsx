import { Trophy, Users, Zap, Shield, Target } from 'lucide-react';
import { useChallenge } from '../context/ChallengeContext';

export default function LeaderboardView() {
  const { platformConfig, userData } = useChallenge();

  // Algorithme de contraste pour la carte de l'escouade de l'utilisateur
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

  // Simulation d'une base de données des escouades de la Tribu
  const mockSquads = [
    { id: 'sq_bravo_2', name: 'Les Lions', points: 4150, multiplier: 1.5, members: 5 },
    { id: 'sq_charlie_3', name: 'Les Panthères', points: 2800, multiplier: 1.0, members: 4 },
    { id: 'sq_delta_4', name: 'Les Loups', points: 1950, multiplier: 0.8, members: 5 },
    // On injecte dynamiquement l'escouade de l'utilisateur actif
    { 
      id: userData.squadId, 
      name: userData.squadName, 
      points: 3420 + userData.personalDaysValidated * 10, // Les points montent si l'utilisateur valide
      multiplier: userData.squadMultiplier, 
      members: 5 
    }
  ];

  // Tri des escouades par ordre décroissant de points
  const rankedSquads = mockSquads.sort((a, b) => b.points - a.points).map((squad, index) => ({
    ...squad,
    rank: index + 1
  }));

  // Objectif global de la Tribu (Simulation : 20 000 points)
  const tribeGoal = 20000;
  const tribeProgress = Math.min(Math.round((userData.tribeGlobalScore / tribeGoal) * 100), 100);

  return (
    <div className="flex flex-col gap-8 animate-in fade-in duration-500 max-w-3xl mx-auto">
      
      <header className="mt-2">
        <div className="flex items-center gap-3 mb-2">
          <div className="p-3 bg-accent/10 rounded-full border border-accent/20">
            <Trophy className="text-accent" size={28} />
          </div>
          <h1 className="text-3xl font-serif text-primary">Impact Tribu</h1>
        </div>
        <p className="text-sm text-text-muted leading-relaxed">
          La somme de vos efforts fait avancer toute la communauté. Regardez quelle escouade tire le groupe vers le haut !
        </p>
      </header>

      {/* Jauge Globale de la Tribu */}
      <section className="bg-surface p-6 rounded-3xl shadow-sm border-2 border-primary/20 flex flex-col gap-4 relative overflow-hidden">
        <div className="flex justify-between items-end mb-2">
          <div className="flex items-center gap-2">
            <Target size={20} className="text-primary" />
            <h2 className="text-lg font-bold text-primary font-serif">Objectif Communautaire</h2>
          </div>
          <span className="text-xs font-bold text-text-muted uppercase tracking-widest">
            {userData.tribeGlobalScore.toLocaleString()} / {tribeGoal.toLocaleString()} pts
          </span>
        </div>
        
        {/* Barre de progression géante */}
        <div className="w-full h-6 bg-gray-100 rounded-full overflow-hidden border border-gray-200">
          <div 
            className="h-full transition-all duration-1000 ease-out flex items-center justify-end pr-2"
            style={{ width: `${tribeProgress}%`, backgroundColor: platformConfig.primaryColor }}
          >
            <span className="text-[10px] font-bold" style={{ color: primaryTextColor }}>{tribeProgress}%</span>
          </div>
        </div>
        <p className="text-xs text-text-muted italic text-center">
          "Encore { (tribeGoal - userData.tribeGlobalScore).toLocaleString() } points pour débloquer la récompense de Tribu !"
        </p>
      </section>

      {/* Classement des Escouades */}
      <section className="flex flex-col gap-3">
        <h2 className="text-sm font-bold text-text-muted uppercase tracking-widest mb-2 ml-1">Classement des Escouades</h2>
        
        {rankedSquads.map((squad) => {
          const isMySquad = squad.id === userData.squadId;
          
          return (
            <div 
              key={squad.id} 
              className={`p-5 rounded-2xl shadow-sm border transition-transform flex flex-col sm:flex-row sm:items-center justify-between gap-4
                ${isMySquad ? 'shadow-md scale-[1.02] z-10' : 'bg-surface border-gray-100'}
              `}
              style={isMySquad ? { backgroundColor: platformConfig.primaryColor, color: primaryTextColor, borderColor: platformConfig.primaryColor } : {}}
            >
              
              <div className="flex items-center gap-4">
                {/* Rang */}
                <div className={`text-2xl font-serif font-bold w-8 text-center ${squad.rank <= 3 && !isMySquad ? 'text-accent' : (isMySquad ? '' : 'text-gray-400')}`}>
                  {squad.rank}
                </div>
                
                {/* Infos Escouade */}
                <div className="flex flex-col">
                  <div className="flex items-center gap-2">
                    <Shield size={16} className={isMySquad ? 'opacity-80' : 'text-primary'} />
                    <span className={`text-lg font-bold ${!isMySquad && 'text-primary'}`}>
                      {squad.name} {isMySquad && '(Ton Escouade)'}
                    </span>
                  </div>
                  <div className={`flex items-center gap-3 text-xs mt-1 ${isMySquad ? 'opacity-90' : 'text-text-muted'}`}>
                    <span className="flex items-center gap-1"><Users size={12} /> {squad.members} membres</span>
                  </div>
                </div>
              </div>
              
              {/* Statistiques (Points & Multiplicateur) */}
              <div className="flex items-center gap-6 sm:justify-end">
                <div className="flex flex-col items-end">
                  <span className="text-[10px] uppercase tracking-wider opacity-80 font-bold">Multiplicateur</span>
                  <div className={`flex items-center gap-1 mt-0.5 px-2 py-0.5 rounded-md ${isMySquad ? 'bg-white/20' : (squad.multiplier >= 1 ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-600')}`}>
                    <Zap size={12} className={isMySquad ? '' : (squad.multiplier >= 1 ? 'text-green-600' : 'text-red-500')} />
                    <span className="font-bold">x{squad.multiplier}</span>
                  </div>
                </div>
                
                <div className="flex flex-col items-end min-w-[80px]">
                  <span className="text-[10px] uppercase tracking-wider opacity-80 font-bold">Points</span>
                  <span className="text-2xl font-serif font-bold leading-none mt-1">
                    {squad.points.toLocaleString()}
                  </span>
                </div>
              </div>

            </div>
          );
        })}
      </section>

    </div>
  );
}