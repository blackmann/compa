import type { User } from "@prisma/client";
import {
	json,
	redirect,
	type ActionFunctionArgs,
	type LoaderFunctionArgs,
	type MetaFunction,
} from "@remix-run/node";
import { Link, useLoaderData, useRouteLoaderData } from "@remix-run/react";
import React from "react";
import { Avatar } from "~/components/avatar";
import { LoginComment } from "~/components/login-comment";
import { PostContent } from "~/components/post-content";
import { PostInput } from "~/components/post-input";
import { PostItem, type PostItemProps } from "~/components/post-item";
import { PostPeople } from "~/components/post-people";
import { checkAuth } from "~/lib/check-auth";
import { createPost } from "~/lib/create-post";
import { createPostNotification } from "~/lib/create-post-notification";
import { includeVotes } from "~/lib/include-votes";
import { prisma } from "~/lib/prisma.server";
import { render } from "~/lib/render.server";
import { values } from "~/lib/values.server";
import type { loader as rootLoader } from "~/root";

export const loader = async ({ request, params }: LoaderFunctionArgs) => {
	const postId = Number(params.id as string);

	const post = await prisma.post.findFirst({
		where: { id: postId },
		include: { user: true, media: true, community: true },
	});

	if (!post) {
		throw new Response("Not found", { status: 404 });
	}

	post.content = await render(post.content);

	const comments = await prisma.post.findMany({
		where: { parentId: post.id },
		include: { user: true, media: true },
	});

	for (const comment of comments) {
		comment.content = await render(comment.content);
	}

	let vote: boolean | undefined;
	try {
		const userId = await checkAuth(request);
		const voteRecord = await prisma.vote.findFirst({
			where: { userId, postId: postId },
		});

		vote = voteRecord?.up;
	} catch {}

	return json({
		comments: await includeVotes(comments, request),
		meta: values.meta(),
		post: { ...post, vote },
	});
};

export const action = async ({ request, params }: ActionFunctionArgs) => {
	const userId = await checkAuth(request);

	switch (request.method) {
		case "DELETE": {
			const postId = Number(params.id);
			const post = await prisma.post.findFirst({ where: { id: postId } });

			await prisma.post.delete({ where: { id: postId, userId: userId } });
			if (post?.parentId) {
				await updatePostProps(post.parentId);
			}

			if (!post?.parentId) {
				return redirect("/discussions");
			}

			return null;
		}

		case "POST": {
			const data = await request.json();

			const post = await createPost(data, userId);
			const user = (await prisma.user.findFirst({
				where: { id: userId },
			})) as User;

			await createPostNotification(post, user);

			await updatePostProps(data.parentId);

			return json({}, { status: 201 });
		}
	}

	return json({}, { status: 405 });
};

async function updatePostProps(postId: number) {
	const comments = await prisma.post.count({
		where: { parentId: postId },
	});

	const people = await prisma.user.count({
		where: {
			Post: {
				some: { OR: [{ id: postId }, { parentId: postId }], deleted: false },
			},
		},
	});

	await prisma.post.update({
		where: { id: postId },
		data: { commentsCount: comments, people },
	});
}

export const meta: MetaFunction<typeof loader> = ({ data }) => {
	const summary = data?.post.content.substring(0, 72);

	return [
		{
			title: `@${data?.post.user.username} posted in Discussions | ${data?.meta.shortName} ✽ compa`,
		},
		{ name: "description", content: `${summary}…` },
	];
};

export default function Discussion() {
	const { comments, post } = useLoaderData<typeof loader>();
	const { user } = useRouteLoaderData<typeof rootLoader>("root") || {};

	return (
		<div className="container mx-auto min-h-[60vh]">
			<div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
				<div className="col-span-1 lg:col-span-2">
					<PostContent post={post} />

					<div className="flex gap-2 mt-4">
						{user ? (
							<>
								<Link to={`/p/${user.username}`}>
									<Avatar name={user?.username || ""} />
								</Link>
								<div className="flex-1">
									<PostInput
										parent={post as unknown as PostItemProps["post"]}
										level={1}
									/>
								</div>
							</>
						) : (
							<LoginComment />
						)}
					</div>

					<div className="mt-2">
						{comments.map((comment, i) => (
							<React.Fragment key={comment.id}>
								<PostItem
									post={comment as unknown as PostItemProps["post"]}
									level={1}
								/>
								{i < comments.length - 1 && (
									<hr className="me-2 ms-12 dark:border-neutral-800" />
								)}
							</React.Fragment>
						))}
					</div>
				</div>

				<div className="cols-span-1 hidden lg:block">
					<PostPeople post={post} />
				</div>
			</div>
		</div>
	);
}
