import clsx from "clsx";
import React from "react";

const Textarea = React.forwardRef<
	HTMLTextAreaElement,
	React.ComponentProps<"textarea">
>(({ className, ...props }, ref) => {
	return (
		<textarea
			className={clsx(
				"w-full rounded-lg bg-zinc-100 dark:bg-neutral-800 border-zinc-200 dark:border-neutral-700 p-2 h-30",
				className,
			)}
			ref={ref}
			{...props}
		/>
	);
});

export { Textarea };
