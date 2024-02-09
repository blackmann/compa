import {
	ActionFunctionArgs,
	LoaderFunctionArgs,
	MetaFunction,
	json,
} from "@remix-run/node";
import { Link, useLoaderData } from "@remix-run/react";
import React from "react";
import { PostFilter } from "~/components/post-filter";
import { PostInput } from "~/components/post-input";
import { PostItem, PostItemProps } from "~/components/post-item";
import { checkAuth } from "~/lib/check-auth";
import { createPost } from "~/lib/create-post";
import { useGlobalCtx } from "~/lib/global-ctx";
import { prisma } from "~/lib/prisma.server";
import { values } from "~/lib/values.server";
import { withUserPrefs } from "~/lib/with-user-prefs";
import qs from "qs";

export const loader = async ({ request }: LoaderFunctionArgs) => {
	const searchQuery = new URL(request.url).search.substring(1);
	const queryParams = qs.parse(searchQuery);

	const tags = Object.entries(queryParams.tags || {}).flatMap(
		([id, selection]) => {
			if (Array.isArray(selection)) {
				return selection.map((s) => ({
					tags: { contains: `${id}:${selection}` },
				}));
			}

			return { tags: { contains: `${id}:${selection}` } };
		},
	);

	const tagsFilter = tags.length ? { AND: tags } : {};

	const posts = await prisma.post.findMany({
		where: { parentId: null, ...tagsFilter, },
		include: { user: true, media: true },
		orderBy: { createdAt: "desc" },
	});

	return json(
		{ school: values.meta(), posts },
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
		{ title: `Discussions | ${data?.school.shortName} | compa` },
		{
			name: "description",
			content: `Find out about all the conversations going on in ${data?.school.shortName}. Share ideas and learn from each other.`,
		},
	];
};

export default function Discussions() {
	const { posts } = useLoaderData<typeof loader>();
	const { user } = useGlobalCtx();

	return (
		<div className="container mx-auto min-h-[60vh]">
			<div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
				<div className="col-span-1"> </div>

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
						<PostFilter />
					</div>

					{posts.map((post, i) => (
						<React.Fragment key={post.id}>
							<PostItem limit post={post as unknown as PostItemProps["post"]} />

							{i < posts.length - 1 && (
								<hr className="me-2 ms-12 dark:border-neutral-700" />
							)}
						</React.Fragment>
					))}
				</div>

				<div className="cols-span-1">
					<div> </div>
				</div>
			</div>
		</div>
	);
}
