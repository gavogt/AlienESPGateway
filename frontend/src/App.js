import React, { useState } from 'react';
import Sidebar from './Sidebar';
import {Routes, Route} from 'react-router-dom'
import Home from './Home';
import Control from './Control'
import Diagnostics from './Diagnostics';
import Alerts from './Alerts';
import logo from './logo.svg';
import './App.css';
import Splash from './Splash';

function App() {
  const [showSplash, setShowSplash] = useState(true);

  if(showSplash){
    return <Splash onFinish={() => setShowSplash(false)} />;
  }

  return (
    <div className="App">
      <Sidebar />
      <main className="content">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/control" element={<Control />} />
          <Route path="/diagnostics" element={<Diagnostics />} />
          <Route path="/alerts" element={<Alerts />} />
        </Routes>      
      </main>
    </div>
  );
}

export default App;
