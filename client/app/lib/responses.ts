import { json } from "@remix-run/node";

type Data = Record<string, any> | null

function badRequest(data: Data = null) {
	return json(data, { status: 400 });
}

function methodNotAllowed(data: Data = null) {
	return json(data, { status: 405 });
}

function notFound(data: Data = null) {
	return json(data, { status: 404 });
}

function forbidden(data: Data = null) {
	return json(data, {status: 403})
}

export { badRequest, forbidden, methodNotAllowed, notFound };
