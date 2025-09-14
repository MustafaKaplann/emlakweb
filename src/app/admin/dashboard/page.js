'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabaseClient';

const AdminDashboard = () => {
  const router = useRouter();
  const [stats, setStats] = useState({
    totalCustomers: 0,
    activeCustomers: 0,
    totalProperties: 0,
    activeProperties: 0,
    vitrinProperties: 0,
    monthlyCustomers: 0,
    monthlyProperties: 0
  });
  const [recentCustomers, setRecentCustomers] = useState([]);
  const [recentProperties, setRecentProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

  // Auth check
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

  // Dashboard verilerini çek
  useEffect(() => {
    const fetchDashboardData = async () => {
      if (!isAdmin) return;

      setLoading(true);
      try {
        // İstatistikler için paralel sorgular
        const [
          { data: customers, error: customerError },
          { data: properties, error: propertyError }
        ] = await Promise.all([
          supabase.from('musteriler').select('*'),
          supabase.from('emlak_ilanlari').select('*')
        ]);

        if (customerError) throw customerError;
        if (propertyError) throw propertyError;

        // Bu ay için tarih hesaplama
        const thisMonth = new Date();
        const firstDayOfMonth = new Date(thisMonth.getFullYear(), thisMonth.getMonth(), 1);

        // İstatistikleri hesapla
        const totalCustomers = customers?.length || 0;
        const activeCustomers = customers?.filter(c => c.aktif).length || 0;
        const monthlyCustomers = customers?.filter(c => 
          new Date(c.olusturma_tarihi) >= firstDayOfMonth
        ).length || 0;

        const totalProperties = properties?.length || 0;
        const activeProperties = properties?.filter(p => p.aktif).length || 0;
        const vitrinProperties = properties?.filter(p => p.vitrin).length || 0;
        const monthlyProperties = properties?.filter(p => 
          new Date(p.olusturma_tarihi) >= firstDayOfMonth
        ).length || 0;

        setStats({
          totalCustomers,
          activeCustomers,
          totalProperties,
          activeProperties,
          vitrinProperties,
          monthlyCustomers,
          monthlyProperties
        });

        // Son eklenen müşteriler (5 tanesi)
        const sortedCustomers = customers
          ?.sort((a, b) => new Date(b.olusturma_tarihi) - new Date(a.olusturma_tarihi))
          ?.slice(0, 5)
          ?.map(customer => ({
            id: customer.id,
            name: customer.musteri_adi,
            phone: customer.telefon_numarasi,
            type: customer.emlak_tipi,
            preference: customer.satilik_kiralik,
            date: customer.olusturma_tarihi,
            active: customer.aktif
          })) || [];

        setRecentCustomers(sortedCustomers);

        // Son eklenen ilanlar (5 tanesi)
        const sortedProperties = properties
          ?.sort((a, b) => new Date(b.olusturma_tarihi) - new Date(a.olusturma_tarihi))
          ?.slice(0, 5)
          ?.map(property => ({
            id: property.id,
            title: property.baslik || `${property.ilce} ${property.mahalle} ${property.emlak_tipi}`,
            type: property.emlak_tipi,
            location: `${property.ilce}, ${property.mahalle}`,
            price: parseFloat(property.fiyat),
            status: property.satilik_kiralik,
            date: property.olusturma_tarihi,
            active: property.aktif,
            vitrin: property.vitrin
          })) || [];

        setRecentProperties(sortedProperties);

      } catch (error) {
        console.error('Dashboard verileri yüklenirken hata:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [isAdmin]);

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

  // Tarih formatı
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 1) return 'Bugün';
    if (diffDays === 2) return 'Dün';
    if (diffDays < 7) return `${diffDays} gün önce`;
    
    return date.toLocaleDateString('tr-TR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  // Fiyat formatı
  const formatPrice = (price) => {
    return new Intl.NumberFormat('tr-TR', {
      style: 'currency',
      currency: 'TRY',
      minimumFractionDigits: 0
    }).format(price);
  };

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
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Dashboard yükleniyor...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-10">
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-8">
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
              <div className="space-y-2">
                <div className="flex items-center space-x-3">
                  <div>
                    <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                      Admin Panel
                    </h1>
                    <p className="text-gray-600 text-lg">Emlak yönetim sisteminize hoş geldiniz</p>
                  </div>
                </div>
              </div>
              <div className="flex flex-wrap gap-3">
                <button
                  onClick={() => router.push('/admin/musteri-ekle')}
                  className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-6 py-3 rounded-xl hover:from-blue-700 hover:to-blue-800 font-medium shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200 flex items-center space-x-2"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                  <span>Müşteri Ekle</span>
                </button>
                <button
                  onClick={() => router.push('/admin/portfoy-ekle')}
                  className="bg-gradient-to-r from-green-600 to-green-700 text-white px-6 py-3 rounded-xl hover:from-green-700 hover:to-green-800 font-medium shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200 flex items-center space-x-2"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                  </svg>
                  <span>İlan Ekle</span>
                </button>
                <button
                  onClick={handleLogout}
                  className="bg-gradient-to-r from-red-600 to-red-700 text-white px-6 py-3 rounded-xl hover:from-red-700 hover:to-red-800 font-medium shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200 flex items-center space-x-2"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                  </svg>
                  <span>Çıkış</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* İstatistik Kartları */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          {/* Toplam Müşteri */}
          <div className="group bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg hover:shadow-xl border border-white/20 p-6 transition-all duration-300 hover:-translate-y-1">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                  <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z" />
                  </svg>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600 mb-1">Toplam Müşteri</p>
                  <p className="text-3xl font-bold text-gray-900">{stats.totalCustomers}</p>
                </div>
              </div>
            </div>
            <div className="mt-4 flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span className="text-sm text-green-600 font-semibold">+{stats.monthlyCustomers}</span>
                <span className="text-sm text-gray-500">bu ay</span>
              </div>
              <div className="text-xs text-gray-400 bg-gray-100 px-2 py-1 rounded-full">
                Müşteri
              </div>
            </div>
          </div>

          {/* Aktif Müşteri */}
          <div className="group bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg hover:shadow-xl border border-white/20 p-6 transition-all duration-300 hover:-translate-y-1">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="w-14 h-14 bg-gradient-to-br from-green-500 to-green-600 rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                  <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600 mb-1">Aktif Müşteri</p>
                  <p className="text-3xl font-bold text-gray-900">{stats.activeCustomers}</p>
                </div>
              </div>
            </div>
            <div className="mt-4 flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                <span className="text-sm text-blue-600 font-semibold">
                  %{stats.totalCustomers > 0 ? Math.round((stats.activeCustomers / stats.totalCustomers) * 100) : 0}
                </span>
                <span className="text-sm text-gray-500">aktif</span>
              </div>
              <div className="text-xs text-gray-400 bg-green-100 px-2 py-1 rounded-full">
                Aktif
              </div>
            </div>
          </div>

          {/* Toplam İlan */}
          <div className="group bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg hover:shadow-xl border border-white/20 p-6 transition-all duration-300 hover:-translate-y-1">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="w-14 h-14 bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                  <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                  </svg>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600 mb-1">Toplam İlan</p>
                  <p className="text-3xl font-bold text-gray-900">{stats.totalProperties}</p>
                </div>
              </div>
            </div>
            <div className="mt-4 flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span className="text-sm text-green-600 font-semibold">+{stats.monthlyProperties}</span>
                <span className="text-sm text-gray-500">bu ay</span>
              </div>
              <div className="text-xs text-gray-400 bg-purple-100 px-2 py-1 rounded-full">
                İlan
              </div>
            </div>
          </div>

          {/* Aktif İlan */}
          <div className="group bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg hover:shadow-xl border border-white/20 p-6 transition-all duration-300 hover:-translate-y-1">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="w-14 h-14 bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                  <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600 mb-1">Aktif İlan</p>
                  <p className="text-3xl font-bold text-gray-900">{stats.activeProperties}</p>
                </div>
              </div>
            </div>
            <div className="mt-4 flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                <span className="text-sm text-blue-600 font-semibold">{stats.vitrinProperties}</span>
                <span className="text-sm text-gray-500">vitrin</span>
              </div>
              <div className="text-xs text-gray-400 bg-orange-100 px-2 py-1 rounded-full">
                Aktif
              </div>
            </div>
          </div>
        </div>

        {/* Alt kısım - Son aktiviteler */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-10">
          {/* Son Müşteriler */}
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 overflow-hidden">
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 border-b border-gray-100">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg">
                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-bold text-gray-900">Son Eklenen Müşteriler</h3>
                </div>
                <button
                  onClick={() => router.push('/admin/musterilerim')}
                  className="text-sm text-blue-600 hover:text-blue-500 cursor-pointer font-medium bg-blue-100 hover:bg-blue-200 px-3 py-1 rounded-lg transition-colors duration-200"
                >
                  Tümünü gör
                </button>
              </div>
            </div>
            <div className="p-6">
              {recentCustomers.length === 0 ? (
                <div className="text-center py-8">
                  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                  </div>
                  <p className="text-gray-500 mb-2">Henüz müşteri eklenmemiş</p>
                  <button
                    onClick={() => router.push('/admin/musteri-ekle')}
                    className="text-blue-600 hover:text-blue-500 font-medium bg-blue-50 hover:bg-blue-100 px-4 py-2 rounded-lg transition-colors duration-200"
                  >
                    İlk müşteriyi ekle
                  </button>
                </div>
              ) : (
                <div className="space-y-3">
                  {recentCustomers.map((customer, index) => (
                    <div key={customer.id} className="group flex items-center justify-between p-4 bg-gray-50 hover:bg-gray-100 rounded-xl border border-gray-100 hover:border-gray-200 transition-all duration-200 hover:shadow-sm">
                      <div className="flex items-center space-x-4">
                        <div className="flex-shrink-0">
                          <div className={`w-12 h-12 rounded-xl flex items-center justify-center shadow-sm ${
                            customer.active ? 'bg-green-100' : 'bg-red-100'
                          }`}>
                            <svg className={`w-6 h-6 ${customer.active ? 'text-green-600' : 'text-red-600'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                            </svg>
                          </div>
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-gray-900">{customer.name}</p>
                          <p className="text-xs text-gray-600">{customer.phone}</p>
                          <div className="flex items-center space-x-2 mt-1">
                            <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full">{customer.type}</span>
                            <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full">{customer.preference}</span>
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-xs text-gray-500 mb-1">
                          {formatDate(customer.date)}
                        </div>
                        <div className={`w-2 h-2 rounded-full ${customer.active ? 'bg-green-500' : 'bg-red-500'}`}></div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Son İlanlar */}
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 overflow-hidden">
            <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-6 border-b border-gray-100">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-green-600 rounded-xl flex items-center justify-center shadow-lg">
                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-bold text-gray-900">Son Eklenen İlanlar</h3>
                </div>
                <button
                  onClick={() => router.push('/admin/portfoyum')}
                  className="text-sm text-green-600 hover:text-green-500 cursor-pointer font-medium bg-green-100 hover:bg-green-200 px-3 py-1 rounded-lg transition-colors duration-200"
                >
                  Tümünü gör
                </button>
              </div>
            </div>
            <div className="p-6">
              {recentProperties.length === 0 ? (
                <div className="text-center py-8">
                  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                  </div>
                  <p className="text-gray-500 mb-2">Henüz ilan eklenmemiş</p>
                  <button
                    onClick={() => router.push('/admin/portfoy-ekle')}
                    className="text-green-600 hover:text-green-500 font-medium bg-green-50 hover:bg-green-100 px-4 py-2 rounded-lg transition-colors duration-200"
                  >
                    İlk ilanı ekle
                  </button>
                </div>
              ) : (
                <div className="space-y-3">
                  {recentProperties.map((property, index) => (
                    <div key={property.id} className="group flex items-center justify-between p-4 bg-gray-50 hover:bg-gray-100 rounded-xl border border-gray-100 hover:border-gray-200 transition-all duration-200 hover:shadow-sm">
                      <div className="flex items-center space-x-4">
                        <div className="flex-shrink-0">
                          <div className={`w-12 h-12 rounded-xl flex items-center justify-center shadow-sm ${
                            property.vitrin ? 'bg-blue-100' : property.active ? 'bg-green-100' : 'bg-red-100'
                          }`}>
                            <svg className={`w-6 h-6 ${
                              property.vitrin ? 'text-blue-600' : property.active ? 'text-green-600' : 'text-red-600'
                            }`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2 2v0" />
                            </svg>
                          </div>
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-gray-900">{property.title}</p>
                          <p className="text-xs text-gray-600">{property.location}</p>
                          <div className="flex items-center space-x-2 mt-1">
                            <span className="text-xs bg-purple-100 text-purple-700 px-2 py-1 rounded-full">{property.type}</span>
                            <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full">{property.status}</span>
                            <span className="text-xs font-semibold text-green-600">{formatPrice(property.price)}</span>
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-xs text-gray-500 mb-1">
                          {formatDate(property.date)}
                        </div>
                        <div className={`w-2 h-2 rounded-full ${
                          property.vitrin ? 'bg-blue-500' : property.active ? 'bg-green-500' : 'bg-red-500'
                        }`}></div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Hızlı Erişim */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 p-8">
          <div className="text-center mb-8">
            <h3 className="text-2xl font-bold text-gray-900 mb-2">Hızlı Erişim</h3>
            <p className="text-gray-600">Sık kullanılan işlemlerinize hızlıca erişin</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <button
              onClick={() => router.push('/admin/musterilerim')}
              className="group p-6 bg-gradient-to-br from-blue-50 to-blue-100 border border-blue-200 rounded-2xl hover:from-blue-100 hover:to-blue-200 hover:border-blue-300 hover:shadow-lg transition-all duration-300 cursor-pointer transform hover:-translate-y-1"
            >
              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg group-hover:scale-110 transition-transform duration-300">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </div>
                <h4 className="text-lg font-semibold text-gray-900 mb-2">Müşteri Yönetimi</h4>
                <p className="text-sm text-gray-600">Müşterilerinizi görüntüleyin ve yönetin</p>
              </div>
            </button>

            <button
              onClick={() => router.push('/admin/portfoyum')}
              className="group p-6 bg-gradient-to-br from-green-50 to-green-100 border border-green-200 rounded-2xl hover:from-green-100 hover:to-green-200 hover:border-green-300 hover:shadow-lg transition-all duration-300 cursor-pointer transform hover:-translate-y-1"
            >
              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-green-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg group-hover:scale-110 transition-transform duration-300">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                  </svg>
                </div>
                <h4 className="text-lg font-semibold text-gray-900 mb-2">Portföy Yönetimi</h4>
                <p className="text-sm text-gray-600">İlanlarınızı görüntüleyin ve yönetin</p>
              </div>
            </button>

            <button
              onClick={() => router.push('/admin/raporlar')}
              className="group p-6 bg-gradient-to-br from-purple-50 to-purple-100 border border-purple-200 rounded-2xl hover:from-purple-100 hover:to-purple-200 hover:border-purple-300 hover:shadow-lg transition-all duration-300 cursor-pointer transform hover:-translate-y-1"
            >
              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg group-hover:scale-110 transition-transform duration-300">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                </div>
                <h4 className="text-lg font-semibold text-gray-900 mb-2">Raporlar</h4>
                <p className="text-sm text-gray-600">Detaylı analiz ve raporlar</p>
              </div>
            </button>

            <button
              onClick={() => router.push('/admin/eslestirmeler')}
              className="group p-6 bg-gradient-to-br from-orange-50 to-orange-100 border border-orange-200 rounded-2xl hover:from-orange-100 hover:to-orange-200 hover:border-orange-300 hover:shadow-lg transition-all duration-300 cursor-pointer transform hover:-translate-y-1"
            >
              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-r from-orange-500 to-orange-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg group-hover:scale-110 transition-transform duration-300">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                  </svg>
                </div>
                <h4 className="text-lg font-semibold text-gray-900 mb-2">Eşleştirmeler</h4>
                <p className="text-sm text-gray-600">Müşteri-ilan eşleştirmeleri</p>
              </div>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;