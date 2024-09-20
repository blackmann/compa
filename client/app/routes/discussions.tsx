import {
	type ActionFunctionArgs,
	type LoaderFunctionArgs,
	type MetaFunction,
	json,
} from "@remix-run/node";
import {
	Link,
	useFetcher,
	useLoaderData,
	useLocation,
	useRouteLoaderData,
} from "@remix-run/react";
import qs from "qs";
import React from "react";
import { DiscussionsEmpty } from "~/components/discussions-empty";
import { PostInput } from "~/components/post-input";
import { PostItem, type PostItemProps } from "~/components/post-item";
import { TagsFilter } from "~/components/tags-filter";
import { checkAuth } from "~/lib/check-auth";
import { createPost } from "~/lib/create-post";
import { createTagsQuery } from "~/lib/create-tags-query";
import { includeVotes } from "~/lib/include-votes";
import { prisma } from "~/lib/prisma.server";
import { renderSummary } from "~/lib/render-summary.server";
import { values } from "~/lib/values.server";
import { withUserPrefs } from "~/lib/with-user-prefs";
import type { loader as rootLoader } from "~/root";

const PAGE_SIZE = 50;

export const loader = async ({ request }: LoaderFunctionArgs) => {
	const searchQuery = new URL(request.url).search.substring(1);
	const queryParams = qs.parse(searchQuery);

	const tagsFilter = createTagsQuery(queryParams.tags as qs.ParsedQs);
	const $lt = (queryParams.createdAt as qs.ParsedQs)?.$lt as string | null;
	const timestampFilter = $lt ? { lt: new Date($lt) } : undefined;

	let memberships: number[] = [];
	try {
		const userId = await checkAuth(request);
		memberships = (
			await prisma.communityMember.findMany({
				where: { userId },
				select: { communityId: true },
			})
		).map((m) => m.communityId);
	} catch {}

	const posts = await prisma.post.findMany({
		take: PAGE_SIZE,
		where: {
			parentId: null,
			OR: [{ communityId: null }, { communityId: { in: memberships } }],
			AND: [...tagsFilter],
			createdAt: timestampFilter,
		},
		include: { user: true, media: true, community: true },
		orderBy: { createdAt: "desc" },
	});

	for (const post of posts) {
		post.content = await renderSummary(post.content);
	}

	return json(
		{ school: values.meta(), posts: await includeVotes(posts, request) },
		{
			headers: {
				"Set-Cookie": await withUserPrefs(request, { lastBase: "discussions" }),
			},
		},
	);
};

export const action = async ({ request }: ActionFunctionArgs) => {
	const userId = await checkAuth(request);
	const data = await request.json();

	await createPost(data, userId);

	return json({}, { status: 201 });
};

export const meta: MetaFunction<typeof loader> = ({ data }) => {
	return [
		{ title: `Discussions | ${data?.school.shortName} ✽ compa` },
		{
			name: "description",
			content: `Find out about all the conversations going on in ${data?.school.shortName}. Share ideas and learn from each other.`,
		},
	];
};

export default function Discussions() {
	const { posts } = useLoaderData<typeof loader>();
	const { user } = useRouteLoaderData<typeof rootLoader>("root") || {};

	const contentRef = React.useRef<HTMLDivElement>(null);

	return (
		<div className="container mx-auto min-h-[60vh]" ref={contentRef}>
			<div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
				<div className="col-span-1 lg:col-span-2">
					<div className="mb-4">
						{!user && (
							<div className="p-2">
								<p className="text-secondary">
									You must be{" "}
									<Link className="underline text-reset" to="/login">
										logged in
									</Link>{" "}
									to create a discussion.
								</p>
							</div>
						)}
						<PostInput />
					</div>

					<hr className="mb-4 dark:border-t-neutral-800" />

					<div>
						<TagsFilter label="Filter discussions" path="/discussions" />
					</div>

					{posts.map((post, i) => (
						<React.Fragment key={post.id}>
							<PostItem limit post={post as unknown as PostItemProps["post"]} />

							{i < posts.length - 1 && (
								<hr className="me-2 ms-12 dark:border-neutral-700" />
							)}
						</React.Fragment>
					))}

					<Paginated fromDate={posts[posts.length - 1]?.createdAt} />

					{posts.length === 0 && (
						<div className="min-h-[40vh] flex flex-col items-center text-secondary">
							<div className="max-w-[20rem] w-full">
								<DiscussionsEmpty />
							</div>

							<div className="font-mono">Nothing here!</div>
							<div className="text-sm">
								If anyone is gonna start talking, it's you.
							</div>
						</div>
					)}
				</div>

				<div className="cols-span-1">
					<div> </div>
				</div>
			</div>
		</div>
	);
}

interface PaginatedProps {
	fromDate?: Date | string;
}

function Paginated({ fromDate }: PaginatedProps) {
	const fetcher = useFetcher<typeof loader>();
	const location = useLocation();

	function handleLoadMore() {
		fetcher.load(
			`/discussions?createdAt[$lt]=${fromDate}&${location.search.substring(1)}`,
		);
	}

	if (!fromDate) {
		return null;
	}

	if (fetcher.data) {
		const done = fetcher.data.posts.length < PAGE_SIZE;
		const posts = fetcher.data.posts;

		return (
			<>
				{posts.map((post, i) => (
					<React.Fragment key={post.id}>
						<PostItem limit post={post as unknown as PostItemProps["post"]} />

						{i < posts.length - 1 && (
							<hr className="me-2 ms-12 dark:border-neutral-700" />
						)}
					</React.Fragment>
				))}

				{done ? (
					<div className="flex justify-center items-center gap-2 text-secondary">
						<div className="i-lucide-arrow-down-right-square" /> fin
					</div>
				) : (
					<Paginated fromDate={posts[posts.length - 1]?.createdAt} />
				)}
			</>
		);
	}

	return (
		<div className="flex justify-center mt-2">
			{fetcher.state === "loading" ? (
				<div className="flex justify-center items-center gap-2 text-secondary">
					<span className="i-svg-spinners-180-ring-with-bg" /> Loading more…
				</div>
			) : (
				<button
					className="px-2 py-1 rounded-lg border dark:border-neutral-700 font-medium inline-flex items-center gap-2 text-secondary hover:bg-zinc-100 dark:hover:bg-neutral-800 transition-[background] duration-200"
					onClick={handleLoadMore}
					type="button"
				>
					<div className="i-lucide-chevron-down" /> Load more…
				</button>
			)}
		</div>
	);
}
