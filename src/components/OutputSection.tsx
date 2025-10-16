import FeedbackCard from "./atom/FeedbackCard"

export default function OutputSection() {
    
    return (
        <section className="px-6 py-24 relative bg-[#f3f9ff]">
            <img src="/output-background.png" alt="city" className="absolute inset-0 w-full h-full object-cover z-0 opacity-80 pointer-events-none" />
            <div className="max-w-7xl mx-auto relative z-10">
                {/* Judul dan Subjudul */}
                <div className="text-center mb-16">
                <h2 className="text-[40px] leading-[100%] font-extrabold text-white-primary custom-stroke-white inline-block px-4">
                    What People Are Saying
                </h2>
                <p className="text-gray-400 mt-4">
                    We provide support for more than <span className="text-[#0052FF] font-semibold">7K+ Businesses.</span>
                </p>
                </div>

                {/* Testimoni Card */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <FeedbackCard
                        name="David"
                        src="https://adminlte.io/themes/v3/dist/img/user1-128x128.jpg"
                        role="Fashion Collector"
                        message="I love how I can scan a QR code and instantly get my NFT! It’s like owning a piece of the brand that no one can fake."
                    />

                    <FeedbackCard
                        name="Leonel R."
                        src="https://adminlte.io/themes/v3/dist/img/user7-128x128.jpg"
                        role="Online Shopper"
                        message="I used to worry about getting fake stuff, now every product I buy comes with proof I can check and keep. Love it!"
                    />

                    <FeedbackCard
                        name="Diana E."
                        src="https://adminlte.io/themes/v3/dist/img/user4-128x128.jpg"
                        role="Brand Owner"
                        message="Snap makes it insanely easy to prove my streetwear drops are 100% legit. My customers feel more confident buying from me."
                    /> 
                </div>

                {/* CTA */}
                <div className="mt-24 text-center">
                <h2 className="text-[35px] font-extrabold text-white-primary custom-stroke-white leading-[100%]">
                    Ready to Authenticate Your Streetwear?
                </h2>
                <div className="mt-6 flex flex-col sm:flex-row justify-center gap-4">
                    <button className="bg-[#0052FF] text-white px-6 py-3 rounded-lg font-semibold">Connect Wallet</button>
                    <button className="bg-white text-[#0052FF] border border-[#0052FF] px-6 py-3 rounded-lg font-semibold">Learn More</button>
                </div>
                </div>
            </div>
        </section>        
    )
}