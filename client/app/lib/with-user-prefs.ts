import { userPrefs } from "./cookies.server";

async function withUserPrefs(
	request: Request,
	values: Record<string, string | undefined>,
) {
	const cookies = (await userPrefs.parse(request.headers.get("Cookie"))) || {};
	return await userPrefs.serialize({ ...cookies, ...values });
}

export { withUserPrefs };
