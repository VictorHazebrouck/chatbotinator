import React from "react";
import TextareaAutosize, { TextareaAutosizeProps } from "react-textarea-autosize";
import { twMerge } from "tailwind-merge";

export interface TextAraProps
	extends TextareaAutosizeProps,
		React.RefAttributes<HTMLTextAreaElement> {}
export function TextArea(props: TextAraProps) {
	const { className, ...rest } = props;
	return (
		<TextareaAutosize
			className={twMerge(
				"border-borderc w-full resize-none placeholder-shown:text-fg-darker bg-bg-light rounded-radius h-6",
				className,
			)}
			{...rest}
		/>
	);
}

export interface InputProps extends React.ComponentProps<"input"> {}
export const Input = React.forwardRef<HTMLInputElement, InputProps>(function Input(props, ref) {
	const { className, ...rest } = props;
	return (
		<input
			ref={ref}
			className={twMerge(
				"border-border px-4 w-full py-2  placeholder-shown:text-fg-darker focus:underline",
				className,
			)}
			{...rest}
		/>
	);
});

export interface EditableTextProps {
	value: string;
	on_value_set: (v: string) => void;
}
export function EditableText(props: EditableTextProps) {
	const [value, set_value] = React.useState(props.value);
	const [mode, set_mode] = React.useState<"view" | "edit">("view");
	const input_ref = React.useRef<HTMLInputElement>(null);

	React.useEffect(() => {
		set_value(props.value);
	}, [props.value]);

	React.useEffect(() => {
		if (mode === "edit") {
			// input_ref.current?.focus();
			input_ref.current?.select();
		}
	}, [mode]);

	function handle_key_down(e: React.KeyboardEvent<HTMLInputElement>) {
		if (e.key === "Enter") {
			props.on_value_set(value);
			set_mode("view");
		}
		if (e.key === "Escape") {
			set_value(props.value);
			set_mode("view");
		}
	}

	function handle_double_click() {
		set_mode("edit");
	}

	return (
		<button
			type="button"
			className="flex items-center bg-transparent"
			onDoubleClick={handle_double_click}
		>
			{mode === "view" && <p className="cursor-pointer">{value}</p>}
			{mode === "edit" && (
				<input
					ref={input_ref}
					value={value}
					onKeyDown={handle_key_down}
					onChange={(e) => set_value(e.target.value)}
				/>
			)}
		</button>
	);
}
