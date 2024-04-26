import {
	ActionFunctionArgs,
	MetaFunction,
	json,
	redirect,
} from "@remix-run/node";
import { useFetcher } from "@remix-run/react";
import { FieldValues, useForm } from "react-hook-form";
import { Button } from "~/components/button";
import { Input } from "~/components/input";
import { Textarea } from "~/components/textarea";
import { checkAuth } from "~/lib/check-auth";
import { getModerators } from "~/lib/get-moderators";
import { prisma } from "~/lib/prisma.server";
import { USERNAME_REGEX } from "~/lib/username-regex";
import { values } from "~/lib/values.server";

export const loader = async () => {
	return json({ school: values.meta() });
};

export const action = async ({ request }: ActionFunctionArgs) => {
	if (request.method !== "POST") {
		throw json({}, { status: 405 });
	}

	const userId = await checkAuth(request);
	const data = await request.json();

	const community = await prisma.community.create({
		data: { ...data, createdById: userId, status: "pending-approval" },
	});

	const notification = await prisma.notification.create({
		data: {
			message: `A new community (${data.name}) is pending approval.`,
			entityId: community.id,
			entityType: "community",
			actorId: userId,
		},
	});

	const moderators = await getModerators();

	for (const mod of moderators) {
		await prisma.notificationSubscriber.create({
			data: {
				notificationId: notification.id,
				userId: mod.id,
			},
		});
	}

	return redirect("/communities/created?successful=1");
};

export const meta: MetaFunction<typeof loader> = ({ data }) => {
	return [
		{ title: `Start a Community | ${data?.school.shortName} ✽ compa` },
		{ name: "description", content: "Put people together and make wonders" },
	];
};

export default function CreateCommunity() {
	const { handleSubmit, register } = useForm();
	const fetcher = useFetcher();

	async function createCommunity(data: FieldValues) {
		fetcher.submit(JSON.stringify(data), {
			encType: "application/json",
			method: "POST",
		});
	}

	return (
		<div className="mt-2 container mx-auto">
			<h1 className="font-bold text-xl">Start a community</h1>
			<p className="text-secondary">
				Before proceeding, please make sure the community you're about to create
				does not already exist.
			</p>

			<div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 mt-2">
				<div className="col-span-1">
					<form onSubmit={handleSubmit(createCommunity)}>
						<label className="mb-2">
							Name
							<Input maxLength={32} {...register("name", { required: true })} />
						</label>

						<label className="mb-2">
							Handle
							<Input
								maxLength={32}
								{...register("handle", {
									pattern: USERNAME_REGEX,
									required: true,
								})}
							/>
							<div className="text-secondary text-sm">
								This is like the username of the community.
							</div>
						</label>

						<label>
							Description
							<Textarea
								maxLength={512}
								placeholder="Talk about the community."
								{...register("description", {
									required: true,
									setValueAs(value) {
										return value.trim();
									},
								})}
							/>
						</label>

						<label className="mb-2">
							Phone
							<Input
								type="tel"
								{...register("modPhone", { pattern: /\d{10}/, required: true })}
							/>
							<div className="text-secondary text-sm">
								For verification and correspondence purposes.
							</div>
						</label>

						<div className="mt-2">
							<Button disabled={fetcher.state === "submitting"}>
								{fetcher.state === "submitting" ? (
									<>
										<div className="i-svg-spinners-180-ring-with-bg inline-block" />{" "}
										Submitting…
									</>
								) : (
									<>Create community</>
								)}
							</Button>
						</div>

						<p className="text-sm text-secondary">
							This submission will go through an approval process. You'll
							receive an email and a notification when the community is
							approved.
						</p>
					</form>
				</div>
			</div>
		</div>
	);
}
