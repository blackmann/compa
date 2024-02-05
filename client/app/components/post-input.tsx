import { FieldValues, useForm } from "react-hook-form";
import { Button } from "./button";
import { useFetcher } from "react-router-dom";
import { Post } from "@prisma/client";
import React from "react";
import { FileSelectItem } from "./file-select-item";
import clsx from "clsx";
import { uploadMedia } from "~/lib/upload-media";

interface Props {
	level?: number;
	parent?: Post;
}

function PostInput({ level = 0, parent }: Props) {
	const { handleSubmit, register, setValue, watch, reset } = useForm({
		defaultValues: {
			content: "",
			files: [] as File[],
		},
	});

	const [uploading, setUploading] = React.useState(false);

	const fetcher = useFetcher();

	const isComment = level > 0;
	const $files = watch("files");

	async function createPost(data: FieldValues) {
		setUploading(true);
		const media = await Promise.all($files.map(uploadMedia));
		setUploading(false);

		fetcher.submit(JSON.stringify({ ...data, parentId: parent?.id, media }), {
			encType: "application/json",
			method: "POST",
		});
	}

	function handleFilesSelect(e: React.ChangeEvent<HTMLInputElement>) {
		if (!e.target.files?.length) {
			return;
		}

		setValue("files", [...$files, ...Array.from(e.target.files)].slice(0, 5));
	}

	function removeFile(index: number) {
		setValue(
			"files",
			$files.filter((_, i) => i !== index),
		);
	}

	React.useEffect(() => {
		if (fetcher.data) {
			reset();
		}
	}, [fetcher.data, reset]);

	const posting = fetcher.state === "submitting" || uploading;

	return (
		<>
			<form onSubmit={handleSubmit(createPost)}>
				<textarea
					className="w-full rounded-lg bg-zinc-100 dark:bg-neutral-800 border-zinc-200 dark:border-neutral-700 p-2 h-30"
					placeholder={
						isComment ? "What do you think?" : "What have you got to share?"
					}
					{...register("content")}
				/>

				<div
					className={clsx(
						"grid xl:grid-cols-3 md:grid-cols-2 grid-cols-1 gap-2 flex-wrap",
						{ "mb-2": $files.length },
					)}
				>
					{$files.map((file, i) => (
						<div className="col-span-1" key={`${file.name}-${i}`}>
							<FileSelectItem
								file={file}
								onRemove={() => !uploading && removeFile(i)}
							/>
						</div>
					))}
				</div>

				<div className="flex justify-between">
					<div>
						<label
							className="flex items-center gap-2 rounded-lg px-2 py-1 font-medium bg-zinc-200 px-2 py-1 dark:bg-neutral-800 cursor-pointer"
							htmlFor="files"
						>
							<div className="i-lucide-file-symlink opacity-50" /> Add files
						</label>
					</div>

					<div>
						<Button disabled={posting}>
							{posting ? (
								<>
									<span className="i-svg-spinners-180-ring-with-bg" /> Posting…
								</>
							) : isComment ? (
								"Comment"
							) : (
								"Start Discussion"
							)}
						</Button>
					</div>
				</div>

				<p className="text-sm text-secondary">
					Maximum 5 files. Images and documents only.
					<br />
					<span className="i-lucide-file-code inline-block me-1" />
					<a
						className="underline"
						target="_blank"
						href="https://docs.github.com/en/get-started/writing-on-github/getting-started-with-writing-and-formatting-on-github/basic-writing-and-formatting-syntax"
						rel="noreferrer"
					>
						Markdown
					</a>{" "}
					is supported.
				</p>
			</form>

			<input
				type="file"
				name="files"
				id="files"
				multiple
				maxLength={4}
				accept="image/png,image/jpeg,image/gif,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document,audio/*"
				className="opacity-0 absolute top-[-10rem] left-0"
				onChange={handleFilesSelect}
			/>
		</>
	);
}

export { PostInput };
