import { db } from "@repo/db";
import { betterAuth, type Auth } from "better-auth";

const { CLIENT_WEB_DOMAIN } = process.env;

if (!CLIENT_WEB_DOMAIN) {
	throw Error("Missing CLIENT_WEB_DOMAIN env var.");
}

// @ts-expect-error
if (!globalThis.betterAuthInstance) {
	// @ts-expect-error
	globalThis.betterAuthInstance = betterAuth({
		trustedOrigins: [CLIENT_WEB_DOMAIN],
		database: {
			db: db,
			type: "postgres",
		},
		emailAndPassword: {
			enabled: true,
		},
	});
}

// @ts-expect-error
export const auth = globalThis.betterAuthInstance as Auth<{
	trustedOrigins: [typeof CLIENT_WEB_DOMAIN];
	database: {
		db: typeof db;
		type: "postgres";
	};
	emailAndPassword: {
		enabled: true;
	};
}>;
