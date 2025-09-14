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
  { name: "Portföy Ekle", href: "" },
  { name: "Portföy Yönet", href: "./portfoyum" },
];


const EmlakEkle = () => {
  const router = useRouter();
  const [mersinIlceler, setMersinIlceler] = useState([]);
  const [mahalleler, setMahalleler] = useState({});
  const [formData, setFormData] = useState({
    emlakTipi: '',
    il: 'Mersin',
    ilce: '',
    mahalle: '',
    // Ortak alanlar
    aciklama: '',
    fiyat: '',
    // Konut özel alanları
    konutTipi: '',
    satilikKiralik: '',
    brutMetrekare: '',
    netMetrekare: '',
    odaSayisi: '',
    binaYasi: '',
    bulunduguKat: '',
    binadakiKatSayisi: '',
    esyaliEsyasiz: '',
    isitma: '',
    banyoSayisi: '',
    mutfakSayisi: '',
    balkonSayisi: '',
    asansor: '',
    otopark: '',
    siteIcerisinde: '',
    krediyeUygun: '',
    cephe: '',
    // İş yeri özel alanları
    takasli: '',
    metrekare: '',
    // Arsa özel alanları
    adaNo: '',
    parselNo: '',
    kaks: '',
    gabari: '',
    tapuDurumu: '',
    // Bina özel alanları
    katSayisi: '',
    birKattakiDaire: ''
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState([]);

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
      

  // JSON dosyasından ilçe ve mahalle verilerini yükle
  useEffect(() => {
    const fetchLocationData = async () => {
      try {
        const response = await fetch('/data/mersin-locations.json');
        const data = await response.json();
        setMersinIlceler(data.ilceler);
        setMahalleler(data.mahalleler);
      } catch (error) {
        console.error('Konum verileri yüklenirken hata oluştu:', error);
      }
    };

    fetchLocationData();
  }, []);

  // Form validasyonu
  const validateForm = () => {
    const newErrors = {};
    
    // Ortak zorunlu alanlar
    if (!formData.emlakTipi) newErrors.emlakTipi = 'Emlak tipi seçimi zorunludur';
    if (!formData.ilce) newErrors.ilce = 'İlçe seçimi zorunludur';
    if (!formData.mahalle) newErrors.mahalle = 'Mahalle seçimi zorunludur';
    if (!formData.fiyat) newErrors.fiyat = 'Fiyat girilmesi zorunludur';

    // Emlak tipine göre özel validasyonlar
    if (formData.emlakTipi === 'Konut') {
      if (!formData.konutTipi) newErrors.konutTipi = 'Konut tipi seçimi zorunludur';
      if (!formData.satilikKiralik) newErrors.satilikKiralik = 'Satılık/Kiralık seçimi zorunludur';
      if (!formData.brutMetrekare) newErrors.brutMetrekare = 'Brüt metrekare zorunludur';
      if (!formData.netMetrekare) newErrors.netMetrekare = 'Net metrekare zorunludur';
      if (!formData.odaSayisi) newErrors.odaSayisi = 'Oda sayısı zorunludur';
      if (!formData.binaYasi) newErrors.binaYasi = 'Bina yaşı zorunludur';
      if (!formData.bulunduguKat) newErrors.bulunduguKat = 'Bulunduğu kat zorunludur';
      if (!formData.binadakiKatSayisi) newErrors.binadakiKatSayisi = 'Binadaki kat sayısı zorunludur';
      if (formData.satilikKiralik === 'Kiralık' && !formData.esyaliEsyasiz) {
        newErrors.esyaliEsyasiz = 'Kiralık için eşyalı/eşyasız seçimi zorunludur';
      }
    }

    if (formData.emlakTipi === 'İş yeri') {
      if (!formData.satilikKiralik) newErrors.satilikKiralik = 'Satılık/Kiralık seçimi zorunludur';
      if (!formData.metrekare) newErrors.metrekare = 'Metrekare zorunludur';
    }

    if (formData.emlakTipi === 'Arsa') {
      if (!formData.satilikKiralik) newErrors.satilikKiralik = 'Satılık/Kiralık seçimi zorunludur';
      if (!formData.metrekare) newErrors.metrekare = 'Metrekare zorunludur';
    }

    if (formData.emlakTipi === 'Bina') {
      if (!formData.katSayisi) newErrors.katSayisi = 'Kat sayısı zorunludur';
      if (!formData.birKattakiDaire) newErrors.birKattakiDaire = 'Bir kattaki daire sayısı zorunludur';
      if (!formData.metrekare) newErrors.metrekare = 'Metrekare zorunludur';
      if (!formData.binaYasi) newErrors.binaYasi = 'Bina yaşı zorunludur';
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

    // İlçe değiştiğinde mahalle seçimini sıfırla
    if (name === 'ilce') {
      setFormData(prev => ({
        ...prev,
        mahalle: ''
      }));
    }

    // Hata varsa temizle
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };
  const handleLogout = async () => {
    try {
      await supabase.auth.signOut()
    } catch (err) {
      console.error('Logout error', err)
    } finally {
      router.push('/admin')
    }
  }
  // Dosya yükleme handler'ı
  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    setSelectedFiles(prev => [...prev, ...files]);
  };

  // Dosya silme
  const removeFile = (index) => {
    setSelectedFiles(prev => prev.filter((_, i) => i !== index));
  };

// Form gönderme - Bu fonksiyonu mevcut emlak ekleme kodunuzdaki handleSubmit ile değiştirin
const handleSubmit = async (e) => {
  e.preventDefault();
  
  if (!validateForm()) {
    return;
  }
  
  setIsSubmitting(true);
  
  try {
    // Supabase'e gönderilecek temel veri
    const emlakData = {
      emlak_tipi: formData.emlakTipi,
      il: formData.il,
      ilce: formData.ilce,
      mahalle: formData.mahalle,
      satilik_kiralik: formData.satilikKiralik,
      fiyat: parseFloat(formData.fiyat),
      aciklama: formData.aciklama || null,
      aktif: true,
      vitrin: false
    };

    // Emlak tipine göre özel alanları ekle
    if (formData.emlakTipi === 'Konut') {
      Object.assign(emlakData, {
        konut_tipi: formData.konutTipi || null,
        brut_metrekare: formData.brutMetrekare ? parseInt(formData.brutMetrekare) : null,
        net_metrekare: formData.netMetrekare ? parseInt(formData.netMetrekare) : null,
        oda_sayisi: formData.odaSayisi || null,
        bina_yasi: formData.binaYasi ? parseInt(formData.binaYasi) : null,
        bulundugu_kat: formData.bulunduguKat || null,
        binadaki_kat_sayisi: formData.binadakiKatSayisi ? parseInt(formData.binadakiKatSayisi) : null,
        esyali_esyasiz: formData.esyaliEsyasiz || null,
        isitma: formData.isitma || null,
        banyo_sayisi: formData.banyoSayisi ? parseInt(formData.banyoSayisi) : null,
        mutfak_sayisi: formData.mutfakSayisi ? parseInt(formData.mutfakSayisi) : null,
        balkon_sayisi: formData.balkonSayisi ? parseInt(formData.balkonSayisi) : null,
        asansor: formData.asansor || null,
        otopark: formData.otopark || null,
        site_icerisinde: formData.siteIcerisinde || null,
        krediye_uygun: formData.krediyeUygun || null,
        cephe: formData.cephe || null
      });
    }

    if (formData.emlakTipi === 'İş yeri') {
      Object.assign(emlakData, {
        metrekare: formData.metrekare ? parseInt(formData.metrekare) : null,
        takasli: formData.takasli || null
      });
    }

    if (formData.emlakTipi === 'Arsa') {
      Object.assign(emlakData, {
        metrekare: formData.metrekare ? parseInt(formData.metrekare) : null,
        ada_no: formData.adaNo || null,
        parsel_no: formData.parselNo || null,
        kaks: formData.kaks || null,
        gabari: formData.gabari || null,
        tapu_durumu: formData.tapuDurumu || null
      });
    }

    if (formData.emlakTipi === 'Bina') {
      Object.assign(emlakData, {
        kat_sayisi: formData.katSayisi ? parseInt(formData.katSayisi) : null,
        bir_kattaki_daire: formData.birKattakiDaire ? parseInt(formData.birKattakiDaire) : null,
        metrekare: formData.metrekare ? parseInt(formData.metrekare) : null,
        bina_yasi: formData.binaYasi ? parseInt(formData.binaYasi) : null,
        isitma: formData.isitma || null,
        asansor: formData.asansor || null,
        otopark: formData.otopark || null
      });
    }

    console.log('Gönderilecek veri:', emlakData);

    // Supabase'e veri gönder
    const { data, error } = await supabase
      .from('emlak_ilanlari')
      .insert([emlakData])
      .select();

    if (error) {
      throw error;
    }

    console.log('Emlak ilanı başarıyla eklendi:', data);
    alert('Emlak ilanı başarıyla eklendi!');
    
    // Dosya yükleme bilgisi (şimdilik sadece log)
    if (selectedFiles.length > 0 && data && data[0]) {
      console.log(`${selectedFiles.length} dosya seçili. Emlak ID: ${data[0].id}`);
      // TODO: Dosya yükleme işlemi daha sonra implement edilecek
    }
    
    // Formu temizle
    setFormData({
      emlakTipi: '',
      il: 'Mersin',
      ilce: '',
      mahalle: '',
      aciklama: '',
      fiyat: '',
      konutTipi: '',
      satilikKiralik: '',
      brutMetrekare: '',
      netMetrekare: '',
      odaSayisi: '',
      binaYasi: '',
      bulunduguKat: '',
      binadakiKatSayisi: '',
      esyaliEsyasiz: '',
      isitma: '',
      banyoSayisi: '',
      mutfakSayisi: '',
      balkonSayisi: '',
      asansor: '',
      otopark: '',
      siteIcerisinde: '',
      krediye_uygun: '',
      cephe: '',
      takasli: '',
      metrekare: '',
      adaNo: '',
      parselNo: '',
      kaks: '',
      gabari: '',
      tapuDurumu: '',
      katSayisi: '',
      birKattakiDaire: ''
    });
    setSelectedFiles([]);
    
    // Portföy sayfasına yönlendir
    setTimeout(() => {
      router.push('/admin/portfoyum');
    }, 1500);
    
  } catch (error) {
    console.error('Emlak ekleme hatası:', error);
    
    let errorMessage = 'Emlak ilanı eklenirken bir hata oluştu!';
    
    if (error.message?.includes('duplicate')) {
      errorMessage = 'Benzer bir ilan zaten mevcut!';
    } else if (error.message?.includes('foreign key')) {
      errorMessage = 'Veri doğrulama hatası!';
    } else if (error.message) {
      errorMessage = error.message;
    }
    
    alert(errorMessage);
  } finally {
    setIsSubmitting(false);
  }
};
  // Konut formu
  const renderKonutForm = () => (
    <div className="space-y-6">
      {/* Konut Tipi */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Konut Tipi <span className="text-red-500">*</span>
          </label>
          <select
            name="konutTipi"
            value={formData.konutTipi}
            onChange={handleChange}
            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              errors.konutTipi ? 'border-red-500' : 'border-gray-300'
            }`}
          >
            <option value="">-- Seçiniz --</option>
            <option value="Konut">Konut</option>
            <option value="Daire">Daire</option>
            <option value="Rezidans">Rezidans</option>
            <option value="Müstakil Ev">Müstakil Ev</option>
            <option value="Villa">Villa</option>
            <option value="Çiftlik Evi">Çiftlik Evi</option>
            <option value="Köşk & Konak">Köşk & Konak</option>
            <option value="Yalı">Yalı</option>
            <option value="Yazlık">Yazlık</option>
          </select>
          {errors.konutTipi && <p className="text-red-500 text-sm mt-1">{errors.konutTipi}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Satılık/Kiralık <span className="text-red-500">*</span>
          </label>
          <select
            name="satilikKiralik"
            value={formData.satilikKiralik}
            onChange={handleChange}
            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              errors.satilikKiralik ? 'border-red-500' : 'border-gray-300'
            }`}
          >
            <option value="">-- Seçiniz --</option>
            <option value="Satılık">Satılık</option>
            <option value="Kiralık">Kiralık</option>
            <option value="Devren Satılık">Devren Satılık</option>
          </select>
          {errors.satilikKiralik && <p className="text-red-500 text-sm mt-1">{errors.satilikKiralik}</p>}
        </div>
      </div>

      {/* Metrekare Bilgileri */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            m² (Brüt) <span className="text-red-500">*</span>
          </label>
          <input
            type="number"
            name="brutMetrekare"
            value={formData.brutMetrekare}
            onChange={handleChange}
            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              errors.brutMetrekare ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="Brüt metrekare"
          />
          {errors.brutMetrekare && <p className="text-red-500 text-sm mt-1">{errors.brutMetrekare}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            m² (Net) <span className="text-red-500">*</span>
          </label>
          <input
            type="number"
            name="netMetrekare"
            value={formData.netMetrekare}
            onChange={handleChange}
            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              errors.netMetrekare ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="Net metrekare"
          />
          {errors.netMetrekare && <p className="text-red-500 text-sm mt-1">{errors.netMetrekare}</p>}
        </div>
      </div>

      {/* Oda ve Kat Bilgileri */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Oda Sayısı <span className="text-red-500">*</span>
          </label>
          <select
            name="odaSayisi"
            value={formData.odaSayisi}
            onChange={handleChange}
            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              errors.odaSayisi ? 'border-red-500' : 'border-gray-300'
            }`}
          >
            <option value="">-- Seçiniz --</option>
            <option value="1+0">1+0</option>
            <option value="1+1">1+1</option>
            <option value="2+1">2+1</option>
            <option value="3+1">3+1</option>
            <option value="4+1">4+1</option>
            <option value="5+1">5+1</option>
            <option value="6+1">6+1</option>
            <option value="7+1">7+1</option>
            <option value="8+1 ve üzeri">8+1 ve üzeri</option>
          </select>
          {errors.odaSayisi && <p className="text-red-500 text-sm mt-1">{errors.odaSayisi}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Bina Yaşı <span className="text-red-500">*</span>
          </label>
          <input
            type="number"
            name="binaYasi"
            value={formData.binaYasi}
            onChange={handleChange}
            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              errors.binaYasi ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="Bina yaşı"
            min="0"
          />
          {errors.binaYasi && <p className="text-red-500 text-sm mt-1">{errors.binaYasi}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Bulunduğu Kat <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="bulunduguKat"
            value={formData.bulunduguKat}
            onChange={handleChange}
            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              errors.bulunduguKat ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="Örn: 3, Zemin, Çatı"
          />
          {errors.bulunduguKat && <p className="text-red-500 text-sm mt-1">{errors.bulunduguKat}</p>}
        </div>
      </div>

      {/* Ek Bilgiler */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Binadaki Kat Sayısı <span className="text-red-500">*</span>
          </label>
          <input
            type="number"
            name="binadakiKatSayisi"
            value={formData.binadakiKatSayisi}
            onChange={handleChange}
            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              errors.binadakiKatSayisi ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="Binadaki toplam kat sayısı"
            min="1"
          />
          {errors.binadakiKatSayisi && <p className="text-red-500 text-sm mt-1">{errors.binadakiKatSayisi}</p>}
        </div>

        {formData.satilikKiralik === 'Kiralık' && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Eşyalı/Eşyasız <span className="text-red-500">*</span>
            </label>
            <select
              name="esyaliEsyasiz"
              value={formData.esyaliEsyasiz}
              onChange={handleChange}
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.esyaliEsyasiz ? 'border-red-500' : 'border-gray-300'
              }`}
            >
              <option value="">-- Seçiniz --</option>
              <option value="Eşyalı">Eşyalı</option>
              <option value="Eşyasız">Eşyasız</option>
            </select>
            {errors.esyaliEsyasiz && <p className="text-red-500 text-sm mt-1">{errors.esyaliEsyasiz}</p>}
          </div>
        )}
      </div>

      {/* Isıtma ve Diğer Özellikler */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Isıtma</label>
          <select
            name="isitma"
            value={formData.isitma}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">-- Seçiniz --</option>
            <option value="Doğalgaz">Doğalgaz</option>
            <option value="Klima">Klima</option>
            <option value="Merkezi (Pay Ölçer)">Merkezi (Pay Ölçer)</option>
            <option value="Yerden ısıtma">Yerden ısıtma</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Banyo Sayısı</label>
          <input
            type="number"
            name="banyoSayisi"
            value={formData.banyoSayisi}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Banyo sayısı"
            min="1"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Mutfak Sayısı</label>
          <input
            type="number"
            name="mutfakSayisi"
            value={formData.mutfakSayisi}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Mutfak sayısı"
            min="0"
          />
        </div>
      </div>

      {/* Balkon ve Özellikler */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Balkon Sayısı</label>
          <input
            type="number"
            name="balkonSayisi"
            value={formData.balkonSayisi}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Balkon sayısı"
            min="0"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Asansör</label>
          <select
            name="asansor"
            value={formData.asansor}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">-- Seçiniz --</option>
            <option value="Var">Var</option>
            <option value="Yok">Yok</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Otopark</label>
          <select
            name="otopark"
            value={formData.otopark}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">-- Seçiniz --</option>
            <option value="Var">Var</option>
            <option value="Yok">Yok</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Site İçerisinde</label>
          <select
            name="siteIcerisinde"
            value={formData.siteIcerisinde}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">-- Seçiniz --</option>
            <option value="Evet">Evet</option>
            <option value="Hayır">Hayır</option>
          </select>
        </div>
      </div>

      {/* Kredi ve Cephe */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Krediye Uygun</label>
          <select
            name="krediyeUygun"
            value={formData.krediyeUygun}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">-- Seçiniz --</option>
            <option value="Evet">Evet</option>
            <option value="Hayır">Hayır</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Cephe</label>
          <select
            name="cephe"
            value={formData.cephe}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">-- Seçiniz --</option>
            <option value="Kuzey">Kuzey</option>
            <option value="Güney">Güney</option>
            <option value="Doğu">Doğu</option>
            <option value="Batı">Batı</option>
            <option value="Kuzey-Doğu">Kuzey-Doğu</option>
            <option value="Kuzey-Batı">Kuzey-Batı</option>
            <option value="Güney-Doğu">Güney-Doğu</option>
            <option value="Güney-Batı">Güney-Batı</option>
          </select>
        </div>
      </div>
    </div>
  );

  // İş yeri formu
  const renderIsyeriForm = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Satılık/Kiralık <span className="text-red-500">*</span>
          </label>
          <select
            name="satilikKiralik"
            value={formData.satilikKiralik}
            onChange={handleChange}
            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              errors.satilikKiralik ? 'border-red-500' : 'border-gray-300'
            }`}
          >
            <option value="">-- Seçiniz --</option>
            <option value="Satılık">Satılık</option>
            <option value="Kiralık">Kiralık</option>
            <option value="Devren Satılık">Devren Satılık</option>
            <option value="Devren Kiralık">Devren Kiralık</option>
          </select>
          {errors.satilikKiralik && <p className="text-red-500 text-sm mt-1">{errors.satilikKiralik}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Takaslı</label>
          <select
            name="takasli"
            value={formData.takasli}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">-- Seçiniz --</option>
            <option value="Evet">Evet</option>
            <option value="Hayır">Hayır</option>
          </select>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          m² <span className="text-red-500">*</span>
        </label>
        <input
          type="number"
          name="metrekare"
          value={formData.metrekare}
          onChange={handleChange}
          className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
            errors.metrekare ? 'border-red-500' : 'border-gray-300'
          }`}
          placeholder="Metrekare"
        />
        {errors.metrekare && <p className="text-red-500 text-sm mt-1">{errors.metrekare}</p>}
      </div>
    </div>
  );

  // Arsa formu
  const renderArsaForm = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Satılık/Kiralık <span className="text-red-500">*</span>
          </label>
          <select
            name="satilikKiralik"
            value={formData.satilikKiralik}
            onChange={handleChange}
            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              errors.satilikKiralik ? 'border-red-500' : 'border-gray-300'
            }`}
          >
            <option value="">-- Seçiniz --</option>
            <option value="Kat Karşılığı Satılık">Kat Karşılığı Satılık</option>
            <option value="Satılık">Satılık</option>
            <option value="Kiralık">Kiralık</option>
          </select>
          {errors.satilikKiralik && <p className="text-red-500 text-sm mt-1">{errors.satilikKiralik}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            m² <span className="text-red-500">*</span>
          </label>
          <input
            type="number"
            name="metrekare"
            value={formData.metrekare}
            onChange={handleChange}
            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              errors.metrekare ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="Metrekare"
          />
          {errors.metrekare && <p className="text-red-500 text-sm mt-1">{errors.metrekare}</p>}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Ada No</label>
          <input
            type="text"
            name="adaNo"
            value={formData.adaNo}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Ada No"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Parsel No</label>
          <input
            type="text"
            name="parselNo"
            value={formData.parselNo}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Parsel No"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Kaks (Emsal)</label>
          <input
            type="text"
            name="kaks"
            value={formData.kaks}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Kaks"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Gabari</label>
          <input
            type="text"
            name="gabari"
            value={formData.gabari}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Gabari"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Tapu Durumu</label>
        <select
          name="tapuDurumu"
          value={formData.tapuDurumu}
          onChange={handleChange}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">-- Seçiniz --</option>
          <option value="Hisseli Tapu">Hisseli Tapu</option>
          <option value="Müstakil Tapulu">Müstakil Tapulu</option>
          <option value="Tahsis Tapu">Tahsis Tapu</option>
          <option value="Zilliyet Tapu">Zilliyet Tapu</option>
          <option value="Yurt Dışı Tapulu">Yurt Dışı Tapulu</option>
          <option value="Tapu Kaydı Yok">Tapu Kaydı Yok</option>
        </select>
      </div>
    </div>
  );

  // Bina formu
  const renderBinaForm = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Kat Sayısı <span className="text-red-500">*</span>
          </label>
          <input
            type="number"
            name="katSayisi"
            value={formData.katSayisi}
            onChange={handleChange}
            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              errors.katSayisi ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="Kat sayısı"
            min="1"
          />
          {errors.katSayisi && <p className="text-red-500 text-sm mt-1">{errors.katSayisi}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Bir Kattaki Daire <span className="text-red-500">*</span>
          </label>
          <input
            type="number"
            name="birKattakiDaire"
            value={formData.birKattakiDaire}
            onChange={handleChange}
            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              errors.birKattakiDaire ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="Bir kattaki daire sayısı"
            min="1"
          />
          {errors.birKattakiDaire && <p className="text-red-500 text-sm mt-1">{errors.birKattakiDaire}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            m² <span className="text-red-500">*</span>
          </label>
          <input
            type="number"
            name="metrekare"
            value={formData.metrekare}
            onChange={handleChange}
            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              errors.metrekare ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="Toplam metrekare"
          />
          {errors.metrekare && <p className="text-red-500 text-sm mt-1">{errors.metrekare}</p>}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Bina Yaşı <span className="text-red-500">*</span>
          </label>
          <input
            type="number"
            name="binaYasi"
            value={formData.binaYasi}
            onChange={handleChange}
            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              errors.binaYasi ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="Bina yaşı"
            min="0"
          />
          {errors.binaYasi && <p className="text-red-500 text-sm mt-1">{errors.binaYasi}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Isıtma</label>
          <select
            name="isitma"
            value={formData.isitma}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">-- Seçiniz --</option>
            <option value="Doğalgaz">Doğalgaz</option>
            <option value="Klima">Klima</option>
            <option value="Merkezi (Pay Ölçer)">Merkezi (Pay Ölçer)</option>
            <option value="Yerden ısıtma">Yerden ısıtma</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Asansör</label>
          <select
            name="asansor"
            value={formData.asansor}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">-- Seçiniz --</option>
            <option value="Var">Var</option>
            <option value="Yok">Yok</option>
          </select>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Otopark</label>
        <select
          name="otopark"
          value={formData.otopark}
          onChange={handleChange}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">-- Seçiniz --</option>
          <option value="Var">Var</option>
          <option value="Yok">Yok</option>
        </select>
      </div>
    </div>
  );

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
                    item.name === "Portföy Ekle" 
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
                    item.name === "Portföy Ekle" 
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
        <div className="max-w-4xl mx-auto">
          <div className="bg-white shadow-lg rounded-lg overflow-hidden">
          {/* Header */}
          <div className="bg-orange-500 px-6 py-6">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
                <ShieldCheckIcon className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-semibold text-white">
                  Yeni Emlak İlanı Ekle
                </h1>
                <p className="text-orange-100 text-sm mt-1">
                  Emlak bilgilerini detaylı bir şekilde doldurunuz
                </p>
              </div>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="p-6">
            {/* Temel Bilgiler */}
            <div className="space-y-6 border-b pb-6 mb-6">
              <h2 className="text-lg font-medium text-gray-900">Temel Bilgiler</h2>
              
              {/* Emlak Tipi */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Emlak Tipi <span className="text-red-500">*</span>
                </label>
                <select
                  name="emlakTipi"
                  value={formData.emlakTipi}
                  onChange={handleChange}
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors.emlakTipi ? 'border-red-500' : 'border-gray-300'
                  }`}
                >
                  <option value="">-- Seçiniz --</option>
                  <option value="Konut">Konut</option>
                  <option value="Arsa">Arsa</option>
                  <option value="İş yeri">İş Yeri</option>
                  <option value="Bina">Bina</option>
                </select>
                {errors.emlakTipi && <p className="text-red-500 text-sm mt-1">{errors.emlakTipi}</p>}
              </div>

              {/* Konum Bilgileri */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    İl <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="il"
                    value={formData.il}
                    disabled
                    className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-100 text-gray-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    İlçe <span className="text-red-500">*</span>
                  </label>
                  <select
                    name="ilce"
                    value={formData.ilce}
                    onChange={handleChange}
                    className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      errors.ilce ? 'border-red-500' : 'border-gray-300'
                    }`}
                  >
                    <option value="">-- Seçiniz --</option>
                    {mersinIlceler.map(ilce => (
                      <option key={ilce} value={ilce}>{ilce}</option>
                    ))}
                  </select>
                  {errors.ilce && <p className="text-red-500 text-sm mt-1">{errors.ilce}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Mahalle <span className="text-red-500">*</span>
                  </label>
                  <select
                    name="mahalle"
                    value={formData.mahalle}
                    onChange={handleChange}
                    disabled={!formData.ilce}
                    className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      errors.mahalle ? 'border-red-500' : 'border-gray-300'
                    } ${!formData.ilce ? 'bg-gray-100 text-gray-500' : ''}`}
                  >
                    <option value="">-- Seçiniz --</option>
                    {formData.ilce && mahalleler[formData.ilce] && 
                      mahalleler[formData.ilce].map(mahalle => (
                        <option key={mahalle} value={mahalle}>{mahalle}</option>
                      ))
                    }
                  </select>
                  {errors.mahalle && <p className="text-red-500 text-sm mt-1">{errors.mahalle}</p>}
                </div>
              </div>
            </div>

            {/* Emlak Tipine Özel Alanlar */}
            {formData.emlakTipi && (
              <div className="space-y-6 border-b pb-6 mb-6">
                <h2 className="text-lg font-medium text-gray-900">Emlak Detayları</h2>
                
                {formData.emlakTipi === 'Konut' && renderKonutForm()}
                {formData.emlakTipi === 'İş yeri' && renderIsyeriForm()}
                {formData.emlakTipi === 'Arsa' && renderArsaForm()}
                {formData.emlakTipi === 'Bina' && renderBinaForm()}
              </div>
            )}

            {/* Ortak Alanlar */}
            {formData.emlakTipi && (
              <div className="space-y-6 border-b pb-6 mb-6">
                <h2 className="text-lg font-medium text-gray-900">Ek Bilgiler</h2>
                
                {/* Fiyat */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Fiyat (₺) <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    name="fiyat"
                    value={formData.fiyat}
                    onChange={handleChange}
                    className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      errors.fiyat ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="Fiyat giriniz"
                  />
                  {errors.fiyat && <p className="text-red-500 text-sm mt-1">{errors.fiyat}</p>}
                </div>

                {/* Açıklama */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Açıklama
                  </label>
                  <textarea
                    name="aciklama"
                    value={formData.aciklama}
                    onChange={handleChange}
                    rows={4}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Emlak hakkında detaylı bilgi veriniz..."
                  />
                </div>

                {/* Dosya Yükleme */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Fotoğraf/Video Yükleme
                  </label>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-blue-400 transition-colors">
                    <input
                      type="file"
                      multiple
                      accept="image/*,video/*"
                      onChange={handleFileChange}
                      className="hidden"
                      id="file-upload"
                    />
                    <label
                      htmlFor="file-upload"
                      className="cursor-pointer"
                    >
                      <div className="space-y-2">
                        <svg className="h-12 w-12 text-gray-400 mx-auto" stroke="currentColor" fill="none" viewBox="0 0 48 48">
                          <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                        <div className="text-gray-600">
                          <span className="font-medium text-blue-600 hover:text-blue-500">
                            Dosya seç
                          </span>
                          <span> veya sürükleyip bırak</span>
                        </div>
                        <p className="text-sm text-gray-500">
                          PNG, JPG, GIF, MP4 (Max. 10MB)
                        </p>
                      </div>
                    </label>
                  </div>

                  {/* Seçilen Dosyalar */}
                  {selectedFiles.length > 0 && (
                    <div className="mt-4">
                      <h4 className="text-sm font-medium text-gray-700 mb-2">Seçilen Dosyalar:</h4>
                      <div className="space-y-2">
                        {selectedFiles.map((file, index) => (
                          <div key={index} className="flex items-center justify-between bg-gray-50 p-2 rounded">
                            <span className="text-sm text-gray-600 truncate flex-1">
                              {file.name}
                            </span>
                            <button
                              type="button"
                              onClick={() => removeFile(index)}
                              className="ml-2 text-red-500 hover:text-red-700"
                            >
                              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                              </svg>
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Submit Buttons */}
            {formData.emlakTipi && (
              <div className="flex flex-col sm:flex-row gap-4 pt-6">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1 bg-orange-500 text-white py-3 px-4 rounded-md hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed font-medium transition-colors duration-200 cursor-pointer"
                >
                  {isSubmitting ? 'Ekleniyor...' : 'Emlak İlanı Ekle'}
                </button>
                <button
                  type="button"
                  onClick={() => router.push('/admin')}
                  className="flex-1 bg-gray-500 text-white py-3 px-4 rounded-md hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 font-medium transition-colors duration-200 cursor-pointer"
                >
                  İptal Et
                </button>
              </div>
            )}
          </form>
        </div>

        {/* Bilgi Kutusu */}
        <div className="mt-6 bg-orange-50 border border-orange-200 rounded-lg p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-orange-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-orange-800">
                Önemli Bilgiler
              </h3>
              <div className="mt-2 text-sm text-orange-700 space-y-1">
                <p>• Yıldız (*) işareti bulunan alanlar zorunludur.</p>
                <p>• Boş bırakılan opsiyonel alanlar "Belirtilmemiş" olarak görüntülenecektir.</p>
                <p>• Eklenen ilanlar müşteri tercihleri ile otomatik eşleştirilecektir.</p>
                <p>• Dosya yükleme işlemi sonradan da yapılabilir.</p>
              </div>
            </div>
          </div>
        </div>
        </div>
      </div>
    </div>
  );
};

export default EmlakEkle;