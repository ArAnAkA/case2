// src/components/Header.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import { useBalance } from '../context/BalanceContext';
import './Header.css';

const Header = () => {
  const { balance } = useBalance();
 
  const isAdmin = false; // localStorage.getItem('admin_authenticated') === 'true';

  return (
    <header className="app-header"> {}
      <div className="header-container">
        <Link to="/" className="logo">
          CS2 CASE BATTLE
        </Link>
        
        <nav className="nav-links"> {}
          <Link to="/" className="nav-link">Главная</Link>
          <Link to="/inventory" className="nav-link">Инвентарь</Link>
          <Link to="/admin" className="nav-link">Админка</Link>
          <div className="header-balance"> {}
            <span className="balance-label">Баланс:</span>
            <span className="balance-amount">${balance.toFixed(2)}</span> {}
          </div>
        </nav>
      </div>
    </header>
  );
};

export default Header;