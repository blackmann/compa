import {
	json,
	unstable_composeUploadHandlers,
	unstable_parseMultipartFormData,
	type ActionFunctionArgs,
} from "@remix-run/node";
import sharp from "sharp";
import { checkAuth } from "~/lib/check-auth";
import { randomStr } from "~/lib/random-str";
import { upload } from "~/lib/s3.server";

const uploadHandler = unstable_composeUploadHandlers(
	async ({ name, contentType, data, filename }) => {
		if (name !== "file") {
			return;
		}

		const buffer = await asyncIterableToBuffer(data);
		const fn = mangle(filename || "unknown_");

		let thumbnailUrl: string | undefined;

		if (contentType.startsWith("image/")) {
			const thumbnailBuffer = Buffer.copyBytesFrom(buffer);
			const thumbnail = await sharp(thumbnailBuffer).resize(300).toBuffer();

			const thumbnailUpload = await upload(
				thumbnail,
				`thumbnails/${fn}`,
				contentType,
			);

			thumbnailUrl = thumbnailUpload.Location;
		}

		const uploaded = await upload(buffer, fn, contentType);

		return JSON.stringify({
			url: uploaded.Location,
			contentType,
			filename,
			thumbnail: thumbnailUrl,
			size: buffer.length,
		});
	},
);

export const action = async ({ request }: ActionFunctionArgs) => {
	const userId = await checkAuth(request);

	const formData = await unstable_parseMultipartFormData(
		request,
		uploadHandler,
	);

	const media = JSON.parse(formData.get("file") as string);

	if (!media) {
		return json({ error: "No media uploaded" }, { status: 400 });
	}

	return { ...media, userId };
};

function mangle(filename: string) {
	const rstr = randomStr(4);
	const timestamp = Date.now();

	const parts = filename.split(".");
	const ext = parts.pop();
	return `${parts.join(".")}-${timestamp}_${rstr}.${ext}`;
}

async function asyncIterableToBuffer(asyncIterable: AsyncIterable<Uint8Array>) {
	const chunks = [];
	for await (const chunk of asyncIterable) {
		chunks.push(chunk);
	}
	return Buffer.concat(chunks);
}
