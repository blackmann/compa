import { ActionFunctionArgs, json } from "@remix-run/node";
import { useFetcher } from "@remix-run/react";
import { FieldValues, useForm } from "react-hook-form";
import { Button } from "~/components/button";
import { Input } from "~/components/input";
import { send } from "~/lib/mail.server";
import { prisma } from "~/lib/prisma.server";
import { randomStr } from "~/lib/random-str";

export const action = async ({ request }: ActionFunctionArgs) => {
	if (request.method !== "POST") {
		return new Response(null, { status: 405 });
	}

	const { email } = await request.json();

	// [ ]: Throttle this request. Users should not spam this endpoint.

	const user = await prisma.user.findFirst({ where: { email } });
	if (!user) {
		return json({});
	}

	const resetRequest = await prisma.passwordResetRequest.create({
		data: {
			userId: user.id,
			token: randomStr(24),
		},
	});

	const subdomain = process.env.SCHOOL;

	const link = [
		`https://${subdomain}.compa.so/reset-password?`,
		`email=${email}`,
		`&token=${resetRequest.token}`,
	].join("");

	await send({
		to: user.email,
		from: "m@compa.so",
		subject: "Reset Password ✽ compa",
		text: `Hi 👋🏽,\n\nYou requested to change your password. Click this link to continue: ${link}.\n\nAll the best!`,
	});

	return json({});
};

export const meta = () => {
	return [{ title: "Forgot Password ✽ compa" }];
};

export default function ForgotPassword() {
	const { handleSubmit, register } = useForm();
	const fetcher = useFetcher();

	async function sendRequest(data: FieldValues) {
		console.log("sending again...");
		fetcher.submit(JSON.stringify(data), {
			encType: "application/json",
			method: "POST",
		});
	}

	return (
		<div className="container mx-auto">
			<div className="min-h-[60vh]">
				<div className="lg:max-w-[24rem] mx-auto">
					<form
						className="bg-white dark:bg-neutral-900 rounded-lg border dark:border-neutral-800 p-4"
						onSubmit={handleSubmit(sendRequest)}
					>
						<h1 className="font-bold text-2xl mb-2">
							Forgot <br />
							Password
						</h1>

						{fetcher.data ? (
							<div className="mt-2">
								Reset link has been sent to your email.
							</div>
						) : (
							<>
								<label className="block mt-2">
									Email
									<Input {...register("email", { required: true })} />
									<small className="text-secondary">
										A reset link will be sent to this address if it's valid.
									</small>
								</label>

								<div className="mt-2">
									<Button disabled={fetcher.state === "submitting"}>
										{fetcher.state === "submitting" ? "Sending..." : "Send"}
									</Button>
								</div>
							</>
						)}
					</form>
				</div>
			</div>
		</div>
	);
}
