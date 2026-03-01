"use client";

import { ChevronRight, ClipboardList, UserRoundSearch } from "lucide-react";
import { useRouter } from "next/navigation";
import NotificationBell from "@/app/components/notification-bell";

export default function AdminAppointmentsHubPage() {
	const router = useRouter();

	const cards = [
		{
			title: "View Appointments",
			subtitle: "View and reply to appointment requests from users",
			icon: UserRoundSearch,
			href: "/admin/appointments/view_appointments",
		},
		{
			title: "View Plan Requests",
			subtitle: "View and reply to plan requests from users",
			icon: ClipboardList,
			href: "/admin/appointments/plan_requests",
		},
	];

	return (
		<div className="min-h-screen bg-[#0A0705] text-white flex flex-col relative font-sans overflow-x-hidden">
			<NotificationBell className="absolute top-8 right-10 z-50" />

			<div className="w-full text-center !pt-24 !mb-20">
				<h1 className="!text-[64px] font-black text-[#FACC15] tracking-tight leading-none">
					Appointments &amp; Plans
				</h1>
			</div>

			<div className="flex-1 flex flex-col items-center gap-y-8 w-full max-w-6xl mx-auto px-10 pb-20">
				{cards.map((card) => {
					const IconComponent = card.icon;

					return (
						<div
							key={card.title}
							onClick={() => router.push(card.href)}
							className="group flex items-center w-full max-w-[800px] !h-[120px] bg-[#1E1E1E] border-2 border-[#FACC15] rounded-[24px] overflow-hidden transition-all duration-300 hover:ring-4 hover:ring-[#FACC15]/10 cursor-pointer"
						>
							<div className="flex justify-center items-center min-w-[100px] text-white border-r border-white/10 h-full">
								<IconComponent size={32} strokeWidth={2} />
							</div>

							<div className="flex-1 flex flex-col justify-center px-8 min-w-0">
								<h2 className="!text-[24px] font-bold text-[#FACC15] leading-tight">
									{card.title}
								</h2>
								<p className="text-[16px] text-gray-400 mt-1 font-medium line-clamp-1">
									{card.subtitle}
								</p>
							</div>

							<div className="pr-10">
								<ChevronRight
									size={32}
									strokeWidth={2.5}
									className="text-gray-500 group-hover:text-white transition-colors"
								/>
							</div>
						</div>
					);
				})}
			</div>
		</div>
	);
}
