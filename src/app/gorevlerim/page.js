"use client";

import { useState } from "react";
import { Dialog, DialogPanel } from "@headlessui/react";
import Link from "next/link";
import Image from "next/image";

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
} from "@heroicons/react/24/outline";

const navigation = [
  { name: "Müşterilerim", href: "#" },
  { name: "Portföyüm", href: "#" },
  { name: "Taleplerim", href: "#" },
  { name: "Görevlerim", href: "#" },
];

// Sample task data with real estate context
const tasks = [
  {
    id: 1,
    title: "Kadıköy'deki daireyi müşteriye göstermek",
    description: "Ahmet Yılmaz ile Kadıköy'deki 3+1 daireyi görüntülemek",
    status: "Devam Ediyor",
    priority: "Yüksek",
    category: "Müşteri Görüşmesi",
    assignedTo: "Mehmet Emlakçı",
    dueDate: "2024-01-20",
    customer: "Ahmet Yılmaz",
    customerPhone: "+90 532 123 45 67",
    property: "Kadıköy 3+1 Daire",
    progress: 60,
    createdAt: "2024-01-15",
    notes: "Müşteri öğleden sonra müsait, daireyi önceden hazırlamak gerekiyor",
  },
  {
    id: 2,
    title: "Çankaya villasının fotoğraflarını çekmek",
    description: "Çankaya'daki villa için profesyonel fotoğraf çekimi",
    status: "Beklemede",
    priority: "Orta",
    category: "Fotoğraf Çekimi",
    assignedTo: "Ayşe Fotoğrafçı",
    dueDate: "2024-01-22",
    customer: "Fatma Demir",
    customerPhone: "+90 533 987 65 43",
    property: "Çankaya Villa",
    progress: 0,
    createdAt: "2024-01-16",
    notes: "Güneş ışığında çekim yapılması gerekiyor",
  },
  {
    id: 3,
    title: "Karşıyaka dükkanı için fiyat analizi",
    description: "Karşıyaka bölgesindeki benzer dükkanların fiyat analizi",
    status: "Tamamlandı",
    priority: "Düşük",
    category: "Pazar Araştırması",
    assignedTo: "Ali Analist",
    dueDate: "2024-01-18",
    customer: "Mehmet Kaya",
    customerPhone: "+90 534 555 44 33",
    property: "Karşıyaka Dükkan",
    progress: 100,
    createdAt: "2024-01-12",
    notes: "Analiz tamamlandı, rapor hazırlandı",
  },
  {
    id: 4,
    title: "Nilüfer arsası için imar durumu kontrolü",
    description: "Nilüfer'deki arsanın imar durumunu belediyeden öğrenmek",
    status: "Devam Ediyor",
    priority: "Yüksek",
    category: "Araştırma",
    assignedTo: "Fatma Araştırmacı",
    dueDate: "2024-01-25",
    customer: "Ayşe Özkan",
    customerPhone: "+90 535 777 88 99",
    property: "Nilüfer Arsa",
    progress: 30,
    createdAt: "2024-01-17",
    notes: "Belediye ile görüşme ayarlandı",
  },
  {
    id: 5,
    title: "Muratpaşa villasının kiralama sözleşmesi",
    description: "Muratpaşa'daki villa için kiralama sözleşmesi hazırlamak",
    status: "Beklemede",
    priority: "Orta",
    category: "Sözleşme",
    assignedTo: "Hasan Hukukçu",
    dueDate: "2024-01-28",
    customer: "Ali Çelik",
    customerPhone: "+90 536 111 22 33",
    property: "Muratpaşa Villa",
    progress: 0,
    createdAt: "2024-01-18",
    notes: "Müşteri belgelerini henüz getirmedi",
  },
  {
    id: 6,
    title: "Kadıköy daire için banka değerlemesi",
    description: "Kadıköy'deki daire için banka değerleme raporu almak",
    status: "Devam Ediyor",
    priority: "Yüksek",
    category: "Değerleme",
    assignedTo: "Mehmet Emlakçı",
    dueDate: "2024-01-23",
    customer: "Ahmet Yılmaz",
    customerPhone: "+90 532 123 45 67",
    property: "Kadıköy 3+1 Daire",
    progress: 75,
    createdAt: "2024-01-14",
    notes: "Banka değerleme uzmanı ile görüşme yapıldı",
  },
];

export default function Gorevlerim() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("Tümü");
  const [priorityFilter, setPriorityFilter] = useState("Tümü");
  const [categoryFilter, setCategoryFilter] = useState("Tümü");
  const [showAddTask, setShowAddTask] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);
  const [viewMode, setViewMode] = useState("kanban"); // 'kanban' or 'list'
  const [draggedTask, setDraggedTask] = useState(null);

  const statuses = ["Beklemede", "Devam Ediyor", "Tamamlandı"];
  const priorities = ["Düşük", "Orta", "Yüksek"];
  const categories = [
    "Müşteri Görüşmesi",
    "Fotoğraf Çekimi",
    "Pazar Araştırması",
    "Araştırma",
    "Sözleşme",
    "Değerleme",
  ];

  const filteredTasks = tasks.filter((task) => {
    const matchesSearch =
      task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      task.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      task.customer.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus =
      statusFilter === "Tümü" || task.status === statusFilter;
    const matchesPriority =
      priorityFilter === "Tümü" || task.priority === priorityFilter;
    const matchesCategory =
      categoryFilter === "Tümü" || task.category === categoryFilter;
    return matchesSearch && matchesStatus && matchesPriority && matchesCategory;
  });

  const getPriorityColor = (priority) => {
    switch (priority) {
      case "Yüksek":
        return "bg-red-100 text-red-800";
      case "Orta":
        return "bg-yellow-100 text-yellow-800";
      case "Düşük":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "Tamamlandı":
        return "bg-green-100 text-green-800";
      case "Devam Ediyor":
        return "bg-blue-100 text-blue-800";
      case "Beklemede":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getProgressColor = (progress) => {
    if (progress >= 80) return "bg-green-500";
    if (progress >= 50) return "bg-yellow-500";
    return "bg-red-500";
  };

  const handleDragStart = (e, task) => {
    setDraggedTask(task);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = (e, newStatus) => {
    e.preventDefault();
    if (draggedTask) {
      // In a real app, you would update the task status in your database
      console.log(`Task ${draggedTask.id} moved to ${newStatus}`);
      setDraggedTask(null);
    }
  };

  const getTasksByStatus = (status) => {
    return filteredTasks.filter((task) => task.status === status);
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("tr-TR");
  };

  const getDaysUntilDue = (dueDate) => {
    const today = new Date();
    const due = new Date(dueDate);
    const diffTime = due - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <nav
          aria-label="Global"
          className="flex items-center justify-between p-6 lg:px-8"
        >
          <div className="flex lg:flex-1">
            <Link href="/" className="-m-1.5 p-1.5">
              <span className="sr-only">Emlak Web</span>
              <img alt="LOGO" src="" className="h-8 w-auto" />
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
              <a
                key={item.name}
                href={item.href}
                className="text-sm font-semibold text-gray-900"
              >
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
      <Dialog
        open={mobileMenuOpen}
        onClose={setMobileMenuOpen}
        className="lg:hidden"
      >
        <div className="fixed inset-0 z-50" />
        <DialogPanel className="fixed inset-y-0 right-0 z-50 w-full overflow-y-auto bg-white p-6 sm:max-w-sm sm:ring-1 sm:ring-gray-100/10">
          <div className="flex items-center justify-between">
            <Link href="/" className="-m-1.5 p-1.5">
              <span className="sr-only">Emlak Web</span>
              <img alt="LOGO" src="" className="h-8 w-auto" />
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
              <h1 className="text-3xl font-bold text-gray-900">Görevlerim</h1>
              <p className="mt-2 text-sm text-gray-600">
                Toplam {tasks.length} görev,{" "}
                {tasks.filter((t) => t.status === "Tamamlandı").length}{" "}
                tamamlandı
              </p>
            </div>
            <div className="flex items-center space-x-3">
              {/* View Mode Toggle */}
              <div className="hidden sm:flex flex border border-gray-300 rounded-md">
                <button
                  onClick={() => setViewMode("kanban")}
                  className={`px-3 py-2 text-sm font-medium ${
                    viewMode === "kanban"
                      ? "bg-indigo-600 text-white"
                      : "bg-white text-gray-700 hover:bg-gray-50"
                  }`}
                >
                  Grid
                </button>
                <button
                  onClick={() => setViewMode("list")}
                  className={`px-3 py-2 text-sm font-medium ${
                    viewMode === "list"
                      ? "bg-indigo-600 text-white"
                      : "bg-white text-gray-700 hover:bg-gray-50"
                  }`}
                >
                  Liste
                </button>
              </div>
              <button
                onClick={() => setShowAddTask(true)}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                <PlusIcon className="h-4 w-4 mr-2" />
                Yeni Görev
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
                placeholder="Görev ara..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              />
            </div>

            {/* Status Filter */}
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <CheckCircleIcon className="h-5 w-5 text-gray-400" />
              </div>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              >
                <option value="Tümü">Tüm Durumlar</option>
                {statuses.map((status) => (
                  <option key={status} value={status}>
                    {status}
                  </option>
                ))}
              </select>
            </div>

            {/* Priority Filter */}
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <ExclamationTriangleIcon className="h-5 w-5 text-gray-400" />
              </div>
              <select
                value={priorityFilter}
                onChange={(e) => setPriorityFilter(e.target.value)}
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              >
                <option value="Tümü">Tüm Öncelikler</option>
                {priorities.map((priority) => (
                  <option key={priority} value={priority}>
                    {priority}
                  </option>
                ))}
              </select>
            </div>

            {/* Category Filter */}
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FunnelIcon className="h-5 w-5 text-gray-400" />
              </div>
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              >
                <option value="Tümü">Tüm Kategoriler</option>
                {categories.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </div>

            {/* Quick Stats */}
            <div className="flex items-center justify-end space-x-4 text-sm text-gray-600">
              <span>
                Tamamlanan:{" "}
                {tasks.filter((t) => t.status === "Tamamlandı").length}
              </span>
              <span>
                Devam Eden:{" "}
                {tasks.filter((t) => t.status === "Devam Ediyor").length}
              </span>
            </div>
          </div>
        </div>

        {/* Kanban Board */}
        {viewMode === "kanban" ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {statuses.map((status) => (
              <div key={status} className="bg-white rounded-lg shadow">
                <div className="p-4 border-b border-gray-200">
                  <h3 className="text-lg font-semibold text-gray-900 flex items-center justify-between">
                    {status}
                    <span className="text-sm font-normal text-gray-500">
                      {getTasksByStatus(status).length}
                    </span>
                  </h3>
                </div>
                <div
                  className="p-4 min-h-[400px]"
                  onDragOver={handleDragOver}
                  onDrop={(e) => handleDrop(e, status)}
                >
                  <div className="space-y-3">
                    {getTasksByStatus(status).map((task) => (
                      <div
                        key={task.id}
                        draggable
                        onDragStart={(e) => handleDragStart(e, task)}
                        className="bg-gray-50 rounded-lg p-4 cursor-move hover:bg-gray-100 transition-colors"
                      >
                        <div className="flex items-start justify-between mb-2">
                          <h4 className="font-medium text-gray-900 text-sm">
                            {task.title}
                          </h4>
                          <EllipsisVerticalIcon className="h-4 w-4 text-gray-400" />
                        </div>
                        <p className="text-xs text-gray-600 mb-3 line-clamp-2">
                          {task.description}
                        </p>

                        <div className="flex items-center justify-between mb-3">
                          <span
                            className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(
                              task.priority
                            )}`}
                          >
                            {task.priority}
                          </span>
                          <span
                            className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(
                              task.status
                            )}`}
                          >
                            {task.category}
                          </span>
                        </div>

                        <div className="flex items-center justify-between text-xs text-gray-500 mb-2">
                          <span className="flex items-center">
                            <UserIcon className="h-3 w-3 mr-1" />
                            {task.assignedTo}
                          </span>
                          <span className="flex items-center">
                            <CalendarIcon className="h-3 w-3 mr-1" />
                            {formatDate(task.dueDate)}
                          </span>
                        </div>

                        {/* Progress Bar */}
                        <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
                          <div
                            className={`h-2 rounded-full ${getProgressColor(
                              task.progress
                            )}`}
                            style={{ width: `${task.progress}%` }}
                          ></div>
                        </div>
                        <div className="flex items-center justify-between text-xs text-gray-500">
                          <span>İlerleme: {task.progress}%</span>
                          <button
                            onClick={() => setSelectedTask(task)}
                            className="text-indigo-600 hover:text-indigo-900"
                          >
                            Detaylar
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          /* List View */
          <div className="bg-white shadow overflow-hidden sm:rounded-md">
            <ul className="divide-y divide-gray-200">
              {filteredTasks.map((task) => (
                <li key={task.id} className="px-6 py-4 hover:bg-gray-50">
                  <div className="flex items-center justify-between">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-gray-900 truncate">
                            {task.title}
                          </p>
                          <p className="text-sm text-gray-500">
                            {task.description}
                          </p>
                        </div>
                        <div className="flex items-center space-x-2">
                          <span
                            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getPriorityColor(
                              task.priority
                            )}`}
                          >
                            {task.priority}
                          </span>
                          <span
                            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(
                              task.status
                            )}`}
                          >
                            {task.status}
                          </span>
                        </div>
                      </div>
                      <div className="mt-2 flex items-center justify-between">
                        <div className="text-sm text-gray-500">
                          <span className="flex items-center">
                            <UserIcon className="h-4 w-4 mr-1" />
                            {task.assignedTo}
                          </span>
                          <span className="mx-2">•</span>
                          <span className="flex items-center">
                            <CalendarIcon className="h-4 w-4 mr-1" />
                            {formatDate(task.dueDate)}
                          </span>
                          <span className="mx-2">•</span>
                          <span>{task.category}</span>
                        </div>
                        <div className="text-xs text-gray-400">
                          {getDaysUntilDue(task.dueDate) > 0
                            ? `${getDaysUntilDue(task.dueDate)} gün kaldı`
                            : "Süre doldu"}
                        </div>
                      </div>
                      <div className="mt-2 flex items-center justify-between">
                        <div className="flex items-center space-x-4 text-xs text-gray-500">
                          <span className="flex items-center">
                            <PhoneIcon className="h-3 w-3 mr-1" />
                            {task.customerPhone}
                          </span>
                          <span className="flex items-center">
                            <HomeIcon className="h-3 w-3 mr-1" />
                            {task.property}
                          </span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <div className="w-16 bg-gray-200 rounded-full h-2">
                            <div
                              className={`h-2 rounded-full ${getProgressColor(
                                task.progress
                              )}`}
                              style={{ width: `${task.progress}%` }}
                            ></div>
                          </div>
                          <span className="text-xs text-gray-500">
                            {task.progress}%
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="ml-4 flex-shrink-0">
                      <button
                        onClick={() => setSelectedTask(task)}
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
        {filteredTasks.length === 0 && (
          <div className="text-center py-12">
            <div className="mx-auto h-12 w-12 text-gray-400">
              <CheckCircleIcon className="h-12 w-12" />
            </div>
            <h3 className="mt-2 text-sm font-medium text-gray-900">
              Görev bulunamadı
            </h3>
            <p className="mt-1 text-sm text-gray-500">
              Arama kriterlerinize uygun görev bulunamadı.
            </p>
          </div>
        )}
      </div>

      {/* Task Detail Modal */}
      {selectedTask && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium text-gray-900">
                  Görev Detayları
                </h3>
                <button
                  onClick={() => setSelectedTask(null)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <XMarkIcon className="h-6 w-6" />
                </button>
              </div>
              <div className="space-y-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Başlık
                  </label>
                  <p className="mt-1 text-sm text-gray-900">
                    {selectedTask.title}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Açıklama
                  </label>
                  <p className="mt-1 text-sm text-gray-900">
                    {selectedTask.description}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Durum
                  </label>
                  <span
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(
                      selectedTask.status
                    )}`}
                  >
                    {selectedTask.status}
                  </span>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Öncelik
                  </label>
                  <span
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getPriorityColor(
                      selectedTask.priority
                    )}`}
                  >
                    {selectedTask.priority}
                  </span>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Kategori
                  </label>
                  <p className="mt-1 text-sm text-gray-900">
                    {selectedTask.category}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Atanan Kişi
                  </label>
                  <p className="mt-1 text-sm text-gray-900">
                    {selectedTask.assignedTo}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Bitiş Tarihi
                  </label>
                  <p className="mt-1 text-sm text-gray-900">
                    {formatDate(selectedTask.dueDate)}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Müşteri
                  </label>
                  <p className="mt-1 text-sm text-gray-900">
                    {selectedTask.customer}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Müşteri Telefonu
                  </label>
                  <p className="mt-1 text-sm text-gray-900">
                    {selectedTask.customerPhone}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Emlak
                  </label>
                  <p className="mt-1 text-sm text-gray-900">
                    {selectedTask.property}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    İlerleme
                  </label>
                  <div className="mt-1 flex items-center space-x-2">
                    <div className="flex-1 bg-gray-200 rounded-full h-2">
                      <div
                        className={`h-2 rounded-full ${getProgressColor(
                          selectedTask.progress
                        )}`}
                        style={{ width: `${selectedTask.progress}%` }}
                      ></div>
                    </div>
                    <span className="text-sm text-gray-500">
                      {selectedTask.progress}%
                    </span>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Notlar
                  </label>
                  <p className="mt-1 text-sm text-gray-900 italic">
                    "{selectedTask.notes}"
                  </p>
                </div>
              </div>
              <div className="flex justify-end space-x-3 mt-6">
                <button
                  onClick={() => setSelectedTask(null)}
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
              <div className="flex h-8 w-8 md:h-10 md:w-10 items-center justify-center rounded-full hover:text-blue-500">
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
              <div className="flex h-8 w-8 md:h-10 md:w-10 items-center justify-center rounded-full hover:text-blue-500 text-blue-500">
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
