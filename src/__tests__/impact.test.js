import { describe, it, expect } from 'vitest';

// Fonctions pures de calcul d'impact
const calculateTribeImpact = (currentScore, squadMultiplier, basePoints = 10) => {
  if (squadMultiplier <= 0) return currentScore;
  return currentScore + (basePoints * squadMultiplier);
};

const calculateProgressPercentage = (daysValidated, totalDays) => {
  if (!totalDays || totalDays <= 0) return 0;
  return Math.min(Math.round((daysValidated / totalDays) * 100), 100);
};

describe('Logique Communautaire : Impact Escouade & Progression', () => {

  it('Indicateur 1 : Validation standard avec multiplicateur x1.0 -> +10 pts', () => {
    const newScore = calculateTribeImpact(12400, 1.0);
    expect(newScore).toBe(12410);
  });

  it('Indicateur 2 : Validation avec Escouade motivée (Multiplicateur x1.5) -> +15 pts', () => {
    const newScore = calculateTribeImpact(12400, 1.5);
    expect(newScore).toBe(12415);
  });

  it('Indicateur 3 : Validation avec Escouade en retard (Multiplicateur x0.8) -> +8 pts', () => {
    const newScore = calculateTribeImpact(12400, 0.8);
    expect(newScore).toBe(12408);
  });

  it('Indicateur 4 : Progression du parcours (5 jours sur 30 = 17%)', () => {
    const progress = calculateProgressPercentage(5, 30);
    expect(progress).toBe(17);
  });

});