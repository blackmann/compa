import { ActionFunctionArgs } from "react-router";

export const loader = async ({ request }: ActionFunctionArgs) => {
	const email = new URL(request.url).searchParams.get("email");

	// [ ]: Send email
	return null;
};

export default function ResendVerification() {
	return (
		<div className="container min-h-[60vh] mx-auto">
			<div>Verification link sent</div>
		</div>
	);
}
