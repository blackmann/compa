import { FieldValues, useForm } from "react-hook-form";
import { Button } from "./button";
import { useFetcher } from "react-router-dom";
import { Post } from "@prisma/client";
import React from "react";

interface Props {
	level?: number;
	parent?: Post;
}

function PostInput({ level = 0, parent }: Props) {
	const { handleSubmit, register, setValue } = useForm();
	const fetcher = useFetcher();

	const isComment = level > 0;

	async function createPost(data: FieldValues) {
		fetcher.submit(JSON.stringify({ ...data, parentId: parent?.id }), {
			encType: "application/json",
			method: "POST",
		});
	}

	React.useEffect(() => {
		if (fetcher.data) {
			setValue("content", "");
		}
	}, [fetcher.data, setValue]);

	return (
		<form onSubmit={handleSubmit(createPost)}>
			<textarea
				className="w-full rounded-lg bg-zinc-100 dark:bg-neutral-800 border-zinc-200 dark:border-neutral-700 p-2 h-30"
				placeholder={
					isComment ? "What do you think?" : "What have you got to share?"
				}
				{...register("content")}
			/>

			<div className="flex justify-between">
				<div>
					<Button variant="neutral" type="button">
						<div className="i-lucide-file-symlink opacity-50" /> Add files
					</Button>
				</div>

				<div>
					<Button disabled={fetcher.state === "submitting"}>
						{fetcher.state === "submitting"
							? "Posting…"
							: isComment
							  ? "Comment"
							  : "Start Discussion"}
					</Button>
				</div>
			</div>

			<p className="text-sm text-secondary">
				Maximum 4 files. Images and documents only.
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
	);
}

export { PostInput };
