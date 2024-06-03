import type { Prisma } from "@prisma/client";
import { Link, useRouteLoaderData } from "@remix-run/react";
import clsx from "clsx";
import React from "react";
import type { Jsonify } from "type-fest";
import { PostTime } from "~/components/post-time";
import { isImage } from "~/lib/is-image";
import { useMounted } from "~/lib/use-mounted";
import type { loader } from "~/root";
import { Avatar } from "./avatar";
import { Content } from "./content";
import { LoginComment } from "./login-comment";
import { MediaItem } from "./media-item";
import { NestedComments } from "./nested-comments";
import { PostInput } from "./post-input";
import { PostMenu } from "./post-menu";
import { Tags } from "./tags";
import { Username } from "./username";
import { Votes } from "./votes";

type Post = Prisma.PostGetPayload<{
	include: { user: true; media: true; community: true };
}> & {
	vote?: boolean;
};

interface Props {
	level?: number;
	post: Post | Jsonify<Post>;
	limit?: boolean;
	expanded?: boolean;
}

function PostItem({
	expanded: shouldExpand = false,
	post,
	limit,
	level = 0,
}: Props) {
	const mounted = useMounted();

	const [expanded, setExpanded] = React.useState(shouldExpand);

	function handleItemClick() {
		setExpanded((expanded) => !expanded);
	}

	const link = post.parentId
		? `/discussions/${post.parentId}#${post.id}`
		: `/discussions/${post.id}`;

	const showCommentInput = expanded && level > 0 && level < 2;

	const full = level < 2;

	const content = (
		<PostContent
			full={full}
			active={expanded}
			post={post}
			level={level}
			limit={limit}
		/>
	);

	return (
		<>
			{level === 0 ? (
				<Link
					to={level < 1 ? link : ""}
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
					role="button"
					onClick={handleItemClick}
					onKeyDown={(e) => {
						if (["Space", "Enter"].includes(e.key)) handleItemClick();
					}}
				>
					{content}
				</div>
			)}

			{showCommentInput && mounted && <SubComment post={post} />}
		</>
	);
}

interface PostContentProps {
	post: Props["post"];
	active: boolean;
	limit?: boolean;
	level: number;
	full: boolean;
}

function PostContent({ full, post, active, level, limit }: PostContentProps) {
	const showThumbnail =
		level === 0 &&
		post.media.length === 1 &&
		isImage(post.media[0].contentType);

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
						<Link to={`/p/${post.user.username}`}>
							<Avatar name={post.user.username} />
						</Link>
					</div>
				)}

				<Votes post={post} />
			</div>
			<div className="flex-1 w-0">
				<header className="flex gap-2 justify-between">
					<span className="font-mono text-secondary text-sm">
						<Username user={post.user} /> &bull;{" "}
						<PostTime time={post.createdAt} />
					</span>

					<div>
						<PostMenu post={post} />
					</div>
				</header>

				{!post.parentId && <Tags className="mb-4" tags={post.tags} />}

				<div className="-mt-3 post-content grid grid-cols-1 lg:grid-cols-4 gap-2">
					{showThumbnail && (
						<div className="col-span-1 lg:order-last">
							<div className="aspect-[3/2]">
								<img
									src={post.media[0].url}
									alt=""
									className="h-full w-full object-cover rounded-lg"
								/>
							</div>
						</div>
					)}

					<div
						className={clsx("col-span-1 lg:col-span-3", {
							"lg:col-span-4": !showThumbnail,
						})}
					>
						<Content content={post.content} />
					</div>
				</div>

				<div>
					{post.media?.length > 0 && !showThumbnail && (
						<div className="grid xl:grid-cols-3 md:grid-cols-2 grid-cols-1 gap-2 flex-wrap mt-2">
							{post.media.map((media) => (
								<div className="col-span-1" key={media.id}>
									{limit ? (
										<MediaItem noPlay={limit} media={media} />
									) : (
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

				{post.community && (
					<div className="inline-flex gap-2 items-center font-medium text-sm bg-blue-50 dark:bg-blue-800 dark:bg-opacity-20 px-1 rounded-md text-blue-500">
						<div className="inline-block i-lucide-creative-commons" />
						{post.community.name}
					</div>
				)}

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

function SubComment({ post }: { post: Props["post"] }) {
	const { user } = useRouteLoaderData<typeof loader>("root") || {};

	return (
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
	);
}

export { PostItem };
export type { Props as PostItemProps };
