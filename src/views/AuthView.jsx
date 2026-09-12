import { useState, useEffect } from 'react';
import { X, Copy, Check, Share2, Users } from 'lucide-react';
import { useChallenge, supabase } from '../context/ChallengeContext';

export default function InviteModal({ isOpen, onClose }) {
  const { userData, platformConfig } = useChallenge();
  const [inviteCode, setInviteCode] = useState('');
  const [copied, setCopied] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRealInviteCode = async () => {
      if (!userData?.id || !isOpen) return;

      setLoading(true);
      try {
        // 1. Récupérer le tribe_id de l'utilisateur
        const { data: profile } = await supabase
          .from('profiles')
          .select('tribe_id')
          .eq('id', userData.id)
          .single();

        if (profile?.tribe_id) {
          // 2. Récupérer le code unique de CETTE tribu
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
        console.error("Erreur récupération code tribu:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchRealInviteCode();
  }, [userData?.id, isOpen]);

  if (!isOpen) return null;

  const inviteUrl = `${window.location.origin}?code=${inviteCode}`;

  const handleCopyCode = () => {
    navigator.clipboard.writeText(inviteCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(inviteUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-surface rounded-3xl p-6 md:p-8 max-w-md w-full shadow-2xl border border-gray-100 relative">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 text-text-muted hover:text-primary rounded-full hover:bg-gray-100 transition-colors"
        >
          <X size={20} />
        </button>

        <div className="text-center mb-6">
          <div 
            className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-3 shadow-xs"
            style={{ backgroundColor: `${platformConfig.primaryColor}15`, color: platformConfig.primaryColor }}
          >
            <Share2 size={26} />
          </div>
          <h2 className="text-2xl font-serif font-bold text-primary">
            Inviter un Membre
          </h2>
          <p className="text-xs text-text-muted mt-1">
            Partagez ce code unique pour qu'un membre rejoigne votre tribu.
          </p>
        </div>

        <div className="bg-gray-50 border border-gray-200 rounded-2xl p-4 mb-4 text-center">
          <span className="text-[10px] font-bold text-text-muted uppercase tracking-wider block mb-1">
            Code Unique de la Tribu
          </span>
          {loading ? (
            <span className="text-xs font-mono text-text-muted animate-pulse">Chargement du code...</span>
          ) : (
            <div className="flex items-center justify-center gap-3">
              <span className="text-2xl font-mono font-bold text-primary tracking-widest uppercase">
                {inviteCode || 'AUCUN CODE'}
              </span>
              <button
                onClick={handleCopyCode}
                className="p-2 bg-white border border-gray-200 rounded-xl hover:bg-gray-100 text-primary transition-colors shadow-xs"
                title="Copier le code"
              >
                {copied ? <Check size={18} className="text-green-600" /> : <Copy size={18} />}
              </button>
            </div>
          )}
        </div>

        <div className="flex flex-col gap-3">
          <button
            onClick={handleCopyLink}
            style={{ backgroundColor: platformConfig.primaryColor }}
            className="w-full py-3.5 text-white font-bold rounded-full flex items-center justify-center gap-2 shadow-md hover:opacity-90 active:scale-98 transition-all text-sm"
          >
            {copied ? <Check size={18} /> : <Copy size={18} />}
            <span>{copied ? 'Lien copié !' : "Copier le Lien d'Invitation"}</span>
          </button>
        </div>
      </div>
    </div>
  );
}