import { JSX } from "react";

interface CardWorksState {
    title: string
    desc: string
    icon: React.ReactNode;
}
export default function CardWorks({
    title,
    desc,
    icon
}: CardWorksState): JSX.Element {
    return (
        <div className="w-[290px] rounded-2xl bg-white p-6 border border-black-primary shadow-lg text-center space-y-3 hover:scale-110 transition-transform duration-300">
            <div className="w-10 h-10 mx-auto flex items-center justify-center bg-[#0052FF] rounded-full shadow">
                {icon}
            </div>
            <h3 className="font-semibold text-lg text-black">{title}</h3>
            <p className="text-sm text-gray-600">
                {desc}
            </p>
        </div>
    )
}