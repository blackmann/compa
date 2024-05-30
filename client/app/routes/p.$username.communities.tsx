import {
	json,
	type LoaderFunctionArgs,
	type MetaFunction,
} from "@remix-run/node";
import {
	Link,
	useLoaderData,
	useParams,
	useRouteLoaderData,
} from "@remix-run/react";
import { Avatar } from "~/components/avatar";
import { ellipsize } from "~/lib/ellipsize";
import { prisma } from "~/lib/prisma.server";
import { notFound } from "~/lib/responses";
import { values } from "~/lib/values.server";
import type { loader as rootLoader } from "~/root";

export const loader = async ({ request, params }: LoaderFunctionArgs) => {
	const user = await prisma.user.findFirst({
		where: { username: params.username },
	});

	if (!user) {
		throw notFound();
	}

	const memberships = await prisma.communityMember.findMany({
		where: { userId: user.id },
		include: { community: true },
	});

	const communities = memberships.map((m) => m.community);

	return json({ user, meta: values.meta(), communities });
};

export const meta: MetaFunction<typeof loader> = ({ data }) => {
	return [
		{
			title: `@${data?.user?.username} / Communities | ${data?.meta.shortName} ✽ compa`,
		},
	];
};

export default function ProfileCommunities() {
	const { user } = useRouteLoaderData<typeof rootLoader>("root") || {};
	const { username } = useParams();
	const { communities } = useLoaderData<typeof loader>();

	return (
		<div>
			<ul>
				{communities.map((community) => (
					<li key={community.id}>
						<Link
							className="flex gap-2 p-2 rounded-lg hover:bg-zinc-100 dark:hover:bg-neutral-800"
							to={`/communities/${community.handle}`}
						>
							<Avatar
								name={community.handle}
								variant="marble"
								className="!rounded-lg"
							/>

							<div>
								<header className="font-medium">{community.name}</header>
								<p className="text-secondary text-sm leading-none">
									{ellipsize(community.description, 60)}
								</p>
							</div>
						</Link>
					</li>
				))}
			</ul>

			{communities.length === 0 && (
				<div className="text-secondary">
					Not part of any community.{" "}
					{user?.username === username && (
						<Link className="underline" to="/communities">
							Find a community here
						</Link>
					)}
				</div>
			)}
		</div>
	);
}
