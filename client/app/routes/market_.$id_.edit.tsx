import {
	redirect,
	type ActionFunctionArgs,
	type LoaderFunctionArgs,
	type MetaFunction,
} from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { ProductForm } from "~/components/product-form";
import { checkAuth } from "~/lib/check-auth";
import { prisma } from "~/lib/prisma.server";
import { forbidden, methodNotAllowed, notFound } from "~/lib/responses";
import { values } from "~/lib/values.server";

export const loader = async ({ request, params }: LoaderFunctionArgs) => {
	const userId = await checkAuth(request);

	const product = await prisma.product.findFirst({
		where: { id: Number(params.id) },
		include: { category: true, seller: true },
	});

	if (!product) {
		throw notFound();
	}

	if (product.seller.userId !== userId) {
		throw forbidden();
	}

	const categories = await prisma.category.findMany();

	return { categories, school: values.meta(), product };
};

export const action = async ({ request, params }: ActionFunctionArgs) => {
	if (request.method !== "PATCH") {
		throw methodNotAllowed();
	}

	const userId = await checkAuth(request);

	const data = await request.json();

	await prisma.product.update({
		where: { id: Number(params.id), seller: { userId } },
		data: {
			name: data.name,
			categoryId: data.category,
			price: data.price,
			images: data.images,
			description: data.description,
		},
	});

	return redirect(`/market/${params.id}`);
};

export const meta: MetaFunction<typeof loader> = ({ data }) => {
	return [
		{ title: `Edit ${data?.product.name} | ${data?.school.shortName} ✽ compa` },
		{
			name: "description",
			content: data?.product.description,
		},
	];
};

export default function ProductDetail() {
	const { product } = useLoaderData<typeof loader>();

	return (
		<div className="container mx-auto min-h-[60vh]">
			<div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
				<div className="col-span-1 lg:col-span-3">
					<h1 className="font-bold text-lg">Add new product</h1>

					<ProductForm product={product} />
				</div>
			</div>
		</div>
	);
}
