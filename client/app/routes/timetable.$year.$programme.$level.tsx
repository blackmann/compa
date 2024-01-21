import { MetaFunction } from "@remix-run/node"
import { Outlet } from "@remix-run/react"
import { DaysHeader } from "~/components/days-header"
import { LessonItem } from "~/components/lesson-item"
import { TimetableFilter } from "~/components/timetable-filter"

export const meta: MetaFunction = () => {
  return [{ title: "Timetable" }]
}

export default function TimeTable() {
  return (
    <div className="container mx-auto">
      <div className="grid grid-cols-1 lg:grid-cols-4 xl:grid-cols-6 gap-4 min-h-[60vh]">
        <div className="col-span-1 lg:col-span-2 lg:col-start-2">
          <TimetableFilter />
          <DaysHeader className="mt-2" />

          <div className="mt-2 flex justify-between">
            <button className="flex items-center gap-2 rounded-lg bg-zinc-200 px-2 dark:bg-neutral-800 font-medium">
              <div className="size-4">
                <div className="i-lucide-list-plus opacity-50" />
              </div>{" "}
              Add lesson
            </button>

            <button className="flex items-center gap-2 rounded-lg bg-blue-600 px-2 text-white font-medium">
              <div className="size-4">
                <div className="i-lucide-calendar-plus opacity-50" />
              </div>{" "}
              Save calendar
            </button>
          </div>

          <div className="mt-2">
            <LessonItem />
            <hr className="border-zinc-300" />
            <div className="flex justify-end">
              <div className="rounded-b-lg bg-zinc-300 text-sm font-medium text-zinc-800 px-2">
                2 hours apart
              </div>
            </div>
            <LessonItem />
          </div>
        </div>
        <div className="col-span-1">
          <Outlet />
        </div>
      </div>
    </div>
  )
}
