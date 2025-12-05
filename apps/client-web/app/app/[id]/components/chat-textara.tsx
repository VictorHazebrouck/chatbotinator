"use client";

import { useQueryClient } from "@tanstack/react-query";
import { SendIcon } from "lucide-react";
import { useParams } from "next/navigation";
import React from "react";
import { useTRPC, useTRPCClient } from "@/lib/trpc-provider";
import { Button } from "@/ui/button";
import { TextArea } from "@/ui/input";

export function ChatTextarea() {
	const { id } = useParams();
	const trpc = useTRPC();
	const trpc_client = useTRPCClient();
	const query_client = useQueryClient();
	const [input, set_input] = React.useState("");
	const chat_id = id!.toString();

	async function send_message() {
		const stream = await trpc_client.chat_message_create.query({
			content: input,
			chat_id,
		});

		let tmp_msg_id = "";
		for await (const chunk of stream) {
			if (chunk.kind === "init") {
				tmp_msg_id = chunk.ai_message_id;
				query_client.setQueryData(trpc.chat_message_list.queryKey({ chat_id }), (old) => {
					return [
						{
							id: tmp_msg_id,
							from_user: "gpt" as const,
							content: "...",
							chat_id,
							created_at: new Date().toISOString(),
						},
						chunk.new_user_message,
						...(old ?? []),
					];
				});
			} else {
				console.log("chunk:", chunk);
				query_client.setQueryData(trpc.chat_message_list.queryKey({ chat_id }), (old) => {
					return (old ?? []).map((msg) =>
						msg.id === tmp_msg_id ? { ...msg, content: msg.content + chunk.text } : msg,
					);
				});
			}
		}
	}

	return (
		<div className="flex w-full max-h-64 border-t border-borderc bg-bg-base lg:px-60 sm:px-3 py-3 gap-3">
			<div className="flex w-full overflow-auto rounded-radius bg-bg-light px-4 py-1.5 scrollbar-hide">
				<TextArea
					placeholder="Ask stuff..."
					value={input}
					onChange={(e) => set_input(e.target.value)}
				/>
			</div>
			<Button className="size-10 p-2" onClick={send_message}>
				<SendIcon />
			</Button>
		</div>
	);
}
