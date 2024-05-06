import { Media, Product } from "@prisma/client";
import { useFetcher, useLoaderData } from "@remix-run/react";
import React from "react";
import { FieldValues, useForm } from "react-hook-form";
import { Jsonify } from "type-fest";
import { uploadMedia } from "~/lib/upload-media";
import { loader } from "~/routes/market_.add";
import { Button } from "./button";
import { FileInput } from "./file-input";
import { Input } from "./input";
import { Select } from "./select";
import { Textarea } from "./textarea";

interface Props {
	product?: Product | Jsonify<Product>;
}

const MAX_FILES = 5;

function ProductForm({ product }: Props) {
	const { categories } = useLoaderData<typeof loader>();

	const { register, handleSubmit } = useForm({
		defaultValues: {
			name: product?.name || "",
			description: product?.name || "",
			price: product?.price || "",
			category: product?.categoryId || 1,
		},
	});

	const [imagesToUpload, setImagesToUpload] = React.useState<File[]>([]);
	const [existingImages, setExistingImages] = React.useState<
		Omit<Media, "postId">[]
	>(() => {
		return JSON.parse(product?.images || "[]");
	});

	const [uploading, setUploading] = React.useState(false);

	const fetcher = useFetcher();

	const editMode = Boolean(product);

	async function save(data: FieldValues) {
		if (existingImages.length + imagesToUpload.length === 0) {
			alert("You need to add at least 1 image");
			return;
		}

		const media = [...existingImages];

		if (imagesToUpload.length) {
			setUploading(true);

			try {
				for (const image of imagesToUpload) {
					media.push(await uploadMedia(image));
				}
			} catch (err) {
				// [ ] Observe
				return;
			} finally {
				setUploading(false);
			}
		}

		data.images = JSON.stringify(media);

		fetcher.submit(JSON.stringify(data), {
			method: editMode ? "PATCH" : "POST",
			encType: "application/json",
		});
	}

	function handleImageSelect(event: React.ChangeEvent<HTMLInputElement>) {
		const files = event.target.files;
		if (!files?.length) {
			return;
		}

		// [ ]: Include uploaded images count
		const max = MAX_FILES - (imagesToUpload.length + existingImages.length);
		const top = Array.from(files).slice(0, max);

		if (top.length === 0) {
			alert(
				`You already have ${MAX_FILES} uploaded. You need to remove some before adding any.`,
			);
			return;
		}

		setImagesToUpload((prev) => [...prev, ...top]);
	}

	const canUploadImage =
		imagesToUpload.length + existingImages.length < MAX_FILES;
	const saving = fetcher.state === "submitting" || uploading;

	return (
		<form onSubmit={handleSubmit(save)}>
			<label>
				Product name
				<Input {...register("name", { required: true })} />
			</label>

			<label className="mt-2">
				Category
				<Select
					{...register("category", { required: true, valueAsNumber: true })}
				>
					{categories.map((category) => (
						<option key={category.id} value={category.id}>
							{category.title}
						</option>
					))}
				</Select>
			</label>

			<label className="mt-2">
				Price
				<Input
					type="number"
					{...register("price", {
						required: true,
						valueAsNumber: true,
						min: 0.5,
					})}
				/>
			</label>

			<label className="mt-2">
				Description <span className="text-secondary text-sm">(optional)</span>
				<Textarea
					placeholder="Talk about the product. Mention available sizes, variants, etc."
					{...register("description", { maxLength: 720 })}
				/>
			</label>

			<div className="grid grid-cols-5 gap-2 my-2">
				{existingImages.map((img, i) => {
					return (
						<div className="col-span-1" key={img.id}>
							<div className="relative">
								<img
									src={img.thumbnail as string}
									alt={`Existing ${i + 1}`}
									className="w-full aspect-square object-cover rounded-lg"
								/>

								<button
									className="absolute right-0 bottom-0 p-1 bg-red-500 text-white rounded-lg rounded-lb-0 rounded-rt-0"
									type="button"
									onClick={() => {
										setExistingImages((prev) =>
											prev.filter((it) => it !== img),
										);
									}}
								>
									<div className="i-lucide-trash-2" />
								</button>
							</div>
						</div>
					);
				})}

				{imagesToUpload.map((img, i) => {
					return (
						<div className="col-span-1" key={img.name}>
							<div className="relative">
								<img
									src={URL.createObjectURL(img)}
									alt={`To upload ${i + 1}`}
									className="w-full aspect-square object-cover rounded-lg"
								/>

								<button
									className="absolute right-0 bottom-0 p-1 bg-red-500 text-white rounded-lg rounded-lb-0 rounded-rt-0"
									type="button"
									onClick={() => {
										setImagesToUpload((prev) =>
											prev.filter((it) => it !== img),
										);
									}}
								>
									<div className="i-lucide-trash-2" />
								</button>
							</div>
						</div>
					);
				})}
			</div>

			<FileInput
				accept="image/*"
				className="w-[8.5rem]"
				multiple
				onChange={handleImageSelect}
				disabled={!canUploadImage}
			>
				<div className="i-lucide-image-plus opacity-40" /> Add images
			</FileInput>

			<div className="text-sm text-secondary">
				At least 1 image is required. You can add up to 5 images.
			</div>

			<footer className="mt-4">
				<Button disabled={saving}>
					{saving ? "Saving…" : editMode ? "Update product" : "Add product"}
				</Button>
			</footer>
		</form>
	);
}

export { ProductForm };
