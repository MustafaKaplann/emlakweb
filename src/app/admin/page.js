"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabaseClient";
import { useRouter } from "next/navigation";
import { ShieldCheckIcon, UserIcon } from "@heroicons/react/24/outline";
import { useAuth } from "@/components/AuthProvider"; // ✅ eklendi

export default function AdminLoginPage() {
  const router = useRouter();
  const { session, loading } = useAuth(); // ✅ mevcut session'u çekiyoruz
  const [emailOrUsername, setEmailOrUsername] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [useUsername, setUseUsername] = useState(false); // toggle: email vs username

  // ✅ Eğer zaten giriş yapılmışsa formu göstermeden dashboard’a yönlendir
  useEffect(() => {
    if (!loading && session) {
      (async () => {
        const { data: profile, error: pErr } = await supabase
          .from("profiles")
          .select("is_admin")
          .eq("id", session.user.id)
          .single();

        if (!pErr && profile?.is_admin) {
          router.replace("/admin/dashboard");
        }
      })();
    }
  }, [session, loading, router]);

  async function signInWithEmail(e) {
    e.preventDefault();
    setBusy(true);
    setError("");

    try {
      const { data, error: signErr } = await supabase.auth.signInWithPassword({
        email: emailOrUsername,
        password,
      });

      if (signErr) {
        setError(signErr.message || "Giriş yapılırken hata oluştu.");
        return;
      }

      const user = data?.user;
      if (!user) {
        setError("Kullanıcı alınamadı.");
        return;
      }

      const { data: profile, error: pErr } = await supabase
        .from("profiles")
        .select("is_admin")
        .eq("id", user.id)
        .single();

      if (pErr || !profile?.is_admin) {
        setError("Bu hesap admin değil.");
        await supabase.auth.signOut();
        return;
      }

      router.push("/admin/dashboard");
    } catch (err) {
      console.error(err);
      setError(err?.message || "Bilinmeyen hata");
    } finally {
      setBusy(false);
    }
  }

  async function signInWithUsername(e) {
    e.preventDefault();
    setBusy(true);
    setError("");

    try {
      const { data: rows, error: qErr } = await supabase
        .from("profiles")
        .select("id, email")
        .eq("username", emailOrUsername)
        .limit(1)
        .maybeSingle();

      if (qErr) {
        console.error("profiles sorgu hatası", qErr);
        setError("Kullanıcı adıyla giriş yapılamadı.");
        return;
      }

      if (!rows?.email) {
        setError("Bu kullanıcı adına sahip profil bulunamadı.");
        return;
      }

      const { data, error: signErr } = await supabase.auth.signInWithPassword({
        email: rows.email,
        password,
      });

      if (signErr) {
        setError(signErr.message || "Giriş başarısız.");
        return;
      }

      const user = data?.user;
      if (!user) {
        setError("Kullanıcı alınamadı.");
        return;
      }

      const { data: profile, error: pErr } = await supabase
        .from("profiles")
        .select("is_admin")
        .eq("id", user.id)
        .single();

      if (pErr || !profile?.is_admin) {
        setError("Bu hesap admin değil.");
        await supabase.auth.signOut();
        return;
      }

      router.push("/admin/dashboard");
    } catch (err) {
      console.error(err);
      setError(err?.message || "Bilinmeyen hata");
    } finally {
      setBusy(false);
    }
  }

  function handleSubmit(e) {
    if (useUsername) return signInWithUsername(e);
    return signInWithEmail(e);
  }

  // ✅ Eğer session kontrolü sürüyorsa loading gösterebiliriz
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-600">Kontrol ediliyor...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-20 left-10 w-32 h-32 bg-gradient-to-r from-orange-400 to-red-500 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-10 w-40 h-40 bg-gradient-to-r from-orange-500 to-red-600 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-60 h-60 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full blur-3xl"></div>
      </div>

      <div className="w-full max-w-xl relative z-10">
        <div className="bg-white shadow-2xl rounded-3xl overflow-hidden border border-orange-100">
          <div className="md:flex">
            {/* Left Hero Section */}
            <div className="hidden md:flex md:w-1/2 items-center justify-center bg-gradient-to-br from-orange-500 via-red-500 to-orange-600 p-8 relative">
              <div className="absolute top-4 right-4 w-16 h-16 bg-white/10 rounded-full blur-xl"></div>
              <div className="absolute bottom-4 left-4 w-20 h-20 bg-white/10 rounded-full blur-xl"></div>

              <div className="text-white text-center relative z-10">
                <div className="relative">
                  <ShieldCheckIcon className="mx-auto h-16 w-16 text-white opacity-95 mb-4" />
                  <div className="absolute -top-2 -right-2 w-6 h-6 bg-gradient-to-r from-yellow-400 to-orange-300 rounded-full animate-pulse"></div>
                </div>
                <h3 className="text-3xl font-bold mb-2">Admin Girişi</h3>
                <p className="text-sm opacity-90 leading-relaxed">
                  Güvenli yönetici paneline
                  <br />
                  hoş geldiniz
                </p>
                <div className="flex items-center justify-center space-x-2 mt-6">
                  <div className="h-1 w-8 bg-white/30 rounded-full"></div>
                  <div className="h-1 w-4 bg-white/50 rounded-full"></div>
                  <div className="h-1 w-8 bg-white/30 rounded-full"></div>
                </div>
              </div>
            </div>

            {/* Form Section */}
            <div className="w-full p-6 sm:p-8">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-bold text-gray-900 flex items-center gap-3">
                  <div className="w-8 h-8 bg-gradient-to-r from-orange-500 to-red-500 rounded-lg flex items-center justify-center">
                    <UserIcon className="h-5 w-5 text-white" />
                  </div>
                  Admin Girişi
                </h2>

                <button
                  type="button"
                  onClick={() => {
                    setUseUsername((u) => !u);
                    setError("");
                  }}
                  className="text-sm px-4 py-2 rounded-full border border-orange-200 hover:bg-orange-50 text-orange-600 font-medium transition-all duration-200 hover:scale-105 active:scale-95 cursor-pointer"
                >
                  {useUsername ? "E-posta ile gir" : "Kullanıcı adı ile gir"}
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    {useUsername ? "Kullanıcı Adı" : "E-posta"}
                  </label>
                  <input
                    value={emailOrUsername}
                    onChange={(e) => setEmailOrUsername(e.target.value)}
                    type="text"
                    autoComplete={useUsername ? "username" : "email"}
                    placeholder={
                      useUsername ? "ör: z.myron" : "email@ornek.com"
                    }
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-300 focus:border-orange-500 transition-all duration-200"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Şifre
                  </label>
                  <input
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    type="password"
                    autoComplete="current-password"
                    placeholder="Şifrenizi girin"
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-300 focus:border-orange-500 transition-all duration-200"
                  />
                </div>

                {error && (
                  <div className="text-sm text-red-600 bg-red-50 border border-red-200 p-3 rounded-xl flex items-center gap-2">
                    <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                    {error}
                  </div>
                )}

                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={busy}
                    className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-orange-500 to-red-500 text-white py-3 rounded-xl hover:from-orange-600 hover:to-red-600 hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 shadow-lg hover:shadow-xl font-semibold disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                  >
                    {busy ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        Giriş yapılıyor...
                      </>
                    ) : (
                      <>
                        <span>Giriş Yap</span>
                        <span className="group-hover:translate-x-1 transition-transform duration-200">
                          →
                        </span>
                      </>
                    )}
                  </button>
                </div>

                <div className="flex items-center justify-between text-sm text-gray-500">
                  <a
                    href="#"
                    className="underline hover:text-orange-600 transition-colors duration-200"
                  >
                    Şifremi Unuttum
                  </a>
                </div>
              </form>
            </div>
          </div>
        </div>

        <p className="mt-4 text-center text-xs text-gray-500">
          Geliştirme amaçlı ücretsiz Supabase kimlik doğrulaması kullanılıyor.
        </p>
      </div>
    </div>
  );
}
