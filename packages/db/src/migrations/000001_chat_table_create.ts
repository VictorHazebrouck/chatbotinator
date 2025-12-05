import { Kysely, sql } from "kysely";

export async function up(db: Kysely<unknown>): Promise<void> {
	await db.schema
		.createTable("chat")
		.addColumn("id", "text", (col) => col.primaryKey())
		.addColumn("user_id", "text", (col) => col.notNull().references("user.id").onDelete("cascade"))
		.addColumn("name", "text", (col) => col.defaultTo("New chat"))
		.addColumn("created_at", "timestamp", (col) => col.notNull().defaultTo(sql`NOW()`))
		.addColumn("updated_at", "timestamp", (col) => col.notNull().defaultTo(sql`NOW()`))
		.execute();
}

export async function down(db: Kysely<unknown>): Promise<void> {
	await db.schema.dropTable("chat").execute();
}
