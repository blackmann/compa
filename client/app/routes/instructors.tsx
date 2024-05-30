import { json, type ActionFunctionArgs } from "@remix-run/node";
import { checkAuth } from "~/lib/check-auth";
import { prisma } from "~/lib/prisma.server";

export const action = async ({ request }: ActionFunctionArgs) => {
	if (request.method !== "POST") {
		return new Response(null, {
			status: 405,
			statusText: "Method Not Allowed",
		});
	}

	await checkAuth(request)
	const data = await request.json();

	await prisma.instructor.create({ data });

	return json({});
};
