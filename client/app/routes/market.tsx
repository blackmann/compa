import { User } from "@prisma/client";
import { LoaderFunctionArgs, MetaFunction } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { Anchor } from "~/components/anchor";
import { Input } from "~/components/input";
import { ProductItem } from "~/components/product-item";
import { Select } from "~/components/select";
import { checkAuth } from "~/lib/check-auth";
import { useGlobalCtx } from "~/lib/global-ctx";
import { prisma } from "~/lib/prisma.server";
import { values } from "~/lib/values.server";

export const loader = async ({ request }: LoaderFunctionArgs) => {
	let user: User | null = null;

	try {
		const userId = await checkAuth(request);
		user = await prisma.user.findFirst({ where: { id: userId } });
	} catch {}

	const sellerProfile = user
		? await prisma.sellerProfile.findFirst({
				where: { userId: user.id },
		  })
		: null;

	const products = await prisma.product.findMany({
		where: { status: "available" },
		include: { category: true },
		orderBy: { createdAt: "desc" },
	});

	const categories = await prisma.category.findMany();

	return { categories, school: values.meta(), products, sellerProfile };
};

export const meta: MetaFunction<typeof loader> = ({ data }) => {
	return [
		{ title: `Marketplace | ${data?.school.shortName} ✽ compa` },
		{
			name: "description",
			content: "Looking for something to buy or sell? This is the place.",
		},
	];
};

export default function Market() {
	const { categories, products, sellerProfile } =
		useLoaderData<typeof loader>();
	const { user } = useGlobalCtx();

	return (
		<div className="container min-h-[60vh]">
			<header className="mb-2">
				<h1 className="font-bold text-xl">Marketplace</h1>

				<div className="flex items-start gap-2">
					<Input type="search" placeholder="Search product" />
					<Select>
						<option value="all">All Categories</option>
						{categories.map((category) => (
							<option key={category.id} value={category.id}>
								{category.title}
							</option>
						))}
					</Select>
				</div>
			</header>

			{sellerProfile && (
				<div className="flex gap-2 mb-2">
					<Anchor to="/market/profile" variant="neutral">
						Edit profile
					</Anchor>

					<Anchor to={`/p/${user?.username}/catalog`} variant="neutral">
						View catalog
					</Anchor>

					<Anchor to="/market/add">Add Product</Anchor>
				</div>
			)}

			{!sellerProfile && (
				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 mb-2">
					<div className="col-span-1">
						<div className="p-2 rounded-lg bg-zinc-100 dark:bg-neutral-800 border dark:border-neutral-700">
							<header className="font-bold">Have a product?</header>

							<div className="mb-2 text-secondary">
								Do you have anything to sell? You're welcome to upload any
								number of products (used or new) you have.
							</div>
							{user ? (
								<Anchor to="/market/profile">Create seller profile</Anchor>
							) : (
								<Anchor to="/login">Log in first</Anchor>
							)}
						</div>
					</div>
				</div>
			)}

			<div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
				{products.map((product) => {
					// [ ] Empty state for products

					return (
						<div className="col-span-1" key={product.id}>
							<ProductItem product={product} />
						</div>
					);
				})}
			</div>
		</div>
	);
}
