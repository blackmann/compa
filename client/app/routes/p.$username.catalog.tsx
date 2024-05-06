import { Media } from "@prisma/client";
import { LoaderFunctionArgs, json } from "@remix-run/node";
import { Link, useLoaderData } from "@remix-run/react";
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
				const images = JSON.parse(product.images) as Media[];

				return (
					<div className="col-span-1" key={product.id}>
						<Link to={`/market/${product.id}`}>
							<div className="aspect-square bg-zinc-100 dark:bg-neutral-800 rounded-lg mb-1 overflow-hidden">
								<img
									className="w-full aspect-square object-cover"
									src={images[0].thumbnail || ""}
									alt={product.name}
								/>
							</div>

							<header className="font-medium leading-none">
								{product.name}
							</header>

							<div className="text-sm text-secondary">Clothing & Outfits</div>
							<div className="bg-zinc-200 dark:bg-neutral-800 rounded-lg inline px-1 font-mono text-sm">
								GHS {Number(product.price).toFixed(2)}
							</div>
						</Link>
					</div>
				);
			})}
		</div>
	);
}
