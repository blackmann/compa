import { LoaderFunctionArgs, MetaFunction, json } from "@remix-run/node";
import { useFetcher, useLoaderData } from "@remix-run/react";
import { useForm } from "react-hook-form";
import { Button } from "~/components/button";
import { Input } from "~/components/input";

export const loader = async ({ request }: LoaderFunctionArgs) => {
	const email = new URL(request.url).searchParams.get("email");

	return json({ email });
};

export const meta: MetaFunction = () => {
	return [{ title: "Reset Password | compa" }];
};

export default function ResetPassword() {
	const fetcher = useFetcher();
	const { handleSubmit, register } = useForm();

	const { email } = useLoaderData<typeof loader>()

	function resetPassword() {}

	return (
		<div className="container mx-auto">
			<div className="min-h-[60vh]">
				<div className="lg:max-w-[24rem] mx-auto">
					<form
						className="bg-white dark:bg-neutral-900 rounded-lg border dark:border-neutral-800 p-4"
						onSubmit={handleSubmit(resetPassword)}
					>
						<h1 className="font-bold text-2xl mb-2">
							Reset <br />
							Password
						</h1>

						<p>You're changing the password for {email}</p>

						<label className="block mt-2">
							Password
							<Input
								type="password"
								{...register("password", { required: true, minLength: 8 })}
							/>
							<small className="text-secondary">Minimum of 8 characters</small>
						</label>

						<div className="mt-2">
							<Button disabled={fetcher.state === "submitting"}>
								{fetcher.state === "submitting"
									? "Updating..."
									: "Reset password"}
							</Button>
						</div>
					</form>
				</div>
			</div>
		</div>
	);
}
