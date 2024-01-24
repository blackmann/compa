import { Prisma } from "@prisma/client"
import { timeToString } from "~/lib/time";

interface Props {
  lesson: Prisma.ScheduleGetPayload<{
    include: { course: true; instructor: true }
  }>
}

function LessonItem({ lesson }: Props) {
  return (
    <div className="group p-2 rounded-lg hover:bg-zinc-100 dark:hover:bg-neutral-800 transition-[background] duration-200">
      <header className="font-mono text-sm text-secondary">
        {lesson.course.code}: {timeToString(lesson.timeStart)}-{timeToString(lesson.timeEnd)}
      </header>

      <div className="font-medium">{lesson.course.name}</div>

      <footer className="text-sm text-secondary flex justify-between">
        <span>{lesson.instructor.name}</span> <span>{lesson.location}</span>

        <button className="rounded-md !text-xs px-2 bg-zinc-200 dark:bg-neutral-900 font-medium group-hover:opacity-100 opacity-0">
          Edit
        </button>
      </footer>
    </div>
  )
}

export { LessonItem }
