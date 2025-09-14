"use client";

import { useState, useEffect } from "react";
import mersinData from "@/data/mersin.json";

export default function PropertyForm() {
  const [formData, setFormData] = useState({
    type: "",
    city: "Mersin",
    district: "",
    neighborhood: "",
    price: "",
  });
  const [districts, setDistricts] = useState([]);
  const [neighborhoods, setNeighborhoods] = useState([]);
  const [message, setMessage] = useState("");

  useEffect(() => {
    setDistricts(Object.keys(mersinData));
  }, []);

  useEffect(() => {
    if (formData.district && mersinData[formData.district]) {
      setNeighborhoods(mersinData[formData.district]);
    } else {
      setNeighborhoods([]);
    }
  }, [formData.district]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const res = await fetch("/api/admin/properties", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    });

    if (res.ok) {
      setMessage("Portföy başarıyla eklendi ✅");
      setFormData({
        type: "",
        city: "Mersin",
        district: "",
        neighborhood: "",
        price: "",
      });
    } else {
      setMessage("Hata oluştu ❌");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-3 p-4 border rounded">
      {/* Emlak Tipi */}
      <select
        name="type"
        value={formData.type}
        onChange={handleChange}
        className="border p-2"
        required
      >
        <option value="">-- Emlak Tipi Seçiniz --</option>
        <option value="Konut">Konut</option>
        <option value="Arsa">Arsa</option>
        <option value="İş Yeri">İş Yeri</option>
        <option value="Bina">Bina</option>
      </select>

      {/* İl */}
      <input
        type="text"
        name="city"
        value={formData.city}
        readOnly
        className="border p-2 bg-gray-100"
      />

      {/* İlçe */}
      <select
        name="district"
        value={formData.district}
        onChange={handleChange}
        className="border p-2"
        required
      >
        <option value="">-- İlçe Seçiniz --</option>
        {districts.map((dist) => (
          <option key={dist} value={dist}>
            {dist}
          </option>
        ))}
      </select>

      {/* Mahalle */}
      <select
        name="neighborhood"
        value={formData.neighborhood}
        onChange={handleChange}
        className="border p-2"
        required
        disabled={!formData.district}
      >
        <option value="">-- Mahalle Seçiniz --</option>
        {neighborhoods.map((n) => (
          <option key={n} value={n}>
            {n}
          </option>
        ))}
      </select>

      {/* Fiyat */}
      <input
        type="number"
        name="price"
        placeholder="Fiyat"
        value={formData.price}
        onChange={handleChange}
        className="border p-2"
        required
      />

      {/* Kaydet butonu */}
      <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">
        Kaydet
      </button>

      {message && <p>{message}</p>}
    </form>
  );
}
