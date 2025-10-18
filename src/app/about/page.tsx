import Navbar from '@/components/Navbar'
import tunjuk from '../../assets/img/about.png'

export default function About() {
  return (
    <>
      <Navbar />
      <section className='w-full min-h-screen relative'>
        {/* <img src={tunjuk} alt='' className='w-full absolute z-0'></img> */}
        <div className='relative z-20 flex flex-col md:flex-row w-full md:h-screen items-center px-4 md:px-12 pt-20 md:pt-0'>
          <div className="bg-white rounded-xl shadow-md p-8 max-w-3xl mx-auto border border-gray-200">
            <h2 className="text-3xl md:text-5xl text-center font-extrabold text-gray-800 mb-4">
              What is{' '}
              <span className="text-blue-600">
                SNAP<span className="text-black ml-4">?</span>
              </span>
            </h2>
            <p className="text-gray-600 md:mt-6 leading-relaxed text-sm md:text-lg">
             Snap is a digital identity system for fashion. It gives every physical product like t-shirts, hoodies, or sneakers a unique, scannable mark of authenticity powered by blockchain. Each item becomes traceable, verifiable, and collectible. When a brand creates a Snap, they’re not just selling clothing they’re offering proof. Every Snap generates a secure NFT linked directly to the product, showing its origin, edition, and ownership history. Snap isn’t just for protection it’s about connection. For customers, it means owning a piece of something real and verified. For brands, it’s a way to build trust, grow loyalty, and protect designs from counterfeits. From product to proof, Snap transforms fashion into trusted experiences.
            </p>
          </div>
          <img src="/about-image.png" alt='' className=''></img>
        </div>
      </section>
    </>
  )
}
