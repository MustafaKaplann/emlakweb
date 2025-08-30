'use client'

import { useState } from 'react'
import { Dialog, DialogPanel } from '@headlessui/react'
import Link from "next/link";
import {
    Bars3Icon,
    XMarkIcon,
    MagnifyingGlassIcon,
    PlusIcon,
    CurrencyDollarIcon,
    FunnelIcon,
    CalendarIcon,
    ClockIcon,
    CheckCircleIcon,
    ExclamationTriangleIcon,
    UserIcon,
    MapPinIcon,
    PhoneIcon,
    EnvelopeIcon,
    HomeIcon,
    ChevronLeftIcon,
    ChevronRightIcon,
    EllipsisVerticalIcon,
    FolderIcon,
    UsersIcon,
  } from "@heroicons/react/24/outline";
const navigation = [
  { name: 'Müşterilerim', href: '#' },
  { name: 'Portföyüm', href: '#' },
  { name: 'Taleplerim', href: '#' },
  { name: 'Görevlerim', href: '#' },
]

// Sample property data
const properties = [
  {
    id: 1,
    title: 'Kadıköy\'de Satılık 3+1 Daire',
    type: 'Konut',
    category: 'Satılık',
    price: '₺ 2.500.000',
    location: 'İstanbul / Kadıköy',
    area: '120 m²',
    rooms: '3+1',
    status: 'Aktif',
    image: '/sectionImg.jpg',
    description: 'Kadıköy merkezde, metroya yakın, yeni yapılmış 3+1 daire',
    features: ['Asansör', 'Otopark', 'Güvenlik', 'Merkezi Isıtma'],
    contact: '+90 532 123 45 67',
    addedDate: '2024-01-15'
  },
  {
    id: 2,
    title: 'Çankaya\'da Kiralık Villa',
    type: 'Konut',
    category: 'Kiralık',
    price: '₺ 15.000',
    location: 'Ankara / Çankaya',
    area: '250 m²',
    rooms: '4+2',
    status: 'Aktif',
    image: '/sectionImg.jpg',
    description: 'Çankaya\'da lüks villa, bahçeli, havuzlu',
    features: ['Havuz', 'Bahçe', 'Güvenlik', 'Otopark'],
    contact: '+90 533 987 65 43',
    addedDate: '2024-01-14'
  },
  {
    id: 3,
    title: 'Karşıyaka\'da Ticari Dükkan',
    type: 'Ticari',
    category: 'Satılık',
    price: '₺ 5.000.000',
    location: 'İzmir / Karşıyaka',
    area: '80 m²',
    rooms: '1+0',
    status: 'Pasif',
    image: '/sectionImg.jpg',
    description: 'Karşıyaka\'da caddede, işlek yerde ticari dükkan',
    features: ['Cephe', 'Depo', 'Klima', 'Güvenlik'],
    contact: '+90 534 555 44 33',
    addedDate: '2024-01-10'
  },
  {
    id: 4,
    title: 'Nilüfer\'de Satılık Arsa',
    type: 'Arsa',
    category: 'Satılık',
    price: '₺ 1.800.000',
    location: 'Bursa / Nilüfer',
    area: '500 m²',
    rooms: '-',
    status: 'Aktif',
    image: '/sectionImg.jpg',
    description: 'Nilüfer\'de imarlı, yola cepheli arsa',
    features: ['İmarlı', 'Yola Cephe', 'Elektrik', 'Su'],
    contact: '+90 535 777 88 99',
    addedDate: '2024-01-16'
  },
  {
    id: 5,
    title: 'Muratpaşa\'da Yazlık Villa',
    type: 'Konut',
    category: 'Kiralık',
    price: '₺ 25.000',
    location: 'Antalya / Muratpaşa',
    area: '300 m²',
    rooms: '5+3',
    status: 'Aktif',
    image: '/sectionImg.jpg',
    description: 'Muratpaşa\'da deniz manzaralı yazlık villa',
    features: ['Deniz Manzarası', 'Havuz', 'Bahçe', 'Barbekü'],
    contact: '+90 536 111 22 33',
    addedDate: '2024-01-13'
  }
]

export default function Portfoyum() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [typeFilter, setTypeFilter] = useState('Tümü')
  const [categoryFilter, setCategoryFilter] = useState('Tümü')
  const [statusFilter, setStatusFilter] = useState('Tümü')
  const [showAddProperty, setShowAddProperty] = useState(false)
  const [selectedProperty, setSelectedProperty] = useState(null)
  const [viewMode, setViewMode] = useState('grid') // 'grid' or 'list'

  const filteredProperties = properties.filter(property => {
    const matchesSearch = property.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         property.location.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesType = typeFilter === 'Tümü' || property.type === typeFilter
    const matchesCategory = categoryFilter === 'Tümü' || property.category === categoryFilter
    const matchesStatus = statusFilter === 'Tümü' || property.status === statusFilter
    return matchesSearch && matchesType && matchesCategory && matchesStatus
  })

  const typeOptions = ['Tümü', 'Konut', 'Ticari', 'Arsa']
  const categoryOptions = ['Tümü', 'Satılık', 'Kiralık']
  const statusOptions = ['Tümü', 'Aktif', 'Pasif']

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <nav aria-label="Global" className="flex items-center justify-between p-6 lg:px-8">
          <div className="flex lg:flex-1">
            <a href="/" className="-m-1.5 p-1.5">
              <span className="sr-only">Emlak Web</span>
              <img alt="LOGO" src="" className="h-8 w-auto" />
            </a>
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
            <a href="#" className="text-sm font-semibold text-gray-900">
              Çıkış <span aria-hidden="true">&rarr;</span>
            </a>
          </div>
        </nav>
      </header>

      {/* Mobile menu */}
      <Dialog open={mobileMenuOpen} onClose={setMobileMenuOpen} className="lg:hidden">
        <div className="fixed inset-0 z-50" />
        <DialogPanel className="fixed inset-y-0 right-0 z-50 w-full overflow-y-auto bg-white p-6 sm:max-w-sm sm:ring-1 sm:ring-gray-100/10">
          <div className="flex items-center justify-between">
            <a href="/" className="-m-1.5 p-1.5">
              <span className="sr-only">Emlak Web</span>
              <img alt="LOGO" src="" className="h-8 w-auto" />
            </a>
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
                <a
                  href="#"
                  className="-mx-3 block rounded-lg px-3 py-2.5 text-base font-semibold text-gray-900 hover:bg-gray-50"
                >
                  Çıkış
                </a>
              </div>
            </div>
          </div>
        </DialogPanel>
      </Dialog>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Portföyüm</h1>
              <p className="mt-2 text-sm text-gray-600">
                Toplam {properties.length} emlak, {properties.filter(p => p.status === 'Aktif').length} aktif
              </p>
            </div>
            <div className="flex items-center space-x-3">
              {/* View Mode Toggle */}
              <div className="hidden sm:flex border border-gray-300 rounded-md">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`px-3 py-2 text-sm font-medium ${
                    viewMode === 'grid' 
                      ? 'bg-indigo-600 text-white' 
                      : 'bg-white text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  Grid
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`px-3 py-2 text-sm font-medium ${
                    viewMode === 'list' 
                      ? 'bg-indigo-600 text-white' 
                      : 'bg-white text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  Liste
                </button>
              </div>
              <button
                onClick={() => setShowAddProperty(true)}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                <PlusIcon className="h-4 w-4 mr-2" />
                Yeni Emlak
              </button>
            </div>
          </div>
        </div>

        {/* Search and Filter Bar */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            {/* Search */}
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Emlak ara..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              />
            </div>

            {/* Type Filter */}
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <HomeIcon className="h-5 w-5 text-gray-400" />
              </div>
              <select
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value)}
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              >
                {typeOptions.map(option => (
                  <option key={option} value={option}>{option}</option>
                ))}
              </select>
            </div>

            {/* Category Filter */}
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <CurrencyDollarIcon className="h-5 w-5 text-gray-400" />
              </div>
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              >
                {categoryOptions.map(option => (
                  <option key={option} value={option}>{option}</option>
                ))}
              </select>
            </div>

            {/* Status Filter */}
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FunnelIcon className="h-5 w-5 text-gray-400" />
              </div>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              >
                {statusOptions.map(option => (
                  <option key={option} value={option}>{option}</option>
                ))}
              </select>
            </div>

            {/* Quick Stats */}
            <div className="flex items-center justify-end space-x-4 text-sm text-gray-600">
              <span>Aktif: {properties.filter(p => p.status === 'Aktif').length}</span>
              <span>Pasif: {properties.filter(p => p.status === 'Pasif').length}</span>
            </div>
          </div>
        </div>

        {/* Properties Grid/List */}
        {viewMode === 'grid' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProperties.map((property) => (
              <div key={property.id} className="bg-white rounded-lg shadow overflow-hidden hover:shadow-lg transition-shadow">
                <div className="relative">
                  <img
                    src={property.image}
                    alt={property.title}
                    className="w-full h-48 object-cover"
                  />
                  <div className="absolute top-2 right-2">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      property.status === 'Aktif' 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-gray-100 text-gray-800'
                    }`}>
                      {property.status}
                    </span>
                  </div>
                  <div className="absolute top-2 left-2">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                      {property.category}
                    </span>
                  </div>
                </div>
                <div className="p-4">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">{property.title}</h3>
                  <div className="flex items-center text-sm text-gray-500 mb-2">
                    <MapPinIcon className="h-4 w-4 mr-1" />
                    {property.location}
                  </div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-lg font-bold text-indigo-600">{property.price}</span>
                    <span className="text-sm text-gray-500">{property.area}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-500">{property.rooms}</span>
                    <button
                      onClick={() => setSelectedProperty(property)}
                      className="text-indigo-600 hover:text-indigo-900 text-sm font-medium"
                    >
                      Detaylar
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white shadow overflow-hidden sm:rounded-md">
            <ul className="divide-y divide-gray-200">
              {filteredProperties.map((property) => (
                <li key={property.id} className="px-6 py-4 hover:bg-gray-50">
                  <div className="flex items-center justify-between">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-gray-900 truncate">
                            {property.title}
                          </p>
                          <p className="text-sm text-gray-500">
                            <MapPinIcon className="h-4 w-4 inline mr-1" />
                            {property.location}
                          </p>
                        </div>
                        <div className="flex items-center space-x-2">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            property.status === 'Aktif' 
                              ? 'bg-green-100 text-green-800' 
                              : 'bg-gray-100 text-gray-800'
                          }`}>
                            {property.status}
                          </span>
                          <span className="text-sm font-medium text-gray-900">
                            {property.price}
                          </span>
                        </div>
                      </div>
                      <div className="mt-2 flex items-center justify-between">
                        <div className="text-sm text-gray-500">
                          <span>{property.type} - {property.category}</span>
                          <span className="mx-2">•</span>
                          <span>{property.area}</span>
                          <span className="mx-2">•</span>
                          <span>{property.rooms}</span>
                        </div>
                        <div className="text-xs text-gray-400">
                          Eklenme: {property.addedDate}
                        </div>
                      </div>
                    </div>
                    <div className="ml-4 flex-shrink-0">
                      <button
                        onClick={() => setSelectedProperty(property)}
                        className="text-indigo-600 hover:text-indigo-900 text-sm font-medium"
                      >
                        Detaylar
                      </button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Empty State */}
        {filteredProperties.length === 0 && (
          <div className="text-center py-12">
            <div className="mx-auto h-12 w-12 text-gray-400">
              <HomeIcon className="h-12 w-12" />
            </div>
            <h3 className="mt-2 text-sm font-medium text-gray-900">Emlak bulunamadı</h3>
            <p className="mt-1 text-sm text-gray-500">
              Arama kriterlerinize uygun emlak bulunamadı.
            </p>
          </div>
        )}
      </div>

      {/* Property Detail Modal */}
      {selectedProperty && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium text-gray-900">Emlak Detayları</h3>
                <button
                  onClick={() => setSelectedProperty(null)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <XMarkIcon className="h-6 w-6" />
                </button>
              </div>
              <div className="space-y-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Başlık</label>
                  <p className="mt-1 text-sm text-gray-900">{selectedProperty.title}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Tip</label>
                  <p className="mt-1 text-sm text-gray-900">{selectedProperty.type} - {selectedProperty.category}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Fiyat</label>
                  <p className="mt-1 text-sm text-gray-900">{selectedProperty.price}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Konum</label>
                  <p className="mt-1 text-sm text-gray-900">{selectedProperty.location}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Alan</label>
                  <p className="mt-1 text-sm text-gray-900">{selectedProperty.area}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Oda Sayısı</label>
                  <p className="mt-1 text-sm text-gray-900">{selectedProperty.rooms}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Durum</label>
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    selectedProperty.status === 'Aktif' 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-gray-100 text-gray-800'
                  }`}>
                    {selectedProperty.status}
                  </span>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Açıklama</label>
                  <p className="mt-1 text-sm text-gray-900">{selectedProperty.description}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Özellikler</label>
                  <div className="mt-1 flex flex-wrap gap-1">
                    {selectedProperty.features.map((feature, index) => (
                      <span key={index} className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        {feature}
                      </span>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">İletişim</label>
                  <p className="mt-1 text-sm text-gray-900">{selectedProperty.contact}</p>
                </div>
              </div>
              <div className="flex justify-end space-x-3 mt-6">
                <button
                  onClick={() => setSelectedProperty(null)}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
                >
                  Kapat
                </button>
                <button className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700">
                  Düzenle
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Bottom Navigation */}
      <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-50 flex flex-col items-center">
        <div className="border border-gray-300 py-2 flex gap-0.5 shadow-lg rounded-md bg-white">
          <Link href="/">
            <div className="group relative px-2 cursor-pointer">
              <div className="flex h-8 w-8 md:h-10 md:w-10 items-center justify-center rounded-full hover:text-blue-500 active:text-blue-500 transition">
                <HomeIcon className="h-6 w-6 md:h-7 md:w-7" />
              </div>
              <span className="absolute -top-7 left-1/2 -translate-x-1/2 z-20 origin-left scale-0 rounded-lg border border-gray-300 bg-white px-2 py-1 text-xs md:text-sm font-medium shadow-md transition-all duration-300 ease-in-out group-hover:scale-100">
                Anasayfa
              </span>
            </div>
          </Link>
          <Link href="/musterilerim">
            <div className="group relative px-2 cursor-pointer">
              <div className="flex h-8 w-8 md:h-10 md:w-10 items-center justify-center rounded-full hover:text-blue-500 active:text-blue-500 transition">
                <UsersIcon className="h-6 w-6 md:h-7 md:w-7" />
              </div>
              <span className="absolute -top-7 left-1/2 -translate-x-1/2 z-20 origin-left scale-0 rounded-lg border border-gray-300 bg-white px-2 py-1 text-xs md:text-sm font-medium shadow-md transition-all duration-300 ease-in-out group-hover:scale-100">
                Müşterilerim
              </span>
            </div>
          </Link>

          <Link href="/portfoyum">
            <div className="group relative px-2 cursor-pointer">
              <div className="flex h-8 w-8 md:h-10 md:w-10 items-center justify-center rounded-full hover:text-blue-500 text-blue-500 transition">
                <FolderIcon className="h-6 w-6 md:h-7 md:w-7" />
              </div>
              <span className="absolute -top-7 left-1/2 -translate-x-1/2 z-20 origin-left scale-0 rounded-lg border border-gray-300 bg-white px-2 py-1 text-xs md:text-sm font-medium shadow-md transition-all duration-300 ease-in-out group-hover:scale-100">
                Portföyüm
              </span>
            </div>
          </Link>
          <Link href="/gorevlerim">
            <div className="group relative px-2 cursor-pointer">
              <div className="flex h-8 w-8 md:h-10 md:w-10 items-center justify-center rounded-full hover:text-blue-500 active:text-blue-500 transition">
                <CheckCircleIcon className="h-7 w-7 md:h-7 md:w-7" />
              </div>
              <span className="absolute -top-7 left-1/2 -translate-x-1/2 z-20 origin-left scale-0 rounded-lg border border-gray-300 bg-white px-2 py-1 text-xs md:text-sm font-medium shadow-md transition-all duration-300 ease-in-out group-hover:scale-100">
                Görevlerim
              </span>
            </div>
          </Link>
        </div>
      </div>
    </div>
  )
}
