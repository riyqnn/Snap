import { CreditCardIcon } from "@heroicons/react/16/solid"

export default function HeroSection() {
    return (
        <div className="w-full h-[700px] bg-white-primary flex justify-center items-center gap-2 p-20 bg-[url('/hero-background.svg')] bg-cover bg-center">
            <div className="text-white-primary font-extrabold flex flex-col gap-8">
                <h1 className="w-2xl text-6xl font-extrabold leading-tight [text-shadow:-4px_4px_0px_#544E4E] [-webkit-text-stroke:2px_#544E4E]">
                    Use <span className="text-blue-primary [-webkit-text-stroke:1px_white]">SNAP</span> to Authenticate your Streetwear on BlockChain
                </h1>
                <button className="bg-white-primary border p-3 justify-center gap-4 text-blue-primary border-black-primary rounded-3xl w-64 flex"><CreditCardIcon className="size-6 text-blue-primary" />Connect Wallet</button>
            </div>
                <video
                className="block w-[440px] object-cover pointer-events-none select-none"
                src="/hero-video.mp4"
                autoPlay
                loop
                muted
                playsInline
                />
        </div>
    )
}

