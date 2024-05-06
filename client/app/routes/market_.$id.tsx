import { Media } from "@prisma/client";
import {
	ActionFunctionArgs,
	LoaderFunctionArgs,
	MetaFunction,
	redirect,
} from "@remix-run/node";
import { Link, useFetcher, useLoaderData } from "@remix-run/react";
import { Anchor } from "~/components/anchor";
import { Button } from "~/components/button";
import { Username } from "~/components/username";
import { checkAuth } from "~/lib/check-auth";
import { useGlobalCtx } from "~/lib/global-ctx";
import { prisma } from "~/lib/prisma.server";
import { methodNotAllowed, notFound } from "~/lib/responses";
import { values } from "~/lib/values.server";

export const loader = async ({ params }: LoaderFunctionArgs) => {
	const product = await prisma.product.findFirst({
		where: { id: Number(params.id) },
		include: { category: true, seller: { include: { user: true } } },
	});

	if (!product) {
		throw notFound();
	}

	return { school: values.meta(), product };
};

export const action = async ({ request, params }: ActionFunctionArgs) => {
	if (request.method !== "DELETE") {
		throw methodNotAllowed();
	}

	const userId = await checkAuth(request);
	await prisma.product.delete({
		where: { id: Number(params.id), seller: { userId } },
	});

	return redirect("/market");
};

export const meta: MetaFunction<typeof loader> = ({ data }) => {
	const images = JSON.parse(data?.product.images || "[]") as Media[];

	return [
		{ title: `${data?.product.name} | ${data?.school.shortName} ✽ compa` },
		{
			name: "description",
			content: data?.product.description,
		},
		{ name: "og:image", content: images[0]?.url },
	];
};

export default function ProductDetail() {
	const { product } = useLoaderData<typeof loader>();
	const { user } = useGlobalCtx();

	const { instagram, phone, snapchat, whatsapp } = product.seller;
	const deleteFetcher = useFetcher();

	const images = JSON.parse(product.images) as Media[];

	async function handleDelete() {
		const yes = confirm(
			"Are you sure you want to delete this item? This cannot be undone.",
		);

		if (!yes) {
			return;
		}

		deleteFetcher.submit("", { method: "DELETE" });
	}

	return (
		<div className="container">
			<div className="h-[30rem] bg-zinc-100 dark:bg-neutral-800 rounded-lg overflow-y-auto">
				<div className="flex h-full gap-2">
					{images.map((img) => (
						<img
							className="h-full"
							src={img.url}
							alt={product.name}
							key={img.thumbnail}
						/>
					))}
				</div>
			</div>

			<div className="grid grid-cols-1 lg:grid-cols-5 gap-4 mt-2">
				<div className="col-span-1 lg:col-span-3">
					<h1 className="font-bold text-xl">{product.name}</h1>

					<div className="flex gap-2">
						<div className="rounded-lg bg-zinc-100 dark:bg-neutral-800 font-mono font-medium px-1">
							GHS {Number(product.price).toFixed(2)}
						</div>

						<Link
							className="text-secondary"
							to={`/market?category=${product.category.id}`}
						>
							{product.category.title}
						</Link>
					</div>

					<div className="mt-2 whitespace-pre-wrap">{product.description}</div>

					{user?.id === product.seller.userId && (
						<div className="mt-2">
							<div className="flex gap-2">
								<Anchor variant="neutral" to={`/market/${product.id}/edit`}>
									Edit product
								</Anchor>

								<Button
									variant="neutral"
									onClick={handleDelete}
									disabled={deleteFetcher.state === "submitting"}
								>
									{deleteFetcher.state === "submitting"
										? "Deleting…"
										: "Delete"}
								</Button>
							</div>
							<div className="text-sm ms-2 text-secondary">
								Only you can see this
							</div>
						</div>
					)}
				</div>

				<div className="col-span-1">
					<header className="text-secondary text-sm">Posted by</header>
					<h2 className="font-bold">{product.seller.businessName}</h2>
					<div className="leading-none font-mono">
						<Username user={product.seller.user} />
					</div>

					<ul className="mt-4">
						{phone && (
							<li>
								<a
									className="flex gap-2 font-medium"
									href={`tel:${phone}`}
									target="_blank"
									rel="noreferrer"
								>
									<div className="i-lucide-phone text-secondary" />
									<div>
										<div className="leading-none">{phone}</div>
										<div className="text-sm text-secondary">Phone</div>
									</div>
								</a>
							</li>
						)}

						{whatsapp && (
							<li className="mt-2">
								<a
									className="flex gap-2 font-medium"
									href={`https://wa.me/${whatsapp.replace(/^\d/, "233")}`}
									target="_blank"
									rel="noreferrer"
								>
									<div className="i-lucide-message-circle text-secondary" />
									<div>
										<div className="leading-none">{whatsapp}</div>
										<div className="text-sm text-secondary">Whatsapp DM</div>
									</div>
								</a>
							</li>
						)}

						{instagram && (
							<li className="mt-2">
								<a
									className="flex gap-2 items-center font-medium"
									href={`https://instagram.com/${instagram}`}
									target="_blank"
									rel="noreferrer"
								>
									<div className="i-lucide-instagram text-secondary" />
									<div className="leading-none">@{instagram}</div>
								</a>
							</li>
						)}

						{snapchat && (
							<li className="mt-2">
								<a
									className="flex gap-2 font-medium"
									href={`https://snapchat.com/add/${snapchat}`}
									target="_blank"
									rel="noreferrer"
								>
									<div className="i-lucide-ghost text-secondary" />
									<div>
										<div className="leading-none">{snapchat}</div>
										<div className="text-sm text-secondary">Snapchat</div>
									</div>
								</a>
							</li>
						)}
					</ul>
				</div>
			</div>
			<div className="mt-4">
				<div className="mt-2">
					<Link
						className="font-medium text-secondary inline-flex items-center gap-2"
						to={`/market?seller=${product.seller.id}`}
					>
						<div className="i-lucide-arrow-up-from-line" /> See more products
						from this seller
					</Link>
				</div>
			</div>
		</div>
	);
}
