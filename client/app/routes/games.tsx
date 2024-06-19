import { json, type MetaFunction } from "@remix-run/node";
import { values } from "~/lib/values.server";

export const loader = async () => {
	return json({ school: values.meta() });
};

export const meta: MetaFunction<typeof loader> = ({ data }) => {
	return [
		{ title: `Games | ${data?.school.shortName} | compa` },
		{
			name: "description",
			content:
				"Coming soon…",
		},
	];
};

export default function Games() {
	return (
		<div className="container min-h-[60vh]">
			<div>Wait a little, it's gonna be fun…</div>
		</div>
	);
}
