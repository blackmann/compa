import { ActionFunctionArgs, json } from "@remix-run/node";
import { render } from "~/lib/render.server";

export const action = async ({ request }: ActionFunctionArgs) => {
	if (request.method !== "POST") {
		return json({ message: "Method not allowed" }, { status: 405 });
	}

	const { content } = await request.json();
	const rendered = await render(content);

	return json({ rendered });
};
