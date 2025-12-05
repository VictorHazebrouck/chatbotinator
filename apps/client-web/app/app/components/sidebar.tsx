"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { PencilIcon } from "lucide-react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useTRPC } from "@/lib/trpc-provider";
import { Button } from "@/ui/button";
import { Skeleton } from "@/ui/skeleton";

interface ChatHistoryItemProps {
	name: string;
	id: string;
}
function ChatHistoryItem(props: ChatHistoryItemProps) {
	const params = useParams();
	const is_active = params?.id === props.id;

	return (
		<Link href={`/app/${props.id}`} className="w-full">
			<Button is_active={is_active} className="w-full">
				{props.name}
			</Button>
		</Link>
	);
}

export function Sidebar() {
	const router = useRouter();
	const trpc = useTRPC();
	const query_client = useQueryClient();
	const { data: chats, isLoading } = useQuery(trpc.chat_list.queryOptions());
	const create_chat_mutation = useMutation(trpc.chat_create.mutationOptions());

	function create_chat() {
		create_chat_mutation.mutate(undefined, {
			onSuccess(chat) {
				query_client.invalidateQueries(trpc.chat_list.queryOptions());
				router.push(`/app/${chat.id}`);
			},
		});
	}

	return (
		<aside className="w-xs flex flex-col px-4 py-2 gap-2 border-r border-borderc">
			<Link href="/" className="pl-2 font-semibold">
				Chatify
			</Link>
			<div className="flex flex-col gap-1 py-2">
				<Button onClick={create_chat}>
					<PencilIcon className="size-4" />
					<p>New chat</p>
				</Button>
				{/*<Button>
					<SearchIcon className="size-4" />
					<p>Search chat</p>
				</Button>*/}
			</div>

			<p className="text-fg-dark pl-2">Chat History</p>
			<div className="flex flex-col h-full overflow-y-scroll scrollbar-hide gap-1 py-2">
				{isLoading && (
					<div className="flex flex-col gap-4 pt-2">
						<Skeleton className="h-6 rounded-radius" />
						<Skeleton className="h-6 rounded-radius" />
						<Skeleton className="h-6 rounded-radius" />
					</div>
				)}
				{!isLoading && !chats && <p>No chats yet</p>}
				{!!chats && chats.map((e) => <ChatHistoryItem key={e.id} id={e.id} name={e.name} />)}
			</div>
		</aside>
	);
}
