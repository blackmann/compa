import BoringAvatar from "boring-avatars";
import clsx from "clsx";

interface Props {
  name: string;
  size?: number;
  className?: string;
}

const colors = ["#ffe12e", "#4d8c3a", "#0060ff", "#ff7d10", "#4e412b"];

const BA = BoringAvatar;

function Avatar({ className, name, size = 28 }: Props) {
  return (
    <div className={clsx("rounded-full", className)}>
      <BA colors={colors} size={size} name={name} variant="beam" />
    </div>
  );
}

export { Avatar };
