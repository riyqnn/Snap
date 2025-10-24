export default function Promotion() {
    return (
        <div className="w-full py-8 sm:py-10 lg:py-12 border-y bg-white-primary border-black-primary px-4">
            <div className="grid grid-cols-2 gap-6 sm:gap-8 lg:gap-12 max-w-4xl mx-auto">
                <div className="flex flex-col items-center justify-center font-extrabold text-center">
                    <h2 className="text-blue-primary text-3xl sm:text-4xl md:text-5xl lg:text-6xl [-webkit-text-stroke:1px_white] [text-shadow:-4px_4px_0px_#544E4E]">
                        3,877,840
                    </h2>
                    <p className="text-black-primary text-base sm:text-lg md:text-xl lg:text-2xl mt-2">SNAPs Minted</p>
                </div>
                <div className="flex flex-col items-center justify-center font-extrabold text-center">
                    <h2 className="text-blue-primary text-3xl sm:text-4xl md:text-5xl lg:text-6xl [-webkit-text-stroke:1px_white] [text-shadow:-4px_4px_0px_#544E4E]">
                        12,844
                    </h2>
                    <p className="text-black-primary text-base sm:text-lg md:text-xl lg:text-2xl mt-2">Brands</p>
                </div>
            </div>
        </div>
    )
}