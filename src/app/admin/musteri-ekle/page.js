'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
// 👇 Bu satırı ekleyin - Supabase import
import { supabase } from '@/lib/supabaseClient';

const MusteriEkle = () => {
  const router = useRouter();
  const [formData, setFormData] = useState({
    musteriAdi: '',
    telefonNumarasi: '',
    emlakTipi: '',
    satilikKiralik: '',
    musteriNotlari: ''
  });
  
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form validasyonu
  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.musteriAdi.trim()) {
      newErrors.musteriAdi = 'Müşteri adı zorunludur';
    }
    
    if (!formData.telefonNumarasi.trim()) {
      newErrors.telefonNumarasi = 'Telefon numarası zorunludur';
    } else if (!/^[0-9+\-\s()]+$/.test(formData.telefonNumarasi)) {
      newErrors.telefonNumarasi = 'Geçerli bir telefon numarası giriniz';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Form değişiklik handler'ı
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Hata varsa temizle
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
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
      .from('musteriler')
      .insert([{
        musteri_adi: formData.musteriAdi,
        telefon_numarasi: formData.telefonNumarasi,
        emlak_tipi: formData.emlakTipi || null,
        satilik_kiralik: formData.satilikKiralik || null,
        musteri_notlari: formData.musteriNotlari || null,
        aktif: true
      }])
      .select();
    
    if (error) {
      throw error;
    }
    
    console.log('Müşteri başarıyla eklendi:', data);
    alert('Müşteri başarıyla eklendi!');
    
    // Formu temizle
    setFormData({
      musteriAdi: '',
      telefonNumarasi: '',
      emlakTipi: '',
      satilikKiralik: '',
      musteriNotlari: ''
    });
    
    // Müşteri listesine yönlendir
    setTimeout(() => {
      router.push('/admin/musterilerim');
    }, 1500);
    
  } catch (error) {
    console.error('Müşteri ekleme hatası:', error);
    
    let errorMessage = 'Müşteri eklenirken bir hata oluştu!';
    
    if (error.message?.includes('unique_telefon')) {
      errorMessage = 'Bu telefon numarası zaten kayıtlı!';
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
    <div className="min-h-screen bg-gray-50 py-6 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white shadow-lg rounded-lg overflow-hidden">
          {/* Header */}
          <div className="bg-blue-600 px-6 py-4">
            <h1 className="text-xl font-semibold text-white">
              Yeni Müşteri Ekle
            </h1>
            <p className="text-blue-100 text-sm mt-1">
              Müşteri bilgilerini eksiksiz doldurunuz
            </p>
          </div>

          {/* Form */}
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
                className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                  errors.musteriAdi ? 'border-red-500' : 'border-gray-300'
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
                className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                  errors.telefonNumarasi ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="0532 XXX XX XX"
              />
              {errors.telefonNumarasi && (
                <p className="mt-1 text-sm text-red-600">{errors.telefonNumarasi}</p>
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
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
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
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
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
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Müşterinin özel istekleri, bütçesi, tercihleri vb. bilgileri buraya yazabilirsiniz..."
              />
            </div>

            {/* Submit Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 pt-6 border-t">
              <button
                type="submit"
                disabled={isSubmitting}
                className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed font-medium"
              >
                {isSubmitting ? 'Ekleniyor...' : 'Müşteri Ekle'}
              </button>
              <button
                type="button"
                onClick={() => router.push('/admin')}
                className="flex-1 bg-gray-600 text-white py-2 px-4 rounded-md hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 font-medium"
              >
                İptal Et
              </button>
            </div>
          </form>
        </div>

        {/* Bilgi Kutusu - Güncellendi */}
        <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-blue-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-blue-800">
                Bilgi
              </h3>
              <div className="mt-2 text-sm text-blue-700">
                <p>
                  • Eklediğiniz müşteri bilgileri Supabase veritabanında güvenle saklanacak.
                </p>
                <p>
                  • Sistem müşteri tercihlerini emlak ilanlarıyla otomatik eşleştirecek.
                </p>
                <p>
                  • <strong>Müşteri Yönetimi</strong> bölümünden müşteri bilgilerini düzenleyebilirsiniz.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MusteriEkle