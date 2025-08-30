'use client'
import Link from "next/link";
import { useState } from 'react'
import { Dialog, DialogPanel } from '@headlessui/react'
import {
  Bars3Icon,
  XMarkIcon,
  MagnifyingGlassIcon,
  PlusIcon,
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
  ArrowLeftCircleIcon ,
} from "@heroicons/react/24/outline";
const navigation = [
  { name: 'Müşterilerim', href: '#' },
  { name: 'Portföyüm', href: '#' },
  { name: 'Taleplerim', href: '#' },
  { name: 'Görevlerim', href: '#' },
]

// Sample customer data
const customers = [
  {
    id: 1,
    name: 'Ahmet Yılmaz',
    phone: '+90 532 123 45 67',
    email: 'ahmet.yilmaz@email.com',
    location: 'İstanbul / Kadıköy',
    propertyType: 'Konut - Satılık',
    budget: '₺ 2.500.000',
    status: 'Aktif',
    lastContact: '2024-01-15',
    notes: 'Kadıköy bölgesinde 3+1 daire arıyor'
  },
  {
    id: 2,
    name: 'Fatma Demir',
    phone: '+90 533 987 65 43',
    email: 'fatma.demir@email.com',
    location: 'Ankara / Çankaya',
    propertyType: 'Konut - Kiralık',
    budget: '₺ 8.000',
    status: 'Aktif',
    lastContact: '2024-01-14',
    notes: 'Çankaya merkezde 2+1 kiralık daire'
  },
  {
    id: 3,
    name: 'Mehmet Kaya',
    phone: '+90 534 555 44 33',
    email: 'mehmet.kaya@email.com',
    location: 'İzmir / Karşıyaka',
    propertyType: 'Ticari - Satılık',
    budget: '₺ 5.000.000',
    status: 'Pasif',
    lastContact: '2024-01-10',
    notes: 'Karşıyaka\'da dükkan arıyor'
  },
  {
    id: 4,
    name: 'Ayşe Özkan',
    phone: '+90 535 777 88 99',
    email: 'ayse.ozkan@email.com',
    location: 'Bursa / Nilüfer',
    propertyType: 'Konut - Satılık',
    budget: '₺ 1.800.000',
    status: 'Aktif',
    lastContact: '2024-01-16',
    notes: 'Nilüfer\'de villa arıyor'
  },
  {
    id: 5,
    name: 'Ali Çelik',
    phone: '+90 536 111 22 33',
    email: 'ali.celik@email.com',
    location: 'Antalya / Muratpaşa',
    propertyType: 'Konut - Kiralık',
    budget: '₺ 12.000',
    status: 'Aktif',
    lastContact: '2024-01-13',
    notes: 'Muratpaşa\'da yazlık kiralık'
  }
]

export default function Musterilerim() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('Tümü')
  const [showAddCustomer, setShowAddCustomer] = useState(false)
  const [selectedCustomer, setSelectedCustomer] = useState(null)

  const filteredCustomers = customers.filter(customer => {
    const matchesSearch = customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         customer.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         customer.phone.includes(searchTerm)
    const matchesStatus = statusFilter === 'Tümü' || customer.status === statusFilter
    return matchesSearch && matchesStatus
  })

  const statusOptions = ['Tümü', 'Aktif', 'Pasif']

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <nav aria-label="Global" className="flex items-center justify-between p-6 lg:px-8">
          <div className="flex lg:flex-1">
            <Link href="/" className="-m-1.5 p-1.5">
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
            <Link href="#" className="text-sm font-semibold text-gray-900">
              Çıkış <span aria-hidden="true">&rarr;</span>
              </Link>
          </div>
        </nav>
      </header>

      {/* Mobile menu */}
      <Dialog open={mobileMenuOpen} onClose={setMobileMenuOpen} className="lg:hidden">
        <div className="fixed inset-0 z-50" />
        <DialogPanel className="fixed inset-y-0 right-0 z-50 w-full overflow-y-auto bg-white p-6 sm:max-w-sm sm:ring-1 sm:ring-gray-100/10">
          <div className="flex items-center justify-between">
            <Link href="/" className="-m-1.5 p-1.5">
              <span className="sr-only">Emlak Web</span>
              <img
                alt="LOGO"
                src=""
                className="h-8 w-auto"
              />
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
              <h1 className="text-3xl font-bold text-gray-900">Müşterilerim</h1>
              <p className="mt-2 text-sm text-gray-600">
                Toplam {customers.length} müşteri, {customers.filter(c => c.status === 'Aktif').length} aktif
              </p>
            </div>
            <button
              onClick={() => setShowAddCustomer(true)}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              <PlusIcon className="h-4 w-4 mr-2" />
              Yeni Müşteri
            </button>
          </div>
        </div>

        {/* Search and Filter Bar */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Search */}
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Müşteri ara..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              />
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
              <span>Aktif: {customers.filter(c => c.status === 'Aktif').length}</span>
              <span>Pasif: {customers.filter(c => c.status === 'Pasif').length}</span>
            </div>
          </div>
        </div>

        {/* Customers List */}
        <div className="bg-white shadow overflow-hidden sm:rounded-md">
          <ul className="divide-y divide-gray-200">
            {filteredCustomers.map((customer) => (
              <li key={customer.id} className="px-6 py-4 hover:bg-gray-50">
                <div className="flex items-center justify-between">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-900 truncate">
                          {customer.name}
                        </p>
                        <p className="text-sm text-gray-500">
                          {customer.phone} • {customer.email}
                        </p>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          customer.status === 'Aktif' 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-gray-100 text-gray-800'
                        }`}>
                          {customer.status}
                        </span>
                        <span className="text-sm font-medium text-gray-900">
                          {customer.budget}
                        </span>
                      </div>
                    </div>
                    <div className="mt-2 flex items-center justify-between">
                      <div className="text-sm text-gray-500">
                        <span>{customer.location}</span>
                        <span className="mx-2">•</span>
                        <span>{customer.propertyType}</span>
                      </div>
                      <div className="text-xs text-gray-400">
                        Son görüşme: {customer.lastContact}
                      </div>
                    </div>
                    {customer.notes && (
                      <p className="mt-2 text-sm text-gray-600 italic">
                        "{customer.notes}"
                      </p>
                    )}
                  </div>
                  <div className="ml-4 flex-shrink-0">
                    <button
                      onClick={() => setSelectedCustomer(customer)}
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

        {/* Empty State */}
        {filteredCustomers.length === 0 && (
          <div className="text-center py-12">
            <div className="mx-auto h-12 w-12 text-gray-400">
              <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
            <h3 className="mt-2 text-sm font-medium text-gray-900">Müşteri bulunamadı</h3>
            <p className="mt-1 text-sm text-gray-500">
              Arama kriterlerinize uygun müşteri bulunamadı.
            </p>
          </div>
        )}
      </div>

      {/* Customer Detail Modal */}
      {selectedCustomer && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium text-gray-900">Müşteri Detayları</h3>
                <button
                  onClick={() => setSelectedCustomer(null)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <XMarkIcon className="h-6 w-6" />
                </button>
              </div>
              <div className="space-y-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Ad Soyad</label>
                  <p className="mt-1 text-sm text-gray-900">{selectedCustomer.name}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Telefon</label>
                  <p className="mt-1 text-sm text-gray-900">{selectedCustomer.phone}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">E-posta</label>
                  <p className="mt-1 text-sm text-gray-900">{selectedCustomer.email}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Konum</label>
                  <p className="mt-1 text-sm text-gray-900">{selectedCustomer.location}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Emlak Tipi</label>
                  <p className="mt-1 text-sm text-gray-900">{selectedCustomer.propertyType}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Bütçe</label>
                  <p className="mt-1 text-sm text-gray-900">{selectedCustomer.budget}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Durum</label>
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    selectedCustomer.status === 'Aktif' 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-gray-100 text-gray-800'
                  }`}>
                    {selectedCustomer.status}
                  </span>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Son Görüşme</label>
                  <p className="mt-1 text-sm text-gray-900">{selectedCustomer.lastContact}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Notlar</label>
                  <p className="mt-1 text-sm text-gray-900 italic">"{selectedCustomer.notes}"</p>
                </div>
              </div>
              <div className="flex justify-end space-x-3 mt-6">
                <button
                  onClick={() => setSelectedCustomer(null)}
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

      {/* Add Customer Modal */}
      {showAddCustomer && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium text-gray-900">Yeni Müşteri Ekle</h3>
                <button
                  onClick={() => setShowAddCustomer(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <XMarkIcon className="h-6 w-6" />
                </button>
              </div>
              <form className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Ad Soyad</label>
                  <input
                    type="text"
                    className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500"
                    placeholder="Müşteri adı"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Telefon</label>
                  <input
                    type="tel"
                    className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500"
                    placeholder="+90 5XX XXX XX XX"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">E-posta</label>
                  <input
                    type="email"
                    className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500"
                    placeholder="ornek@email.com"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Konum</label>
                  <input
                    type="text"
                    className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500"
                    placeholder="Şehir / İlçe"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Emlak Tipi</label>
                  <select className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500">
                    <option>Konut - Satılık</option>
                    <option>Konut - Kiralık</option>
                    <option>Ticari - Satılık</option>
                    <option>Ticari - Kiralık</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Bütçe</label>
                  <input
                    type="text"
                    className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500"
                    placeholder="₺ XXX.XXX"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Notlar</label>
                  <textarea
                    rows={3}
                    className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500"
                    placeholder="Müşteri hakkında notlar..."
                  />
                </div>
                <div className="flex justify-end space-x-3">
                  <button
                    type="button"
                    onClick={() => setShowAddCustomer(false)}
                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
                  >
                    İptal
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700"
                  >
                    Kaydet
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Bottom Navigation */}
      <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-50 flex flex-col items-center">
        <div className="border border-gray-300 py-2 flex gap-0.5 shadow-lg rounded-md bg-white">
          <Link href="/">
            <div className="group relative px-2 cursor-pointer">
              <div className="flex h-8 w-8 md:h-10 md:w-10 items-center justify-center rounded-full hover:text-blue-500 active:text-blue-500 transition ">
                <HomeIcon className="h-6 w-6 md:h-7 md:w-7" />
              </div>
              <span className="absolute -top-7 left-1/2 -translate-x-1/2 z-20 origin-left scale-0 rounded-lg border border-gray-300 bg-white px-2 py-1 text-xs md:text-sm font-medium shadow-md transition-all duration-300 ease-in-out group-hover:scale-100">
                Anasayfa
              </span>
            </div>
          </Link>
          <Link href="/musterilerim">
            <div className="group relative px-2 cursor-pointer">
              <div className="flex h-8 w-8 md:h-10 md:w-10 items-center justify-center rounded-full text-blue-500">
                <UsersIcon className="h-6 w-6 md:h-7 md:w-7" />
              </div>
              <span className="absolute -top-7 left-1/2 -translate-x-1/2 z-20 origin-left scale-0 rounded-lg border border-gray-300 bg-white px-2 py-1 text-xs md:text-sm font-medium shadow-md transition-all duration-300 ease-in-out group-hover:scale-100">
                Müşterilerim
              </span>
            </div>
          </Link>

          <Link href="/portfoyum">
            <div className="group relative px-2 cursor-pointer">
              <div className="flex h-8 w-8 md:h-10 md:w-10 items-center justify-center rounded-full hover:text-blue-500 active:text-blue-500 transition">
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
