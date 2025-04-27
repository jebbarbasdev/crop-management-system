import DaisyButton from "@/app/_components/DaisyButton";
import { IconArrowRight } from "@tabler/icons-react";
import Link from "next/link";

export interface DashboardCardProps {
    slug: string;
    module: string
}

export default function DashboardCard({ slug, module }: DashboardCardProps) {
    return (
        <div className="relative w-full h-48 overflow-hidden">
            <img
                src={`/${slug}.webp`}
                alt={`${module} image`}
                className="absolute inset-0 w-full h-full object-cover"
                loading="lazy"
            />

            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />

            <div className="absolute flex items-center justify-between w-full p-4 bottom-0 left-0">
                <h2 className="text-white text-2xl font-bold">{module}</h2>

                <Link
                    href={`/${slug}`}
                >
                    <DaisyButton modifier="circle">
                        <IconArrowRight size={24} />
                    </DaisyButton>
                </Link>
            </div>
        </div>
    )
}