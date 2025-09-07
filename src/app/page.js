"use client";

import "./globals.css";
import "./style.css";
import Link from "next/link";
import Image from "next/image";

import { useState, useEffect } from "react";
import { Dialog, DialogPanel } from "@headlessui/react";
// import { useAdmin } from "../contexts/AdminContext";
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
  { name: "Ana Sayfa", href: "#" },
  { name: "Hakkımızda", href: "#hakkimizda" },
  { name: "Çalışmalarımız", href: "#calismalarimiz" },
  { name: "İletişim", href: "/iletisim" },
  // { name: "Görevlerim", href: "#" },
];

export default function Home() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isMobile, setIsMobile] = useState(false);
  const [currentTestimonial, setCurrentTestimonial] = useState(0);
  const [showNavbar, setShowNavbar] = useState(true);
  // const { isAdmin, loginAsAdmin, logoutAdmin } = useAdmin();

  // Check if mobile on mount and resize
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);

    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // Handle navbar visibility based on scroll position
  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      const documentHeight = document.documentElement.scrollHeight;
      const windowHeight = window.innerHeight;

      // Hide navbar when near the bottom (last 100px)
      const nearBottom = scrollPosition + windowHeight >= documentHeight - 100;
      setShowNavbar(!nearBottom);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Interior view cards data
  const interiorCards = [
    {
      id: 1,
      title: "Tek Oda Daire",
      description: "Modern ve fonksiyonel tasarım ile maksimum konfor",
      image:
        "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
    },
    {
      id: 2,
      title: "Lüks Daire",
      description: "Zarif detaylar ve premium malzemelerle tasarlanmış",
      image:
        "https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
    },
    {
      id: 3,
      title: "Deluxe Daire",
      description: "Geniş yaşam alanları ve şık iç mekan tasarımı",
      image:
        "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
    },
    {
      id: 4,
      title: "Studio Daire",
      description: "Kompakt tasarım ile maksimum verimlilik",
      image:
        "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
    },
    {
      id: 5,
      title: "Penthouse",
      description: "Şehrin üstünde lüks yaşam deneyimi",
      image:
        "https://images.unsplash.com/photo-1613490493576-7fde63acd811?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
    },
    {
      id: 6,
      title: "Villa",
      description: "Geniş bahçeli ve özel yaşam alanları",
      image:
        "https://images.unsplash.com/photo-1600596542815-ffad4c2039ab?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
    },
    {
      id: 7,
      title: "Duplex Daire",
      description: "İki katlı yaşam alanları ile özel tasarım",
      image:
        "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
    },
    {
      id: 8,
      title: "Loft Daire",
      description: "Endüstriyel tasarım ile modern yaşam",
      image:
        "https://images.unsplash.com/photo-1600607687644-c7171b42498b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
    },
  ];

  // Testimonials data
  const testimonials = [
    {
      id: 1,
      name: "Ahmet Yılmaz",
      role: "Ev Sahibi",
      quote:
        "CASSAPARVA ile çalışmak harika bir deneyimdi. Profesyonel ekibiniz sayesinde hayalimdeki evi buldum. Süreç boyunca her adımda yanımda oldular ve hiçbir detayı atlamadılar.",
      image:
        "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=150&q=80",
    },
    {
      id: 2,
      name: "Fatma Demir",
      role: "Yatırımcı",
      quote:
        "Emlak yatırımım için CASSAPARVA'yı seçtim ve hiç pişman olmadım. Piyasa analizi ve portföy yönetimi konularında çok başarılılar. Kesinlikle tavsiye ederim.",
      image:
        "https://images.unsplash.com/photo-1494790108755-2616b612b786?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=150&q=80",
    },
    {
      id: 3,
      name: "Mehmet Kaya",
      role: "İş İnsanı",
      quote:
        "35 yıllık deneyimleri gerçekten fark ediliyor. Ofis alanımızı bulurken gösterdikleri profesyonellik ve müşteri odaklı yaklaşım beni çok etkiledi.",
      image:
        "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=150&q=80",
    },
    {
      id: 4,
      name: "Ayşe Özkan",
      role: "Aile",
      quote:
        "Ailemiz için ev ararken CASSAPARVA ile tanıştık. Çocuklarımızın güvenliği ve okul mesafesi gibi önemli konularda çok detaylı çalıştılar. Teşekkürler!",
      image:
        "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=150&q=80",
    },
  ];

  const totalSlides = Math.ceil(interiorCards.length / 3); // 3 cards per slide for desktop
  const totalMobileSlides = interiorCards.length; // 1 card per slide on mobile

  const nextSlide = () => {
    setCurrentSlide((prev) => {
      const maxSlides = isMobile ? totalMobileSlides : totalSlides;
      return (prev + 1) % maxSlides;
    });
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => {
      const maxSlides = isMobile ? totalMobileSlides : totalSlides;
      return (prev - 1 + maxSlides) % maxSlides;
    });
  };

  const nextTestimonial = () => {
    setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
  };

  const prevTestimonial = () => {
    setCurrentTestimonial(
      (prev) => (prev - 1 + testimonials.length) % testimonials.length
    );
  };
  return (
    <div
      className="mainSec bg-position-[30%] sm:bg-center"
      style={{
        backgroundImage: "url('/sectionImg.jpg')",
        backgroundSize: "cover",
        // backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        height: "100vh",
        width: "100%",
      }}
    >
      <header
        className={`fixed inset-x-0 top-0 z-50 transition-transform duration-300 ${
          showNavbar ? "translate-y-0" : "-translate-y-full"
        }`}
      >
        <nav
          aria-label="Global"
          className="flex items-center justify-between p-3 lg:px-12 backdrop-blur-md bg-black/20 border-b border-white/10"
        >
          {/* Brand Section - Creative Design */}
          <div className="flex lg:flex-1">
            <a
              href="/"
              className="group flex items-center space-x-3 -m-1.5 p-1.5"
            >
              {/* <div className="hidden lg:relative lg:inline-block">
                <div className="w-10 h-10 bg-gradient-to-br from-orange-500 via-red-500 to-orange-600 rounded-xl flex items-center justify-center transform group-hover:rotate-12 group-hover:scale-110 transition-all duration-300 shadow-lg">
                  <HomeIcon className="w-6 h-6 text-white" />
                </div>
                <div className="absolute -top-1 -right-1 w-4 h-4 bg-gradient-to-r from-orange-400 to-red-500 rounded-full animate-pulse"></div>
              </div> */}
              <div className="hidden sm:block">
                <span className="text-xl font-bold bg-gradient-to-r from-white via-orange-100 to-red-200 bg-clip-text text-transparent">
                  CASSAPARVA
                </span>
                {/* <div className="text-xs text-gray-300 font-medium">
                  Emlak Yönetimi
                </div> */}
              </div>
            </a>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex lg:hidden">
            <button
              type="button"
              onClick={() => setMobileMenuOpen(true)}
              className="relative -m-2.5 inline-flex items-center justify-center rounded-xl p-2.5 text-gray-200 bg-white/10 backdrop-blur-sm hover:bg-white/20 transition-all duration-200 border border-white/20"
            >
              <span className="sr-only">Open main menu</span>
              <Bars3Icon aria-hidden="true" className="size-6" />
            </button>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex lg:gap-x-8">
            {navigation.map((item, index) => (
              <a
                key={item.name}
                href={item.href}
                className="relative text-lg font-semibold text-white hover:text-orange-400 transition-colors duration-200 group"
              >
                {item.name}
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-orange-400 to-red-400 group-hover:w-full transition-all duration-300"></span>
              </a>
            ))}
          </div>

          {/* Admin Login Button */}
          <div className="hidden lg:flex lg:flex-1 lg:justify-end">
            <Link
              href="/admin"
              className="group relative inline-flex items-center px-6 py-2.5 text-sm font-semibold text-white bg-gradient-to-r from-orange-600 to-red-600 rounded-xl hover:from-orange-700 hover:to-red-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105 active:scale-95"
            >
              <ShieldCheckIcon className="w-4 h-4 mr-2" />
              Log In
              <span className="ml-2 group-hover:translate-x-1 transition-transform duration-200">
                &rarr;
              </span>
            </Link>
          </div>
        </nav>

        <Dialog
          open={mobileMenuOpen}
          onClose={setMobileMenuOpen}
          className="lg:hidden"
        >
          <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm" />
          <DialogPanel className="fixed inset-y-0 right-0 z-50 w-full overflow-y-auto bg-gradient-to-br from-gray-900 via-gray-800 to-black p-6 sm:max-w-sm border-l border-white/10">
            <div className="flex items-center justify-between mb-8">
              {/* <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
                  <HomeIcon className="w-5 h-5 text-white" />
                </div>
                <span className="text-lg font-bold text-white">CASSAPARVA</span>
              </div> */}
              <button
                type="button"
                onClick={() => setMobileMenuOpen(false)}
                className="rounded-xl p-2.5 text-gray-200 bg-white/10 hover:bg-white/20 transition-all duration-200 border border-white/20"
              >
                <span className="sr-only">Close menu</span>
                <XMarkIcon aria-hidden="true" className="size-6" />
              </button>
            </div>

            <div className="flow-root">
              <div className="-my-6 divide-y divide-white/10">
                <div className="space-y-1 py-6">
                  {navigation.map((item) => (
                    <a
                      key={item.name}
                      href={item.href}
                      className="group flex items-center px-3 py-3 text-base font-semibold text-white hover:bg-gradient-to-r hover:from-orange-500/20 hover:to-red-500/20 rounded-xl transition-all duration-200"
                    >
                      <span className="group-hover:translate-x-2 transition-transform duration-200 active:scale-[0.95]">
                        {item.name}
                      </span>
                      <span className="ml-auto opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                        &rarr;
                      </span>
                    </a>
                  ))}
                </div>
                <div className="py-6">
                  <Link
                    href="/admin"
                    className="group flex items-center px-3 py-3 text-base font-semibold text-white bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700 rounded-xl transition-all duration-200 shadow-lg"
                  >
                    <ShieldCheckIcon className="w-5 h-5 mr-3" />
                    Admin Panel
                    <span className="ml-auto group-hover:translate-x-1 transition-transform duration-200">
                      &rarr;
                    </span>
                  </Link>
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
            className="relative left-[calc(50%-11rem)] aspect-1155/678 w-144.5 -translate-x-1/2 rotate-30 bg-linear-to-tr from-[#ff8c42] to-[#ff6b35] opacity-30 sm:left-[calc(50%-30rem)] sm:w-288.75"
          />
        </div>

        <div className="mx-auto max-w-2xl py-32">
          <div className="text-center">
            <h1 className="text-5xl font-semibold tracking-tight text-balance text-white sm:text-7xl">
              CASSAPARVA
            </h1>
            <p className="mt-8 text-lg font-medium text-pretty text-gray-400 sm:text-xl/8">
              ALT SLOGAN
            </p>

            <div className="flex flex-1 justify-center lg:hidden mt-10 hover:scale-[1.03] active:scale-[0.95] transition">
              <Link
                href="/admin"
                className="text-sm/6 font-semibold text-white border rounded p-2"
              >
                Admin Giriş <span aria-hidden="true">&rarr;</span>
              </Link>
            </div>
          </div>
        </div>

        {/* Removed bottom blur gradient to avoid white band between sections */}
      </div>

      {/* About Us Section - Stunning Design */}
      <section id="hakkimizda" className="relative bg-white overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 bg-gradient-to-br from-gray-50 via-white to-gray-100"></div>
        <div className="absolute top-0 left-0 w-full h-full opacity-5">
          <div className="absolute top-20 left-10 w-32 h-32 bg-gradient-to-r from-orange-400 to-red-500 rounded-full blur-3xl"></div>
          <div className="absolute bottom-20 right-10 w-40 h-40 bg-gradient-to-r from-orange-500 to-red-600 rounded-full blur-3xl"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-60 h-60 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full blur-3xl"></div>
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 items-center">
            {/* Left Column - Image with Overlay */}
            <div className="relative group hidden lg:block">
              {/* Main Image Container */}
              <div className="relative overflow-hidden shadow-2xl transform group-hover:scale-[1.02] transition-all duration-700">
                <div
                  className="bg-position-[70%] aspect-[4/5] lg:aspect-[3/4] bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center"
                  style={{
                    backgroundImage: "url('/aboutImage.jpg')",
                    backgroundSize: "cover",
                    // backgroundPosition: "center",
                    backgroundRepeat: "no-repeat",
                  }}
                >
                  {/* Image Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent"></div>

                  {/* Experience Badge - Hidden on mobile */}
                  <div className="hidden lg:block absolute bottom-6 right-6 transform group-hover:scale-110 transition-all duration-500">
                    <div className="bg-gradient-to-r from-orange-500 to-red-500 text-white px-6 py-4 rounded-xl shadow-xl backdrop-blur-sm border border-white/20">
                      <div className="text-center">
                        <div className="text-2xl lg:text-3xl font-bold leading-tight">
                          35 yıllık
                        </div>
                        <div className="text-sm lg:text-base font-medium opacity-90">
                          deneyim
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Modern Decorative Border */}
              <div className="absolute inset-0 pointer-events-none">
                {/* Top accent line */}
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-orange-500 to-transparent"></div>
                {/* Right accent line */}
                <div className="absolute top-0 right-0 w-1 h-full bg-gradient-to-b from-orange-500 via-transparent to-orange-500"></div>
                {/* Bottom accent line */}
                <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-orange-400 to-transparent"></div>
                {/* Left accent line */}
                <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-orange-400 via-transparent to-orange-400"></div>

                {/* Corner decorations */}
                <div className="absolute top-0 left-0 w-3 h-3 bg-gradient-to-br from-orange-500 to-red-500 rounded-full"></div>
                <div className="absolute top-0 right-0 w-3 h-3 bg-gradient-to-bl from-orange-500 to-red-500 rounded-full"></div>
                <div className="absolute bottom-0 left-0 w-3 h-3 bg-gradient-to-tr from-orange-500 to-red-500 rounded-full"></div>
                <div className="absolute bottom-0 right-0 w-3 h-3 bg-gradient-to-tl from-orange-500 to-red-500 rounded-full"></div>
              </div>

              {/* Decorative Elements */}
              <div className="absolute -top-4 -left-4 w-24 h-24 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full opacity-20 blur-xl"></div>
              <div className="absolute -bottom-4 -right-4 w-32 h-32 bg-gradient-to-r from-orange-400 to-red-500 rounded-full opacity-20 blur-xl"></div>
            </div>

            {/* Right Column - Content */}
            <div className="space-y-8">
              {/* Section Label */}
              <div className="inline-block">
                <span className="inline-flex items-center px-4 py-2 rounded-full text-sm font-semibold bg-gradient-to-r from-orange-100 to-red-100 text-orange-800 border border-orange-200">
                  <span className="w-2 h-2 bg-orange-500 rounded-full mr-2 animate-pulse"></span>
                  HAKKIMIZDA
                </span>
              </div>

              {/* Main Heading */}
              <div className="space-y-4">
                <h2 className="text-4xl lg:text-5xl xl:text-6xl font-bold text-gray-900 leading-tight">
                  <span className="bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 bg-clip-text text-transparent">
                    CASSAPARVA'ya
                  </span>
                  <br />
                  <span className="bg-gradient-to-r from-orange-500 via-red-500 to-orange-500 bg-clip-text text-transparent">
                    Hoş Geldiniz
                  </span>
                </h2>

                {/* Decorative Line */}
                <div className="flex items-center space-x-4">
                  <div className="h-1 w-16 bg-gradient-to-r from-orange-500 to-red-500 rounded-full"></div>
                  <div className="h-1 w-8 bg-gradient-to-r from-orange-300 to-red-300 rounded-full"></div>
                </div>

                {/* Tagline */}
                <p className="text-xl lg:text-2xl text-gray-600 font-medium">
                  Size özel hizmet sunuyoruz
                </p>
              </div>

              {/* Description */}
              <div className="space-y-6">
                <p className="text-lg text-gray-600 leading-relaxed">
                  CASSAPARVA olarak, emlak sektöründe 35 yıllık deneyimimizle
                  müşterilerimize en kaliteli hizmeti sunmaya devam ediyoruz.
                  Modern teknoloji ve geleneksel değerlerimizi harmanlayarak,
                  hayalinizdeki evi bulmanız için buradayız.
                </p>

                <p className="text-lg text-gray-600 leading-relaxed">
                  Profesyonel ekibimiz, geniş portföyümüz ve müşteri memnuniyeti
                  odaklı yaklaşımımızla, emlak yolculuğunuzda güvenilir bir
                  partner olmaktan gurur duyuyoruz.
                </p>
              </div>

              {/* Call to Action */}
              {/* <div className="flex flex-col sm:flex-row gap-4">
                <Link href="#">
                  <button className="group relative px-8 py-4 bg-gradient-to-r from-orange-500 to-red-500 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 active:scale-95 transition-all duration-300 overflow-hidden">
                    <span className="relative z-10 flex items-center justify-center space-x-2">
                      <span>Başlayalım</span>
                      <span className="group-hover:translate-x-1 transition-transform duration-300">
                        →
                      </span>
                    </span>
                    <div className="absolute inset-0 bg-gradient-to-r from-orange-600 to-red-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  </button>
                </Link>

                <Link href="#">
                  <button className="group px-8 py-4 border-2 border-gray-300 text-gray-700 font-semibold rounded-xl hover:border-orange-500 hover:text-orange-500 transform hover:scale-105 active:scale-95 transition-all duration-300">
                    <span className="flex items-center justify-center space-x-2">
                      <span>Portföyümüzü İncele</span>
                      <span className="group-hover:translate-x-1 transition-transform duration-300">
                        →
                      </span>
                    </span>
                  </button>
                </Link>
              </div> */}

              {/* Stats */}
              <div className="grid grid-cols-2 gap-6 pt-8 border-t border-gray-200">
                <div className="text-center">
                  <div className="text-3xl font-bold text-gray-900">500+</div>
                  <div className="text-sm text-gray-600 font-medium">
                    Mutlu Müşteri
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-gray-900">1000+</div>
                  <div className="text-sm text-gray-600 font-medium">
                    Başarılı Satış
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Scroll to Top Button */}
        <div className="fixed bottom-8 right-8 z-50">
          <button className="group w-12 h-12 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-full shadow-lg hover:shadow-xl transform hover:scale-110 active:scale-95 transition-all duration-300 flex items-center justify-center">
            <span className="group-hover:-translate-y-0.5 transition-transform duration-300">
              ↑
            </span>
          </button>
        </div>
      </section>

      {/* Best Work Section - Interior Views */}
      <section id="calismalarimiz" className="relative bg-gray-50 py-20 lg:py-32">
        {/* Background Pattern */}
        <div className="absolute inset-0 bg-gradient-to-br from-gray-50 via-white to-gray-100"></div>
        <div className="absolute top-0 left-0 w-full h-full opacity-5">
          <div className="absolute top-20 right-10 w-32 h-32 bg-gradient-to-r from-orange-400 to-red-500 rounded-full blur-3xl"></div>
          <div className="absolute bottom-20 left-10 w-40 h-40 bg-gradient-to-r from-orange-500 to-red-600 rounded-full blur-3xl"></div>
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Section Header */}
          <div className="text-center mb-16">
            <div className="inline-block mb-6">
              <span className="inline-flex items-center px-4 py-2 rounded-full text-sm font-semibold bg-gradient-to-r from-orange-100 to-red-100 text-orange-800 border border-orange-200">
                <span className="w-2 h-2 bg-orange-500 rounded-full mr-2 animate-pulse"></span>
                EN İYİ ÇALIŞMALARIMIZ
              </span>
            </div>

            <h2 className="text-4xl lg:text-5xl xl:text-6xl font-bold text-gray-900 leading-tight mb-6">
              <span className="bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 bg-clip-text text-transparent">
                İç Mekan
              </span>
              <br />
              <span className="bg-gradient-to-r from-orange-500 via-red-500 to-orange-500 bg-clip-text text-transparent">
                Görünümleri
              </span>
            </h2>

            <div className="flex items-center justify-center space-x-4 mb-8">
              <div className="h-1 w-16 bg-gradient-to-r from-orange-500 to-red-500 rounded-full"></div>
              <div className="h-1 w-8 bg-gradient-to-r from-orange-300 to-red-300 rounded-full"></div>
            </div>

            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Modern tasarım anlayışımızla hayalinizdeki yaşam alanlarını
              yaratıyoruz
            </p>
          </div>

          {/* Interior View Cards Slider */}
          <div className="relative overflow-hidden">
            {/* Desktop Slider - 3 cards per slide */}
            <div className="hidden lg:block">
              <div
                className="flex transition-transform duration-700 ease-in-out"
                style={{
                  transform: `translateX(-${currentSlide * 100}%)`,
                }}
              >
                {/* Slide 1 */}
                <div className="w-full flex-shrink-0">
                  <div className="grid grid-cols-3 gap-12">
                    {interiorCards.slice(0, 3).map((card) => (
                      <div key={card.id} className="group relative">
                        <div className="relative overflow-hidden rounded-2xl shadow-2xl transform group-hover:scale-105 group-hover:rotate-1 transition-all duration-500 ease-out">
                          {/* Animated Background Glow */}
                          <div className="absolute inset-0 bg-gradient-to-r from-orange-400 via-red-500 to-orange-600 opacity-0 group-hover:opacity-20 blur-xl transition-all duration-500 transform group-hover:scale-110"></div>

                          <div
                            className="aspect-[4/5] bg-gradient-to-br from-gray-200 to-gray-300 relative overflow-hidden"
                            style={{
                              backgroundImage: `url('${card.image}')`,
                              backgroundSize: "cover",
                              backgroundPosition: "center",
                              backgroundRepeat: "no-repeat",
                            }}
                          >
                            {/* Dynamic Image Overlay with Gradient Animation */}
                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent group-hover:from-black/40 group-hover:via-orange-500/20 group-hover:to-transparent transition-all duration-500"></div>

                            {/* Floating Particles Effect */}
                            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700">
                              <div className="absolute top-4 right-4 w-2 h-2 bg-orange-400 rounded-full animate-ping"></div>
                              <div className="absolute top-8 right-8 w-1 h-1 bg-red-400 rounded-full animate-pulse delay-300"></div>
                              <div className="absolute top-12 right-6 w-1.5 h-1.5 bg-yellow-400 rounded-full animate-bounce delay-700"></div>
                              <div className="absolute bottom-16 left-4 w-1 h-1 bg-orange-300 rounded-full animate-ping delay-500"></div>
                              <div className="absolute bottom-20 left-8 w-2 h-2 bg-red-300 rounded-full animate-pulse delay-200"></div>
                            </div>

                            {/* Card Content with Slide Up Animation */}
                            <div className="absolute bottom-0 left-0 right-0 p-6 transform translate-y-2 group-hover:translate-y-0 transition-all duration-500 ease-out">
                              <div className="text-white">
                                <div className="text-sm font-semibold text-orange-300 mb-2 transform -translate-x-2 group-hover:translate-x-0 transition-transform duration-500 delay-100">
                                  KEŞFET
                                </div>
                                <h3 className="text-xl font-bold mb-2 transform -translate-x-2 group-hover:translate-x-0 transition-transform duration-500 delay-200">
                                  {card.title}
                                </h3>
                                <p className="text-sm text-gray-200 opacity-90 transform -translate-x-2 group-hover:translate-x-0 transition-transform duration-500 delay-300">
                                  {card.description}
                                </p>
                              </div>
                            </div>

                            {/* Shimmer Effect */}
                            <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-out bg-gradient-to-r from-transparent via-white/20 to-transparent skew-x-12"></div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Slide 2 */}
                <div className="w-full flex-shrink-0">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-12">
                    {interiorCards.slice(3, 6).map((card) => (
                      <div key={card.id} className="group relative">
                        <div className="relative overflow-hidden rounded-2xl shadow-2xl transform group-hover:scale-105 group-hover:rotate-1 transition-all duration-500 ease-out">
                          {/* Animated Background Glow */}
                          <div className="absolute inset-0 bg-gradient-to-r from-orange-400 via-red-500 to-orange-600 opacity-0 group-hover:opacity-20 blur-xl transition-all duration-500 transform group-hover:scale-110"></div>

                          <div
                            className="aspect-[4/5] bg-gradient-to-br from-gray-200 to-gray-300 relative overflow-hidden"
                            style={{
                              backgroundImage: `url('${card.image}')`,
                              backgroundSize: "cover",
                              backgroundPosition: "center",
                              backgroundRepeat: "no-repeat",
                            }}
                          >
                            {/* Dynamic Image Overlay with Gradient Animation */}
                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent group-hover:from-black/40 group-hover:via-orange-500/20 group-hover:to-transparent transition-all duration-500"></div>

                            {/* Floating Particles Effect */}
                            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700">
                              <div className="absolute top-4 right-4 w-2 h-2 bg-orange-400 rounded-full animate-ping"></div>
                              <div className="absolute top-8 right-8 w-1 h-1 bg-red-400 rounded-full animate-pulse delay-300"></div>
                              <div className="absolute top-12 right-6 w-1.5 h-1.5 bg-yellow-400 rounded-full animate-bounce delay-700"></div>
                              <div className="absolute bottom-16 left-4 w-1 h-1 bg-orange-300 rounded-full animate-ping delay-500"></div>
                              <div className="absolute bottom-20 left-8 w-2 h-2 bg-red-300 rounded-full animate-pulse delay-200"></div>
                            </div>

                            {/* Card Content with Slide Up Animation */}
                            <div className="absolute bottom-0 left-0 right-0 p-6 transform translate-y-2 group-hover:translate-y-0 transition-all duration-500 ease-out">
                              <div className="text-white">
                                <div className="text-sm font-semibold text-orange-300 mb-2 transform -translate-x-2 group-hover:translate-x-0 transition-transform duration-500 delay-100">
                                  KEŞFET
                                </div>
                                <h3 className="text-xl font-bold mb-2 transform -translate-x-2 group-hover:translate-x-0 transition-transform duration-500 delay-200">
                                  {card.title}
                                </h3>
                                <p className="text-sm text-gray-200 opacity-90 transform -translate-x-2 group-hover:translate-x-0 transition-transform duration-500 delay-300">
                                  {card.description}
                                </p>
                              </div>
                            </div>

                            {/* Shimmer Effect */}
                            <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-out bg-gradient-to-r from-transparent via-white/20 to-transparent skew-x-12"></div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Slide 3 */}
                <div className="w-full flex-shrink-0">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-12">
                    {interiorCards.slice(6, 8).map((card) => (
                      <div key={card.id} className="group relative">
                        <div className="relative overflow-hidden rounded-2xl shadow-2xl transform group-hover:scale-105 group-hover:rotate-1 transition-all duration-500 ease-out">
                          {/* Animated Background Glow */}
                          <div className="absolute inset-0 bg-gradient-to-r from-orange-400 via-red-500 to-orange-600 opacity-0 group-hover:opacity-20 blur-xl transition-all duration-500 transform group-hover:scale-110"></div>

                          <div
                            className="aspect-[4/5] bg-gradient-to-br from-gray-200 to-gray-300 relative overflow-hidden"
                            style={{
                              backgroundImage: `url('${card.image}')`,
                              backgroundSize: "cover",
                              backgroundPosition: "center",
                              backgroundRepeat: "no-repeat",
                            }}
                          >
                            {/* Dynamic Image Overlay with Gradient Animation */}
                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent group-hover:from-black/40 group-hover:via-orange-500/20 group-hover:to-transparent transition-all duration-500"></div>

                            {/* Floating Particles Effect */}
                            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700">
                              <div className="absolute top-4 right-4 w-2 h-2 bg-orange-400 rounded-full animate-ping"></div>
                              <div className="absolute top-8 right-8 w-1 h-1 bg-red-400 rounded-full animate-pulse delay-300"></div>
                              <div className="absolute top-12 right-6 w-1.5 h-1.5 bg-yellow-400 rounded-full animate-bounce delay-700"></div>
                              <div className="absolute bottom-16 left-4 w-1 h-1 bg-orange-300 rounded-full animate-ping delay-500"></div>
                              <div className="absolute bottom-20 left-8 w-2 h-2 bg-red-300 rounded-full animate-pulse delay-200"></div>
                            </div>

                            {/* Card Content with Slide Up Animation */}
                            <div className="absolute bottom-0 left-0 right-0 p-6 transform translate-y-2 group-hover:translate-y-0 transition-all duration-500 ease-out">
                              <div className="text-white">
                                <div className="text-sm font-semibold text-orange-300 mb-2 transform -translate-x-2 group-hover:translate-x-0 transition-transform duration-500 delay-100">
                                  KEŞFET
                                </div>
                                <h3 className="text-xl font-bold mb-2 transform -translate-x-2 group-hover:translate-x-0 transition-transform duration-500 delay-200">
                                  {card.title}
                                </h3>
                                <p className="text-sm text-gray-200 opacity-90 transform -translate-x-2 group-hover:translate-x-0 transition-transform duration-500 delay-300">
                                  {card.description}
                                </p>
                              </div>
                            </div>

                            {/* Shimmer Effect */}
                            <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-out bg-gradient-to-r from-transparent via-white/20 to-transparent skew-x-12"></div>
                          </div>
                        </div>
                      </div>
                    ))}
                    {/* Empty space for the third card in the last slide */}
                    <div className="hidden lg:block"></div>
                  </div>
                </div>
              </div>
            </div>

            {/* Mobile Slider - 1 card per slide */}
            <div className="lg:hidden">
              <div
                className="flex transition-transform duration-700 ease-in-out"
                style={{
                  transform: `translateX(-${currentSlide * 100}%)`,
                }}
              >
                {interiorCards.map((card) => (
                  <div key={card.id} className="w-full flex-shrink-0 px-4">
                    <div className="group relative">
                      <div className="relative overflow-hidden rounded-2xl shadow-2xl transform group-hover:scale-105 group-hover:rotate-1 transition-all duration-500 ease-out">
                        {/* Animated Background Glow */}
                        <div className="absolute inset-0 bg-gradient-to-r from-orange-400 via-red-500 to-orange-600 opacity-0 group-hover:opacity-20 blur-xl transition-all duration-500 transform group-hover:scale-110"></div>

                        <div
                          className="aspect-[4/5] bg-gradient-to-br from-gray-200 to-gray-300 relative overflow-hidden"
                          style={{
                            backgroundImage: `url('${card.image}')`,
                            backgroundSize: "cover",
                            backgroundPosition: "center",
                            backgroundRepeat: "no-repeat",
                          }}
                        >
                          {/* Dynamic Image Overlay with Gradient Animation */}
                          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent group-hover:from-black/40 group-hover:via-orange-500/20 group-hover:to-transparent transition-all duration-500"></div>

                          {/* Floating Particles Effect */}
                          <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700">
                            <div className="absolute top-4 right-4 w-2 h-2 bg-orange-400 rounded-full animate-ping"></div>
                            <div className="absolute top-8 right-8 w-1 h-1 bg-red-400 rounded-full animate-pulse delay-300"></div>
                            <div className="absolute top-12 right-6 w-1.5 h-1.5 bg-yellow-400 rounded-full animate-bounce delay-700"></div>
                            <div className="absolute bottom-16 left-4 w-1 h-1 bg-orange-300 rounded-full animate-ping delay-500"></div>
                            <div className="absolute bottom-20 left-8 w-2 h-2 bg-red-300 rounded-full animate-pulse delay-200"></div>
                          </div>

                          {/* Card Content with Slide Up Animation */}
                          <div className="absolute bottom-0 left-0 right-0 p-6 transform translate-y-2 group-hover:translate-y-0 transition-all duration-500 ease-out">
                            <div className="text-white">
                              <div className="text-sm font-semibold text-orange-300 mb-2 transform -translate-x-2 group-hover:translate-x-0 transition-transform duration-500 delay-100">
                                KEŞFET
                              </div>
                              <h3 className="text-xl font-bold mb-2 transform -translate-x-2 group-hover:translate-x-0 transition-transform duration-500 delay-200">
                                {card.title}
                              </h3>
                              <p className="text-sm text-gray-200 opacity-90 transform -translate-x-2 group-hover:translate-x-0 transition-transform duration-500 delay-300">
                                {card.description}
                              </p>
                            </div>
                          </div>

                          {/* Shimmer Effect */}
                          <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-out bg-gradient-to-r from-transparent via-white/20 to-transparent skew-x-12"></div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Navigation Buttons */}
            <button
              onClick={prevSlide}
              className="absolute left-4 top-1/2 transform -translate-y-1/2 z-10 w-12 h-12 bg-white/90 backdrop-blur-sm rounded-full shadow-lg hover:bg-white hover:shadow-xl transition-all duration-300 flex items-center justify-center group cursor-pointer"
            >
              <ChevronLeftIcon className="w-6 h-6 text-gray-700 group-hover:text-orange-500 transition-colors duration-300" />
            </button>

            <button
              onClick={nextSlide}
              className="absolute right-4 top-1/2 transform -translate-y-1/2 z-10 w-12 h-12 bg-white/90 backdrop-blur-sm rounded-full shadow-lg hover:bg-white hover:shadow-xl transition-all duration-300 flex items-center justify-center group cursor-pointer"
            >
              <ChevronRightIcon className="w-6 h-6 text-gray-700 group-hover:text-orange-500 transition-colors duration-300" />
            </button>
          </div>

          {/* Interactive Slider Navigation Dots */}
          <div className="flex justify-center mt-12">
            <div className="flex space-x-3">
              {/* Desktop dots - 3 slides */}
              <div className="hidden lg:flex space-x-3">
                {Array.from({ length: totalSlides }, (_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentSlide(index)}
                    className={`cursor-pointer transition-all duration-300 rounded-full ${
                      currentSlide === index
                        ? "w-8 h-2 bg-gradient-to-r from-orange-500 to-red-500 shadow-lg"
                        : "w-3 h-1 bg-gradient-to-r from-orange-300 to-red-300 hover:from-orange-400 hover:to-red-400"
                    }`}
                    aria-label={`Slide ${index + 1}`}
                  />
                ))}
              </div>

              {/* Mobile dots - 8 slides */}
              <div className="lg:hidden flex space-x-2">
                {Array.from({ length: totalMobileSlides }, (_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentSlide(index)}
                    className={`transition-all duration-300 rounded-full ${
                      currentSlide === index
                        ? "w-6 h-1.5 bg-gradient-to-r from-orange-500 to-red-500 shadow-lg"
                        : "w-2 h-1 bg-gradient-to-r from-orange-300 to-red-300 hover:from-orange-400 hover:to-red-400"
                    }`}
                    aria-label={`Slide ${index + 1}`}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Call to Action */}
          <div className="text-center mt-16">
            <Link href="#">
              <button className="group relative px-8 py-4 bg-gradient-to-r from-orange-500 to-red-500 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 active:scale-95 transition-all duration-300 overflow-hidden">
                <span className="relative z-10 flex items-center justify-center space-x-2">
                  <span>Tüm Projeleri Gör</span>
                  <span className="group-hover:translate-x-1 transition-transform duration-300">
                    →
                  </span>
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-orange-600 to-red-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </button>
            </Link>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="relative py-20 lg:py-32 flex items-center justify-center overflow-hidden">
        {/* Background Image */}
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage:
              "url('https://images.unsplash.com/photo-1586023492125-27b2c045efd7?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2000&q=80')",
          }}
        >
          {/* Dark Overlay */}
          <div className="absolute inset-0 bg-black/60"></div>
        </div>

        {/* Content */}
        <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          {/* Section Label */}
          <div className="mb-8">
            <span className="inline-flex items-center px-4 py-2 rounded-full text-sm font-semibold bg-white/10 backdrop-blur-sm text-white border border-white/20">
              <span className="w-2 h-2 bg-orange-400 rounded-full mr-2 animate-pulse"></span>
              MÜŞTERİ DENEYİMLERİ
            </span>
          </div>

          {/* Main Title */}
          <h2 className="text-4xl lg:text-5xl font-bold text-white mb-6 font-serif">
            Müşteri Yorumları
          </h2>

          {/* Decorative Line */}
          <div className="flex items-center justify-center space-x-4 mb-8">
            <div className="h-1 w-16 bg-gradient-to-r from-orange-400 to-red-400 rounded-full"></div>
            <div className="h-1 w-8 bg-gradient-to-r from-orange-300 to-red-300 rounded-full"></div>
          </div>

          {/* Testimonial Content */}
          <div className="relative max-w-4xl mx-auto">
            {/* Decorative Quote Icon for Testimonial */}
            <div
              className="flex justify-center"
              aria-hidden="true"
              title="Alıntı işareti"
            >
              <span
                className="text-7xl lg:text-8xl text-orange-200 font-serif select-none drop-shadow-lg"
                style={{
                  fontFamily: "'Playfair Display', 'Georgia', serif",
                  lineHeight: 1,
                }}
              >
                &ldquo;
              </span>
            </div>

            {/* Testimonial Text */}
            <blockquote className="text-lg lg:text-xl text-white leading-relaxed mb-8 font-light">
              {testimonials[currentTestimonial].quote}
            </blockquote>

            {/* Customer Info */}
            <div className="flex items-center justify-center space-x-6">
              {/* Profile Image */}
              <div className="w-16 h-16 rounded-full overflow-hidden border-4 border-white/20">
                <img
                  src={testimonials[currentTestimonial].image}
                  alt={testimonials[currentTestimonial].name}
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Customer Details */}
              <div className="text-left">
                <h3 className="text-xl font-semibold text-white">
                  {testimonials[currentTestimonial].name}
                </h3>
                <p className="text-orange-300 font-medium">
                  {testimonials[currentTestimonial].role}
                </p>
              </div>
            </div>
          </div>

          {/* Navigation Arrows */}
          <div className="flex items-center justify-center space-x-8 mt-10">
            <button
              onClick={prevTestimonial}
              className="group w-14 h-14 bg-white/10 backdrop-blur-sm rounded-full border border-white/20 hover:bg-white/20 transition-all duration-300 flex items-center justify-center cursor-pointer"
            >
              <ChevronLeftIcon className="w-6 h-6 text-white group-hover:text-orange-400 transition-colors duration-300" />
            </button>

            <button
              onClick={nextTestimonial}
              className="group w-14 h-14 bg-white/10 backdrop-blur-sm rounded-full border border-white/20 hover:bg-white/20 transition-all duration-300 flex items-center justify-center cursor-pointer"
            >
              <ChevronRightIcon className="w-6 h-6 text-white group-hover:text-orange-400 transition-colors duration-300" />
            </button>
          </div>

          {/* Testimonial Dots */}
          <div className="flex justify-center space-x-3 mt-8">
            {testimonials.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentTestimonial(index)}
                className={`transition-all duration-300 rounded-full ${
                  currentTestimonial === index
                    ? "w-8 h-2 bg-gradient-to-r from-orange-400 to-red-400"
                    : "w-3 h-1 bg-white/30 hover:bg-white/50"
                }`}
                aria-label={`Testimonial ${index + 1}`}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Company Info */}
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                {/* <div className="w-10 h-10 bg-gradient-to-br from-orange-500 via-red-500 to-orange-600 rounded-xl flex items-center justify-center">
                  <HomeIcon className="w-6 h-6 text-white" />
                </div> */}
                <div>
                  <h3 className="text-xl font-bold">CASSAPARVA</h3>
                  <p className="text-sm text-gray-400">Emlak Yönetimi</p>
                </div>
              </div>
              <p className="text-gray-300 leading-relaxed">
                35 yıllık deneyimimizle emlak sektöründe güvenilir partneriniz.
                Modern teknoloji ve geleneksel değerlerimizi harmanlayarak
                hizmet veriyoruz.
              </p>
            </div>

            {/* Contact Info */}
            <div className="space-y-4">
              <h4 className="text-lg font-semibold text-orange-400">
                İletişim
              </h4>
              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <PhoneIcon className="w-5 h-5 text-orange-400" />
                  <span className="text-gray-300">+90 (212) 555 0123</span>
                </div>
                <div className="flex items-center space-x-3">
                  <EnvelopeIcon className="w-5 h-5 text-orange-400" />
                  <span className="text-gray-300">info@cassaparva.com</span>
                </div>
                <div className="flex items-center space-x-3">
                  <MapPinIcon className="w-5 h-5 text-orange-400" />
                  <span className="text-gray-300">Mersin, Türkiye</span>
                </div>
              </div>

              {/* Social Media */}
              <div className="flex items-center space-x-4 mt-6">
                <a
                  href="https://instagram.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center hover:bg-gradient-to-r hover:from-purple-500 hover:to-pink-500 transition-all duration-300 transform hover:scale-110"
                >
                  <svg
                    className="w-5 h-5 text-gray-400 group-hover:text-white transition-colors duration-300"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                  </svg>
                </a>
                <a
                  href="https://twitter.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center hover:bg-blue-500 transition-all duration-300 transform hover:scale-110"
                >
                  <svg
                    className="w-5 h-5 text-gray-400 group-hover:text-white transition-colors duration-300"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z" />
                  </svg>
                </a>

                <a
                  href="https://www.linkedin.com/in/mustafakaplan0/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center hover:bg-orange-500 transition-all duration-300 transform hover:scale-110"
                >
                  <svg
                    className="w-5 h-5 text-gray-400 group-hover:text-white transition-colors duration-300"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                  </svg>
                </a>
                <a
                  href="https://facebook.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center hover:bg-blue-600 transition-all duration-300 transform hover:scale-110"
                >
                  <svg
                    className="w-5 h-5 text-gray-400 group-hover:text-white transition-colors duration-300"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                  </svg>
                </a>
              </div>
            </div>

            {/* Quick Links */}
            <div className="space-y-4">
              <h4 className="text-lg font-semibold text-orange-400">
                Hızlı Linkler
              </h4>
              <div className="space-y-2">
                <Link
                  href="#hakkimizda"
                  className="block text-gray-300 hover:text-orange-400 transition-colors duration-200"
                >
                  Hakkımızda
                </Link>
                <Link
                  href="#calismalarimiz"
                  className="block text-gray-300 hover:text-orange-400 transition-colors duration-200"
                >
                  Çalışmalarımız
                </Link>
                <Link
                  href="#"
                  className="block text-gray-300 hover:text-orange-400 transition-colors duration-200"
                >
                  Hizmetlerimiz
                </Link>
                <Link
                  href="/iletisim"
                  className="block text-gray-300 hover:text-orange-400 transition-colors duration-200"
                >
                  İletişim
                </Link>
              </div>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="border-t border-gray-800 mt-12 pt-8">
            <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
              <p className="text-gray-400 text-sm">
                © 2025 CASSAPARVA. Tüm hakları saklıdır.
              </p>
              <div className="flex items-center space-x-6">
                <a href="https://www.linkedin.com/in/mustafakaplan0/">
                  <span className="text-gray-400 text-sm hover:text-orange-400 transition">
                    by Mustafa Kaplan
                  </span>
                </a>
                <div className="flex space-x-2">
                  <div className="w-2 h-2 bg-orange-400 rounded-full"></div>
                  <div className="w-2 h-2 bg-red-400 rounded-full"></div>
                  <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
