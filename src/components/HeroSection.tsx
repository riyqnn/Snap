import { CreditCardIcon } from "@heroicons/react/16/solid"
import TextRotator from "./atom/TextRotator"

export default function HeroSection() {
    return (
        <div className="relative w-full h-screen py-8 overflow-hidden isolate">
            <video
            autoPlay
            loop
            muted
            className="absolute top-1/2 left-1/2 -z-10 min-w-full min-h-full -translate-x-1/2 -translate-y-1/2 object-cover"
            src="/hero-background-video.mp4" />
            <div className="relative flex justify-center items-center gap-2 p-20">
                <div className="text-white-primary font-extrabold flex flex-col gap-8">
                    <h1 className="w-2xl custom-stroke-white text-6xl font-extrabold leading-tight">
                        Use SNAP to Authenticate your <span className="custom-stroke-blue"><TextRotator /></span><br /> On BlockChain
                    </h1>
                    <button className="bg-white-primary border p-3 justify-center gap-4 text-blue-primary border-black-primary rounded-3xl w-64 flex"><CreditCardIcon className="size-6 text-blue-primary" />Connect Wallet</button>
                </div>
                <img
                className="z-10 block w-[440px] object-cover pointer-events-none select-none"
                src="/hero-video-unscreen.gif"
                autoPlay
                loop
                muted
                playsInline
                />
            </div>
        </div>
    )
}

