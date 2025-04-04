import { createContext, useState, useContext, useEffect } from "react";
import { useAuth } from "./AuthContext";

const LevelContext = createContext();

export const useLevel = () => useContext(LevelContext);

export const LevelProvider = ({ children }) => {
  const { user } = useAuth();
  const [level, setLevel] = useState(1);
  const [xp, setXp] = useState(0);
  const [totalXp, setTotalXp] = useState(0);
  const [nextLevelXp, setNextLevelXp] = useState(100);
  const [xpGained, setXpGained] = useState(0);
  const [showXpPopup, setShowXpPopup] = useState(false);
  
  const BASE_XP = 100;
  const GROWTH_FACTOR = 1.5;
  
  const XP_VALUES = {
    DAILY_TASK: 5,
    BASE_TASK: 10,
    PRIORITY_MULTIPLIER_LOW: 2,
    PRIORITY_MULTIPLIER_MEDIUM: 3,
    PRIORITY_MULTIPLIER_HIGH: 5
  };
  
  const calculateRequiredXp = (targetLevel) => {
    return Math.round(BASE_XP * Math.pow(targetLevel, GROWTH_FACTOR));
  };
  
  const calculateLevelFromXp = (totalXp) => {
    let currentLevel = 1;
    let accumulatedXp = 0;
    
    while (true) {
      const requiredForNextLevel = calculateRequiredXp(currentLevel);
      if (accumulatedXp + requiredForNextLevel > totalXp) {
        break;
      }
      accumulatedXp += requiredForNextLevel;
      currentLevel++;
    }
    
    return {
      level: currentLevel,
      currentLevelXp: totalXp - accumulatedXp,
      nextLevelXp: calculateRequiredXp(currentLevel),
      progress: (totalXp - accumulatedXp) / calculateRequiredXp(currentLevel)
    };
  };
  
  useEffect(() => {
    // Load level data from localStorage
    const savedTotalXp = localStorage.getItem('totalXp');
    
    if (savedTotalXp) {
      const totalXpValue = parseInt(savedTotalXp, 10);
      setTotalXp(totalXpValue);
      
      const levelData = calculateLevelFromXp(totalXpValue);
      setLevel(levelData.level);
      setXp(levelData.currentLevelXp);
      setNextLevelXp(levelData.nextLevelXp);
    }
  }, []);
  
  const addXp = (amount) => {
    const newTotalXp = totalXp + amount;
    setTotalXp(newTotalXp);
    setXpGained(amount);
    setShowXpPopup(true);
    
    localStorage.setItem('totalXp', newTotalXp.toString());
    
    const levelData = calculateLevelFromXp(newTotalXp);
    setLevel(levelData.level);
    setXp(levelData.currentLevelXp);
    setNextLevelXp(levelData.nextLevelXp);
    
    return levelData;
  };
  
  const calculateTaskXp = (taskType, priority = 'medium') => {
    if (taskType === 'daily') {
      return XP_VALUES.DAILY_TASK;
    }
    
    let taskXp = XP_VALUES.BASE_TASK;
    
    if (priority === 'high') {
      taskXp *= XP_VALUES.PRIORITY_MULTIPLIER_HIGH;
    } else if (priority === 'medium') {
      taskXp *= XP_VALUES.PRIORITY_MULTIPLIER_MEDIUM;
    } else if (priority === 'low') {
      taskXp *= XP_VALUES.PRIORITY_MULTIPLIER_LOW;
    }
    
    return taskXp;
  };

  const closeXpPopup = () => {
    setShowXpPopup(false);
  };
  
  return (
    <LevelContext.Provider
      value={{
        level,
        xp,
        totalXp,
        nextLevelXp,
        progress: xp / nextLevelXp,
        xpGained,
        showXpPopup,
        closeXpPopup,
        addXp,
        calculateTaskXp,
        calculateRequiredXp,
        XP_VALUES
      }}
    >
      {children}
    </LevelContext.Provider>
  );
};

export default LevelContext;