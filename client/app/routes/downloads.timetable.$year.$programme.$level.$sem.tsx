import type { LoaderFunctionArgs } from "@remix-run/node";
import dayjs from "dayjs";
import ics from "ics";
import crypto from "node:crypto";
import { prisma } from "~/lib/prisma.server";
import { values } from "~/lib/values.server";

export const loader = async ({ params }: LoaderFunctionArgs) => {
	const { year, programme, level, sem } = params;

	const schedule = await prisma.schedule.findMany({
		where: {
			year,
			programme: { slug: programme },
			level: Number(level),
			semester: Number(sem),
		},
		include: {
			course: true,
		},
	});

	const semesterEnd = (values.get("examination.start") as string).replace(/-/g, "");
	const schoolId = values.get("id");

	const events: ics.EventAttributes[] = schedule.map((lesson) => {
		const _hours = (lesson.timeEnd - lesson.timeStart) / 3600;
		const hours = Math.floor(_hours);
		const minutes = (_hours - hours) * 60;

		const hour = Math.floor(lesson.timeStart / 3600);
		const minute = (lesson.timeStart - hour * 3600) / 60;

		const date = dayjs()
			.set("day", lesson.day)
			.set("hour", hour)
			.set("minute", minute)
			.set("second", 0)
			.set("millisecond", 0);

		const day = date.format("dd").toUpperCase();

		const id = [schoolId, programme, year, level, sem, lesson.id].join("-");
		const eventId = crypto.createHash("md5").update(id).digest("hex");

		const title = `${lesson.course.code} ${lesson.course.name}`;

		return {
			title,
			duration: { hours: Math.floor(hours), minutes: Math.floor(minutes) },
			location: lesson.location,
			alarms: [
				{
					trigger: { before: true, minutes: 30 },
					action: "audio",
					description: title,
				},
				{
					trigger: { before: true, minutes: 5 },
					action: "audio",
					description: title,
				},
			],
			start: [
				date.year(),
				date.month() + 1,
				date.date(),
				date.hour(),
				date.minute(),
			],
			uid: eventId,
			recurrenceRule: `FREQ=WEEKLY;BYDAY=${day};INTERVAL=1;UNTIL=${semesterEnd}T235959Z`,
		};
	});

	const { value: icsRender } = ics.createEvents(events);

	const fn = `${programme}-${year}-${sem}.ics`;

	const cal = new File([icsRender as string], fn, {});

	return new Response(cal, {
		headers: {
			"Content-Type": "text/calendar",
			"Content-Disposition": `attachment; filename="${fn}"`,
		},
	});
};
