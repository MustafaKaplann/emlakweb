"use client";

import { useEffect, useState } from "react";

export default function PropertyList() {
  const [properties, setProperties] = useState([]);

  useEffect(() => {
    fetch("/api/admin/properties")
      .then((res) => res.json())
      .then((data) => setProperties(data));
  }, []);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {properties.map((property) => (
        <div key={property.id} className="border p-4 rounded shadow">
          <h2 className="font-bold text-lg">{property.type}</h2>
          <p>Şehir: {property.city}</p>
          <p>İlçe: {property.district}</p>
          <p>Mahalle: {property.neighborhood}</p>
          <p>Fiyat: {property.price} ₺</p>
        </div>
      ))}
    </div>
  );
}
