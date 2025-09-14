"use client";

import { useEffect, useState } from "react";

export default function CustomerList() {
  const [customers, setCustomers] = useState([]);
  const [properties, setProperties] = useState([]);

  useEffect(() => {
    fetch("/api/admin/customers")
      .then((res) => res.json())
      .then((data) => setCustomers(data));

    fetch("/api/admin/properties")
      .then((res) => res.json())
      .then((data) => setProperties(data));
  }, []);

  const findMatches = (customer) => {
    return properties.filter(
      (p) =>
        p.type === customer.estateType &&
        p.saleType === customer.saleType &&
        Number(p.price) <= Number(customer.budget)
    );
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {customers.map((customer) => {
        const matches = findMatches(customer);
        return (
          <div key={customer.id} className="border p-4 rounded shadow">
            <h2 className="font-bold text-lg">{customer.name}</h2>
            <p>Bütçe: {customer.budget} ₺</p>
            <p>İstediği: {customer.estateType} - {customer.saleType}</p>
            <p>Not: {customer.note}</p>

            <div className="mt-2">
              <h3 className="font-semibold">Uygun Portföyler:</h3>
              {matches.length > 0 ? (
                <ul className="list-disc ml-5">
                  {matches.map((m) => (
                    <li key={m.id}>
                      {m.type} ({m.saleType}) - {m.price} ₺ [{m.district} / {m.neighborhood}]
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-gray-500">Uygun portföy bulunamadı</p>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
