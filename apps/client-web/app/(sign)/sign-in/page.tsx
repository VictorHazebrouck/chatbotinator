"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import React from "react";
import { Button } from "@/ui/button";
import { Input } from "@/ui/input";
import { auth_client } from "../../../lib/auth-client";

export default function SignIn() {
	const router = useRouter();
	const [email, set_email] = React.useState("");
	const [password, set_password] = React.useState("");

	async function signin() {
		await auth_client.signIn.email(
			{
				email,
				password,
			},
			{
				onSuccess: () => {
					router.push("/app");
				},
			},
		);
	}

	return (
		<div className="h-dvh w-dvw flex items-center justify-center bg-bg-dark">
			<div className="flex flex-col bg-bg-base border rounded-radius border-borderc gap-4 px-4 py-6 items-center">
				<Input
					type="email"
					value={email}
					onChange={(e) => set_email(e.target.value)}
					placeholder="email"
				/>
				<Input
					type="password"
					value={password}
					onChange={(e) => set_password(e.target.value)}
					placeholder="password"
				/>

				<Button type="button" onClick={signin}>
					Sign in
				</Button>

				<p className="mx-auto">or</p>

				<Link href="/sign-up">
					<Button type="button">Go to Sign Up</Button>
				</Link>
			</div>
		</div>
	);
}
