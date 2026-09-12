import { createContext, useContext, useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

const ChallengeContext = createContext();

export const ChallengeProvider = ({ children }) => {
  const [platformConfig, setPlatformConfig] = useState({
    name: 'Tribu Impulsion',
    primaryColor: '#0C3C2E',
    accentColor: '#D4AF37',
    effortUnit: 'chapitres',
    dailyGoal: 1,
    allocationMode: 'choice', // 'auto' | 'choice' | 'manual'
    maxPerSquad: 5,
    dailyMessage: "Chaque petit pas régulier renforce l'ensemble de l'Escouade. Restez constants !",
  });

  const [userData, setUserData] = useState({
    id: null,
    name: '',
    role: 'member',
    squadId: null,
    squadName: '',
    squadMultiplier: 1.0,
    personalDaysValidated: 0,
    tribeGlobalScore: 0,
  });

  const [loading, setLoading] = useState(true);

  // Charger la session et les données Supabase au démarrage
  useEffect(() => {
    const fetchSessionAndData = async () => {
      setLoading(true);
      try {
        const { data: { session } } = await supabase.auth.getSession();

        if (session?.user) {
          // 1. Récupération du profil
          const { data: profile } = await supabase
            .from('profiles')
            .select('*, squads(name, multiplier), tribes(*)')
            .eq('id', session.user.id)
            .single();

          if (profile) {
            setUserData({
              id: profile.id,
              name: profile.full_name || session.user.email.split('@')[0],
              role: profile.role || 'member',
              squadId: profile.squad_id || null, // Si null -> déclenche InceptionView
              squadName: profile.squads?.name || 'Sans escouade',
              squadMultiplier: profile.squads?.multiplier || 1.0,
              personalDaysValidated: 0,
              tribeGlobalScore: 12400,
            });

            if (profile.tribes) {
              setPlatformConfig({
                name: profile.tribes.name || 'Tribu Impulsion',
                primaryColor: profile.tribes.primary_color || '#0C3C2E',
                accentColor: profile.tribes.accent_color || '#D4AF37',
                effortUnit: profile.tribes.effort_unit || 'chapitres',
                dailyGoal: profile.tribes.daily_goal || 1,
                allocationMode: profile.tribes.allocation_mode || 'choice',
                maxPerSquad: profile.tribes.max_per_squad || 5,
                dailyMessage: profile.tribes.daily_message || "Chaque petit pas renforce l'Escouade.",
              });
            }
          } else {
            // Profil manquant (nouvel utilisateur)
            setUserData({
              id: session.user.id,
              name: session.user.email.split('@')[0],
              role: 'member',
              squadId: null,
              squadName: 'En attente',
              squadMultiplier: 1.0,
              personalDaysValidated: 0,
              tribeGlobalScore: 0,
            });
          }
        } else {
          setUserData(prev => ({ ...prev, id: null }));
        }
      } catch (err) {
        console.error("Erreur de chargement de session:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchSessionAndData();

    // Écouteur de changement d'état d'authentification
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!session) {
        setUserData({
          id: null,
          name: '',
          role: 'member',
          squadId: null,
          squadName: '',
          squadMultiplier: 1.0,
          personalDaysValidated: 0,
          tribeGlobalScore: 0,
        });
      } else {
        fetchSessionAndData();
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  // Enregistrer le choix d'escouade lors de l'Inception
  const joinSquad = async (squadId, squadName) => {
    if (!userData.id) return;

    // Mise à jour locale immédiate (UX réactive)
    setUserData(prev => ({
      ...prev,
      squadId: squadId,
      squadName: squadName
    }));

    // Persistence dans la table Supabase 'profiles'
    await supabase
      .from('profiles')
      .update({ squad_id: squadId })
      .eq('id', userData.id);
  };

  return (
    <ChallengeContext.Provider value={{
      platformConfig,
      setPlatformConfig,
      userData,
      setUserData,
      joinSquad,
      loading
    }}>
      {children}
    </ChallengeContext.Provider>
  );
};

export const useChallenge = () => useContext(ChallengeContext);