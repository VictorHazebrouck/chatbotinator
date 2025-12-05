import { auth } from "@repo/auth";
import { FetchCreateContextFnOptions } from "@trpc/server/adapters/fetch";

export async function create_context({ req, resHeaders }: FetchCreateContextFnOptions) {
	const session = await auth.api.getSession({
		headers: req.headers,
	});

	return { req, resHeaders, session };
}

export type Context = Awaited<ReturnType<typeof create_context>>;
