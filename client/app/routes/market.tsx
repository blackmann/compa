import type { User } from "@prisma/client";
import type { LoaderFunctionArgs, MetaFunction } from "@remix-run/node";
import { prisma } from "~/lib/prisma.server";
import { checkAuth } from "~/lib/check-auth";
import { values } from "~/lib/values.server";
import { useState, useEffect } from "react";
import {
	useLoaderData,
	useRouteLoaderData,
	useNavigate,
	useLocation,
} from "@remix-run/react";
import { Anchor } from "~/components/anchor";
import { Input } from "~/components/input";
import { ProductItem } from "~/components/product-item";
import { Select } from "~/components/select";
import type { loader as rootLoader } from "~/root";
import qs from "qs";

export const loader = async ({ request }: LoaderFunctionArgs) => {
	let user: User | null = null;

	try {
		const userId = await checkAuth(request);
		user = await prisma.user.findFirst({ where: { id: userId } });
	} catch {}

	const sellerProfile = user
		? await prisma.sellerProfile.findFirst({
				where: { userId: user?.id },
			})
		: null;

	const searchParams = new URL(request.url).searchParams;
	const { q, category } = qs.parse(searchParams.toString(), {
		ignoreQueryPrefix: true,
	});

	const whereClause: any = {
		status: "available",
	};

	if (q) {
		whereClause.OR = [
			{ name: { contains: q.toString() } },
			{ description: { contains: q.toString() } },
		];
	}

	if (category !== "all") {
		whereClause.category = { title: category?.toString() };
	}

	const products = await prisma.product.findMany({
		where: whereClause,
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
	const { user } = useRouteLoaderData<typeof rootLoader>("root") || {};
	const navigate = useNavigate();
	const location = useLocation();

	const searchParams = new URLSearchParams(location.search);
	const initialQuery = searchParams.get("q") || "";
	const initialCategory = searchParams.get("category") || "all";

	const [searchQuery, setSearchQuery] = useState<string>(initialQuery);
	const [selectedCategory, setSelectedCategory] =
		useState<string>(initialCategory);

	useEffect(() => {
		const params = new URLSearchParams(location.search);
		const previousParams = params.toString();

		if (searchQuery) {
			params.set("q", searchQuery);
		} else {
			params.delete("q");
		}

		if (selectedCategory && selectedCategory !== "all") {
			params.set("category", selectedCategory);
		} else {
			params.delete("category");
		}

		const from = `${location.pathname}?${previousParams}`.replace(/\?$/, "");
		const to = `${location.pathname}?${params.toString()}`.replace(/\?$/, "");

		if (to === from) {
			return;
		}

		const timeout = setTimeout(() => {
			navigate(to);
		}, 600);

		return () => clearTimeout(timeout);
	}, [
		location.search,
		location.pathname,
		navigate,
		searchQuery,
		selectedCategory,
	]);

	const handleSearchInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setSearchQuery(e.target.value);
	};

	const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
		setSelectedCategory(e.target.value);
	};

	return (
		<div className="container min-h-[60vh]">
			<header className="mb-2">
				<h1 className="font-bold text-xl">Marketplace</h1>

				<div className="flex items-start gap-2">
					<Input
						type="search"
						placeholder="Search product"
						value={searchQuery}
						onChange={handleSearchInputChange}
					/>
					<Select value={selectedCategory} onChange={handleCategoryChange}>
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
				{products.map((product) => (
					<div className="col-span-1" key={product.id}>
						<ProductItem product={product} />
					</div>
				))}
			</div>
			{products.length === 0 && (
				<div className="font-mono text-center text-secondary">
					<div className="i-lucide-land-plot inline-block" /> Nothing here!
				</div>
			)}
		</div>
	);
}
