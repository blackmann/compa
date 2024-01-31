import { MetaFunction } from "@remix-run/node";
import { Link } from "@remix-run/react";
import { Button } from "~/components/button";
import { Input } from "~/components/input";
import { values } from "~/lib/values.server";

export const loader = async () => {
	const school = values.get("shortName");

	return { school };
};

export const action = async () => {
	return null;
};

export const meta: MetaFunction<typeof loader> = ({ data }) => {
	return [{ title: `Login | ${data?.school} | compa` }];
};

export default function Login() {
	return (
		<div className="container mx-auto">
			<div className="min-h-[60vh]">
				<div className="lg:max-w-[24rem] mx-auto">
					<form className="bg-white dark:bg-neutral-900 rounded-lg border dark:border-neutral-800 p-4 z-10 relative">
						<h1 className="font-bold text-2xl mb-2">Login</h1>

						<label>
							Email
							<Input name="email" />
							<small className="text-secondary">Your school email</small>
						</label>

						<label className="block mt-2">
							Password
							<Input name="password" />
							<small className="text-secondary">
								Forgot your password?{" "}
								<Link className="underline" to="/forgot-password">
									Click here to reset
								</Link>
							</small>
						</label>

						<div className="mt-2">
							<Button>Login</Button>
						</div>

						<p className="mt-4">
							<Link className="underline font-medium text-rose-500" to="/create-account">Create an account</Link> to be start
							interacting on compa.
						</p>
					</form>
					<span className="bg-zinc-200 dark:bg-neutral-800 ms-4 px-2 pt-2 font-medium rounded-b-md -mt-2">
						KNUST
					</span>
				</div>
			</div>
		</div>
	);
}
