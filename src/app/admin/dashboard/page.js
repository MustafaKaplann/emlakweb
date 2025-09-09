// Admin-panel-nextjs-tailwind.jsx
"use client";

import React, { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { Dialog, DialogPanel } from "@headlessui/react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";

// ---------- Sabitler ----------
const EMLAK_TIPLERI = ["Konut", "Arsa", "İş yeri", "Bina"];
const ISITMA_TIPLERI = [
  "Doğalgaz",
  "Klima",
  "Merkezi [Pay Ölçer]",
  "Yerden ısıtma",
];
const SATIS_KIRALIK = ["Satılık", "Kiralık"];
const KONUT_TIPLERI = [
  "Konut",
  "Daire",
  "Rezidans",
  "Müstakil Ev",
  "Villa",
  "Çiftlik Evi",
  "Köşk & Konak",
  "Yalı",
  "Yazlık",
];
const ARSA_TAPU_DURUMLARI = [
  "Hisseli Tapu",
  "Müstakil Tapulu",
  "Tahsis Tapu",
  "Zilliyet Tapu",
  "Yurt Dışı Tapulu",
  "Tapu Kaydı Yok",
];

// Gömülü fallback Mersin verisi (eğer fetch başarısız olursa kullanılır)
const MERSIN_ILCELERI = {
  Akdeniz: [
    "Adnan Menderes",
    "Akdeniz",
    "Anadolu",
    "Bahçe",
    "Barış",
    "Çay",
    "Çilek",
    "Güneş",
    "Hamidiye",
    "İhsaniye",
    "Kültür",
    "Kazanlı",
    "Karaduvar",
    "Kiremithane",
    "Mesudiye",
    "Müfide İlhan",
    "Mithatpaşa",
    "Şevketsümer",
    "Siteler",
    "Turgutreis",
    "Yeni",
  ],
  Mezitli: [
    "Arpaçbahşiş",
    "Aydınlıkevler",
    "Bozön",
    "Çeşmeli",
    "Çavuşlu",
    "Fuat Morel",
    "Karacailyas",
    "Kazım Karabekir",
    "Moda",
    "Mersin University",
    "Tece",
    "Yenimahalle",
  ],
  Yenişehir: [
    "Çağdaşkent",
    "Çankaya",
    "Fener",
    "Kocavilayet",
    "Mersin",
    "Karaduvar",
    "Murat Reis",
    "Nusratiye",
    "Pirinçlik",
    "Şahinali",
    "Toroslar Mahallesi",
  ],
  Toroslar: [
    "Dumlupınar",
    "Erdemli",
    "Gezende",
    "Hürriyet",
    "Konak",
    "Pınarbaşı",
    "Tepebağ",
    "Yelki",
    "Yenişehir Mah.",
  ],
  Tarsus: [
    "82 Evler",
    "Akgedik",
    "Akşemsettin",
    "Altaylılar",
    "Anıt",
    "Bağlar",
    "Barbaros",
    "Çağla",
    "Cavdarlı",
    "Çeşmeli",
    "Çiftlik",
    "Fahrettin Paşa",
    "Gazipaşa",
    "Gülek",
    "Kırklarsırtı",
    "Kavaklı",
    "Mithatpaşa",
    "Yeni",
  ],
  Erdemli: [
    "Akkuyu",
    "Aşırı Denizli",
    "Arpaç",
    "Beydemir",
    "Çeşmeli",
    "Dağlı",
    "Elvanlı",
    "Kızkalesi",
    "Tömük",
  ],
  Silifke: [
    "Atakent",
    "Boğsak",
    "Camiikebir",
    "Çeltikçi",
    "Erdemli Mah.",
    "Hıdırlık",
    "Mersin Yolu",
    "Narlıkuyu",
    "Yeşilovacık",
  ],
  Anamur: [
    "Anamur Merkez",
    "Bozyazı",
    "Çarıklar",
    "Erdemli Mah.",
    "Kaledran",
    "Kestel",
    "Sugar",
  ],
  Aydıncık: ["Aydıncık Merkez", "Karadere", "Yeşilovacık", "Tersakan"],
  Bozyazı: ["Bozyazı Merkez", "Tekeli", "Akpınar"],
  Çamlıyayla: ["Çamlıyayla Merkez", "Köyler"],
  Gülnar: ["Gülnar Merkez", "Ardıçlı", "Kızılkeçili", "Korucuk"],
  Mut: ["Mut Merkez", "Karıncalı", "Hacıbaba", "Çamlıca"],
};

// ---------------- Admin Panel ----------------
export default function AdminPanel() {
  // ************* tüm hook'lar burada, koşulsuz şekilde tanımlı olmalı *************
  // auth/ui
  const [isLoading, setIsLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const router = useRouter();

  // Mersin ilçe/mahalle verisi
  const [mersinIlceleriMap, setMersinIlceleriMap] = useState(MERSIN_ILCELERI);
  const [mersinIlcelerList, setMersinIlcelerList] = useState(
    Object.keys(MERSIN_ILCELERI).sort()
  );
  const [mersinLoading, setMersinLoading] = useState(true);

  // demo data
  const initialClients = [];
  const initialProperties = [];
  const [clients, setClients] = useState(initialClients);
  const [properties, setProperties] = useState(initialProperties);

  // UI state for app
  const [route, setRoute] = useState("dashboard"); // dashboard | musterilerim | portfoyum
  const [showClientForm, setShowClientForm] = useState(false);
  const [editingClient, setEditingClient] = useState(null);
  const [showPropertyForm, setShowPropertyForm] = useState(false);
  const [editingProperty, setEditingProperty] = useState(null);

  // search & filters (mobile-first)
  const [clientQuery, setClientQuery] = useState("");
  const [propertyQuery, setPropertyQuery] = useState("");
  const [propertyTypeFilter, setPropertyTypeFilter] = useState("");
  const [propertySaleFilter, setPropertySaleFilter] = useState("");

  // property detail view
  const [selectedProperty, setSelectedProperty] = useState(null);
  const [showPropertyDetail, setShowPropertyDetail] = useState(false);

  // *******************************************************************
  // Now effects - also unconditional and in stable order
  // *******************************************************************

  // 1) Auth check & auth state listener
  useEffect(() => {
    let mounted = true;

    async function checkAdmin() {
      if (!mounted) return;
      setIsLoading(true);
      try {
        const { data: userData, error: userErr } =
          await supabase.auth.getUser();
        if (userErr) throw userErr;
        const user = userData?.user ?? null;
        if (!user) {
          if (mounted) {
            setIsAdmin(false);
            setIsLoading(false);
            router.push("/admin");
          }
          return;
        }

        const { data: profile, error: pErr } = await supabase
          .from("profiles")
          .select("is_admin")
          .eq("id", user.id)
          .single();

        if (pErr || !profile?.is_admin) {
          await supabase.auth.signOut();
          if (mounted) {
            setIsAdmin(false);
            setIsLoading(false);
            router.push("/admin");
          }
          return;
        }

        if (mounted) {
          setIsAdmin(true);
          setIsLoading(false);
        }
      } catch (err) {
        console.error("Admin auth check failed:", err);
        if (mounted) {
          setIsAdmin(false);
          setIsLoading(false);
          router.push("/admin");
        }
      }
    }

    checkAdmin();

    const { data: listener } = supabase.auth.onAuthStateChange(
      (event, session) => {
        if (event === "SIGNED_OUT" || !session?.user) {
          router.push("/admin");
        }
        if (event === "SIGNED_IN") {
          checkAdmin();
        }
      }
    );

    return () => {
      mounted = false;
      if (listener) listener.subscription?.unsubscribe?.();
    };
  }, [router]);

  // 2) Load Mersin JSON (unconditional)
  useEffect(() => {
    let mounted = true;
    async function loadMersinData() {
      try {
        const res = await fetch("/data/mersin-ilceler.json");
        if (!res.ok) throw new Error("Fetch failed");
        const data = await res.json();
        if (mounted && data) {
          setMersinIlceleriMap(data);
          setMersinIlcelerList(Object.keys(data).sort());
          setMersinLoading(false);
          return;
        }
      } catch (err) {
        console.warn(
          "Mersin JSON yüklenemedi, gömülü fallback kullanılacak.",
          err
        );
      }
      if (mounted) {
        setMersinIlceleriMap(MERSIN_ILCELERI);
        setMersinIlcelerList(Object.keys(MERSIN_ILCELERI).sort());
        setMersinLoading(false);
      }
    }
    loadMersinData();
    return () => {
      mounted = false;
    };
  }, []);

  // 3) load/save localStorage for demo data
  useEffect(() => {
    try {
      const c = JSON.parse(localStorage.getItem("admin_clients") || "[]");
      const p = JSON.parse(localStorage.getItem("admin_properties") || "[]");
      setClients(c);
      setProperties(p);
    } catch (e) {
      console.error(e);
    }
  }, []);

  useEffect(
    () => localStorage.setItem("admin_clients", JSON.stringify(clients)),
    [clients]
  );
  useEffect(
    () => localStorage.setItem("admin_properties", JSON.stringify(properties)),
    [properties]
  );

  // *******************************************************************
  // Early returns (UI) are fine now because hooks all ran already
  // *******************************************************************
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center"
        >
          <div className="relative">
            <div className="w-16 h-16 border-4 border-blue-200 rounded-full animate-spin border-t-blue-600"></div>
            <div className="absolute inset-0 w-16 h-16 border-4 border-transparent rounded-full animate-ping border-t-blue-400 opacity-20"></div>
          </div>
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mt-4 text-slate-600 font-medium"
          >
            Yükleniyor...
          </motion.p>
        </motion.div>
      </div>
    );
  }

  if (!isAdmin) return null;

  // ---------- Stats derived from state ----------
  const totalClients = clients.length;
  const aktifClients = clients.filter((c) => c.active).length;
  const totalPortfoy = properties.length;
  const bekleyenIslem = properties.filter(
    (p) => p.status === "Beklemede"
  ).length;

  // CRUD helpers (unchanged)
  function addOrUpdateClient(data) {
    if (data.id) {
      setClients((prev) => prev.map((c) => (c.id === data.id ? data : c)));
    } else {
      data.id = cryptoRandomId();
      data.createdAt = new Date().toISOString();
      setClients((prev) => [data, ...prev]);
    }
    setShowClientForm(false);
    setEditingClient(null);
    setRoute("musterilerim");
  }
  function editClient(id) {
    const c = clients.find((x) => x.id === id);
    setEditingClient(c);
    setShowClientForm(true);
  }
  function deleteClient(id) {
    if (confirm("Müşteriyi silmek istediğinize emin misiniz?")) {
      setClients((prev) => prev.filter((c) => c.id !== id));
    }
  }

  function addOrUpdateProperty(data) {
    if (data.id) {
      setProperties((prev) => prev.map((p) => (p.id === data.id ? data : p)));
    } else {
      data.id = cryptoRandomId();
      data.createdAt = new Date().toISOString();
      setProperties((prev) => [data, ...prev]);
    }
    setShowPropertyForm(false);
    setEditingProperty(null);
    setRoute("portfoyum");
  }
  function editProperty(id) {
    const p = properties.find((x) => x.id === id);
    setEditingProperty(p);
    setShowPropertyForm(true);
  }
  function deleteProperty(id) {
    if (confirm("Portföyü silmek istediğinize emin misiniz?")) {
      setProperties((prev) => prev.filter((p) => p.id !== id));
    }
  }

  function exportJSON() {
    const data = { clients, properties };
    const url = URL.createObjectURL(
      new Blob([JSON.stringify(data, null, 2)], { type: "application/json" })
    );
    const a = document.createElement("a");
    a.href = url;
    a.download = "emlak-admin-export.json";
    a.click();
    URL.revokeObjectURL(url);
  }
  function importJSON(file) {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = JSON.parse(e.target.result);
        setClients(data.clients || []);
        setProperties(data.properties || []);
        alert("İçe aktarma başarılı");
      } catch (err) {
        alert("Dosya okunamadı veya geçersiz format");
      }
    };
    reader.readAsText(file);
  }

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
    } catch (err) {
      console.error("Logout error", err);
    } finally {
      router.push("/admin");
    }
  };

  // ---------- Render (dashboard + pages) ----------
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 pb-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Modern Header */}
        <motion.header
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="sticky top-0 z-30 -mx-4 sm:mx-0 mb-6 backdrop-blur-xl bg-white/80 border-b border-slate-200/50"
        >
          <div className="px-4 sm:px-0 py-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <motion.div
                whileHover={{ scale: 1.05, rotate: 5 }}
                className="h-10 w-10 rounded-2xl bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 text-white grid place-items-center font-bold text-lg shadow-lg"
              >
                E
              </motion.div>
              <div>
                <h1 className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  Emlak Admin
                </h1>
                <p className="text-xs text-slate-500">Yönetim Paneli</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <nav className="hidden sm:flex gap-2 items-center">
                <NavButton
                  active={route === "dashboard"}
                  onClick={() => setRoute("dashboard")}
                >
                  📊 Dashboard
                </NavButton>
                <NavButton
                  active={route === "musterilerim"}
                  onClick={() => setRoute("musterilerim")}
                >
                  👥 Müşterilerim
                </NavButton>
                <NavButton
                  active={route === "portfoyum"}
                  onClick={() => setRoute("portfoyum")}
                >
                  🏠 Portföyüm
                </NavButton>
                <button
                  onClick={handleLogout}
                  className="ml-2 px-4 py-2 rounded-xl bg-red-500 hover:bg-red-600 text-white font-medium transition-colors shadow-lg hover:shadow-xl"
                >
                  Çıkış
                </button>
              </nav>

              <button
                onClick={handleLogout}
                className="sm:hidden px-3 py-2 rounded-xl bg-red-500 hover:bg-red-600 text-white font-medium transition-colors"
              >
                Çıkış
              </button>
            </div>
          </div>
        </motion.header>

        <AnimatePresence mode="wait">
          {route === "dashboard" && (
            <motion.div
              key="dashboard"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              {/* Stats Cards */}
              <section className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
                <ModernStatCard
                  title="Toplam Müşteri"
                  value={totalClients}
                  icon="👥"
                  color="blue"
                />
                <ModernStatCard
                  title="Aktif Müşteri"
                  value={aktifClients}
                  icon="✅"
                  color="green"
                />
                <ModernStatCard
                  title="Toplam Portföy"
                  value={totalPortfoy}
                  icon="🏠"
                  color="purple"
                />
                <ModernStatCard
                  title="Bekleyen İşlem"
                  value={bekleyenIslem}
                  icon="⏳"
                  color="orange"
                />
              </section>

              {/* Quick Actions */}
              <section className="grid grid-cols-2 gap-4 sm:grid-cols-4 mb-8">
                <ModernActionCard
                  onClick={() => {
                    setShowClientForm(true);
                    setEditingClient(null);
                  }}
                  label="Yeni Müşteri"
                  icon="➕"
                  color="emerald"
                />
                <ModernActionCard
                  onClick={() => setRoute("musterilerim")}
                  label="Müşteri Yönetimi"
                  icon="👥"
                  color="blue"
                />
                <ModernActionCard
                  onClick={() => {
                    setShowPropertyForm(true);
                    setEditingProperty(null);
                  }}
                  label="Yeni Portföy"
                  icon="🏠"
                  color="purple"
                />
                <ModernActionCard
                  onClick={() => setRoute("portfoyum")}
                  label="Portföy Yönetimi"
                  icon="📋"
                  color="indigo"
                />
              </section>

              {/* Recent Activity */}
              <section className="mb-8">
                <h2 className="text-xl font-bold mb-4 text-slate-800">
                  Son Aktiviteler
                </h2>
                <div className="grid gap-4 sm:grid-cols-2">
                  <ModernActivityCard
                    title="Yeni Müşteriler"
                    items={clients.slice(0, 5)}
                    emptyText="Henüz müşteri yok"
                  />
                  <ModernActivityCard
                    title="Yeni Portföyler"
                    items={properties.slice(0, 5)}
                    emptyText="Henüz portföy yok"
                  />
                </div>
              </section>

              {/* Export/Import */}
              <div className="flex flex-col sm:flex-row gap-3">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={exportJSON}
                  className="px-6 py-3 rounded-2xl bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-medium shadow-lg hover:shadow-xl transition-all"
                >
                  📤 Export JSON
                </motion.button>
                <motion.label
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="px-6 py-3 rounded-2xl bg-white border border-slate-200 cursor-pointer font-medium shadow-lg hover:shadow-xl transition-all text-slate-700"
                >
                  📥 Import JSON
                  <input
                    onChange={(e) => importJSON(e.target.files[0])}
                    type="file"
                    accept="application/json"
                    className="hidden"
                  />
                </motion.label>
              </div>
            </motion.div>
          )}

          {route === "musterilerim" && (
            <motion.div
              key="clients"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-slate-800">
                  Müşteri Yönetimi
                </h2>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => {
                    setShowClientForm(true);
                    setEditingClient(null);
                  }}
                  className="px-6 py-3 bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white rounded-2xl font-medium shadow-lg hover:shadow-xl transition-all"
                >
                  ➕ Yeni Müşteri
                </motion.button>
              </div>

              {/* Search */}
              <div className="mb-6">
                <div className="relative">
                  <input
                    value={clientQuery}
                    onChange={(e) => setClientQuery(e.target.value)}
                    placeholder="🔍 Müşteri ara (isim, e-posta, telefon)"
                    className="w-full rounded-2xl border border-slate-200 p-4 bg-white shadow-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  />
                </div>
              </div>

              <div className="grid gap-4">
                {clients.length === 0 && (
                  <div className="text-center py-12 text-slate-500">
                    <div className="text-6xl mb-4">👥</div>
                    <p className="text-lg">Henüz müşteri eklenmemiş</p>
                  </div>
                )}
                {clients
                  .filter((c) => {
                    if (!clientQuery) return true;
                    const q = clientQuery.toLowerCase();
                    return (
                      (c.name || "").toLowerCase().includes(q) ||
                      (c.email || "").toLowerCase().includes(q) ||
                      (c.phone || "").toLowerCase().includes(q)
                    );
                  })
                  .map((c) => (
                    <ModernClientCard
                      key={c.id}
                      client={c}
                      onEdit={() => {
                        setEditingClient(c);
                        setShowClientForm(true);
                      }}
                      onDelete={() => deleteClient(c.id)}
                    />
                  ))}
              </div>
            </motion.div>
          )}

          {route === "portfoyum" && (
            <motion.div
              key="properties"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-slate-800">
                  Portföy Yönetimi
                </h2>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => {
                    setShowPropertyForm(true);
                    setEditingProperty(null);
                  }}
                  className="px-6 py-3 bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white rounded-2xl font-medium shadow-lg hover:shadow-xl transition-all"
                >
                  🏠 Yeni Portföy
                </motion.button>
              </div>

              {/* Filters */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
                <div className="relative">
                  <input
                    value={propertyQuery}
                    onChange={(e) => setPropertyQuery(e.target.value)}
                    placeholder="🔍 Portföy ara..."
                    className="w-full rounded-2xl border border-slate-200 p-4 bg-white shadow-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  />
                </div>
                <select
                  value={propertyTypeFilter}
                  onChange={(e) => setPropertyTypeFilter(e.target.value)}
                  className="rounded-2xl border border-slate-200 p-4 bg-white shadow-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                >
                  <option value="">🏠 Tüm Tipler</option>
                  {EMLAK_TIPLERI.map((t) => (
                    <option key={t} value={t}>
                      {t}
                    </option>
                  ))}
                </select>
                <select
                  value={propertySaleFilter}
                  onChange={(e) => setPropertySaleFilter(e.target.value)}
                  className="rounded-2xl border border-slate-200 p-4 bg-white shadow-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                >
                  <option value="">💰 Tümü (Sat/Kira)</option>
                  <option>Satılık</option>
                  <option>Kiralık</option>
                  <option>Devren Satılık</option>
                  <option>Devren Kiralık</option>
                  <option>Kat Karşılığı Satılık</option>
                </select>
              </div>

              <div className="grid gap-4">
                {properties.length === 0 && (
                  <div className="text-center py-12 text-slate-500">
                    <div className="text-6xl mb-4">🏠</div>
                    <p className="text-lg">Henüz portföy eklenmemiş</p>
                  </div>
                )}
                {properties
                  .filter((p) => {
                    if (propertyTypeFilter && p.type !== propertyTypeFilter)
                      return false;
                    if (propertySaleFilter && p.saleType !== propertySaleFilter)
                      return false;
                    if (!propertyQuery) return true;
                    const q = propertyQuery.toLowerCase();
                    return (
                      (p.title || "").toLowerCase().includes(q) ||
                      (p.ilce || "").toLowerCase().includes(q) ||
                      String(p.fiyatTL || "")
                        .toLowerCase()
                        .includes(q) ||
                      (p.description || "").toLowerCase().includes(q)
                    );
                  })
                  .map((p) => (
                    <ModernPropertyCard
                      key={p.id}
                      property={p}
                      onEdit={() => {
                        setEditingProperty(p);
                        setShowPropertyForm(true);
                      }}
                      onView={() => {
                        setSelectedProperty(p);
                        setShowPropertyDetail(true);
                      }}
                      onDelete={() => deleteProperty(p.id)}
                    />
                  ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Mobile bottom tab bar */}
      <BottomTabBar route={route} onChange={setRoute} />

      {/* Floating Action Button */}
      <FloatingActionButton
        visible={route !== "dashboard"}
        label={route === "musterilerim" ? "Yeni Müşteri" : "Yeni Portföy"}
        onClick={() => {
          if (route === "musterilerim") {
            setEditingClient(null);
            setShowClientForm(true);
          }
          if (route === "portfoyum") {
            setEditingProperty(null);
            setShowPropertyForm(true);
          }
        }}
      />

      {/* Modal forms */}
      <AnimatePresence>
        {showClientForm && (
          <ModernModal
            onClose={() => {
              setShowClientForm(false);
              setEditingClient(null);
            }}
          >
            <ClientForm
              initial={editingClient}
              onSubmit={addOrUpdateClient}
              onCancel={() => setShowClientForm(false)}
            />
          </ModernModal>
        )}
        {showPropertyForm && (
          <ModernModal
            onClose={() => {
              setShowPropertyForm(false);
              setEditingProperty(null);
            }}
          >
            <PropertyForm
              initial={editingProperty}
              onSubmit={addOrUpdateProperty}
              onCancel={() => setShowPropertyForm(false)}
              mersinIlceleriMap={mersinIlceleriMap}
              mersinIlcelerList={mersinIlcelerList}
              mersinLoading={mersinLoading}
            />
          </ModernModal>
        )}
        {showPropertyDetail && selectedProperty && (
          <ModernModal
            onClose={() => {
              setShowPropertyDetail(false);
              setSelectedProperty(null);
            }}
          >
            <PropertyDetail
              property={selectedProperty}
              onClose={() => {
                setShowPropertyDetail(false);
                setSelectedProperty(null);
              }}
            />
          </ModernModal>
        )}
      </AnimatePresence>
    </div>
  );
}

// ---------------- Modern Components ----------------

function NavButton({ active, onClick, children }) {
  return (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={onClick}
      className={`px-4 py-2 rounded-xl font-medium transition-all ${
        active
          ? "bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-lg"
          : "bg-white text-slate-700 hover:bg-slate-50 border border-slate-200"
      }`}
    >
      {children}
    </motion.button>
  );
}

function ModernStatCard({ title, value, icon, color }) {
  const colorMap = {
    blue: "from-blue-500 to-blue-600",
    green: "from-emerald-500 to-emerald-600",
    purple: "from-purple-500 to-purple-600",
    orange: "from-orange-500 to-orange-600",
  };

  return (
    <motion.div
      whileHover={{ scale: 1.02, y: -2 }}
      className="p-6 rounded-3xl bg-white shadow-lg hover:shadow-xl transition-all border border-slate-200"
    >
      <div className="flex items-center justify-between mb-4">
        <div
          className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${colorMap[color]} flex items-center justify-center text-2xl shadow-lg`}
        >
          {icon}
        </div>
        <div className="text-right">
          <div className="text-3xl font-bold text-slate-800">{value}</div>
          <div className="text-sm text-slate-500 font-medium">{title}</div>
        </div>
      </div>
    </motion.div>
  );
}

function ModernActionCard({ label, onClick, icon, color }) {
  const colorMap = {
    emerald:
      "from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700",
    blue: "from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700",
    purple:
      "from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700",
    indigo:
      "from-indigo-500 to-indigo-600 hover:from-indigo-600 hover:to-indigo-700",
  };

  return (
    <motion.button
      whileHover={{ scale: 1.05, y: -2 }}
      whileTap={{ scale: 0.95 }}
      onClick={onClick}
      className={`p-6 rounded-3xl bg-gradient-to-br ${colorMap[color]} text-white font-medium shadow-lg hover:shadow-xl transition-all`}
    >
      <div className="text-center">
        <div className="text-3xl mb-2">{icon}</div>
        <div className="text-sm font-semibold">{label}</div>
      </div>
    </motion.button>
  );
}

function ModernActivityCard({ title, items, emptyText }) {
  return (
    <div className="p-6 rounded-3xl bg-white shadow-lg border border-slate-200">
      <h3 className="text-lg font-bold mb-4 text-slate-800">{title}</h3>
      <div className="space-y-3 max-h-64 overflow-auto">
        {items.length === 0 ? (
          <div className="text-center py-4 text-slate-500">
            <div className="text-2xl mb-2">📭</div>
            <p className="text-sm">{emptyText}</p>
          </div>
        ) : (
          items.map((item, index) => (
            <motion.div
              key={item.id || index}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="flex items-center justify-between p-3 rounded-xl bg-slate-50 hover:bg-slate-100 transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 text-white text-xs font-bold flex items-center justify-center">
                  {item.name?.[0]?.toUpperCase() ||
                    item.title?.[0]?.toUpperCase() ||
                    "?"}
                </div>
                <div>
                  <div className="text-sm font-medium text-slate-800 truncate">
                    {item.name ||
                      item.title ||
                      `${item.type} — ${item.ilce || "—"}`}
                  </div>
                  <div className="text-xs text-slate-500">
                    {item.email || item.fiyatTL ? formatTL(item.fiyatTL) : ""}
                  </div>
                </div>
              </div>
              <div className="text-xs text-slate-400">
                {item.createdAt
                  ? new Date(item.createdAt).toLocaleDateString()
                  : ""}
              </div>
            </motion.div>
          ))
        )}
      </div>
    </div>
  );
}

function ModernClientCard({ client, onEdit, onDelete }) {
  return (
    <motion.div
      whileHover={{ scale: 1.01, y: -2 }}
      className="p-6 rounded-3xl bg-white shadow-lg hover:shadow-xl transition-all border border-slate-200"
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-400 to-purple-500 text-white text-xl font-bold flex items-center justify-center shadow-lg">
            {client.name?.[0]?.toUpperCase() || "?"}
          </div>
          <div>
            <h3 className="text-lg font-bold text-slate-800">{client.name}</h3>
            <p className="text-slate-600">{client.email}</p>
            <p className="text-slate-500">{client.phone}</p>
            {client.active && (
              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-emerald-100 text-emerald-800 mt-1">
                ✅ Aktif
              </span>
            )}
          </div>
        </div>
        <div className="flex gap-2">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onEdit}
            className="px-4 py-2 rounded-xl bg-blue-500 hover:bg-blue-600 text-white font-medium transition-colors"
          >
            ✏️ Düzenle
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onDelete}
            className="px-4 py-2 rounded-xl bg-red-500 hover:bg-red-600 text-white font-medium transition-colors"
          >
            🗑️ Sil
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
}

function ModernPropertyCard({ property, onEdit, onView, onDelete }) {
  return (
    <motion.div
      whileHover={{ scale: 1.01, y: -2 }}
      className="p-6 rounded-3xl bg-white shadow-lg hover:shadow-xl transition-all border border-slate-200"
    >
      <div className="flex gap-4">
        <div className="w-24 h-24 rounded-2xl overflow-hidden bg-slate-100 flex-shrink-0">
          <ThumbPreview media={property.media || []} />
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="text-lg font-bold text-slate-800 mb-2">
            {property.title || `${property.type} — ${property.ilce || "—"}`}
          </h3>
          <p className="text-xl font-bold text-emerald-600 mb-2">
            {property.fiyatTL ? formatTL(property.fiyatTL) : "Belirtilmemiş"}
            {property.fiyatUSD && (
              <span className="text-sm text-slate-500 ml-2">
                / ${property.fiyatUSD}
              </span>
            )}
          </p>
          <div className="flex flex-wrap gap-2 mb-3">
            <ModernBadge color="blue">{property.type}</ModernBadge>
            {property.saleType && (
              <ModernBadge color="emerald">{property.saleType}</ModernBadge>
            )}
            <ModernBadge color="gray">
              {property.media?.length || 0} medya
            </ModernBadge>
          </div>
          <p className="text-sm text-slate-600">
            📍 {property.il || "Mersin"} • {property.ilce || "Belirtilmemiş"} •{" "}
            {property.mahalle || "Belirtilmemiş"}
          </p>
        </div>
        <div className="flex flex-col gap-2">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onEdit}
            className="px-4 py-2 rounded-xl bg-blue-500 hover:bg-blue-600 text-white font-medium transition-colors text-sm"
          >
            ✏️ Düzenle
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onView}
            className="px-4 py-2 rounded-xl bg-purple-500 hover:bg-purple-600 text-white font-medium transition-colors text-sm"
          >
            👁️ Görüntüle
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onDelete}
            className="px-4 py-2 rounded-xl bg-red-500 hover:bg-red-600 text-white font-medium transition-colors text-sm"
          >
            🗑️ Sil
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
}

function ModernModal({ children, onClose }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4"
    >
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />
      <motion.div
        initial={{ y: 50, opacity: 0, scale: 0.95 }}
        animate={{ y: 0, opacity: 1, scale: 1 }}
        exit={{ y: 50, opacity: 0, scale: 0.95 }}
        transition={{ type: "spring", damping: 25, stiffness: 300 }}
        className="relative w-full max-w-4xl max-h-[90vh] overflow-hidden"
      >
        <div className="rounded-3xl bg-white shadow-2xl border border-slate-200 overflow-hidden">
          <div className="flex items-center justify-between p-6 border-b border-slate-200">
            <h2 className="text-xl font-bold text-slate-800">Form</h2>
            <motion.button
              whileHover={{ scale: 1.1, rotate: 90 }}
              whileTap={{ scale: 0.9 }}
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-600 transition-colors"
            >
              ✕
            </motion.button>
          </div>
          <div className="p-6 max-h-[calc(90vh-120px)] overflow-auto">
            {children}
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

function ModernBadge({ children, color = "gray" }) {
  const colorMap = {
    blue: "bg-blue-100 text-blue-800",
    emerald: "bg-emerald-100 text-emerald-800",
    gray: "bg-slate-100 text-slate-800",
    purple: "bg-purple-100 text-purple-800",
  };
  return (
    <span
      className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${colorMap[color]}`}
    >
      {children}
    </span>
  );
}

function BottomTabBar({ route, onChange }) {
  return (
    <motion.div
      initial={{ y: 100 }}
      animate={{ y: 0 }}
      className="sm:hidden fixed bottom-0 inset-x-0 z-40 border-t border-slate-200 bg-white/95 backdrop-blur-xl"
    >
      <div className="grid grid-cols-3">
        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={() => onChange("dashboard")}
          className={`py-3 flex flex-col items-center text-xs font-medium transition-colors ${
            route === "dashboard" ? "text-blue-600" : "text-slate-600"
          }`}
        >
          <span
            className={`h-1 w-8 rounded-full mb-1 transition-colors ${
              route === "dashboard" ? "bg-blue-600" : "bg-transparent"
            }`}
          ></span>
          📊 Dashboard
        </motion.button>
        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={() => onChange("musterilerim")}
          className={`py-3 flex flex-col items-center text-xs font-medium transition-colors ${
            route === "musterilerim" ? "text-blue-600" : "text-slate-600"
          }`}
        >
          <span
            className={`h-1 w-8 rounded-full mb-1 transition-colors ${
              route === "musterilerim" ? "bg-blue-600" : "bg-transparent"
            }`}
          ></span>
          👥 Müşteriler
        </motion.button>
        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={() => onChange("portfoyum")}
          className={`py-3 flex flex-col items-center text-xs font-medium transition-colors ${
            route === "portfoyum" ? "text-blue-600" : "text-slate-600"
          }`}
        >
          <span
            className={`h-1 w-8 rounded-full mb-1 transition-colors ${
              route === "portfoyum" ? "bg-blue-600" : "bg-transparent"
            }`}
          ></span>
          🏠 Portföy
        </motion.button>
      </div>
    </motion.div>
  );
}

function FloatingActionButton({ visible, label, onClick }) {
  if (!visible) return null;
  return (
    <motion.button
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      exit={{ scale: 0, opacity: 0 }}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
      onClick={onClick}
      className="fixed bottom-20 right-4 sm:right-8 z-40 px-6 py-4 rounded-2xl shadow-2xl bg-gradient-to-r from-blue-500 to-purple-500 text-white font-bold text-sm"
    >
      {label}
    </motion.button>
  );
}

function ClientForm({ initial = null, onSubmit, onCancel }) {
  const [form, setForm] = useState(() => ({
    id: initial?.id || null,
    name: initial?.name || "",
    email: initial?.email || "",
    phone: initial?.phone || "",
    notes: initial?.notes || "",
    active: initial?.active ?? true,
  }));

  function submit(e) {
    e.preventDefault();
    if (!form.name) return alert("Müşteri adı gerekli");
    onSubmit(form);
  }

  return (
    <form onSubmit={submit} className="space-y-6">
      <h3 className="text-2xl font-bold text-slate-800 mb-6">
        {form.id ? "✏️ Müşteri Düzenle" : "➕ Yeni Müşteri Ekle"}
      </h3>

      <div>
        <label className="block text-sm font-medium text-slate-700 mb-2">
          İsim *
        </label>
        <input
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          className="w-full rounded-2xl border border-slate-200 p-4 bg-white text-slate-800 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
          placeholder="Müşteri adı"
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            Email
          </label>
          <input
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            className="w-full rounded-2xl border border-slate-200 p-4 bg-white text-slate-800 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            placeholder="email@example.com"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            Telefon
          </label>
          <input
            value={form.phone}
            onChange={(e) => setForm({ ...form, phone: e.target.value })}
            className="w-full rounded-2xl border border-slate-200 p-4 bg-white text-slate-800 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            placeholder="+90 555 123 45 67"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-700 mb-2">
          Notlar
        </label>
        <textarea
          value={form.notes}
          onChange={(e) => setForm({ ...form, notes: e.target.value })}
          className="w-full rounded-2xl border border-slate-200 p-4 bg-white text-slate-800 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
          rows={4}
          placeholder="Müşteri hakkında notlar..."
        />
      </div>

      <div className="flex items-center gap-3">
        <label className="flex items-center gap-3 cursor-pointer">
          <input
            checked={form.active}
            onChange={(e) => setForm({ ...form, active: e.target.checked })}
            type="checkbox"
            className="w-5 h-5 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
          />
          <span className="text-slate-700 font-medium">✅ Aktif müşteri</span>
        </label>
      </div>

      <div className="flex justify-end gap-4 pt-6">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={onCancel}
          type="button"
          className="px-6 py-3 rounded-2xl border border-slate-200 bg-white text-slate-700 font-medium hover:bg-slate-50 transition-colors"
        >
          ❌ İptal
        </motion.button>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          type="submit"
          className="px-6 py-3 rounded-2xl bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white font-medium shadow-lg hover:shadow-xl transition-all"
        >
          💾 Kaydet
        </motion.button>
      </div>
    </form>
  );
}

function PropertyForm({
  initial = null,
  onSubmit,
  onCancel,
  mersinIlceleriMap = MERSIN_ILCELERI,
  mersinIlcelerList = Object.keys(MERSIN_ILCELERI).sort(),
  mersinLoading = false,
}) {
  const [form, setForm] = useState(() => ({
    id: initial?.id || null,
    title: initial?.title || "",
    type: initial?.type || EMLAK_TIPLERI[0],
    konutTipi: initial?.konutTipi || KONUT_TIPLERI[0],
    saleType: initial?.saleType || SATIS_KIRALIK[0],
    il: "Mersin",
    ilce: initial?.ilce || "",
    mahalle: initial?.mahalle || "",
    m2Brut: initial?.m2Brut || "",
    m2Net: initial?.m2Net || "",
    odaSayisi: initial?.odaSayisi || "",
    binaYasi: initial?.binaYasi || "",
    bulunduKat: initial?.bulunduKat || "",
    binadakiKatSayisi: initial?.binadakiKatSayisi || "",
    esya: initial?.esya || "",
    isitma: initial?.isitma || ISITMA_TIPLERI[0],
    banyoSayisi: initial?.banyoSayisi || "",
    mutfakSayisi: initial?.mutfakSayisi || "",
    balkonSayisi: initial?.balkonSayisi || "",
    asansor: initial?.asansor || "",
    otopark: initial?.otopark || "",
    siteIci: initial?.siteIci || "",
    krediUygun: initial?.krediUygun || "",
    cephe: initial?.cephe || "",
    takas: initial?.takas || "",
    adaNo: initial?.adaNo || "",
    parselNo: initial?.parselNo || "",
    kaks: initial?.kaks || "",
    gabari: initial?.gabari || "",
    tapuDurumu: initial?.tapuDurumu || "",
    daireSayisiKat: initial?.daireSayisiKat || "",
    daireMetre: initial?.daireMetre || "",
    description: initial?.description || "",
    fiyatTL: initial?.fiyatTL || "",
    fiyatUSD: initial?.fiyatUSD || "",
    media: initial?.media || [],
  }));

  const fileRef = useRef();

  function onFileChange(e) {
    const files = Array.from(e.target.files || []);
    const newMedia = [];
    files.forEach((f) => {
      const reader = new FileReader();
      reader.onload = (ev) => {
        const src = ev.target.result;
        const type = f.type.startsWith("video/") ? "video" : "image";
        newMedia.push({ type, src, name: f.name });
        if (newMedia.length === files.length) {
          setForm((prev) => ({ ...prev, media: [...prev.media, ...newMedia] }));
        }
      };
      reader.readAsDataURL(f);
    });
    e.target.value = null;
  }
  function removeMedia(index) {
    setForm((prev) => ({
      ...prev,
      media: prev.media.filter((_, i) => i !== index),
    }));
  }

  // Required fields per type
  const requiredMap = {
    Konut: [
      "il",
      "ilce",
      "mahalle",
      "konutTipi",
      "saleType",
      "m2Brut",
      "m2Net",
      "odaSayisi",
      "binaYasi",
      "bulunduKat",
      "binadakiKatSayisi",
      "fiyatTL",
    ],
    "İş yeri": ["il", "ilce", "mahalle", "saleType", "m2Brut", "fiyatTL"],
    Arsa: ["il", "ilce", "mahalle", "saleType", "m2Brut", "fiyatTL"],
    Bina: [
      "il",
      "ilce",
      "mahalle",
      "binadakiKatSayisi",
      "daireSayisiKat",
      "m2Brut",
      "binaYasi",
      "fiyatTL",
    ],
  };

  function validate() {
    const req = requiredMap[form.type] || [];
    for (const key of req) {
      if (!form[key] && form[key] !== 0) {
        const label = keyLabels[key] || key;
        alert(`${label} (zorunlu) boş bırakılamaz`);
        return false;
      }
    }
    // Additional conditional: if saleType includes "Kiralık" then esya required
    // Additional conditional: if saleType is "Kiralık" or "Devren Kiralık" then esya required (only for Konut)
    if (
      form.type === "Konut" &&
      (form.saleType === "Kiralık" || form.saleType === "Devren Kiralık")
    ) {
      if (!form.esya) {
        alert("Kiralık veya Devren Kiralık ise Eşyalı/Eşyasız alanını seçiniz");
        return false;
      }
    }
  }

  const keyLabels = {
    il: "İl",
    ilce: "İlçe",
    mahalle: "Mahalle",
    konutTipi: "Konut Tipi",
    saleType: "Satılık/Kiralık",
    m2Brut: "m² (Brüt)",
    m2Net: "m² (Net)",
    odaSayisi: "Oda Sayısı",
    binaYasi: "Bina Yaşı",
    bulunduKat: "Bulunduğu Kat",
    binadakiKatSayisi: "Binadaki Kat Sayısı",
    esya: "Eşya",
    m2: "m²",
    daireSayisiKat: "Bir Kattaki Daire",
    fiyatTL: "Fiyat (TL)",
  };

  function submit(e) {
    e.preventDefault();
    if (!validate()) return;
    // normalize some fields: ensure il always 'Mersin'
    const out = { ...form, il: "Mersin" };
    onSubmit(out);
  }

  return (
    <form onSubmit={submit} className="space-y-6">
      <h3 className="text-2xl font-bold text-slate-800 mb-6">
        {form.id ? "✏️ Portföy Düzenle" : "🏠 Yeni Portföy Ekle"}
      </h3>

      <div>
        <label className="block text-sm font-medium text-slate-700 mb-2">
          Başlık (opsiyonel)
        </label>
        <input
          value={form.title}
          onChange={(e) => setForm({ ...form, title: e.target.value })}
          className="w-full rounded-2xl border border-slate-200 p-4 bg-white text-slate-800 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
          placeholder="Portföy başlığı"
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            Emlak Tipi
          </label>
          <select
            value={form.type}
            onChange={(e) => setForm({ ...form, type: e.target.value })}
            className="w-full rounded-2xl border border-slate-200 p-4 bg-white text-slate-800 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
          >
            {EMLAK_TIPLERI.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            Satılık/Kiralık
          </label>
          <select
            value={form.saleType}
            onChange={(e) => setForm({ ...form, saleType: e.target.value })}
            className="w-full rounded-2xl border border-slate-200 p-4 bg-white text-slate-800 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
          >
            <option>Satılık</option>
            <option>Kiralık</option>
            <option>Devren Satılık</option>
            <option>Devren Kiralık</option>
          </select>
        </div>
      </div>

      {/* Location row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            İl
          </label>
          <input
            readOnly
            value={"Mersin"}
            className="w-full rounded-2xl border border-slate-200 p-4 bg-slate-50 text-slate-600"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            İlçe *
          </label>
          <select
            value={form.ilce}
            onChange={(e) => {
              setForm({ ...form, ilce: e.target.value, mahalle: "" });
            }}
            className="w-full rounded-2xl border border-slate-200 p-4 bg-white text-slate-800 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            disabled={mersinLoading}
          >
            <option value="">
              {mersinLoading ? "Yükleniyor..." : "-- İlçe seçiniz --"}
            </option>
            {mersinIlcelerList.map((ilce) => (
              <option key={ilce} value={ilce}>
                {ilce}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            Mahalle *
          </label>
          {!form.ilce ? (
            <select
              disabled
              className="w-full rounded-2xl border border-slate-200 p-4 bg-slate-100 text-slate-500"
            >
              <option>
                {mersinLoading ? "Yükleniyor..." : "Önce ilçe seçiniz"}
              </option>
            </select>
          ) : mersinIlceleriMap[form.ilce] &&
            mersinIlceleriMap[form.ilce].length > 0 ? (
            <select
              value={form.mahalle}
              onChange={(e) => setForm({ ...form, mahalle: e.target.value })}
              className="w-full rounded-2xl border border-slate-200 p-4 bg-white text-slate-800 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            >
              <option value="">-- Mahalle seçiniz --</option>
              {mersinIlceleriMap[form.ilce].map((m) => (
                <option key={m} value={m}>
                  {m}
                </option>
              ))}
            </select>
          ) : (
            <input
              value={form.mahalle}
              onChange={(e) => setForm({ ...form, mahalle: e.target.value })}
              className="w-full rounded-2xl border border-slate-200 p-4 bg-white text-slate-800 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              placeholder="Mahalle adı"
            />
          )}
        </div>
      </div>

      {/* Now render type-specific fields */}
      {form.type === "Konut" && (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
            <div>
              <label className="text-sm">Konut Tipi *</label>
              <select
                value={form.konutTipi}
                onChange={(e) =>
                  setForm({ ...form, konutTipi: e.target.value })
                }
                className="mt-1 block w-full rounded-lg border p-2"
              >
                {KONUT_TIPLERI.map((k) => (
                  <option key={k} value={k}>
                    {k}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-sm">m² (Brüt) *</label>
              <input
                value={form.m2Brut}
                onChange={(e) => setForm({ ...form, m2Brut: e.target.value })}
                className="mt-1 block w-full rounded-lg border p-2"
              />
            </div>
            <div>
              <label className="text-sm">m² (Net) *</label>
              <input
                value={form.m2Net}
                onChange={(e) => setForm({ ...form, m2Net: e.target.value })}
                className="mt-1 block w-full rounded-lg border p-2"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
            <div>
              <label className="text-sm">Oda Sayısı *</label>
              <input
                value={form.odaSayisi}
                onChange={(e) =>
                  setForm({ ...form, odaSayisi: e.target.value })
                }
                className="mt-1 block w-full rounded-lg border p-2"
              />
            </div>
            <div>
              <label className="text-sm">Bina Yaşı *</label>
              <input
                value={form.binaYasi}
                onChange={(e) => setForm({ ...form, binaYasi: e.target.value })}
                className="mt-1 block w-full rounded-lg border p-2"
              />
            </div>
            <div>
              <label className="text-sm">Bulunduğu Kat *</label>
              <input
                value={form.bulunduKat}
                onChange={(e) =>
                  setForm({ ...form, bulunduKat: e.target.value })
                }
                className="mt-1 block w-full rounded-lg border p-2"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
            <div>
              <label className="text-sm">Binadaki Kat Sayısı *</label>
              <input
                value={form.binadakiKatSayisi}
                onChange={(e) =>
                  setForm({ ...form, binadakiKatSayisi: e.target.value })
                }
                className="mt-1 block w-full rounded-lg border p-2"
              />
            </div>
            <div>
              <label className="text-sm">Isıtma</label>
              <select
                value={form.isitma}
                onChange={(e) => setForm({ ...form, isitma: e.target.value })}
                className="mt-1 block w-full rounded-lg border p-2"
              >
                {ISITMA_TIPLERI.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-sm">Banyo Sayısı</label>
              <input
                value={form.banyoSayisi}
                onChange={(e) =>
                  setForm({ ...form, banyoSayisi: e.target.value })
                }
                className="mt-1 block w-full rounded-lg border p-2"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
            <div>
              <label className="text-sm">Mutfak Sayısı</label>
              <input
                value={form.mutfakSayisi}
                onChange={(e) =>
                  setForm({ ...form, mutfakSayisi: e.target.value })
                }
                className="mt-1 block w-full rounded-lg border p-2"
              />
            </div>
            <div>
              <label className="text-sm">Balkon Sayısı</label>
              <input
                value={form.balkonSayisi}
                onChange={(e) =>
                  setForm({ ...form, balkonSayisi: e.target.value })
                }
                className="mt-1 block w-full rounded-lg border p-2"
              />
            </div>
            <div>
              <label className="text-sm">Asansör</label>
              <select
                value={form.asansor}
                onChange={(e) => setForm({ ...form, asansor: e.target.value })}
                className="mt-1 block w-full rounded-lg border p-2"
              >
                <option value="">-- Seçiniz --</option>
                <option>Yok</option>
                <option>Var</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
            <div>
              <label className="text-sm">Otopark</label>
              <select
                value={form.otopark}
                onChange={(e) => setForm({ ...form, otopark: e.target.value })}
                className="mt-1 block w-full rounded-lg border p-2"
              >
                <option value="">-- Seçiniz --</option>
                <option>Var</option>
                <option>Yok</option>
              </select>
            </div>
            {/* Eşya alanı yalnızca Kiralık veya Devren Kiralık seçimlerinde gösterilsin */}
            {form.saleType === "Kiralık" ||
            form.saleType === "Devren Kiralık" ? (
              <div>
                <label className="text-sm">Kiralık ise Eşyalı/Eşyasız *</label>
                <select
                  value={form.esya}
                  onChange={(e) => setForm({ ...form, esya: e.target.value })}
                  className="mt-1 block w-full rounded-lg border p-2"
                >
                  <option value="">-- Seçiniz --</option>
                  <option value="Eşyalı">Eşyalı</option>
                  <option value="Eşyasız">Eşyasız</option>
                </select>
              </div>
            ) : (
              // yer tutucu: düzen bozulmasın diye boş bir div (opsiyonel)
              <div />
            )}
            <div>
              <label className="text-sm">Site İçerisinde mi</label>
              <select
                value={form.siteIci}
                onChange={(e) => setForm({ ...form, siteIci: e.target.value })}
                className="mt-1 block w-full rounded-lg border p-2"
              >
                <option value="">-- Seçiniz --</option>
                <option>Var</option>
                <option>Yok</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
            <div>
              <label className="text-sm">Krediye Uygun</label>
              <select
                value={form.krediUygun}
                onChange={(e) =>
                  setForm({ ...form, krediUygun: e.target.value })
                }
                className="mt-1 block w-full rounded-lg border p-2"
              >
                <option value="">Belirtilmemiş</option>
                <option>Evet</option>
                <option>Hayır</option>
              </select>
            </div>
            <div>
              <label className="text-sm">Cephe</label>
              <input
                value={form.cephe}
                onChange={(e) => setForm({ ...form, cephe: e.target.value })}
                className="mt-1 block w-full rounded-lg border p-2"
              />
            </div>
            <div>
              <label className="text-sm">Açıklama</label>
              <input
                value={form.description}
                onChange={(e) =>
                  setForm({ ...form, description: e.target.value })
                }
                className="mt-1 block w-full rounded-lg border p-2"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            <div>
              <label className="text-sm">Fiyat (TL) *</label>
              <input
                value={form.fiyatTL}
                onChange={(e) => setForm({ ...form, fiyatTL: e.target.value })}
                className="mt-1 block w-full rounded-lg border p-2"
              />
            </div>
            <div>
              <label className="text-sm">Fotoğraf/Video Yükle</label>
              <input
                ref={fileRef}
                onChange={onFileChange}
                type="file"
                accept="image/*,video/*"
                multiple
                className="mt-1 block w-full"
              />
            </div>
          </div>
        </>
      )}

      {form.type === "İş yeri" && (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            <div>
              <label className="text-sm">Takaslı</label>
              <select
                value={form.takas}
                onChange={(e) => setForm({ ...form, takas: e.target.value })}
                className="mt-1 block w-full rounded-lg border p-2"
              >
                <option value="">-- Seçiniz --</option>
                <option>Hayır</option>
                <option>Evet</option>
              </select>
            </div>
            <div>
              <label className="text-sm">m² *</label>
              <input
                value={form.m2Brut}
                onChange={(e) => setForm({ ...form, m2Brut: e.target.value })}
                className="mt-1 block w-full rounded-lg border p-2"
              />
            </div>
          </div>

          <div>
            <label className="text-sm">Açıklama</label>
            <textarea
              value={form.description}
              onChange={(e) =>
                setForm({ ...form, description: e.target.value })
              }
              className="mt-1 block w-full rounded-lg border p-2"
              rows={3}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            <div>
              <label className="text-sm">Fiyat (TL) *</label>
              <input
                value={form.fiyatTL}
                onChange={(e) => setForm({ ...form, fiyatTL: e.target.value })}
                className="mt-1 block w-full rounded-lg border p-2"
              />
            </div>
            <div>
              <label className="text-sm">Fotoğraf/Video Yükle</label>
              <input
                ref={fileRef}
                onChange={onFileChange}
                type="file"
                accept="image/*,video/*"
                multiple
                className="mt-1 block w-full"
              />
            </div>
          </div>
        </>
      )}

      {form.type === "Arsa" && (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            <div>
              <label className="text-sm">
                Kat Karşılığı Satılık / Satılık / Kiralık *
              </label>
              <select
                value={form.saleType}
                onChange={(e) => setForm({ ...form, saleType: e.target.value })}
                className="mt-1 block w-full rounded-lg border p-2"
              >
                <option>Kat Karşılığı Satılık</option>
                <option>Satılık</option>
                <option>Kiralık</option>
              </select>
            </div>
            <div>
              <label className="text-sm">m² *</label>
              <input
                value={form.m2Brut}
                onChange={(e) => setForm({ ...form, m2Brut: e.target.value })}
                className="mt-1 block w-full rounded-lg border p-2"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
            <div>
              <label className="text-sm">Ada No</label>
              <input
                value={form.adaNo}
                onChange={(e) => setForm({ ...form, adaNo: e.target.value })}
                className="mt-1 block w-full rounded-lg border p-2"
              />
            </div>
            <div>
              <label className="text-sm">Parsel No</label>
              <input
                value={form.parselNo}
                onChange={(e) => setForm({ ...form, parselNo: e.target.value })}
                className="mt-1 block w-full rounded-lg border p-2"
              />
            </div>
            <div>
              <label className="text-sm">Kaks (Emsal)</label>
              <input
                value={form.kaks}
                onChange={(e) => setForm({ ...form, kaks: e.target.value })}
                className="mt-1 block w-full rounded-lg border p-2"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
            <div>
              <label className="text-sm">Gabari</label>
              <input
                value={form.gabari}
                onChange={(e) => setForm({ ...form, gabari: e.target.value })}
                className="mt-1 block w-full rounded-lg border p-2"
              />
            </div>
            <div>
              <label className="text-sm">Tapu Durumu</label>
              <select
                value={form.tapuDurumu}
                onChange={(e) =>
                  setForm({ ...form, tapuDurumu: e.target.value })
                }
                className="mt-1 block w-full rounded-lg border p-2"
              >
                <option value="">Belirtilmemiş</option>
                {ARSA_TAPU_DURUMLARI.map((t) => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-sm">Açıklama</label>
              <input
                value={form.description}
                onChange={(e) =>
                  setForm({ ...form, description: e.target.value })
                }
                className="mt-1 block w-full rounded-lg border p-2"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            <div>
              <label className="text-sm">Fiyat (TL) *</label>
              <input
                value={form.fiyatTL}
                onChange={(e) => setForm({ ...form, fiyatTL: e.target.value })}
                className="mt-1 block w-full rounded-lg border p-2"
              />
            </div>
            <div>
              <label className="text-sm">Fotoğraf/Video Yükle</label>
              <input
                ref={fileRef}
                onChange={onFileChange}
                type="file"
                accept="image/*,video/*"
                multiple
                className="mt-1 block w-full"
              />
            </div>
          </div>
        </>
      )}

      {form.type === "Bina" && (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
            <div>
              <label className="text-sm">Kat Sayısı *</label>
              <input
                value={form.binadakiKatSayisi}
                onChange={(e) =>
                  setForm({ ...form, binadakiKatSayisi: e.target.value })
                }
                className="mt-1 block w-full rounded-lg border p-2"
              />
            </div>
            <div>
              <label className="text-sm">Bir Kattaki Daire *</label>
              <input
                value={form.daireSayisiKat}
                onChange={(e) =>
                  setForm({ ...form, daireSayisiKat: e.target.value })
                }
                className="mt-1 block w-full rounded-lg border p-2"
              />
            </div>
            <div>
              <label className="text-sm">m² *</label>
              <input
                value={form.m2Brut}
                onChange={(e) => setForm({ ...form, m2Brut: e.target.value })}
                className="mt-1 block w-full rounded-lg border p-2"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
            <div>
              <label className="text-sm">Bina Yaşı *</label>
              <input
                value={form.binaYasi}
                onChange={(e) => setForm({ ...form, binaYasi: e.target.value })}
                className="mt-1 block w-full rounded-lg border p-2"
              />
            </div>
            <div>
              <label className="text-sm">Isıtma tipi</label>
              <select
                value={form.isitma}
                onChange={(e) => setForm({ ...form, isitma: e.target.value })}
                className="mt-1 block w-full rounded-lg border p-2"
              >
                {ISITMA_TIPLERI.map((s) => (
                  <option key={s}>{s}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-sm">Asansör</label>
              <select
                value={form.asansor}
                onChange={(e) => setForm({ ...form, asansor: e.target.value })}
                className="mt-1 block w-full rounded-lg border p-2"
              >
                <option value="">-- Seçiniz --</option>
                <option>Yok</option>
                <option>Var</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
            <div>
              <label className="text-sm">Otopark</label>
              <select
                value={form.otopark}
                onChange={(e) => setForm({ ...form, otopark: e.target.value })}
                className="mt-1 block w-full rounded-lg border p-2"
              >
                <option value="">-- Seçiniz --</option>
                <option>Var</option>
                <option>Yok</option>
              </select>
            </div>
            <div>
              <label className="text-sm">Açıklama</label>
              <input
                value={form.description}
                onChange={(e) =>
                  setForm({ ...form, description: e.target.value })
                }
                className="mt-1 block w-full rounded-lg border p-2"
              />
            </div>
            <div>
              <label className="text-sm">Fiyat (TL) *</label>
              <input
                value={form.fiyatTL}
                onChange={(e) => setForm({ ...form, fiyatTL: e.target.value })}
                className="mt-1 block w-full rounded-lg border p-2"
              />
            </div>
          </div>

          <div className="mt-2">
            <label className="text-sm">Fotoğraf/Video Yükle</label>
            <input
              ref={fileRef}
              onChange={onFileChange}
              type="file"
              accept="image/*,video/*"
              multiple
              className="mt-1 block w-full"
            />
          </div>
        </>
      )}

      <div className="flex justify-end gap-4 pt-6">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={onCancel}
          type="button"
          className="px-6 py-3 rounded-2xl border border-slate-200 bg-white text-slate-700 font-medium hover:bg-slate-50 transition-colors"
        >
          ❌ İptal
        </motion.button>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          type="submit"
          className="px-6 py-3 rounded-2xl bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white font-medium shadow-lg hover:shadow-xl transition-all"
        >
          💾 Kaydet
        </motion.button>
      </div>
    </form>
  );
}

function PropertyDetail({ property, onClose }) {
  // show all fields, for optional fields display 'Belirtilmemiş' if empty
  const show = (v) => (v || v === 0 ? v : "Belirtilmemiş");
  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between">
        <h3 className="text-2xl font-bold text-slate-800">
          {property.title || `${property.type} — ${property.ilce || "—"}`}
        </h3>
        <div className="text-right">
          <div className="text-2xl font-bold text-emerald-600">
            {property.fiyatTL ? formatTL(property.fiyatTL) : "Belirtilmemiş"}
          </div>
          {property.fiyatUSD && (
            <div className="text-sm text-slate-500">${property.fiyatUSD}</div>
          )}
        </div>
      </div>

      {/* Media Gallery */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {(property.media || []).map((m, i) => (
          <motion.div
            key={i}
            whileHover={{ scale: 1.05 }}
            className="bg-slate-100 rounded-2xl overflow-hidden h-32 flex items-center justify-center"
          >
            {m.type === "image" ? (
              <img
                src={m.src}
                alt={m.name}
                className="object-cover h-full w-full"
              />
            ) : (
              <video
                src={m.src}
                className="object-cover h-full w-full"
                controls
              />
            )}
          </motion.div>
        ))}
        {(!property.media || property.media.length === 0) && (
          <div className="col-span-full text-center py-8 text-slate-500">
            <div className="text-4xl mb-2">📷</div>
            <p>Medya eklenmemiş</p>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <ModernDetailRow label="İl" value={show(property.il)} />
        <ModernDetailRow label="İlçe" value={show(property.ilce)} />
        <ModernDetailRow label="Mahalle" value={show(property.mahalle)} />
        <ModernDetailRow label="Emlak Tipi" value={show(property.type)} />
        {property.type === "Konut" && (
          <>
            <ModernDetailRow
              label="Konut Tipi"
              value={show(property.konutTipi)}
            />
            <ModernDetailRow label="m² (Brüt)" value={show(property.m2Brut)} />
            <ModernDetailRow label="m² (Net)" value={show(property.m2Net)} />
            <ModernDetailRow
              label="Oda Sayısı"
              value={show(property.odaSayisi)}
            />
            <ModernDetailRow
              label="Bina Yaşı"
              value={show(property.binaYasi)}
            />
            <ModernDetailRow
              label="Bulunduğu Kat"
              value={show(property.bulunduKat)}
            />
            <ModernDetailRow
              label="Binadaki Kat Sayısı"
              value={show(property.binadakiKatSayisi)}
            />
            <ModernDetailRow label="Isıtma" value={show(property.isitma)} />
            <ModernDetailRow
              label="Banyo Sayısı"
              value={show(property.banyoSayisi)}
            />
            <ModernDetailRow
              label="Mutfak Sayısı"
              value={show(property.mutfakSayisi)}
            />
            <ModernDetailRow
              label="Balkon Sayısı"
              value={show(property.balkonSayisi)}
            />
            <ModernDetailRow label="Asansör" value={show(property.asansor)} />
            <ModernDetailRow label="Otopark" value={show(property.otopark)} />
            <ModernDetailRow
              label="Site İçinde mi"
              value={show(property.siteIci)}
            />
            <ModernDetailRow
              label="Krediye Uygun"
              value={show(property.krediUygun)}
            />
            <ModernDetailRow label="Cephe" value={show(property.cephe)} />
          </>
        )}
        {property.type === "İş yeri" && (
          <>
            <ModernDetailRow label="Takaslı" value={show(property.takas)} />
            <ModernDetailRow label="m²" value={show(property.m2Brut)} />
          </>
        )}
        {property.type === "Arsa" && (
          <>
            <ModernDetailRow
              label="Kat Karşılığı/Satılık/Kiralık"
              value={show(property.saleType)}
            />
            <ModernDetailRow label="m²" value={show(property.m2Brut)} />
            <ModernDetailRow label="Ada No" value={show(property.adaNo)} />
            <ModernDetailRow
              label="Parsel No"
              value={show(property.parselNo)}
            />
            <ModernDetailRow label="Kaks (Emsal)" value={show(property.kaks)} />
            <ModernDetailRow label="Gabari" value={show(property.gabari)} />
            <ModernDetailRow
              label="Tapu Durumu"
              value={show(property.tapuDurumu)}
            />
          </>
        )}
        {property.type === "Bina" && (
          <>
            <ModernDetailRow
              label="Kat Sayısı"
              value={show(property.binadakiKatSayisi)}
            />
            <ModernDetailRow
              label="Bir Kattaki Daire"
              value={show(property.daireSayisiKat)}
            />
            <ModernDetailRow label="m²" value={show(property.m2Brut)} />
            <ModernDetailRow
              label="Bina Yaşı"
              value={show(property.binaYasi)}
            />
            <ModernDetailRow
              label="Isıtma Tipi"
              value={show(property.isitma)}
            />
            <ModernDetailRow label="Asansör" value={show(property.asansor)} />
            <ModernDetailRow label="Otopark" value={show(property.otopark)} />
          </>
        )}

        <ModernDetailRow label="Açıklama" value={show(property.description)} />
        <ModernDetailRow
          label="Eklenme"
          value={
            property.createdAt
              ? new Date(property.createdAt).toLocaleString()
              : "Belirtilmemiş"
          }
        />
      </div>

      <div className="pt-6 text-right">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={onClose}
          className="px-6 py-3 rounded-2xl border border-slate-200 bg-white text-slate-700 font-medium hover:bg-slate-50 transition-colors"
        >
          ❌ Kapat
        </motion.button>
      </div>
    </div>
  );
}

function ModernDetailRow({ label, value }) {
  return (
    <div className="p-4 bg-slate-50 rounded-2xl">
      <div className="text-xs font-medium text-slate-500 uppercase tracking-wide mb-1">
        {label}
      </div>
      <div className="text-sm font-semibold text-slate-800">{value}</div>
    </div>
  );
}

function ThumbPreview({ media = [] }) {
  if (!media || media.length === 0)
    return (
      <div className="w-24 h-24 bg-slate-200 rounded-2xl flex items-center justify-center text-slate-400">
        📷
      </div>
    );
  const first = media[0];
  return (
    <div className="w-24 h-24 rounded-2xl overflow-hidden flex items-center justify-center bg-slate-100 ring-2 ring-slate-200">
      {first.type === "image" ? (
        <img
          src={first.src}
          alt="thumb"
          className="w-full h-full object-cover"
        />
      ) : (
        <video src={first.src} className="w-full h-full object-cover" />
      )}
    </div>
  );
}

function cryptoRandomId() {
  return Math.random().toString(36).slice(2, 9);
}

function formatTL(v) {
  if (!v) return "";
  try {
    const n = Number(v);
    return n.toLocaleString("tr-TR", { style: "currency", currency: "TRY" });
  } catch (e) {
    return v;
  }
}
