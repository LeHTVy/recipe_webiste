import { useState, useCallback } from 'react';

export function useNumberCycler(max = 4, initial = 1) {
  const [currentNumber, setCurrentNumber] = useState(initial);

  const increment = useCallback(() => {
    setCurrentNumber(prev => prev >= max ? 1 : prev + 1);
  }, [max]);

  const decrement = useCallback(() => {
    setCurrentNumber(prev => prev <= 1 ? max : prev - 1);
  }, [max]);

  const setNumber = useCallback((num) => {
    if (num >= 1 && num <= max) {
      setCurrentNumber(num);
    }
  }, [max]);

  return {
    currentNumber,
    increment,
    decrement,
    setNumber
  };
}