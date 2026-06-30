import { createContext, useContext, useMemo, useState, ReactNode } from 'react';

interface AuthState {
  token: string | null;
  email: string | null;
  roles: string[];
}

interface AuthContextValue extends AuthState {
  login: (token: string, email: string) => void;
  logout: () => void;
  isAdmin: boolean;
  isAgent: boolean;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);
const TOKEN_KEY = 'auth_token';
const EMAIL_KEY = 'auth_email';

function parseRolesFromToken(token: string): string[] {
  try {
    const payload = token.split('.')[1];
    if (!payload) return [];
    const normalized = payload.replace(/-/g, '+').replace(/_/g, '/');
    const padded = normalized + '='.repeat((4 - (normalized.length % 4)) % 4);
    const decoded = JSON.parse(atob(padded));
    const rolesClaim = decoded.roles;

    if (typeof rolesClaim === 'string') {
      return rolesClaim.split(',').map((item: string) => item.trim()).filter(Boolean);
    }

    if (Array.isArray(rolesClaim)) {
      return rolesClaim.map((item) => String(item));
    }

    return [];
  } catch {
    return [];
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [token, setToken] = useState<string | null>(() => localStorage.getItem(TOKEN_KEY));
  const [email, setEmail] = useState<string | null>(() => localStorage.getItem(EMAIL_KEY));
  const [roles, setRoles] = useState<string[]>(() => {
    const storedToken = localStorage.getItem(TOKEN_KEY);
    return storedToken ? parseRolesFromToken(storedToken) : [];
  });

  const value = useMemo(
    () => ({
      token,
      email,
      roles,
      login: (newToken: string, newEmail: string) => {
        setToken(newToken);
        setEmail(newEmail);
        setRoles(parseRolesFromToken(newToken));
        localStorage.setItem(TOKEN_KEY, newToken);
        localStorage.setItem(EMAIL_KEY, newEmail);
      },
      logout: () => {
        setToken(null);
        setEmail(null);
        setRoles([]);
        localStorage.removeItem(TOKEN_KEY);
        localStorage.removeItem(EMAIL_KEY);
      },
      isAdmin: roles.includes('ROLE_ADMIN'),
      isAgent: roles.includes('ROLE_AGENT'),
    }),
    [token, email, roles]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}
