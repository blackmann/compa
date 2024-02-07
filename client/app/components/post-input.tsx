import { FieldValues, get, useForm } from "react-hook-form";
import { Button } from "./button";
import { useFetcher } from "react-router-dom";
import { Post } from "@prisma/client";
import React from "react";
import { FileSelectItem } from "./file-select-item";
import clsx from "clsx";
import { uploadMedia } from "~/lib/upload-media";
import { AudioRecorder } from "./audio-recorder";
import { useGlobalCtx } from "~/lib/global-ctx";
import { TagSelect } from "./tag-select";
import {
	DEFAULT_SELECTIONS,
	SelectionId,
	Selections,
	TagInput,
} from "./tag-input";

interface Props {
	level?: number;
	parent?: Post;
}

const ATTACHMENT_LIMIT = 5 * 1024 * 1024; // 5MB limit

function PostInput({ level = 0, parent }: Props) {
	const { handleSubmit, register, setValue, watch, reset } = useForm({
		defaultValues: {
			content: "",
			files: [] as File[],
		},
	});

	const [isRecording, setIsRecording] = React.useState(false);
	const [uploading, setUploading] = React.useState(false);
	const [tags, setTags] = React.useState<Selections>(DEFAULT_SELECTIONS);

	const fetcher = useFetcher();

	const { user } = useGlobalCtx();

	const isComment = level > 0;
	const $files = watch("files");

	function getTags() {
		return Object.entries(tags).flatMap(([id, values]) =>
			values.map((v) => `${id}:${v}`),
		);
	}

	async function createPost(data: FieldValues) {
		setUploading(true);
		const media = await Promise.all($files.map(uploadMedia));
		setUploading(false);

		const tags = JSON.stringify(getTags());

		fetcher.submit(
			JSON.stringify({ ...data, parentId: parent?.id, media, tags }),
			{
				encType: "application/json",
				method: "POST",
			},
		);
	}

	function handleFilesSelect(e: React.ChangeEvent<HTMLInputElement>) {
		if (!e.target.files?.length) {
			return;
		}

		const files = Array.from(e.target.files);

		if (files.some((file) => file.size > ATTACHMENT_LIMIT)) {
			alert("Some files you selected are too large. Maximum 5MB per file.");
			return;
		}

		setValue("files", [...$files, ...files].slice(0, 5));
	}

	function handleTagRemove(id: SelectionId, value: string) {
		setTags((tags) => {
			const values = tags[id].filter((it) => it !== value);
			return { ...tags, [id]: values };
		});
	}

	const handleRecordComplete = React.useCallback(
		(blob: Blob) => {
			const name = getNextRecordingName($files);
			const file = new File([blob], name, { type: "audio/mp3" });

			if (file.size > ATTACHMENT_LIMIT) {
				alert("The recording is too large. Maximum 5MB per file.");
				return;
			}

			setValue("files", [...$files, file].slice(0, 5));
		},
		[$files, setValue],
	);

	function removeFile(index: number) {
		setValue(
			"files",
			$files.filter((_, i) => i !== index),
		);
	}

	React.useEffect(() => {
		if (fetcher.data) {
			reset();
			setTags(DEFAULT_SELECTIONS);
		}
	}, [fetcher.data, reset]);

	const posting = fetcher.state === "submitting" || uploading;

	return (
		<>
			<form onSubmit={handleSubmit(createPost)}>
				{!parent && (
					<header>
						<TagSelect tags={tags} onRemove={handleTagRemove} />
					</header>
				)}

				<textarea
					className="w-full rounded-lg bg-zinc-100 dark:bg-neutral-800 border-zinc-200 dark:border-neutral-700 p-2 h-30"
					placeholder={
						isComment ? "What do you think?" : "What have you got to share?"
					}
					maxLength={1024}
					{...register("content", {
						required: true,
						setValueAs(value) {
							return value.trim();
						},
					})}
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
					<div className="flex gap-2">
						<label className="flex items-center gap-2 rounded-lg px-2 py-1 font-medium bg-zinc-200 px-2 py-1 dark:bg-neutral-800 cursor-pointer w-[7.2rem]">
							<div className="i-lucide-file-symlink opacity-50 shrink-0" />
							Add files
							<input
								type="file"
								name="files"
								multiple
								maxLength={4}
								accept="image/png,image/jpeg,image/gif,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document,audio/*"
								className="opacity-0 h-0 w-0 overflow-hidden"
								onChange={handleFilesSelect}
								disabled={posting || $files.length >= 5}
							/>
						</label>

						<div className="flex [&>*:last-child]:rounded-e-full [&>*:first-child]:rounded-s-full">
							<AudioRecorder
								onRecorded={handleRecordComplete}
								onRecording={setIsRecording}
							/>

							{!(isRecording || parent) && (
								<TagInput value={tags} onDone={setTags} />
							)}
						</div>
					</div>

					<div>
						<Button disabled={posting || !user}>
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
					5 files max. Images and docs only. 5MB limit per file.
					<br />
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
		</>
	);
}

function getNextRecordingName(files: File[]) {
	const nextNumber = files.filter((file) =>
		file.name.startsWith("Recording"),
	).length;
	return `Recording-${nextNumber + 1}.mp3`;
}

export { PostInput };
