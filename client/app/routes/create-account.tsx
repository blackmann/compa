import { Prisma, type User } from "@prisma/client";
import {
	json,
	redirect,
	type ActionFunctionArgs,
	type MetaFunction,
} from "@remix-run/node";
import {
	Link,
	useActionData,
	useFetcher,
	useLoaderData,
	useSubmit,
} from "@remix-run/react";
import React from "react";
import { useForm, type FieldValues } from "react-hook-form";
import { Button } from "~/components/button";
import { Input } from "~/components/input";
import { hash } from "~/lib/password.server";
import { prisma } from "~/lib/prisma.server";
import { sendEmailVerification } from "~/lib/send-email-verification";
import { USERNAME_REGEX } from "~/lib/username-regex";
import { values } from "~/lib/values.server";
import { restrictedUsernames } from "~/lib/restrict-usernames";

export const loader = async () => {
	const school = values.get("shortName");
	const emailExtensions = values.get("emailExtensions") as string[];

	return { emailExtensions, school };
};

export const action = async ({ request }: ActionFunctionArgs) => {
	if (request.method !== "POST") {
		return new Response(null, { status: 405 });
	}

	const { password, email, username } = await request.json();

	for (const restrictedUsername of restrictedUsernames) {
		if (username === restrictedUsername) {
			return json(
				{
					type: "conflict",
					field: "username",
					message: "Username is not allowed.",
				},
				{ status: 403 },
			);
		}
	}

	const emailExtensions = values.get("emailExtensions") as string[];
	if (!emailExtensions.some((ext) => email.endsWith(ext))) {
		return json(
			{
				type: "invalid-email",
				message: "Invalid email. Use your school email.",
			},
			{ status: 403 },
		);
	}

	let user: User;
	try {
		user = await prisma.user.create({ data: { email, username } });
	} catch (error) {
		if (error instanceof Prisma.PrismaClientKnownRequestError) {
			const [field] = error.meta?.target as string[];
			return json(
				{ type: "conflict", field, message: `${field} already exists` },
				{ status: 403 },
			);
		}

		return json(
			{ type: "unknown-error", message: "something wrong happened" },
			{ status: 500 },
		);
	}

	await prisma.authCredential.create({
		data: { password: await hash(password), userId: user.id },
	});

	await sendEmailVerification(email);

	return redirect(`/account-created?email=${user.email}`);
};

export const meta: MetaFunction<typeof loader> = ({ data }) => {
	return [{ title: `Create Account | ${data?.school} ✽ compa` }];
};

export default function CreateAccount() {
	const { emailExtensions } = useLoaderData<typeof loader>();
	const { formState, getFieldState, handleSubmit, register, setError } =
		useForm();
	const fetcher = useFetcher();
	const actionData = useActionData<typeof action>();
	const submit = useSubmit();

	function createAccount(data: FieldValues) {
		submit(JSON.stringify(data), {
			method: "POST",
			encType: "application/json",
		});
	}

	const emailState = getFieldState("email", formState);
	const usernameState = getFieldState("username", formState);

	React.useEffect(() => {
		if (!actionData) {
			return;
		}

		if (actionData.type === "conflict") {
			setError(actionData.field, { message: actionData.message });
		}
	}, [actionData, setError]);

	return (
		<div className="container mx-auto">
			<div className="min-h-[60vh]">
				<div className="lg:max-w-[24rem] mx-auto">
					<form
						className="bg-white dark:bg-neutral-900 rounded-lg border dark:border-neutral-800 p-4"
						onSubmit={handleSubmit(createAccount)}
					>
						<h1 className="font-bold text-2xl mb-2">Create Account</h1>

						<label className="block">
							<div>
								Username
								{usernameState.error && (
									<small className="text-red-500 pl-2">
										{usernameState.error.message}
									</small>
								)}
							</div>
							<Input
								{...register("username", {
									required: true,
									pattern: USERNAME_REGEX,
								})}
							/>
							<small className="text-secondary">
								This can never be changed.
							</small>
						</label>

						<label className="block mt-2">
							<div>
								Email{" "}
								{emailState.error && (
									<small className="text-red-500 pl-2">
										{emailState.error.message}
									</small>
								)}
							</div>

							<Input
								{...register("email", {
									required: true,
									validate(email) {
										return (
											emailExtensions.some((ext) => email.endsWith(ext)) ||
											"Invalid email. Use your school email."
										);
									},
									setValueAs(v) {
										return v.toLowerCase();
									},
								})}
							/>
							<small className="text-secondary" style={{ lineHeight: "1rem" }}>
								Your school email. You'll need to verify your account.{" "}
							</small>
						</label>

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
									? "Creating account..."
									: "Create an account"}
							</Button>
						</div>

						<p className="mt-2">
							Already have an account?{" "}
							<Link className="underline font-medium text-rose-500" to="/login">
								Log in
							</Link>{" "}
							instead.
						</p>
					</form>
				</div>
			</div>
		</div>
	);
}
