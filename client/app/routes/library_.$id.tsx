import { ActionFunctionArgs, json } from "@remix-run/node";
import { checkAuth } from "~/lib/check-auth";
import { prisma } from "~/lib/prisma.server";

export const action = async ({ request, params }: ActionFunctionArgs) => {
	if (request.method !== "DELETE") {
		throw new Response(null, { status: 405 });
	}

	const userId = await checkAuth(request);
	await prisma.repository.delete({ where: { userId, id: Number(params.id) } });

	return json({});
};
