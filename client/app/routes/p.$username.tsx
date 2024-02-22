import {
	LoaderFunctionArgs,
	MetaFunction,
	json,
} from "@remix-run/node";
import { NavLink, useLoaderData, useOutlet } from "@remix-run/react";
import clsx from "clsx";
import React from "react";
import { Avatar } from "~/components/avatar";
import { PostItem, PostItemProps } from "~/components/post-item";
import { PostTime } from "~/components/post-time";
import { prisma } from "~/lib/prisma.server";
import { renderSummary } from "~/lib/render-summary.server";
import { values } from "~/lib/values.server";
import { Anchor } from "~/components/anchor";

export const loader = async ({ params }: LoaderFunctionArgs) => {
	const user = await prisma.user.findFirst({
		where: { username: params.username },
	});

	if (!user) {
		throw json({}, { status: 404 });
	}

	const posts = await prisma.post.findMany({
		where: { userId: user.id, parentId: null },
		orderBy: { createdAt: "desc" },
		include: { user: true, media: true },
	});

	for (const post of posts) {
		post.content = await renderSummary(post.content);
	}

	return { user, meta: values.meta(), posts };
};

export const meta: MetaFunction<typeof loader> = ({ data }) => {
	return [
		{ title: `@${data?.user?.username} | ${data?.meta.shortName} | compa` },
	];
};

const pageLinks = [
	{
		title: "Posts",
		href: "",
	},
	// {
	// 	title: "Comments",
	// 	href: "comments",
	// },
];

export default function Profile() {
	const { user, posts } = useLoaderData<typeof loader>();
	const outlet = useOutlet();

	return (
		<main className="container mx-auto min-h-[60vh]">
			<div className="grid lg:grid-cols-4">
				<div className="col-span-1 lg:col-span-2 lg:col-start-2">
					<div className="flex gap-2 pb-5 border-b dark:border-neutral-800">
						<Anchor href={`/p/${user.username}`}>
                            <Avatar name={user.username} />
                        </Anchor>

						<div>
							<div className="font-mono">@{user.username}</div>

							<div className="text-secondary">
								joined <PostTime time={user.createdAt} />
							</div>

							<div className="text-secondary bg-zinc-200 dark:bg-neutral-800 inline px-1 py-0.5 rounded-lg font-medium">
								{posts.length} discussions
							</div>
						</div>
					</div>

					<div>
						<header>
							<ul className="flex gap-2 my-2 ms-10">
								{pageLinks.map((link) => (
									<li className="block" key={link.href}>
										<NavLink
											className={({ isActive }) =>
												clsx(
													"block text-center font-medium flex-1 px-2 py-1 bg-zinc-200 dark:bg-neutral-800 rounded-lg text-secondary hover:bg-zinc-300 dark:hover:bg-neutral-700 transition-[background] duration-200",
													{
														"!bg-blue-600 !text-white": isActive,
													},
												)
											}
											to={link.href}
										>
											{link.title}
										</NavLink>
									</li>
								))}
							</ul>
						</header>

						{outlet || <Posts posts={posts} />}
					</div>
				</div>
			</div>
		</main>
	);
}

function Posts({ posts }: { posts: PostItemProps["post"][] }) {
	if (posts.length === 0) {
		return (
			<div className="p-4 text-secondary">
				<div className="inline-block i-lucide-signpost" /> No posts published
				yet
			</div>
		);
	}

	return posts.map((post, i) => (
		<React.Fragment key={post.id}>
			<PostItem limit post={post as unknown as PostItemProps["post"]} />

			{i < posts.length - 1 && (
				<hr className="me-2 ms-12 dark:border-neutral-700" />
			)}
		</React.Fragment>
	));
}
