import {
	ActionFunctionArgs,
	LoaderFunctionArgs,
	MetaFunction,
	json,
	redirect,
} from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { Avatar } from "~/components/avatar";
import { LoginComment } from "~/components/login-comment";
import { MediaItem } from "~/components/media-item";
import { PostInput } from "~/components/post-input";
import { PostItem, PostItemProps } from "~/components/post-item";
import { PostMenu } from "~/components/post-menu";
import { PostPeople } from "~/components/post-people";
import { PostTime } from "~/components/post-time";
import { Votes } from "~/components/votes";
import { checkAuth } from "~/lib/check-auth";
import { createPost } from "~/lib/create-post";
import { useGlobalCtx } from "~/lib/global-ctx";
import { prisma } from "~/lib/prisma.server";
import { values } from "~/lib/values.server";

export const loader = async ({ params }: LoaderFunctionArgs) => {
	const schoolName = values.get("shortName");
	const postId = Number(params.id as string);

	const post = await prisma.post.findFirst({
		where: { id: postId },
		include: { user: true, media: true },
	});

	if (!post) {
		throw new Response("Not found", { status: 404 });
	}

	const comments = await prisma.post.findMany({
		where: { parentId: post.id },
		include: { user: true, media: true },
	});

	return json({ comments, schoolName, post });
};

export const action = async ({ request, params }: ActionFunctionArgs) => {
	const userId = await checkAuth(request);
	switch (request.method) {
		case "DELETE": {
			const postId = Number(params.id);
			const post = await prisma.post.findFirst({ where: { id: postId } });

			await prisma.post.delete({ where: { id: postId, userId: userId } });

			if (!post?.parentId) {
				return redirect("/discussions");
			}

			return redirect(`/discussions/${post.parentId}`);
		}

		case "POST": {
			const data = await request.json();

			await createPost(data, userId);

			const comments = await prisma.post.count({
				where: { parentId: data.parentId },
			});

			const people = await prisma.user.count({
				where: { Post: { every: { id: data.parentId } } },
			});

			await prisma.post.update({
				where: { id: data.parentId },
				data: { commentsCount: comments, people },
			});

			return json({}, { status: 201 });
		}
	}

	return json({}, { status: 405 });
};

export const meta: MetaFunction<typeof loader> = ({ data }) => {
	return [{ title: `Discussions | ${data?.schoolName} | compa` }];
};

export default function Discussion() {
	const { comments, post } = useLoaderData<typeof loader>();
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

						<div className="border-b dark:border-neutral-700 pb-2 flex-1">
							<header className="flex justify-between">
								<span className="font-mono text-secondary">
									@{post.user.username} &bull;{" "}
									<PostTime time={post.createdAt} />
								</span>

								<div>
									<PostMenu post={post} />
								</div>
							</header>

							<div className="-mt-2">
								<p>{post.content}</p>

								{post.media.length > 0 && (
									<div className="grid xl:grid-cols-3 md:grid-cols-2 grid-cols-1 gap-2 flex-wrap mt-2">
										{post.media.map((media) => (
											<div className="col-span-1">
												<a
													className="block"
													href={media.url}
													target="_blank"
													rel="noreferrer"
												>
													<MediaItem key={media.id} media={media} />
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
									{post.people} people
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
						{comments.map((comment) => (
							<PostItem
								key={comment.id}
								post={comment as unknown as PostItemProps["post"]}
								level={1}
							/>
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
