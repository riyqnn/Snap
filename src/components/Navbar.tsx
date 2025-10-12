export default function Navbar() {
    return (
        <div className="fixed w-full h-20 p-5 z-50 bg-white-secondary flex justify-center items-center border-b border-black-300 shadow-md text-black-primary">
            <div className="w-[90%] h-full flex justify-between items-center">
                <div className="w-fit h-full flex gap-8 items-center font-semibold text-[15px] leading-[100%] tracking-[0]">
                    <img className="w-[100px]" src="/snap.svg" alt="snap logo" />
                    <a className="hover:scale-110 transition-transform duration-300" href="">About</a>
                    <a className="hover:scale-110 transition-transform duration-300" href="">Museum</a>
                    <a className="hover:scale-110 transition-transform duration-300" href="">Collection</a>
                    <a className="hover:scale-110 transition-transform duration-300" href="">Get Verify</a>
                </div>
                <a className="bg-blue-secondary p-2 rounded-3xl text-white-primary font-semibold border-1 border-solid border-black" href="">Create a Snap</a>
            </div>
        </div>
    )
}

