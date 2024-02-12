import clsx from "clsx";
import React from "react";
import ReactDOM from "react-dom";
import { useMounted } from "~/lib/use-mounted";

interface Props extends React.PropsWithChildren {
	className?: string;
	open?: boolean;
	onClose?: VoidFunction;
}

function Modal({ children, className, onClose, open }: Props) {
	const ref = React.useRef<HTMLDialogElement>(null);
	const mounted = useMounted()

	React.useEffect(() => {
		if (open) {
			ref.current?.showModal();
		} else {
			ref.current?.close();
		}

		ref.current?.addEventListener("close", () => {
			onClose?.();
		});
	}, [open, onClose]);

	if (!mounted) {
		return null;
	}

	return ReactDOM.createPortal(
		<dialog
			className={clsx(
				"rounded-lg border border-zinc-300 dark:border-neutral-700 shadow",
				className,
			)}
			ref={ref}
		>
			{children}
		</dialog>,
		document.body,
	);
}

export { Modal };
