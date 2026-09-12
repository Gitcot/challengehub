import { useState, useEffect } from 'react';
import { X, Copy, Check, Share2, Shield, Users } from 'lucide-react';
import { useChallenge, supabase } from '../context/ChallengeContext';

export default function InviteModal({ isOpen, onClose }) {
  const { userData, platformConfig } = useChallenge();
  const [inviteCode, setInviteCode] = useState('TRIBU-2026');
  const [copied, setCopied] = useState(false);
  const [loading, setLoading] = useState(false);

  // Récupérer le code d'invitation réel de la tribu depuis Supabase
  useEffect(() => {
    const fetchTribeInviteCode = async () => {
      if (!userData?.id || !isOpen) return;

      setLoading(true);
      try {
        // 1. Récupérer le tribe_id de l'utilisateur connecté
        const { data: profile } = await supabase
          .from('profiles')
          .select('tribe_id')
          .eq('id', userData.id)
          .single();

        if (profile?.tribe_id) {
          // 2. Récupérer le code de la tribu
          const { data: tribe } = await supabase
            .from('tribes')
            .select('invite_code')
            .eq('id', profile.tribe_id)
            .single();

          if (tribe?.invite_code) {
            setInviteCode(tribe.invite_code);
          }
        }
      } catch (err) {
        console.error("Erreur lors de la récupération du code :", err);
      } finally {
        setLoading(false);
      }
    };

    fetchTribeInviteCode();
  }, [userData?.id, isOpen]);

  if (!isOpen) return null;

  const inviteUrl = `${window.location.origin}?code=${inviteCode}`;

  const handleCopy = () => {
    navigator.clipboard.writeText(inviteCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(inviteUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-surface rounded-3xl p-6 md:p-8 max-w-md w-full shadow-2xl border border-gray-100 relative">
        
        {/* Bouton Fermer */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 text-text-muted hover:text-primary rounded-full hover:bg-gray-100 transition-colors"
        >
          <X size={20} />
        </button>

        {/* En-tête */}
        <div className="text-center mb-6">
          <div 
            className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-3 shadow-sm"
            style={{ backgroundColor: `${platformConfig.primaryColor}15`, color: platformConfig.primaryColor }}
          >
            <Share2 size={26} />
          </div>
          <h2 className="text-2xl font-serif font-bold text-primary">
            Inviter dans {platformConfig.name}
          </h2>
          <p className="text-xs text-text-muted mt-1">
            Partagez ce code unique pour permettre à vos membres de rejoindre la communauté.
          </p>
        </div>

        {/* Affichage du Code de la Tribu */}
        <div className="bg-gray-50 border border-gray-200 rounded-2xl p-4 mb-4 text-center relative group">
          <span className="text-[10px] font-bold text-text-muted uppercase tracking-wider block mb-1">
            Code de la Tribu
          </span>
          
          {loading ? (
            <span className="text-sm font-mono text-text-muted animate-pulse">Chargement du code...</span>
          ) : (
            <div className="flex items-center justify-center gap-3">
              <span className="text-2xl font-mono font-bold text-primary tracking-widest uppercase">
                {inviteCode}
              </span>
              <button
                onClick={handleCopy}
                className="p-2 bg-white border border-gray-200 rounded-xl hover:bg-gray-100 text-primary transition-colors shadow-sm"
                title="Copier le code"
              >
                {copied ? <Check size={18} className="text-green-600" /> : <Copy size={18} />}
              </button>
            </div>
          )}
        </div>

        {/* Boutons d'action */}
        <div className="flex flex-col gap-3">
          <button
            onClick={handleCopyLink}
            style={{ backgroundColor: platformConfig.primaryColor }}
            className="w-full py-3.5 text-white font-bold rounded-full flex items-center justify-center gap-2 shadow-md hover:opacity-90 active:scale-98 transition-all text-sm"
          >
            {copied ? (
              <>
                <Check size={18} />
                <span>Copié dans le presse-papier !</span>
              </>
            ) : (
              <>
                <Copy size={18} />
                <span>Copier le Lien d'Invitation</span>
              </>
            )}
          </button>

          <button
            onClick={onClose}
            className="w-full py-3 text-text-muted font-semibold rounded-full hover:bg-gray-50 transition-colors text-xs"
          >
            Fermer
          </button>
        </div>

        {/* Note informative */}
        <div className="mt-5 pt-4 border-t border-gray-100 flex items-center justify-center gap-2 text-[11px] text-text-muted text-center">
          <Users size={14} className="text-accent shrink-0" />
          <span>Les nouveaux arrivants choisiraient leur escouade lors de la première connexion.</span>
        </div>

      </div>
    </div>
  );
}