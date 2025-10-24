import ConnectWallet from "@/components/atom/ConnectWallet";
import Footer from "@/components/atom/Footer";
import Navbar from "@/components/Navbar";

export default function ConnectPage() {
    return (
        <>
            <Navbar />
            <section className='w-full min-h-screen relative bg-[url("/how-background.png")] bg-cover bg-center'>
                <div className='relative z-20 flex flex-col md:flex-row w-full md:h-screen items-center pt-20 md:pt-0'>
                    <section className="w-full px-4 py-10 text-center">
                        <h1 className="text-6xl font-extrabold text-gray-800 leading-tight">
                            Explore{" "}
                            <span className="text-blue-600 drop-shadow-md">SNAP</span> <br />
                            Collections
                        </h1>

                        <div className="mt-6 flex justify-center">
                            <ConnectWallet />
                        </div>
                    </section>
                    <img src="/explore-image.png" alt='' className=''></img>
                </div>
            </section>
            <Footer />
        </>
    )
}
