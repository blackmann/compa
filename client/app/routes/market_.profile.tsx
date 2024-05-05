import { MetaFunction } from "@remix-run/node";
import { useForm } from "react-hook-form";
import { Button } from "~/components/button";
import { Input } from "~/components/input";
import { values } from "~/lib/values.server";

export const loader = async () => {
	return { school: values.meta() };
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
	const { handleSubmit, register, watch } = useForm();

	async function save() {}

	const $phone = watch("phone");
	const $whatsapp = watch("phone");

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
							<Input type="tel" {...register("phone", { required: true })} />
						</label>

						<div className="text-sm text-secondary">
							This number will be shown to customers for calls.
						</div>

						<label className="mt-2">
							Whatsapp number <span className="text-secondary">(optional)</span>
							<Input type="tel" {...register("whatsapp")} />
						</label>

						<div className="text-sm text-secondary">
							<label className="flex gap-2 items-center">
								<input
									type="checkbox"
									className="border rounded bg-zinc-200"
									checked={$phone === $whatsapp}
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
							<Button>Save profile</Button>
						</footer>
					</form>
				</div>
			</div>
		</div>
	);
}
