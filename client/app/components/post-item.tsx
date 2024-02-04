import { Link, useLocation } from "@remix-run/react";
import { Avatar } from "./avatar";
import { Prisma } from "@prisma/client";
import { PostTime } from "~/components/post-time";
import { PostInput } from "./post-input";
import { useMounted } from "~/lib/use-mounted";
import { NestedComments } from "./nested-comments";
import { Votes } from "./votes";

interface Props {
	level?: number;
	post: Prisma.PostGetPayload<{ include: { user: true } }>;
}

function PostItem({ post, level = 0 }: Props) {
	const location = useLocation();
	const mounted = useMounted();

	function handleLinkClick(e: React.MouseEvent<HTMLAnchorElement>) {
		if (level > 1) {
			e.preventDefault();
			return;
		}

		if (location.hash === `#${post.id}`) {
			e.preventDefault();
			e.stopPropagation();
			window.location.hash = "";
		}
	}

	const link = post.parentId
		? `/discussions/${post.parentId}#${post.id}`
		: `/discussions/${post.id}`;

	const active = location.hash === `#${post.id}`;
	const showCommentInput = active && level > 0 && level < 2;

	const full = level < 2;

	return (
		<>
			<Link
				to={level < 2 ? link : ""}
				className="block"
				id={post.id.toString()}
				onClick={handleLinkClick}
			>
				<div className="p-2 rounded-lg hover-bg-light transition-[background] duration-200 flex gap-2">
					<div className="flex flex-col items-center">
						{full && (
							<div className="mb-2">
								<Avatar name={post.user.username} />
							</div>
						)}

						<Votes post={post} />
					</div>
					<div className="flex-1">
						<header>
							<span className="font-mono text-secondary text-sm">
								@{post.user.username} &bull; <PostTime time={post.createdAt} />
							</span>
						</header>

						<div>
							<p>{post.content}</p>

							{/* <div className="flex mt-2">
							<MediaItem />
						</div> */}
						</div>

						{level < 2 && (
							<footer className="mt-2 flex justify-between">
								<span className="inline-flex items-center gap-2 text-secondary">
									<div className="i-lucide-message-circle inline-block" />{" "}
									{post.commentsCount}
								</span>

								<span className="inline-flex items-center gap-2 text-secondary">
									<div className="i-lucide-users-2 inline-block" />{" "}
									{post.people} people
								</span>
							</footer>
						)}
					</div>
				</div>
			</Link>

			{showCommentInput && mounted && (
				<div className="ms-12 border-s-2 ps-2 dark:border-neutral-700">
					<div className="p-2">
						<PostInput parent={post} level={1} />
					</div>

					<NestedComments post={post} />
				</div>
			)}
		</>
	);
}

export { PostItem };
export type { Props as PostItemProps };
