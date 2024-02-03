import { ActionFunctionArgs, redirect } from "@remix-run/node";
import { prisma } from "~/lib/prisma.server";

export const loader = async ({ request }: ActionFunctionArgs) => {
	const searchParams = new URL(request.url).searchParams;
	const email = searchParams.get("email");
	const token = searchParams.get("token");

	if (!email || !token) {
		return new Response(null, { status: 400 });
	}

	const verificationRequest = await prisma.emailVerificationRequest.findFirst({
		where: { email, token },
	});

	if (!verificationRequest) {
		return new Response(null, { status: 400 });
	}

	await prisma.user.update({
		where: { email },
		data: { verified: true },
	});

	// [ ]: We should autologin if the account was created in the last 10 mins

	return redirect("/login?verified=true");
};
