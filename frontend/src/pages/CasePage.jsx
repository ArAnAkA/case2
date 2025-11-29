// src/pages/CasePage.jsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { caseAPI } from '../services/api';
import { useBalance } from '../context/BalanceContext';
import ImageWithFallback from '../components/ImageWithFallback';
import CosmicCaseOpening from '../components/CosmicCaseOpening';
import './CasePage.css';

const CasePage = () => {
  const { caseId } = useParams();
  const navigate = useNavigate();
  const { balance } = useBalance();
  const [caseItem, setCaseItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showOpening, setShowOpening] = useState(false);
  const [openCount, setOpenCount] = useState(1);
  const [error, setError] = useState('');

  useEffect(() => {
    loadCase();
  }, [caseId]);

  const loadCase = async () => {
    try {
      setLoading(true);
      const response = await caseAPI.getCaseById(caseId);
      setCaseItem(response.data);
    } catch (error) {
      console.error('Ошибка при загрузке кейса:', error);
      setError('Кейс не найден');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenCase = (count = 1) => {
    if (balance < caseItem.price * count) {
      alert(`Недостаточно средств! Нужно: $${caseItem.price * count}, у вас: $${balance}`);
      return;
    }
    setOpenCount(count);
    setShowOpening(true);
  };

  if (loading) {
    return (
      <div className="case-page">
        <div className="loading">
          <div className="loading-spinner"></div>
          <p>Загрузка кейса...</p>
          <a href="/" className="back-home">Вернуться на главную</a>
        </div>
      </div>
    );
  }

  if (error || !caseItem) {
    return (
      <div className="case-page">
        <div className="error-message">
          <h2>{error || 'Кейс не найден'}</h2>
          <a href="/" className="back-home">Вернуться на главную</a>
        </div>
      </div>
    );
  }

  return (
    <div className="case-page">
      <div className="case-header">
        <button onClick={() => navigate('/')} className="back-button">
          ← Назад к кейсам
        </button>
        <h1>{caseItem.name}</h1>
        <div className="case-price">${caseItem.price}</div>
      </div>

      <div className="case-content">
        <div className="case-preview">
          <div className="case-image-container">
            <ImageWithFallback
              src={caseItem.image}
              alt={caseItem.name}
              className="case-image"
              fallback="/skins/fallback.jpg"
            />
          </div>

          <div className="open-options">
            <div className="count-buttons">
              {[1, 2, 3, 4, 5].map(count => (
                <button
                  key={count}
                  className={`count-button ${openCount === count ? 'active' : ''}`}
                  onClick={() => setOpenCount(count)}
                  disabled={balance < caseItem.price * count}
                >
                  {count}
                </button>
              ))}
            </div>

            <button
              onClick={() => handleOpenCase(openCount)}
              disabled={balance < caseItem.price * openCount}
              className="open-case-button"
            >
              {balance < caseItem.price * openCount 
                ? `Недостаточно средств ($${balance})` 
                : `Открыть ${openCount} кейс${openCount > 1 ? 'а' : ''} за $${(caseItem.price * openCount).toFixed(2)}`}
            </button>

            {balance < caseItem.price && (
              <div className="balance-warning">
                Пополните баланс для открытия этого кейса
              </div>
            )}
          </div>
        </div>

        <div className="case-items">
          <h2>Возможные предметы</h2>
          <div className="items-grid">
            {caseItem.items.map((item, index) => (
              <div 
                key={index} 
                className="item-card"
                style={{ borderLeftColor: getRarityColor(item.rarity) }}
              >
                <div 
                  className="item-rarity-bar"
                  style={{ backgroundColor: getRarityColor(item.rarity) }}
                ></div>
                <ImageWithFallback
                  src={item.image}
                  alt={item.name}
                  className="item-image"
                  fallback="/skins/fallback.jpg"
                />
                <div className="item-info">
                  <h4>{item.name}</h4>
                  <div 
                    className="item-rarity"
                    style={{ color: getRarityColor(item.rarity) }}
                  >
                    {getRarityName(item.rarity)}
                  </div>
                  <div className="item-value">${item.value}</div>
                  <div className="item-chance">{item.chance}% шанс</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {showOpening && caseItem && (
        <CosmicCaseOpening
          caseItem={caseItem}
          onClose={() => setShowOpening(false)}
          openCount={openCount}
        />
      )}
    </div>
  );
};

// Вспомогательные функции для редкостей
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
    common: "Обычный",
    uncommon: "Необычный",
    rare: "Редкий",
    mythical: "Мифический",
    legendary: "Легендарный",
    ancient: "Древний",
    forbidden: "Запретный"
  };
  return names[rarity] || names.common;
};

export default CasePage;