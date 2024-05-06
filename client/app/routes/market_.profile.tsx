import {
	ActionFunctionArgs,
	LoaderFunctionArgs,
	MetaFunction,
	json,
	redirect,
} from "@remix-run/node";
import { useFetcher, useLoaderData } from "@remix-run/react";
import { FieldValues, useForm } from "react-hook-form";
import { Button } from "~/components/button";
import { Input } from "~/components/input";
import { checkAuth } from "~/lib/check-auth";
import { prisma } from "~/lib/prisma.server";
import { values } from "~/lib/values.server";

export const loader = async ({ request }: LoaderFunctionArgs) => {
	const userId = await checkAuth(request);
	const sellerProfile = await prisma.sellerProfile.findFirst({
		where: { userId },
	});

	return { school: values.meta(), sellerProfile };
};

export const action = async ({ request }: ActionFunctionArgs) => {
	if (!["POST", "PATCH"].includes(request.method)) {
		return json(null, { status: 405 });
	}

	const userId = await checkAuth(request);
	const data = await request.json();

	switch (request.method) {
		case "POST": {
			await prisma.sellerProfile.create({ data: { ...data, userId } });
			break;
		}

		case "PATCH": {
			const profile = await prisma.sellerProfile.findFirst({
				where: { userId },
				select: { id: true },
			});

			if (!profile) {
				break;
			}

			await prisma.sellerProfile.update({ where: { id: profile.id }, data });
		}
	}

	return redirect("/market");
};

export const meta: MetaFunction<typeof loader> = ({ data }) => {
	return [
		{ title: `Your Market Profile | ${data?.school.shortName} ✽ compa` },
		{
			name: "description",
			content: "Set up your market profile to be able to sell on compa.",
		},
	];
};

export default function MarketProfile() {
	const { sellerProfile } = useLoaderData<typeof loader>();
	const { handleSubmit, register, setValue, watch } = useForm({
		defaultValues: {
			phone: sellerProfile?.phone || "",
			whatsapp: sellerProfile?.whatsapp || "",
			instagram: sellerProfile?.instagram || "",
			snapchat: sellerProfile?.snapchat || "",
			businessName: sellerProfile?.businessName || "",
		},
	});

	const fetcher = useFetcher();

	function save(data: FieldValues) {
		fetcher.submit(JSON.stringify(data), {
			method: sellerProfile ? "PATCH" : "POST",
			encType: "application/json",
		});
	}

	const $phone = watch("phone");
	const $whatsapp = watch("whatsapp");

	return (
		<div className="container mx-auto min-h-[60vh]">
			<div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
				<div className="col-span-1 lg:col-span-3">
					<h1 className="font-bold text-lg">Market profile</h1>
					<p>
						Set up your market profile to be able to sell on compa. These
						details allow customers to identify and reach you.
					</p>

					<form className="mt-2" onSubmit={handleSubmit(save)}>
						<label>
							Phone
							<Input
								type="tel"
								{...register("phone", {
									required: true,
									pattern: /^\d{10,}$/,
								})}
							/>
						</label>

						<div className="text-sm text-secondary">
							This number will be shown to customers for calls.
						</div>

						<label className="mt-2">
							Whatsapp number <span className="text-secondary">(optional)</span>
							<Input
								type="tel"
								{...register("whatsapp", {
									pattern: /^\d{10,}$/,
								})}
							/>
						</label>

						<div className="text-sm text-secondary">
							<label className="flex gap-2 items-center">
								<input
									type="checkbox"
									className="border rounded bg-zinc-200 dark:bg-neutral-700"
									checked={$phone?.length > 0 && $phone === $whatsapp}
									onChange={(e) => {
										if (e.target.checked) {
											setValue("whatsapp", $phone);
										}
									}}
								/>
								Same as phone number
							</label>
							<div className="text-sm">
								A link to your Whatsapp DM will be shown on product details.
							</div>
						</div>

						<label className="mt-2">
							Instagram handle{" "}
							<span className="text-secondary">(optional)</span>
							<Input type="text" {...register("instagram")} />
						</label>

						<label className="mt-2">
							Snapchat handle <span className="text-secondary">(optional)</span>
							<Input type="text" {...register("snapchat")} />
						</label>

						<label className="mt-2">
							Business name <span className="text-secondary">(optional)</span>
							<Input type="text" {...register("businessName")} />
						</label>
						<div className="text-sm text-secondary">
							This will be shown on product details.
						</div>

						<footer className="mt-2">
							<Button disabled={fetcher.state === "submitting"}>
								{fetcher.state === "submitting" ? (
									<>Saving…</>
								) : (
									<>Save profile</>
								)}
							</Button>
						</footer>
					</form>
				</div>
			</div>
		</div>
	);
}
