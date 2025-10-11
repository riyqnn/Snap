"use client";
import React, { useEffect } from "react";
import AOS from "aos";
import "aos/dist/aos.css";


export default function Promotion() {
    useEffect(() => {
    AOS.init({
      duration: 1000, // durasi animasi (ms)
      once: true,     // animasi hanya jalan sekali
    });
  }, []);
    return (
        <div className="w-full h-[200px] border bg-white-primary border-black-primary flex gap-28 justify-center items-center">
            <div data-aos="fade-down" className="flex items-end gap-5 font-extrabold">
                <h2 className="text-blue-primary text-6xl [-webkit-text-stroke:1px_white] [text-shadow:-4px_4px_0px_#544E4E]">3,877,840</h2>
                <p className="text-black-primary text-2xl">SNAPs Minted</p>
            </div>
            <div data-aos="fade-down" className="flex items-end gap-3 font-extrabold">
                <h2 className="text-blue-primary text-6xl [-webkit-text-stroke:1px_white] [text-shadow:-4px_4px_0px_#544E4E]">
                    12,844
                </h2>
                <p className="text-black-primary text-2xl">Brands</p>
            </div>
        </div>
    )
}

