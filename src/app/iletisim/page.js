"use client";
import { motion } from "framer-motion";
import { Mail, Phone, MapPin, ChevronDown } from "lucide-react";
import Link from "next/link";
import { useState, useEffect } from "react";
import { Dialog, DialogPanel } from "@headlessui/react";
import "../globals.css";
import "../style.css";
import {
  Bars3Icon,
  XMarkIcon,
  MapPinIcon,
  PhoneIcon,
  EnvelopeIcon,
  ShieldCheckIcon,
} from "@heroicons/react/24/outline";

const navigation = [
  { name: "Ana Sayfa", href: "/" },
  { name: "Hakkımızda", href: "/#hakkimizda" },
  { name: "Çalışmalarımız", href: "/#calismalarimiz" },
  // { name: "Görevlerim", href: "#" },
];
// Partikül bileşeni
const Particles = () => {
  const particles = Array.from({ length: 25 });
  return (
    <div className="absolute inset-0 overflow-hidden -z-10">
      {particles.map((_, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, y: 0 }}
          animate={{
            opacity: [0.2, 0.6, 0.2],
            y: [-20, -100],
            x: Math.sin(i) * 30,
          }}
          transition={{
            duration: 8 + i * 0.3,
            repeat: Infinity,
            repeatType: "mirror",
          }}
          className="absolute w-2 h-2 rounded-full bg-orange-400/70"
          style={{
            top: Math.random() * 600 + "px",
            left: Math.random() * 1200 + "px",
          }}
        />
      ))}
    </div>
  );
};

// FAQ bileşeni
const FAQItem = ({ question, answer }) => {
  const [open, setOpen] = useState(false);
  return (
    <div className="border-b border-gray-200 py-3">
      <button
        onClick={() => setOpen(!open)}
        className="flex justify-between items-center w-full text-left"
      >
        <span className="text-gray-800 font-medium">{question}</span>
        <ChevronDown
          className={`w-5 h-5 transition-transform ${open ? "rotate-180" : ""}`}
        />
      </button>
      {open && (
        <motion.p
          initial={{ opacity: 0, y: -5 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-2 text-gray-600 text-sm"
        >
          {answer}
        </motion.p>
      )}
    </div>
  );
};

export default function ContactPage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showNavbar, setShowNavbar] = useState(true);

  //   Submit Fonksionu
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(
        "https://script.google.com/macros/s/AKfycby4hyLRjmrqUoH8YTe9-KvizT_ZA0W8pKVthvLR3_9Hh9wkKMvRRTok9uUardDl1oc/exec", // örn. https://script.google.com/macros/s/.../exec
        {
          method: "POST",
          mode: "cors",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        }
      );
      const result = await res.json();
      console.log(result);
      if (result.status === "success") {
        alert("Mesajınız kaydedildi!");
        setFormData({ name: "", email: "", message: "" });
      } else {
        alert("Hata: " + (result.message || "Bilinmeyen hata"));
      }
    } catch (error) {
      console.error(error);
      alert("Sunucuya bağlanılamadı!");
    }

  };

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

  return (
    <div>
      <div className="relative min-h-screen bg-gradient-to-br from-orange-100 via-red-50 to-orange-200 flex flex-col items-center justify-center p-8">
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
                  <span className="text-xl font-bold bg-gradient-to-r from-red-900 via-orange-500 to-red-500 bg-clip-text text-transparent">
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
                {/* <ShieldCheckIcon className="w-4 h-4 mr-2" /> */}
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

        <Particles />

        {/* İletişim Kartı */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="w-full max-w-6xl bg-white/80 backdrop-blur-xl shadow-xl rounded-2xl grid md:grid-cols-2 overflow-hidden mb-12 mt-24"
        >
          {/* Sol taraf - İletişim Bilgileri */}
          <div className="bg-gradient-to-br from-orange-500 to-red-500 p-10 text-white flex flex-col justify-center">
            <h2 className="text-3xl font-bold mb-6">Bizimle İletişime Geç</h2>
            <p className="mb-8 text-white/90 leading-relaxed">
              Soruların mı var? Fikirlerini duymaktan mutluluk duyarız.
              Aşağıdaki formu doldur veya direkt olarak bize ulaş.
            </p>
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <Mail className="w-6 h-6" />
                <span>destek@ornek.com</span>
              </div>
              <div className="flex items-center gap-3">
                <Phone className="w-6 h-6" />
                <span>+90 555 444 33 22</span>
              </div>
              <div className="flex items-center gap-3">
                <MapPin className="w-6 h-6" />
                <span>Mersin, Türkiye</span>
              </div>
            </div>
          </div>

          {/* Sağ taraf - Form */}
          <div className="p-10">
            <h3 className="text-2xl font-semibold text-gray-800 mb-6">
              Mesaj Gönder
            </h3>
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  İsim
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-orange-400 outline-none transition"
                  placeholder="Adınızı girin"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  E-posta
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-orange-400 outline-none transition"
                  placeholder="ornek@mail.com"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Mesajınız
                </label>
                <textarea
                  rows="4"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-orange-400 outline-none transition resize-none"
                  placeholder="Mesajınızı buraya yazın..."
                  required
                ></textarea>
              </div>
              <motion.button
              type="submit"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-orange-500 to-red-500 text-white font-semibold shadow-lg hover:shadow-xl transition"
              >
                Gönder
              </motion.button>
            </form>
          </div>
        </motion.div>

        {/* Google Maps */}
        <div className="w-full max-w-6xl h-80 rounded-2xl overflow-hidden shadow-lg mb-12">
          <iframe
            title="Google Maps"
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d192271.0109605968!2d34.459439!3d36.812100!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x1527f17db0c2f0c7%3A0x5481b1d0b7c1dacf!2sMersin!5e0!3m2!1str!2str!4v1691839184731!5m2!1str!2str"
            width="100%"
            height="100%"
            style={{ border: 0 }}
            allowFullScreen=""
            loading="lazy"
            className="rounded-2xl"
          ></iframe>
        </div>

        {/* FAQ */}
        <div className="w-full max-w-6xl bg-white/90 backdrop-blur-lg rounded-2xl shadow-md p-8 mb-16">
          <h3 className="text-2xl font-semibold text-gray-800 mb-6">
            Sıkça Sorulan Sorular
          </h3>
          <FAQItem
            question="Mesajıma ne kadar sürede dönüş yapıyorsunuz?"
            answer="Genellikle 24 saat içerisinde yanıt veriyoruz. Yoğunluk durumuna göre bu süre biraz uzayabilir."
          />
          <FAQItem
            question="Ofisinizi ziyaret edebilir miyim?"
            answer="Evet, randevu alarak ofisimizi ziyaret edebilirsiniz. Sizi ağırlamaktan mutluluk duyarız."
          />
          <FAQItem
            question="Destek yalnızca e-posta ile mi sağlanıyor?"
            answer="Hayır, telefon ve canlı sohbet yoluyla da destek veriyoruz."
          />
        </div>
      </div>

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
                  href="/"
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
