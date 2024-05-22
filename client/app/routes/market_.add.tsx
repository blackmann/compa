import {
	json,
	redirect,
	type ActionFunctionArgs,
	type MetaFunction,
} from "@remix-run/node";
import { ProductForm } from "~/components/product-form";
import { checkAuth } from "~/lib/check-auth";
import { prisma } from "~/lib/prisma.server";
import { values } from "~/lib/values.server";

export const loader = async () => {
	const categories = await prisma.category.findMany();

	return { school: values.meta(), categories };
};

export const action = async ({ request }: ActionFunctionArgs) => {
	if (request.method !== "POST") {
		return json(null, { status: 405 });
	}

	const userId = await checkAuth(request);
	const sellerProfile = await prisma.sellerProfile.findFirst({
		where: { userId },
		select: { id: true },
	});

	if (!sellerProfile) {
		throw json({}, { status: 400 });
	}

	const data = await request.json();

	const product = await prisma.product.create({
		data: {
			name: data.name,
			sellerProfileId: sellerProfile.id,
			categoryId: data.category,
			price: data.price,
			images: data.images,
			description: data.description,
		},
	});

	return redirect(`/market/${product.id}`);
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
