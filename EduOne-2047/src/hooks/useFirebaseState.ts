import { useState, useEffect } from 'react';
import { ref, onValue } from 'firebase/database';
import { db } from '../lib/firebase';

export function useFirebaseState<T>(path: string, initialData: T[] = []): T[] {
  const [data, setData] = useState<T[]>([]);

  useEffect(() => {
    const dataRef = ref(db, path);
    const unsubscribe = onValue(dataRef, (snapshot) => {
      const val = snapshot.val();
      if (val) {
        // Firebase returns objects if keys are strings, but we need arrays for our UI
        const arr = Object.values(val) as T[];
        setData(arr);
      } else {
        setData([]);
      }
    });

    return () => unsubscribe();
  }, [path]);

  return data;
}
