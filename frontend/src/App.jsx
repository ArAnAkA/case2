// src/App.jsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Home from './pages/Home';
import AdminPanel from './pages/AdminPanel';
import AdminAddCase from './pages/AdminAddCase';
import AdminEditCase from './pages/AdminEditCase';
import CasePage from './pages/CasePage';
import Inventory from './components/Inventory'; 
import { BalanceProvider } from './context/BalanceContext';
import './App.css';

function App() {
  return (
    <BalanceProvider>
      <Router>
        <div className="App">
          <Header />
          <main>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/case/:caseId" element={<CasePage />} />
              <Route path="/admin" element={<AdminPanel />} />
              <Route path="/admin/add-case" element={<AdminAddCase />} />
              <Route path="/admin/edit-case/:caseId" element={<AdminEditCase />} />
              <Route path="/inventory" element={<Inventory />} />
            </Routes>
          </main>
        </div>
      </Router>
    </BalanceProvider>
  );
}

export default App;