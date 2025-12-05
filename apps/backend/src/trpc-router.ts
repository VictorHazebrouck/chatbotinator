import { GoogleGenAI } from "@google/genai";
import { db } from "@repo/db";
import { initTRPC } from "@trpc/server";
import { z } from "zod";
import { Context } from "./trpc-context.js";

const { GEMINI_API_KEY } = process.env;

if (!GEMINI_API_KEY) {
	throw Error("Missing GEMINI_API_KEY env var");
}

export const t = initTRPC.context<Context>().create();

export const app_router = t.router({
	chat_list: t.procedure.query(async ({ ctx }) => {
		if (!ctx.session) {
			throw Error("Unauthorized");
		}

		const chats = await db
			.selectFrom("chat")
			.selectAll()
			.where("user_id", "=", ctx.session.user.id)
			.orderBy("updated_at", "desc")
			.execute();

		return chats;
	}),
	chat_create: t.procedure.mutation(async ({ ctx }) => {
		if (!ctx.session) {
			throw Error("Unauthorized");
		}

		const [chat] = await db
			.insertInto("chat")
			.values({
				id: crypto.randomUUID(),
				user_id: ctx.session.user.id,
				name: "new chat",
			})
			.returningAll()
			.execute();

		if (!chat) {
			throw Error("Internal server errro");
		}

		return chat;
	}),
	chat_message_list: t.procedure
		.input(z.object({ chat_id: z.string() }))
		.query(async ({ ctx, input }) => {
			if (!ctx.session) {
				throw Error("Unauthorized");
			}

			const chat = await db
				.selectFrom("chat")
				.select(["id", "user_id"])
				.where("id", "=", input.chat_id)
				.executeTakeFirst();

			if (!chat || chat.user_id !== ctx.session.user.id) {
				throw new Error("Unauthorized");
			}

			const messages = await db
				.selectFrom("chat_message")
				.selectAll()
				.where("chat_id", "=", input.chat_id)
				.orderBy("created_at", "desc")
				.execute();

			return messages;
		}),
	chat_message_create: t.procedure
		.input(z.object({ content: z.string(), chat_id: z.string() }))
		.query(async function* ({ ctx, input }) {
			if (!ctx.session) {
				throw Error("Unauthorized");
			}

			const chat = await db
				.selectFrom("chat")
				.select(["id", "user_id"])
				.where("id", "=", input.chat_id)
				.executeTakeFirst();

			if (!chat || chat.user_id !== ctx.session.user.id) {
				throw new Error("Unauthorized");
			}

			const [new_user_message] = await db
				.insertInto("chat_message")
				.values({
					id: crypto.randomUUID(),
					from_user: "user",
					chat_id: input.chat_id,
					content: input.content,
				})
				.returningAll()
				.execute();

			await db
				.updateTable("chat")
				.set({
					updated_at: new Date(),
				})
				.where("id", "=", input.chat_id)
				.execute();

			const ai_message_id = crypto.randomUUID();
			yield {
				kind: "init",
				new_user_message: new_user_message!,
				ai_message_id: ai_message_id,
			} as const;

			const ai = new GoogleGenAI({ apiKey: GEMINI_API_KEY });

			const messages = await db
				.selectFrom("chat_message")
				.selectAll()
				.where("chat_id", "=", input.chat_id)
				.orderBy("created_at", "desc")
				.execute();

			const response = await ai.models.generateContentStream({
				model: "gemini-2.5-flash",
				contents: [
					...messages.map(
						(e) => `CONVERSATION_CONTEXT:FROM_USER: ${e.from_user}, CONTENT: ${e.content}`,
					),
					input.content,
				],
			});

			let content_acc = "";
			for await (const chunk of response) {
				content_acc += chunk.text;
				yield { kind: "chunk", text: chunk.text } as const;
			}

			await db
				.insertInto("chat_message")
				.values({
					id: ai_message_id,
					from_user: "gpt",
					chat_id: input.chat_id,
					content: content_acc,
				})
				.execute();
		}),
});

export type AppRouter = typeof app_router;
