"use client";

import type { AppRouter } from "@repo/backend";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { createTRPCClient, httpBatchStreamLink } from "@trpc/client";
import { createTRPCContext } from "@trpc/tanstack-react-query";
import React from "react";

const { TRPCProvider, useTRPC, useTRPCClient } = createTRPCContext<AppRouter>();

export { useTRPC, useTRPCClient };

function make_query_client() {
	return new QueryClient({
		defaultOptions: { queries: { staleTime: 60_000 } },
	});
}

export function TRPCReactProvider({ children }: { children: React.ReactNode }) {
	const [query_client] = React.useState(make_query_client);
	const [trpc_client] = React.useState(() =>
		createTRPCClient<AppRouter>({
			links: [
				httpBatchStreamLink({
					url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/trpc`,
					fetch(url, options) {
						return fetch(url, { ...options, credentials: "include" });
					},
				}),
			],
		}),
	);

	return (
		<QueryClientProvider client={query_client}>
			<TRPCProvider trpcClient={trpc_client} queryClient={query_client}>
				{children}
			</TRPCProvider>
		</QueryClientProvider>
	);
}
