import type { Generated } from "kysely";

// better-auth generated table
export interface UserTable {
	id: string;
	name: string;
	email: string;
	emailVerified: boolean;
	createdAt: Date;
	updatedAt: Date;
}

export interface ChatTable {
	id: string;
	user_id: string;
	name: string;
	created_at: Generated<Date>;
	updated_at: Generated<Date>;
}

export interface ChatMessageTable {
	id: string;
	chat_id: string;
	content: string;
	from_user: "user" | "gpt";
	created_at: Generated<Date>;
}

export interface Database {
	user: UserTable;
	chat: ChatTable;
	chat_message: ChatMessageTable;
}
