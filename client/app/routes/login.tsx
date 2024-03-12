import { ActionFunctionArgs, MetaFunction, json } from "@remix-run/node";
import {
	Link,
	useActionData,
	useNavigation,
	useSubmit,
} from "@remix-run/react";
import { FieldValues, useForm } from "react-hook-form";
import { Button } from "~/components/button";
import { Input } from "~/components/input";
import { authCookie } from "~/lib/cookies.server";
import { signUser } from "~/lib/jwt.server";
import { compare } from "~/lib/password.server";
import { prisma } from "~/lib/prisma.server";
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

	const user = await prisma.user.findFirst({
		where: { OR: [{ email }, { username: email }] },
	});

	if (!user) {
		return json(
			{ type: "invalid-credentials", message: "Invalid email or password" },
			{ status: 400 },
		);
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

	const passwordMatch = await compare(password, authCredential.password);
	if (!passwordMatch) {
		return json(
			{
				type: "invalid-credentials",
				message: "Invalid email/username or password",
			},
			{ status: 400 },
		);
	}

	if (!user.verified) {
		return json(
			{ type: "unverified-account", message: "Unverified account" },
			{ status: 400 },
		);
	}

	const token = signUser(user);
	const previousAuth = await authCookie.parse(request.headers.get("Cookie"));

	return json(
		{ type: "success", message: "Login successful" },
		{
			headers: {
				"Set-Cookie": await authCookie.serialize({ ...previousAuth, token }),
				Location: "/",
			},
			status: 302,
		},
	);
};

export const meta: MetaFunction<typeof loader> = ({ data }) => {
	return [{ title: `Login | ${data?.school} ✽ compa` }];
};

export default function Login() {
	const { handleSubmit, register, watch } = useForm();
	const actionData = useActionData<typeof action>();
	const submit = useSubmit();
	const navigation = useNavigation();

	async function login(data: FieldValues) {
		submit(JSON.stringify(data), {
			method: "POST",
			encType: "application/json",
		});
	}

	const $email = watch("email");

	return (
		<div className="container mx-auto">
			<div className="min-h-[60vh]">
				<div className="lg:max-w-[24rem] mx-auto">
					<form
						className="bg-white dark:bg-neutral-900 rounded-lg border dark:border-neutral-800 p-4"
						onSubmit={handleSubmit(login)}
					>
						<h1 className="font-bold text-2xl mb-2">Login</h1>

						{actionData && (
							<div className="p-2 rounded-lg bg-red-50 text-red-500 dark:bg-red-700 dark:bg-opacity-10 dark:text-red-400 mb-2">
								{actionData.type === "invalid-credentials" &&
									actionData?.message}

								{actionData.type === "unverified-account" && (
									<>
										You need to verify your email to be able to login. Check
										your inbox.{" "}
										<a
											className="underline font-medium dark:text-red-200"
											href={`/resend-verification?email=${$email}`}
										>
											Resend email
										</a>{" "}
										if you can't find it.
									</>
								)}
							</div>
						)}

						<label>
							Email or username
							<Input
								{...register("email", {
									required: true,
									setValueAs(v) {
										return v.toLowerCase();
									},
								})}
							/>
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
							<Button disabled={navigation.state === "submitting"}>
								{navigation.state === "submitting" ? "Please wait…" : "Login"}
							</Button>
						</div>

						<p className="mt-4">
							<Link
								className="underline font-medium text-green-500"
								to="/create-account"
							>
								Create an account
							</Link>{" "}
							to start interacting on compa.
						</p>
					</form>
				</div>
			</div>
		</div>
	);
}
