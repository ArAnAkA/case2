// src/components/Inventory.jsx
import React from "react";
import { useBalance } from "../context/BalanceContext";
import ImageWithFallback from "./ImageWithFallback";
import "./Inventory.css";

const Inventory = () => {
  const { inventory, sellItem, sellAllItems, balance } = useBalance();

  // Функция для безопасного вычисления общей стоимости
  const getTotalInventoryValue = () => {
    return inventory.reduce((sum, item) => {
      const value = parseFloat(item.value) || 0;
      return sum + value;
    }, 0);
  };

  const totalInventoryValue = getTotalInventoryValue();

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
    return colors[rarity] || colors.common;
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
    return gradients[rarity] || gradients.common;
  };

  const getRarityName = (rarity) => {
    const names = {
      "Consumer Grade": "ШИРПОТРЕБ",
      "Industrial Grade": "ПРОМЫШЛЕННОЕ",
      "Mil-Spec": "АРМЕЙСКОЕ",
      "Restricted": "ЗАПРЕЩЕННОЕ", 
      "Classified": "ЗАСЕКРЕЧЕННОЕ",
      "Covert": "ТАЙНОЕ",
      "Extraordinary": "ЭКСТРАОРДИНАРНОЕ",
      "common": "ОБЫЧНЫЙ",
      "uncommon": "НЕОБЫЧНЫЙ",
      "rare": "РЕДКИЙ",
      "mythical": "МИФИЧЕСКИЙ",
      "legendary": "ЛЕГЕНДАРНЫЙ",
      "ancient": "ДРЕВНИЙ",
      "forbidden": "ЗАПРЕТНЫЙ"
    };
    return names[rarity] || names.common;
  };

  const handleSellAll = () => {
    if (inventory.length === 0) return;
    
    const total = sellAllItems();
    alert(`Продано всех предметов на сумму: $${total.toFixed(2)}`);
  };

  const handleSellItem = (item) => {
    const itemValue = parseFloat(item.value) || 0;
    sellItem(item.id);
    alert(`Предмет "${item.name}" продан за $${itemValue.toFixed(2)}`);
  };

  const getItemValue = (item) => {
    return parseFloat(item.value) || 0;
  };

  return (
    <div className="inventory-page">
      <div className="inventory-header">
        <h1>КОСМИЧЕСКИЙ ИНВЕНТАРЬ</h1>
        <div className="inventory-stats">
          <div className="balance-info">Баланс: ${balance.toFixed(2)}</div>
          <div className="items-count">Предметов: {inventory.length}</div>
          {inventory.length > 0 && (
            <button onClick={handleSellAll} className="sell-all-btn">
              Продать все (${totalInventoryValue.toFixed(2)})
            </button>
          )}
        </div>
      </div>

      {inventory.length === 0 ? (
        <div className="empty-inventory">
          <div className="empty-icon">🚀</div>
          <h2>ИНВЕНТАРЬ ПУСТ</h2>
          <p>Откройте кейсы, чтобы пополнить коллекцию</p>
          <div className="empty-glow"></div>
        </div>
      ) : (
        <div className="inventory-content">
          <div className="inventory-summary">
            <div className="summary-card">
              <div className="summary-icon">📊</div>
              <div className="summary-info">
                <div className="summary-label">Общая стоимость</div>
                <div className="summary-value">${totalInventoryValue.toFixed(2)}</div>
              </div>
            </div>
            <div className="summary-card">
              <div className="summary-icon">🎯</div>
              <div className="summary-info">
                <div className="summary-label">Всего предметов</div>
                <div className="summary-value">{inventory.length}</div>
              </div>
            </div>
            <div className="summary-card">
              <div className="summary-icon">💎</div>
              <div className="summary-info">
                <div className="summary-label">Самое ценное</div>
                <div className="summary-value">
                  ${Math.max(...inventory.map(item => getItemValue(item))).toFixed(2)}
                </div>
              </div>
            </div>
          </div>

          <div className="inventory-grid">
            {inventory.map((item) => (
              <div 
                key={item.id} 
                className="inventory-item"
                style={{ 
                  '--rarity-color': getRarityColor(item.rarity),
                  '--rarity-gradient': getRarityGradient(item.rarity)
                }}
              >
                <div className="item-glow-background"></div>
                
                <div className="item-rarity-indicator"></div>
                
                <div className="item-image-container">
                  <ImageWithFallback
                    src={item.image}
                    alt={item.name}
                    className="item-image"
                    fallback="/skins/fallback.jpg"
                  />
                  <div className="image-overlay"></div>
                </div>

                <div className="item-info">
                  <div className="item-name">{item.name}</div>
                  <div 
                    className="item-rarity"
                  >
                    {getRarityName(item.rarity)}
                  </div>
                  <div className="item-value">${getItemValue(item).toFixed(2)}</div>
                </div>

                <button 
                  onClick={() => handleSellItem(item)}
                  className="sell-btn"
                  style={{ background: getRarityGradient(item.rarity) }}
                >
                  <span className="sell-icon">💰</span>
                  <span className="sell-text">
                    Продать за ${getItemValue(item).toFixed(2)}
                  </span>
                </button>

                <div className="item-obtained">
                  <span className="obtained-icon">🕒</span>
                  Получен: {new Date(item.obtainedAt).toLocaleDateString('ru-RU')}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Inventory;