import { LoaderFunctionArgs, MetaFunction, json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { CommunityInfo } from "~/components/community-info";
import { CommunityMod } from "~/components/community-mod";
import { PostInput } from "~/components/post-input";
import { checkMod } from "~/lib/check-mod";
import { prisma } from "~/lib/prisma.server";
import { values } from "~/lib/values.server";

export const loader = async ({ request, params }: LoaderFunctionArgs) => {
	const community = await prisma.community.findFirst({
		where: { handle: params.slug },
	});

	if (!community) {
		throw json({}, { status: 404 });
	}

	if (community.status !== "activated") {
		// only mods can arrive here
		try {
			await checkMod(request);
		} catch {
			throw json({}, { status: 404 });
		}
	}

	return json({ community, school: values.meta() });
};

export const meta: MetaFunction<typeof loader> = ({ data }) => {
	if (!data) return [];

	return [
		{
			title: `${data.community.name} (+${data.community.handle}) | ${data.school.shortName} ✽ compa`,
		},
		{ name: "description", content: data.community.description },
	];
};

export default function Community() {
	const { community } = useLoaderData<typeof loader>();

	return (
		<div className="container mt-2">
			<div className="grid grid-cols-1 lg:grid-cols-3 min-h-[60vh] gap-4">
				<div className="col-span-1 lg:col-span-2">
					<CommunityMod community={community} />

					<div className="lg:hidden mb-2">
						<CommunityInfo community={community} />
					</div>
					<PostInput />
				</div>

				<div className="col-span-1 max-lg:hidden">
					<CommunityInfo community={community} />
				</div>
			</div>
		</div>
	);
}
