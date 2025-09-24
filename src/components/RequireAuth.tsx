import React, { useEffect, useState } from "react";
import { Navigate, useLocation } from "react-router-dom";

export const isAuthenticated = (): boolean => {
  try {
    return Boolean(localStorage.getItem("gm_auth_token"));
  } catch {
    return false;
  }
};

export const validateToken = async (): Promise<boolean> => {
  try {
    const token = localStorage.getItem("gm_auth_token");
    if (!token) return false;
    
    const API_BASE = (import.meta as any).env?.VITE_API_URL || "http://localhost:5174";
    const response = await fetch(`${API_BASE}/api/auth/me`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    
    return response.ok;
  } catch {
    return false;
  }
};

export const RequireAuth: React.FC<React.PropsWithChildren> = ({ children }) => {
  const location = useLocation();
  const [isValidating, setIsValidating] = useState(true);
  const [isValid, setIsValid] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      if (!isAuthenticated()) {
        setIsValid(false);
        setIsValidating(false);
        return;
      }
      
      const valid = await validateToken();
      setIsValid(valid);
      setIsValidating(false);
      
      if (!valid) {
        // Clear invalid token
        localStorage.removeItem("gm_auth_token");
        localStorage.removeItem("gm_user_name");
        localStorage.removeItem("gm_user_email");
      }
    };
    
    checkAuth();
  }, []);

  if (isValidating) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p>Validating authentication...</p>
        </div>
      </div>
    );
  }

  if (!isValid) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }
  
  return <>{children}</>;
};

export const PublicOnly: React.FC<React.PropsWithChildren> = ({ children }) => {
  if (isAuthenticated()) {
    return <Navigate to="/" replace />;
  }
  return <>{children}</>;
};


