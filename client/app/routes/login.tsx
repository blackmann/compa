import { ActionFunctionArgs, MetaFunction, json } from "@remix-run/node";
import { Link, useActionData, useFetcher } from "@remix-run/react";
import { FieldValues, useForm } from "react-hook-form";
import { Button } from "~/components/button";
import { Input } from "~/components/input";
import bcrypt from "~/lib/bcrypt.server";
import { authCookie } from "~/lib/cookies";
import { prisma } from "~/lib/prisma.server";
import { signUser } from "~/lib/sign-user";
import { values } from "~/lib/values.server";

export const loader = async () => {
	const school = values.get("shortName");

	return { school };
};

export const action = async ({ request }: ActionFunctionArgs) => {
	if (request.method !== "POST") {
		return json(null, {
			status: 405,
			statusText: "Method Not Allowed",
		});
	}

	const { email, password } = await request.json();

	const user = await prisma.user.findFirst({ where: { email } });
	if (!user) {
		return json(
			{ type: "invalid-credentials", message: "Invalid email or password" },
			{ status: 400 },
		);
	}

	if (!user.verified) {
		return json({ type: "unverified-account" }, { status: 400 });
	}

	const authCredential = await prisma.authCredential.findFirst({
		where: { userId: user.id },
	});

	if (!authCredential) {
		return json(
			{ type: "invalid-credentials", message: "Invalid email or password" },
			{ status: 400 },
		);
	}

	const passwordMatch = await bcrypt.compare(password, authCredential.password);
	if (!passwordMatch) {
		return json(
			{ type: "invalid-credentials", message: "Invalid email or password" },
			{ status: 400 },
		);
	}

	const token = signUser(user);
	const previousAuth = await authCookie.parse(request.headers.get("Cookie"));

	return json({}, {
		headers: {
			"Set-Cookie": await authCookie.serialize({ ...previousAuth, token }),
			Location: "/",
		},
		status: 302,
	});
};

export const meta: MetaFunction<typeof loader> = ({ data }) => {
	return [{ title: `Login | ${data?.school} | compa` }];
};

export default function Login() {
	const { handleSubmit, register } = useForm();
	const actionData = useActionData<typeof action>();
	const fetcher = useFetcher();

	async function login(data: FieldValues) {
		fetcher.submit(JSON.stringify(data), {
			method: "POST",
			encType: "application/json",
		});
	}

	return (
		<div className="container mx-auto">
			<div className="min-h-[60vh]">
				<div className="lg:max-w-[24rem] mx-auto">
					<form
						className="bg-white dark:bg-neutral-900 rounded-lg border dark:border-neutral-800 p-4 z-10 relative"
						onSubmit={handleSubmit(login)}
					>
						<h1 className="font-bold text-2xl mb-2">Login</h1>

						<label>
							Email
							<Input {...register("email", { required: true })} />
							<small className="text-secondary">Your school email</small>
						</label>

						<label className="block mt-2">
							Password
							<Input
								type="password"
								{...register("password", { required: true })}
							/>
							<small className="text-secondary">
								Forgot your password?{" "}
								<Link className="underline" to="/forgot-password">
									Click here to reset
								</Link>
							</small>
						</label>

						<div className="mt-2">
							<Button disabled={fetcher.state === "submitting"}>
								{fetcher.state === "submitting" ? "Please wait…" : "Login"}
							</Button>
						</div>

						<p className="mt-4">
							<Link
								className="underline font-medium text-rose-500"
								to="/create-account"
							>
								Create an account
							</Link>{" "}
							to be start interacting on compa.
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
