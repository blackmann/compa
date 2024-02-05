import {
	ActionFunctionArgs,
	unstable_composeUploadHandlers,
	unstable_parseMultipartFormData,
} from "@remix-run/node";
import { upload } from "~/lib/s3.server";

export const action = async ({ request }: ActionFunctionArgs) => {
	const uploadHandler = unstable_composeUploadHandlers(
		async ({ name, contentType, data, filename }) => {
			const uploaded = await upload(data, filename || "somefilename");
			console.log(uploaded);

			return "xxx";
		},
	);

	const formData = await unstable_parseMultipartFormData(
		request,
		uploadHandler,
	);

	console.log(formData);

	return null;
};
