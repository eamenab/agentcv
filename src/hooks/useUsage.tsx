
import { useEffect, useState } from "react";
import { useAuth } from "./useAuth";
import { supabase } from "@/integrations/supabase/client";

const LOCAL_STORAGE_KEY = "agentcv-usage";

interface UsageData {
  used: number;
  limit: number;
  lastResetDate: string;
}

export function useUsage() {
  const { user } = useAuth();
  const [usageData, setUsageData] = useState<UsageData>({
    used: 0,
    limit: 1, // Default for anonymous users
    lastResetDate: new Date().toISOString().split("T")[0],
  });
  const [loading, setLoading] = useState(true);

  // Reset counter if it's a new day
  const checkAndResetDaily = (data: UsageData) => {
    const today = new Date().toISOString().split("T")[0];
    if (data.lastResetDate !== today) {
      return {
        used: 0,
        limit: user ? 10 : 1,
        lastResetDate: today,
      };
    }
    return data;
  };

  // Initialize usage data
  useEffect(() => {
    const fetchUsageData = async () => {
      setLoading(true);
      try {
        if (user) {
          // Fetch from Supabase for logged-in users
          const { data, error } = await supabase
            .from("user_usage")
            .select("*")
            .eq("user_id", user.id)
            .single();

          if (error && error.code !== "PGRST116") {
            console.error("Error fetching usage data:", error);
            throw error;
          }

          if (data) {
            const updatedData = checkAndResetDaily({
              used: data.used_today,
              limit: 10,
              lastResetDate: data.last_reset_date,
            });
            setUsageData(updatedData);

            // Update if it's a new day
            if (updatedData.lastResetDate !== data.last_reset_date) {
              await supabase
                .from("user_usage")
                .update({
                  used_today: 0,
                  last_reset_date: updatedData.lastResetDate,
                })
                .eq("user_id", user.id);
            }
          } else {
            // Create new record if none exists
            const newData = {
              used: 0,
              limit: 10,
              lastResetDate: new Date().toISOString().split("T")[0],
            };
            await supabase.from("user_usage").insert({
              user_id: user.id,
              used_today: 0,
              last_reset_date: newData.lastResetDate,
            });
            setUsageData(newData);
          }
        } else {
          // Use localStorage for anonymous users
          const storedData = localStorage.getItem(LOCAL_STORAGE_KEY);
          if (storedData) {
            const parsedData = JSON.parse(storedData);
            const updatedData = checkAndResetDaily(parsedData);
            setUsageData(updatedData);
            localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updatedData));
          } else {
            const newData = {
              used: 0,
              limit: 1,
              lastResetDate: new Date().toISOString().split("T")[0],
            };
            localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(newData));
            setUsageData(newData);
          }
        }
      } catch (error) {
        console.error("Error managing usage data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUsageData();
  }, [user]);

  // Increment usage counter
  const incrementUsage = async () => {
    try {
      const updated = {
        ...usageData,
        used: usageData.used + 1,
      };

      if (user) {
        // Update Supabase for logged-in users
        await supabase
          .from("user_usage")
          .update({ used_today: updated.used })
          .eq("user_id", user.id);
      } else {
        // Update localStorage for anonymous users
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updated));
      }

      setUsageData(updated);
    } catch (error) {
      console.error("Error incrementing usage:", error);
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
