import { ActionFunctionArgs, MetaFunction } from "@remix-run/node";
import { Link, useFetcher, useLoaderData } from "@remix-run/react";
import { FieldValues, useForm } from "react-hook-form";
import { Button } from "~/components/button";
import { Input } from "~/components/input";
import { prisma } from "~/lib/prisma.server";
import { values } from "~/lib/values.server";
import jwt from "~/lib/jwt.server";
import { authCookie } from "~/lib/cookies";
import bcrypt from "~/lib/bcrypt.server";

const ROUNDS = process.env.NODE_ENV === "production" ? 12 : 4;

export const loader = async () => {
	const school = values.get("shortName");
	const emailExtensions = values.get("emailExtensions") as string[];

	return { emailExtensions, school };
};

export const action = async ({ request }: ActionFunctionArgs) => {
	if (request.method !== "POST") {
		return new Response(null, { status: 405 });
	}

	const { password, ...data } = await request.json();

	const user = await prisma.user.create({ data });
	await prisma.authCredential.create({
		data: { password: await bcrypt.hash(password, ROUNDS), userId: user.id },
	});

	const token = jwt.sign({ sub: user.id }, process.env.SECRET_KEY!);

	const previousAuth =
		(await authCookie.parse(request.headers.get("Cookie"))) || {};

	return new Response(null, {
		headers: {
			"Set-Cookie": await authCookie.serialize({ ...previousAuth, token }),
			Location: "/",
		},
		status: 302,
	});
};

export const meta: MetaFunction<typeof loader> = ({ data }) => {
	return [{ title: `Create Account | ${data?.school} | compa` }];
};

export default function CreateAccount() {
	const { emailExtensions } = useLoaderData<typeof loader>();
	const { formState, getFieldState, handleSubmit, register } = useForm();
	const fetcher = useFetcher();

	function createAccount(data: FieldValues) {
		fetcher.submit(JSON.stringify(data), {
			method: "POST",
			encType: "application/json",
		});
	}

	const emailState = getFieldState("email", formState);

	return (
		<div className="container mx-auto">
			<div className="min-h-[60vh]">
				<div className="lg:max-w-[24rem] mx-auto">
					<form
						className="bg-white dark:bg-neutral-900 rounded-lg border dark:border-neutral-800 p-4 z-10 relative"
						onSubmit={handleSubmit(createAccount)}
					>
						<h1 className="font-bold text-2xl mb-2">Create Account</h1>

						<label className="block">
							Username
							<Input {...register("username", { required: true })} />
							<small className="text-secondary">
								This can never be changed.
							</small>
						</label>

						<label className="block mt-2">
							Email
							<Input
								{...register("email", {
									required: true,
									validate: (email) =>
										emailExtensions.some((ext) => email.endsWith(ext)) ||
										"Invalid email",
								})}
							/>
							<small className="text-secondary" style={{ lineHeight: "1rem" }}>
								Your school email. You'll need to verify your account.{" "}
								{emailState.error?.message && (
									<span className="text-red-500">
										{emailState.error.message}
									</span>
								)}
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
					<span className="bg-zinc-200 dark:bg-neutral-800 ms-4 px-2 pt-2 font-medium rounded-b-md -mt-2">
						KNUST
					</span>
				</div>
			</div>
		</div>
	);
}
