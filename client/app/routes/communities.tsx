import { Link, MetaFunction, json, useLoaderData } from "@remix-run/react";
import { Anchor } from "~/components/anchor";
import { prisma } from "~/lib/prisma.server";
import { values } from "~/lib/values.server";

export const loader = async () => {
	const communities = await prisma.community.findMany({
		where: { status: "active" },
		orderBy: { name: "asc" },
	});

	return json({ communities, school: values.meta() });
};

export const meta: MetaFunction<typeof loader> = ({ data }) => {
	return [
		{ title: `Communities | ${data?.school.shortName} ✽ compa` },
		{
			name: "description",
			content:
				"Find people with similar interests with Communities. It's an opportunity to engage with like-minds; start conversations, share ideas and grow together.",
		},
	];
};

export default function Communities() {
	const { communities } = useLoaderData<typeof loader>();

	return (
		<div className="container min-h-[60vh] mt-2">
			<h1 className="font-bold flex-1 text-xl mb-2">Communities</h1>
			<div className="grid grid-cols-1 lg:grid-cols-3">
				<div className="col-span-1 lg:col-span-2">
					<p>
						Find people with similar interests with Communities. It's an
						opportunity to engage with like-minds; start conversations, share
						ideas and grow together.
					</p>

					<p className="mt-2 text-secondary">
						If you'd like to lead a community, click Start Community to get
						started.
					</p>
				</div>
			</div>
			<div className="mt-2">
				<Anchor to="/communities/new">Start a community</Anchor>
			</div>

			<ul className="mt-2">
				{communities.map((community) => {
					return (
						<li key={community.id}>
							<Link to={`/communities/${community.handle}`}>
								<div className="flex gap-2 hover:bg-zinc-100 dark:hover:bg-neutral-800 rounded-lg p-2">
									<div className="aspect-[3/2] dark:bg-neutral-800 w-[6rem] self-start rounded-lg bg-zinc-200" />
									<div className="flex-1">
										<h2 className="font-medium">{community.name}</h2>
										<p className="text-xs text-secondary font-mono">
											Open community &bull; {community.members} members
										</p>

										<p className="text-secondary text-sm">
											{community.description}
										</p>
									</div>
								</div>
							</Link>
						</li>
					);
				})}
			</ul>
		</div>
	);
}
