import { Community } from "@prisma/client";
import { useFetcher } from "@remix-run/react";
import { Jsonify } from "type-fest";
import { useGlobalCtx } from "~/lib/global-ctx";
import { Button } from "./button";

interface Props {
	community: Community | Jsonify<Community>;
}

function CommunityMod({ community }: Props) {
	const { user } = useGlobalCtx();
	const fetcher = useFetcher();

	const actions: { title: string; id: string }[] = [];

	if (community.status === "pending-approval") {
		actions.push({ title: "Approve", id: "approve" });
	}

	function handleAction(action: string) {
		switch (action) {
			case "approve": {
				fetcher.submit(JSON.stringify({ action }), {
					encType: "application/json",
					method: "POST",
					action: `/communities/${community.handle}/mod`,
				});
			}
		}
	}

	if (actions.length === 0) {
		return null;
	}

	if (user?.role !== "moderator") return null;

	return (
		<div className="mb-2 p-1 bg-red-50 border border-red-200 rounded-lg">
			<header className="font-mono text-xs text-red-500">community mod</header>

			<div className="flex">
				{actions.map((action) => (
					<Button
						className="text-sm p-1"
						variant="neutral"
						key={action.id}
						onClick={() => handleAction(action.id)}
						disabled={fetcher.state === "submitting"}
					>
						{action.title}
					</Button>
				))}
			</div>
		</div>
	);
}

export { CommunityMod };
