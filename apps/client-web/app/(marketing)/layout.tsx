import type { Metadata } from "next";
import Header from "./header";

export const metadata: Metadata = {
	title: "Chatify.com",
	description: "Ze best",
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<>
			<Header />
			{children}
		</>
	);
}
