import { json } from "@remix-run/node";
import { authCookie } from "./cookies.server";

async function logout(request: Request) {
	return json(null, {
		status: 200,
		headers: {
			"Set-Cookie": await authCookie.serialize("auth", {
				maxAge: 0,
			}),
		},
	});
}

export { logout };
