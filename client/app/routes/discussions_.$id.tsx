import {
	ActionFunctionArgs,
	LoaderFunctionArgs,
	MetaFunction,
	json,
} from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { Avatar } from "~/components/avatar";
import { PostInput } from "~/components/post-input";
import { PostItem, PostItemProps } from "~/components/post-item";
import { PostTime } from "~/components/post-time";
import { checkAuth } from "~/lib/check-auth";
import { prisma } from "~/lib/prisma.server";
import { values } from "~/lib/values.server";

export const loader = async ({ params }: LoaderFunctionArgs) => {
	const schoolName = values.get("shortName");
	const postId = Number(params.id as string);

	const post = await prisma.post.findFirst({
		where: { id: postId },
		include: { user: true },
	});

	if (!post) {
		throw new Response("Not found", { status: 404 });
	}

	const comments = await prisma.post.findMany({
		where: { parentId: post.id },
		include: { user: true },
	});

	return json({ comments, schoolName, post });
};

export const action = async ({ request }: ActionFunctionArgs) => {
	const userId = await checkAuth(request);
	const data = await request.json();

	await prisma.post.create({
		data: {
			content: data.content,
			parentId: data.parentId,
			userId,
		},
	});

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

	return null;
};

export const meta: MetaFunction<typeof loader> = ({ data }) => {
	return [{ title: `Discussions | ${data?.schoolName} | compa` }];
};

export default function Discussion() {
	const { comments, post } = useLoaderData<typeof loader>();

	return (
		<div className="container mx-auto min-h-[60vh]">
			<div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
				<div className="col-span-1"> </div>

				<div className="col-span-1 lg:col-span-2">
					<div className="flex gap-2">
						<div className="flex flex-col items-center">
							<Avatar />

							<button
								className="i-lucide-triangle text-secondary"
								type="button"
							/>

							<span className="font-medium text-sm">
								{post.upvotes - post.downvotes}
							</span>

							<button
								className="i-lucide-triangle rotate-180 text-secondary"
								type="button"
							/>
						</div>

						<div className="border-b dark:border-neutral-700 pb-2">
							<header>
								<span className="font-mono text-secondary">
									@{post.user.username} &bull;{" "}
									<PostTime time={post.createdAt} />
								</span>
							</header>

							<div>
								<p>{post.content}</p>

								<p className="mt-2">
									Lorem ipsum dolor sit amet consectetur adipisicing elit.
									Laborum voluptatibus reiciendis earum.
								</p>

								{/* <div className="flex mt-2">
									<MediaItem />
								</div> */}
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
						<Avatar />
						<div className="flex-1">
							<PostInput
								parent={post as unknown as PostItemProps["post"]}
								level={1}
							/>
						</div>
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

				<div className="cols-span-1">
					<header className="text-sm text-secondary font-medium ms-1 flex items-center gap-2">
						<div className="i-lucide-users-2" /> People
						<span className="bg-zinc-200 dark:bg-neutral-800 rounded-full px-2">
							12
						</span>
					</header>

					<ul>
						<li>
							<div className="flex gap-2 py-1 px-2 rounded-lg hover:bg-zinc-100 items-center hover-bg-light">
								<div className="rounded-full bg-zinc-200 dark:bg-neutral-700 size-6" />
								<div>
									notgr{" "}
									<span className="bg-zinc-200 dark:bg-neutral-800 rounded-full px-2 text-sm text-secondary font-medium">
										OP
									</span>
								</div>
							</div>
						</li>

						<li>
							<div className="flex gap-2 py-1 px-2 rounded-lg hover-bg-light">
								<div className="rounded-full bg-zinc-200 dark:bg-neutral-700 size-6" />
								<div>odumodublvck</div>
							</div>
						</li>
					</ul>
				</div>
			</div>
		</div>
	);
}
