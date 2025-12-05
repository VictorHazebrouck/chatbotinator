import { Button } from "@/ui/button";
import Link from "next/link";

export default function Header() {
	return (
		<div className="flex border-b border-borderc items-center px-10 py-2 gap-2">
			<Link href="/" className="pl-2 font-semibold">
				Chatify
			</Link>

			<Link href="/sign-in" className="ml-auto">
				<Button>Sign in</Button>
			</Link>
			<Link href="/sign-up">
				<Button>Sign up</Button>
			</Link>
		</div>
	);
}
