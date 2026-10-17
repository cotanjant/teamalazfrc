"use client";

import React, { useState, useEffect, createContext, useContext } from "react";
import Link from "next/link";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Flame, ShieldAlert, Lock } from "lucide-react";

const SESSION_KEY = "alaz_admin_session_token";

export interface AdminAuthContextType {
  token: string | null;
  logout: () => void;
  isAuthenticated: boolean;
}

const AdminAuthContext = createContext<AdminAuthContextType>({
  token: null,
  logout: () => {},
  isAuthenticated: false,
});

export function useAdminAuth() {
  return useContext(AdminAuthContext);
}

interface AdminGuardProps {
  children: React.ReactNode;
}

export function AdminGuard({ children }: AdminGuardProps) {
  const [token, setToken] = useState<string | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [checkingInitialAuth, setCheckingInitialAuth] = useState(true);

  useEffect(() => {
    let isMounted = true;
    async function checkInitialAuth() {
      try {
        const res = await fetch("/api/login", {
          method: "GET",
          credentials: "same-origin",
        });
        if (res.ok) {
          const data = await res.json();
          if (isMounted && data.authenticated) {
            setIsAuthenticated(true);
            if (data.token) {
              setToken(data.token);
            }
          }
        }
      } catch {
        // network or server error during initial check
      } finally {
        if (isMounted) {
          setCheckingInitialAuth(false);
        }
      }
    }

    checkInitialAuth();
    return () => {
      isMounted = false;
    };
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!password.trim()) return;

    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "same-origin",
        body: JSON.stringify({ password }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        setError(data.error || "Kimlik doğrulama başarısız. Lütfen şifrenizi kontrol edin.");
        return;
      }

      setIsAuthenticated(true);
      if (data.token) {
        setToken(data.token);
      }
      setPassword("");
    } catch {
      setError("Doğrulama servisine bağlanırken ağ veya sunucu hatası oluştu.");
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await fetch("/api/login", {
        method: "DELETE",
        credentials: "same-origin",
      });
    } catch {
      // Ignore network errors on logout
    }
    try {
      sessionStorage.removeItem(SESSION_KEY);
    } catch {}
    setToken(null);
    setIsAuthenticated(false);
  };

  if (checkingInitialAuth) {
    return (
      <div className="h-[100dvh] w-full overflow-hidden bg-[#000000] flex flex-col items-center justify-center text-[#A0A0A0] font-mono text-xs gap-3">
        <div className="w-8 h-8 rounded-md bg-[#141414] border border-[#FF7800]/40 flex items-center justify-center text-[#FF7800] animate-pulse">
          <Flame className="w-4 h-4" />
        </div>
        <span>Oturum durumu kontrol ediliyor...</span>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-[100dvh] h-[100dvh] w-full overflow-hidden bg-[#000000] text-[#E8E8E8] flex items-center justify-center p-4">
        <div className="w-full max-w-sm">
          {/* Brand Emblem */}
          <div className="text-center mb-6">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-lg bg-[#0A0A0A] border border-[#FF7800]/30 text-[#FF7800] mb-3 shadow-[0_0_20px_rgba(255,120,0,0.2)]">
              <Flame className="w-6 h-6" />
            </div>
            <h1 className="text-xl font-bold tracking-tight text-white flex items-center justify-center gap-2">
              ALAZ <span className="text-[#FF7800] text-sm font-mono font-semibold">{"//"} 12368</span>
            </h1>
            <p className="text-xs text-[#A0A0A0] mt-1.5 font-mono">
              İçerik Yönetim Merkezi Yetkili Girişi
            </p>
          </div>

          <Card className="bg-[#0A0A0A] border-[#1A1A1A] rounded-lg shadow-2xl">
            <CardHeader className="pb-3 pt-5 px-5 border-b border-[#141414]">
              <CardTitle className="text-sm font-semibold text-[#E8E8E8] flex items-center gap-2">
                <Lock className="w-3.5 h-3.5 text-[#FF7800]" />
                Yönetici Erişimi
              </CardTitle>
              <CardDescription className="text-xs text-[#666666]">
                Düzenleme paneline erişmek için erişim anahtarınızı girin.
              </CardDescription>
            </CardHeader>
            <CardContent className="px-5 py-5">
              <form onSubmit={handleLogin} className="space-y-4">
                <div className="space-y-1.5">
                  <Label htmlFor="admin-pass" className="text-xs font-mono uppercase text-[#A0A0A0]">
                    Güvenlik Şifresi
                  </Label>
                  <Input
                    id="admin-pass"
                    type="password"
                    placeholder="••••••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="bg-[#000000] border-[#1A1A1A] text-white placeholder:text-[#444444] rounded-md focus-visible:ring-1 focus-visible:ring-[#FF7800] font-mono text-sm h-10"
                    required
                    autoFocus
                  />
                </div>

                {error && (
                  <div
                    role="alert"
                    aria-live="assertive"
                    className="p-3 bg-red-950/30 border border-red-800/40 rounded-md text-xs text-red-400 flex items-start gap-2"
                  >
                    <ShieldAlert className="w-4 h-4 shrink-0 mt-0.5" />
                    <span>{error}</span>
                  </div>
                )}

                <Button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-[#FF7800] hover:bg-[#ff8a1e] text-black font-semibold text-xs tracking-wider uppercase h-10 rounded-md transition-colors font-mono shadow-[0_0_15px_rgba(255,120,0,0.25)]"
                >
                  {loading ? "Doğrulanıyor..." : "Giriş Yap"}
                </Button>
              </form>
            </CardContent>
          </Card>

          <div className="text-center mt-6">
            <Link
              href="/"
              className="text-xs font-mono text-[#666666] hover:text-[#FF7800] transition-colors uppercase tracking-wider"
            >
              ← Ana Sayfaya Dön
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <AdminAuthContext.Provider
      value={{
        token,
        logout: handleLogout,
        isAuthenticated,
      }}
    >
      {children}
    </AdminAuthContext.Provider>
  );
}

export function getAdminSessionToken(): string | null {
  if (typeof window === "undefined") return null;
  return sessionStorage.getItem(SESSION_KEY);
}
