import './App.css';
import React from 'react';
import AlbumOnboarder from "./AlbumOnboarder";
import logo from './algorhythm-icon.png';

function App() {
 return(
  <div className="App">
   <div className="container h-50">
    <div className="row h-50 justify-content-center align-items-center">
     <header className="App-header">
      <h1 className="mb-4">AlgoRhythm</h1>
      <div className="neumorph m-3">
        <img width="100" height="100" className="m-4 img-fluid" src={logo} />
      </div>
      <div className="mt-2">
       <AlbumOnboarder/>
      </div>
     </header>
    </div>
   </div>
  </div>
 )
}

export default App;
