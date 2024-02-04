import { Link } from "@remix-run/react";
import { Avatar } from "./avatar";
import { MediaItem } from "./media-item";
import { Post, Prisma } from "@prisma/client";
import { PostTime, postTime } from "~/components/post-time";

interface Props {
	post: Prisma.PostGetPayload<{ include: { user: true } }>;
}

function PostItem({ post }: Props) {
	function handleUpvote(e: React.MouseEvent<HTMLButtonElement>) {
		e.preventDefault();
		e.stopPropagation();
	}

	function handleDownvote(e: React.MouseEvent<HTMLButtonElement>) {
		e.preventDefault();
		e.stopPropagation();
	}

	const link = post.parentId
		? `/discussions/${post.parentId}#${post.id}`
		: `/discussions/${post.id}`;

	return (
		<Link to={link} className="block">
			<div className="p-2 rounded-lg hover-bg-light transition-[background] duration-200 flex gap-2">
				<div className="flex flex-col items-center">
					<Avatar />

					<button
						className="i-lucide-triangle text-secondary"
						type="button"
						onClick={handleUpvote}
					/>

					<span className="font-medium text-sm">
						{post.upvotes - post.downvotes}
					</span>

					<button
						className="i-lucide-triangle rotate-180 text-secondary"
						type="button"
						onClick={handleDownvote}
					/>
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

					<footer className="mt-2 flex justify-between">
						<span className="inline-flex items-center gap-2 text-secondary">
							<div className="i-lucide-message-circle inline-block" />{" "}
							{post.commentsCount}
						</span>

						<span className="inline-flex items-center gap-2 text-secondary">
							<div className="i-lucide-users-2 inline-block" /> {post.people}{" "}
							people
						</span>
					</footer>
				</div>
			</div>
		</Link>
	);
}

export { PostItem };
