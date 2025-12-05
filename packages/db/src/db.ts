import { SQL } from "bun";
import { Kysely } from "kysely";
import { PostgresJSDialect } from "kysely-postgres-js";
import { Database } from "./types.js";

const { POSTGRES_DB, POSTGRES_HOST, POSTGRES_PORT, POSTGRES_USER, POSTGRES_PASSWORD } = process.env;

if (!POSTGRES_DB || !POSTGRES_HOST || !POSTGRES_PORT || !POSTGRES_USER || !POSTGRES_PASSWORD) {
	throw Error("Missing POSTGRES_xx Environment Variables");
}

// @ts-expect-error
if (!globalThis.kysely) {
	// @ts-expect-error
	globalThis.kysely = new Kysely<Database>({
		dialect: new PostgresJSDialect({
			postgres: new SQL({
				database: POSTGRES_DB,
				host: POSTGRES_HOST,
				max: 10, // max connections in pool
				port: POSTGRES_PORT,
				user: POSTGRES_USER,
				password: POSTGRES_PASSWORD,
			}),
		}),
	});
}

// @ts-expect-error
export const db = globalThis.kysely as Kysely<Database>;
// export const db = new Kysely<Database>({
// 	dialect: new PostgresJSDialect({
// 		postgres: new SQL({
// 			database: POSTGRES_DB,
// 			host: POSTGRES_HOST,
// 			max: 10,
// 			port: POSTGRES_PORT,
// 			user: POSTGRES_USER,
// 			password: POSTGRES_PASSWORD,
// 		}),
// 	}),
// });
