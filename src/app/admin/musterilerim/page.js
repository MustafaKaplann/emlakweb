'use client';

import React, { useEffect, useState, useRef } from "react";
import { useRouter } from 'next/navigation';
import { supabase } from "@/lib/supabaseClient";

const MusteriListesi = () => {
  const router = useRouter();
  const [musteriler, setMusteriler] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [isLoading, setIsLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

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
          // not signed in -> redirect to admin login
          if (mounted) {
            setIsAdmin(false)
            setIsLoading(false)
            router.push('/admin')
          }
          return
        }

        // check profile.is_admin
        const { data: profile, error: pErr } = await supabase
          .from('profiles')
          .select('is_admin')
          .eq('id', user.id)
          .single()

        if (pErr || !profile?.is_admin) {
          // not admin: sign out & redirect
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

    // keep UI in sync with auth state
    const { data: listener } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_OUT' || !session?.user) {
        router.push('/admin')
      }
      if (event === 'SIGNED_IN') {
        // re-check admin status on sign-in
        checkAdmin()
      }
    })

    return () => {
      mounted = false
      if (listener) listener.subscription?.unsubscribe?.()
    }
  }, [router])

  // Supabase'den müşterileri çekme
  useEffect(() => {
    const fetchMusteriler = async () => {
      if (!isAdmin) return;
      
      setLoading(true);
      try {
        let query = supabase
          .from('musteriler')
          .select('*')
          .order('olusturma_tarihi', { ascending: false });

        // Arama terimi varsa
        if (searchTerm.trim()) {
          query = query.or(`musteri_adi.ilike.%${searchTerm}%,telefon_numarasi.ilike.%${searchTerm}%`);
        }

        // Emlak tipi filtresi varsa
        if (filterType) {
          query = query.eq('emlak_tipi', filterType);
        }

        const { data, error } = await query;

        if (error) {
          throw error;
        }

        // Veri formatını UI'ya uygun hale getir
        const formattedData = data.map(musteri => ({
          id: musteri.id,
          musteriAdi: musteri.musteri_adi,
          telefonNumarasi: musteri.telefon_numarasi,
          emlakTipi: musteri.emlak_tipi || '',
          satilikKiralik: musteri.satilik_kiralik || '',
          musteriNotlari: musteri.musteri_notlari || '',
          eklemeTarihi: musteri.olusturma_tarihi,
          aktif: musteri.aktif
        }));

        setMusteriler(formattedData);
        setCurrentPage(1); // Arama sonrası ilk sayfaya dön
        console.log(`${formattedData.length} müşteri yüklendi`);

      } catch (error) {
        console.error('Müşteriler yüklenirken hata:', error);
        alert('Müşteriler yüklenirken bir hata oluştu: ' + error.message);
        setMusteriler([]);
      } finally {
        setLoading(false);
      }
    };

    // Debounced search
    const timeoutId = setTimeout(() => {
      fetchMusteriler();
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [searchTerm, filterType, isAdmin]);

  // Müşteri silme - Supabase ile
  const handleDelete = async (id) => {
    if (!confirm('Bu müşteriyi silmek istediğinizden emin misiniz?')) {
      return;
    }

    try {
      const { error } = await supabase
        .from('musteriler')
        .delete()
        .eq('id', id);

      if (error) {
        throw error;
      }

      // UI'dan da kaldır
      setMusteriler(prev => prev.filter(musteri => musteri.id !== id));
      alert('Müşteri başarıyla silindi');

    } catch (error) {
      console.error('Müşteri silinirken hata:', error);
      alert('Müşteri silinirken bir hata oluştu: ' + error.message);
    }
  };

  // Müşteri aktiflik durumu değiştirme - Supabase ile
  const toggleAktiflik = async (id) => {
    try {
      // Önce mevcut durumu bul
      const musteri = musteriler.find(m => m.id === id);
      if (!musteri) return;

      const yeniDurum = !musteri.aktif;

      const { error } = await supabase
        .from('musteriler')
        .update({ 
          aktif: yeniDurum,
          guncelleme_tarihi: new Date().toISOString()
        })
        .eq('id', id);

      if (error) {
        throw error;
      }

      // UI'ı güncelle
      setMusteriler(prev => prev.map(musteri => 
        musteri.id === id ? { ...musteri, aktif: yeniDurum } : musteri
      ));

      console.log(`Müşteri ${yeniDurum ? 'aktif' : 'pasif'} yapıldı`);

    } catch (error) {
      console.error('Müşteri durumu güncellenirken hata:', error);
      alert('Müşteri durumu güncellenirken bir hata oluştu: ' + error.message);
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

  // Tarih formatı
  const formatTarih = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('tr-TR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Filtreleri temizle
  const clearFilters = () => {
    setSearchTerm('');
    setFilterType('');
  };

  // Sayfalama
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = musteriler.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(musteriler.length / itemsPerPage);

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
          <p className="text-gray-600">Müşteriler yükleniyor...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-6 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Müşteri Yönetimi</h1>
              <p className="text-gray-600 mt-1">
                {loading 
                  ? 'Yükleniyor...' 
                  : `Toplam ${musteriler.length} müşteri bulundu`
                }
              </p>
            </div>
            
            {/* İstatistikler */}
            <div className="hidden md:flex space-x-4">
              <div className="bg-white px-4 py-2 rounded-lg shadow-sm border">
                <div className="text-sm text-gray-500">Aktif</div>
                <div className="text-lg font-semibold text-green-600">
                  {musteriler.filter(m => m.aktif).length}
                </div>
              </div>
              <div className="bg-white px-4 py-2 rounded-lg shadow-sm border">
                <div className="text-sm text-gray-500">Pasif</div>
                <div className="text-lg font-semibold text-red-600">
                  {musteriler.filter(m => !m.aktif).length}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Filtreler ve Arama */}
        <div className="bg-white shadow rounded-lg p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            {/* Arama */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Müşteri Ara
              </label>
              <div className="relative">
                <input
                  type="text"
                  placeholder="İsim veya telefon ile arayın..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full px-3 py-2 pl-10 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
                <svg className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                {loading && (
                  <div className="absolute right-3 top-2.5">
                    <div className="animate-spin h-4 w-4 border-2 border-blue-500 border-t-transparent rounded-full"></div>
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
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">Tümü</option>
                <option value="Konut">Konut</option>
                <option value="Arsa">Arsa</option>
                <option value="İş yeri">İş Yeri</option>
                <option value="Bina">Bina</option>
              </select>
            </div>
          </div>

          {/* Aksiyon Butonları */}
          <div className="flex flex-col sm:flex-row gap-3">
            <button
              onClick={() => router.push('/admin/musteri-ekle')}
              className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium"
            >
              <svg className="inline-block w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              Yeni Müşteri Ekle
            </button>
            <button
              onClick={clearFilters}
              className="bg-gray-600 text-white px-4 py-2 rounded-md hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 font-medium"
              disabled={!searchTerm && !filterType}
            >
              Filtreleri Temizle
            </button>
            <button
              onClick={handleLogout}
              className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 font-medium"
            >
              Çıkış Yap
            </button>
          </div>

          {/* Arama sonucu bilgisi */}
          {(searchTerm || filterType) && (
            <div className="mt-4 p-3 bg-blue-50 rounded-md">
              <p className="text-sm text-blue-700">
                {searchTerm && `"${searchTerm}" araması için`}
                {searchTerm && filterType && ' ve '}
                {filterType && `"${filterType}" kategorisinde`}
                {' '}
                <strong>{musteriler.length}</strong> sonuç bulundu.
              </p>
            </div>
          )}
        </div>

        {/* Müşteri Listesi */}
        <div className="bg-white shadow rounded-lg overflow-hidden">
          {currentItems.length === 0 ? (
            <div className="text-center py-12">
              <svg className="h-12 w-12 text-gray-400 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z" />
              </svg>
              <h3 className="text-lg font-medium text-gray-900 mb-2">Müşteri bulunamadı</h3>
              <p className="text-gray-500 mb-4">
                {searchTerm || filterType 
                  ? 'Arama kriterlerinize uygun müşteri bulunmuyor.'
                  : 'Henüz hiç müşteri eklenmemiş.'
                }
              </p>
              <button
                onClick={() => router.push('/admin/musteri-ekle')}
                className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
              >
                {musteriler.length === 0 ? 'İlk müşterini ekle' : 'Yeni müşteri ekle'}
              </button>
            </div>
          ) : (
            <>
              {/* Desktop Table View */}
              <div className="hidden md:block">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Müşteri Bilgileri
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        İletişim
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Tercihler
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Durum
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        İşlemler
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {currentItems.map((musteri) => (
                      <tr key={musteri.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div>
                            <div className="text-sm font-medium text-gray-900">
                              {musteri.musteriAdi}
                            </div>
                            <div className="text-sm text-gray-500">
                              Ekleme: {formatTarih(musteri.eklemeTarihi)}
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">
                            {musteri.telefonNumarasi}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">
                            {musteri.emlakTipi || 'Belirtilmemiş'}
                          </div>
                          <div className="text-sm text-gray-500">
                            {musteri.satilikKiralik || 'Belirtilmemiş'}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                            musteri.aktif 
                              ? 'bg-green-100 text-green-800' 
                              : 'bg-red-100 text-red-800'
                          }`}>
                            {musteri.aktif ? 'Aktif' : 'Pasif'}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <div className="flex space-x-2">
                            <button
                              onClick={() => router.push(`/admin/musteri-detay/${musteri.id}`)}
                              className="text-blue-600 hover:text-blue-900"
                              title="Detayları Görüntüle"
                            >
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                              </svg>
                            </button>
                            <button
                              onClick={() => router.push(`/admin/musteri-duzenle/${musteri.id}`)}
                              className="text-green-600 hover:text-green-900"
                              title="Düzenle"
                            >
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                              </svg>
                            </button>
                            <button
                              onClick={() => toggleAktiflik(musteri.id)}
                              className={`${musteri.aktif ? 'text-orange-600 hover:text-orange-900' : 'text-green-600 hover:text-green-900'}`}
                              title={musteri.aktif ? 'Pasif Yap' : 'Aktif Yap'}
                            >
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 9l4-4 4 4m0 6l-4 4-4-4" />
                              </svg>
                            </button>
                            <button
                              onClick={() => handleDelete(musteri.id)}
                              className="text-red-600 hover:text-red-900"
                              title="Sil"
                            >
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                              </svg>
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Mobile Card View */}
              <div className="md:hidden">
                <div className="space-y-4 p-4">
                  {currentItems.map((musteri) => (
                    <div key={musteri.id} className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <h3 className="font-medium text-gray-900">{musteri.musteriAdi}</h3>
                          <p className="text-sm text-gray-600">{musteri.telefonNumarasi}</p>
                        </div>
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          musteri.aktif 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {musteri.aktif ? 'Aktif' : 'Pasif'}
                        </span>
                      </div>
                      
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-gray-600">Emlak Tipi:</span>
                          <span className="text-gray-900">{musteri.emlakTipi || 'Belirtilmemiş'}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Tercih:</span>
                          <span className="text-gray-900">{musteri.satilikKiralik || 'Belirtilmemiş'}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Eklenme:</span>
                          <span className="text-gray-900">{formatTarih(musteri.eklemeTarihi)}</span>
                        </div>
                      </div>

                      {musteri.musteriNotlari && (
                        <div className="mt-3 p-2 bg-gray-50 rounded text-sm text-gray-700">
                          <strong>Notlar:</strong> {musteri.musteriNotlari}
                        </div>
                      )}

                      <div className="flex justify-between items-center mt-4 pt-3 border-t border-gray-200">
                        <div className="flex space-x-3">
                          <button
                            onClick={() => router.push(`/admin/musteri-detay/${musteri.id}`)}
                            className="text-blue-600 text-sm font-medium"
                          >
                            Detay
                          </button>
                          <button
                            onClick={() => router.push(`/admin/musteri-duzenle/${musteri.id}`)}
                            className="text-green-600 text-sm font-medium"
                          >
                            Düzenle
                          </button>
                        </div>
                        <div className="flex space-x-3">
                          <button
                            onClick={() => toggleAktiflik(musteri.id)}
                            className={`text-sm font-medium ${musteri.aktif ? 'text-orange-600' : 'text-green-600'}`}
                          >
                            {musteri.aktif ? 'Pasif Yap' : 'Aktif Yap'}
                          </button>
                          <button
                            onClick={() => handleDelete(musteri.id)}
                            className="text-red-600 text-sm font-medium"
                          >
                            Sil
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="bg-gray-50 px-4 py-3 border-t border-gray-200 sm:px-6">
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
                          <span className="font-medium">{Math.min(indexOfLastItem, musteriler.length)}</span>
                          {' / '}
                          <span className="font-medium">{musteriler.length}</span>
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
                                  ? 'z-10 bg-blue-50 border-blue-500 text-blue-600'
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
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default MusteriListesi;