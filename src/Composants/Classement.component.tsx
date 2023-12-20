import React, { useState, useEffect } from 'react';
import axios from 'axios';

interface PartieData {
  _id: string;
  id: number;
  nom_joueur: string;
  point: number;
  date_partie: string;
  partie_gagnee: boolean;
  details_partie: DetailsPartie[];
}

interface DetailsPartie {
  _id: string;
  tour: number;
  mise: number;
  cartes_joueur: { [key: string]: string }[];
  cartes_croupier: { [key: string]: string }[];
}

function Classement() {
  const [classementData, setClassementData] = useState<PartieData[]>([]);
  const [tri, setTri] = useState<string | null>(null);

  const appelerApi = () => {
    axios.get('http://localhost:3000/parties')
      .then((res) => {
        console.log('Données de l\'API:', res.data.parties);
        setClassementData(res.data.parties);
      })
      .catch((error) => {
        console.error('Erreur lors de la récupération des données de l\'API :', error.message);
      });
  };

  useEffect(() => {
    // Appeler l'API lors du montage du composant
    appelerApi();
  }, []); // Le tableau vide [] assure que useEffect est exécuté une seule fois au montage du composant

  const trierListe = () => {
    if (tri === 'date') {
      return (a: PartieData, b: PartieData) => new Date(b.date_partie).getTime() - new Date(a.date_partie).getTime();
    } else if (tri === 'score') {
      return (a: PartieData, b: PartieData) => b.point - a.point;
    } else {
      return undefined;
    }
  };

  const partiesTriees = [...classementData].sort(trierListe());

  return (
    <div>
      <h2>Classement des parties</h2>
      {(tri === 'date' || tri === 'score') && (
        <ul>
          {partiesTriees.map((partie, index) => (
            <li key={index}>
              <strong>Partie {partie.id}:</strong>
              <p>Nom du joueur: {partie.nom_joueur}</p>
              <p>Point: {partie.point}</p>
              <p>Date de la partie: {partie.date_partie}</p>
              <p>Partie gagnée: {partie.partie_gagnee ? 'Oui' : 'Non'}</p>
            </li>
          ))}
        </ul>
      )}
      {!tri && (
        <div>
          <button onClick={() => setTri('date')}>Trier par date</button>
          <button onClick={() => setTri('score')}>Trier par score</button>
        </div>
      )}
    </div>
  );
}

export default Classement;
