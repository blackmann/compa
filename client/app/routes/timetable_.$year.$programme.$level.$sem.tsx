import { LoaderFunctionArgs, MetaFunction } from "@remix-run/node"
import { Outlet, useLoaderData } from "@remix-run/react"
import React from "react"
import { DaysHeader } from "~/components/days-header"
import { LessonForm } from "~/components/lesson-form"
import { LessonItem } from "~/components/lesson-item"
import { TimetableFilter } from "~/components/timetable-filter"
import { prisma } from "~/lib/prisma.server"

export const loader = async ({ params, request }: LoaderFunctionArgs) => {
  const url = new URL(request.url)
  const _day = parseInt(url.searchParams.get("day") || '')
  const day = isNaN(_day) ? new Date().getDay() : _day

  const { year, programme, level, sem } = params

  const schedule = await prisma.schedule.findMany({
    where: {
      year,
      programme: { slug: programme },
      level: Number(level),
      day,
      semester: Number(sem),
    },
  })

  const programmes = await prisma.programme.findMany()

  return { day, year, programme, level, schedule, programmes }
}

export const meta: MetaFunction = () => {
  return [{ title: "Timetable | KNUST | compa" }]
}

export default function TimeTable() {
  const { day, programmes, schedule } = useLoaderData<typeof loader>()

  return (
    <div className="container mx-auto">
      <div className="grid grid-cols-1 lg:grid-cols-4 xl:grid-cols-6 gap-4 min-h-[60vh]">
        <div className="col-span-1 lg:col-span-2 lg:col-start-2">
          <TimetableFilter programmes={programmes} />

          <DaysHeader className="mt-2" selectedDay={day} />

          <div className="mt-2 flex justify-between">
            <button className="flex items-center gap-2 rounded-lg bg-zinc-200 px-2 py-1 dark:bg-neutral-800 font-medium">
              <div className="size-4">
                <div className="i-lucide-list-plus opacity-50" />
              </div>{" "}
              Add lesson
            </button>

            <button className="flex items-center gap-2 rounded-lg bg-blue-600 px-2 py-1 text-white font-medium">
              <div className="size-4">
                <div className="i-lucide-calendar-plus opacity-50" />
              </div>{" "}
              Save calendar
            </button>
          </div>

          <ul className="mt-2">
            {schedule.map((lesson) => (
              <React.Fragment key={lesson.id}>
                <LessonItem />
                <hr className="border-zinc-300" />
                <div className="flex justify-end">
                  <div className="rounded-b-lg bg-zinc-300 text-sm font-medium text-zinc-800 px-2">
                    2 hours apart
                  </div>
                </div>
              </React.Fragment>
            ))}
          </ul>
        </div>

        <div className="col-span-1 lg:col-span-2">
          <LessonForm />
          <Outlet />
        </div>
      </div>
    </div>
  )
}
