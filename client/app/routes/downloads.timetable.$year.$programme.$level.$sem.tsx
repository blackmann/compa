import { LoaderFunctionArgs } from "@remix-run/node"
import { prisma } from "~/lib/prisma.server"
import ics from "ics"
import dayjs from "dayjs"
import { config } from "~/lib/config.server"
import crypto from "crypto"

export const loader = async ({ params }: LoaderFunctionArgs) => {
  const { year, programme, level, sem } = params

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
  })

  const semesterEnd = config.get("semester.end").replace(/-/g, "")
  const schoolId = config.get("id")

  const events: ics.EventAttributes[] = schedule.map((lesson) => {
    const _hours = (lesson.timeEnd - lesson.timeStart) / 3600
    const hours = Math.floor(_hours)
    const minutes = (_hours - hours) * 60

    const hour = Math.floor(lesson.timeStart / 3600)
    const minute = (lesson.timeStart - hour * 3600) / 60

    const date = dayjs()
      .set("day", lesson.day)
      .set("hour", hour)
      .set("minute", minute)
      .set("second", 0)
      .set("millisecond", 0)

    const day = date.format("dd").toUpperCase()

    const id = [schoolId, programme, year, level, sem, lesson.id].join("-")
    const eventId = crypto.createHash("md5").update(id).digest("hex")

    return {
      title: `${lesson.course.code} ${lesson.course.name}`,
      duration: { hours: Math.floor(hours), minutes: Math.floor(minutes) },
      location: lesson.location,
      start: [
        date.year(),
        date.month() + 1,
        date.date(),
        date.hour(),
        date.minute(),
      ],
      uid: eventId,
      recurrenceRule: `FREQ=WEEKLY;BYDAY=${day};INTERVAL=1;UNTIL=${semesterEnd}T235959Z`,
    }
  })

  const { value: icsRender } = ics.createEvents(events)

  const fn = `${programme}-${year}-${sem}.ics`

  const cal = new File([icsRender!], fn, {})

  return new Response(cal, {
    headers: {
      "Content-Type": "text/calendar",
      "Content-Disposition": `attachment; filename="${fn}"`,
    },
  })
}
