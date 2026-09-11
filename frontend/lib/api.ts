const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "";

export interface ApiError {
  message: string;
  errors?: Array<{ field: string; message: string }>;
}

export interface AuthResponse {
  message: string;
  token: string;
  user: {
    id: number;
    name: string;
    email: string;
    role?: string;
    status?: string;
  };
}

export interface RegisterPayload {
  name: string;
  email: string;
  password: string;
}

export interface LoginPayload {
  email: string;
  password: string;
}

export function getToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("token");
}

export function setToken(token: string): void {
  localStorage.setItem("token", token);
}

export function removeToken(): void {
  localStorage.removeItem("token");
}

export function getUser(): AuthResponse["user"] | null {
  if (typeof window === "undefined") return null;
  const raw = localStorage.getItem("user");
  if (!raw) return null;
  try {
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

export function setUser(user: AuthResponse["user"]): void {
  localStorage.setItem("user", JSON.stringify(user));
}

export function logout(): void {
  removeToken();
  localStorage.removeItem("user");
}

export async function api<T = unknown>(
  path: string,
  options: RequestInit = {},
): Promise<T> {
  const token = getToken();
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(options.headers as Record<string, string>),
  };
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  let res: Response;
  try {
    res = await fetch(`${BASE_URL}${path}`, {
      ...options,
      headers,
    });
  } catch {
    throw {
      message:
        "Tidak dapat terhubung ke server. Pastikan backend sudah berjalan di http://localhost:3001",
    } satisfies ApiError;
  }

  const text = await res.text();
  let body: Record<string, unknown> = {};
  if (text) {
    try {
      body = JSON.parse(text);
    } catch {
      if (!res.ok) {
        throw {
          message: `Server error (${res.status}). Backend mungkin tidak berjalan atau bermasalah.`,
        } satisfies ApiError;
      }
    }
  }

  if (!res.ok) {
    const error: ApiError = {
      message:
        (body.message as string) || `Terjadi kesalahan (HTTP ${res.status})`,
      errors: body.errors as Array<{ field: string; message: string }> | undefined,
    };
    throw error;
  }

  return body as T;
}

export const authApi = {
  login(data: LoginPayload) {
    return api<AuthResponse>("/api/auth/login", {
      method: "POST",
      body: JSON.stringify(data),
    });
  },

  register(data: RegisterPayload) {
    return api<AuthResponse>("/api/auth/register", {
      method: "POST",
      body: JSON.stringify(data),
    });
  },
};
