import Navbar from '@/components/Navbar'
import tunjuk from '../../assets/img/about.png'

export default function About() {
  return (
    <>
      <Navbar />
      <section className='w-full min-h-screen relative'>
        {/* <img src={tunjuk} alt='' className='w-full absolute z-0'></img> */}
        <div className='relative z-20 flex flex-col md:flex-row w-full md:h-screen items-center px-4 md:px-12 pt-20 md:pt-0'>
          <div className="bg-white rounded-xl shadow-md p-8 w-l max-w-xl mx-auto border border-gray-200">
            <h2 className="text-3xl md:text-5xl text-center font-extrabold text-gray-800 mb-4">
              What is{' '}
              <span className="text-blue-600">
                SNAP<span className="text-black ml-4">?</span>
              </span>
            </h2>
            <p className="text-gray-600 md:mt-6 leading-relaxed text-sm md:text-lg">
              Snap adalah sistem identitas digital untuk fashion. Setiap produk—seperti kaos, hoodie, atau sneakers—memiliki tanda unik yang bisa dipindai dan diverifikasi lewat blockchain. Dengan Snap, setiap item jadi autentik, terlacak, dan bisa dikoleksi. Setiap produk memiliki NFT yang membuktikan asal, edisi, dan riwayat kepemilikan. Bagi brand, Snap membangun kepercayaan dan melindungi desain dari tiruan. Bagi pelanggan, Snap memastikan kepemilikan yang nyata dan terverifikasi. Snap mengubah fashion jadi pengalaman yang tepercaya.            </p>
          </div>
          <img src="/about-image.png" alt='' className='w-[500px] hidden lg:block'></img>
        </div>
      </section>
    </>
  )
}
