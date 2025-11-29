// src/context/BalanceContext.jsx
import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { caseAPI } from '../services/api';

const BalanceContext = createContext();

export const BalanceProvider = ({ children }) => {
  const [balance, setBalance] = useState(() => {
    const saved = localStorage.getItem('cs2casebattle_balance');
    return saved ? parseFloat(saved) : 1000.00;
  });
  
  const [inventory, setInventory] = useState(() => {
    try {
      const saved = localStorage.getItem('cs2casebattle_inventory');
      if (saved) {
        const parsed = JSON.parse(saved);
        // Убеждаемся, что каждый предмет имеет уникальный ID
        return Array.isArray(parsed) ? parsed.map(item => ({
          ...item,
          id: item.id || `item-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
        })) : [];
      }
      return [];
    } catch (error) {
      console.error('Error loading inventory:', error);
      return [];
    }
  });
  
  const [cases, setCases] = useState([]);
  const [casesLoaded, setCasesLoaded] = useState(false);

  // Загружаем кейсы из API при инициализации
  useEffect(() => {
    const loadCases = async () => {
      try {
        console.log('BalanceContext: Loading cases from API...');
        const response = await caseAPI.getCases();
        console.log('BalanceContext: Cases loaded:', response.data);
        setCases(response.data || []);
        setCasesLoaded(true);
      } catch (error) {
        console.error('BalanceContext: Error loading cases:', error);
        setCases([]);
        setCasesLoaded(true);
      }
    };

    loadCases();
  }, []);

  // Сохраняем баланс в localStorage
  useEffect(() => {
    localStorage.setItem('cs2casebattle_balance', balance.toFixed(2));
  }, [balance]);

  // Сохраняем инвентарь в localStorage
  useEffect(() => {
    try {
      localStorage.setItem('cs2casebattle_inventory', JSON.stringify(inventory));
      console.log('Inventory saved:', inventory.length, 'items');
    } catch (error) {
      console.error('Error saving inventory:', error);
    }
  }, [inventory]);

  // Функция для генерации уникального ID
  const generateUniqueId = () => {
    return `item-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  };

  const addToInventory = useCallback((item) => {
    const newItem = {
      ...item,
      id: generateUniqueId(),
      obtainedAt: new Date().toISOString(),
      sold: false // Флаг, чтобы предотвратить повторную продажу
    };
    
    setInventory(prev => {
      const newInventory = [...prev, newItem];
      console.log('Added to inventory:', newItem.name, 'Total items:', newInventory.length);
      return newInventory;
    });
    
    return newItem.id;
  }, []);

  const sellItem = useCallback((itemId) => {
    setInventory(prev => {
      const item = prev.find(item => item.id === itemId && !item.sold);
      if (!item) {
        console.log('Item not found or already sold:', itemId);
        return prev;
      }
      
      // Помечаем предмет как проданный
      const updatedItem = { ...item, sold: true };
      const remainingItems = prev.filter(item => item.id !== itemId);
      
      console.log('Selling item:', item.name, 'Value:', item.value);
      
      // Обновляем баланс
      setBalance(prevBalance => {
        const newBalance = prevBalance + item.value;
        console.log('Balance updated:', prevBalance, '->', newBalance);
        return newBalance;
      });
      
      return remainingItems;
    });
  }, []);

  const sellAllItems = useCallback(() => {
    setInventory(prev => {
      const unsoldItems = prev.filter(item => !item.sold);
      if (unsoldItems.length === 0) return prev;
      
      const totalValue = unsoldItems.reduce((sum, item) => sum + item.value, 0);
      
      console.log('Selling all items:', unsoldItems.length, 'Total value:', totalValue);
      
      // Обновляем баланс
      setBalance(prevBalance => {
        const newBalance = prevBalance + totalValue;
        console.log('Balance updated from sell all:', prevBalance, '->', newBalance);
        return newBalance;
      });
      
      // Возвращаем только непроданные предметы (очищаем все)
      return [];
    });
  }, []);

  const deductBalance = useCallback((amount) => {
    setBalance(prev => {
      const newBalance = prev - amount;
      // Предотвращаем отрицательный баланс
      return newBalance < 0 ? prev : newBalance;
    });
  }, []);

  const addBalance = useCallback((amount) => {
    setBalance(prev => prev + amount);
  }, []);

  // Функция для получения только непроданных предметов
  const getUnsoldInventory = useCallback(() => {
    return inventory.filter(item => !item.sold);
  }, [inventory]);

  const value = {
    balance,
    setBalance,
    deductBalance,
    addBalance,
    inventory: getUnsoldInventory(), // Возвращаем только непроданные предметы
    rawInventory: inventory, // Полный инвентарь для отладки
    addToInventory,
    sellItem,
    sellAllItems,
    cases,
    setCases,
    casesLoaded
  };

  return (
    <BalanceContext.Provider value={value}>
      {children}
    </BalanceContext.Provider>
  );
};

export const useBalance = () => {
  const context = useContext(BalanceContext);
  if (!context) {
    throw new Error('useBalance must be used within a BalanceProvider');
  }
  return context;
};