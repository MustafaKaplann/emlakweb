"use client";

import "./globals.css";
import "./style.css";
import Link from "next/link";
import Image from "next/image";

import { useState } from "react";
import { Dialog, DialogPanel } from "@headlessui/react";
import { useAdmin } from "../contexts/AdminContext";
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
  ShieldCheckIcon,
} from "@heroicons/react/24/outline";

const navigation = [
  { name: "Müşterilerim", href: "#" },
  { name: "Portföyüm", href: "#" },
  { name: "Taleplerim", href: "#" },
  { name: "Görevlerim", href: "#" },
];

export default function Home() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { isAdmin, loginAsAdmin, logoutAdmin } = useAdmin();
  return (
    <div
      className="mainSec bg-position-[30%] sm:bg-center "
      style={{
        backgroundImage: "url('/sectionImg.jpg')",
        backgroundSize: "cover",
        // backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        height: "100vh",
        width: "100%",
      }}
    >
      <header className="absolute inset-x-0 top-0 z-50 ">
        <nav
          aria-label="Global"
          className="flex items-center justify-between p-6 lg:px-8"
        >
          {/* <div className="flex lg:flex-1">
            <a href="#" className="-m-1.5 p-1.5">
              <span className="sr-only">Your Company</span>
              <img alt="LOGO KOYULACAK" src="" className="h-8 w-auto" />
            </a>
          </div> */}
          <div className="flex lg:hidden">
            <button
              type="button"
              onClick={() => setMobileMenuOpen(true)}
              className="-m-2.5 inline-flex items-center justify-center rounded-md p-2.5 text-gray-200"
            >
              <span className="sr-only">Open main menu</span>
              <Bars3Icon aria-hidden="true" className="size-6" />
            </button>
          </div>
          {/* <div className="hidden lg:flex lg:gap-x-12">
          {navigation.map((item) => (
            <a key={item.name} href={item.href} className="text-sm/6 font-semibold text-white">
              {item.name}
            </a>
          ))}
        </div> */}
          <div className="hidden lg:flex lg:flex-1 lg:justify-end">
            <Link href="#" className="text-sm/6 font-semibold text-white">
              Log in <span aria-hidden="true">&rarr;</span>
              </Link>
          </div>
        </nav>
        <Dialog
          open={mobileMenuOpen}
          onClose={setMobileMenuOpen}
          className="lg:hidden"
        >
          <div className="fixed inset-0 z-50" />
          <DialogPanel className="fixed inset-y-0 right-0 z-50 w-full overflow-y-auto bg-gray-900 p-6 sm:max-w-sm sm:ring-1 sm:ring-gray-100/10">
            <div className="flex items-center justify-between">
              <Link href="#" className="-m-1.5 p-1.5">
                <span className="sr-only">Your Company</span>
                <img alt="LOGO KOYULACAK" src="" className="h-8 w-auto" />
                </Link>
              <button
                type="button"
                onClick={() => setMobileMenuOpen(false)}
                className="-m-2.5 rounded-md p-2.5 text-gray-200"
              >
                <span className="sr-only">Close menu</span>
                <XMarkIcon aria-hidden="true" className="size-6" />
              </button>
            </div>
            <div className="mt-6 flow-root">
              <div className="-my-6 divide-y divide-white/10">
                <div className="space-y-2 py-6">
                  {navigation.map((item) => (
                    <a
                      key={item.name}
                      href={item.href}
                      className="-mx-3 block rounded-lg px-3 py-2 text-base/7 font-semibold text-white hover:bg-white/5"
                    >
                      {item.name}
                    </a>
                  ))}
                </div>
                <div className="py-6">
                  <a
                    href="#"
                    className="-mx-3 block rounded-lg px-3 py-2.5 text-base/7 font-semibold text-white hover:bg-white/5"
                  >
                    Log in
                  </a>
                </div>
              </div>
            </div>
          </DialogPanel>
        </Dialog>
      </header>

      <div className="relative isolate px-6 pt-14 lg:px-8 ">
        <div
          aria-hidden="true"
          className="absolute inset-x-0 -top-40 -z-10 transform-gpu overflow-hidden blur-3xl sm:-top-80"
        >
          <div
            style={{
              clipPath:
                "polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)",
            }}
            className="relative left-[calc(50%-11rem)] aspect-1155/678 w-144.5 -translate-x-1/2 rotate-30 bg-linear-to-tr from-[#ff80b5] to-[#9089fc] opacity-30 sm:left-[calc(50%-30rem)] sm:w-288.75"
          />
        </div>

        <div className="mx-auto max-w-2xl py-32">
          <div className="text-center">
            <h1 className="text-5xl font-semibold tracking-tight text-balance text-white sm:text-7xl">
              SLOGAN
            </h1>
            <p className="mt-8 text-lg font-medium text-pretty text-gray-400 sm:text-xl/8">
              ALT SLOGAN
            </p>
            <div className="mt-10 flex items-center justify-center gap-x-6">
  {isAdmin ? (
    <>
      {/* Admin Panel Button */}
      <Link
        href="/admin"
        className="border border-gray-400 rounded-lg p-5 text-sm/6 font-semibold text-white hover:bg-gray-900 hover:border-gray-900 transition active:border-gray-900 active:bg-gray-900 flex items-center gap-2"
      >
        Admin Panel <span aria-hidden="true">→</span>
      </Link>

      {/* Admin Logout */}
      <button
        onClick={logoutAdmin}
        className="border border-red-500 rounded-lg p-5 text-sm/6 font-semibold text-white hover:bg-red-600 hover:border-red-600 transition active:border-red-700 active:bg-red-700"
      >
        Admin Çıkış
      </button>
    </>
  ) : (
    <button
      onClick={loginAsAdmin}
      className="border border-gray-400 rounded-lg p-5 text-sm/6 font-semibold text-white hover:bg-gray-900 hover:border-gray-900 transition active:border-gray-900 active:bg-gray-900"
    >
      Admin Giriş <span aria-hidden="true">→</span>
    </button>
  )}
</div>

          </div>
        </div>

        {/* Removed bottom blur gradient to avoid white band between sections */}
      </div>

      <section className="bg-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <Link href="/musterilerim">
              <button
                className="cursor-pointer w-full rounded-lg bg-white text-gray-900 shadow p-4 text-center font-semibold
               hover:bg-gray-50 hover:scale-[1.02]
               active:bg-gray-100 active:scale-[0.98]
               transition"
              >
                Müşterilerim
              </button>
            </Link>
            <Link href="/portfoyum">
              <button
                className="cursor-pointer w-full rounded-lg bg-white text-gray-900 shadow p-4 text-center font-semibold
               hover:bg-gray-50 hover:scale-[1.02]
               active:bg-gray-100 active:scale-[0.98]
               transition"
              >
                Portföyüm
              </button>
            </Link>
            <Link href="/musterilerim">
              <button
                className="cursor-pointer w-full rounded-lg bg-white text-gray-900 shadow p-4 text-center font-semibold
               hover:bg-gray-50 hover:scale-[1.02]
               active:bg-gray-100 active:scale-[0.98]
               transition"
              >
                Taleplerim
              </button>
            </Link>
            <Link href="/gorevlerim">
              <button
                className="cursor-pointer w-full rounded-lg bg-white text-gray-900 shadow p-4 text-center font-semibold
               hover:bg-gray-50 hover:scale-[1.02]
               active:bg-gray-100 active:scale-[0.98]
               transition"
              >
                Görevlerim
              </button>
            </Link>
          </div>

          {/* Admin Panel Access */}
          <div className="mt-6 flex justify-center">
            {isAdmin ? (
              <div className="flex space-x-4">
                <Link href="/admin">
                  <button
                    className="cursor-pointer rounded-lg bg-indigo-600 text-white shadow p-4 text-center font-semibold
                   hover:bg-indigo-700 hover:scale-[1.02]
                   active:bg-indigo-800 active:scale-[0.98]
                   transition flex items-center space-x-2"
                  >
                    <ShieldCheckIcon className="h-5 w-5" />
                    <span>Admin Panel</span>
                  </button>
                </Link>
                <button
                  onClick={logoutAdmin}
                  className="cursor-pointer rounded-lg bg-red-600 text-white shadow p-4 text-center font-semibold
                 hover:bg-red-700 hover:scale-[1.02]
                 active:bg-red-800 active:scale-[0.98]
                 transition"
                >
                  Admin Çıkış
                </button>
              </div>
            ) : (
              <button
                onClick={loginAsAdmin}
                className="cursor-pointer rounded-lg bg-green-600 text-white shadow p-4 text-center font-semibold
               hover:bg-green-700 hover:scale-[1.02]
               active:bg-green-800 active:scale-[0.98]
               transition flex items-center space-x-2"
              >
                <ShieldCheckIcon className="h-5 w-5" />
                <span>Admin Giriş</span>
              </button>
            )}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8">
            <div className="bg-white rounded-xl shadow">
              <div className="px-4 py-3 border-b border-gray-200 flex items-center justify-between">
                <h2 className="text-base font-semibold text-gray-900">
                  Son eklenen müşteriler
                </h2>
                <a
                  href="#"
                  className="text-sm font-medium text-indigo-600 hover:text-indigo-500"
                >
                  Tümünü Gör
                </a>
              </div>
              <ul className="divide-y divide-gray-100">
                <li className="p-4 flex items-start justify-between">
                  <div>
                    <p className="font-medium text-gray-900">
                      Deneme Test İsimler
                    </p>
                    <p className="text-sm text-gray-500">
                      Konum: İstanbul / Kadıköy
                    </p>
                    <p className="text-sm text-gray-500">
                      Tip: Konut - Satılık
                    </p>
                  </div>
                  <div className="text-sm text-gray-600">₺ 2.500.000</div>
                </li>
                <li className="p-4 flex items-start justify-between">
                  <div>
                    <p className="font-medium text-gray-900">
                      Deneme Test İsimler
                    </p>
                    <p className="text-sm text-gray-500">
                      Konum: Ankara / Çankaya
                    </p>
                    <p className="text-sm text-gray-500">
                      Tip: Konut - Satılık
                    </p>
                  </div>
                  <div className="text-sm text-gray-600">₺ 4.950.000</div>
                </li>
                <li className="p-4 flex items-start justify-between">
                  <div>
                    <p className="font-medium text-gray-900">
                      Deneme Test İsimler
                    </p>
                    <p className="text-sm text-gray-500">
                      Konum: İzmir / Karşıyaka
                    </p>
                    <p className="text-sm text-gray-500">
                      Tip: Konut - Satılık
                    </p>
                  </div>
                  <div className="text-sm text-gray-600">₺ 3.200.000</div>
                </li>
              </ul>
            </div>

            <div className="bg-white rounded-xl shadow">
              <div className="px-4 py-3 border-b border-gray-200 flex items-center justify-between">
                <h2 className="text-base font-semibold text-gray-900">
                  Görevlerim
                </h2>
                <a
                  href="#"
                  className="text-sm font-medium text-indigo-600 hover:text-indigo-500"
                >
                  Tümünü Gör
                </a>
              </div>
              <ul className="divide-y divide-gray-100">
                <li className="p-4 flex items-start justify-between">
                  <div>
                    <p className="font-medium text-gray-900">
                      Yeni müşteri araması
                    </p>
                    <p className="text-sm text-gray-500">Bugün 14:00</p>
                  </div>
                  <span className="inline-flex items-center rounded-full bg-yellow-100 px-2 py-1 text-xs font-medium text-yellow-800">
                    Beklemede
                  </span>
                </li>
                <li className="p-4 flex items-start justify-between">
                  <div>
                    <p className="font-medium text-gray-900">
                      Portföy güncelleme
                    </p>
                    <p className="text-sm text-gray-500">Yarın 10:30</p>
                  </div>
                  <span className="inline-flex items-center rounded-full bg-green-100 px-2 py-1 text-xs font-medium text-green-800">
                    Tamamlandı
                  </span>
                </li>
                <li className="p-4 flex items-start justify-between">
                  <div>
                    <p className="font-medium text-gray-900">Talep dönüşü</p>
                    <p className="text-sm text-gray-500">Bu hafta</p>
                  </div>
                  <span className="inline-flex items-center rounded-full bg-blue-100 px-2 py-1 text-xs font-medium text-blue-800">
                    Devam ediyor
                  </span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>


      {/* Bottom Navigation */}
      <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-50 flex flex-col items-center">
        <div className="border border-gray-300 py-2 flex gap-0.5 shadow-lg rounded-md bg-white">
          <Link href="/">
            <div className="group relative px-2 cursor-pointer">
              <div className="flex h-8 w-8 md:h-10 md:w-10 items-center justify-center rounded-full hover:text-blue-500 text-blue-500">
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
  );
}
