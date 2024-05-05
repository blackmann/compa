import { MetaFunction } from "@remix-run/node";
import { Link } from "@remix-run/react";
import { values } from "~/lib/values.server";

export const loader = async () => {
	return { school: values.meta() };
};

export const meta: MetaFunction<typeof loader> = ({ data }) => {
	return [
		{ title: `[Product] | ${data?.school.shortName} ✽ compa` },
		{
			name: "description",
			content: "Looking for something to buy or sell? This is the place.",
		},
	];
};

export default function ProductDetail() {
	return (
		<div className="container">
			<div className="h-[30rem] bg-zinc-100 rounded-lg" />

			<div className="grid grid-cols-1 lg:grid-cols-5 gap-4 mt-2">
				<div className="col-span-1 lg:col-span-3">
					<h1 className="font-bold text-xl">Blue Bikini Size 5</h1>

					<div className="flex gap-2">
						<div className="rounded-lg bg-zinc-100 font-mono font-medium px-1">
							GHS 320.50
						</div>

						<Link
							className="text-secondary"
							to={`/market?category=${"clothing-outfit"}`}
						>
							Clothing & Outfit
						</Link>
					</div>

					<div className="mt-2 whitespace-pre-wrap">
						Lorem ipsum dolor sit amet, consectetur adipisicing elit.
						Accusantium quas sint, dolorem amet quae facilis, qui in earum iusto
						consequatur hic! Consequuntur error, labore laboriosam repellendus
						consequatur ducimus nisi sunt!
					</div>
				</div>

				<div className="col-span-1">
					<h2 className="font-bold">Notgr Technologies</h2>
					<div className="leading-none">@notgr</div>

					<ul className="mt-4">
						<li>
							<a
								className="flex gap-2 font-medium"
								href="https://instagram.com"
							>
								<div className="i-lucide-phone text-secondary" />
								<div>
									<div className="leading-none">0247812093</div>
									<div className="text-sm text-secondary">Phone</div>
								</div>
							</a>
						</li>

						<li className="mt-2">
							<a
								className="flex gap-2 font-medium"
								href="https://instagram.com"
							>
								<div className="i-lucide-message-circle text-secondary" />
								<div>
									<div className="leading-none">0247812093</div>
									<div className="text-sm text-secondary">Whatsapp DM</div>
								</div>
							</a>
						</li>

						<li className="mt-2">
							<a
								className="flex gap-2 items-center font-medium"
								href="https://instagram.com"
							>
								<div className="i-lucide-instagram text-secondary" />
								<div className="leading-none">@_yogr</div>
							</a>
						</li>

						<li className="mt-2">
							<a
								className="flex gap-2 items-center font-medium"
								href="https://instagram.com"
							>
								<div className="i-lucide-ghost text-secondary" />
								<div className="leading-none">@notgrwastaken</div>
							</a>
						</li>
					</ul>
				</div>
			</div>
			<div className="mt-4">
				<div className="mt-2">
					<Link
						className="font-medium text-secondary inline-flex items-center gap-2"
						to={`/market?seller=${1}`}
					>
						<div className="i-lucide-arrow-up-from-line" /> See more products
						from this seller
					</Link>
				</div>
			</div>
		</div>
	);
}
