import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { ChallengeProvider } from '../context/ChallengeContext';
import HomeView from '../views/HomeView';

const renderWithContext = (ui) => {
  return render(
    <ChallengeProvider>
      {ui}
    </ChallengeProvider>
  );
};

describe('Tests d\'Intégration : Interactions Utilisateur (RTL)', () => {

  it('Indicateur 1 : Le clic sur le bouton + incrémente le compteur', () => {
    renderWithContext(<HomeView />);

    const plusButton = screen.getByTestId('btn-increment');
    const counter = screen.getByTestId('counter-value');

    // Vérification de l'état initial
    expect(counter.textContent).toBe('0');

    // Clic sur +
    fireEvent.click(plusButton);

    // Vérification de la mise à jour du compteur
    expect(counter.textContent).toBe('1');
  });

  it('Indicateur 2 : La validation met à jour le statut du bouton', () => {
    renderWithContext(<HomeView />);

    const plusButton = screen.getByTestId('btn-increment');
    const validateButton = screen.getByTestId('btn-validate');

    // Incrémentation préalable pour débloquer la validation
    fireEvent.click(plusButton);

    // Validation
    fireEvent.click(validateButton);

    // Vérification du changement de texte du bouton
    expect(validateButton.textContent).toMatch(/Mission accomplie/i);
  });

});