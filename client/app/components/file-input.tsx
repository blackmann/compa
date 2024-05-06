import clsx from "clsx";
import React from "react";

const FileInput = React.forwardRef<
	HTMLInputElement,
	React.ComponentProps<"input">
>(({ className, children, type, ...props }, ref) => {
	return (
		<label
			className={clsx(
				"flex rounded-lg px-2 py-1 font-medium bg-zinc-200 dark:bg-neutral-800 cursor-pointer w-[7.2rem] disabled:opacity-50",
				className,
				{ "opacity-60 !cursor-default": props.disabled },
			)}
		>
			<div className="flex items-center gap-2">{children}</div>
			<input
				type="file"
				className="opacity-0 h-0 w-0 overflow-hidden"
				{...props}
				ref={ref}
			/>
		</label>
	);
});

export { FileInput };
