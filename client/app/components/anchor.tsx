import { Link } from "@remix-run/react";
import { RemixLinkProps } from "@remix-run/react/dist/components";
import clsx from "clsx";
import React from "react";

interface Props extends RemixLinkProps {
	variant?: "primary" | "neutral";
}

const Anchor = React.forwardRef<HTMLAnchorElement, Props>(
	({ className, variant = "primary", ...props }, ref) => {
		return (
			<Link
				ref={ref}
				className={clsx(
					"inline-flex items-center gap-2 rounded-lg bg-blue-600 px-2 py-1 font-medium",
					{
						"bg-zinc-200 px-2 py-1 dark:bg-neutral-800": variant === "neutral",
						"text-white": variant === "primary",
					},
					className,
				)}
				{...props}
			/>
		);
	},
);

export { Anchor };
