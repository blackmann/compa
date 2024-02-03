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
			<div className="mx-auto max-w-[24rem] rounded-lg border  bg-white p-4 dark:border-neutral-700 dark:bg-neutral-800">
				<h1 className="mb-2 text-2xl font-bold">Account created</h1>

				<p>
					A verification link has been sent to this email:{" "}
					<span className="font-medium text-blue-600 dark:text-blue-500">
						{email}
					</span>
				</p>

				<p className="mt-2">
					You may not be able to add or edit content on compa until you verify
					your account.
				</p>
			</div>
		</div>
	);
}
