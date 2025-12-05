import React from "react";
import { twMerge } from "tailwind-merge";

export interface ButtonProps extends React.ComponentProps<"button"> {
	is_active?: boolean;
}
export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(function Button(props, ref) {
	const { className, children, is_active, ...rest } = props;
	return (
		<button
			ref={ref}
			className={twMerge(
				"flex items-center px-3 py-1.5 gap-2  hover:bg-bg-light rounded-radius cursor-pointer focus:bg-bg-light",
				is_active && "bg-bg-light/80 hover:bg-bg-light focus:bg-bg-light",
				className,
			)}
			{...rest}
		>
			{children}
		</button>
	);
});
