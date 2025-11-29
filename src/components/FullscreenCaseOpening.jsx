import React, { useState, useEffect } from 'react';
import { useBalance } from '../context/BalanceContext';
import ImageWithFallback from './ImageWithFallback';
import './FullscreenCaseOpening.css';

const FullscreenCaseOpening = ({ caseItem, onClose, onComplete }) => {
  const [isOpening, setIsOpening] = useState(false);
  const [showResult, setShowResult] = useState(false);
  const [wonItem, setWonItem] = useState(null);
  const { addToInventory, balance, setBalance } = useBalance();

  const openCase = () => {
    if (isOpening) return;
    
    if (balance < caseItem.price) {
      alert('Недостаточно средств!');
      return;
    }

    setBalance(prev => prev - caseItem.price);
    setIsOpening(true);
    
    setTimeout(() => {
      const totalChance = caseItem.items.reduce((sum, item) => sum + item.chance, 0);
      const random = Math.random() * totalChance;
      
      let currentSum = 0;
      let selectedItem = null;
      
      for (const item of caseItem.items) {
        currentSum += item.chance;
        if (random <= currentSum) {
          selectedItem = item;
          break;
        }
      }
      
      setWonItem(selectedItem);
      setShowResult(true);
      addToInventory(selectedItem);
      
    }, 3000);
  };

  const handleClose = () => {
    if (onComplete && wonItem) {
      onComplete(wonItem);
    }
    onClose();
  };

  return (
    <div className="fullscreen-overlay">
      <div className="case-opening-container">
        <button className="close-button" onClick={handleClose}>✕</button>
        
        <div className="case-preview">
          <ImageWithFallback
            src={caseItem.image}
            alt={caseItem.name}
            className="case-image"
            fallback="/skins/fallback.jpg"
          />
          <h2>{caseItem.name}</h2>
        </div>

        {!isOpening ? (
          <div className="opening-controls">
            <button className="open-case-btn" onClick={openCase}>
              Открыть кейс за ${caseItem.price}
            </button>
          </div>
        ) : !showResult ? (
          <div className="opening-animation">
            <div className="spinning-items">
              {caseItem.items.map((item, index) => (
                <div key={index} className="spinning-item">
                  <ImageWithFallback
                    src={item.image}
                    alt={item.name}
                    className="item-spin-image"
                    fallback="/skins/fallback.jpg"
                  />
                </div>
              ))}
            </div>
            <div className="opening-text">Открываем кейс...</div>
          </div>
        ) : (
          <div className="result-section">
            <div className="won-item">
              <div className="item-header">
                <span className="rarity-badge" style={{ 
                  backgroundColor: getRarityColor(wonItem.rarity) 
                }}>
                  {getRarityName(wonItem.rarity)}
                </span>
              </div>
              
              <ImageWithFallback
                src={wonItem.image}
                alt={wonItem.name}
                className="won-item-image"
                fallback="/skins/fallback.jpg"
              />
              
              <h3 className="item-name">{wonItem.name}</h3>
              <p className="item-value">${wonItem.value}</p>
              
              <div className="result-actions">
                <button className="continue-btn" onClick={handleClose}>
                  Продолжить
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

const getRarityColor = (rarity) => {
  const colors = {
    common: "#b0c3d9",
    uncommon: "#5e98d9", 
    rare: "#4b69ff",
    mythical: "#8847ff",
    legendary: "#d32ce6",
    ancient: "#eb4b4b",
    forbidden: "#e4ae39"
  };
  return colors[rarity] || colors.common;
};

const getRarityName = (rarity) => {
  const names = {
    common: "ОБЫЧНЫЙ",
    uncommon: "НЕОБЫЧНЫЙ",
    rare: "РЕДКИЙ",
    mythical: "МИФИЧЕСКИЙ", 
    legendary: "ЛЕГЕНДАРНЫЙ",
    ancient: "ДРЕВНИЙ",
    forbidden: "ЗАПРЕТНЫЙ"
  };
  return names[rarity] || names.common;
};

export default FullscreenCaseOpening;
