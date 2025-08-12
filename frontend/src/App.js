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
import RegisterForm from './RegisterForm';
import Login from './Login';
import Dashboard from './dashboard';
import Telemetry from './Telemetry';
import RequireAuth from './RequiredAuth';

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
          <Route path="/register" element={<RegisterForm />} />
          <Route path="/login" element={<Login />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route 
            path="/telemetry" 
            element={
            <RequireAuth>
              <Telemetry />
            </RequireAuth>
          } />
        </Routes>
      </main>
    </div>
  );
}

export default App;
