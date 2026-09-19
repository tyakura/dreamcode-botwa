"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import {
  authApi,
  getUser,
  logout as clearStorage,
  setToken,
  setUser,
  type AuthResponse,
  type AuthUser,
  type LoginPayload,
  type RegisterPayload,
} from "@/lib/api";

interface AuthState {
  user: AuthUser | null;
  hydrated: boolean;
}

interface AuthContextValue {
  user: AuthUser | null;
  hydrated: boolean;
  login: (payload: LoginPayload) => Promise<AuthResponse>;
  register: (payload: RegisterPayload) => Promise<AuthResponse>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

// Baca localStorage sekali, di luar komponen, agar tersedia sebelum render pertama.
// Ini aman karena file ini hanya di-bundle di client ("use client").
function initAuth(): AuthState {
  if (typeof window === "undefined") return { user: null, hydrated: false };
  return { user: getUser(), hydrated: true };
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  // useState lazy initializer: hanya dipanggil sekali saat komponen pertama di-mount.
  // Hasilnya: pada render pertama di client, hydrated sudah true — tidak ada spinner sama sekali.
  const [auth, setAuth] = useState<AuthState>(initAuth);

  // Pada SSR, komponen ini render dengan hydrated=false.
  // Setelah mount di client, sync ke localStorage supaya server/client match.
  const mounted = useRef(false);
  useEffect(() => {
    if (!mounted.current) {
      mounted.current = true;
      // Kalau SSR (hydrated masih false setelah mount), baca localStorage sekarang.
      if (!auth.hydrated) {
        setAuth({ user: getUser(), hydrated: true });
      }
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const login = useCallback(async (payload: LoginPayload) => {
    const res = await authApi.login(payload);
    setToken(res.token);
    setUser(res.user);
    setAuth({ user: res.user, hydrated: true });
    return res;
  }, []);

  const register = useCallback(async (payload: RegisterPayload) => {
    const res = await authApi.register(payload);
    setToken(res.token);
    setUser(res.user);
    setAuth({ user: res.user, hydrated: true });
    return res;
  }, []);

  const logout = useCallback(() => {
    clearStorage();
    setAuth({ user: null, hydrated: true });
  }, []);

  const value = useMemo(
    () => ({ user: auth.user, hydrated: auth.hydrated, login, register, logout }),
    [auth.user, auth.hydrated, login, register, logout],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth harus dipakai di dalam <AuthProvider>");
  }
  return ctx;
}
