import { ActionFunctionArgs, MetaFunction, json } from "@remix-run/node";
import { Link, useFetcher, useLoaderData } from "@remix-run/react";
import clsx from "clsx";
import React from "react";
import { FieldValues, useForm } from "react-hook-form";
import { Button } from "~/components/button";
import { FileInput } from "~/components/file-input";
import { FileSelectItem } from "~/components/file-select-item";
import { Input } from "~/components/input";
import { Thumbnail } from "~/components/media-item";
import { FileThumbnail } from "~/components/non-image-thumb";
import { PostTime } from "~/components/post-time";
import {
	DEFAULT_SELECTIONS,
	SelectionId,
	Selections,
	TagInput,
	stringifySelections,
} from "~/components/tag-input";
import { TagSelect } from "~/components/tag-select";
import { Tags } from "~/components/tags";
import { TagsFilter } from "~/components/tags-filter";
import { Username } from "~/components/username";
import { checkAuth } from "~/lib/check-auth";
import { ellipsizeFilename, humanizeSize } from "~/lib/files";
import { useGlobalCtx } from "~/lib/global-ctx";
import { prisma } from "~/lib/prisma.server";
import { uploadMedia } from "~/lib/upload-media";
import { values } from "~/lib/values.server";

export const loader = async () => {
	const repository = await prisma.repository.findMany({
		include: { media: true, user: true },
	});
	const count = await prisma.repository.count({});
	return { school: values.meta(), repository, count };
};

export const action = async ({ request }: ActionFunctionArgs) => {
	if (request.method !== "POST") {
		return new Response("Method not allowed", { status: 405 });
	}

	const userId = await checkAuth(request);

	const data = await request.json();
	for (const mediaData of data.media) {
		const media = await prisma.media.create({ data: { ...mediaData, userId } });
		await prisma.repository.create({
			data: {
				mediaId: media.id,
				tags: data.tags,
				userId,
			},
		});
	}

	return json({}, { status: 201 });
};

export const meta: MetaFunction<typeof loader> = ({ data }) => {
	return [
		{ title: `Library | ${data?.school.shortName} | compa` },
		{
			name: "description",
			content:
				"Find resources for your programme, course, level or anything about the school.",
		},
	];
};

export default function Library() {
	const { handleSubmit, setValue, watch, getValues, reset } = useForm({
		defaultValues: {
			files: [] as File[],
			tags: DEFAULT_SELECTIONS as Selections,
		},
	});
	const { user } = useGlobalCtx();
	const { count, repository } = useLoaderData<typeof loader>();
	const fetcher = useFetcher();

	const [uploading, setUploading] = React.useState(false);

	const $files = watch("files");
	const $tags = watch("tags");

	function handleFileChange(event: React.ChangeEvent<HTMLInputElement>) {
		if (!event.target.files) {
			return;
		}

		setValue(
			"files",
			[...$files, ...Array.from(event.target.files || [])].slice(0, 5),
		);
	}

	function handleTagRemove(id: SelectionId, value: string) {
		const values = $tags[id].filter((it) => it !== value);
		const newTags = { ...$tags, [id]: values };
		setValue("tags", newTags);
	}

	async function uploadFiles() {
		const files = getValues("files");
		setUploading(true);
		const media = await Promise.all(files.map((file) => uploadMedia(file)));
		setUploading(false);
		const tags = getValues("tags");

		fetcher.submit(JSON.stringify({ media, tags: stringifySelections(tags) }), {
			method: "POST",
			encType: "application/json",
		});
	}

	React.useEffect(() => {
		if (fetcher.data) {
			reset();
		}
	}, [fetcher.data, reset]);

	const tagsAdded = Boolean(Object.values($tags).flat().length);
	const editMode = Boolean($files.length);

	return (
		<div className="h-[60vh] container mx-auto">
			<div className="grid grid-cols-1 md:grid-cols-5">
				<div className="col-span-1 md:col-span-3 md:col-start-2">
					<div className="flex">
						<div className="flex-1">
							<h1 className="font-bold text-xl">Library</h1>
							<p className="text-xs mb-2 ">
								<span className="bg-zinc-100 dark:bg-neutral-800 font-medium px-2 rounded-lg text-secondary">
									{editMode ? (
										<>Adding files</>
									) : (
										<>{count} files in repository</>
									)}
								</span>
							</p>
						</div>

						<div>
							{!editMode && user && (
								<FileInput
									className="!bg-blue-600 text-white"
									onChange={handleFileChange}
									multiple
								>
									<div className="i-lucide-plus opacity-60" /> Add files
								</FileInput>
							)}
						</div>
					</div>

					{editMode ? (
						<form onSubmit={handleSubmit(uploadFiles)}>
							<div className="grid xl:grid-cols-3 md:grid-cols-2 grid-cols-1 gap-2 flex-wrap">
								{$files.map((file, index) => (
									<div className="col-span-1">
										<FileSelectItem
											file={file}
											key={file.name}
											onRemove={() =>
												setValue(
													"files",
													$files.filter((_, i) => index !== i),
												)
											}
										/>
									</div>
								))}
							</div>

							{tagsAdded && (
								<div className="my-2">
									<header className="font-medium text-secondary text-sm">
										Tags
									</header>
									<TagSelect tags={$tags} onRemove={handleTagRemove} />
								</div>
							)}

							<div className="text-secondary text-sm flex gap-2">
								<div>
									<div className="inline-block i-lucide-alert-triangle text-red-500 shrink-0 mt-1" />
								</div>
								<p>
									The names of the files will be retained when uploaded. To make
									it easy to search, rename the file appropriately before
									uploading.
								</p>
							</div>

							<div className="text-secondary text-sm gap-2 flex mt-2">
								<div className="inline-block i-lucide-hash text-blue-500 mt-0.5" />
								<p>Add at least one tag to make filtering easier.</p>
							</div>

							<div className="flex gap-2 mt-2">
								<Button
									disabled={
										!tagsAdded || fetcher.state === "submitting" || uploading
									}
								>
									<div
										className={clsx("i-lucide-upload opacity-60", {
											"!i-svg-spinners-180-ring-with-bg":
												fetcher.state === "submitting" || uploading,
										})}
									/>{" "}
									Upload all
								</Button>

								<TagInput
									className="!w-auto rounded-lg"
									value={$tags}
									onDone={(v) => setValue("tags", v)}
								>
									<div className="inline-flex items-center gap-2 rounded-lg bg-zinc-200 dark:bg-neutral-800 font-medium">
										<div className="i-lucide-hash opacity-60" />
										Add tags
									</div>
								</TagInput>
							</div>
						</form>
					) : (
						<>
							<Input placeholder="Search for file" />

							<div className="mt-2">
								<TagsFilter label="Filter resources" path="/library" />
							</div>

							<div className="text-secondary mb-2 text-sm">
								Showing most recent uploads
							</div>

							{!user && (
								<div className="p-2">
									<p className="text-secondary">
										You must be{" "}
										<Link className="underline text-reset" to="/login">
											logged in
										</Link>{" "}
										to upload a file.
									</p>
								</div>
							)}

							<div>
								<ul>
									{repository.map((file, i) => (
										<li key={file.id}>
											<a
												target="_blank"
												className="grid grid-cols-4 hover:bg-zinc-100 dark:hover:bg-neutral-800 gap-2 p-2 rounded-lg"
												href={file.media.url}
												rel="noreferrer"
											>
												<div className="flex gap-2 col-span-3">
													<div>
														<Thumbnail
															thumbnail={file.media.thumbnail}
															contentType="image/png"
															name={file.media.filename}
														/>
													</div>

													<div className="flex-1">
														<header className="font-medium break-all">
															{ellipsizeFilename(file.media.filename, 20)}
														</header>

														<div>
															<Tags tags={file.tags} />
														</div>

														<div>
															<span className="text-secondary inline-flex text-xs items-center gap-1 font-mono">
																<div className="i-lucide-arrow-up-from-line" />{" "}
																<Username user={file.user} />
																{" • "}
																<PostTime time={file.createdAt} />
															</span>
														</div>
													</div>
												</div>

												<div className="col-span-1 text-end flex justify-end">
													<div className="font-medium bg-zinc-100 dark:bg-neutral-800 rounded-lg px-1 text-center self-start text-sm">
														{humanizeSize(file.media.size)}
													</div>
												</div>
											</a>

											{i < repository.length - 1 && (
												<hr className="me-2 ms-14 dark:border-neutral-700" />
											)}
										</li>
									))}
								</ul>
							</div>
						</>
					)}
				</div>
			</div>
		</div>
	);
}