// src/components/AuthProvider.js
'use client';

import { createContext, useContext, useEffect, useState, useRef } from 'react';
import { supabase } from '@/lib/supabaseClient';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);
  const timeoutRef = useRef(null);

  // 🔹 Timeout süresi (örn: 30 dk)
  const TIMEOUT_DURATION = 30 * 60 * 1000; // 30 dakika

  useEffect(() => {
    // İlk açılışta session al
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
      setLoading(false);
    });

    // Oturum değişikliklerini dinle
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  // ⏱️ Timeout başlatma fonksiyonu
  const startTimeout = () => {
    clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(async () => {
      await supabase.auth.signOut();
      alert('Uzun süre işlem yapılmadı. Oturumunuz sonlandırıldı.');
      setSession(null);
    }, TIMEOUT_DURATION);
  };

  // ⏱️ Kullanıcı etkileşimlerini dinle
  useEffect(() => {
    if (!session) return;

    // Timeout başlat
    startTimeout();

    const resetTimeout = () => startTimeout();

    // Masaüstü + Mobil eventler
    window.addEventListener('mousemove', resetTimeout);
    window.addEventListener('keydown', resetTimeout);
    window.addEventListener('click', resetTimeout);
    window.addEventListener('touchstart', resetTimeout); // 🔹 mobil için

    return () => {
      clearTimeout(timeoutRef.current);
      window.removeEventListener('mousemove', resetTimeout);
      window.removeEventListener('keydown', resetTimeout);
      window.removeEventListener('click', resetTimeout);
      window.removeEventListener('touchstart', resetTimeout);
    };
  }, [session]);

  return (
    <AuthContext.Provider value={{ session, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
