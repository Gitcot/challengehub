import { useState } from 'react';
import { Shield, Sparkles, ArrowRight, CheckCircle2, AlertCircle, PlusCircle, Users } from 'lucide-react';
import { useChallenge, supabase } from '../context/ChallengeContext';

export default function InceptionView({ onComplete }) {
  const { userData, setUserData } = useChallenge();
  
  // Choice mode: 'select' | 'join' | 'create'
  const [mode, setMode] = useState('select');
  
  // Form Join (Membre)
  const [inviteCode, setInviteCode] = useState('');
  const [selectedSquad, setSelectedSquad] = useState(null);
  const [availableSquads, setAvailableSquads] = useState([]);
  
  // Form Create (Leader)
  const [newTribeName, setNewTribeName] = useState('');
  
  const [step, setStep] = useState(1);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // 1. REJOINDRE UNE TRIBU EXISTANTE (Rôle Membre)
  const handleVerifyCode = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // Recherche de la tribu par son code d'invitation
      const { data: tribe, error: tribeErr } = await supabase
        .from('tribes')
        .select('*, squads(*)')
        .eq('invite_code', inviteCode.trim().toUpperCase())
        .single();

      if (tribeErr || !tribe) {
        throw new Error("Code d'invitation introuvable.");
      }

      // Récupération des escouades de cette tribu
      setAvailableSquads(tribe.squads || []);
      setStep(2); // Passage au choix de l'escouade
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleFinalizeJoin = async () => {
    if (!selectedSquad) return;
    setLoading(true);

    try {
      await supabase
        .from('profiles')
        .update({
          tribe_id: selectedSquad.tribe_id,
          squad_id: selectedSquad.id,
          role: 'member'
        })
        .eq('id', userData.id);

      setUserData(prev => ({
        ...prev,
        role: 'member',
        squadId: selectedSquad.id,
        squadName: selectedSquad.name
      }));

      if (onComplete) onComplete();
    } catch (err) {
      setError("Erreur lors de l'enregistrement de l'escouade.");
    } finally {
      setLoading(false);
    }
  };

  // 2. CRÉER SA PROPRE TRIBU (Rôle Leader)
  const handleCreateTribe = async (e) => {
    e.preventDefault();
    if (!newTribeName.trim()) return;

    setError('');
    setLoading(true);

    // Génération d'un code unique à 6 caractères (ex: IMP-8X92)
    const generatedCode = `TRIBU-${Math.random().toString(36).substring(2, 6).toUpperCase()}`;

    try {
      const { data, error: rpcErr } = await supabase.rpc('create_new_tribe', {
        leader_id: userData.id,
        tribe_name: newTribeName.trim(),
        invite_code: generatedCode
      });

      if (rpcErr) throw rpcErr;

      setUserData(prev => ({
        ...prev,
        role: 'leader',
        squadId: data.squad_id,
        squadName: 'Les Alpha'
      }));

      if (onComplete) onComplete();
    } catch (err) {
      setError("Erreur lors de la création de la tribu : " + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[85vh] flex flex-col justify-center items-center p-4">
      <div className="bg-surface p-8 rounded-3xl shadow-xl border border-gray-100 max-w-md w-full animate-in fade-in duration-300">
        
        {/* ÉCRAN DE SÉLECTION INITIALE */}
        {mode === 'select' && (
          <div className="flex flex-col gap-6 text-center">
            <div className="w-14 h-14 bg-primary/10 text-primary rounded-2xl flex items-center justify-center mx-auto mb-1">
              <Sparkles size={28} />
            </div>
            <div>
              <h1 className="text-2xl font-serif font-bold text-primary">Bienvenue sur Cohost</h1>
              <p className="text-xs text-text-muted mt-1">Choisissez comment vous souhaitez démarrer l'aventure.</p>
            </div>

            <div className="flex flex-col gap-3">
              <button
                onClick={() => setMode('join')}
                className="p-5 rounded-2xl border border-gray-200 hover:border-primary hover:bg-primary/5 text-left flex items-center justify-between transition-all group"
              >
                <div className="flex items-center gap-3">
                  <div className="p-3 bg-gray-100 rounded-xl text-primary group-hover:bg-primary group-hover:text-white transition-colors">
                    <Users size={20} />
                  </div>
                  <div>
                    <h3 className="font-bold text-primary text-sm">Rejoindre une Tribu</h3>
                    <p className="text-[11px] text-text-muted">Vous avez un code d'invitation Leader</p>
                  </div>
                </div>
                <ArrowRight size={18} className="text-text-muted group-hover:text-primary transition-colors" />
              </button>

              <button
                onClick={() => setMode('create')}
                className="p-5 rounded-2xl border border-accent/40 bg-accent/5 hover:bg-accent/10 text-left flex items-center justify-between transition-all group"
              >
                <div className="flex items-center gap-3">
                  <div className="p-3 bg-accent text-white rounded-xl">
                    <PlusCircle size={20} />
                  </div>
                  <div>
                    <h3 className="font-bold text-primary text-sm">Créer une Tribu</h3>
                    <p className="text-[11px] text-text-muted">Devenez Leader et invitez vos membres</p>
                  </div>
                </div>
                <ArrowRight size={18} className="text-accent" />
              </button>
            </div>
          </div>
        )}

        {/* PARCOURS MEMBRE : Saisir le Code d'Invitation */}
        {mode === 'join' && step === 1 && (
          <form onSubmit={handleVerifyCode} className="flex flex-col gap-5">
            <div className="text-center">
              <h2 className="text-xl font-serif font-bold text-primary">Rejoindre en tant que Membre</h2>
              <p className="text-xs text-text-muted mt-1">Saisissez le code d'accès fourni par votre Leader.</p>
            </div>

            {error && (
              <div className="bg-red-50 text-red-600 p-3 rounded-xl text-xs flex items-center gap-2">
                <AlertCircle size={16} /> {error}
              </div>
            )}

            <div>
              <label className="text-xs font-bold text-text-muted uppercase tracking-wide block mb-1">Code d'invitation</label>
              <input
                type="text"
                required
                value={inviteCode}
                onChange={(e) => setInviteCode(e.target.value.toUpperCase())}
                placeholder="Ex: TRIBU-A89X"
                className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3.5 text-sm font-mono tracking-wider uppercase focus:outline-none focus:ring-2 focus:ring-primary/40"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 bg-primary text-white font-bold rounded-full flex items-center justify-center gap-2 shadow-md hover:opacity-90 disabled:opacity-50 transition-all text-sm"
            >
              {loading ? 'Vérification...' : <>Valider le Code <ArrowRight size={18} /></>}
            </button>

            <button type="button" onClick={() => setMode('select')} className="text-xs text-text-muted hover:underline text-center">
              ← Retour au choix
            </button>
          </form>
        )}

        {/* PARCOURS MEMBRE : Choix de l'Escouade */}
        {mode === 'join' && step === 2 && (
          <div className="flex flex-col gap-5">
            <div className="text-center">
              <h2 className="text-xl font-serif font-bold text-primary">Sélectionnez votre Escouade</h2>
              <p className="text-xs text-text-muted mt-1">Rejoins l'équipe de ton choix dans la tribu.</p>
            </div>

            <div className="flex flex-col gap-2">
              {availableSquads.map((squad) => (
                <button
                  key={squad.id}
                  onClick={() => setSelectedSquad(squad)}
                  className={`p-4 rounded-xl border text-left flex justify-between items-center transition-all ${
                    selectedSquad?.id === squad.id ? 'border-primary bg-primary/5' : 'border-gray-100 bg-gray-50'
                  }`}
                >
                  <span className="font-bold text-sm text-primary">{squad.name}</span>
                  {selectedSquad?.id === squad.id && <CheckCircle2 size={18} className="text-primary" />}
                </button>
              ))}
            </div>

            <button
              onClick={handleFinalizeJoin}
              disabled={!selectedSquad || loading}
              className="w-full py-4 bg-primary text-white font-bold rounded-full shadow-md hover:opacity-90 disabled:opacity-40 transition-all text-sm"
            >
              {loading ? 'Enregistrement...' : 'Entrer sur le Terrain'}
            </button>
          </div>
        )}

        {/* PARCOURS LEADER : Créer sa Tribu */}
        {mode === 'create' && (
          <form onSubmit={handleCreateTribe} className="flex flex-col gap-5">
            <div className="text-center">
              <div className="w-12 h-12 bg-accent/10 text-accent rounded-2xl flex items-center justify-center mx-auto mb-2">
                <Shield size={24} />
              </div>
              <h2 className="text-xl font-serif font-bold text-primary">Créer votre Communauté</h2>
              <p className="text-xs text-text-muted mt-1">Vous deviendrez le Leader et pourrez inviter vos membres.</p>
            </div>

            {error && (
              <div className="bg-red-50 text-red-600 p-3 rounded-xl text-xs flex items-center gap-2">
                <AlertCircle size={16} /> {error}
              </div>
            )}

            <div>
              <label className="text-xs font-bold text-text-muted uppercase tracking-wide block mb-1">Nom de la Tribu / Cohorte</label>
              <input
                type="text"
                required
                value={newTribeName}
                onChange={(e) => setNewTribeName(e.target.value)}
                placeholder="Ex: Challenge Momentum 2026"
                className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3.5 text-sm focus:outline-none focus:ring-2 focus:ring-accent/40"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 bg-accent text-white font-bold rounded-full flex items-center justify-center gap-2 shadow-md hover:opacity-90 disabled:opacity-50 transition-all text-sm"
            >
              {loading ? 'Création en cours...' : <>Lancer la Tribu <ArrowRight size={18} /></>}
            </button>

            <button type="button" onClick={() => setMode('select')} className="text-xs text-text-muted hover:underline text-center">
              ← Retour au choix
            </button>
          </form>
        )}

      </div>
    </div>
  );
}