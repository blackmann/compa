import type { Media, Prisma } from "@prisma/client";
import { Link } from "@remix-run/react";
import React from "react";
import type { Jsonify } from "type-fest";
import { Avatar } from "./avatar";
import { Content } from "./content";
import { MediaItem } from "./media-item";
import { MediaPreview } from "./media-preview";
import { PostMenu } from "./post-menu";
import { PostTime } from "./post-time";
import { Tags } from "./tags";
import { Username } from "./username";
import { Votes } from "./votes";

type Post = Prisma.PostGetPayload<{
	include: { user: true; media: true; community: true };
}> & {
	vote?: boolean;
};

interface Props {
	post: Post | Jsonify<Post>;
}

function PostContent({ post }: Props) {
	const [media, setMedia] = React.useState<Media | Jsonify<Media> | undefined>(
		undefined,
	);

	return (
		<>
			<div className="flex gap-2">
				<div className="flex flex-col items-center">
					<div className="mb-2">
						<Link to={`/p/${post.user.username}`}>
							<Avatar name={post.user.username} />
						</Link>
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
						<Content content={post.content} />

						{post.community && (
							<Link to={`/communities/${post.community.handle}`}>
								<div className="inline-flex gap-2 items-center font-medium text-sm bg-blue-50 dark:bg-blue-800 dark:bg-opacity-20 px-1 rounded-md text-blue-500">
									<div className="inline-block i-lucide-creative-commons" />
									{post.community.name}
								</div>
							</Link>
						)}

						{post.media.length > 0 && (
							<div className="grid xl:grid-cols-3 md:grid-cols-2 grid-cols-1 gap-2 flex-wrap mt-2">
								{post.media.map((media) => (
									<div className="col-span-1" key={media.id}>
										<button
											className="block w-full"
											type="button"
											onClick={() => setMedia(media)}
										>
											<MediaItem media={media} />
										</button>
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
							<div className="i-lucide-users-2 inline-block" /> {post.people}{" "}
							{post.people === 1 ? "person" : "people"}
						</span>
					</footer>
				</div>
			</div>

			<MediaPreview
				post={post}
				media={media}
				open={Boolean(media)}
				onClose={() => setMedia(undefined)}
				setMedia={setMedia}
			/>
		</>
	);
}

export { PostContent };
