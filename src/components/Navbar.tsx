export default function Navbar() {
    return (
        <div className="fixed w-full h-20 p-5 z-50 bg-white-secondary flex justify-center items-center border-b border-black-300 shadow-md text-black-primary">
            <div className="w-[90%] h-full flex justify-between items-center">
                <div className="w-fit h-full flex gap-8 items-center font-semibold text-[15px] leading-[100%] tracking-[0]">
                    <img className="w-[100px]" src="/snap.svg" alt="snap logo" />
                    <a href="">About</a>
                    <a href="">Museum</a>
                    <a href="">Collection</a>
                    <a href="">Get Verify</a>
                </div>
                <a className="bg-blue-secondary p-2 rounded-3xl text-white-primary font-semibold border-1 border-solid border-black" href="">Create a Snap</a>
            </div>
        </div>
    )
}

