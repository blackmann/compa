import { MetaFunction } from "@remix-run/node";
import { Input } from "~/components/input";
import { PostFilter } from "~/components/post-filter";
import { values } from "~/lib/values.server";

export const loader = async () => {
	return { school: values.meta() };
};

export const meta: MetaFunction<typeof loader> = ({ data }) => {
	return [
		{ title: `Resources | ${data?.school.shortName} | compa` },
		{
			name: "description",
			content:
				"Find resources for your programme, course, level or anything about the school.",
		},
	];
};

export default function Resources() {
	return (
		<div className="h-[60vh] container mx-auto">
			<h1 className="font-bold text-xl">Resources</h1>

			<Input placeholder="Search for file" />

			<div className="mt-2">
				<PostFilter label="Filter resources" path="/resources" />
			</div>
		</div>
	);
}
