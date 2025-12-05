import { createAuthClient } from "better-auth/react";

const { NEXT_PUBLIC_BACKEND_URL } = process.env;

export const auth_client: ReturnType<typeof createAuthClient> = createAuthClient({
	baseURL: NEXT_PUBLIC_BACKEND_URL,
});
