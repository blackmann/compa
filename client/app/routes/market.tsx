import { MetaFunction } from "@remix-run/node";
import { Link } from "@remix-run/react";
import { Anchor } from "~/components/anchor";
import { Input } from "~/components/input";
import { Select } from "~/components/select";
import { useGlobalCtx } from "~/lib/global-ctx";
import { values } from "~/lib/values.server";

export const loader = async () => {
	return { school: values.meta() };
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
	const { user } = useGlobalCtx();

	return (
		<div className="container min-h-[60vh]">
			<header className="mb-2">
				<h1 className="font-bold text-xl">Market</h1>
				<div className="flex items-start gap-2">
					<Input type="search" placeholder="Search product" />
					<Select>
						<option value="all">All Categories</option>
					</Select>
				</div>
			</header>

			<div className="flex gap-2 mb-2">
				<Anchor to="/market/profile" variant="neutral">
					Edit profile
				</Anchor>

				<Anchor to="/market/add" variant="neutral">
					View catalog
				</Anchor>

				<Anchor to="/market/add">Add Product</Anchor>
			</div>

			<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 mb-2">
				<div className="col-span-1">
					<div className="p-2 rounded-lg bg-zinc-100 border">
						<header className="font-bold">Have a product?</header>

						<div className="mb-2 text-secondary">
							Do you have anything to sell? You're welcome to upload any number
							of products (used or new) you have.
						</div>
						{user ? (
							<Anchor to="/market/profile">Create seller profile</Anchor>
						) : (
							<Anchor to="/login">Log in first</Anchor>
						)}
					</div>
				</div>
			</div>

			<div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
				<div className="col-span-1">
					<Link to={`/market/${1}`}>
						<div className="aspect-square bg-zinc-100 rounded-lg mb-1" />
						<header className="font-medium leading-none">Blue bikini</header>
						<div className="text-sm text-secondary">Clothing & Outfits</div>
						<div className="bg-zinc-200 rounded-lg inline px-1 font-mono text-sm">
							GHS 320
						</div>
					</Link>
				</div>
			</div>
		</div>
	);
}
