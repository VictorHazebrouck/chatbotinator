import { twMerge } from "tailwind-merge";

export interface LoaderProps extends React.ComponentProps<"div"> {}
export function Skeleton({ className, ...props }: LoaderProps) {
	return <div className={twMerge("bg-bg-light animate-pulse rounded-md", className)} {...props} />;
}
