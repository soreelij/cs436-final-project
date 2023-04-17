import './App.css';
import ImageDisplay from './ImageDisplay.js';
//import $ from 'jquery';
import axios from 'axios';
import React from 'react';

function App() {
 return(
  <div className="App">
   <div className="container h-50">
    <div className="row h-50 justify-content-center align-items-center">
     <header className="App-header">
      <h1>Album.AI</h1>
      <ImageDisplay />
     </header>
    </div>
   </div>
  </div>
 )
}

export default App;
