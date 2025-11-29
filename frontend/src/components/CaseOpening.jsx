// src/components/CaseOpening.jsx
import React, { useState, useEffect, useRef } from "react";
import { useBalance } from "../context/BalanceContext";
import "./CaseOpening.css";

const CaseOpening = ({ caseItem, onClose, openCount }) => {
  const [openedItems, setOpenedItems] = useState([]);
  const [currentOpen, setCurrentOpen] = useState(0);
  const [isOpening, setIsOpening] = useState(false);
  const [animationStage, setAnimationStage] = useState("idle");
  const [currentItems, setCurrentItems] = useState([]);
  const [handAnimations, setHandAnimations] = useState([]);
  const { addToInventory, addBalance, balance, deductBalance } = useBalance();
  
  const wheelRef = useRef(null);
  const portalRef = useRef(null);

  // Создаем элементы для колеса
  const createWheelItems = () => {
    const items = [];
    const totalItems = 16;
    
    for (let i = 0; i < totalItems; i++) {
      const randomItem = getRandomItem(caseItem.items);
      items.push({
        ...randomItem,
        id: `wheel-${i}-${Date.now()}`,
        angle: (i * 360) / totalItems
      });
    }
    return items;
  };

  // Функция для выбора предмета на основе вероятностей
  const getRandomItem = (items) => {
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
  };

  const startMassOpening = async () => {
    if (isOpening) return;
    
    if (balance < caseItem.price * openCount) {
      alert(`Недостаточно средств! Нужно: $${caseItem.price * openCount}, у вас: $${balance}`);
      return;
    }

    setIsOpening(true);
    setOpenedItems([]);
    setCurrentOpen(0);
    deductBalance(caseItem.price * openCount);
    
    // Генерируем все предметы заранее
    const items = [];
    for (let i = 0; i < openCount; i++) {
      items.push(getRandomItem(caseItem.items));
    }
    setCurrentItems(items);
    
    // Запускаем анимацию колеса
    setAnimationStage("spinning");
    
    // После вращения колеса запускаем массовую анимацию рук
    setTimeout(() => {
      setAnimationStage("massHands");
      startMassHandAnimation(items);
    }, 3000);
  };

  const startMassHandAnimation = (items) => {
    const animations = items.map((item, index) => ({
      id: index,
      item: item,
      stage: 'reach',
      position: { x: Math.random() * 200 - 100, y: Math.random() * 100 - 50 }
    }));
    
    setHandAnimations(animations);

    // Последовательная анимация для каждой руки
    animations.forEach((anim, index) => {
      setTimeout(() => {
        setHandAnimations(prev => prev.map(a => 
          a.id === anim.id ? { ...a, stage: 'grab' } : a
        ));
        
        setTimeout(() => {
          setHandAnimations(prev => prev.map(a => 
            a.id === anim.id ? { ...a, stage: 'throw' } : a
          ));
          
          setTimeout(() => {
            setHandAnimations(prev => prev.filter(a => a.id !== anim.id));
            setOpenedItems(prev => [...prev, { ...anim.item, id: Date.now() + index }]);
            addToInventory(anim.item);
            setCurrentOpen(prev => prev + 1);
            
            if (index === animations.length - 1) {
              setTimeout(() => setAnimationStage("complete"), 1000);
            }
          }, 600);
        }, 300);
      }, index * 200);
    });
  };

  // Функция продажи отдельного предмета
  const handleSellItem = (itemId) => {
    const item = openedItems.find(item => item.id === itemId);
    if (item) {
      addBalance(item.value);
      setOpenedItems(prev => prev.filter(item => item.id !== itemId));
    }
  };

  // Функция продажи всех предметов
  const handleSellAll = () => {
    const totalValue = openedItems.reduce((sum, item) => sum + item.value, 0);
    addBalance(totalValue);
    setOpenedItems([]);
    onClose();
  };

  // Функция сохранения всех предметов в инвентарь
  const handleKeepAll = () => {
    onClose();
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

  const totalValue = openedItems.reduce((sum, item) => sum + item.value, 0);

  return (
    <div className="case-opening-overlay">
      <div className="case-opening-modal">
        <div className="opening-header">
          <h2>Открываем {caseItem.name}</h2>
          <div className="opening-progress">
            {isOpening 
              ? `Открыто ${currentOpen} из ${openCount}` 
              : `Выбрано ${openCount} кейсов`}
          </div>
        </div>

        {/* Основная область анимации */}
        <div className="opening-animation-area">
          {/* Круг вращающихся скинов */}
          {animationStage === "spinning" && (
            <div className={`spinning-wheel-container spinning`}>
              <div className="spinning-wheel" ref={wheelRef}>
                {createWheelItems().map((item, index) => (
                  <div
                    key={item.id}
                    className="wheel-item"
                    style={{
                      transform: `rotate(${item.angle}deg) translate(160px) rotate(-${item.angle}deg)`,
                      animationDelay: `${index * 0.1}s`
                    }}
                  >
                    <img 
                      src={item.image} 
                      alt={item.name}
                      className="wheel-item-image"
                      onError={(e) => {
                        e.target.src = "/skins/fallback.jpg";
                      }}
                    />
                  </div>
                ))}
                <div className="wheel-center"></div>
              </div>
              <div className="selection-indicator"></div>
            </div>
          )}

          {/* Массовая анимация рук */}
          {animationStage === "massHands" && (
            <>
              <div className="magic-portal" ref={portalRef}>
                <div className="portal-glow"></div>
                <div className="portal-core"></div>
                <div className="portal-particles">
                  {[...Array(12)].map((_, i) => (
                    <div key={i} className="portal-particle" style={{
                      animationDelay: `${i * 0.2}s`
                    }}></div>
                  ))}
                </div>
              </div>
              
              {handAnimations.map((hand) => (
                <div
                  key={hand.id}
                  className={`animated-hand ${hand.stage}`}
                  style={{
                    transform: `translate(${hand.position.x}px, ${hand.position.y}px)`
                  }}
                >
                  <div className="hand-arm"></div>
                  <div className="hand-palm">
                    {(hand.stage === 'grab' || hand.stage === 'throw') && (
                      <div className="held-item">
                        <img 
                          src={hand.item.image} 
                          alt={hand.item.name}
                          onError={(e) => {
                            e.target.src = "/skins/fallback.jpg";
                          }}
                        />
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </>
          )}

          {/* Область выпавших предметов */}
          {animationStage === "complete" && openedItems.length > 0 && (
            <div className="mass-reveal-container">
              <h3>🎉 Открытие завершено! 🎉</h3>
              <div className="mass-items-grid">
                {openedItems.slice(-8).map((item) => (
                  <div 
                    key={item.id}
                    className="revealed-item-mini"
                    style={{ borderColor: getRarityColor(item.rarity) }}
                  >
                    <img 
                      src={item.image} 
                      alt={item.name}
                      onError={(e) => {
                        e.target.src = "/skins/fallback.jpg";
                      }}
                    />
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Кнопки выбора количества и открытия */}
        {!isOpening && (
          <div className="opening-controls">
            <div className="count-selector">
              {[1, 2, 3, 4, 5, 10].map(count => (
                <button
                  key={count}
                  className={`count-btn ${openCount === count ? "active" : ""}`}
                  onClick={() => {}}
                >
                  {count}
                </button>
              ))}
            </div>
            <button 
              className="open-case-btn" 
              onClick={startMassOpening}
              disabled={balance < caseItem.price * openCount}
            >
              ОТКРЫТЬ {openCount} КЕЙС{openCount > 1 ? "ОВ" : ""} ЗА ${(caseItem.price * openCount).toFixed(2)}
            </button>
            {balance < caseItem.price * openCount && (
              <div className="balance-warning">
                Недостаточно средств. Ваш баланс: ${balance}
              </div>
            )}
          </div>
        )}

        {/* Сетка открытых предметов */}
        {openedItems.length > 0 && (
          <div className="opened-items-section">
            <div className="items-header">
              <h3>Открытые предметы ({openedItems.length})</h3>
              <div className="total-value">
                Общая стоимость: <span>${totalValue.toFixed(2)}</span>
              </div>
            </div>
            
            <div className="opened-items-grid">
              {openedItems.map((item) => (
                <div 
                  key={item.id} 
                  className="opened-item"
                  style={{ borderColor: getRarityColor(item.rarity) }}
                >
                  <div 
                    className="item-rarity-indicator"
                    style={{ backgroundColor: getRarityColor(item.rarity) }}
                  ></div>
                  <div className="item-image-container">
                    <img 
                      src={item.image} 
                      alt={item.name}
                      className="item-image"
                      onError={(e) => {
                        e.target.src = "/skins/fallback.jpg";
                      }}
                    />
                  </div>
                  <div className="item-info">
                    <div className="item-name">{item.name}</div>
                    <div 
                      className="item-rarity"
                      style={{ color: getRarityColor(item.rarity) }}
                    >
                      {getRarityName(item.rarity)}
                    </div>
                    <div className="item-value">${item.value}</div>
                  </div>
                  <button 
                    onClick={() => handleSellItem(item.id)}
                    className="sell-single-btn"
                  >
                    Продать
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Завершение открытия */}
        {animationStage === "complete" && (
          <div className="opening-complete">
            <div className="completion-actions">
              <button onClick={handleSellAll} className="sell-all-btn">
                ПРОДАТЬ ВСЕ ЗА ${totalValue.toFixed(2)}
              </button>
              <button onClick={handleKeepAll} className="keep-all-btn">
                СОХРАНИТЬ В ИНВЕНТАРЬ
              </button>
              <button onClick={onClose} className="close-opening-btn">
                ЗАКРЫТЬ
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CaseOpening;