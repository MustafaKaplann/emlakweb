
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase env vars. Check .env.local');
}


export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Müşteri CRUD işlemleri
export const customerService = {
  // Tüm müşterileri getir
  async getAllCustomers() {
    const { data, error } = await supabase
      .from('musteriler')
      .select('*')
      .order('olusturma_tarihi', { ascending: false })
    
    if (error) throw error
    return data
  },

  // Müşteri ekle
  async addCustomer(customerData) {
    const { data, error } = await supabase
      .from('musteriler')
      .insert([{
        musteri_adi: customerData.musteriAdi,
        telefon_numarasi: customerData.telefonNumarasi,
        emlak_tipi: customerData.emlakTipi,
        satilik_kiralik: customerData.satilikKiralik,
        musteri_notlari: customerData.musteriNotlari,
        aktif: true
      }])
      .select()
    
    if (error) throw error
    return data
  },

  // Müşteri güncelle
  async updateCustomer(id, customerData) {
    const { data, error } = await supabase
      .from('musteriler')
      .update({
        musteri_adi: customerData.musteriAdi,
        telefon_numarasi: customerData.telefonNumarasi,
        emlak_tipi: customerData.emlakTipi,
        satilik_kiralik: customerData.satilikKiralik,
        musteri_notlari: customerData.musteriNotlari,
        guncelleme_tarihi: new Date().toISOString()
      })
      .eq('id', id)
      .select()
    
    if (error) throw error
    return data
  },

  // Müşteri sil
  async deleteCustomer(id) {
    const { error } = await supabase
      .from('musteriler')
      .delete()
      .eq('id', id)
    
    if (error) throw error
    return true
  },

  // Müşteri aktiflik durumu değiştir
  async toggleCustomerStatus(id, aktif) {
    const { data, error } = await supabase
      .from('musteriler')
      .update({ aktif: aktif, guncelleme_tarihi: new Date().toISOString() })
      .eq('id', id)
      .select()
    
    if (error) throw error
    return data
  },

  // ID ile müşteri getir
  async getCustomerById(id) {
    const { data, error } = await supabase
      .from('musteriler')
      .select('*')
      .eq('id', id)
      .single()
    
    if (error) throw error
    return data
  },

  // Müşteri ara
  async searchCustomers(searchTerm, emlakTipi = null) {
    let query = supabase
      .from('musteriler')
      .select('*')
      .or(`musteri_adi.ilike.%${searchTerm}%,telefon_numarasi.ilike.%${searchTerm}%`)
    
    if (emlakTipi) {
      query = query.eq('emlak_tipi', emlakTipi)
    }
    
    const { data, error } = await query.order('olusturma_tarihi', { ascending: false })
    
    if (error) throw error
    return data
  }
}

// Emlak CRUD işlemleri
export const propertyService = {
  // Tüm emlak ilanlarını getir
  async getAllProperties() {
    const { data, error } = await supabase
      .from('emlak_ilanlari')
      .select('*')
      .order('olusturma_tarihi', { ascending: false })
    
    if (error) throw error
    return data
  },

  // Emlak ilanı ekle
  async addProperty(propertyData) {
    const { data, error } = await supabase
      .from('emlak_ilanlari')
      .insert([propertyData])
      .select()
    
    if (error) throw error
    return data
  },

  // Emlak ilanı güncelle
  async updateProperty(id, propertyData) {
    const { data, error } = await supabase
      .from('emlak_ilanlari')
      .update({
        ...propertyData,
        guncelleme_tarihi: new Date().toISOString()
      })
      .eq('id', id)
      .select()
    
    if (error) throw error
    return data
  },

  // Emlak ilanı sil
  async deleteProperty(id) {
    // Önce ilgili fotoğrafları sil
    await supabase.storage
      .from('property-images')
      .remove([`properties/${id}/`])
    
    const { error } = await supabase
      .from('emlak_ilanlari')
      .delete()
      .eq('id', id)
    
    if (error) throw error
    return true
  },

  // Emlak ilanı aktiflik durumu değiştir
  async togglePropertyStatus(id, aktif) {
    const { data, error } = await supabase
      .from('emlak_ilanlari')
      .update({ aktif: aktif, guncelleme_tarihi: new Date().toISOString() })
      .eq('id', id)
      .select()
    
    if (error) throw error
    return data
  },

  // Vitrin durumu değiştir
  async toggleVitrinStatus(id, vitrin) {
    const { data, error } = await supabase
      .from('emlak_ilanlari')
      .update({ vitrin: vitrin, guncelleme_tarihi: new Date().toISOString() })
      .eq('id', id)
      .select()
    
    if (error) throw error
    return data
  },

  // ID ile emlak ilanı getir
  async getPropertyById(id) {
    const { data, error } = await supabase
      .from('emlak_ilanlari')
      .select('*')
      .eq('id', id)
      .single()
    
    if (error) throw error
    return data
  },

  // Emlak ilanlarını filtrele
  async filterProperties(filters) {
    let query = supabase.from('emlak_ilanlari').select('*')
    
    if (filters.emlakTipi) {
      query = query.eq('emlak_tipi', filters.emlakTipi)
    }
    
    if (filters.satilikKiralik) {
      query = query.eq('satilik_kiralik', filters.satilikKiralik)
    }
    
    if (filters.ilce) {
      query = query.eq('ilce', filters.ilce)
    }
    
    if (filters.minFiyat) {
      query = query.gte('fiyat', filters.minFiyat)
    }
    
    if (filters.maxFiyat) {
      query = query.lte('fiyat', filters.maxFiyat)
    }
    
    if (filters.aktif !== undefined) {
      query = query.eq('aktif', filters.aktif)
    }
    
    if (filters.vitrin !== undefined) {
      query = query.eq('vitrin', filters.vitrin)
    }
    
    if (filters.searchTerm) {
      query = query.or(`baslik.ilike.%${filters.searchTerm}%,aciklama.ilike.%${filters.searchTerm}%`)
    }
    
    const { data, error } = await query.order('olusturma_tarihi', { ascending: false })
    
    if (error) throw error
    return data
  },

  // Müşteri tercihleriyle eşleşen ilanları getir
  async getMatchingProperties(customerPreferences) {
    let query = supabase
      .from('emlak_ilanlari')
      .select('*')
      .eq('aktif', true)
    
    if (customerPreferences.emlakTipi) {
      query = query.eq('emlak_tipi', customerPreferences.emlakTipi)
    }
    
    if (customerPreferences.satilikKiralik) {
      query = query.eq('satilik_kiralik', customerPreferences.satilikKiralik)
    }
    
    const { data, error } = await query.order('olusturma_tarihi', { ascending: false })
    
    if (error) throw error
    return data
  }
}

// Dosya yükleme işlemleri
export const fileService = {
  // Emlak resmi yükle
  async uploadPropertyImage(propertyId, file, fileName) {
    const filePath = `properties/${propertyId}/${fileName}`
    
    const { data, error } = await supabase.storage
      .from('property-images')
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: true
      })
    
    if (error) throw error
    return data
  },

  // Emlak resimlerini getir
  async getPropertyImages(propertyId) {
    const { data, error } = await supabase.storage
      .from('property-images')
      .list(`properties/${propertyId}`, {
        limit: 100,
        offset: 0
      })
    
    if (error) throw error
    return data
  },

  // Resim URL'si getir
  getImageUrl(filePath) {
    const { data } = supabase.storage
      .from('property-images')
      .getPublicUrl(filePath)
    
    return data.publicUrl
  },

  // Resim sil
  async deleteImage(filePath) {
    const { error } = await supabase.storage
      .from('property-images')
      .remove([filePath])
    
    if (error) throw error
    return true
  }
}

// İstatistik servisleri
export const analyticsService = {
  // Dashboard istatistikleri
  async getDashboardStats() {
    const [
      { data: totalCustomers, error: customerError },
      { data: activeCustomers, error: activeCustomerError },
      { data: totalProperties, error: propertyError },
      { data: activeProperties, error: activePropertyError }
    ] = await Promise.all([
      supabase.from('musteriler').select('id', { count: 'exact' }),
      supabase.from('musteriler').select('id', { count: 'exact' }).eq('aktif', true),
      supabase.from('emlak_ilanlari').select('id', { count: 'exact' }),
      supabase.from('emlak_ilanlari').select('id', { count: 'exact' }).eq('aktif', true)
    ])
    
    if (customerError || activeCustomerError || propertyError || activePropertyError) {
      throw new Error('İstatistikler alınırken hata oluştu')
    }
    
    return {
      totalCustomers: totalCustomers?.length || 0,
      activeCustomers: activeCustomers?.length || 0,
      totalProperties: totalProperties?.length || 0,
      activeProperties: activeProperties?.length || 0
    }
  },

  // Aylık istatistikler
  async getMonthlyStats() {
    const startOfMonth = new Date()
    startOfMonth.setDate(1)
    startOfMonth.setHours(0, 0, 0, 0)
    
    const [
      { data: monthlyCustomers, error: customerError },
      { data: monthlyProperties, error: propertyError }
    ] = await Promise.all([
      supabase
        .from('musteriler')
        .select('id', { count: 'exact' })
        .gte('olusturma_tarihi', startOfMonth.toISOString()),
      supabase
        .from('emlak_ilanlari')
        .select('id', { count: 'exact' })
        .gte('olusturma_tarihi', startOfMonth.toISOString())
    ])
    
    if (customerError || propertyError) {
      throw new Error('Aylık istatistikler alınırken hata oluştu')
    }
    
    return {
      monthlyCustomers: monthlyCustomers?.length || 0,
      monthlyProperties: monthlyProperties?.length || 0
    }
  }
}