'use client'
import Link from "next/link";
import Image from "next/image";
import { useState, useEffect } from 'react'
import { Dialog, DialogPanel } from '@headlessui/react'
import { useRouter } from 'next/navigation'
import { useAdmin } from '../../../contexts/AdminContext'
import {
  Bars3Icon,
  XMarkIcon,
  ArrowLeftCircleIcon,
  UserIcon,
  PhoneIcon,
  EnvelopeIcon,
  MapPinIcon,
  HomeIcon,
  CurrencyDollarIcon,
  DocumentTextIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  ShieldCheckIcon,
} from "@heroicons/react/24/outline";

const navigation = [
  { name: 'Admin Panel', href: '/admin' },
  { name: 'Müşteri Ekle', href: '/admin/musteri-ekle' },
  { name: 'Müşteri Yönetimi', href: '/admin/musteri-yonetimi' },
  { name: 'Sistem Ayarları', href: '/admin/ayarlar' },
]

export default function MusteriEkle() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    location: '',
    propertyType: 'Konut - Satılık',
    budget: '',
    status: 'Aktif',
    notes: '',
    lastContact: new Date().toISOString().split('T')[0]
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)
  const [errors, setErrors] = useState({})
  const { isAdmin, isLoading, logoutAdmin } = useAdmin()
  const router = useRouter()

  useEffect(() => {
    if (!isLoading && !isAdmin) {
      router.push('/')
    }
  }, [isAdmin, isLoading, router])

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

  if (!isAdmin) {
    return null
  }

  const propertyTypes = [
    'Konut - Satılık',
    'Konut - Kiralık',
    'Ticari - Satılık',
    'Ticari - Kiralık',
    'Arsa - Satılık',
    'Arsa - Kiralık'
  ]

  const statusOptions = ['Aktif', 'Pasif', 'Potansiyel']

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }))
    }
  }

  const validateForm = () => {
    const newErrors = {}
    
    if (!formData.name.trim()) {
      newErrors.name = 'Ad Soyad alanı zorunludur'
    }
    
    if (!formData.phone.trim()) {
      newErrors.phone = 'Telefon alanı zorunludur'
    } else if (!/^\+90\s5\d{2}\s\d{3}\s\d{2}\s\d{2}$/.test(formData.phone)) {
      newErrors.phone = 'Geçerli bir telefon numarası giriniz (+90 5XX XXX XX XX)'
    }
    
    if (!formData.email.trim()) {
      newErrors.email = 'E-posta alanı zorunludur'
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Geçerli bir e-posta adresi giriniz'
    }
    
    if (!formData.location.trim()) {
      newErrors.location = 'Konum alanı zorunludur'
    }
    
    if (!formData.budget.trim()) {
      newErrors.budget = 'Bütçe alanı zorunludur'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!validateForm()) {
      return
    }

    setIsSubmitting(true)
    
    try {
      // Burada API çağrısı yapılacak
      // const response = await fetch('/api/customers', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(formData)
      // })
      
      // Simüle edilmiş API çağrısı
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      setShowSuccess(true)
      setFormData({
        name: '',
        phone: '',
        email: '',
        location: '',
        propertyType: 'Konut - Satılık',
        budget: '',
        status: 'Aktif',
        notes: '',
        lastContact: new Date().toISOString().split('T')[0]
      })
      
      setTimeout(() => {
        setShowSuccess(false)
      }, 3000)
      
    } catch (error) {
      console.error('Müşteri eklenirken hata oluştu:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <nav aria-label="Global" className="flex items-center justify-between p-6 lg:px-8">
          <div className="flex lg:flex-1">
            <Link href="/admin" className="-m-1.5 p-1.5">
              <ArrowLeftCircleIcon className="h-8 w-8 text-gray-700 hover:text-blue-500 transition active:text-blue-500" />
            </Link>
          </div>
          <div className="flex lg:hidden">
            <button
              type="button"
              onClick={() => setMobileMenuOpen(true)}
              className="-m-2.5 inline-flex items-center justify-center rounded-md p-2.5 text-gray-700"
            >
              <span className="sr-only">Open main menu</span>
              <Bars3Icon aria-hidden="true" className="size-6" />
            </button>
          </div>
          <div className="hidden lg:flex lg:gap-x-12">
            {navigation.map((item) => (
              <a key={item.name} href={item.href} className="text-sm font-semibold text-gray-900">
                {item.name}
              </a>
            ))}
          </div>
          <div className="hidden lg:flex lg:flex-1 lg:justify-end">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <ShieldCheckIcon className="h-5 w-5 text-green-600" />
                <span className="text-sm font-semibold text-gray-900">Admin</span>
              </div>
              <button
                onClick={logoutAdmin}
                className="text-sm font-semibold text-red-600 hover:text-red-700"
              >
                Çıkış
              </button>
            </div>
          </div>
        </nav>
      </header>

      {/* Mobile menu */}
      <Dialog open={mobileMenuOpen} onClose={setMobileMenuOpen} className="lg:hidden">
        <div className="fixed inset-0 z-50" />
        <DialogPanel className="fixed inset-y-0 right-0 z-50 w-full overflow-y-auto bg-white p-6 sm:max-w-sm sm:ring-1 sm:ring-gray-100/10">
          <div className="flex items-center justify-between">
            <Link href="/admin" className="-m-1.5 p-1.5">
              <span className="sr-only">Admin Panel</span>
              <ShieldCheckIcon className="h-8 w-8 text-green-600" />
            </Link>
            <button
              type="button"
              onClick={() => setMobileMenuOpen(false)}
              className="-m-2.5 rounded-md p-2.5 text-gray-700"
            >
              <span className="sr-only">Close menu</span>
              <XMarkIcon aria-hidden="true" className="size-6" />
            </button>
          </div>
          <div className="mt-6 flow-root">
            <div className="-my-6 divide-y divide-gray-200">
              <div className="space-y-2 py-6">
                {navigation.map((item) => (
                  <a
                    key={item.name}
                    href={item.href}
                    className="-mx-3 block rounded-lg px-3 py-2 text-base font-semibold text-gray-900 hover:bg-gray-50"
                  >
                    {item.name}
                  </a>
                ))}
              </div>
              <div className="py-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <ShieldCheckIcon className="h-5 w-5 text-green-600" />
                    <span className="text-base font-semibold text-gray-900">Admin</span>
                  </div>
                  <button
                    onClick={logoutAdmin}
                    className="text-base font-semibold text-red-600 hover:text-red-700"
                  >
                    Çıkış
                  </button>
                </div>
              </div>
            </div>
          </div>
        </DialogPanel>
      </Dialog>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Yeni Müşteri Ekle</h1>
              <p className="mt-2 text-sm text-gray-600">
                Sisteme yeni müşteri kaydı oluşturun
              </p>
            </div>
            <div className="flex items-center space-x-2">
              <ShieldCheckIcon className="h-5 w-5 text-green-600" />
              <span className="text-sm font-medium text-gray-900">Admin Yetkisi</span>
            </div>
          </div>
        </div>

        {/* Success Message */}
        {showSuccess && (
          <div className="mb-6 bg-green-50 border border-green-200 rounded-md p-4">
            <div className="flex">
              <CheckCircleIcon className="h-5 w-5 text-green-400" />
              <div className="ml-3">
                <h3 className="text-sm font-medium text-green-800">
                  Müşteri başarıyla eklendi!
                </h3>
                <p className="mt-1 text-sm text-green-700">
                  Yeni müşteri sisteme kaydedildi ve müşteriler listesinde görüntülenebilir.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Form */}
        <div className="bg-white shadow rounded-lg">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-medium text-gray-900">Müşteri Bilgileri</h2>
            <p className="mt-1 text-sm text-gray-600">
              Tüm zorunlu alanları doldurun ve müşteri bilgilerini sisteme kaydedin.
            </p>
          </div>
          
          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Ad Soyad */}
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                  <UserIcon className="inline h-4 w-4 mr-1" />
                  Ad Soyad *
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className={`mt-1 block w-full border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 ${
                    errors.name ? 'border-red-300' : 'border-gray-300'
                  }`}
                  placeholder="Müşteri adı ve soyadı"
                />
                {errors.name && (
                  <p className="mt-1 text-sm text-red-600">{errors.name}</p>
                )}
              </div>

              {/* Telefon */}
              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
                  <PhoneIcon className="inline h-4 w-4 mr-1" />
                  Telefon *
                </label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  className={`mt-1 block w-full border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 ${
                    errors.phone ? 'border-red-300' : 'border-gray-300'
                  }`}
                  placeholder="+90 5XX XXX XX XX"
                />
                {errors.phone && (
                  <p className="mt-1 text-sm text-red-600">{errors.phone}</p>
                )}
              </div>

              {/* E-posta */}
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                  <EnvelopeIcon className="inline h-4 w-4 mr-1" />
                  E-posta *
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className={`mt-1 block w-full border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 ${
                    errors.email ? 'border-red-300' : 'border-gray-300'
                  }`}
                  placeholder="ornek@email.com"
                />
                {errors.email && (
                  <p className="mt-1 text-sm text-red-600">{errors.email}</p>
                )}
              </div>

              {/* Konum */}
              <div>
                <label htmlFor="location" className="block text-sm font-medium text-gray-700">
                  <MapPinIcon className="inline h-4 w-4 mr-1" />
                  Konum *
                </label>
                <input
                  type="text"
                  id="location"
                  name="location"
                  value={formData.location}
                  onChange={handleInputChange}
                  className={`mt-1 block w-full border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 ${
                    errors.location ? 'border-red-300' : 'border-gray-300'
                  }`}
                  placeholder="Şehir / İlçe"
                />
                {errors.location && (
                  <p className="mt-1 text-sm text-red-600">{errors.location}</p>
                )}
              </div>

              {/* Emlak Tipi */}
              <div>
                <label htmlFor="propertyType" className="block text-sm font-medium text-gray-700">
                  <HomeIcon className="inline h-4 w-4 mr-1" />
                  Emlak Tipi
                </label>
                <select
                  id="propertyType"
                  name="propertyType"
                  value={formData.propertyType}
                  onChange={handleInputChange}
                  className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500"
                >
                  {propertyTypes.map(type => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
              </div>

              {/* Bütçe */}
              <div>
                <label htmlFor="budget" className="block text-sm font-medium text-gray-700">
                  <CurrencyDollarIcon className="inline h-4 w-4 mr-1" />
                  Bütçe *
                </label>
                <input
                  type="text"
                  id="budget"
                  name="budget"
                  value={formData.budget}
                  onChange={handleInputChange}
                  className={`mt-1 block w-full border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 ${
                    errors.budget ? 'border-red-300' : 'border-gray-300'
                  }`}
                  placeholder="₺ XXX.XXX"
                />
                {errors.budget && (
                  <p className="mt-1 text-sm text-red-600">{errors.budget}</p>
                )}
              </div>

              {/* Durum */}
              <div>
                <label htmlFor="status" className="block text-sm font-medium text-gray-700">
                  Durum
                </label>
                <select
                  id="status"
                  name="status"
                  value={formData.status}
                  onChange={handleInputChange}
                  className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500"
                >
                  {statusOptions.map(status => (
                    <option key={status} value={status}>{status}</option>
                  ))}
                </select>
              </div>

              {/* Son Görüşme */}
              <div>
                <label htmlFor="lastContact" className="block text-sm font-medium text-gray-700">
                  Son Görüşme Tarihi
                </label>
                <input
                  type="date"
                  id="lastContact"
                  name="lastContact"
                  value={formData.lastContact}
                  onChange={handleInputChange}
                  className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>
            </div>

            {/* Notlar */}
            <div>
              <label htmlFor="notes" className="block text-sm font-medium text-gray-700">
                <DocumentTextIcon className="inline h-4 w-4 mr-1" />
                Notlar
              </label>
              <textarea
                id="notes"
                name="notes"
                rows={4}
                value={formData.notes}
                onChange={handleInputChange}
                className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="Müşteri hakkında önemli notlar, tercihler, özel durumlar..."
              />
            </div>

            {/* Form Actions */}
            <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200">
              <Link
                href="/admin"
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
              >
                İptal
              </Link>
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? (
                  <div className="flex items-center">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Kaydediliyor...
                  </div>
                ) : (
                  'Müşteriyi Kaydet'
                )}
              </button>
            </div>
          </form>
        </div>

        {/* Admin Info */}
        <div className="mt-8 bg-blue-50 border border-blue-200 rounded-md p-4">
          <div className="flex">
            <ShieldCheckIcon className="h-5 w-5 text-blue-400" />
            <div className="ml-3">
              <h3 className="text-sm font-medium text-blue-800">
                Admin Yetkisi Gerekli
              </h3>
              <p className="mt-1 text-sm text-blue-700">
                Bu sayfa sadece admin yetkisine sahip kullanıcılar tarafından erişilebilir. 
                Müşteri ekleme işlemi sistem loglarında kayıt altına alınır.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
