import React, { useState, useEffect } from 'react';

interface ICarte {
  symbole: string;
  valeur: string;
}

interface IDetailsPartie {
  tour: number;
  mise: number;
  cartes_joueur: ICarte[];
  cartes_croupier: ICarte[];
  resultat: string | null;
}

interface IPartie {
  id: number;
  nom_joueur: string;
  point: number;
  date_partie: Date;
  partie_gagnee: boolean;
  details_partie: IDetailsPartie[];
}

function Jeu() {
  const [partieData, setPartieData] = useState<IPartie | null>(null);
  const [miseJoueur, setMiseJoueur] = useState<number | null>(null);
  const [roundEnCours, setRoundEnCours] = useState<boolean>(true);

  const melangerCartes = () => {
    const symboles = ['Coeur', 'Carreau', 'Pique', 'Trèfle'];
    const valeurs = ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'Valet', 'Dame', 'Roi', 'As'];

    let cartes: ICarte[] = [];

    for (const symbole of symboles) {
      for (const valeur of valeurs) {
        cartes.push({ symbole, valeur });
      }
    }

    // Mélanger les cartes (Algorithme de Fisher-Yates)
    for (let i = cartes.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [cartes[i], cartes[j]] = [cartes[j], cartes[i]];
    }

    return cartes;
  };

  const distribuerCartes = (cartesMelangees: ICarte[]) => {
    const cartesJoueur = [cartesMelangees.pop()!, cartesMelangees.pop()!];
    const cartesCroupier = [cartesMelangees.pop()!, cartesMelangees.pop()!];

    return { cartesJoueur, cartesCroupier };
  };

  const initialiserPartie = () => {
    const cartesMelangees = melangerCartes();
    const { cartesJoueur, cartesCroupier } = distribuerCartes(cartesMelangees);

    const nouvellePartie: IPartie = {
      id: 1,
      nom_joueur: 'Joueur1',
      point: 200,
      date_partie: new Date(),
      partie_gagnee: false,
      details_partie: [{
        tour: 1,
        mise: 0,
        cartes_joueur: cartesJoueur,
        cartes_croupier: cartesCroupier,
        resultat: null,
      }],
    };

    setPartieData(nouvellePartie);
  };

  const effectuerMise = (mise: number) => {
    if (partieData && partieData.point >= mise) {
      setMiseJoueur(mise);

      setPartieData(prevPartie => ({
        ...prevPartie!,
        point: prevPartie!.point - mise,
        details_partie: [
          ...prevPartie!.details_partie,
          {
            tour: prevPartie!.details_partie.length + 1,
            mise: mise,
            cartes_joueur: [],
            cartes_croupier: [],
            resultat: null,
          },
        ],
      }));
    } else {
      alert("Vous n'avez pas suffisamment de points pour effectuer cette mise.");
    }
  };

  const demanderCarte = () => {
    if (miseJoueur !== null && roundEnCours) {
      const cartesMelangees = melangerCartes();
      const nouvelleCarte = cartesMelangees.pop();

      if (nouvelleCarte) {
        setPartieData(prevPartie => {
          const detailsPartie = [...prevPartie!.details_partie];
          const dernierTour = detailsPartie[detailsPartie.length - 1];
          dernierTour.cartes_joueur.push(nouvelleCarte);

          // Vérifier si le total des points du joueur dépasse 21
          const totalPoints = calculerTotalPoints(dernierTour.cartes_joueur);
          if (totalPoints > 21) {
            // Le joueur a dépassé 21 points, le croupier gagne
            dernierTour.resultat = 'Croupier gagne';
            setRoundEnCours(false);
          }

          return {
            ...prevPartie!,
            details_partie: detailsPartie,
          };
        });
      }
    }
  };

  const passerTour = () => {
    if (miseJoueur !== null && roundEnCours) {
      setPartieData(prevPartie => {
        const detailsPartie = [...prevPartie!.details_partie];
        const dernierTour = detailsPartie[detailsPartie.length - 1];

        // Le croupier joue jusqu'à ce qu'il atteigne au moins 17 points
        while (calculerTotalPoints(dernierTour.cartes_croupier) < 17) {
          const cartesMelangees = melangerCartes();
          const nouvelleCarte = cartesMelangees.pop();
          if (nouvelleCarte) {
            dernierTour.cartes_croupier.push(nouvelleCarte);
          }
        }

        // Déterminer le résultat du round
        const totalPointsJoueur = calculerTotalPoints(dernierTour.cartes_joueur);
        const totalPointsCroupier = calculerTotalPoints(dernierTour.cartes_croupier);

        if (totalPointsJoueur > 21 || (totalPointsCroupier <= 21 && totalPointsCroupier >= totalPointsJoueur)) {
          dernierTour.resultat = 'Croupier gagne';
        } else {
          dernierTour.resultat = 'Joueur gagne';
        }

        // Vérifier si c'est le dernier round
        if (detailsPartie.length === 4) {
          // C'est le dernier round, la partie est terminée
          prevPartie!.partie_gagnee = true;
          setRoundEnCours(false);
        }

        return {
          ...prevPartie!,
          details_partie: detailsPartie,
        };
      });
    }
  };

  const calculerTotalPoints = (cartes: ICarte[]) => {
    // Fonction pour calculer le total des points des cartes
    let totalPoints = 0;
    let asPresent = false;

    for (const carte of cartes) {
      if (['Valet', 'Dame', 'Roi'].includes(carte.valeur)) {
        totalPoints += 10;
      } else if (carte.valeur !== 'As') {
        totalPoints += parseInt(carte.valeur);
      } else {
        // Si un As est présent, ajouter 11 points à moins que cela ne dépasse 21
        asPresent = true;
        totalPoints += 11;
      }
    }

    // Gérer les As supplémentaires
    while (asPresent && totalPoints > 21) {
      totalPoints -= 10;
    }

    return totalPoints;
  };

  const sauvegarderPartie = () => {
    // Fonction pour sauvegarder la partie (vous pouvez ajouter la logique appropriée ici)
    alert('Partie sauvegardée !');
  };

  useEffect(() => {
    initialiserPartie();
  }, []);

  if (!partieData) {
    return <p>Le jeu est en cours...</p>;
  }

  return (
    <div>
      <h2>Partie en cours</h2>
      <p>Nom du joueur : {partieData.nom_joueur}</p>
      <p>Points : {partieData.point}</p>
      <p>Date de la partie : {partieData.date_partie.toLocaleDateString('fr-FR', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
      <p>Partie gagnée : {partieData.partie_gagnee ? 'Oui' : 'Non'}</p>

      <h3>Détails des tours :</h3>
      {partieData.details_partie.map((details, index) => (
        <div key={index}>
          <p>Tour {details.tour}</p>
          <p>Mise : {details.mise}</p>

          <p>Cartes du joueur :</p>
          <ul>
            {details.cartes_joueur.map((carte, i) => (
              <li key={i}>{carte.symbole} - {carte.valeur}</li>
            ))}
          </ul>

          <p>Cartes du croupier :</p>
          <ul>
            {details.cartes_croupier.map((carte, i) => (
              <li key={i}>{i === 0 ? 'Carte cachée' : `${carte.symbole} - ${carte.valeur}`}</li>
            ))}
          </ul>

          <p>Résultat du tour : {details.resultat || 'En cours'}</p>
        </div>
      ))}

    <h3>Actions du joueur :</h3>
      <div>
        <button onClick={() => effectuerMise(10)}>Miser 10 points</button>
        <button onClick={() => effectuerMise(20)}>Miser 20 points</button>
        <button onClick={() => effectuerMise(50)}>Miser 50 points</button>
      </div>

      {(miseJoueur !== null && roundEnCours) && (
        <div>
          <button onClick={demanderCarte}>Demander une autre carte</button>
          <button onClick={passerTour}>Passer son tour</button>
        </div>
      )}

      {!roundEnCours && (
        <div>
          {partieData.partie_gagnee ? (
            <p>Partie terminée. Vous avez gagné !</p>
          ) : (
            <p>Partie terminée. Vous avez perdu.</p>
          )}
          <button onClick={sauvegarderPartie}>Sauvegarder la partie</button>
        </div>
      )}
    </div>
  );
}

export default Jeu;