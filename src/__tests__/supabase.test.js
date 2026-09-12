import { describe, it, expect } from 'vitest';
import { supabase } from '../context/ChallengeContext';

describe('Test de Connexion & Intégration Supabase', () => {

  it('Indicateur 1 : La configuration Supabase doit être chargée', () => {
    // Vérifie que l'URL et la clé anonyme sont bien définies dans .env
    expect(import.meta.env.VITE_SUPABASE_URL).toBeDefined();
    expect(import.meta.env.VITE_SUPABASE_ANON_KEY).toBeDefined();
  });

  it('Indicateur 2 : Connexion réseau et lecture de la table TRIBES', async () => {
    // Effectue une requête réelle de lecture vers Supabase
    const { data, error } = await supabase.from('tribes').select('*').limit(1);
    
    // Si la table est accessible, aucune erreur de connexion ne doit être retournée
    expect(error).toBeNull();
    expect(Array.isArray(data)).toBe(true);
  });

});