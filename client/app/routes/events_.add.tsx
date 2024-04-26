import { MetaFunction } from "@remix-run/node";
import { useNavigation, useSubmit } from "@remix-run/react";
import clsx from "clsx";
import dayjs from "dayjs";
import React from "react";
import { FieldValues, useForm } from "react-hook-form";
import { Button } from "~/components/button";
import { FileInput } from "~/components/file-input";
import { Input } from "~/components/input";
import { Textarea } from "~/components/textarea";
import { timeFromString } from "~/lib/time";
import { uploadMedia } from "~/lib/upload-media";

export const meta: MetaFunction = () => {
	return [{ title: "Add Event ✽ compa" }];
};

export default function AddEvent() {
	const { register, handleSubmit, setValue, watch, getFieldState, formState } =
		useForm();
	const [showOptional, setShowOptional] = React.useState(true);
	const [uploading, setUploading] = React.useState(false);

	const submit = useSubmit();
	const navigation = useNavigation();

	async function createPost(data: FieldValues) {
		if (data.poster) {
			setUploading(true);

			const media = await uploadMedia(data.poster);
			data.poster = media;

			setUploading(false);
		}

		submit(
			JSON.stringify({
				...data,
				date: dayjs(data.date)
					.startOf("day")
					.add(data.startTime, "seconds")
					.toDate(),
			}),
			{
				method: "post",
				encType: "application/json",
				action: "/events",
			},
		);
	}

	function handleFileSelect(e: React.ChangeEvent<HTMLInputElement>) {
		const files = e.target.files;
		if (files) {
			setValue("poster", files[0]);
		}
	}

	const posterFile = watch("poster");
	const dateField = getFieldState("date", formState);

	return (
		<div className="container mx-auto min-h-[60vh]">
			<div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
				<div className="col-span-1 lg:col-span-3">
					<h1 className="text-xl font-bold">New Event</h1>
					<p className="text-secondary text-sm">
						Only fields marked with * are required.
					</p>

					<div className="mt-2">
						<button
							type="button"
							onClick={() => setShowOptional(!showOptional)}
							className={clsx(
								"flex items-center gap-1 bg-zinc-200 dark:bg-neutral-800 rounded-full px-2 py-1 text-sm font-medium",
								{ "!bg-blue-600 text-white": !showOptional },
							)}
						>
							<div
								className={clsx("opacity-60", {
									"i-lucide-eye-off": showOptional,
									"i-lucide-eye": !showOptional,
								})}
							/>
							{showOptional ? "Hide" : "Show"} optional fields
						</button>
					</div>

					<form className="mt-2" onSubmit={handleSubmit(createPost)}>
						<label>
							Title*
							<Input
								maxLength={60}
								{...register("title", {
									required: true,
									setValueAs(value) {
										return value.trim();
									},
								})}
							/>
						</label>

						<label className="mt-2 block">
							Date*
							<Input
								type="date"
								{...register("date", {
									required: true,
									valueAsDate: true,
									validate(date) {
										return (
											dayjs(date).isAfter(dayjs().startOf("day")) ||
											"Date must be in the future"
										);
									},
								})}
							/>
							{dateField.error && (
								<span className="text-xs text-red-600 dark:text-red-400">
									{dateField.error.message}
								</span>
							)}
						</label>

						<div className="grid grid-cols-2 gap-4 mt-2">
							<div className="col-span-1">
								<label>
									Time start*
									<Input
										type="time"
										{...register("startTime", {
											required: true,
											setValueAs(value) {
												return timeFromString(value);
											},
										})}
									/>
								</label>
							</div>

							<div className="col-span-1">
								<label className={clsx({ hidden: !showOptional })}>
									Time end
									<Input
										type="time"
										{...register("endTime", {
											setValueAs(value) {
												return timeFromString(value);
											},
										})}
									/>
									<div className="text-xs text-secondary">
										"till you drop" will be used in the absence of this
									</div>
								</label>
							</div>
						</div>

						<label className={clsx("block mt-2", { hidden: !showOptional })}>
							Short description
							<Input maxLength={60} {...register("shortDescription")} />
							<span className="text-xs text-secondary">
								eg. From the Pinegrove boys{" "}
							</span>
						</label>

						<label className="block mt-2">
							Description*
							<Textarea
								maxLength={512}
								{...register("description", {
									required: true,
									setValueAs(value) {
										return value.trim();
									},
								})}
							/>
						</label>

						<label>
							Location*
							<Input
								{...register("venue", {
									required: true,
									setValueAs(value) {
										return value.trim();
									},
								})}
							/>
						</label>

						<label className={clsx("mt-2 block", { hidden: !showOptional })}>
							Maps link
							<Input
								type="url"
								{...register("mapsLink", {
									setValueAs(value) {
										return value.trim();
									},
								})}
							/>
							<span className="text-xs text-secondary">
								Google maps link preferrably.
							</span>
						</label>

						<label className={clsx("block mt-2", { hidden: !showOptional })}>
							Event link
							<Input
								type="url"
								{...register("eventLink", {
									setValueAs(value) {
										return value.trim();
									},
								})}
							/>
							<span className="text-xs text-secondary">
								Link to registration form, zoom/meet link or website for more
								details.
							</span>
						</label>

						{posterFile && (
							<div className="mt-2">
								<img
									src={URL.createObjectURL(posterFile)}
									alt="poster"
									className="max-w-[20rem] rounded-lg"
								/>
							</div>
						)}

						<div className="mt-3 flex gap-2">
							<FileInput
								className="!w-[8rem]"
								max={1}
								accept="image/*"
								onChange={handleFileSelect}
							>
								<div className="i-lucide-image-plus opacity-60" />
								{posterFile ? "Replace" : "Add"} poster
							</FileInput>

							{posterFile && (
								<Button
									type="button"
									variant="neutral"
									onClick={() => setValue("poster", null)}
								>
									<div className="i-lucide-x opacity-60" /> Remove poster
								</Button>
							)}
						</div>

						<div className="mt-2">
							<Button disabled={navigation.state === "submitting" || uploading}>
								{navigation.state === "submitting" || uploading ? (
									<>
										<div className="i-svg-spinners-180-ring-with-bg" />{" "}
										Submitting…
									</>
								) : (
									<>Submit Event</>
								)}
							</Button>
						</div>
					</form>
				</div>
			</div>
		</div>
	);
}
