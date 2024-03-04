import { MetaFunction } from "@remix-run/node";
import { values } from "~/lib/values.server";

export const loader = async () => {
	return { school: values.meta() };
};

export const meta: MetaFunction<typeof loader> = ({ data }) => {
	return [
		{ title: `Events | ${data?.school.shortName} | compa` },
		{
			name: "description",
			content: "All the events happening on (and off) campus. Find them here.",
		},
	];
};

export default function Events() {
	return (
		<div className="container mx-auto min-h-[60vh]">
			<div>Find upcoming events here.</div>
			<div>Coming soon</div>
		</div>
	);
}
