import { useState } from 'react';
import { Save, Palette, Target, Type, Users, Megaphone } from 'lucide-react';
import { useChallenge } from '../context/ChallengeContext';

export default function LeaderSettingsView() {
  const { platformConfig, setPlatformConfig } = useChallenge();
  const [formData, setFormData] = useState(platformConfig);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSave = () => {
    setPlatformConfig(formData);
    alert("Configuration appliquée ! Le mot du jour est envoyé à toute la tribu.");
  };

  const getDynamicTextColor = (hexColor) => {
    if (!hexColor) return '#FFFFFF';
    const hex = hexColor.replace('#', '');
    const r = parseInt(hex.substring(0, 2), 16);
    const g = parseInt(hex.substring(2, 2), 16);
    const b = parseInt(hex.substring(4, 2), 16);
    const yiq = ((r * 299) + (g * 587) + (b * 114)) / 1000;
    return yiq >= 128 ? '#0C3C2E' : '#FFFFFF';
  };

  return (
    <div className="flex flex-col gap-8 animate-in fade-in duration-500 max-w-2xl pb-10">
      <header>
        <h1 className="text-3xl font-serif text-primary mb-2">Configuration Tribu</h1>
        <p className="text-sm text-text-muted leading-relaxed">Pilotez l'expérience, les escouades et la motivation de votre communauté.</p>
      </header>

      {/* BLOC : MOTIVATION QUOTIDIENNE */}
      <section className="bg-surface p-6 rounded-3xl shadow-sm border-2 border-accent/40 flex flex-col gap-5 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-1 h-full bg-accent"></div>
        <div className="flex items-center gap-2 border-b border-gray-100 pb-3">
          <Megaphone size={20} className="text-accent" />
          <h2 className="text-lg font-bold text-primary font-serif">Le Mot du Guide (Aujourd'hui)</h2>
        </div>
        
        <div className="flex flex-col gap-4">
          <div className="flex gap-4">
            <label className="flex items-center gap-2 text-sm text-primary cursor-pointer">
              <input type="radio" name="dailyMotivationType" value="text" checked={formData.dailyMotivationType === 'text'} onChange={handleChange} className="accent-accent" /> Texte
            </label>
            <label className="flex items-center gap-2 text-sm text-primary cursor-pointer">
              <input type="radio" name="dailyMotivationType" value="audio" checked={formData.dailyMotivationType === 'audio'} onChange={handleChange} className="accent-accent" /> Lien Audio
            </label>
            <label className="flex items-center gap-2 text-sm text-primary cursor-pointer">
              <input type="radio" name="dailyMotivationType" value="video" checked={formData.dailyMotivationType === 'video'} onChange={handleChange} className="accent-accent" /> Lien Vidéo
            </label>
          </div>
          <textarea 
            name="dailyMotivationContent"
            value={formData.dailyMotivationContent}
            onChange={handleChange}
            placeholder={formData.dailyMotivationType === 'text' ? "Écrivez votre message motivant..." : "Collez le lien de votre vidéo/audio ici..."}
            className="w-full bg-gray-50 border border-gray-200 text-gray-900 rounded-xl p-4 text-sm focus:outline-none focus:ring-2 focus:ring-accent min-h-[100px] resize-none"
          />
        </div>
      </section>

      {/* BLOC : GESTION DES ESCOUADES */}
      <section className="bg-surface p-6 rounded-3xl shadow-sm border border-gray-100 flex flex-col gap-5">
        <div className="flex items-center gap-2 border-b border-gray-100 pb-3">
          <Users size={20} className="text-accent" />
          <h2 className="text-lg font-bold text-primary font-serif">Structure des Escouades</h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex flex-col gap-2">
            <label className="text-xs font-bold text-text-muted uppercase tracking-wide">Mode de Répartition</label>
            <select 
              name="allocationMode"
              value={formData.allocationMode}
              onChange={handleChange}
              className="w-full bg-gray-50 border border-gray-200 text-gray-900 rounded-xl p-3 text-sm focus:outline-none"
            >
              <option value="auto">Automatique (Équilibrée)</option>
              <option value="choice">Choix Libre (Entonnoir intelligent)</option>
              <option value="manual">Manuelle (Salle d'attente)</option>
            </select>
            <p className="text-[10px] text-text-muted mt-1 leading-tight">
              {formData.allocationMode === 'choice' && "L'entonnoir limite le choix aux escouades en cours de remplissage pour éviter les groupes incomplets."}
            </p>
          </div>
          <div className="flex flex-col gap-2">
            <label className="text-xs font-bold text-text-muted uppercase tracking-wide">Membres max / Escouade</label>
            <input 
              type="number" 
              name="maxPerSquad"
              value={formData.maxPerSquad}
              onChange={handleChange}
              min="2" max="20"
              className="w-full bg-gray-50 border border-gray-200 text-gray-900 rounded-xl p-3 text-sm focus:outline-none"
            />
          </div>
        </div>
      </section>

      {/* Les blocs existants : Règles du challenge et Identité Visuelle... */}
      <section className="bg-surface p-6 rounded-3xl shadow-sm border border-gray-100 flex flex-col gap-5">
        <div className="flex items-center gap-2 border-b border-gray-100 pb-3">
          <Target size={20} className="text-accent" />
          <h2 className="text-lg font-bold text-primary font-serif">Règles du Challenge</h2>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="flex flex-col gap-2">
            <label className="text-xs font-bold text-text-muted uppercase tracking-wide">Durée (Jours)</label>
            <input type="number" name="totalDays" value={formData.totalDays} onChange={handleChange} className="w-full bg-gray-50 border border-gray-200 text-gray-900 rounded-xl p-3 text-sm focus:outline-none" />
          </div>
          <div className="flex flex-col gap-2">
            <label className="text-xs font-bold text-text-muted uppercase tracking-wide">Unité d'effort</label>
            <select name="unit" value={formData.unit} onChange={handleChange} className="w-full bg-gray-50 border border-gray-200 text-gray-900 rounded-xl p-3 text-sm focus:outline-none">
              <option value="chapitres">Chapitres</option>
              <option value="km">Kilomètres</option>
              <option value="minutes">Minutes</option>
              <option value="validations">Validation</option>
            </select>
          </div>
        </div>
      </section>

      <section className="bg-surface p-6 rounded-3xl shadow-sm border border-gray-100 flex flex-col gap-5">
        <div className="flex items-center gap-2 border-b border-gray-100 pb-3">
          <Palette size={20} className="text-accent" />
          <h2 className="text-lg font-bold text-primary font-serif">Identité Visuelle</h2>
        </div>
        <div className="flex flex-col gap-3 mt-2 bg-gray-50/50 p-4 rounded-2xl border border-gray-100">
          <div className="flex justify-between items-center">
            <label className="text-xs font-bold text-text-muted uppercase tracking-wide flex items-center gap-1.5"><Type size={14} /> Zoom Global</label>
            <span className="text-xs font-bold text-primary bg-primary/10 px-2 py-1 rounded-md">{formData.baseFontSize}px</span>
          </div>
          <input type="range" name="baseFontSize" min="12" max="24" step="1" value={formData.baseFontSize} onChange={handleChange} className="w-full cursor-pointer accent-primary" />
        </div>
        <div className="grid grid-cols-2 gap-4 mt-2">
          <div className="flex flex-col gap-2">
            <label className="text-xs font-bold text-text-muted uppercase tracking-wide">Principale</label>
            <input type="color" name="primaryColor" value={formData.primaryColor} onChange={handleChange} className="w-full h-12 rounded-lg cursor-pointer border-0 p-0" />
          </div>
          <div className="flex flex-col gap-2">
            <label className="text-xs font-bold text-text-muted uppercase tracking-wide">Accent</label>
            <input type="color" name="accentColor" value={formData.accentColor} onChange={handleChange} className="w-full h-12 rounded-lg cursor-pointer border-0 p-0" />
          </div>
        </div>
      </section>

      <button 
        onClick={handleSave}
        style={{ backgroundColor: formData.primaryColor, color: getDynamicTextColor(formData.primaryColor) }}
        className="w-full py-4 mt-2 rounded-full font-bold text-sm flex items-center justify-center gap-2 transition-all active:scale-[0.98] shadow-md hover:opacity-90 sticky bottom-4 z-10"
      >
        <Save size={20} />
        Appliquer à toute la plateforme
      </button>
    </div>
  );
}