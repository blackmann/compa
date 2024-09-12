import clsx from "clsx";
import React from "react";
import ReactDOM from "react-dom";
import { useMounted } from "~/lib/use-mounted";

interface Props extends React.PropsWithChildren {
	className?: string;
	open?: boolean;
	onClose?: VoidFunction;
}

function Dialog({ children, className, onClose, open }: Props) {
	const ref = React.useRef<HTMLDialogElement>(null);
	const mounted = useMounted();

	React.useEffect(() => {
		const dialogRef = ref.current;

		if (!dialogRef) return;

		if (open) {
			dialogRef.showModal();
		} else {
			dialogRef.close();
		}

		const handleClose = () => {
			onClose?.();
		};

		dialogRef.addEventListener("close", handleClose);

		return () => {
			dialogRef.removeEventListener("close", handleClose);
		};
	}, [open, onClose]);

	if (!mounted) {
		return null;
	}

	return ReactDOM.createPortal(
		<dialog
			className={clsx(
				"rounded-xl border border-zinc-300 dark:border-neutral-700 shadow dark:bg-neutral-900",
				className,
			)}
			ref={ref}
		>
			{children}
		</dialog>,
		document.body,
	);
}

export { Dialog };
