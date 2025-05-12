import { Navigate } from "react-router";
import { ReactNode } from "react";

interface PrivateRouteProps {
  children: ReactNode;
}

export function PrivateRoute({ children }: PrivateRouteProps) {
  const user = localStorage.getItem('Logado');

  return user ? children : <Navigate to="/" />;
}
