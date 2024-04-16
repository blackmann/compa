import { Link, MetaFunction, json } from "@remix-run/react";
import { values } from "~/lib/values.server";


export const loader = async () => {
	return json({ school: values.meta() });
};

export const meta: MetaFunction<typeof loader> = ({ data }) => {
	return [
		{ title: `Communities | ${data?.school.shortName} ✽ compa` },
		{ name: "description", content: "" },
	];
};


export default function Communities() {
	return (
		<div className="container min-h-[60vh]">
			<h1 className="font-bold text-xl mb-2">Communities</h1>

			<ul>
				<li>
					<Link to="/communities/creative-creative">
						<div className="flex gap-2 hover:bg-zinc-100 dark:hover:bg-neutral-800 rounded-lg p-2">
							<div className="aspect-[3/2] bg-neutral-800 w-[6rem] self-start rounded-lg" />
							<div className="flex-1">
								<h2 className="font-medium">Creative</h2>
								<p className="text-xs text-secondary font-mono">
									Open community &bull; 13 members
								</p>

								<p className="text-secondary text-sm">
									Learning, making and sharing. We make beautiful things with
									our minds.
								</p>
							</div>
						</div>
					</Link>
				</li>
			</ul>
		</div>
	);
}
