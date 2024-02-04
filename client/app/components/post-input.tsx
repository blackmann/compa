import { FieldValues, useForm } from "react-hook-form";
import { Button } from "./button";
import { useFetcher } from "react-router-dom";
import { Post } from "@prisma/client";

interface Props {
	level?: number;
	parent?: Post;
}

function PostInput({ level = 0, parent }: Props) {
	const { handleSubmit, register } = useForm();
	const fetcher = useFetcher();

	const isComment = level > 0;

	async function createPost(data: FieldValues) {
		fetcher.submit(JSON.stringify(data), {
			encType: "application/json",
			method: "POST",
		});
	}

	return (
		<form onSubmit={handleSubmit(createPost)}>
			<textarea
				className="w-full rounded-lg bg-zinc-100 dark:bg-neutral-800 border-zinc-200 dark:border-neutral-700 p-2 h-30"
				placeholder="What have you got to share?"
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
			</p>
		</form>
	);
}

export { PostInput };
