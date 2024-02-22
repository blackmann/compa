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
import { Tags } from "./tags";
import { Content } from "./content";

interface Props {
	level?: number;
	post: Prisma.PostGetPayload<{ include: { user: true; media: true } }>;
	limit?: boolean;
}

function PostItem({ post, limit, level = 0 }: Props) {
	const location = useLocation();
	const mounted = useMounted();

	const { user } = useGlobalCtx();

	function handleItemClick() {
		if (level >= 2) {
			return;
		}

		if (location.hash === `#${post.id}`) {
			window.location.hash = "";
			return;
		}

		window.location.hash = `#${post.id}`;
	}

	const link = post.parentId
		? `/discussions/${post.parentId}#${post.id}`
		: `/discussions/${post.id}`;

	const active = location.hash === `#${post.id}`;
	const showCommentInput = active && level > 0 && level < 2;

	const full = level < 2;

	const content = (
		<PostContent
			full={full}
			active={active}
			post={post}
			level={level}
			limit={limit}
		/>
	);

	return (
		<>
			{level === 0 ? (
				<Link
					to={level < 2 ? link : ""}
					className="block"
					id={post.id.toString()}
				>
					{content}
				</Link>
			) : (
				<div
					className="cursor-pointer"
					id={post.id.toString()}
					tabIndex={0}
					onClick={handleItemClick}
					onKeyDown={(e) => {
						if (["Space", "Enter"].includes(e.key)) handleItemClick();
					}}
				>
					{content}
				</div>
			)}

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

interface PostContentProps {
	post: Prisma.PostGetPayload<{ include: { user: true; media: true } }>;
	active: boolean;
	limit?: boolean;
	level: number;
	full: boolean;
}

function PostContent({ full, post, active, level, limit }: PostContentProps) {
	return (
		<div
			className={clsx(
				"p-2 rounded-lg hover-bg-light transition-[background] duration-200 flex gap-2",
				{ "bg-light dark:bg-neutral-800": active },
			)}
		>
			<div className="flex flex-col items-center">
				{full && (
					<div className="mb-2">
						<a href={`/p/${post.user.username}`}>   
                        <Avatar name={post.user.username} />
                        </a>
					</div>
				)}

				<Votes post={post} />
			</div>
			<div className="flex-1 w-0">
				<header className="flex gap-2 justify-between">
					<span className="font-mono text-secondary text-sm">
						@{post.user.username} &bull; <PostTime time={post.createdAt} />
					</span>

					<div>
						<PostMenu post={post} />
					</div>
				</header>

				{!post.parentId && <Tags className="mb-4" post={post} />}

				<div className="-mt-3 post-content">
					<Content content={post.content} />
					{post.media?.length > 0 && (
						<div className="grid xl:grid-cols-3 md:grid-cols-2 grid-cols-1 gap-2 flex-wrap mt-2">
							{post.media.map((media) => (
								<div className="col-span-1" key={media.id}>
									{limit ? (
										<MediaItem noPlay={limit} media={media} />
									) : (
										// biome-ignore lint/a11y/useValidAnchor: <explanation>
										<a
											className="block"
											href={media.url}
											target="_blank"
											onClick={(e) => e.stopPropagation()}
											rel="noreferrer"
										>
											<MediaItem noPlay={limit} media={media} />
										</a>
									)}
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
							<div className="i-lucide-users-2 inline-block" /> {post.people}{" "}
							{post.people === 1 ? "person" : "people"}
						</span>
					</footer>
				)}
			</div>
		</div>
	);
}

export { PostItem };
export type { Props as PostItemProps };
