import React, { useState, useEffect } from 'react';

interface CarteValeur {
  [key: string]: number;
  Valet: number;
  Dame: number;
  Roi: number;
}

const valeursCartes: CarteValeur = {
  Valet: 11,
  Dame: 12,
  Roi: 13,
};

const initialiserPaquet = () => {
  const symboles = ['Coeur', 'Carreau', 'Pique', 'Trèfle'];
  const valeurs = ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'Valet', 'Dame', 'Roi', 'As'];
  const paquet = [];

  for (const symbole of symboles) {
    for (const valeur of valeurs) {
      paquet.push({ symbole, valeur });
    }
  }

  // Mélanger les cartes (Algorithme de Fisher-Yates)
  for (let i = paquet.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [paquet[i], paquet[j]] = [paquet[j], paquet[i]];
  }

  return paquet;
};

function Jeu() {
  const [paquet, setPaquet] = useState<{ symbole: string; valeur: string; }[]>([]);
  const [joueur, setJoueur] = useState<{ symbole: string; valeur: string; }[]>([]);
  const [croupier, setCroupier] = useState<{ symbole: string; valeur: string; }[]>([]);
  const [pointsJoueur, setPointsJoueur] = useState<number>(0);
  const [pointsCroupier, setPointsCroupier] = useState<number>(0);
  const [round, setRound] = useState<number>(1);

  useEffect(() => {
    const nouveauPaquet = initialiserPaquet();
    const moitiePaquet = Math.floor(nouveauPaquet.length / 2);

    setPaquet(nouveauPaquet);
    setJoueur(nouveauPaquet.slice(0, moitiePaquet));
    setCroupier(nouveauPaquet.slice(moitiePaquet));
  }, []);

  const comparerCartes = () => {
    const carteJoueur = joueur.pop();
  const carteCroupier = croupier.pop();

  if (carteJoueur && carteCroupier) {
    const valeurJoueur = valeursCartes[carteJoueur.valeur] || parseInt(carteJoueur.valeur, 10);
    const valeurCroupier = valeursCartes[carteCroupier.valeur] || parseInt(carteCroupier.valeur, 10);


    if (valeurJoueur > valeurCroupier) {
      setPointsJoueur((prevPoints) => prevPoints + 1);
    } else if (valeurJoueur < valeurCroupier) {
      setPointsCroupier((prevPoints) => prevPoints + 1);
    }

    if (round < 10) {
      setRound((prevRound) => prevRound + 1);
    }
  }
};

  const rejouer = () => {
    const nouveauPaquet = initialiserPaquet();
    const moitiePaquet = Math.floor(nouveauPaquet.length / 2);

    setPaquet(nouveauPaquet);
    setJoueur(nouveauPaquet.slice(0, moitiePaquet));
    setCroupier(nouveauPaquet.slice(moitiePaquet));
    setPointsJoueur(0);
    setPointsCroupier(0);
    setRound(1);
  };

  return (
    <div>
      <h2>Jeu de la Bataille</h2>
      <p>Round: {round}</p>
      <p>Points Joueur: {pointsJoueur}</p>
      <p>Points Croupier: {pointsCroupier}</p>

      {round < 10 ? (
        <div>
          <button onClick={comparerCartes}>Jouer le prochain round</button>
        </div>
      ) : (
        <div>
          <p>Fin du jeu</p>
          <p>Résultat: {pointsJoueur > pointsCroupier ? 'Vous avez gagné !' : 'Le croupier a gagné.'}</p>
          <button onClick={rejouer}>Rejouer</button>
        </div>
      )}
    </div>
  );
}

export default Jeu;
