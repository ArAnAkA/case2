// src/components/CosmicCaseOpening.jsx
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useBalance } from '../context/BalanceContext';
import './CosmicCaseOpening.css';

const CosmicCaseOpening = ({ caseItem, onClose, openCount = 1 }) => {
  const [currentStage, setCurrentStage] = useState('idle');
  const [wonItems, setWonItems] = useState([]);
  const [isAnimating, setIsAnimating] = useState(false);
  const [showResult, setShowResult] = useState(false);
  const [openedCount, setOpenedCount] = useState(0);
  const [localOpenCount, setLocalOpenCount] = useState(openCount);
  
  const { addToInventory, balance, deductBalance, addBalance } = useBalance();
  
  const animationRef = useRef(null);
  const caseRefs = useRef([]);
  const itemRefs = useRef([]);

  // Синхронизируем localOpenCount с пропсом openCount
  useEffect(() => {
    setLocalOpenCount(openCount);
  }, [openCount]);

  // Функция для выбора случайного предмета
  const getRandomItem = useCallback((items) => {
    const totalChance = items.reduce((sum, item) => sum + (parseFloat(item.chance) || 0), 0);
    const random = Math.random() * totalChance;
    
    let currentSum = 0;
    for (const item of items) {
      currentSum += parseFloat(item.chance) || 0;
      if (random <= currentSum) {
        return item;
      }
    }
    return items[items.length - 1];
  }, []);

  const startOpening = async () => {
    if (isAnimating || balance < caseItem.price * localOpenCount) return;
    
    setIsAnimating(true);
    setCurrentStage('opening');
    setWonItems([]);
    setOpenedCount(0);
    deductBalance(caseItem.price * localOpenCount);

    // Анимация встряски всех кейсов
    caseRefs.current.forEach((caseRef, index) => {
      if (caseRef) {
        caseRef.style.animation = `caseShake 0.5s ease-in-out ${index * 0.1}s`;
      }
    });

    // Задержка перед показом предметов
    await new Promise(resolve => setTimeout(resolve, 2000));

    // Выбор предметов для всех кейсов
    const items = [];
    for (let i = 0; i < localOpenCount; i++) {
      const item = getRandomItem(caseItem.items);
      items.push({
        ...item,
        id: `item-${Date.now()}-${i}`,
        obtainedAt: new Date().toISOString()
      });
    }
    setWonItems(items);
    
    // Анимация появления предметов
    setCurrentStage('revealed');
    
    // Последовательное появление предметов
    items.forEach((_, index) => {
      setTimeout(() => {
        setOpenedCount(prev => prev + 1);
        if (itemRefs.current[index]) {
          itemRefs.current[index].style.animation = 'itemReveal 1s ease-out forwards';
        }
      }, index * 300);
    });

    // Показ результата после всех анимаций
    await new Promise(resolve => setTimeout(resolve, localOpenCount * 300 + 1500));
    setShowResult(true);
    setIsAnimating(false);
  };

  const handleKeepAll = () => {
    wonItems.forEach(item => {
      if (item) {
        addToInventory(item);
      }
    });
    setCurrentStage('completed');
    setTimeout(() => {
      onClose();
    }, 1000);
  };

  const handleSellAll = () => {
    const totalValue = wonItems.reduce((sum, item) => sum + (item?.value || 0), 0);
    addBalance(totalValue);
    setCurrentStage('completed');
    setTimeout(() => {
      onClose();
    }, 1000);
  };

  const handleOpenAnother = () => {
    // Автоматически добавляем все предметы в инвентарь
    wonItems.forEach(item => {
      if (item) {
        addToInventory(item);
      }
    });
    
    // Сбрасываем состояние для нового открытия
    setWonItems([]);
    setShowResult(false);
    setCurrentStage('idle');
    setIsAnimating(false);
  };

  const getRarityColor = (rarity) => {
    const colors = {
      "Consumer Grade": "#5d6b7a",
      "Industrial Grade": "#4b69ff",
      "Mil-Spec": "#5e98d9",
      "Restricted": "#8847ff",
      "Classified": "#d32ce6",
      "Covert": "#eb4b4b",
      "Extraordinary": "#ffd700",
      "common": "#5d6b7a",
      "uncommon": "#4b69ff",
      "rare": "#5e98d9",
      "mythical": "#8847ff",
      "legendary": "#d32ce6",
      "ancient": "#eb4b4b",
      "forbidden": "#ffd700"
    };
    return colors[rarity] || colors["common"];
  };

  const getRarityGradient = (rarity) => {
    const gradients = {
      "Consumer Grade": "linear-gradient(135deg, #5d6b7a, #7a8a9a)",
      "Industrial Grade": "linear-gradient(135deg, #4b69ff, #6b8bff)",
      "Mil-Spec": "linear-gradient(135deg, #5e98d9, #7eb8f9)",
      "Restricted": "linear-gradient(135deg, #8847ff, #a867ff)",
      "Classified": "linear-gradient(135deg, #d32ce6, #f34cff)",
      "Covert": "linear-gradient(135deg, #eb4b4b, #ff6b6b)",
      "Extraordinary": "linear-gradient(135deg, #ffd700, #fff200)",
      "common": "linear-gradient(135deg, #5d6b7a, #7a8a9a)",
      "uncommon": "linear-gradient(135deg, #4b69ff, #6b8bff)",
      "rare": "linear-gradient(135deg, #5e98d9, #7eb8f9)",
      "mythical": "linear-gradient(135deg, #8847ff, #a867ff)",
      "legendary": "linear-gradient(135deg, #d32ce6, #f34cff)",
      "ancient": "linear-gradient(135deg, #eb4b4b, #ff6b6b)",
      "forbidden": "linear-gradient(135deg, #ffd700, #fff200)"
    };
    return gradients[rarity] || gradients["common"];
  };

  const getRarityGlow = (rarity) => {
    const glows = {
      "Consumer Grade": "0 0 20px rgba(93, 107, 122, 0.5)",
      "Industrial Grade": "0 0 30px rgba(75, 105, 255, 0.6)",
      "Mil-Spec": "0 0 35px rgba(94, 152, 217, 0.7)",
      "Restricted": "0 0 40px rgba(136, 71, 255, 0.8)",
      "Classified": "0 0 45px rgba(211, 44, 230, 0.9)",
      "Covert": "0 0 50px rgba(235, 75, 75, 1)",
      "Extraordinary": "0 0 60px rgba(255, 215, 0, 1)",
      "common": "0 0 20px rgba(93, 107, 122, 0.5)",
      "uncommon": "0 0 30px rgba(75, 105, 255, 0.6)",
      "rare": "0 0 35px rgba(94, 152, 217, 0.7)",
      "mythical": "0 0 40px rgba(136, 71, 255, 0.8)",
      "legendary": "0 0 45px rgba(211, 44, 230, 0.9)",
      "ancient": "0 0 50px rgba(235, 75, 75, 1)",
      "forbidden": "0 0 60px rgba(255, 215, 0, 1)"
    };
    return glows[rarity] || glows["common"];
  };

  const totalValue = wonItems.reduce((sum, item) => sum + (item?.value || 0), 0);

  return (
    <div className="cosmic-case-overlay">
      {/* Космический фон */}
      <div className="cosmic-background">
        <div className="stars"></div>
        <div className="nebula"></div>
      </div>

      <div className="cosmic-case-container">
        {/* Заголовок */}
        <div className="case-header">
          <h1 className="case-title">{caseItem.name}</h1>
          <div className="case-price">${caseItem.price} × {localOpenCount}</div>
          <button className="close-button" onClick={onClose}>✕</button>
        </div>

        {/* Основная область анимации */}
        <div className={`animation-stage multi-${localOpenCount}`}>
          {/* Контейнеры для кейсов и предметов */}
          {Array.from({ length: localOpenCount }).map((_, index) => (
            <div key={index} className="case-slot">
              {/* Кейс - отображается всегда в состоянии idle и opening */}
              <div 
                ref={el => caseRefs.current[index] = el}
                className={`case-container ${
                  currentStage === 'opening' ? 'shaking' : 
                  currentStage === 'revealed' ? 'hidden' : 'idle'
                }`}
              >
                <div className="case-card">
                  <img 
                    src={caseItem.image} 
                    alt={caseItem.name}
                    className="case-image"
                  />
                  <div className="case-glow"></div>
                </div>
              </div>

              {/* Выпавший предмет */}
              {wonItems[index] && (
                <div 
                  ref={el => itemRefs.current[index] = el}
                  className={`won-item ${
                    currentStage === 'revealed' && openedCount > index ? 'revealed' : 'hidden'
                  }`}
                >
                  <div 
                    className="item-card"
                    style={{
                      '--rarity-color': getRarityColor(wonItems[index].rarity),
                      '--rarity-glow': getRarityGlow(wonItems[index].rarity)
                    }}
                  >
                    <div className="item-glow"></div>
                    <div className="item-image-container">
                      <img 
                        src={wonItems[index].image} 
                        alt={wonItems[index].name}
                        className="item-image"
                      />
                    </div>
                    <div className="item-info">
                      <h3 className="item-name">{wonItems[index].name}</h3>
                      <div 
                        className="item-rarity"
                        style={{ background: getRarityGradient(wonItems[index].rarity) }}
                      >
                        {wonItems[index].rarity}
                      </div>
                      <div className="item-value">${wonItems[index].value}</div>
                    </div>
                  </div>
                </div>
              )}

              {/* Лучи света при открытии */}
              {currentStage === 'opening' && (
                <div className="light-beams">
                  <div className="light-beam beam-1"></div>
                  <div className="light-beam beam-2"></div>
                  <div className="light-beam beam-3"></div>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Панель управления */}
        <div className="control-panel">
          {currentStage === 'idle' && (
            <div className="open-controls">
              <div className="count-selector">
                {[1, 2, 3, 4, 5].map(count => (
                  <button
                    key={count}
                    className={`count-btn ${localOpenCount === count ? "active" : ""}`}
                    onClick={() => setLocalOpenCount(count)}
                    disabled={isAnimating}
                  >
                    {count}
                  </button>
                ))}
              </div>
              <button 
                className={`open-button ${balance < caseItem.price * localOpenCount ? 'disabled' : ''}`}
                onClick={startOpening}
                disabled={balance < caseItem.price * localOpenCount || isAnimating}
              >
                <span className="button-text">
                  {balance < caseItem.price * localOpenCount 
                    ? `Недостаточно средств ($${balance})` 
                    : `Открыть ${localOpenCount} кейс${localOpenCount > 1 ? 'а' : ''} за $${(caseItem.price * localOpenCount).toFixed(2)}`}
                </span>
                <div className="button-glow"></div>
              </button>
            </div>
          )}

          {showResult && (
            <div className="result-panel">
              <div className="result-info">
                <div className="total-value">
                  Общая стоимость: <span>${totalValue.toFixed(2)}</span>
                </div>
                <div className="items-count">
                  Получено предметов: <span>{wonItems.length}</span>
                </div>
              </div>
              
              <div className="result-actions">
                <button 
                  className="action-button keep-button"
                  onClick={handleKeepAll}
                >
                  В инвентарь
                </button>

                <button 
                  className="action-button sell-button"
                  onClick={handleSellAll}
                >
                  Продать за ${totalValue.toFixed(2)}
                </button>

                <button 
                  className="action-button another-button"
                  onClick={handleOpenAnother}
                >
                  Открыть еще
                </button>
              </div>
            </div>
          )}

          {currentStage === 'completed' && (
            <div className="completion-message">
              <div className="success-icon">✅</div>
              <div className="success-text">Успешно!</div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CosmicCaseOpening;