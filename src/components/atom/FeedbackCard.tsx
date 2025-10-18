// export default function FeedbackCard() {
//     return (
//         <div className="bg-white border border-black-primary shadow-lg p-6 rounded-xl">
//             <div className="flex items-center gap-3 mb-4">
//             <img src="https://adminlte.io/themes/v3/dist/img/user4-128x128.jpg" alt="Diana" className="w-10 h-10 rounded-full" />
//             <div>
//                 <p className="font-semibold">Diana E.</p>
//                 <p className="text-sm text-gray-400">Brand Owner</p>
//             </div>
//             </div>
//             <p>Snap makes it insanely easy to prove my streetwear drops are 100% legit. My customers feel more confident buying from me</p>
//         </div>
//     )
// }

// import React from "react";

interface FeedbackCardProps {
  name: string;
  src: string;
  role: string;
  message: string;
}

export default function FeedbackCard({ name, src, role, message }: FeedbackCardProps) {
  return (
    <div className="bg-white border border-black-primary shadow-lg p-6 rounded-xl hover:scale-105 transition-transform duration-300">
      <div className="flex items-center gap-3 mb-4">
        <img src={src} alt={name} className="w-10 h-10 rounded-full" />
        <div>
          <p className="font-semibold">{name}</p>
          <p className="text-sm text-gray-400">{role}</p>
        </div>
      </div>
      <p>{message}</p>
    </div>
  );
}
