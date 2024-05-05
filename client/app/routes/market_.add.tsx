import { MetaFunction } from "@remix-run/node";
import { ProductForm } from "~/components/product-form";
import { values } from "~/lib/values.server";

export const loader = async () => {
	return { school: values.meta() };
};

export const meta: MetaFunction<typeof loader> = ({ data }) => {
	return [
		{ title: `Add Product | Marketplace | ${data?.school.shortName} ✽ compa` },
		{
			name: "description",
			content: "Edit product",
		},
	];
};

export default function AddProduct() {
	return (
		<div className="container mx-auto min-h-[60vh]">
			<div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
				<div className="col-span-1 lg:col-span-3">
					<h1 className="font-bold text-lg">Add new product</h1>

					<ProductForm />
				</div>
			</div>
		</div>
	);
}
