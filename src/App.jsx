import { useState } from 'react';
import { Home, LayoutGrid, Trophy, MessageSquare, Settings, Share2, UserPlus, LogOut } from 'lucide-react';
import { useChallenge, supabase } from './context/ChallengeContext';
import LeaderSettingsView from './views/LeaderSettingsView';
import HomeView from './views/HomeView';
import GridView from './views/GridView';
import LeaderboardView from './views/LeaderboardView';
import TestimonialsView from './views/TestimonialsView';
import InceptionView from './views/InceptionView';
import AuthView from './views/AuthView';
import InviteModal from './components/InviteModal';

export default function App() {
  const [activeTab, setActiveTab] = useState('accueil');
  const [isInviteOpen, setIsInviteOpen] = useState(false);
  const { platformConfig, userData, loading } = useChallenge();

  // Algorithme de contraste visuel YIQ (Garantit la lisibilité sur fond dynamique)
  const getDynamicTextColor = (hexColor) => {
    if (!hexColor) return '#FFFFFF';
    const hex = hexColor.replace('#', '');
    const r = parseInt(hex.substring(0, 2), 16);
    const g = parseInt(hex.substring(2, 2), 16);
    const b = parseInt(hex.substring(4, 2), 16);
    const yiq = ((r * 299) + (g * 587) + (b * 114)) / 1000;
    return yiq >= 128 ? '#0C3C2E' : '#FFFFFF';
  };

  const activeMenuTextColor = getDynamicTextColor(platformConfig.primaryColor);

  const handleLogout = async () => {
    await supabase.auth.signOut();
  };

  // 1. Écran de chargement pendant la vérification de la session Supabase
  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50/50 p-4 text-center">
        <div className="w-10 h-10 border-4 border-primary/20 border-t-primary rounded-full animate-spin mb-3" />
        <span className="text-sm font-bold text-primary tracking-wide animate-pulse">
          Chargement de la session...
        </span>
      </div>
    );
  }

  // 2. Utilisateur non authentifié -> Écran Supabase Auth (Email / Magic Link)
  if (!userData.id) {
    return (
      <div className="min-h-screen bg-gray-50/50 flex items-center justify-center p-3">
        <AuthView />
      </div>
    );
  }

  // 3. Utilisateur sans escouade/tribu -> Écran Inception (Créer ou Rejoindre avec Code)
  if (!userData.squadId) {
    return (
      <div className="min-h-screen bg-gray-50/50 flex items-center justify-center p-3">
        <InceptionView onComplete={() => setActiveTab('accueil')} />
      </div>
    );
  }

  // Rendu dynamique du contenu principal selon l'onglet
  const renderContent = () => {
    switch (activeTab) {
      case 'accueil':
        return <HomeView />;
      case 'grille':
        return <GridView />;
      case 'classement':
        return <LeaderboardView />;
      case 'temoignages':
        return <TestimonialsView />;
      case 'paramètres':
        return <LeaderSettingsView />;
      default:
        return <HomeView />;
    }
  };

  // Éléments de navigation
  const navItems = [
    { id: 'accueil', icon: Home, label: 'Accueil' },
    { id: 'grille', icon: LayoutGrid, label: 'Parcours' },
    { id: 'classement', icon: Trophy, label: 'Impact' },
    { id: 'temoignages', icon: MessageSquare, label: 'Tribu' },
  ];

  // L'onglet Configuration s'affiche uniquement si l'utilisateur est LEADER
  if (userData.role === 'leader') {
    navItems.push({ id: 'paramètres', icon: Settings, label: 'Config' });
  }

  return (
    <div className="flex flex-col md:flex-row min-h-screen font-sans bg-gray-50/30 text-gray-900">
      
      {/* HEADER MOBILE (Optimisé pour lisibilité sans défilement) */}
      <header className="md:hidden sticky top-0 z-40 bg-surface border-b border-gray-200 px-4 py-3 flex items-center justify-between shadow-xs">
        <div className="flex items-center gap-2.5">
          <div 
            className="w-9 h-9 rounded-xl flex items-center justify-center font-bold text-sm shadow-xs"
            style={{ backgroundColor: `${platformConfig.primaryColor}15`, color: platformConfig.primaryColor }}
          >
            {platformConfig.name ? platformConfig.name.substring(0, 2).toUpperCase() : 'TR'}
          </div>
          <div>
            <h1 className="text-sm font-serif font-bold text-primary line-clamp-1">
              {platformConfig.name}
            </h1>
            <div className="flex items-center gap-1.5 text-[11px] text-text-muted">
              <span className="font-semibold">{userData.name}</span>
              <span>•</span>
              <span className="font-bold text-accent">
                {userData.role === 'leader' ? '👑 Leader' : '👤 Membre'}
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button 
            onClick={() => setIsInviteOpen(true)}
            className="p-2 bg-accent/10 text-accent font-bold rounded-xl active:scale-95 transition-all text-xs flex items-center gap-1"
          >
            <UserPlus size={16} />
            <span className="hidden sm:inline">Inviter</span>
          </button>

          <button
            onClick={handleLogout}
            className="p-2 text-text-muted hover:text-red-600 rounded-xl active:scale-95 transition-colors"
            title="Déconnexion"
          >
            <LogOut size={18} />
          </button>
        </div>
      </header>

      {/* BARRE LATÉRALE - DESKTOP (PC) */}
      <aside className="hidden md:flex flex-col w-64 bg-surface border-r border-gray-200 p-6 sticky top-0 h-screen z-40 shadow-xs">
        <div className="mb-8">
          <h1 className="text-2xl font-serif text-primary font-bold truncate">
            {platformConfig.name}
          </h1>
          <p className="text-xs text-text-muted mt-1 uppercase tracking-wider font-semibold">
            Escouade {userData.squadName}
          </p>
        </div>

        {/* Navigation des onglets */}
        <nav className="flex flex-col gap-2 flex-grow">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button 
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`flex items-center gap-4 px-4 py-3 rounded-xl transition-all ${
                  isActive ? 'bg-primary shadow-md' : 'text-text-muted hover:bg-gray-50'
                }`}
                style={isActive ? { backgroundColor: platformConfig.primaryColor, color: activeMenuTextColor } : {}}
              >
                <Icon size={20} strokeWidth={isActive ? 2.5 : 1.5} />
                <span className="text-sm font-medium">{item.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Profil & Bouton d'invitation avec Code Unique */}
        <div className="flex flex-col gap-3 pt-4 border-t border-gray-100">
          <button 
            onClick={() => setIsInviteOpen(true)}
            className="flex items-center justify-center gap-2 px-4 py-3 bg-accent/10 text-accent font-bold rounded-2xl hover:bg-accent/20 transition-all text-xs"
          >
            <UserPlus size={18} />
            <span>Inviter un membre</span>
          </button>

          <div className="flex items-center justify-between pt-2 px-1">
            <div className="flex flex-col">
              <span className="text-xs font-bold text-primary truncate max-w-[120px]">
                {userData.name}
              </span>
              <span className="text-[10px] text-text-muted font-bold capitalize">
                {userData.role === 'leader' ? '👑 Leader' : '👤 Membre'}
              </span>
            </div>
            <button
              onClick={handleLogout}
              className="p-2 text-text-muted hover:text-red-600 hover:bg-red-50 rounded-xl transition-colors"
              title="Déconnexion"
            >
              <LogOut size={18} />
            </button>
          </div>
        </div>
      </aside>

      {/* CONTENU PRINCIPAL ADAPTATIF */}
      <main className="flex-grow p-4 sm:p-6 md:p-10 pb-28 md:pb-10 max-w-5xl mx-auto w-full">
        
        {/* En-tête Supérieur Desktop */}
        <header className="hidden md:flex justify-between items-center mb-8 p-5 bg-surface rounded-2xl border border-gray-100 shadow-xs">
          <div className="flex flex-col">
            <span className="text-xs text-text-muted font-bold uppercase tracking-wide">
              Impact Global Tribu
            </span>
            <span className="text-2xl font-serif text-primary font-bold">
              {userData.tribeGlobalScore.toLocaleString()} pts
            </span>
          </div>
          
          <div className="flex items-center gap-6">
            <div className="flex flex-col items-end">
              <span className="text-xs text-text-muted font-bold uppercase tracking-wide">
                Multiplicateur d'Escouade
              </span>
              <span className="text-xl font-bold text-accent">
                x{userData.squadMultiplier}
              </span>
            </div>
            <button 
              onClick={() => setIsInviteOpen(true)}
              className="p-3 bg-gray-100 text-primary hover:bg-gray-200 rounded-xl transition-colors"
              title="Obtenir le code d'invitation"
            >
              <Share2 size={18} />
            </button>
          </div>
        </header>

        {/* Affichage de la vue active */}
        {renderContent()}
      </main>

      {/* BARRE DE NAVIGATION MOBILE BASSE DE TAILLE OPTIMISÉE */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-surface border-t border-gray-200 flex justify-around items-center px-1 py-2 z-50 shadow-lg backdrop-blur-md">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button 
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`flex flex-col items-center gap-1 p-2 min-w-[60px] rounded-xl transition-all ${
                isActive ? 'text-primary font-bold' : 'text-text-muted'
              }`}
            >
              <div 
                className={`p-1.5 rounded-xl transition-colors ${isActive ? 'bg-primary/10' : ''}`}
                style={isActive ? { color: platformConfig.primaryColor } : {}}
              >
                <Icon size={22} strokeWidth={isActive ? 2.5 : 1.8} />
              </div>
              <span className="text-[11px] leading-none">{item.label}</span>
            </button>
          );
        })}
      </nav>

      {/* Modale d'invitation avec Code Unique de Tribu */}
      <InviteModal isOpen={isInviteOpen} onClose={() => setIsInviteOpen(false)} />

    </div>
  );
}