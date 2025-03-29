
import { useState, useEffect } from 'react';

const LOCAL_STORAGE_KEY = 'agentcv_usage';
const DAILY_LIMIT = 3; // Set daily limit to 5 requests

export function useClientUsage() {
  const [usageData, setUsageData] = useState({
    used: 0,
    limit: DAILY_LIMIT, 
    lastResetDate: new Date().toISOString().split('T')[0],
  });
  
  const [loading, setLoading] = useState(true);

  // Reset counter if it's a new day
  const checkAndResetDaily = (data: any) => {
    const today = new Date().toISOString().split('T')[0];
    if (data.lastResetDate !== today) {
      return {
        used: 0,
        limit: DAILY_LIMIT,
        lastResetDate: today,
      };
    }
    return data;
  };

  // Initialize usage data
  useEffect(() => {
    const initUsageData = () => {
      setLoading(true);
      try {
        // Use localStorage for all users
        const storedData = localStorage.getItem(LOCAL_STORAGE_KEY);
        if (storedData) {
          const parsedData = JSON.parse(storedData);
          const updatedData = checkAndResetDaily(parsedData);
          setUsageData(updatedData);
          localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updatedData));
        } else {
          const newData = {
            used: 0,
            limit: DAILY_LIMIT,
            lastResetDate: new Date().toISOString().split('T')[0],
          };
          localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(newData));
          setUsageData(newData);
        }
      } catch (error) {
        console.error('Error managing usage data:', error);
      } finally {
        setLoading(false);
      }
    };

    initUsageData();
  }, []);

  // Increment usage counter
  const incrementUsage = () => {
    try {
      const updated = {
        ...usageData,
        used: usageData.used + 1,
      };
      
      // Update localStorage
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updated));
      setUsageData(updated);
    } catch (error) {
      console.error('Error incrementing usage:', error);
    }
  };

  const canUse = usageData.used < usageData.limit;

  return {
    usageData,
    loading,
    incrementUsage,
    canUse,
    remainingUses: Math.max(0, usageData.limit - usageData.used),
  };
}
