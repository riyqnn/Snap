import TrustedImage from "./atom/TrustedImage"

export default function TrustedSection() {
    
    return (
        <section className="bg-white-secondary py-24 border-y border-black-primary">
            <h1 className='text-4xl font-bold text-[#787878] text-center mb-16'>Trusted by Leading Brands</h1>
            <section className='flex justify-center gap-12 max-w-4xl mx-auto'>
                <TrustedImage src='https://substackcdn.com/image/fetch/$s_!k8Yn!,f_auto,q_auto:good,fl_progressive:steep/https%3A%2F%2Fsubstack-post-media.s3.amazonaws.com%2Fpublic%2Fimages%2F5362a828-0f5b-4d17-a6c5-d0677dc89baa_1000x1000.jpeg' />
                <TrustedImage src='/erigo.gif' />
                <TrustedImage src='https://i.pinimg.com/736x/a0/ab/f0/a0abf0b6d4585cc5426e78fde49142b6.jpg' />
                <TrustedImage src='https://indigo-legislative-mackerel-269.mypinata.cloud/ipfs/bafkreidkfnfn5n6qj5f3ie2xrs6afjge42wsod34dgn7lebspbhtwo4e6a' />
                <TrustedImage src='https://indigo-legislative-mackerel-269.mypinata.cloud/ipfs/bafkreiesb3c6clj7pcseiexzygi3vrzo3k33gmgqchqmmmmrwh527jds3m' />
            </section>
        </section>
    )
}

