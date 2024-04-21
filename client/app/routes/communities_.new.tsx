import { MetaFunction, json } from "@remix-run/node";
import { FieldValues, useForm } from "react-hook-form";
import { Button } from "~/components/button";
import { Input } from "~/components/input";
import { values } from "~/lib/values.server";

export const loader = async () => {
	return json({ school: values.meta() });
};

export const action = async () => {
	return null
}

export const meta: MetaFunction<typeof loader> = ({ data }) => {
	return [
		{ title: `Start a Community | ${data?.school.shortName} ✽ compa` },
		{ name: "description", content: "Put people together and make wonders" },
	];
};

export default function CreateCommunity() {
	const { handleSubmit, register } = useForm();

	async function createCommunity(data: FieldValues) {}

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
								{...register("handle", { required: true })}
							/>
							<div className="text-secondary text-sm">
								This is like the username of the community.
							</div>
						</label>

						<label>
							Description
							<textarea
								className="w-full rounded-lg bg-zinc-100 dark:bg-neutral-800 border-zinc-200 dark:border-neutral-700 p-2 h-30"
								maxLength={512}
								placeholder="Talk about the community."
								{...register("description", { required: true })}
							/>
						</label>

						<label className="mb-2">
							Phone
							<Input
								type="tel"
								{...register("mod-phone", { required: true })}
							/>
							<div className="text-secondary text-sm">
								For verification and correspondence purposes.
							</div>
						</label>

						<div className="mt-2">
							<Button>Create community</Button>
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
