"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useSyncExternalStore,
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

type AuthUpdate = Partial<Pick<AuthState, "user">> | AuthState;

const listeners = new Set<() => void>();
let cache: AuthState = { user: null, hydrated: false };

function readAuth(): AuthState {
  if (typeof window !== "undefined" && !cache.hydrated) {
    cache = { user: getUser(), hydrated: true };
  }
  return cache;
}

function writeAuth(state: AuthUpdate) {
  cache = { ...cache, ...state };
  listeners.forEach((l) => l());
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

function getSnapshot(): AuthState {
  return readAuth();
}

function getServerSnapshot(): AuthState {
  return { user: null, hydrated: false };
}

interface AuthContextValue {
  user: AuthUser | null;
  hydrated: boolean;
  login: (payload: LoginPayload) => Promise<AuthResponse>;
  register: (payload: RegisterPayload) => Promise<AuthResponse>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const auth = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  const login = useCallback(async (payload: LoginPayload) => {
    const res = await authApi.login(payload);
    setToken(res.token);
    setUser(res.user);
    writeAuth({ user: res.user, hydrated: true });
    return res;
  }, []);

  const register = useCallback(async (payload: RegisterPayload) => {
    const res = await authApi.register(payload);
    setToken(res.token);
    setUser(res.user);
    writeAuth({ user: res.user, hydrated: true });
    return res;
  }, []);

  const logout = useCallback(() => {
    clearStorage();
    writeAuth({ user: null, hydrated: true });
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