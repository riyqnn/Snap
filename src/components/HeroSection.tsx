import TextRotator from "./atom/TextRotator"
import ConnectWallet from "./atom/ConnectWallet"

export default function HeroSection() {
    return (
        <div className="relative bg-[url('/hero-background.png')] bg-cover bg-center w-full h-fit py-8 overflow-hidden isolate">
            {/* <video
            autoPlay
            loop
            muted
            className="absolute top-1/2 left-1/2 -z-10 min-w-full min-h-full -translate-x-1/2 -translate-y-1/2 object-cover"
            src="/hero-background-video.mp4" /> */}
            <div className="relative flex justify-center items-center gap-2 p-7">
                <div className="text-white-primary font-extrabold flex flex-col gap-8">
                    <h1 className="md:w-2xl w-xl custom-stroke-white text-5xl md:text-6xl font-extrabold leading-tight">
                        Use SNAP to Authenticate your <span className="custom-stroke-blue"><TextRotator /></span><br /> On BlockChain
                    </h1>
                    <ConnectWallet />
                </div>
                <video
                className="z-10 hidden lg:block w-[440px] object-cover pointer-events-none select-none"
                src="/hero-video.webm"
                autoPlay
                loop
                muted
                playsInline
                />
            </div>
        </div>
    )
}

