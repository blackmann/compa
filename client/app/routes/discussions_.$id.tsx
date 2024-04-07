import {
	ActionFunctionArgs,
	LoaderFunctionArgs,
	MetaFunction,
	json,
	redirect,
} from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import React from "react";
import { Avatar } from "~/components/avatar";
import { LoginComment } from "~/components/login-comment";
import { MediaItem } from "~/components/media-item";
import { PostInput } from "~/components/post-input";
import { PostItem, PostItemProps } from "~/components/post-item";
import { PostMenu } from "~/components/post-menu";
import { PostPeople } from "~/components/post-people";
import { PostTime } from "~/components/post-time";
import { Tags } from "~/components/tags";
import { Votes } from "~/components/votes";
import { checkAuth } from "~/lib/check-auth";
import { createPost } from "~/lib/create-post";
import { useGlobalCtx } from "~/lib/global-ctx";
import { prisma } from "~/lib/prisma.server";
import { render } from "~/lib/render.server";
import { values } from "~/lib/values.server";
import { Content } from "~/components/content";
import { Username } from "~/components/username";
import { createPostNotification } from "~/lib/create-post-notification";

export const loader = async ({ params }: LoaderFunctionArgs) => {
	const postId = Number(params.id as string);

	const post = await prisma.post.findFirst({
		where: { id: postId },
		include: { user: true, media: true },
	});

	if (!post) {
		throw new Response("Not found", { status: 404 });
	}

	const content = await render(post.content);

	const comments = await prisma.post.findMany({
		where: { parentId: post.id },
		include: { user: true, media: true },
	});

	for (const comment of comments) {
		comment.content = await render(comment.content);
	}

	return json({
		comments,
		meta: values.meta(),
		post,
		content: content,
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

			await createPost(data, userId);

			const user = await prisma.user.findFirst({ where: { id: userId } });

			const summary = data?.content.substring(0, 30);

			await createPostNotification({
				message: `${user?.username} posted on ${summary}}`,
				actorId: userId,
				entityId: Number(params.id),
			});

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
	const { comments, post, content } = useLoaderData<typeof loader>();
	const { user } = useGlobalCtx();

	return (
		<div className="container mx-auto min-h-[60vh]">
			<div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
				<div className="col-span-1"> </div>

				<div className="col-span-1 lg:col-span-2">
					<div className="flex gap-2">
						<div className="flex flex-col items-center">
							<div className="mb-2">
								<Avatar name={post.user.username} />
							</div>

							<Votes post={post} />
						</div>

						<div className="border-b dark:border-neutral-700 pb-2 flex-1 w-0">
							<header className="flex justify-between">
								<span className="font-mono text-secondary">
									<Username user={post.user} /> &bull;{" "}
									<PostTime time={post.createdAt} />
								</span>

								<div>
									<PostMenu post={post} />
								</div>
							</header>

							<Tags className="mb-4" tags={post.tags} />

							<div className="-mt-2">
								<Content content={content} />

								{post.media.length > 0 && (
									<div className="grid xl:grid-cols-3 md:grid-cols-2 grid-cols-1 gap-2 flex-wrap mt-2">
										{post.media.map((media) => (
											<div className="col-span-1" key={media.id}>
												<a
													className="block"
													href={media.url}
													target="_blank"
													rel="noreferrer"
												>
													<MediaItem media={media} />
												</a>
											</div>
										))}
									</div>
								)}
							</div>

							<footer className="mt-2 flex justify-between">
								<span className="inline-flex items-center gap-2 text-secondary">
									<div className="i-lucide-message-circle inline-block" />{" "}
									{post.commentsCount || "Leave a comment"}
								</span>

								<span className="inline-flex items-center gap-2 text-secondary">
									<div className="i-lucide-users-2 inline-block" />{" "}
									{post.people} {post.people === 1 ? "person" : "people"}
								</span>
							</footer>
						</div>
					</div>

					<div className="flex gap-2 mt-4">
						{user ? (
							<>
								<Avatar name={user?.username || ""} />
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
