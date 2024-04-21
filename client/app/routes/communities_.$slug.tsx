import { MetaFunction, json } from "@remix-run/node";
import { Button } from "~/components/button";
import { PostInput } from "~/components/post-input";
import { values } from "~/lib/values.server";

export const loader = async () => {
	return json({ school: values.meta() });
};

export const meta: MetaFunction<typeof loader> = ({ data }) => {
	return [
		{ title: `Creative Creative | ${data?.school.shortName} ✽ compa` },
		{ name: "description", content: "" },
	];
};

export default function Community() {
	return (
		<div className="container mt-2">
			<div className="grid grid-cols-1 lg:grid-cols-3 min-h-[60vh] gap-4">
				<div className="col-span-1 lg:col-span-2">
					<PostInput />
				</div>

				<div className="col-span-1">
					<h1 className="font-bold text-lg leading-none">Creative Creative</h1>
					<div className="bg-rose-100 dark:bg-rose-900 dark:bg-opacity-20 rounded-lg inline-block text-rose-500 font-medium px-1 text-sm">
						+creative-club
					</div>

					{/* <div className="rounded-lg aspect-[5/2] bg-zinc-100 dark:bg-neutral-800 mt-2" /> */}

					<p className="">
						Learning, making and sharing. We make beautiful things with our
						minds. Doesn't matter what programme you read, you're welcome.
						Everyone is happy to help.
					</p>

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

					<div className="flex gap-2 items-center mt-2 font-medium text-secondary text-sm">
						<div className="i-lucide-users-2 inline-block" />
						13 members
					</div>
				</div>
			</div>
		</div>
	);
}
