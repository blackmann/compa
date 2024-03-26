import { User } from "@prisma/client";

interface Props {
  user: User;
  showVerified?: boolean;
}

function Username({ showVerified, user }: Props) {
  return (
    <span className="inline-flex gap-1 items-center">
      @{user.username}{" "}
      {user.verified && showVerified && (
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
