import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useBalance } from '../context/BalanceContext';
import FullscreenCaseOpening from '../components/FullscreenCaseOpening';
import './CasePage.css';

const CasePage = () => {
  const { caseId } = useParams();
  const { cases } = useBalance();
  const [selectedCase, setSelectedCase] = useState(null);
  const [showCaseOpening, setShowCaseOpening] = useState(false);

  useEffect(() => {
    const caseItem = cases.find(c => c.id === caseId);
    if (caseItem) {
      setSelectedCase(caseItem);
    }
  }, [caseId, cases]);

  if (!selectedCase) {
    return <div className="case-not-found">Кейс не найден</div>;
  }

  return (
    <div className="case-page">
      <div className="case-details">
        <div className="case-image-container">
          <img src={selectedCase.image} alt={selectedCase.name} className="case-image" />
        </div>
        <div className="case-info">
          <h1>{selectedCase.name}</h1>
          <p className="case-price">Цена: ${selectedCase.price}</p>
          <p className="case-items-count">Количество предметов: {selectedCase.items.length}</p>
          <button 
            className="open-case-fullscreen-btn"
            onClick={() => setShowCaseOpening(true)}
          >
            Открыть кейс
          </button>
        </div>
      </div>

      <div className="case-items-preview">
        <h2>Возможные предметы:</h2>
        <div className="items-grid">
          {selectedCase.items.map((item, index) => (
            <div key={index} className="item-preview-card">
              <img src={item.image} alt={item.name} className="item-preview-image" />
              <div className="item-preview-info">
                <h3>{item.name}</h3>
                <p className="item-preview-rarity">{item.rarity}</p>
                <p className="item-preview-value">${item.value}</p>
                <p className="item-preview-chance">Шанс: {item.chance}%</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {showCaseOpening && (
        <FullscreenCaseOpening
          caseItem={selectedCase}
          onClose={() => setShowCaseOpening(false)}
          onComplete={(wonItem) => {
            console.log('Вы выиграли:', wonItem);
          }}
        />
      )}
    </div>
  );
};

export default CasePage;
