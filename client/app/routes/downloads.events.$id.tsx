import { LoaderFunctionArgs } from "@remix-run/node";
import { prisma } from "~/lib/prisma.server";
import ics from "ics";
import dayjs from "dayjs";
import { values } from "~/lib/values.server";
import { slugify } from "~/lib/slugify";

export const loader = async ({ params }: LoaderFunctionArgs) => {
	const event = await prisma.eventItem.findFirstOrThrow({
		where: { id: Number(params.id) },
	});

	const when = dayjs(event.date).startOf("day").add(event.startTime, "seconds");

	const render = ics.createEvent({
		title: event.title,
		start: [
			when.year(),
			when.month() + 1,
			when.date(),
			when.hour(),
			when.minute(),
		],
		// [ ] Properly calculate duration
		duration: { hours: 1 },
		description: event.shortDescription || event.description,
		location: event.venue,
		url: `https://${values.get("id")}.compa.so/events/${event.id}`,
	});

	const fn = `${slugify(event.title)}.ics`;

	return new Response(new File([render.value as string], fn, {}), {
		headers: {
			"Content-Type": "text/calendar",
			"Content-Disposition": `attachment; filename="${fn}"`,
		},
	});
};
