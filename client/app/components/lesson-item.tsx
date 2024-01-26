import { Prisma } from "@prisma/client"
import { timeToString } from "~/lib/time"
import { Button } from "./button"
import clsx from "clsx"
import { Modal } from "./modal"

interface Props {
  lesson: Prisma.ScheduleGetPayload<{
    include: { course: true; instructor: true }
  }>
  checked?: boolean
  onClick?: VoidFunction
}

function LessonItem({ checked, lesson, onClick }: Props) {
  function handleEdit(e: React.MouseEvent<HTMLButtonElement>) {
    e.preventDefault()
    e.stopPropagation()
  }

  return (
    <>
      <div
        className={clsx(
          "group p-2 rounded-lg hover:bg-zinc-100 dark:hover:bg-neutral-800 transition-[background] duration-200 cursor-pointer",
          {
            "bg-zinc-100 dark:bg-neutral-800": checked,
          }
        )}
        onClick={onClick}
      >
        <header className="font-mono text-sm text-secondary">
          {timeToString(lesson.timeStart)} — {timeToString(lesson.timeEnd)} @{" "}
          <span>{lesson.location}</span>
        </header>

        <div className="font-medium">
          {lesson.course.code}: {lesson.course.name}
        </div>

        <footer className="text-sm text-secondary flex justify-between">
          <span>{lesson.instructor.name}</span>
        </footer>

        <div
          className={clsx(
            "flex gap-2 mt-2 justify-end opacity-0 transition-opacity duration-250 h-0",
            { "opacity-100 h-auto": checked }
          )}
        >
          <Button
            className="dark:bg-zinc-700"
            variant="neutral"
            onClick={handleEdit}
          >
            <div className="i-lucide-edit-3 opacity-50"></div> Edit
          </Button>
          {/* <Button className="dark:bg-zinc-700" variant="neutral">
          Start Discussion
        </Button> */}
        </div>
      </div>

      <Modal></Modal>
    </>
  )
}

export { LessonItem }
