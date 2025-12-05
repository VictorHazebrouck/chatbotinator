import { auth } from "@repo/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

const { NEXT_PUBLIC_BACKEND_URL } = process.env;

if (!NEXT_PUBLIC_BACKEND_URL) {
	throw Error("Missing NEXT_PUBLIC_BACKEND_URL en var.");
}

export async function get_auth_client_server() {
	const session = await auth.api.getSession({
		headers: await headers(),
	});
	return session;
}

export async function protect_route() {
	const session = await get_auth_client_server();

	if (!session) {
		redirect("/");
	}

	return session;
}
