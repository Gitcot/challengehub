/**
 * Calcule la couleur de texte optimale (sombre ou claire)
 * en fonction de la couleur de fond (hex) pour garantir la lisibilité (YIQ).
 */
export const getDynamicTextColor = (hexColor) => {
  if (!hexColor) return '#FFFFFF';
  
  // Nettoyage du code hexadécimal
  const hex = hexColor.replace('#', '');
  
  // Conversion si la couleur est au format court (ex: #FFF)
  const fullHex = hex.length === 3 
    ? hex.split('').map(char => char + char).join('') 
    : hex;

  const r = parseInt(fullHex.substring(0, 2), 16);
  const g = parseInt(fullHex.substring(2, 4), 16);
  const b = parseInt(fullHex.substring(4, 6), 16);

  if (isNaN(r) || isNaN(g) || isNaN(b)) return '#FFFFFF';

  // Formule mathématique de luminance YIQ
  const yiq = ((r * 299) + (g * 587) + (b * 114)) / 1000;
  
  // Seuil d'accessibilité WCAG
  return yiq >= 128 ? '#0C3C2E' : '#FFFFFF';
};