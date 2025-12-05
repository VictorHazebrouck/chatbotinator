import { Kysely, sql } from "kysely";

export async function up(db: Kysely<unknown>): Promise<void> {
	await db.schema
		.createTable("chat_message")
		.addColumn("id", "text", (col) => col.primaryKey())
		.addColumn("chat_id", "text", (col) => col.notNull().references("chat.id").onDelete("cascade"))
		.addColumn("content", "text", (col) => col.notNull())
		.addColumn("from_user", "text", (col) => col.notNull())
		.addColumn("created_at", "timestamp", (col) => col.notNull().defaultTo(sql`NOW()`))
		.execute();
}

export async function down(db: Kysely<unknown>): Promise<void> {
	await db.schema.dropTable("chat_message").execute();
}
