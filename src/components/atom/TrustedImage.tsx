interface TrustedImage {
  src: string;
}

export default function TrustedImage({src}: TrustedImage) {
    return (
        <img src={src} alt='logo image' className='border border-black-primary p-2 h-40 rounded-full'></img>
    )
}
// https://gateway.pinata.cloud/ipfs/QmSgDwc21Mt5xo9yWcF7RCTr89A94mo5MgfL1qmwMJanMe