import { LoaderFunctionArgs, MetaFunction, json } from "@remix-run/node";
import { Link, useLoaderData, useParams } from "@remix-run/react";
import { Avatar } from "~/components/avatar";
import { checkAuth } from "~/lib/check-auth";
import { ellipsize } from "~/lib/ellipsize";
import { useGlobalCtx } from "~/lib/global-ctx";
import { prisma } from "~/lib/prisma.server";
import { values } from "~/lib/values.server";

export const loader = async ({ request }: LoaderFunctionArgs) => {
	const userId = await checkAuth(request);
	const user = await prisma.user.findUnique({ where: { id: userId } });

	const memberships = await prisma.communityMember.findMany({
		where: { userId },
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
	const { user } = useGlobalCtx();
	const { username } = useParams();
	const { communities } = useLoaderData<typeof loader>();

	return (
		<div>
			<ul>
				{communities.map((community) => (
					<li>
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
