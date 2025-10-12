"use client";
import CardWorks from './atom/CardWorks'
import React, { useEffect } from "react";
import AOS from "aos";
import "aos/dist/aos.css";

export default function HowSection() {
    useEffect(() => {
        AOS.init({
          duration: 1000, // durasi animasi (ms)
          once: true,     // animasi hanya jalan sekali
        });
      }, []);

    return (
        <section className="bg-white-primary bg-[url('/how-background.png')] bg-cover bg-center px-6 py-20 relative overflow-hidden">
            <div className="max-w-7xl mx-auto relative z-10">
                <div className="text-center mb-16">
                    <h2 className="text-7xl text-white-primary font-bold mb-4 [-webkit-text-stroke:1px_#544E4E] [text-shadow:-4px_4px_0px_#544E4E]">
                        HOW <span className='text-blue-primary [-webkit-text-stroke:1px_white] [text-shadow:-4px_4px_0px_#544E4E]'>SNAP</span> WORKS?
                        {/* <span className="bg-gradient-to-r from-[#0052FF] to-[#0052FF] bg-clip-text text-transparent">
                            {" "}Creativity
                        </span> */}
                    </h2>
                    {/* <p className="text-gray-400 max-w-2xl mx-auto">
                        Lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod 
                        tempor incididunt ut labore et dolore magna aliqua.
                    </p> */}
                </div>

                <div className='flex flex-wrap justify-center gap-12 z-50'>
                    <CardWorks title={'Register Your Brand'} desc={'Set up your fashion label in minutes. Get verified and start protecting your originals.'} icon={<img src="/icon/icon1.svg" alt=''></img>} />
                    <CardWorks title={'Upload Your Product'} desc={'Add your limited-edition tees, hoodies, or sneakers complete with product details and images.'} icon={<img src="/icon/icon2.svg" alt=''></img>}/>
                    <CardWorks title={'Generate NFT'} desc={'Snap automatically mints a unique NFT for each item, certified proof of authenticity on-chain.'} icon={<img src="/icon/icon3.svg" alt=''></img>}/>
                    <CardWorks title={'Attach and Distribute'} desc={'Set up your fashion label in minutes. Get verified and start protecting your originals.'} icon={<img src="/icon/icon4.svg" alt=''></img>}/>
                    <CardWorks title={'Customer Claims'} desc={'Buyers scan the QR and claim their NFT — proof they own the real thing. Instant, secure, and permanent.'} icon={<img src="/icon/icon5.svg" alt=''></img>}/>
                </div>
            </div>
        </section>
    )
}

