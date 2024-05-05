import { json } from "@remix-run/node";

function notFound(data: Record<string, any> | null = null) {
	return json(data, { status: 404 });
}

export { notFound };
