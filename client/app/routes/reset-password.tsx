import {
	ActionFunctionArgs,
	LoaderFunctionArgs,
	MetaFunction,
	json,
	redirect,
} from "@remix-run/node";
import {
	Link,
	useActionData,
	useLoaderData,
	useNavigation,
	useSubmit,
} from "@remix-run/react";
import dayjs from "dayjs";
import { FieldValues, useForm } from "react-hook-form";
import { Button } from "~/components/button";
import { Input } from "~/components/input";
import { hash } from "~/lib/password.server";
import { prisma } from "~/lib/prisma.server";

export const loader = async ({ request }: LoaderFunctionArgs) => {
	const email = new URL(request.url).searchParams.get("email");

	return json({ email });
};

export const action = async ({ request }: ActionFunctionArgs) => {
	const searchParams = new URL(request.url).searchParams;
	const email = searchParams.get("email");
	const token = searchParams.get("token");

	if (!email || !token) {
		return json({ type: "invalid-request" }, { status: 400 });
	}

	const user = await prisma.user.findFirst({ where: { email } });

	if (!user) {
		return json({ type: "no-user" }, { status: 400 });
	}

	const dayAgo = dayjs().subtract(1, "day").toDate();
	const resetRequest = await prisma.passwordResetRequest.findFirst({
		where: { userId: user.id, token, used: false, createdAt: { gte: dayAgo } },
	});

	if (!resetRequest) {
		return json({ type: "invalid-token" }, { status: 400 });
	}

	const { password } = await request.json();

	await prisma.authCredential.update({
		where: { userId: user.id },
		data: { password: await hash(password) },
	});

	// [ ]: We should show some feedback that password changed successfully
	return redirect("/login?password-changed=true");
};

export const meta: MetaFunction = () => {
	return [{ title: "Reset Password | compa" }];
};

export default function ResetPassword() {
	const submit = useSubmit();
	const navigation = useNavigation();
	const actionData = useActionData<typeof action>();

	const { handleSubmit, register } = useForm();

	const { email } = useLoaderData<typeof loader>();

	function resetPassword(data: FieldValues) {
		submit(JSON.stringify(data), {
			method: "POST",
			encType: "application/json",
		});
	}

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

						{actionData?.type === "invalid-request" && (
							<div className="p-2 rounded-lg bg-zinc-100 mb-2">
								This reset link is invalid/expired. Request another{" "}
								<Link className="underline font-medium" to="/forgot-password">
									from here
								</Link>
								.
							</div>
						)}

						<p>
							You're changing the password for{" "}
							<span className="font-medium">{email}</span>
						</p>

						<label className="block mt-2">
							Password
							<Input
								type="password"
								{...register("password", { required: true, minLength: 8 })}
							/>
							<small className="text-secondary">Minimum of 8 characters</small>
						</label>

						<div className="mt-2">
							<Button disabled={navigation.state === "submitting"}>
								{navigation.state === "submitting"
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
