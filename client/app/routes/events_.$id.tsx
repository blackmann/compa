import {
	ActionFunctionArgs,
	LoaderFunctionArgs,
	MetaFunction,
	json,
	redirect,
} from "@remix-run/node";
import { useLoaderData, useSubmit } from "@remix-run/react";
import { Anchor } from "~/components/anchor";
import { Button } from "~/components/button";
import { PostTime } from "~/components/post-time";
import { Username } from "~/components/username";
import { checkAuth } from "~/lib/check-auth";
import { useGlobalCtx } from "~/lib/global-ctx";
import { prisma } from "~/lib/prisma.server";
import { values } from "~/lib/values.server";

export const loader = async ({ params }: LoaderFunctionArgs) => {
	const eventId = Number(params.id);
	try {
		const event = await prisma.eventItem.findFirstOrThrow({
			where: { id: eventId },
			include: { poster: true, user: true },
		});

		return { event, school: values.meta() };
	} catch (err) {
		throw json({}, { status: 404 });
	}
};

export const action = async ({ request, params }: ActionFunctionArgs) => {
	if (request.method !== "DELETE") {
		throw json(null, { status: 405 });
	}

	const userId = await checkAuth(request);
	await prisma.eventItem.delete({ where: { id: Number(params.id), userId } });

	return redirect("/events");
};

export const meta: MetaFunction<typeof loader> = ({ data }) => {
	return [
		{ title: `${data?.event.title} | ${data?.school.shortName} | compa` },
		{
			name: "description",
			content:
				data?.event.shortDescription ||
				data?.event.description.substring(0, 30),
		},
		{ name: "og:image", content: data?.event.poster?.url },
	];
};

export default function EventDetail() {
	const { event } = useLoaderData<typeof loader>();
	const { user } = useGlobalCtx();

	const submit = useSubmit();

	function shareEvent() {
		if (navigator.share) {
			navigator.share({
				title: event.title,
				text: event.shortDescription || undefined,
				url: window.location.href,
			});
		}
	}

	function handleEventDelete() {
		// [ ] Soft delete?
		const yes = confirm(
			"Are you sure you want to delete this event This cannot be undone.",
		);

		if (!yes) {
			return;
		}

		submit(null, { action: `/events/${event.id}`, method: "DELETE" });
	}

	return (
		<div className="container mx-auto min-h-[60vh]">
			<div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
				<article className="col-span-1 lg:col-span-2 lg:col-start-2">
					<div className="text-xs font-mono mt-2 text-secondary">
						Posted <PostTime time={event.createdAt} /> by{" "}
						<Username user={event.user} />
					</div>
					<h1 className="font-bold text-2xl">{event.title}</h1>
					<h2 className="text-secondary">{event.shortDescription}</h2>

					<div className="grid grid-cols-1 lg:grid-cols-2 mt-4">
						<div className="col-span-1">
							<div className="flex gap-2 font-medium text-secondary items-center">
								<div className="i-lucide-calendar" />
								Friday, 3rd March
							</div>

							<div className="flex gap-2 font-medium text-secondary items-center">
								<div className="i-lucide-clock" />
								9.00pm — 01.40am
							</div>

							<div className="flex gap-2 font-medium text-secondary items-center">
								<div className="i-lucide-map" />
								{event.venue}
								{event.mapsLink && (
									<a
										target="_blank"
										href={event.mapsLink}
										className="underline text-zinc-800 dark:text-white"
										rel="noreferrer"
									>
										View on map
									</a>
								)}
							</div>
						</div>

						<div className="max-lg:mt-4 lg:text-end flex gap-2 items-start">
							<Anchor
								href={`/downloads/events/${event.id}`}
								className="shrink-0"
								variant="neutral"
							>
								<div className="i-lucide-calendar-plus opacity-50" />
								Add to calendar
							</Anchor>

							<Button
								className="shrink-0"
								variant="primary"
								onClick={shareEvent}
							>
								<div className="i-lucide-share opacity-50" />
								Share event
							</Button>
						</div>
					</div>

					<p className="mt-2">{event.description}</p>

					{event.eventLink && (
						<>
							<h3 className="mt-2 text-secondary font-medium">Event link</h3>
							<p>
								<a className="underline" href={event.eventLink}>
									{event.eventLink}
								</a>
							</p>
						</>
					)}

					{event.poster && (
						<>
							<h3 className="text-secondary font-medium mt-4">Poster</h3>
							<div className="grid lg:grid-cols-2">
								<div className="col-span-1">
									<img
										src={event.poster.url}
										alt={event.title}
										className="rounded-lg"
									/>
								</div>
							</div>
						</>
					)}

					{user?.id === event.user.id && (
						<div className="mt-4">
							<Button onClick={handleEventDelete} variant="neutral">
								Delete event
							</Button>
						</div>
					)}
				</article>
			</div>
		</div>
	);
}
