import { Prisma } from "@prisma/client";
import { useFetcher } from "@remix-run/react";
import { useGlobalCtx } from "~/lib/global-ctx";
import { DropdownMenu } from "./dropdown-menu";

interface Props {
  file: Prisma.RepositoryGetPayload<{ include: { user: true } }>;
}

function FileMenu({ file }: Props) {
  const { user } = useGlobalCtx();
  const fetcher = useFetcher();

  if (user?.id !== file.userId) {
    return <div className="size-8" />;
  }

  const menuItems = [
    { id: "delete-file", title: "Delete file", icon: "i-lucide-trash" },
  ];

  function handleClick(actionId: string) {
    if (actionId === "delete-file") {
      const yes = confirm(
        "Are you sure you want to delete this file? This cannot be undone."
      );

      if (yes) {
        fetcher.submit("", {
          method: "DELETE",
          action: `/library/${file.id}`,
        });
      }
    }
  }

  return <DropdownMenu items={menuItems} onItemClick={handleClick} />;
}

export { FileMenu };
