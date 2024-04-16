import { LoaderFunctionArgs, json } from "@remix-run/node";
import { Link, useLoaderData, useParams } from "@remix-run/react";
import { PostContent } from "~/components/post-content";
import { PostItem } from "~/components/post-item";
import { prisma } from "~/lib/prisma.server";
import { render } from "~/lib/render.server";

export const loader = async ({ params, request }: LoaderFunctionArgs) => {
	const splat = (params["*"] as string).split("/");

	const post = await prisma.post.findFirst({
		where: { id: Number(params.id) },
		include: { user: true, media: true },
	});

	if (!post) {
		throw json({}, { status: 404 });
	}

	post.content = await render(post.content);

	const comment = await prisma.post.findFirst({
		where: { id: Number(splat[0]) },
		include: { user: true, media: true },
	});

	return { post, comment };
};

export default function ConcentratedDiscussion() {
	const { id } = useParams();
	const { post, comment } = useLoaderData<typeof loader>();

	return (
		<div className="container mx-auto min-h-[60vh] mt-2">
			<div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
				<div className="col-span-1 lg:col-span-2 lg:col-start-2">
					<header className="mb-4">
						<Link
							to={`/discussions/${id}`}
							className="bg-zinc-100 dark:bg-neutral-800 px-1 py-0.5 rounded-lg inline-flex items-center gap-2 text-secondary font-medium"
						>
							<div className="i-lucide-arrow-left" /> Go to discussion
						</Link>
					</header>

					<PostContent post={post} />

					{comment && <PostItem post={comment} expanded level={1} />}
				</div>
			</div>
		</div>
	);
}
