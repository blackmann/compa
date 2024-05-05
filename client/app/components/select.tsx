import clsx from "clsx";
import React from "react";

const Select = React.forwardRef<
	HTMLSelectElement,
	React.ComponentProps<"select">
>(({ className, ...props }, ref) => (
	<select
		className={clsx(
			"block bg-zinc-200 dark:bg-neutral-800 px-2 py-1 pe-6 rounded-lg font-medium",
			className,
		)}
		ref={ref}
		{...props}
	/>
));

export { Select };
