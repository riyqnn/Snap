"use client";
import React, { useState, useEffect } from "react";

export default function TextRotator() {
  const texts = ["Luxury Handbag", "Designer Watch", "High-End Sneakers", "Gold Jewelry", "Leather Wallet"];
  const [index, setIndex] = useState(0);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => {
      setVisible(false); // mulai fade-out

      // setelah fade-out selesai, ubah teks lalu fade-in
      setTimeout(() => {
        setIndex((prev) => (prev + 1) % texts.length);
        setVisible(true);
      }, 500); // durasi fade-out (harus sama dgn transition)
    }, 5000); // ganti tiap 5 detik

    return () => clearInterval(interval);
  }, [texts.length]);

  return (
    <span
      className={`inline-block transition-opacity duration-500 ease-in-out ${
        visible ? "opacity-100" : "opacity-0"
      }`}
    >
      {texts[index]}
    </span>
  );
}
