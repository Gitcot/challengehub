import { describe, it, expect } from 'vitest';
import { sanitizeInput } from '../utils/security';

describe('Cybersécurité : Tests de la fonction sanitizeInput', () => {
  
  it('Indicateur 1 : Doit laisser passer un texte normal sans balise', () => {
    const input = "Bonjour la tribu !";
    const result = sanitizeInput(input);
    expect(result).toBe("Bonjour la tribu !"); // On s'attend à ce que rien ne change
  });

  it('Indicateur 2 : Doit conserver les balises de formatage autorisées (ex: gras)', () => {
    const input = "Ceci est <b>important</b>";
    const result = sanitizeInput(input);
    expect(result).toBe("Ceci est <b>important</b>");
  });

  it('Indicateur 3 : Doit SUPPRIMER les scripts malveillants (Faille XSS basique)', () => {
    const input = "Super appli ! <script>alert('Piraté')</script>";
    const result = sanitizeInput(input);
    // Le script doit disparaître, il ne reste que le texte
    expect(result).toBe("Super appli ! "); 
  });

  it('Indicateur 4 : Doit neutraliser une attaque XSS via une image corrompue', () => {
    const input = "Regarde ça : <img src='x' onerror='alert(\"Hack\")' />";
    const result = sanitizeInput(input);
    // DOMPurify n'autorise pas les images dans notre configuration, donc la balise doit disparaître
    expect(result).toBe("Regarde ça : ");
  });

});