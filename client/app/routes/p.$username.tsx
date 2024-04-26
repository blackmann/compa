import {
	ActionFunctionArgs,
	LoaderFunctionArgs,
	MetaFunction,
	json,
} from "@remix-run/node";
import {
	NavLink,
	useFetcher,
	useLoaderData,
	useOutlet,
	useParams,
} from "@remix-run/react";
import clsx from "clsx";
import parse from "html-react-parser";
import React from "react";
import { FieldValues, useForm } from "react-hook-form";
import { Jsonify } from "type-fest";
import { Avatar } from "~/components/avatar";
import { Button } from "~/components/button";
import { Modal } from "~/components/modal";
import { PostItem, PostItemProps } from "~/components/post-item";
import { PostTime } from "~/components/post-time";
import { Textarea } from "~/components/textarea";
import { Username } from "~/components/username";
import { checkAuth } from "~/lib/check-auth";
import { useGlobalCtx } from "~/lib/global-ctx";
import { prisma } from "~/lib/prisma.server";
import { renderBio } from "~/lib/render-bio.server";
import { renderSummary } from "~/lib/render-summary.server";
import { values } from "~/lib/values.server";

export const loader = async ({ params }: LoaderFunctionArgs) => {
	const user = await prisma.user.findFirst({
		where: { username: params.username },
	});

	if (!user) {
		throw json({}, { status: 404 });
	}

	user.bio = await renderBio(user.bio || "");

	const posts = await prisma.post.findMany({
		where: { userId: user.id, parentId: null },
		orderBy: { createdAt: "desc" },
		include: { user: true, media: true, community: true },
	});

	for (const post of posts) {
		post.content = await renderSummary(post.content);
	}

	return { user, meta: values.meta(), posts };
};

export const action = async ({ params, request }: ActionFunctionArgs) => {
	if (request.method !== "PATCH") {
		throw json({}, { status: 405 });
	}

	const userId = await checkAuth(request);
	const user = await prisma.user.findFirst({
		where: { id: userId },
	});

	if (!user) {
		throw json({}, { status: 404 });
	}

	if (user.username !== params.username) {
		throw json({}, { status: 403 });
	}

	const data = await request.json();
	await prisma.user.update({ where: { id: userId }, data: { bio: data.bio } });

	return json({});
};

export const meta: MetaFunction<typeof loader> = ({ data }) => {
	return [
		{ title: `@${data?.user?.username} | ${data?.meta.shortName} ✽ compa` },
	];
};

const pageLinks = [
	{
		title: "Posts",
		href: "",
		icon: "i-lucide-message-circle",
	},
	{
		title: "Communities",
		href: "communities",
		icon: "i-lucide-users-round",
	},
];

export default function Profile() {
	const { user, posts } = useLoaderData<typeof loader>();
	const outlet = useOutlet();

	return (
		<main className="container mx-auto min-h-[60vh] mt-2">
			<div className="grid lg:grid-cols-3">
				<div className="col-span-1 lg:col-span-2">
					<div className="flex gap-2 mb-2">
						<Avatar name={user.username} />

						<div className="flex-1">
							<div className="font-mono font-medium">
								<Username user={user} showVerfied />
							</div>

							<div className="text-secondary text-sm font-medium">
								Joined <PostTime time={user.createdAt} />
							</div>

							<div className="flex gap-2">
								<div className="text-secondary bg-zinc-200 dark:bg-neutral-800 inline px-1 py-0.5 rounded-lg font-medium text-sm">
									{posts.length} discussions
								</div>

								<EditBio />
							</div>

							<div className="mt-2 bio">{parse(user.bio || "")}</div>
						</div>
					</div>

					<div>
						<header>
							<ul className="flex gap-2 my-2 ms-10">
								{pageLinks.map((link) => (
									<li key={link.href}>
										<NavLink
											end
											className={({ isActive }) =>
												clsx(
													"flex gap-2 items-center text-center font-medium flex-1 px-2 py-1 bg-zinc-100 dark:bg-neutral-800 rounded-lg text-secondary hover:bg-zinc-200 dark:hover:bg-neutral-700 transition-[background] duration-200",
													{
														"!bg-blue-600 !text-white": isActive,
													},
												)
											}
											to={link.href}
										>
											<div
												className={clsx("inline-block opacity-70", link.icon)}
											/>
											{link.title}
										</NavLink>
									</li>
								))}
							</ul>
						</header>

						{outlet || <Posts posts={posts} />}
					</div>
				</div>
			</div>
		</main>
	);
}

function Posts({ posts }: { posts: Jsonify<PostItemProps["post"]>[] }) {
	if (posts.length === 0) {
		return (
			<div className="p-4 text-secondary">
				<div className="inline-block i-lucide-signpost" /> No posts published
				yet
			</div>
		);
	}

	return posts.map((post, i) => (
		<React.Fragment key={post.id}>
			<PostItem limit post={post as unknown as PostItemProps["post"]} />

			{i < posts.length - 1 && (
				<hr className="me-2 ms-12 dark:border-neutral-700" />
			)}
		</React.Fragment>
	));
}

function EditBio() {
	const { username } = useParams();
	const { user: authUser } = useGlobalCtx();
	const { register, handleSubmit, watch } = useForm({
		defaultValues: { bio: authUser?.bio },
	});

	const fetcher = useFetcher();

	const [showForm, setShowForm] = React.useState(false);

	const isSelf = authUser?.username === username;

	async function updateBio(data: FieldValues) {
		fetcher.submit(JSON.stringify(data), {
			method: "PATCH",
			encType: "application/json",
			action: `/p/${username}`,
		});

		setShowForm(false);
	}

	React.useEffect(() => {
		if (!fetcher.data) {
			return;
		}

		setShowForm(false);
	}, [fetcher.data]);

	if (!isSelf) {
		return null;
	}

	const $bio = watch("bio");

	return (
		<>
			<button
				type="button"
				className="flex items-center gap-1 text-secondary bg-zinc-200 dark:bg-neutral-800 inline px-1 py-0.5 rounded-lg font-medium text-sm"
				onClick={() => setShowForm(true)}
			>
				<div className="i-lucide-pencil" /> Edit bio
			</button>

			<Modal
				className="w-full max-w-[24rem]"
				open={showForm}
				onClose={() => setShowForm(false)}
			>
				<form onSubmit={handleSubmit(updateBio)}>
					<header className="px-2 py-1 font-bold">Edit bio</header>
					<div className="px-2">
						<Textarea maxLength={240} {...register("bio")} />
						<div className="text-end text-xs text-secondary">
							{$bio?.length || 0}/240
						</div>
					</div>

					<footer className="border-t dark:border-neutral-800 flex justify-end p-2 gap-2 mt-2">
						<Button
							type="button"
							variant="neutral"
							onClick={() => setShowForm(false)}
						>
							Cancel
						</Button>
						<Button disabled={fetcher.state === "submitting"}>Save</Button>
					</footer>
				</form>
			</Modal>
		</>
	);
}
