import { describe, it, expect } from 'vitest';
import { getDynamicTextColor } from '../utils/theme';

describe('Ergonomie & Accessibilité : Tests de contraste YIQ', () => {

  it('Indicateur 1 : Fond Blanc (#FFFFFF) -> Texte sombre requis', () => {
    const textColor = getDynamicTextColor('#FFFFFF');
    expect(textColor).toBe('#0C3C2E');
  });

  it('Indicateur 2 : Fond Noir (#000000) -> Texte blanc requis', () => {
    const textColor = getDynamicTextColor('#000000');
    expect(textColor).toBe('#FFFFFF');
  });

  it('Indicateur 3 : Couleur Jaune clair (#FFFF00) -> Texte sombre requis', () => {
    const textColor = getDynamicTextColor('#FFFF00');
    expect(textColor).toBe('#0C3C2E');
  });

  it('Indicateur 4 : Couleur Bleu marine foncé (#00008B) -> Texte blanc requis', () => {
    const textColor = getDynamicTextColor('#00008B');
    expect(textColor).toBe('#FFFFFF');
  });

  it('Indicateur 5 : Gestion d\'entrée invalide/vide -> Repli sécurisé sur Blanc', () => {
    const textColor = getDynamicTextColor('');
    expect(textColor).toBe('#FFFFFF');
  });

});