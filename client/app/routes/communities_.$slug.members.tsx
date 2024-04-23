import { ActionFunctionArgs, json } from "@remix-run/node";
import { checkAuth } from "~/lib/check-auth";
import { prisma } from "~/lib/prisma.server";

export const action = async ({ request, params }: ActionFunctionArgs) => {
	const userId = await checkAuth(request);

	if (request.method !== "POST") {
		return json({}, { status: 405 });
	}

	const community = await prisma.community.findFirst({
		where: { handle: params.slug },
	});

	if (!community) {
		return json({}, { status: 404 });
	}

	await prisma.communityMember.create({
		data: { communityId: community.id, userId },
	});

	return null;
};
