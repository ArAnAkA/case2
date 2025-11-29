import React, { createContext, useContext, useState, useEffect } from 'react';

const BalanceContext = createContext();

export const BalanceProvider = ({ children }) => {
  const [balance, setBalance] = useState(() => {
    const saved = localStorage.getItem('cs2casebattle_balance');
    return saved ? parseFloat(saved) : 1000;
  });
  
  const [inventory, setInventory] = useState(() => {
    const saved = localStorage.getItem('cs2casebattle_inventory');
    return saved ? JSON.parse(saved) : [];
  });
  
  const [cases, setCases] = useState(() => {
    const saved = localStorage.getItem('cs2casebattle_cases');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem('cs2casebattle_balance', balance.toString());
  }, [balance]);

  useEffect(() => {
    localStorage.setItem('cs2casebattle_inventory', JSON.stringify(inventory));
  }, [inventory]);

  useEffect(() => {
    localStorage.setItem('cs2casebattle_cases', JSON.stringify(cases));
  }, [cases]);

  const addToInventory = (item) => {
    const newItem = {
      ...item,
      id: Date.now().toString(),
      obtainedAt: new Date().toISOString()
    };
    
    setInventory(prev => {
      const newInventory = [...prev, newItem];
      return newInventory;
    });
  };

  const sellItem = (itemId) => {
    const item = inventory.find(item => item.id === itemId);
    if (!item) return 0;
    
    setInventory(prev => prev.filter(item => item.id !== itemId));
    setBalance(prev => prev + item.value);
    
    return item.value;
  };

  const sellAllItems = () => {
    const totalValue = inventory.reduce((sum, item) => sum + item.value, 0);
    setInventory([]);
    setBalance(prev => prev + totalValue);
    return totalValue;
  };

  return (
    <BalanceContext.Provider value={{
      balance,
      setBalance,
      inventory,
      addToInventory,
      sellItem,
      sellAllItems,
      cases,
      setCases
    }}>
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
