import { ActionFunctionArgs, json } from "@remix-run/node";
import { prisma } from "~/lib/prisma.server";
import { slugify } from "~/lib/slugify";

export const action = async ({ request }: ActionFunctionArgs) => {
	if (request.method !== "POST") {
		throw new Response(null, { status: 405 });
	}

	const data = await request.json();
	const programmeData = {
		name: data.name,
		slug: slugify(data.name),
	};

	const programme = await prisma.programme.create({
		data: programmeData,
	});

	return json({ programme });
};
