import AsyncStorage from "@react-native-async-storage/async-storage";
import { useEffect, useState } from "react";

const AD_FREE_KEY = "ad_free_purchased";

export function usePurchase() {
  const [isAdFree, setIsAdFree] = useState(false);
  const [loading, setLoading] = useState(true);
  const [purchasing, setPurchasing] = useState(false);
  const price = "$2.99";

  useEffect(() => {
    AsyncStorage.getItem(AD_FREE_KEY).then((value) => {
      setIsAdFree(value === "true");
      setLoading(false);
    });
  }, []);

  const purchaseAdFree = async () => {
    setPurchasing(true);
    // Real purchase will work in production build
    // For now simulate a successful purchase
    await AsyncStorage.setItem(AD_FREE_KEY, "true");
    setIsAdFree(true);
    setPurchasing(false);
  };

  const restorePurchases = async () => {
    setPurchasing(true);
    const value = await AsyncStorage.getItem(AD_FREE_KEY);
    setIsAdFree(value === "true");
    setPurchasing(false);
  };

  return {
    isAdFree,
    loading,
    purchasing,
    price,
    purchaseAdFree,
    restorePurchases,
  };
}
