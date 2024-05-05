import React from "react";
import { useForm } from "react-hook-form";
import { Button } from "./button";
import { FileInput } from "./file-input";
import { Input } from "./input";
import { Select } from "./select";
import { Textarea } from "./textarea";

const MAX_FILES = 5;

function ProductForm() {
	const { register, handleSubmit } = useForm();
	const [imagesToUpload, setImagesToUpload] = React.useState<File[]>([]);

	async function save() {}

	function handleImageSelect(event: React.ChangeEvent<HTMLInputElement>) {
		const files = event.target.files;
		if (!files?.length) {
			return;
		}

		// [ ]: Include uploaded images count
		const max = MAX_FILES - imagesToUpload.length;
		const top = Array.from(files).slice(0, max);

		if (top.length === 0) {
			alert(
				`You already have ${MAX_FILES} uploaded. You need to remove some before adding any.`,
			);
			return;
		}

		setImagesToUpload((prev) => [...prev, ...top]);
	}

	// [ ] Add uploaded images
	const canUploadImage = imagesToUpload.length < MAX_FILES;

	return (
		<form onSubmit={handleSubmit(save)}>
			<label>
				Product name
				<Input {...register("name", { required: true })} />
			</label>

			<label className="mt-2">
				Category
				<Select {...register("category", { required: true })}>
					<option value="clothing-outfit">Clothing & Outfits</option>
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
				<Textarea {...register("description")} />
			</label>

			<div className="grid grid-cols-5 gap-2 my-2">
				{imagesToUpload.map((img, i) => {
					return (
						<div className="col-span-1">
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
				<Button>Add product</Button>
			</footer>
		</form>
	);
}

export { ProductForm };
