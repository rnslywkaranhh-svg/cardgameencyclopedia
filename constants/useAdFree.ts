import AsyncStorage from '@react-native-async-storage/async-storage';
import { useEffect, useState } from 'react';

const AD_FREE_KEY = 'ad_free_purchased';

export function useAdFree() {
  const [isAdFree, setIsAdFree] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    AsyncStorage.getItem(AD_FREE_KEY).then(value => {
      setIsAdFree(value === 'true');
      setLoading(false);
    });
  }, []);

  const unlockAdFree = async () => {
    await AsyncStorage.setItem(AD_FREE_KEY, 'true');
    setIsAdFree(true);
  };

  return { isAdFree, loading, unlockAdFree };
}