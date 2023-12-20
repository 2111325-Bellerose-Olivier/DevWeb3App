import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import Jeu from './Composants/Jeu.component'
import Classement from './Composants/Classement.component'

function App() {
  const [count, setCount] = useState(0);
  const [jeuEnCours, setJeuEnCours] = useState(false);
  const [afficherClassement, setAfficherClassement] = useState(false);

  const handleClickJouer = () => {
    setCount((count) => count + 1);
    setJeuEnCours(true);
  };

  const handleClickClassement = () => {
    setAfficherClassement(true);
    setJeuEnCours(false); // Assurez-vous que le jeu n'est pas affiché lorsqu'on consulte le classement
  };

  return (
    <div className="app-container">
      {jeuEnCours ? (
        <Jeu />
      ) : afficherClassement ? (
        <Classement />
      ) : (
        <>
          <button onClick={handleClickJouer}>Jouer</button>
          <button onClick={handleClickClassement}>Classement</button>
          <button>Se connecter</button>
        </>
      )}
    </div>
  );
}

export default App
