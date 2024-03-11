import { MetaFunction } from "@remix-run/node";
import { Link } from "@remix-run/react";
import React from "react";
import { Anchor } from "~/components/anchor";
import { Button } from "~/components/button";
import { FileInput } from "~/components/file-input";
import { FileSelectItem } from "~/components/file-select-item";
import { Input } from "~/components/input";
import { NonImageThumb } from "~/components/non-image-thumb";
import {
	DEFAULT_SELECTIONS,
	SelectionId,
	Selections,
	TagInput,
} from "~/components/tag-input";
import { TagSelect } from "~/components/tag-select";
import { Tags } from "~/components/tags";
import { TagsFilter } from "~/components/tags-filter";
import { values } from "~/lib/values.server";

export const loader = async () => {
	return { school: values.meta() };
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
	const [files, setFiles] = React.useState<File[]>([]);
	const [tags, setTags] = React.useState<Selections>(DEFAULT_SELECTIONS);

	function handleFileChange(event: React.ChangeEvent<HTMLInputElement>) {
		if (!event.target.files) {
			return;
		}

		setFiles((files) =>
			[...files, ...Array.from(event.target.files || [])].slice(0, 5),
		);
	}

	function handleTagRemove(id: SelectionId, value: string) {
		setTags((tags) => {
			const values = tags[id].filter((it) => it !== value);
			return { ...tags, [id]: values };
		});
	}

	return (
		<div className="h-[60vh] container mx-auto">
			<div className="grid grid-cols-1 md:grid-cols-5">
				<div className="col-span-1 md:col-span-3 md:col-start-2">
					<div className="flex">
						<div className="flex-1">
							<h1 className="font-bold text-xl">Library</h1>
							<p className="text-xs mb-2 ">
								<span className="bg-zinc-100 font-medium px-2 rounded-lg text-secondary">
									620 files in repository
								</span>
							</p>
						</div>

						<div>
							{!files.length && (
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

					{files.length > 0 ? (
						<form>
							<div className="grid xl:grid-cols-3 md:grid-cols-2 grid-cols-1 gap-2 flex-wrap">
								{files.map((file, index) => (
									<div className="col-span-1">
										<FileSelectItem
											file={file}
											key={file.name}
											onRemove={() =>
												setFiles(files.filter((_, i) => index !== i))
											}
										/>
									</div>
								))}
							</div>

							{Boolean(Object.values(tags).flat().length) && (
								<div className="my-2">
									<header className="font-medium text-secondary text-sm">
										Tags
									</header>
									<TagSelect tags={tags} onRemove={handleTagRemove} />
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

							<div className="text-secondary text-sm gap-2 flex">
								<div className="inline-block i-lucide-hash text-blue-500 mt-0.5" />
								<p>Add at least one tag to make filtering easier.</p>
							</div>

							<div className="flex gap-2 mt-2">
								<Button>
									<div className="i-lucide-upload opacity-60" /> Upload all
								</Button>

								<TagInput
									className="!w-auto rounded-lg"
									value={tags}
									onDone={setTags}
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

							<div>
								<ul>
									<li>
										<Link
											className="grid grid-cols-4 hover:bg-zinc-100 gap-2 p-2 rounded-lg"
											to="/library/1"
										>
											<div className="flex gap-2 col-span-3">
												<div>
													<NonImageThumb contentType="image/png" />
												</div>

												<div>
													<header className="font-medium">
														Functions II.pdf
													</header>

													<div>
														<Tags
															post={{
																tags: '["level:L100","course:Math 101: Calculus I"]',
															}}
														/>
													</div>

													<div>
														<span className="text-secondary inline-flex text-xs items-center gap-1 font-mono">
															<div className="i-lucide-arrow-up" /> @notgr 13
															Apr 2024, 10.30pm
														</span>
													</div>
												</div>
											</div>

											<div className="col-span-1 text-end flex justify-end">
												<div className="font-medium bg-zinc-100 rounded-lg px-1 text-center self-start text-sm">
													14.2kb
												</div>
											</div>
										</Link>
									</li>
								</ul>
							</div>
						</>
					)}
				</div>
			</div>
		</div>
	);
}
