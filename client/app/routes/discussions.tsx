import { Media } from "@prisma/client";
import { ActionFunctionArgs, MetaFunction, json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import React from "react";
import { PostInput } from "~/components/post-input";
import { PostItem, PostItemProps } from "~/components/post-item";
import { checkAuth } from "~/lib/check-auth";
import { createPost } from "~/lib/create-post";
import { prisma } from "~/lib/prisma.server";
import { values } from "~/lib/values.server";

export const loader = async () => {
	const posts = await prisma.post.findMany({
		where: { parentId: null },
		include: { user: true, media: true },
		orderBy: { createdAt: "desc" },
	});
	return json({ school: values.meta(), posts });
};

export const action = async ({ request }: ActionFunctionArgs) => {
	const userId = await checkAuth(request);
	const data = await request.json();

	await createPost(data, userId);

	return json({}, { status: 201 });
};

export const meta: MetaFunction<typeof loader> = ({ data }) => {
	return [{ title: `Discussions | ${data?.school.shortName} | compa` }];
};

export default function Discussions() {
	const { posts } = useLoaderData<typeof loader>();

	return (
		<div className="container mx-auto min-h-[60vh]">
			<div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
				<div className="col-span-1"> </div>

				<div className="col-span-1 lg:col-span-2">
					<div className="mb-4">
						<PostInput />
					</div>

					{posts.map((post, i) => (
						<React.Fragment key={post.id}>
							<PostItem post={post as unknown as PostItemProps["post"]} />

							{i < posts.length - 1 && <hr className="me-2 ms-12 dark:border-neutral-700" />}
						</React.Fragment>
					))}
				</div>

				<div className="cols-span-1">
					<div> </div>
				</div>
			</div>
		</div>
	);
}
