import { LoaderFunctionArgs, MetaFunction, json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import React from "react";
import { CommunityInfo } from "~/components/community-info";
import { CommunityMod } from "~/components/community-mod";
import { PostInput } from "~/components/post-input";
import { PostItem, PostItemProps } from "~/components/post-item";
import { checkAuth } from "~/lib/check-auth";
import { checkMod } from "~/lib/check-mod";
import { prisma } from "~/lib/prisma.server";
import { renderSummary } from "~/lib/render-summary.server";
import { values } from "~/lib/values.server";

export const loader = async ({ request, params }: LoaderFunctionArgs) => {
	const community = await prisma.community.findFirst({
		where: { handle: params.slug },
	});

	if (!community) {
		throw json({}, { status: 404 });
	}

	if (community.status !== "activated") {
		// only mods can arrive here
		try {
			await checkMod(request);
		} catch {
			throw json({}, { status: 404 });
		}
	}

	let userId: number | undefined;
	try {
		userId = await checkAuth(request);
	} catch {}

	const members = await prisma.communityMember.findMany({
		where: { communityId: community.id },
		orderBy: { role: "desc" },
		include: { user: true },
	});

	const membership = userId
		? await prisma.communityMember.findFirst({
				where: { communityId: community.id, userId },
		  })
		: null;

	const posts = await prisma.post.findMany({
		where: { communityId: community.id, parentId: null },
		include: { user: true, media: true, community: false },
		orderBy: { createdAt: "desc" },
	});

	for (const post of posts) {
		post.content = await renderSummary(post.content);
	}

	return json({ community, members, membership, posts, school: values.meta() });
};

export const meta: MetaFunction<typeof loader> = ({ data }) => {
	if (!data) return [];

	return [
		{
			title: `${data.community.name} (+${data.community.handle}) | ${data.school.shortName} ✽ compa`,
		},
		{ name: "description", content: data.community.description },
	];
};

export default function Community() {
	const { community, membership, posts } = useLoaderData<typeof loader>();

	return (
		<div className="container">
			<div className="grid grid-cols-1 lg:grid-cols-3 min-h-[60vh] gap-4">
				<div className="col-span-1 lg:col-span-2">
					<CommunityMod community={community} />

					<div className="lg:hidden mb-2">
						<CommunityInfo />
					</div>

					<PostInput
						disabled={!membership}
						dataExtra={{ communityId: community.id }}
					/>

					<div className="mt-2">
						{posts.map((post, i) => (
							<React.Fragment key={post.id}>
								<PostItem
									limit
									post={post as unknown as PostItemProps["post"]}
								/>

								{i < posts.length - 1 && (
									<hr className="me-2 ms-12 dark:border-neutral-700" />
								)}
							</React.Fragment>
						))}
					</div>
				</div>

				<div className="col-span-1 max-lg:hidden">
					<CommunityInfo />
				</div>
			</div>
		</div>
	);
}
