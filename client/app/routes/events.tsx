import { Prisma } from "@prisma/client";
import { ActionFunctionArgs, MetaFunction, redirect } from "@remix-run/node";
import { Link, useLoaderData } from "@remix-run/react";
import clsx from "clsx";
import dayjs from "dayjs";
import { Anchor } from "~/components/anchor";
import { PostTime } from "~/components/post-time";
import { Username } from "~/components/username";
import { checkAuth } from "~/lib/check-auth";
import { useGlobalCtx } from "~/lib/global-ctx";
import { prisma } from "~/lib/prisma.server";
import { timeToString } from "~/lib/time";
import { values } from "~/lib/values.server";
import { Jsonify } from "type-fest";

export const loader = async () => {
	const events = await prisma.eventItem.findMany({
		where: { date: { gt: dayjs().startOf("week").toDate() } },
		orderBy: { date: "asc" },
		include: { user: true, poster: true },
	});

	return { events, school: values.meta() };
};

export const action = async ({ request }: ActionFunctionArgs) => {
	const userId = await checkAuth(request);
	const { poster, ...data } = await request.json();

	if (poster) {
		const media = await prisma.media.create({ data: poster });
		data.posterId = media.id;
	}

	const event = await prisma.eventItem.create({
		data: { ...data, date: new Date(data.date), userId },
	});

	return redirect(`/events/${event.id}`);
};

export const meta: MetaFunction<typeof loader> = ({ data }) => {
	return [
		{ title: `Events | ${data?.school.shortName} ✽ compa` },
		{
			name: "description",
			content: "All the events happening on (and off) campus. Find them here.",
		},
	];
};

export default function Events() {
	const { events } = useLoaderData<typeof loader>();
	const { user } = useGlobalCtx();

	return (
		<div className="container mx-auto min-h-[60vh] pt-4">
			<div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
				<div className="col-span-1 lg:col-span-3">
					<h1 className="font-bold text-xl">Events</h1>
					<header className="mb-2 flex justify-between">
						<div>
							<div className="bg-zinc-200 dark:bg-neutral-800 rounded-full px-2 py-0.5 inline font-medium text-sm">
								{events.length} events
							</div>
						</div>

						<div>
							<Anchor to="/events/add" className={clsx({ "!hidden": !user })}>
								<div className="i-lucide-plus opacity-60" /> Add event
							</Anchor>
						</div>
					</header>

					{!user && (
						<p className="text-secondary mb-2">
							You must be{" "}
							<Link className="underline text-reset" to="/login">
								logged in
							</Link>{" "}
							to add an event.
						</p>
					)}

					<ul>
						{events.map((event) => (
							<li key={event.id}>
								<EventItem event={event} />
							</li>
						))}
					</ul>

					{events.length === 0 && (
						<div className="text-center text-secondary mt-8">
							No events at the moment. You can add an event if you spotted any
							so every can see.
						</div>
					)}
				</div>
			</div>
		</div>
	);
}

type EventItem = Prisma.EventItemGetPayload<{
	include: { user: true; poster: true };
}>;

interface EventItemProps {
	event: Jsonify<EventItem> | EventItem;
}

function EventItem({ event }: EventItemProps) {
	// [ ] Remove addition of startTime in future
	const isPast = dayjs(event.date)
		.startOf("day")
		.add(event.startTime, "seconds")
		.isBefore(dayjs());

	return (
		<Link
			to={`/events/${event.id}`}
			className={clsx(
				"flex gap-4 hover:bg-zinc-100 dark:hover:bg-neutral-800 dark:hover:bg-opacity-50 px-2 rounded-lg",
				{ "opacity-60": isPast },
			)}
		>
			<div className="w-4 relative">
				<div className="h-full bg-zinc-200 dark:bg-neutral-700 w-[2px] mx-auto" />
				<div className="absolute top-0 bg-zinc-100 dark:bg-zinc-900 border-2 border-zinc-200 dark:border-neutral-700 size-4 rounded-full" />
			</div>

			<div className="flex-1 mb-8">
				<header className="font-mono text-secondary text-sm">
					{dayjs(event.date).format("ddd, DD MMM[.]")}{" "}
					{timeToString(event.startTime)} —{" "}
					{event.endTime ? timeToString(event.endTime) : "till you drop"}
					<br />@{event.venue}
				</header>

				<h2 className="font-bold mt-2">{event.title}</h2>

				<p className="text-secondary">{event.shortDescription}</p>

				{event.poster && (
					<div className="size-30 rounded-lg bg-zinc-200 dark:bg-neutral-800 md:hidden">
						<img
							src={event.poster.url}
							alt={event.title}
							className="object-cover w-full h-full rounded-lg"
						/>
					</div>
				)}

				<p className="mt-2 whitespace-pre-wrap">
					{ellipsize(event.description, 80)}
				</p>

				<div className="text-xs font-mono mt-2 text-secondary">
					Posted <PostTime time={event.createdAt} /> by{" "}
					<Username user={event.user} />
				</div>
			</div>

			<div className="max-md:hidden">
				{event.poster && (
					<div className="size-24 rounded-lg bg-zinc-200 dark:bg-neutral-800">
						<img
							src={event.poster.url}
							alt={event.title}
							className="object-cover w-full h-full rounded-lg"
						/>
					</div>
				)}
			</div>
		</Link>
	);
}

function ellipsize(str: string, length: number) {
	return str.length > length ? `${str.slice(0, length)}…` : str;
}
