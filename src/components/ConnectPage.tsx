export default function ConnectPage() {
    return (
        <>
            <section className='w-full min-h-screen relative bg-[url("/collection-background.png")] bg-cover bg-center'>
                <div className='relative z-20 flex flex-col md:flex-row w-full md:h-screen items-center pt-20 md:pt-0'>
                    <section className="w-full px-4 py-10 text-center">
                        <h1 className="text-6xl font-extrabold text-gray-800 leading-tight">
                            Explore{" "}
                            <span className="text-blue-600 drop-shadow-md">SNAP</span> <br />
                            Collections
                        </h1>

                        <div className="mt-6 flex justify-center">
                            <div className="flex items-center rounded-full border border-gray-300 bg-white shadow-md overflow-hidden w-full max-w-md">
                                <input
                                    type="text"
                                    placeholder="Email, Adress or ENS"
                                    className="flex-1 px-4 py-2 text-sm outline-none"
                                />
                                <button className="bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold px-5 py-2 rounded-full m-1 transition">
                                    Search
                                </button>
                            </div>
                        </div>
                    </section>
                    <img src="/explore-image.png" alt='' className=''></img>
                </div>
            </section>
        </>
    )
}
