import { json } from "@remix-run/node";
import { authCookie } from "./cookies.server";
import { decodeToken } from "./jwt.server";

async function checkAuth(request: Request): Promise<number> {
	const { token } =
		(await authCookie.parse(request.headers.get("Cookie"))) || {};

	const { sub } = decodeToken(token) || {};

	if (!sub) {
		throw json({ type: "unauthenticated" }, { status: 401 });
	}

	return sub as unknown as number;
}

export { checkAuth };
