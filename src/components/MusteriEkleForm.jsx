'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { customerService } from '@/lib/supabase';

const MusteriEkleForm = () => {
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
  const [submitStatus, setSubmitStatus] = useState({ type: '', message: '' });

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
    
    // Durum mesajını temizle
    if (submitStatus.message) {
      setSubmitStatus({ type: '', message: '' });
    }
  };

  // Form gönderme
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setIsSubmitting(true);
    setSubmitStatus({ type: '', message: '' });
    
    try {
      // Supabase'e müşteri ekle
      const result = await customerService.addCustomer(formData);
      
      console.log('Müşteri başarıyla eklendi:', result);
      
      setSubmitStatus({
        type: 'success',
        message: 'Müşteri başarıyla eklendi!'
      });
      
      // Formu temizle
      setFormData({
        musteriAdi: '',
        telefonNumarasi: '',
        emlakTipi: '',
        satilikKiralik: '',
        musteriNotlari: ''
      });
      
      // 2 saniye sonra müşteri listesine yönlendir
      setTimeout(() => {
        router.push('/admin/musterilerim');
      }, 2000);
      
    } catch (error) {
      console.error('Müşteri ekleme hatası:', error);
      
      let errorMessage = 'Müşteri eklenirken bir hata oluştu!';
      
      // Supabase hata mesajlarını kontrol et
      if (error.message?.includes('unique_telefon')) {
        errorMessage = 'Bu telefon numarası zaten kayıtlı!';
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      setSubmitStatus({
        type: 'error',
        message: errorMessage
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Telefon numarası formatlama
  const formatPhoneNumber = (value) => {
    // Sadece sayıları al
    const numbers = value.replace(/[^\d]/g, '');
    
    // Türk telefon numarası formatına getir
    if (numbers.length <= 11) {
      return numbers.replace(/(\d{4})(\d{3})(\d{2})(\d{2})/, '$1 $2 $3 $4');
    }
    return value;
  };

  const handlePhoneChange = (e) => {
    const formatted = formatPhoneNumber(e.target.value);
    handleChange({
      target: {
        name: 'telefonNumarasi',
        value: formatted
      }
    });
  };

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

          {/* Status Messages */}
          {submitStatus.message && (
            <div className={`px-6 py-4 border-l-4 ${
              submitStatus.type === 'success' 
                ? 'bg-green-50 border-green-400' 
                : 'bg-red-50 border-red-400'
            }`}>
              <div className="flex">
                <div className="flex-shrink-0">
                  {submitStatus.type === 'success' ? (
                    <svg className="h-5 w-5 text-green-400" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                  ) : (
                    <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                    </svg>
                  )}
                </div>
                <div className="ml-3">
                  <p className={`text-sm ${
                    submitStatus.type === 'success' ? 'text-green-700' : 'text-red-700'
                  }`}>
                    {submitStatus.message}
                  </p>
                </div>
              </div>
            </div>
          )}

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
                className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                  errors.musteriAdi ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Müşterinin adını ve soyadını giriniz"
                disabled={isSubmitting}
              />
              {errors.musteriAdi && (
                <p className="mt-1 text-sm text-red-600 flex items-center">
                  <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 000 2v4a1 1 0 002 0V7a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                  {errors.musteriAdi}
                </p>
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
                onChange={handlePhoneChange}
                className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                  errors.telefonNumarasi ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="0532 XXX XX XX"
                maxLength="14"
                disabled={isSubmitting}
              />
              {errors.telefonNumarasi && (
                <p className="mt-1 text-sm text-red-600 flex items-center">
                  <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 000 2v4a1 1 0 002 0V7a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
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
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                disabled={isSubmitting}
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
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                disabled={isSubmitting}
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
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors resize-vertical"
                placeholder="Müşterinin özel istekleri, bütçesi, tercihleri vb. bilgileri buraya yazabilirsiniz..."
                disabled={isSubmitting}
              />
              <p className="mt-1 text-sm text-gray-500">
                {formData.musteriNotlari.length}/500 karakter
              </p>
            </div>

            {/* Submit Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 pt-6 border-t border-gray-200">
              <button
                type="submit"
                disabled={isSubmitting}
                className="flex-1 bg-blue-600 text-white py-3 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed font-medium transition-colors flex items-center justify-center"
              >
                {isSubmitting ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="m4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    Ekleniyor...
                  </>
                ) : (
                  <>
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                    Müşteri Ekle
                  </>
                )}
              </button>
              <button
                type="button"
                onClick={() => router.push('/admin')}
                disabled={isSubmitting}
                className="flex-1 bg-gray-600 text-white py-3 px-4 rounded-md hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 font-medium transition-colors disabled:opacity-50"
              >
                İptal Et
              </button>
            </div>
          </form>
        </div>

        {/* Bilgi Kutusu */}
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
              <div className="mt-2 text-sm text-blue-700 space-y-1">
                <p>• Eklediğiniz müşteri bilgileri Supabase veritabanında güvenle saklanacaktır.</p>
                <p>• Sistem, müşteri tercihlerini emlak ilanlarıyla otomatik olarak eşleştirecektir.</p>
                <p>• Daha sonra <strong>Müşteri Yönetimi</strong> bölümünden müşteri bilgilerini düzenleyebilirsiniz.</p>
                <p>• Telefon numaraları benzersiz olmalıdır.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Keyboard Shortcuts Info */}
        <div className="mt-4 text-center">
          <p className="text-xs text-gray-500">
            💡 İpucu: <kbd className="px-2 py-1 bg-gray-100 rounded text-xs">Ctrl + Enter</kbd> ile hızlıca kaydet
          </p>
        </div>
      </div>
    </div>
  );
};

// Keyboard shortcut için effect ekleyelim
import { useEffect } from 'react';

const MusteriEkleFormWithShortcuts = () => {
  const [formData, setFormData] = useState({
    musteriAdi: '',
    telefonNumarasi: '',
    emlakTipi: '',
    satilikKiralik: '',
    musteriNotlari: ''
  });

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e) => {
      // Ctrl + Enter ile form gönder
      if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
        e.preventDefault();
        document.getElementById('submit-button')?.click();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

  return <MusteriEkleForm />;
};

export default MusteriEkleForm;