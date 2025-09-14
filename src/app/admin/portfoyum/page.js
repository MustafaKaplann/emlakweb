'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabaseClient';
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
  { name: "Müşteri Ekle", href: "./musteri-ekle" },
  { name: "Müşteri Yönet", href: "./musterilerim" },
  { name: "Portföy Ekle", href: "./portfoy-ekle" },
  { name: "Portföy Yönet", href: "" },
];

const PortfoyListesi = () => {
  const router = useRouter();
  const [ilanlar, setIlanlar] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(12);
  const [isLoading, setIsLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

  const [showNavbar, setShowNavbar] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);


        // Check if mobile on mount and resize
        useEffect(() => {
          const checkMobile = () => {
            setIsMobile(window.innerWidth < 1024);
          };
      
          checkMobile();
          window.addEventListener("resize", checkMobile);
      
          return () => window.removeEventListener("resize", checkMobile);
        }, []);
      
  

  // Auth check & auth state listener
  useEffect(() => {
    let mounted = true

    async function checkAdmin() {
      // setIsLoading(true)
      try {
        const { data: userData, error: userErr } = await supabase.auth.getUser()
        if (userErr) throw userErr
        const user = userData?.user ?? null

        if (!user) {
          if (mounted) {
            setIsAdmin(false)
            setIsLoading(false)
            router.push('/admin')
          }
          return
        }

        const { data: profile, error: pErr } = await supabase
          .from('profiles')
          .select('is_admin')
          .eq('id', user.id)
          .single()

        if (pErr || !profile?.is_admin) {
          await supabase.auth.signOut()
          if (mounted) {
            setIsAdmin(false)
            setIsLoading(false)
            router.push('/admin')
          }
          return
        }

        if (mounted) {
          setIsAdmin(true)
          setIsLoading(false)
        }
      } catch (err) {
        console.error('Admin auth check failed:', err)
        if (mounted) {
          setIsAdmin(false)
          setIsLoading(false)
          router.push('/admin')
        }
      }
    }

    checkAdmin()

    const { data: listener } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_OUT' || !session?.user) {
        router.push('/admin')
      }
      if (event === 'SIGNED_IN') {
        checkAdmin()
      }
    })

    return () => {
      mounted = false
      if (listener) listener.subscription?.unsubscribe?.()
    }
  }, [router])

  // Supabase'den ilanları çekme
  useEffect(() => {
    const fetchIlanlar = async () => {
      if (!isAdmin) return;
      
      
      try {
        let query = supabase
          .from('emlak_ilanlari')
          .select('*')
          .order('olusturma_tarihi', { ascending: false });

        // Arama terimi varsa
        if (searchTerm.trim()) {
          query = query.or(`baslik.ilike.%${searchTerm}%,ilce.ilike.%${searchTerm}%,mahalle.ilike.%${searchTerm}%`);
        }

        // Emlak tipi filtresi varsa
        if (filterType) {
          query = query.eq('emlak_tipi', filterType);
        }

        // Durum filtresi varsa
        if (filterStatus === 'aktif') {
          query = query.eq('aktif', true);
        } else if (filterStatus === 'pasif') {
          query = query.eq('aktif', false);
        } else if (filterStatus === 'vitrin') {
          query = query.eq('vitrin', true);
        }

        const { data, error } = await query;

        if (error) {
          throw error;
        }

        // Veri formatını UI'ya uygun hale getir
        const formattedData = data.map(ilan => ({
          id: ilan.id,
          baslik: ilan.baslik || `${ilan.ilce} ${ilan.mahalle} ${ilan.emlak_tipi}`,
          emlakTipi: ilan.emlak_tipi,
          konutTipi: ilan.konut_tipi,
          satilikKiralik: ilan.satilik_kiralik,
          il: ilan.il,
          ilce: ilan.ilce,
          mahalle: ilan.mahalle,
          fiyat: parseFloat(ilan.fiyat),
          metrekare: ilan.brut_metrekare || ilan.metrekare,
          odaSayisi: ilan.oda_sayisi,
          katSayisi: ilan.kat_sayisi,
          birKattakiDaire: ilan.bir_kattaki_daire,
          tapuDurumu: ilan.tapu_durumu,
          aktif: ilan.aktif,
          vitrin: ilan.vitrin,
          goruntulenmeSayisi: ilan.goruntuleme_sayisi || 0,
          eklemeTarihi: ilan.olusturma_tarihi,
          guncellenmeTarihi: ilan.guncelleme_tarihi
        }));

        setIlanlar(formattedData);
        setCurrentPage(1); // Arama sonrası ilk sayfaya dön
        // setLoading(true);
        console.log(`${formattedData.length} ilan yüklendi`);

      } catch (error) {
        console.error('İlanlar yüklenirken hata:', error);
        alert('İlanlar yüklenirken bir hata oluştu: ' + error.message);
        setIlanlar([]);
      } finally {
        setLoading(false);
      }
    };

    // Debounced search
    const timeoutId = setTimeout(() => {
      fetchIlanlar();
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [searchTerm, filterType, filterStatus, isAdmin]);

  // İlan silme - Supabase ile
  const handleDelete = async (id) => {
    if (!confirm('Bu ilanı silmek istediğinizden emin misiniz?')) {
      return;
    }

    try {
      const { error } = await supabase
        .from('emlak_ilanlari')
        .delete()
        .eq('id', id);

      if (error) {
        throw error;
      }

      // UI'dan da kaldır
      setIlanlar(prev => prev.filter(ilan => ilan.id !== id));
      alert('İlan başarıyla silindi');

    } catch (error) {
      console.error('İlan silinirken hata:', error);
      alert('İlan silinirken bir hata oluştu: ' + error.message);
    }
  };

  // İlan aktiflik durumu değiştirme - Supabase ile
  const toggleAktiflik = async (id) => {
    try {
      const ilan = ilanlar.find(i => i.id === id);
      if (!ilan) return;

      const yeniDurum = !ilan.aktif;

      const { error } = await supabase
        .from('emlak_ilanlari')
        .update({ 
          aktif: yeniDurum,
          guncelleme_tarihi: new Date().toISOString()
        })
        .eq('id', id);

      if (error) {
        throw error;
      }

      // UI'ı güncelle
      setIlanlar(prev => prev.map(ilan => 
        ilan.id === id ? { ...ilan, aktif: yeniDurum } : ilan
      ));

      console.log(`İlan ${yeniDurum ? 'aktif' : 'pasif'} yapıldı`);

    } catch (error) {
      console.error('İlan durumu güncellenirken hata:', error);
      alert('İlan durumu güncellenirken bir hata oluştu: ' + error.message);
    }
  };

  // Vitrin durumu değiştirme - Supabase ile
  const toggleVitrin = async (id) => {
    try {
      const ilan = ilanlar.find(i => i.id === id);
      if (!ilan) return;

      const yeniDurum = !ilan.vitrin;

      const { error } = await supabase
        .from('emlak_ilanlari')
        .update({ 
          vitrin: yeniDurum,
          guncelleme_tarihi: new Date().toISOString()
        })
        .eq('id', id);

      if (error) {
        throw error;
      }

      // UI'ı güncelle
      setIlanlar(prev => prev.map(ilan => 
        ilan.id === id ? { ...ilan, vitrin: yeniDurum } : ilan
      ));

      console.log(`İlan ${yeniDurum ? 'vitrine eklendi' : 'vitrinden çıkarıldı'}`);

    } catch (error) {
      console.error('Vitrin durumu güncellenirken hata:', error);
      alert('Vitrin durumu güncellenirken bir hata oluştu: ' + error.message);
    }
  };

  // Logout
  const handleLogout = async () => {
    try {
      await supabase.auth.signOut()
    } catch (err) {
      console.error('Logout error', err)
    } finally {
      router.push('/admin')
    }
  }
  

  // Fiyat formatı
  const formatFiyat = (fiyat) => {
    return new Intl.NumberFormat('tr-TR', {
      style: 'currency',
      currency: 'TRY',
      minimumFractionDigits: 0
    }).format(fiyat);
  };

  // Tarih formatı
  const formatTarih = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('tr-TR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  // Filtreleri temizle
  const clearFilters = () => {
    setSearchTerm('');
    setFilterType('');
    setFilterStatus('');
  };

  // Filtreleme ve sayfalama
  const filteredIlanlar = ilanlar;
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredIlanlar.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredIlanlar.length / itemsPerPage);

  // Loading states
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Yükleniyor...</p>
        </div>
      </div>
    )
  }
  
  if (!isAdmin) return null;

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Portföy yükleniyor...</p>
        </div>
      </div>
    );
  }

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
                    item.name === "Portföy Yönet" 
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
                    item.name === "Portföy Yönet" 
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
        <div className="max-w-7xl mx-auto">
          {/* Header */}
        <div className="mb-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Portföy Yönetimi</h1>
              <p className="text-gray-600 mt-1">
                Toplam {filteredIlanlar.length} ilan bulundu
              </p>
              <div className="mt-2 flex flex-wrap gap-4 text-sm">
                <span className="text-green-600">
                  ● Aktif İlanlar: {ilanlar.filter(i => i.aktif).length}
                </span>
                <span className="text-red-600">
                  ● Pasif İlanlar: {ilanlar.filter(i => !i.aktif).length}
                </span>
                <span className="text-blue-600">
                  ● Vitrin İlanlar: {ilanlar.filter(i => i.vitrin).length}
                </span>
              </div>
            </div>

            {/* İstatistikler */}
            <div className="hidden md:flex space-x-4">
              <div className="bg-white px-4 py-2 rounded-lg shadow-sm border">
                <div className="text-sm text-gray-500">Bu Ay</div>
                <div className="text-lg font-semibold text-blue-600">
                  {ilanlar.filter(i => {
                    const ilanTarih = new Date(i.eklemeTarihi);
                    const buAy = new Date();
                    return ilanTarih.getMonth() === buAy.getMonth() && 
                           ilanTarih.getFullYear() === buAy.getFullYear();
                  }).length}
                </div>
              </div>
              <div className="bg-white px-4 py-2 rounded-lg shadow-sm border">
                <div className="text-sm text-gray-500">Toplam</div>
                <div className="text-lg font-semibold text-gray-900">
                  {ilanlar.length}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Filtreler ve Arama */}
        <div className="bg-white shadow rounded-lg p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
            {/* Arama */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                İlan Ara
              </label>
              <div className="relative">
                <input
                  type="text"
                  placeholder="Başlık, ilçe veya mahalle ile arayın..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full px-3 py-2 pl-10 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                />
                <svg className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                {loading && (
                  <div className="absolute right-3 top-2.5">
                    <div className="animate-spin h-4 w-4 border-2 border-green-500 border-t-transparent rounded-full"></div>
                  </div>
                )}
              </div>
            </div>

            {/* Emlak Tipi Filtresi */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Emlak Tipi
              </label>
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
              >
                <option value="">Tümü</option>
                <option value="Konut">Konut</option>
                <option value="Arsa">Arsa</option>
                <option value="İş yeri">İş Yeri</option>
                <option value="Bina">Bina</option>
              </select>
            </div>

            {/* Durum Filtresi */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Durum
              </label>
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
              >
                <option value="">Tümü</option>
                <option value="aktif">Aktif</option>
                <option value="pasif">Pasif</option>
                <option value="vitrin">Vitrin</option>
              </select>
            </div>
          </div>

          {/* Aksiyon Butonları */}
          <div className="flex flex-col sm:flex-row gap-3">
            <button
              onClick={() => router.push('/admin/portfoy-ekle')}
              className="bg-orange-500 text-white px-4 py-2 rounded-md hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-orange-500 font-medium transition-colors duration-200 cursor-pointer"
            >
              <svg className="inline-block w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              Yeni İlan Ekle
            </button>
            <button
              onClick={clearFilters}
              className="bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-500 font-medium transition-colors duration-200 cursor-pointer"
              disabled={!searchTerm && !filterType && !filterStatus}
            >
              Filtreleri Temizle
            </button>
            <button
              onClick={handleLogout}
              className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 font-medium transition-colors duration-200 cursor-pointer"
            >
              Çıkış Yap
            </button>
          </div>

          {/* Arama sonucu bilgisi */}
          {(searchTerm || filterType || filterStatus) && (
            <div className="mt-4 p-3 bg-orange-50 rounded-md">
              <p className="text-sm text-orange-700">
                {searchTerm && `"${searchTerm}" araması için`}
                {(searchTerm && (filterType || filterStatus)) && ', '}
                {filterType && `"${filterType}" kategorisinde`}
                {(filterType && filterStatus) && ' ve '}
                {filterStatus && `"${filterStatus}" durumunda`}
                {' '}
                <strong>{filteredIlanlar.length}</strong> sonuç bulundu.
              </p>
            </div>
          )}
        </div>

        {/* İlan Grid */}
        {currentItems.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-lg shadow">
            <svg className="h-12 w-12 text-gray-400 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
            </svg>
            <h3 className="text-lg font-medium text-gray-900 mb-2">İlan bulunamadı</h3>
            <p className="text-gray-500 mb-4">
              {searchTerm || filterType || filterStatus
                ? 'Arama kriterlerinize uygun ilan bulunmuyor.'
                : 'Henüz hiç ilan eklenmemiş.'
              }
            </p>
            <button
              onClick={() => router.push('/admin/portfoy-ekle')}
              className="bg-orange-500 text-white px-4 py-2 rounded-md hover:bg-orange-600 transition-colors duration-200 cursor-pointer"
            >
              {ilanlar.length === 0 ? 'İlk ilanını ekle' : 'Yeni ilan ekle'}
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {currentItems.map((ilan) => (
              <div key={ilan.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
                {/* İlan Resmi Placeholder */}
                <div className="relative">
                  <div className="h-48 bg-gradient-to-br from-gray-300 to-gray-400 flex items-center justify-center">
                    <svg className="h-16 w-16 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                  
                  {/* Durum Rozetleri */}
                  <div className="absolute top-2 left-2 flex flex-col gap-1">
                    {ilan.vitrin && (
                      <span className="bg-blue-500 text-white px-2 py-1 text-xs font-semibold rounded">
                        VİTRİN
                      </span>
                    )}
                    <span className={`px-2 py-1 text-xs font-semibold rounded ${
                      ilan.aktif 
                        ? 'bg-green-500 text-white' 
                        : 'bg-red-500 text-white'
                    }`}>
                      {ilan.aktif ? 'AKTİF' : 'PASİF'}
                    </span>
                  </div>

                  {/* Emlak Tipi */}
                  <div className="absolute top-2 right-2">
                    <span className="bg-black bg-opacity-70 text-white px-2 py-1 text-xs font-semibold rounded">
                      {ilan.emlakTipi}
                    </span>
                  </div>
                </div>

                {/* İlan Bilgileri */}
                <div className="p-4">
                  <div className="mb-2">
                    <h3 className="text-sm font-semibold text-gray-900 line-clamp-2 h-10">
                      {ilan.baslik}
                    </h3>
                  </div>

                  <div className="text-sm text-gray-600 mb-3 space-y-1">
                    <div>📍 {ilan.ilce}, {ilan.mahalle}</div>
                    {ilan.metrekare && <div>📐 {ilan.metrekare} m²</div>}
                    {ilan.odaSayisi && <div>🏠 {ilan.odaSayisi}</div>}
                    {ilan.katSayisi && <div>🏢 {ilan.katSayisi} kat</div>}
                  </div>

                  <div className="mb-3">
                    <div className="text-lg font-bold text-green-600">
                      {formatFiyat(ilan.fiyat)}
                      <span className="text-sm text-gray-500 font-normal">
                        {ilan.satilikKiralik === 'Kiralık' ? '/ay' : ''}
                      </span>
                    </div>
                    <div className="text-xs text-gray-500">
                      {ilan.satilikKiralik}
                    </div>
                  </div>

                  <div className="text-xs text-gray-500 mb-3 flex justify-between">
                    <span>👁 {ilan.goruntulenmeSayisi} gösterim</span>
                    <span>{formatTarih(ilan.eklemeTarihi)}</span>
                  </div>

                  {/* Aksiyon Butonları */}
                  <div className="flex flex-col gap-2">
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        onClick={() => router.push(`/admin/ilan-detay/${ilan.id}`)}
                        className="bg-blue-600 text-white px-3 py-1 rounded text-xs hover:bg-blue-700"
                      >
                        Detay
                      </button>
                      <button
                        onClick={() => router.push(`/admin/ilan-duzenle/${ilan.id}`)}
                        className="bg-green-600 text-white px-3 py-1 rounded text-xs hover:bg-green-700"
                      >
                        Düzenle
                      </button>
                    </div>
                    
                    <div className="grid grid-cols-3 gap-1">
                      <button
                        onClick={() => toggleAktiflik(ilan.id)}
                        className={`px-2 py-1 rounded text-xs font-medium ${
                          ilan.aktif 
                            ? 'bg-orange-100 text-orange-700 hover:bg-orange-200' 
                            : 'bg-green-100 text-green-700 hover:bg-green-200'
                        }`}
                      >
                        {ilan.aktif ? 'Pasif' : 'Aktif'}
                      </button>
                      <button
                        onClick={() => toggleVitrin(ilan.id)}
                        className={`px-2 py-1 rounded text-xs font-medium ${
                          ilan.vitrin 
                            ? 'bg-blue-100 text-blue-700 hover:bg-blue-200' 
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                      >
                        {ilan.vitrin ? 'Vitrin-' : 'Vitrin+'}
                      </button>
                      <button
                        onClick={() => handleDelete(ilan.id)}
                        className="bg-red-100 text-red-700 px-2 py-1 rounded text-xs font-medium hover:bg-red-200"
                      >
                        Sil
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="mt-8 bg-white rounded-lg shadow p-4">
            <div className="flex items-center justify-between">
              <div className="flex justify-between flex-1 sm:hidden">
                <button
                  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                  className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:bg-gray-100 disabled:text-gray-400"
                >
                  Önceki
                </button>
                <button
                  onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages}
                  className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:bg-gray-100 disabled:text-gray-400"
                >
                  Sonraki
                </button>
              </div>
              <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                <div>
                  <p className="text-sm text-gray-700">
                    <span className="font-medium">{indexOfFirstItem + 1}</span>
                    {' - '}
                    <span className="font-medium">{Math.min(indexOfLastItem, filteredIlanlar.length)}</span>
                    {' / '}
                    <span className="font-medium">{filteredIlanlar.length}</span>
                    {' sonuç gösteriliyor'}
                  </p>
                </div>
                <div>
                  <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                  <button
                      onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                      disabled={currentPage === 1}
                      className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:bg-gray-100 disabled:text-gray-400"
                    >
                      Önceki
                    </button>
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                      <button
                        key={page}
                        onClick={() => setCurrentPage(page)}
                        className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                          currentPage === page
                            ? 'z-10 bg-orange-50 border-orange-500 text-orange-600'
                            : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                        }`}
                      >
                        {page}
                      </button>
                    ))}
                    <button
                      onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                      disabled={currentPage === totalPages}
                      className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:bg-gray-100 disabled:text-gray-400"
                    >
                      Sonraki
                    </button>
                  </nav>
                </div>
              </div>
            </div>
          </div>
        )}
        </div>
      </div>
    </div>
  );
};

export default PortfoyListesi;