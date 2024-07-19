import React from 'react';
import DeckOfCards from './DeckOfCards';
import './App.css'; // Create and import a CSS file for styling

const App = () => {

  document.addEventListener('drawCardEvent', (event) => {
    console.log(`Received signal with message: ${event.detail}`);

    const container = document.querySelector('.deck-container');
    const collection = document.querySelector('.Collection');

    container.classList.add('fade-in');
    setTimeout(() => {
      container.classList.remove('fade-in');
      container.classList.add('fade-out');
      // Listen for the end of the fade-out animation
      container.addEventListener('animationend', () => {
        collection.hidden = false;
        collection.classList.add('fade-in');
        // Optionally, remove the event listener if it's no longer needed
        container.removeEventListener('animationend', () => {});
      });
    }, 5000);



  });

  return (
    <div className="app-container">
      <h1>Moist Shirt</h1>
      <div className="deck-container"> 
        <DeckOfCards />
      </div>

      <div className="Collection" hidden="true">

        <div className="card">
          <img className="frontCard" src="./card_front.png" alt="placeholder" />
          <img className='artCard' src='./example.png' alt="placeholder" />
          <p>Card 1</p>


      </div>

      </div>
      
    </div>
  );
};

export default App;
