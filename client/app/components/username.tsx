import { User } from "@prisma/client";

interface Props {
	user: User;
	showVerfied?: boolean;
}

function Username({ showVerfied, user }: Props) {
	return (
		<span className="inline-flex gap-1 items-center">
			@{user.username}{" "}
			{user.verified && showVerfied && (
				<div className="inline-block i-lucide-verified text-green-500" />
			)}
			{/* This should be head */}
			{user.username === "notgr" && (
				<div className="inline-block i-lucide-crown text-amber-500" />
			)}
		</span>
	);
}

export { Username };
