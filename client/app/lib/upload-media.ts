import type { Media } from "@prisma/client";
import compress, {
	type Options as CompressOptions,
} from "browser-image-compression";
import { isImage } from "./is-image";

async function uploadMedia(file: File): Promise<Omit<Media, "postId">> {
	const formData = new FormData();

	if (isImage(file.type, true)) {
		formData.append("file", await compressFile(file));
	} else {
		formData.append("file", file);
	}

	const res = await fetch("/media", {
		method: "POST",
		body: formData,
	});

	return await res.json();
}

const compressOptions: CompressOptions = {
	maxSizeMB: 0.6,
	maxWidthOrHeight: 1920,
};

function fileFromBlob(blob: File) {
	return new File([blob], blob.name, { type: blob.type });
}

async function compressFile(file: File) {
	const blob = await compress(file, compressOptions);
	return fileFromBlob(blob);
}

export { uploadMedia };
