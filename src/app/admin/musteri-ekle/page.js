"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";
import Link from "next/link";
import { Dialog, DialogPanel } from "@headlessui/react";
import {
  Bars3Icon,
  XMarkIcon,
  ShieldCheckIcon,
  XCircleIcon,
  HomeModernIcon,
} from "@heroicons/react/24/outline";

const navigation = [
  { name: "Ana Sayfa", href: "/" },
  { name: "Müşteri Ekle", href: "" },
  { name: "Müşteri Yönet", href: "./musterilerim" },
  { name: "Portföy Ekle", href: "./portfoy-ekle" },
  { name: "Portföy Yönet", href: "./portfoyum" },
];

const MusteriEkle = () => {
  // Check if mobile on mount and resize
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);

    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const router = useRouter();
  const [formData, setFormData] = useState({
    musteriAdi: "",
    telefonNumarasi: "",
    emlakTipi: "",
    satilikKiralik: "",
    musteriNotlari: "",
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [showNavbar, setShowNavbar] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // Form validasyonu
  const validateForm = () => {
    const newErrors = {};

    if (!formData.musteriAdi.trim()) {
      newErrors.musteriAdi = "Müşteri adı zorunludur";
    }

    if (!formData.telefonNumarasi.trim()) {
      newErrors.telefonNumarasi = "Telefon numarası zorunludur";
    } else if (!/^[0-9+\-\s()]+$/.test(formData.telefonNumarasi)) {
      newErrors.telefonNumarasi = "Geçerli bir telefon numarası giriniz";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
    } catch (err) {
      console.error("Logout error", err);
    } finally {
      router.push("/admin");
    }
  };

  // Form değişiklik handler'ı
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Hata varsa temizle
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      // Supabase'e müşteri ekleme
      const { data, error } = await supabase
        .from("musteriler")
        .insert([
          {
            musteri_adi: formData.musteriAdi,
            telefon_numarasi: formData.telefonNumarasi,
            emlak_tipi: formData.emlakTipi || null,
            satilik_kiralik: formData.satilikKiralik || null,
            musteri_notlari: formData.musteriNotlari || null,
            aktif: true,
          },
        ])
        .select();

      if (error) {
        throw error;
      }

      console.log("Müşteri başarıyla eklendi:", data);
      alert("Müşteri başarıyla eklendi!");

      // Formu temizle
      setFormData({
        musteriAdi: "",
        telefonNumarasi: "",
        emlakTipi: "",
        satilikKiralik: "",
        musteriNotlari: "",
      });

      // Müşteri listesine yönlendir
      setTimeout(() => {
        router.push("/admin/musterilerim");
      }, 1500);
    } catch (error) {
      console.error("Müşteri ekleme hatası:", error);

      let errorMessage = "Müşteri eklenirken bir hata oluştu!";

      if (error.message?.includes("unique_telefon")) {
        errorMessage = "Bu telefon numarası zaten kayıtlı!";
      } else if (error.message) {
        errorMessage = error.message;
      }

      alert(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  // DİĞER TÜM KODLAR AYNI KALIYOR...
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Sade Header */}
      <header
        className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${
          showNavbar ? "translate-y-0 opacity-100" : "-translate-y-full opacity-0"
        }`}
      >
        <nav
          aria-label="Global"
          className="bg-white shadow-sm border-b border-gray-200"
        >
          
          <div className="flex items-center justify-between px-4 sm:px-6 lg:px-8 py-4">
            {/* Logo/Brand */}
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-orange-500 rounded-lg flex items-center justify-center">
                <HomeModernIcon className="w-5 h-5 text-white" />
              </div>
              <span className="text-lg font-semibold text-gray-900 hidden sm:block">Admin Panel</span>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center space-x-6">
              {navigation.map((item, index) => (
                <a
                  key={item.name}
                  href={item.href}
                  className={`px-3 py-2 text-sm font-medium transition-colors duration-200 ${
                    item.name === "Müşteri Ekle" 
                      ? "text-orange-600 bg-orange-50 rounded-lg" 
                      : "text-gray-600 hover:text-gray-900"
                  }`}
                >
                  {item.name}
                </a>
              ))}
            </div>

            {/* Desktop Actions */}
            <div className="hidden lg:flex items-center space-x-4">
              <button
                onClick={handleLogout}
                className="inline-flex items-center px-3 py-2 text-sm font-medium text-gray-600 hover:text-red-600 transition-colors duration-200 cursor-pointer"
              >
                <XCircleIcon className="w-4 h-4 mr-2" />
                Çıkış Yap
              </button>
            </div>

            {/* Mobile Menu Button */}
            <div className="flex lg:hidden">
              <button
                type="button"
                onClick={() => setMobileMenuOpen(true)}
                className="inline-flex items-center justify-center p-2 text-gray-600 hover:text-gray-900 transition-colors duration-200"
              >
                <span className="sr-only">Menüyü aç</span>
                <Bars3Icon className="w-6 h-6" />
              </button>
            </div>
          </div>
        </nav>

        {/* Sade Mobile Menu */}
        <Dialog
          open={mobileMenuOpen}
          onClose={setMobileMenuOpen}
          className="lg:hidden"
        >
          <div className="fixed inset-0 z-50 bg-black/50" />
          <DialogPanel className="fixed inset-y-0 right-0 z-50 w-full overflow-y-auto bg-white p-6 sm:max-w-sm border-l border-gray-200 shadow-xl">
            {/* Header */}
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-orange-500 rounded-lg flex items-center justify-center">
                  <HomeModernIcon className="w-5 h-5 text-white" />
                </div>
                <span className="text-lg font-semibold text-gray-900">Admin Panel</span>
              </div>
              <button
                type="button"
                onClick={() => setMobileMenuOpen(false)}
                className="p-2 text-gray-600 hover:text-gray-900 transition-colors duration-200"
              >
                <span className="sr-only">Menüyü kapat</span>
                <XMarkIcon className="w-6 h-6" />
              </button>
            </div>

            {/* Navigation */}
            <div className="space-y-1">
              {navigation.map((item) => (
                <a
                  onClick={() => setMobileMenuOpen(false)}
                  key={item.name}
                  href={item.href}
                  className={`flex items-center px-3 py-3 text-base font-medium rounded-lg transition-colors duration-200 ${
                    item.name === "Müşteri Ekle" 
                      ? "text-orange-600 bg-orange-50" 
                      : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                  }`}
                >
                  {item.name}
                </a>
              ))}
            </div>

            {/* Logout Button */}
            <div className="mt-8 pt-6 border-t border-gray-200">
              <button
                onClick={handleLogout}
                className="w-full flex items-center justify-center px-4 py-3 text-base font-medium text-gray-600 hover:text-red-600 transition-colors duration-200"
              >
                <XCircleIcon className="w-5 h-5 mr-2" />
                Çıkış Yap
              </button>
            </div>
          </DialogPanel>
        </Dialog>
      </header>
      
      {/* Main Content */}
      <div className="pt-20 pb-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl mx-auto">
          {/* Sade Card */}
          <div className="bg-white shadow-lg rounded-lg overflow-hidden border border-gray-200">
            {/* Sade Header */}
            <div className="bg-orange-500 px-6 py-6">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
                  <ShieldCheckIcon className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className="text-xl font-semibold text-white">
                    Yeni Müşteri Ekle
                  </h1>
                  <p className="text-orange-100 text-sm mt-1">
                    Müşteri bilgilerini eksiksiz doldurunuz
                  </p>
                </div>
              </div>
            </div>

            {/* Sade Form */}
            <form onSubmit={handleSubmit} className="p-6 space-y-6">
              {/* Müşteri Adı */}
              <div>
                <label
                  htmlFor="musteriAdi"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Müşteri Adı <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="musteriAdi"
                  name="musteriAdi"
                  value={formData.musteriAdi}
                  onChange={handleChange}
                  className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors duration-200 ${
                    errors.musteriAdi ? "border-red-500" : "border-gray-300"
                  }`}
                  placeholder="Müşterinin adını ve soyadını giriniz"
                />
                {errors.musteriAdi && (
                  <p className="mt-1 text-sm text-red-600">{errors.musteriAdi}</p>
                )}
              </div>

              {/* Telefon Numarası */}
              <div>
                <label
                  htmlFor="telefonNumarasi"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Telefon Numarası <span className="text-red-500">*</span>
                </label>
                <input
                  type="tel"
                  id="telefonNumarasi"
                  name="telefonNumarasi"
                  value={formData.telefonNumarasi}
                  onChange={handleChange}
                  className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors duration-200 ${
                    errors.telefonNumarasi ? "border-red-500" : "border-gray-300"
                  }`}
                  placeholder="0532 XXX XX XX"
                />
                {errors.telefonNumarasi && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.telefonNumarasi}
                  </p>
                )}
              </div>

              {/* Emlak Tipi */}
              <div>
                <label
                  htmlFor="emlakTipi"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  İstenen Emlak Tipi
                </label>
                <select
                  id="emlakTipi"
                  name="emlakTipi"
                  value={formData.emlakTipi}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors duration-200"
                >
                  <option value="">-- Seçiniz --</option>
                  <option value="Konut">Konut</option>
                  <option value="Arsa">Arsa</option>
                  <option value="İş yeri">İş Yeri</option>
                  <option value="Bina">Bina</option>
                </select>
              </div>

              {/* Satılık/Kiralık */}
              <div>
                <label
                  htmlFor="satilikKiralik"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Satılık/Kiralık Tercihi
                </label>
                <select
                  id="satilikKiralik"
                  name="satilikKiralik"
                  value={formData.satilikKiralik}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors duration-200"
                >
                  <option value="">-- Seçiniz --</option>
                  <option value="Satılık">Satılık</option>
                  <option value="Kiralık">Kiralık</option>
                  <option value="Devren Satılık">Devren Satılık</option>
                  <option value="Devren Kiralık">Devren Kiralık</option>
                </select>
              </div>

              {/* Müşteri Hakkında Notlar */}
              <div>
                <label
                  htmlFor="musteriNotlari"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Müşteri Hakkında Notlar
                </label>
                <textarea
                  id="musteriNotlari"
                  name="musteriNotlari"
                  value={formData.musteriNotlari}
                  onChange={handleChange}
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors duration-200"
                  placeholder="Müşterinin özel istekleri, bütçesi, tercihleri vb. bilgileri buraya yazabilirsiniz..."
                />
              </div>

              {/* Sade Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 pt-6 border-t">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1 bg-orange-500 text-white py-2 px-4 rounded-md hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed font-medium transition-colors duration-200 cursor-pointer"
                >
                  {isSubmitting ? "Ekleniyor..." : "Müşteri Ekle"}
                </button>
                <button
                  type="button"
                  onClick={() => router.push("/admin")}
                  className="flex-1 bg-gray-500 text-white py-2 px-4 rounded-md hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 font-medium transition-colors duration-200 cursor-pointer"
                >
                  İptal Et
                </button>
              </div>
            </form>
          </div>

          {/* Sade Info Card */}
          <div className="mt-6 bg-orange-50 border border-orange-200 rounded-lg p-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg
                  className="h-5 w-5 text-orange-400"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-orange-800">Bilgi</h3>
                <div className="mt-2 text-sm text-orange-700">
                  <p>
                    • Eklediğiniz müşteri bilgileri Supabase veritabanında güvenle
                    saklanacak.
                  </p>
                  <p>
                    • Sistem müşteri tercihlerini emlak ilanlarıyla otomatik
                    eşleştirecek.
                  </p>
                  <p>
                    • <strong>Müşteri Yönetimi</strong> bölümünden müşteri
                    bilgilerini düzenleyebilirsiniz.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MusteriEkle;
