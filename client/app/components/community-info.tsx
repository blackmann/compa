import { Community } from "@prisma/client";
import { Jsonify } from "type-fest";
import { Button } from "./button";

interface Props {
	community: Community | Jsonify<Community>;
}

function CommunityInfo({ community }: Props) {
	return (
		<>
			<h1 className="font-bold text-lg leading-none">{community.name}</h1>
			<div className="bg-rose-100 dark:bg-rose-900 dark:bg-opacity-20 rounded-lg inline-block text-rose-500 font-medium px-1 text-sm">
				+{community.handle}
			</div>

			{/* <div className="rounded-lg aspect-[5/2] bg-zinc-100 dark:bg-neutral-800 mt-2" /> */}

			<p className="">{community.description}</p>

			<div className="border dark:border-neutral-800 rounded-lg p-2 mt-2">
				<header className="font-mono text-xs text-secondary">
					Join to interact
				</header>
				<p className="text-sm">
					To be able to start and participate in conversations in this
					community, you need to join first.
				</p>

				<div className="mt-2">
					<Button>Join community</Button>
				</div>
			</div>

			{/* <div className="border rounded-lg p-2 mt-2">
						<header className="font-mono text-xs text-secondary">
							Upcoming event
						</header>
						<p className="text-sm">Lecture 7: Developing a pixel art editor</p>
						<p className="text-secondary text-sm font-medium">Sat, 17 Apr.</p>
					</div> */}

			<div className="flex gap-2 items-center mt-2 font-medium text-secondary text-sm max-lg:hidden">
				<div className="i-lucide-users-2 inline-block" />
				13 members
			</div>
		</>
	);
}

export { CommunityInfo };
