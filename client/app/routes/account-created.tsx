import type { LoaderFunctionArgs, MetaFunction } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { KnustLoginDirection } from "~/components/knust-login-direction";
import { values } from "~/lib/values.server";

export const loader = async ({ request }: LoaderFunctionArgs) => {
	const school = values.get("id") as string;
	return { email: new URL(request.url).searchParams.get("email"), school };
};

export const meta: MetaFunction = () => {
	return [{ title: "Account Created ✽ compa" }];
};

export default function AccountCreated() {
	const { email, school } = useLoaderData<typeof loader>();

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

				{school === "knust" && <KnustLoginDirection />}

				<div className="mt-2 text-secondary">
					<a
						className="underline"
						target="_blank"
						href="https://wa.me/233247812093"
						rel="noreferrer"
					>
						Click here
					</a>{" "}
					to send a DM if you need help.
				</div>
			</div>
		</div>
	);
}
