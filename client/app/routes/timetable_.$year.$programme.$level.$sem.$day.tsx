import {
  ActionFunctionArgs,
  LoaderFunctionArgs,
  MetaFunction,
} from "@remix-run/node"
import { Link, Outlet, useLoaderData, useOutlet } from "@remix-run/react"
import clsx from "clsx"
import posthog from "posthog-js"
import React from "react"
import { DaysHeader } from "~/components/days-header"
import { LessonItem } from "~/components/lesson-item"
import { TimetableFilter } from "~/components/timetable-filter"
import { TimetableSaveToCalender } from "~/components/timetable-save-to-calendar"
import { prisma } from "~/lib/prisma.server"
import { timeFromString } from "~/lib/time"
import { values } from "~/lib/values.server"

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
    include: {
      course: true,
      instructor: true,
    },
    orderBy: [{ timeStart: "asc" }],
  })

  const programmes = await prisma.programme.findMany({
    orderBy: { name: "asc" },
  })

  return {
    day,
    level: level!,
    programme: programme!,
    programmes,
    schedule,
    sem: sem!,
    year: year!,
    school: values.meta(),
  }
}

export const action = async ({ request, params }: ActionFunctionArgs) => {
  if (request.method !== "POST") {
    return new Response(null, {
      status: 405,
      statusText: "Method Not Allowed",
    })
  }

  const { year, level, day, sem } = params
  const { consent, timeEnd, timeStart, ...data } = await request.json()

  await prisma.schedule.create({
    data: {
      ...data,
      day: Number(day),
      level: Number(level),
      year,
      timeStart: timeFromString(timeStart),
      timeEnd: timeFromString(timeEnd),
      semester: Number(sem),
    },
  })

  return null
}

export const meta: MetaFunction<typeof loader> = ({ data }) => {
  return [{ title: `Timetable | ${data?.school.shortName} | compa` }]
}

export default function TimeTable() {
  const { day, programmes, schedule } = useLoaderData<typeof loader>()
  const [checked, setChecked] = React.useState<number>(0)

  const outlet = useOutlet()

  const _minutes = schedule.reduce((acc, lesson) => {
    return acc + (lesson.timeEnd - lesson.timeStart) / 60
  }, 0)

  const hours = Math.floor(_minutes / 60)
  const minutes = _minutes - hours * 60

  return (
    <div className="container mx-auto">
      <div className="grid grid-cols-1 lg:grid-cols-4 xl:grid-cols-6 gap-4 min-h-[70vh]">
        <div
          className={clsx("col-span-1 lg:col-span-2 lg:col-start-2", {
            "max-lg:hidden": outlet,
          })}
        >
          <TimetableFilter programmes={programmes} />

          <DaysHeader className="mt-2" selectedDay={day} />

          <div className="mt-2 flex justify-between">
            {/* // [ ]: Disable link if sem and year selection arent the current one */}
            <Link
              className="flex items-center gap-2 rounded-lg bg-zinc-200 px-2 py-1 dark:bg-neutral-800 font-medium"
              to="add"
              onClick={() => posthog.capture("add_lesson_clicked")}
            >
              <div className="size-4">
                <div className="i-lucide-list-plus opacity-50 dark:text-white" />
              </div>{" "}
              <span className="dark:text-white" >Add lesson</span>
            </Link>

            <TimetableSaveToCalender />
          </div>

          <ul className="mt-2">
            {schedule.map((lesson, i) => {
              const nextLesson = schedule[i + 1]
              const timeDifference = nextLesson
                ? nextLesson.timeStart - lesson.timeEnd
                : 0

              const hours = Math.floor(timeDifference / 3600)

              return (
                <li key={lesson.id}>
                  <LessonItem
                    lesson={lesson}
                    checked={lesson.id === checked}
                    onClick={() => {
                      if (lesson.id === checked) {
                        setChecked(0)
                      } else {
                        setChecked(lesson.id)
                      }
                    }}
                  />

                  {i < schedule.length - 1 && (
                    <hr className="border-zinc-300 dark:border-neutral-600" />
                  )}

                  {hours > 2 && (
                    <>
                      <div className="flex justify-end">
                        <div className="rounded-b-lg bg-zinc-200 dark:bg-neutral-600 text-sm font-medium text-zinc-800 dark:text-neutral-200 px-2">
                          {Math.floor(hours)} hours apart
                        </div>
                      </div>
                    </>
                  )}
                </li>
              )
            })}
          </ul>

          {schedule.length > 0 && (
            <div className="mt-2">
              <div className="text-sm border rounded-full inline-block px-2 border-zinc-300 dark:border-neutral-700 text-secondary">
                {schedule.length} lessons &bull; {hours}h {minutes}m total
              </div>
            </div>
          )}

          {schedule.length === 0 && (
            <div className="text-center text-secondary mt-12">
              <div className="bg-rose-100 dark:bg-rose-700 dark:bg-opacity-20 rounded-lg size-12 inline-flex items-center justify-center">
                <div className="i-lucide-cup-soda inline-block text-3xl rounded-lg text-rose-500" />
              </div>
              <p className="mt-2">No lessons for today</p>
              <p>
                If a lesson is missing, you can{" "}
                <Link
                  className="bg-zinc-200 dark:bg-neutral-700 dark:text-neutral-300 rounded-md px-2 py-1 text-inherit font-medium"
                  to="add"
                >
                  Add new lesson
                </Link>
              </p>
            </div>
          )}
        </div>

        <div className="col-span-1 lg:col-span-2">
          <Outlet />
        </div>
      </div>
    </div>
  )
}

export type TimeTableLoader = typeof loader
