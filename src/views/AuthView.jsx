import { useState } from 'react';
import { Mail, Lock, Sparkles, ArrowRight, KeyRound, AlertCircle, CheckCircle2, ShieldCheck } from 'lucide-react';
import { supabase, useChallenge } from '../context/ChallengeContext';

export default function AuthView({ onAuthenticated }) {
  const { platformConfig } = useChallenge();
  const [mode, setMode] = useState('login'); // 'login' | 'signup' | 'magic_link'
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const handleAuth = async (e) => {
    e.preventDefault();
    setError('');
    setSuccessMsg('');
    setLoading(true);

    try {
      if (mode === 'magic_link') {
        // Envoi d'un Lien Magique sans mot de passe
        const { error: magicError } = await supabase.auth.signInWithOtp({
          email: email.trim(),
          options: {
            emailRedirectTo: window.location.origin,
          },
        });

        if (magicError) throw magicError;
        setSuccessMsg('Un lien magique de connexion a été envoyé sur votre adresse e-mail !');
      } else if (mode === 'signup') {
        // Inscription Email + Mot de passe
        if (!fullName.trim()) {
          throw new Error('Veuillez renseigner votre nom complet.');
        }

        const { data, error: signUpError } = await supabase.auth.signUp({
          email: email.trim(),
          password: password,
          options: {
            data: {
              full_name: fullName.trim(),
            },
          },
        });

        if (signUpError) throw signUpError;

        // Création automatique de la fiche profil dans la table 'profiles'
        if (data?.user) {
          await supabase.from('profiles').insert([
            {
              id: data.user.id,
              full_name: fullName.trim(),
              role: 'member',
            },
          ]);
        }

        setSuccessMsg('Compte créé avec succès ! Vérifiez votre boîte mail si la confirmation est requise.');
        if (onAuthenticated) onAuthenticated();
      } else {
        // Connexion standard Email + Mot de passe
        const { error: signInError } = await supabase.auth.signInWithPassword({
          email: email.trim(),
          password: password,
        });

        if (signInError) throw signInError;
        if (onAuthenticated) onAuthenticated();
      }
    } catch (err) {
      setError(err.message || 'Une erreur est survenue lors de l\'authentification.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[85vh] flex flex-col justify-center items-center p-4">
      <div className="bg-surface p-8 rounded-3xl shadow-xl border border-gray-100 max-w-md w-full animate-in fade-in duration-300">
        
        {/* En-tête dynamique */}
        <div className="text-center mb-6">
          <div 
            className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-3 shadow-sm"
            style={{ backgroundColor: `${platformConfig.primaryColor}15`, color: platformConfig.primaryColor }}
          >
            {mode === 'magic_link' ? <KeyRound size={28} /> : <Sparkles size={28} />}
          </div>
          <h1 className="text-2xl font-serif font-bold text-primary">
            {mode === 'login' && 'Connexion au Challenge'}
            {mode === 'signup' && 'Créer votre Compte'}
            {mode === 'magic_link' && 'Lien Magique Instantané'}
          </h1>
          <p className="text-xs text-text-muted mt-1">
            {mode === 'login' && 'Accédez à votre espace et rejoignez votre Escouade.'}
            {mode === 'signup' && 'Rejoignez la Tribu pour suivre votre progression.'}
            {mode === 'magic_link' && 'Connectez-vous sans mot de passe via un e-mail sécurisé.'}
          </p>
        </div>

        {/* Notifications d'erreur ou de succès */}
        {error && (
          <div className="bg-red-50 text-red-600 p-3.5 rounded-2xl text-xs flex items-center gap-2 border border-red-100 mb-4">
            <AlertCircle size={16} className="shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {successMsg && (
          <div className="bg-green-50 text-green-700 p-3.5 rounded-2xl text-xs flex items-center gap-2 border border-green-100 mb-4">
            <CheckCircle2 size={16} className="shrink-0" />
            <span>{successMsg}</span>
          </div>
        )}

        {/* Formulaire Supabase Auth */}
        <form onSubmit={handleAuth} className="flex flex-col gap-4">
          
          {/* Nom complet (uniquement en inscription) */}
          {mode === 'signup' && (
            <div>
              <label className="text-xs font-bold text-text-muted uppercase tracking-wide block mb-1">
                Nom complet
              </label>
              <input
                type="text"
                required
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Ex: Sarah Connor"
                className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 transition-all"
              />
            </div>
          )}

          {/* E-mail */}
          <div>
            <label className="text-xs font-bold text-text-muted uppercase tracking-wide block mb-1">
              Adresse E-mail
            </label>
            <div className="relative">
              <Mail size={18} className="absolute left-3.5 top-3.5 text-text-muted" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="nom@exemple.com"
                className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3.5 pl-10 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 transition-all"
              />
            </div>
          </div>

          {/* Mot de passe (masqué en mode Magic Link) */}
          {mode !== 'magic_link' && (
            <div>
              <div className="flex justify-between items-center mb-1">
                <label className="text-xs font-bold text-text-muted uppercase tracking-wide">
                  Mot de passe
                </label>
                {mode === 'login' && (
                  <button
                    type="button"
                    onClick={() => setMode('magic_link')}
                    className="text-[11px] font-bold text-accent hover:underline"
                  >
                    Mot de passe oublié ?
                  </button>
                )}
              </div>
              <div className="relative">
                <Lock size={18} className="absolute left-3.5 top-3.5 text-text-muted" />
                <input
                  type="password"
                  required
                  minLength={6}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3.5 pl-10 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 transition-all"
                />
              </div>
            </div>
          )}

          {/* Bouton de Soumission */}
          <button
            type="submit"
            disabled={loading}
            style={{ backgroundColor: platformConfig.primaryColor }}
            className="w-full py-4 text-white font-bold rounded-full flex items-center justify-center gap-2 shadow-md hover:opacity-90 active:scale-98 disabled:opacity-50 transition-all text-sm mt-2"
          >
            {loading ? (
              <span className="animate-pulse">Traitement sécurisé...</span>
            ) : (
              <>
                {mode === 'login' && 'Se Connecter'}
                {mode === 'signup' && 'Créer mon Compte'}
                {mode === 'magic_link' && 'Envoyer le Lien Magique'}
                <ArrowRight size={18} />
              </>
            )}
          </button>
        </form>

        {/* Sélecteurs de mode */}
        <div className="mt-6 pt-5 border-t border-gray-100 flex flex-col gap-2 text-center text-xs text-text-muted">
          {mode === 'login' && (
            <>
              <p>
                Pas encore de compte ?{' '}
                <button onClick={() => setMode('signup')} className="font-bold text-primary hover:underline">
                  S'inscrire
                </button>
              </p>
              <p>
                Ou préférez un{' '}
                <button onClick={() => setMode('magic_link')} className="font-bold text-accent hover:underline">
                  Lien magique sans mot de passe
                </button>
              </p>
            </>
          )}

          {mode === 'signup' && (
            <p>
              Déjà un compte ?{' '}
              <button onClick={() => setMode('login')} className="font-bold text-primary hover:underline">
                Se connecter
              </button>
            </p>
          )}

          {mode === 'magic_link' && (
            <p>
              Revenir à la{' '}
              <button onClick={() => setMode('login')} className="font-bold text-primary hover:underline">
                Connexion classique
              </button>
            </p>
          )}
        </div>

        {/* Badge de sécurité */}
        <div className="mt-4 flex items-center justify-center gap-1.5 text-[10px] text-text-muted">
          <ShieldCheck size={14} className="text-accent" />
          <span>Authentification sécurisée via Supabase SSL</span>
        </div>

      </div>
    </div>
  );
}