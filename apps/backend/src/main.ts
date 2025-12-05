import { auth } from "@repo/auth";
import { fetchRequestHandler } from "@trpc/server/adapters/fetch";
import { serve } from "bun";
import { create_context } from "./trpc-context.js";
import { app_router } from "./trpc-router.js";

const { CLIENT_WEB_DOMAIN } = process.env;

if (!CLIENT_WEB_DOMAIN) {
	throw Error("missing CLIENT_WEB_DOMAIN env var.");
}

const ALLOWED_ORIGINS = [CLIENT_WEB_DOMAIN];

function attach_cors_headers(req: Request, res: Response) {
	const origin = req.headers.get("Origin");

	if (origin && ALLOWED_ORIGINS.includes(origin)) {
		res.headers.set("Access-Control-Allow-Origin", origin);
		res.headers.set("Access-Control-Allow-Credentials", "true");
	}

	res.headers.set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
	res.headers.set("Access-Control-Allow-Headers", "Content-Type, Authorization, trpc-accept");

	return res;
}

const server = serve({
	routes: {
		"/trpc/*": {
			OPTIONS: (req) => {
				const res = new Response(null, { status: 204 });
				return attach_cors_headers(req, res);
			},
			GET: async (req) => {
				const res = await fetchRequestHandler({
					endpoint: "/trpc",
					req: req,
					router: app_router,
					createContext: create_context,
				});
				return attach_cors_headers(req, res);
			},
			POST: async (req) => {
				const res = await fetchRequestHandler({
					endpoint: "/trpc",
					req: req,
					router: app_router,
					createContext: create_context,
				});
				return attach_cors_headers(req, res);
			},
		},
		"/api/auth/*": {
			OPTIONS: (req) => {
				const res = new Response(null, { status: 204 });
				return attach_cors_headers(req, res);
			},
			GET: async (req) => {
				const res = await auth.handler(req);
				return attach_cors_headers(req, res);
			},
			POST: async (req) => {
				const res = await auth.handler(req);
				return attach_cors_headers(req, res);
			},
		},
	},
	error: (_err) => {
		return new Response("Internal Server Error", { status: 500 });
	},
	fetch: (_req) => {
		return new Response("Not Found", { status: 404 });
	},
	development: process.env.NODE_ENV === "developpement",
	port: process.env.PORT ?? 3000,
});

console.log(`server started: ${server.url.host}`);
