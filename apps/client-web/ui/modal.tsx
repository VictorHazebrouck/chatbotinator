import React from "react";
import ReactDOM from "react-dom";
import { twMerge } from "tailwind-merge";

export interface ModalProps {
	on_click_outside: () => void;
	is_visible: boolean;
	className?: string;
	classNameBackground?: string;
	children: React.ReactNode;
}
export function Modal(props: ModalProps) {
	React.useEffect(() => {
		if (!props.is_visible) {
			return;
		}

		function handler(e: KeyboardEvent) {
			if (e.key === "Escape") {
				props.on_click_outside();
			}
		}

		window.addEventListener("keydown", handler);
		return () => window.removeEventListener("keydown", handler);
	}, [props.on_click_outside, props.is_visible]);

	if (!props.is_visible) {
		return null;
	}

	return ReactDOM.createPortal(
		/* biome-ignore lint: modal stuff */
		<div
			className={twMerge(
				"fixed inset-0 z-50 bg-bg-dark/30 flex items-center justify-center",
				props.classNameBackground,
			)}
			onClick={props.on_click_outside}
		>
			{/* biome-ignore lint: modal stuff */}
			<div
				className={twMerge(
					"relative z-10 bg-bg-base border-border rounded-radius border",
					props.className,
				)}
				onClick={(e) => e.stopPropagation()}
			>
				{props.children}
			</div>
		</div>,
		document.body,
	);
}
