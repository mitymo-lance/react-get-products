import React, { useState, useEffect } from "react";

// written by AI with Copilot 
// I started typing usePersistState 
// and Copilot suggested this code
const usePersistState = (key, defaultValue) => {
  const [state, setState] = useState(() => {
    const value = localStorage.getItem(key);
    if (value) {
      return JSON.parse(value);
    }
    return typeof defaultValue === 'function' ? defaultValue() : defaultValue;
  });
  useEffect(() => {
    console.log('useEffect inside usePersistState');
    localStorage.setItem(key, JSON.stringify(state));
  }, [key, state]);
  return [state, setState];
}

export default usePersistState;
