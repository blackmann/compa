import clsx from "clsx";
import React from "react";

const Input = React.forwardRef<HTMLInputElement, React.ComponentProps<"input">>(
	({ className, ...props }, ref) => {
		return (
			<input
				ref={ref}
				className={clsx(
					"block w-full rounded-lg bg-zinc-200 dark:bg-neutral-800 px-2 py-1",
					className,
				)}
				{...props}
			/>
		);
	},
);

export { Input };
