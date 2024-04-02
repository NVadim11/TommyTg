import React, { createContext, useContext, useState } from 'react'

const ClickCountContext = createContext();

export const useClickCount = () => useContext(ClickCountContext);

export const ClickCountProvider = ({ children }) => {
  const [clickCount, setClickCount] = useState(0);

  const incrementClickCount = () => {
    setClickCount(prevCount => prevCount + 1);
  };

  const resetClickCount = () => {
    setClickCount(0);
  };

  return (
    <ClickCountContext.Provider value={{ clickCount, incrementClickCount, resetClickCount }}>
      {children}
    </ClickCountContext.Provider>
  );
};