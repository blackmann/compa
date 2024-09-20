import { Form } from "@remix-run/react";
import { Button } from "./button";
import { Modal } from "./modal";

interface LogoutModalProps {
	isOpen: boolean;
	onCancel: () => void;
	onConfirm: () => void;
}

function LogoutModal({ isOpen, onCancel, onConfirm }: LogoutModalProps) {
	return (
		<Modal open={isOpen} onClose={onCancel}>
			<div className="p-4">
				<h2 className="text-base font-semibold flex items-center gap-1">
					Logout
				</h2>
				<p className="mt-2">Are you sure you want to log out?</p>
				<div className="flex justify-end mt-4 gap-2">
					<Button
						className="!text-black px-2 py-1 text-sm bg-gray-200 dark:bg-neutral-800 text-gray-800 !dark:text-white"
						onClick={onCancel}
					>
						Cancel
					</Button>
					<Form
						action="logout"
						method="post"
						className="transition-[background] duration-200 group cursor-pointer"
					>
						<Button
							onClick={onConfirm}
							className="text-white text-sm !bg-red-500"
						>
							Continue
						</Button>
					</Form>
				</div>
			</div>
		</Modal>
	);
}

export { LogoutModal };
