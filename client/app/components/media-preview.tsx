import { Media, Prisma } from "@prisma/client";
import { Modal } from "./modal";
import { Jsonify } from "type-fest";
import clsx from "clsx";
import { Thumbnail } from "./media-item";
import React from "react";
import { Avatar } from "./avatar";
import { Username } from "./username";
import { postTime } from "./post-time";
import { ellipsizeFilename } from "~/lib/files";

type Post = Prisma.PostGetPayload<{ include: { user: true; media: true } }>;

interface Props {
	open?: boolean;
	onClose?: VoidFunction;
	post: Post | Jsonify<Post>;
	media?: Media | Jsonify<Media>;
	setMedia?: (media: Media | Jsonify<Media>) => void;
}

function MediaPreview({ media, open, onClose, post, setMedia }: Props) {
	React.useEffect(() => {
		if (!media) return;
		const it = document.querySelector(`#preview-media-${media.id}`);
		it?.scrollIntoView();
	}, [media]);

	const otherMedia = post.media.filter((m) => m.id !== media?.id);

	return (
		<Modal
			className="w-screen md:w-[30rem] aspect-[2/3]"
			open={open}
			onClose={onClose}
		>
			{media && (
				<div className="flex flex-col h-full fade-in">
					<div className="h-[76%] bg-zinc-100 dark:bg-neutral-800 border-b border-zinc-200 dark:border-neutral-700 relative flex items-center overflow-hidden">
						{media?.contentType.startsWith("image/") ? (
							<img
								key={media.id}
								className="object-contain self-center"
								src={media.url}
								alt={media.filename}
							/>
						) : media?.contentType?.startsWith("video/") ? (
							<video className="w-full" playsInline src={media.url} controls />
						) : (
							<div className="w-full justify-center text-secondary flex items-center gap-2 font-medium">
								<div className="i-lucide-tower-control" /> Cannot preview this file.
								Download instead.
							</div>
						)}

						<button
							type="button"
							className="size-7 rounded-full bg-zinc-200 dark:bg-neutral-700 flex items-center justify-center text-secondary absolute right-2 top-2"
							onClick={() => onClose?.()}
						>
							<div className="i-lucide-x" />
						</button>

						<div className="dark:border-neutral-800 rounded-lg px-1 py-0.5 font-mono flex gap-1 items-center absolute top-2 left-2 bg-zinc-200 dark:bg-neutral-800 !bg-opacity-50">
							<Thumbnail
								thumbnail={media?.thumbnail}
								className={"size-5 rounded-sm dark:bg-transparent"}
								contentType={media?.contentType as string}
								name={media?.filename as string}
							/>
							{ellipsizeFilename(media?.filename as string)}
						</div>
					</div>

					<div className="h-[24%]">
						<ul className="overflow-x-auto flex gap-2 p-1">
							{otherMedia.map((it) => {
								const selected = post.media.length > 1 && media === it;

								return (
									<li
										className="shrink-0"
										key={it.id}
										id={`preview-media-${it.id}`}
									>
										<button
											className={clsx(
												"border dark:border-neutral-800 rounded-lg px-1 py-0.5 font-mono flex gap-1 items-center",
												{
													"text-secondary": !selected,
													"bg-blue-600 text-white border-transparent": selected,
												},
											)}
											type="button"
											onClick={() => setMedia?.(it)}
										>
											<Thumbnail
												thumbnail={it?.thumbnail}
												className={clsx(
													"size-5 rounded-sm dark:bg-transparent",
													{
														"!text-white !bg-blue-600": selected,
													},
												)}
												contentType={it.contentType}
												name={it.filename}
											/>
											{it.filename}
										</button>
									</li>
								);
							})}
						</ul>

						<header className="flex gap-2 p-2 items-start">
							<div className="pt-1">
								<Avatar name={post.user.username} size={20} />
							</div>

							<div>
								<div className="font-medium leading-tight">
									<Username user={post.user} />
								</div>

								<p className="font-mono text-secondary text-sm">
									posted {postTime(post.createdAt)}
								</p>

								{Boolean(otherMedia.length) && (
									<p className="text-sm text-secondary font-mono">
										{post.media.length} attachments
									</p>
								)}
							</div>
						</header>

						<div className="flex gap-2 ms-10">
							<button
								className="bg-zinc-100 dark:bg-neutral-800 rounded-lg inline-flex gap-2 items-center px-1 py-0.5 border border-zinc-200 dark:border-neutral-700 font-medium"
								type="button"
								onClick={() => navigator?.share({ url: media?.url })}
							>
								<div className="i-lucide-share opacity-60" /> Share
							</button>

							<a
								className="bg-zinc-100 dark:bg-neutral-800 rounded-lg inline-flex gap-2 items-center px-1 py-0.5 border border-zinc-200 dark:border-neutral-700 font-medium"
								href={media?.url}
								target="_blank"
								rel="noreferrer"
							>
								<div className="i-lucide-download opacity-60" /> Download file
							</a>
						</div>
					</div>
				</div>
			)}
		</Modal>
	);
}

export { MediaPreview };
