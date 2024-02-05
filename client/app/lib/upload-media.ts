import { Media } from "@prisma/client";

async function uploadMedia(file: File): Promise<Omit<Media, "postId">> {
	const formData = new FormData();

	formData.append("file", file);

	const res = await fetch("/media", {
		method: "POST",
		body: formData,
	});

	return await res.json();
}

export { uploadMedia };
