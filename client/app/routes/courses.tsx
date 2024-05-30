import {
	json,
	type ActionFunctionArgs,
	type LoaderFunctionArgs,
} from "@remix-run/node";
import { checkAuth } from "~/lib/check-auth";
import { prisma } from "~/lib/prisma.server";
import { slugify } from "~/lib/slugify";

export const loader = async ({ request }: LoaderFunctionArgs) => {
	const courses = await prisma.course.findMany({ orderBy: { code: "asc" } });

	return json(courses);
};

export const action = async ({ request }: ActionFunctionArgs) => {
	if (request.method !== "POST") {
		return new Response(null, {
			status: 405,
			statusText: "Method Not Allowed",
		});
	}

	await checkAuth(request)

	const data = await request.json();

	const { code, name } = data;

	await prisma.course.create({
		data: { code, name, slug: slugify(`${code} ${name}`) },
	});

	return json({});
};
