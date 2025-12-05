"use client";

import { useQuery } from "@tanstack/react-query";
import { useParams } from "next/navigation";
import ReactMarkdown from "react-markdown";
import { twMerge } from "tailwind-merge";
import { useTRPC } from "@/lib/trpc-provider";

interface ChatMessageProps {
	id: string;
	content: string;
}

function ChatMessageUser(props: ChatMessageProps) {
	return (
		<div
			className={twMerge(
				"px-4 py-2 bg-bg-base rounded-radius border border-borderc max-w-3/4 ml-auto",
			)}
		>
			<p className="text-wrap">{props.content}</p>
		</div>
	);
}

function ChatMessageGPT(props: ChatMessageProps) {
	return (
		<div
			className={twMerge(
				"markdown px-4 py-2 bg-bg-base rounded-radius border border-borderc max-w-3/4 mr-auto overflow-x-auto scrollbar-hide prose",
			)}
		>
			<ReactMarkdown>{props.content}</ReactMarkdown>
		</div>
	);
}

export function MessagesList() {
	const { id } = useParams();
	const trpc = useTRPC();
	const { data: messages } = useQuery(
		trpc.chat_message_list.queryOptions({ chat_id: id!.toString() }),
	);

	return (
		<div className="relative w-full h-full">
			<div className="absolute inset-0 overflow-y-auto scrollbar-hide p-8 h-full flex flex-col-reverse">
				<div className="flex flex-col-reverse gap-2">
					{messages?.map((e) =>
						e.from_user === "user" ? (
							<ChatMessageUser key={e.id} id={e.id} content={e.content} />
						) : (
							<ChatMessageGPT key={e.id} id={e.id} content={e.content} />
						),
					)}
				</div>
			</div>
		</div>
	);
}
