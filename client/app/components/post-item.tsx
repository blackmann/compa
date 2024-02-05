import { Link, useLocation } from "@remix-run/react";
import { Avatar } from "./avatar";
import { Prisma } from "@prisma/client";
import { PostTime } from "~/components/post-time";
import { PostInput } from "./post-input";
import { useMounted } from "~/lib/use-mounted";
import { NestedComments } from "./nested-comments";
import { Votes } from "./votes";
import clsx from "clsx";
import { PostMenu } from "./post-menu";
import { useGlobalCtx } from "~/lib/global-ctx";
import { LoginComment } from "./login-comment";
import { MediaItem } from "./media-item";

interface Props {
	level?: number;
	post: Prisma.PostGetPayload<{ include: { user: true; media: true } }>;
}

function PostItem({ post, level = 0 }: Props) {
	const location = useLocation();
	const mounted = useMounted();

	const { user } = useGlobalCtx();

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
				<div
					className={clsx(
						"p-2 rounded-lg hover-bg-light transition-[background] duration-200 flex gap-2",
						{ "bg-light dark:bg-neutral-800": active },
					)}
				>
					<div className="flex flex-col items-center">
						{full && (
							<div className="mb-2">
								<Avatar name={post.user.username} />
							</div>
						)}

						<Votes post={post} />
					</div>
					<div className="flex-1">
						<header className="flex gap-2 justify-between">
							<span className="font-mono text-secondary text-sm">
								@{post.user.username} &bull; <PostTime time={post.createdAt} />
							</span>

							<div>
								<PostMenu post={post} />
							</div>
						</header>

						<div className="-mt-3">
							<p>{post.content}</p>

							{post.media.length > 0 && (
								<div className="grid xl:grid-cols-3 md:grid-cols-2 grid-cols-1 gap-2 flex-wrap mt-2">
									{post.media.map((media) => (
										<div className="col-span-1">
											<MediaItem key={media.id} media={media} />
										</div>
									))}
								</div>
							)}
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
					{user ? (
						<div className="p-2">
							<PostInput parent={post} level={1} />
						</div>
					) : (
						<LoginComment />
					)}

					<NestedComments post={post} />
				</div>
			)}
		</>
	);
}

export { PostItem };
export type { Props as PostItemProps };
