import type { Metadata } from "next";
import { protect_route } from "@/lib/auth-server";
import { Sidebar } from "./components/sidebar";

export const metadata: Metadata = {
	title: "Start a New chat!",
	description: "Start a New chat!",
};

export default async function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	await protect_route();

	return (
		<div className="h-dvh w-dvw flex">
			<Sidebar />
			{children}
		</div>
	);
}
