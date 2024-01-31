import { MetaFunction } from "@remix-run/node";
import { Link } from "@remix-run/react";
import { Anchor } from "~/components/anchor";
import { values } from "~/lib/values.server";

export const loader = async () => {
	return { school: values.meta() };
};

export const meta: MetaFunction<typeof loader> = ({ data }) => {
	return [{ title: `Discussions | ${data?.school.shortName} | compa` }];
};

export default function Discussions() {
	return (
		<div className="container min-h-[70vh] mx-auto flex flex-col gap-2 justify-center items-center">
			<span className="bg-zinc-100 dark:bg-neutral-800 rounded-lg px-2 py-1">
				We're working on Discussions!
			</span>
			<Anchor href="/timetable">Check Timetable</Anchor>
		</div>
	);
}
