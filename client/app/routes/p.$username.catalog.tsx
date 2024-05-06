import { LoaderFunctionArgs, json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { ProductItem } from "~/components/product-item";
import { prisma } from "~/lib/prisma.server";
import { notFound } from "~/lib/responses";

export const loader = async ({ params }: LoaderFunctionArgs) => {
	const user = await prisma.user.findFirst({
		where: { username: params.username },
	});

	if (!user) {
		throw notFound();
	}

	const products = await prisma.product.findMany({
		where: {
			seller: { userId: user.id },
		},
		include: { category: true },
	});

	return json({ products });
};

export default function ProfileCatalog() {
	const { products } = useLoaderData<typeof loader>();

	return (
		<div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mt-4">
			{products.map((product) => {
				// [ ] Empty state for products
				return (
					<div className="col-span-1" key={product.id}>
						<ProductItem product={product} />
					</div>
				);
			})}
		</div>
	);
}
