import { Metadata } from "next";
import { ChatTextarea } from "./components/chat-textara";
import { MessagesList } from "./components/messages-list";

export const metadata: Metadata = {
	title: "Start a New chat!",
	description: "Start a New chat!",
};

export default function Chat() {
	return (
		<div className="flex flex-col h-full w-full bg-bg-dark">
			<div className="h-full flex flex-col">
				<MessagesList />
			</div>
			<ChatTextarea />
		</div>
	);
}
