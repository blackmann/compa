import { Media, Prisma } from "@prisma/client";
import { Link } from "@remix-run/react";
import type { Jsonify } from "type-fest";

type Product = Prisma.ProductGetPayload<{
	include: { category: true };
}>;

interface Props {
	product: Jsonify<Product>;
}

function ProductItem({ product }: Props) {
	const images = JSON.parse(product.images) as Media[];

	return (
		<Link to={`/market/${product.id}`}>
			<div className="aspect-square bg-zinc-100 dark:bg-neutral-800 rounded-lg mb-1 overflow-hidden">
				<img
					className="w-full aspect-square object-cover"
					src={images[0].thumbnail || ""}
					alt={product.name}
				/>
			</div>

			<header className="font-medium leading-none">{product.name}</header>

			<div className="text-sm text-secondary">{product.category.title}</div>
			<div className="bg-zinc-200 dark:bg-neutral-800 rounded-lg inline px-1 font-mono text-sm">
				GHS {Number(product.price).toFixed(2)}
			</div>
		</Link>
	);
}

export { ProductItem };
