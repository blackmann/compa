import { LoaderFunctionArgs, MetaFunction } from "@remix-run/node"
import { Link, Outlet, useLoaderData } from "@remix-run/react"
import { Button } from "~/components/button"
import { DaysHeader } from "~/components/days-header"
import { LessonItem } from "~/components/lesson-item"
import { TimetableFilter } from "~/components/timetable-filter"
import { prisma } from "~/lib/prisma.server"

export const loader = async ({ params }: LoaderFunctionArgs) => {
  const { year, programme, level, sem, day: _day } = params
  const day = Number(_day)

  const schedule = await prisma.schedule.findMany({
    where: {
      day,
      level: Number(level),
      programme: { slug: programme },
      semester: Number(sem),
      year,
    },
  })

  const programmes = await prisma.programme.findMany()

  return {
    day,
    level: level!,
    programme: programme!,
    programmes,
    schedule,
    sem: sem!,
    year: year!,
  }
}

export const meta: MetaFunction = () => {
  return [{ title: "Timetable | KNUST | compa" }]
}

export default function TimeTable() {
  const { day, programmes, schedule } = useLoaderData<typeof loader>()

  return (
    <div className="container mx-auto">
      <div className="grid grid-cols-1 lg:grid-cols-4 xl:grid-cols-6 gap-4 min-h-[70vh]">
        <div className="col-span-1 lg:col-span-2 lg:col-start-2">
          <TimetableFilter programmes={programmes} />

          <DaysHeader className="mt-2" selectedDay={day} />

          <div className="mt-2 flex justify-between">
            {/* // [ ]: Disable link if sem and year selection arent the current one */}
            <Link
              className="flex items-center gap-2 rounded-lg bg-zinc-200 px-2 py-1 dark:bg-neutral-800 font-medium"
              to="add"
            >
              <div className="size-4">
                <div className="i-lucide-list-plus opacity-50" />
              </div>{" "}
              Add lesson
            </Link>

            <Button>
              <div className="size-4">
                <div className="i-lucide-calendar-plus opacity-50" />
              </div>{" "}
              Save calendar
            </Button>
          </div>

          <ul className="mt-2">
            {schedule.map((lesson) => (
              <li key={lesson.id}>
                <LessonItem />
                <hr className="border-zinc-300" />
                <div className="flex justify-end">
                  <div className="rounded-b-lg bg-zinc-300 text-sm font-medium text-zinc-800 px-2">
                    2 hours apart
                  </div>
                </div>
              </li>
            ))}

            <li>
              <LessonItem />
              <hr className="border-zinc-300 dark:border-neutral-700" />
              <div className="flex justify-end">
                <div className="rounded-b-lg bg-zinc-300 dark:bg-neutral-700 dark:text-white text-sm font-medium text-zinc-800 px-2">
                  2 hours apart
                </div>
              </div>
            </li>

            <li>
              <LessonItem />
            </li>
          </ul>
        </div>

        <div className="col-span-1 lg:col-span-2">
          <Outlet />
        </div>
      </div>
    </div>
  )
}
