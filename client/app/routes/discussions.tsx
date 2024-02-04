import { ActionFunctionArgs, MetaFunction } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { PostInput } from "~/components/post-input";
import { PostItem } from "~/components/post-item";
import { checkAuth } from "~/lib/check-auth";
import { prisma } from "~/lib/prisma.server";
import { values } from "~/lib/values.server";

export const loader = async () => {
	const posts = await prisma.post.findMany({ include: { user: true }});
	return { school: values.meta(), posts };
};

export const action = async ({ request }: ActionFunctionArgs) => {
	const userId = await checkAuth(request);
	const data = await request.json();

	await prisma.post.create({
		data: {
			content: data.content,
			userId,
		},
	});

	return null;
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

					{posts.map((post) => (
						<PostItem post={post} key={post.id} />
					))}
				</div>

				<div className="cols-span-1">
					<div> </div>
				</div>
			</div>
		</div>
	);
}
