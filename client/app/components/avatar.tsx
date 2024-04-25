import BoringAvatar, { AvatarProps } from "boring-avatars";
import clsx from "clsx";

interface Props {
	name: string;
	size?: number;
	className?: string;
	variant?: AvatarProps["variant"];
}

const colors = ["#ffe12e", "#4d8c3a", "#0060ff", "#ff7d10", "#4e412b"];

const BA = BoringAvatar.default;

function Avatar({ className, name, size = 28, variant = "beam" }: Props) {
	return (
		<div className={clsx("rounded-full overflow-hidden aspect-square self-start", className)}>
			<BA colors={colors} size={size} name={name} square variant={variant} />
		</div>
	);
}

export { Avatar };
