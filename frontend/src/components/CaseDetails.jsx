import React from 'react';
import './CaseDetails.css';

const CaseDetails = ({ caseItem, onClose }) => {
  // Цвета для редкостей
  const getRarityColor = (rarity) => {
    const colors = {
      common: '#b0c3d9',
      uncommon: '#5e98d9',
      rare: '#4b69ff',
      mythical: '#8847ff',
      legendary: '#d32ce6',
      ancient: '#eb4b4b',
      forbidden: '#e4ae39'
    };
    return colors[rarity] || colors.common;
  };

  // Названия редкостей
  const getRarityName = (rarity) => {
    const names = {
      common: 'Ширпотреб',
      uncommon: 'Промышленное',
      rare: 'Армейское',
      mythical: 'Запрещенное',
      legendary: 'Засекреченное',
      ancient: 'Тайное',
      forbidden: 'Экстраординарное'
    };
    return names[rarity] || names.common;
  };

  return (
    <div className="case-details-overlay" onClick={onClose}>
      <div className="case-details" onClick={(e) => e.stopPropagation()}>
        <button className="close-btn" onClick={onClose}>×</button>
        
        <div className="case-header">
          <img src={caseItem.image} alt={caseItem.name} className="case-image-large" />
          <div className="case-info">
            <h2>{caseItem.name}</h2>
            <p className="case-price">${caseItem.price}</p>
            <p className="case-description">Содержит {caseItem.items.length} предметов</p>
          </div>
        </div>

        <div className="items-grid">
          <h3>Содержимое кейса:</h3>
          <div className="items-list">
            {caseItem.items.map((item, index) => (
              <div 
                key={index} 
                className="item-card"
                style={{ borderColor: getRarityColor(item.rarity) }}
              >
                <div 
                  className="item-rarity"
                  style={{ backgroundColor: getRarityColor(item.rarity) }}
                ></div>
                <img 
                  src={item.image} 
                  alt={item.name}
                  className="item-image"
                  onError={(e) => {
                    e.target.src = 'https://via.placeholder.com/100x75/333333/ffffff?text=No+Image';
                  }}
                />
                <div className="item-info">
                  <div className="item-name">{item.name}</div>
                  <div 
                    className="item-rarity-name"
                    style={{ color: getRarityColor(item.rarity) }}
                  >
                    {getRarityName(item.rarity)}
                  </div>
                  <div className="item-value">${item.value}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="case-actions">
          <button className="open-case-btn" onClick={onClose}>
            Открыть этот кейс
          </button>
        </div>
      </div>
    </div>
  );
};

export default CaseDetails;