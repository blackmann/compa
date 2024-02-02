import { LoaderFunctionArgs, MetaFunction } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";

export const loader = async ({ request }: LoaderFunctionArgs) => {
	return { email: new URL(request.url).searchParams.get("email") };
};

export const meta: MetaFunction = () => {
	return [{ title: "Account Created | compa" }];
};

export default function AccountCreated() {
	const { email } = useLoaderData<typeof loader>();

	return (
		<div className="container mx-auto h-[60vh]">
			<div className="max-w-[24rem] mx-auto border p-4 rounded-lg bg-white">
				<h1 className="font-bold text-2xl mb-2">Account created</h1>

				<p>
					A verification link has been sent to this email:{" "}
					<span className="text-blue-600 font-medium">{email}</span>
				</p>

				<p className="mt-2">
					You may not be able to add or edit content on compa until you verify
					your account.
				</p>
			</div>
		</div>
	);
}
