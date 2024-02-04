import BoringAvatar from "boring-avatars";

interface Props {
	name: string;
	size?: number;
}

const colors = ["#ffe12e", "#4d8c3a", "#0060ff", "#ff7d10", "#4e412b"];

const BA = BoringAvatar.default;

function Avatar({ name, size = 28 }: Props) {
	return <BA colors={colors} size={size} name={name} variant="beam" />;
}

export { Avatar };
