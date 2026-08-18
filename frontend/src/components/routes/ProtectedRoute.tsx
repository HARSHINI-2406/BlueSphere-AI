import React, { useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { useStore } from '../../store/useStore';
import { getRegions } from '../../api/services';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const isAuthenticated = useStore((state) => state.isAuthenticated);
  const { regions, setRegions, selectedRegion, setSelectedRegion } = useStore();

  useEffect(() => {
    if (isAuthenticated && regions.length === 0) {
      const loadRegions = async () => {
        try {
          const list = await getRegions();
          setRegions(list);
          if (list.length > 0 && !selectedRegion) {
            setSelectedRegion(list[0]);
          }
        } catch (error) {
          console.error("Failed to load regions in ProtectedRoute:", error);
        }
      };
      loadRegions();
    }
  }, [isAuthenticated, regions, setRegions, selectedRegion, setSelectedRegion]);

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};
