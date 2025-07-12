import { useState, useEffect } from 'react';
import { onUserProfileChange } from '../services/userService';
import { useAuth } from './useAuth';

export const useUserRole = () => {
  const { user } = useAuth();
  const [role, setRole] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      setLoading(true);
      const unsubscribe = onUserProfileChange(user.uid, (doc) => {
        if (doc.exists()) {
          setRole(doc.data().role);
        }
        setLoading(false);
      });
      return () => unsubscribe();
    } else {
      setRole(null);
      setLoading(false);
    }
  }, [user]);

  return { role, loading };
};
