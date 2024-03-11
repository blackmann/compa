import { ActionFunctionArgs } from "react-router";
import { sendEmailVerification } from "~/lib/send-email-verification";

export const loader = async ({ request }: ActionFunctionArgs) => {
	const email = new URL(request.url).searchParams.get("email");

	if (!email) {
		return new Response(null, { status: 400 });
	}

	await sendEmailVerification(email);

	return null;
};

export const meta = () => {
	return [{ title: "Resend Verification ✽ compa" }];
};

export default function ResendVerification() {
	return (
		<div className="container min-h-[60vh] mx-auto">
			<div>Verification link sent</div>
		</div>
	);
}
