'use client'
import Link from "next/link";
import { useState, useEffect } from 'react'
import { Dialog, DialogPanel } from '@headlessui/react'
import { useRouter } from 'next/navigation'
import { useAdmin } from '../../contexts/AdminContext'
import {
  Bars3Icon,
  XMarkIcon,
  ArrowLeftCircleIcon,
  ShieldCheckIcon,
  UsersIcon,
  FolderIcon,
  CheckCircleIcon,
  CogIcon,
  ChartBarIcon,
  DocumentTextIcon,
  ExclamationTriangleIcon,
  HomeIcon,
} from "@heroicons/react/24/outline";

const navigation = [
  { name: 'Admin Panel', href: '/admin' },
  { name: 'Müşteri Ekle', href: '/admin/musteri-ekle' },
  { name: 'Müşteri Yönetimi', href: '/admin/musteri-yonetimi' },
  { name: 'Sistem Ayarları', href: '/admin/ayarlar' },
]

const adminStats = [
  {
    name: 'Toplam Müşteri',
    value: '156',
    change: '+12%',
    changeType: 'positive',
    icon: UsersIcon,
  },
  {
    name: 'Aktif Müşteri',
    value: '89',
    change: '+8%',
    changeType: 'positive',
    icon: CheckCircleIcon,
  },
  {
    name: 'Toplam Portföy',
    value: '234',
    change: '+15%',
    changeType: 'positive',
    icon: FolderIcon,
  },
  {
    name: 'Bekleyen İşlem',
    value: '12',
    change: '-3%',
    changeType: 'negative',
    icon: ExclamationTriangleIcon,
  },
]

const quickActions = [
  {
    name: 'Yeni Müşteri Ekle',
    description: 'Sisteme yeni müşteri kaydı oluştur',
    href: '/admin/musteri-ekle',
    icon: UsersIcon,
    color: 'bg-blue-500',
  },
  {
    name: 'Müşteri Yönetimi',
    description: 'Mevcut müşterileri düzenle ve yönet',
    href: '/admin/musteri-yonetimi',
    icon: DocumentTextIcon,
    color: 'bg-green-500',
  },
  {
    name: 'Sistem Ayarları',
    description: 'Sistem konfigürasyonlarını yönet',
    href: '/admin/ayarlar',
    icon: CogIcon,
    color: 'bg-purple-500',
  },
  {
    name: 'Raporlar',
    description: 'Detaylı raporları görüntüle',
    href: '/admin/raporlar',
    icon: ChartBarIcon,
    color: 'bg-orange-500',
  },
]

export default function AdminPanel() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
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
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Admin Panel</h1>
              <p className="mt-2 text-sm text-gray-600">
                Sistem yönetimi ve müşteri işlemleri
              </p>
            </div>
            <div className="flex items-center space-x-2">
              <ShieldCheckIcon className="h-5 w-5 text-green-600" />
              <span className="text-sm font-medium text-gray-900">Admin Yetkisi</span>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {adminStats.map((stat) => (
            <div key={stat.name} className="bg-white overflow-hidden shadow rounded-lg">
              <div className="p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <stat.icon className="h-6 w-6 text-gray-400" aria-hidden="true" />
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">{stat.name}</dt>
                      <dd>
                        <div className="text-lg font-medium text-gray-900">{stat.value}</div>
                      </dd>
                    </dl>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 px-5 py-3">
                <div className="text-sm">
                  <span className={`font-medium ${
                    stat.changeType === 'positive' ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {stat.change}
                  </span>
                  <span className="text-gray-500"> geçen aya göre</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Quick Actions */}
        <div className="mb-8">
          <h2 className="text-lg font-medium text-gray-900 mb-4">Hızlı İşlemler</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {quickActions.map((action) => (
              <Link
                key={action.name}
                href={action.href}
                className="group relative bg-white p-6 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-500 rounded-lg shadow hover:shadow-md transition-shadow"
              >
                <div>
                  <span className={`inline-flex p-3 ${action.color} text-white rounded-lg`}>
                    <action.icon className="h-6 w-6" aria-hidden="true" />
                  </span>
                </div>
                <div className="mt-4">
                  <h3 className="text-lg font-medium">
                    <span className="absolute inset-0" aria-hidden="true" />
                    {action.name}
                  </h3>
                  <p className="mt-2 text-sm text-gray-500">{action.description}</p>
                </div>
                <span
                  className="absolute top-6 right-6 text-gray-300 group-hover:text-gray-400"
                  aria-hidden="true"
                >
                  <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M20 4h1a1 1 0 00-1-1v1zm-1 12a1 1 0 102 0h-2zM8 3a1 1 0 000 2V3zM3.293 19.293a1 1 0 101.414 1.414l-1.414-1.414zM19 4v12h2V4h-2zm1-1H8v2h12V3zm-.707.293l-16 16 1.414 1.414 16-16-1.414-1.414z" />
                  </svg>
                </span>
              </Link>
            ))}
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white shadow rounded-lg">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-medium text-gray-900">Son Aktiviteler</h2>
          </div>
          <div className="p-6">
            <div className="flow-root">
              <ul className="-mb-8">
                <li>
                  <div className="relative pb-8">
                    <span className="absolute top-4 left-4 -ml-px h-full w-0.5 bg-gray-200" aria-hidden="true" />
                    <div className="relative flex space-x-3">
                      <div>
                        <span className="h-8 w-8 rounded-full bg-green-500 flex items-center justify-center ring-8 ring-white">
                          <UsersIcon className="h-5 w-5 text-white" />
                        </span>
                      </div>
                      <div className="min-w-0 flex-1 pt-1.5 flex justify-between space-x-4">
                        <div>
                          <p className="text-sm text-gray-500">
                            Yeni müşteri eklendi: <span className="font-medium text-gray-900">Ahmet Yılmaz</span>
                          </p>
                        </div>
                        <div className="text-right text-sm whitespace-nowrap text-gray-500">
                          <time dateTime="2024-01-16">2 saat önce</time>
                        </div>
                      </div>
                    </div>
                  </div>
                </li>
                <li>
                  <div className="relative pb-8">
                    <span className="absolute top-4 left-4 -ml-px h-full w-0.5 bg-gray-200" aria-hidden="true" />
                    <div className="relative flex space-x-3">
                      <div>
                        <span className="h-8 w-8 rounded-full bg-blue-500 flex items-center justify-center ring-8 ring-white">
                          <DocumentTextIcon className="h-5 w-5 text-white" />
                        </span>
                      </div>
                      <div className="min-w-0 flex-1 pt-1.5 flex justify-between space-x-4">
                        <div>
                          <p className="text-sm text-gray-500">
                            Müşteri bilgileri güncellendi: <span className="font-medium text-gray-900">Fatma Demir</span>
                          </p>
                        </div>
                        <div className="text-right text-sm whitespace-nowrap text-gray-500">
                          <time dateTime="2024-01-16">4 saat önce</time>
                        </div>
                      </div>
                    </div>
                  </div>
                </li>
                <li>
                  <div className="relative pb-8">
                    <span className="absolute top-4 left-4 -ml-px h-full w-0.5 bg-gray-200" aria-hidden="true" />
                    <div className="relative flex space-x-3">
                      <div>
                        <span className="h-8 w-8 rounded-full bg-purple-500 flex items-center justify-center ring-8 ring-white">
                          <CogIcon className="h-5 w-5 text-white" />
                        </span>
                      </div>
                      <div className="min-w-0 flex-1 pt-1.5 flex justify-between space-x-4">
                        <div>
                          <p className="text-sm text-gray-500">
                            Sistem ayarları güncellendi
                          </p>
                        </div>
                        <div className="text-right text-sm whitespace-nowrap text-gray-500">
                          <time dateTime="2024-01-16">1 gün önce</time>
                        </div>
                      </div>
                    </div>
                  </div>
                </li>
                <li>
                  <div className="relative">
                    <div className="relative flex space-x-3">
                      <div>
                        <span className="h-8 w-8 rounded-full bg-yellow-500 flex items-center justify-center ring-8 ring-white">
                          <ExclamationTriangleIcon className="h-5 w-5 text-white" />
                        </span>
                      </div>
                      <div className="min-w-0 flex-1 pt-1.5 flex justify-between space-x-4">
                        <div>
                          <p className="text-sm text-gray-500">
                            Sistem yedekleme tamamlandı
                          </p>
                        </div>
                        <div className="text-right text-sm whitespace-nowrap text-gray-500">
                          <time dateTime="2024-01-16">2 gün önce</time>
                        </div>
                      </div>
                    </div>
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Admin Info */}
        <div className="mt-8 bg-blue-50 border border-blue-200 rounded-md p-4">
          <div className="flex">
            <ShieldCheckIcon className="h-5 w-5 text-blue-400" />
            <div className="ml-3">
              <h3 className="text-sm font-medium text-blue-800">
                Admin Yetkisi Aktif
              </h3>
              <p className="mt-1 text-sm text-blue-700">
                Tüm sistem yönetimi işlemlerine erişiminiz bulunmaktadır. 
                Yapılan tüm değişiklikler sistem loglarında kayıt altına alınır.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
