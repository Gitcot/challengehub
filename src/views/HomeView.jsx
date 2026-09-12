import { useState } from 'react';
import { Sparkles, Trophy, Zap, Plus, Minus, CheckCircle2, Award } from 'lucide-react';
import { useChallenge } from '../context/ChallengeContext';

export default function HomeView() {
  const { platformConfig, userData, setUserData } = useChallenge();
  const [todayVal, setTodayVal] = useState(0);
  const [isValidatedToday, setIsValidatedToday] = useState(false);

  // Calcule dynamiquement le pourcentage pour l'anneau de progression
  const target = platformConfig.dailyGoal || 1;
  const progressPercent = Math.min(Math.round((todayVal / target) * 100), 100);

  const handleValidate = () => {
    if (todayVal === 0 && platformConfig.effortUnit !== 'validations') return;
    
    setIsValidatedToday(true);
    setUserData(prev => ({
      ...prev,
      personalDaysValidated: prev.personalDaysValidated + 1,
      tribeGlobalScore: prev.tribeGlobalScore + Math.round(10 * prev.squadMultiplier)
    }));
  };

  return (
    <div className="flex flex-col gap-6 animate-in fade-in duration-500 max-w-3xl mx-auto">
      
      {/* Mot du Guide / Notification quotidienne */}
      <section className="bg-surface p-6 rounded-3xl shadow-sm border border-gray-100 flex flex-col gap-3 relative overflow-hidden">
        <div className="flex items-center gap-2 text-accent font-bold text-xs uppercase tracking-wider">
          <Sparkles size={16} />
          <span>Le Mot du Guide · Jour {userData.personalDaysValidated + 1}</span>
        </div>
        <p className="text-primary font-serif text-lg md:text-xl leading-relaxed italic">
          "{platformConfig.dailyMessage || "Chaque petit pas régulier renforce l'ensemble de l'Escouade. Restez constants !"}"
        </p>
      </section>

      {/* Carte d'action quotidienne */}
      <section className="bg-surface p-6 md:p-8 rounded-3xl shadow-sm border border-gray-100 flex flex-col items-center text-center gap-6">
        
        {/* Badge Escouade & Multiplicateur */}
        <div className="flex items-center gap-3 bg-gray-50 px-4 py-2 rounded-full border border-gray-200/60">
          <Trophy size={16} className="text-accent" />
          <span className="text-xs font-bold text-primary">Escouade {userData.squadName}</span>
          <span className="text-xs font-bold text-accent bg-accent/10 px-2 py-0.5 rounded-md flex items-center gap-1">
            <Zap size={12} /> x{userData.squadMultiplier}
          </span>
        </div>

        {/* Indication d'effort */}
        <div className="flex flex-col gap-1">
          <h2 className="text-2xl md:text-3xl font-serif text-primary font-bold">
            Engagement du jour
          </h2>
          <p className="text-xs text-text-muted">
            Objectif : <span className="font-bold text-primary">{platformConfig.dailyGoal} {platformConfig.effortUnit}</span>
          </p>
        </div>

        {/* Anneau / Compteur de progression */}
        <div className="relative w-44 h-44 flex items-center justify-center my-2">
          <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
            <circle
              cx="50"
              cy="50"
              r="42"
              className="text-gray-100"
              strokeWidth="8"
              stroke="currentColor"
              fill="transparent"
            />
            <circle
              cx="50"
              cy="50"
              r="42"
              className="transition-all duration-500 ease-out"
              strokeWidth="8"
              strokeDasharray={264}
              strokeDashoffset={264 - (264 * progressPercent) / 100}
              strokeLinecap="round"
              stroke={platformConfig.primaryColor}
              fill="transparent"
            />
          </svg>

          <div className="absolute flex flex-col items-center justify-center">
            <span data-testid="counter-value" className="text-4xl font-bold font-serif text-primary">
              {todayVal}
            </span>
            <span className="text-[10px] uppercase tracking-widest text-text-muted font-bold mt-0.5">
              {platformConfig.effortUnit}
            </span>
          </div>
        </div>

        {/* Boutons d'incrémentation */}
        {!isValidatedToday && (
          <div className="flex items-center gap-4">
            <button
              data-testid="btn-decrement"
              onClick={() => setTodayVal(Math.max(0, todayVal - 1))}
              disabled={todayVal === 0}
              className="p-3 bg-gray-100 text-primary rounded-2xl hover:bg-gray-200 disabled:opacity-40 transition-all"
            >
              <Minus size={20} />
            </button>
            <button
              data-testid="btn-increment"
              onClick={() => setTodayVal(todayVal + 1)}
              className="p-3 bg-primary text-white rounded-2xl shadow-md hover:opacity-90 transition-all"
              style={{ backgroundColor: platformConfig.primaryColor }}
            >
              <Plus size={20} />
            </button>
          </div>
        )}

        {/* Bouton de Validation */}
        <button
          data-testid="btn-validate"
          onClick={handleValidate}
          disabled={isValidatedToday || (todayVal === 0 && platformConfig.effortUnit !== 'validations')}
          className={`w-full max-w-xs py-4 px-6 rounded-full font-bold text-sm flex items-center justify-center gap-2 shadow-md transition-all ${
            isValidatedToday
              ? 'bg-green-600 text-white cursor-default'
              : 'bg-primary text-white hover:opacity-90 disabled:bg-gray-200 disabled:text-gray-400 disabled:shadow-none'
          }`}
          style={!isValidatedToday && todayVal > 0 ? { backgroundColor: platformConfig.primaryColor } : {}}
        >
          {isValidatedToday ? (
            <>
              <CheckCircle2 size={18} />
              Mission accomplie !
            </>
          ) : (
            <>
              <Award size={18} />
              Valider & Booster mon Escouade
            </>
          )}
        </button>

      </section>

    </div>
  );
}