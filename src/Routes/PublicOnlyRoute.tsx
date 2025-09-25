import { Navigate } from "react-router-dom";
import { useEffect, useState } from "react";
import authService from "@/Services/authService";
import type { ReactNode } from "react";
import Spinner from "@/components/ui/Spinner";

interface PublicOnlyRouteProps {
  children: ReactNode;
}

export function PublicOnlyRoute({ children }: PublicOnlyRouteProps) {
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        // Verifica se há dados no localStorage primeiro
        const storedData = localStorage.getItem('loginData');
        if (!storedData) {
          setIsAuthenticated(false);
          setLoading(false);
          return;
        }

        // Se há dados, verifica com o backend se ainda é válido
        const response = await authService.checkUserIsAuth();      

        if(response.authenticated){
          localStorage.setItem('loginData', JSON.stringify(response.user));
          setIsAuthenticated(true);
        }
        else{
          localStorage.removeItem('loginData');
          setIsAuthenticated(false);
        }
      } catch (err) {
        setIsAuthenticated(false);
        localStorage.removeItem('loginData');
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  if (loading) return <Spinner />;

  return isAuthenticated ? <Navigate to="/home" /> : children;
}
