import { Prisma } from "@prisma/client"
import { timeToString } from "~/lib/time"
import { Button } from "./button"
import clsx from "clsx"
import { Modal } from "./modal"
import React from "react"
import { Input } from "./input"
import { FieldValues, useForm } from "react-hook-form"
import { useAsyncFetcher } from "~/lib/use-async-fetcher"

interface Props {
  lesson: Prisma.ScheduleGetPayload<{
    include: { course: true; instructor: true }
  }>
  checked?: boolean
  onClick?: VoidFunction
}

function LessonItem({ checked, lesson, onClick }: Props) {
  const [showEdit, setShowEdit] = React.useState(false)
  const fetcher = useAsyncFetcher()

  const { handleSubmit, register } = useForm({
    defaultValues: {
      timeStart: timeToString(lesson.timeStart),
      timeEnd: timeToString(lesson.timeEnd),
      location: lesson.location,
    },
  })

  function handleEdit(e: React.MouseEvent<HTMLButtonElement>) {
    e.preventDefault()
    e.stopPropagation()

    setShowEdit(true)
  }

  async function handleDelete() {
    const yes = confirm('Are you sure you want to delete this lesson? This cannot be undone.')
    if (!yes) {
      return
    }

    await fetcher.submit(null, {
      encType: "application/json",
      action: `/lessons/${lesson.id}`,
      method: 'DELETE'
    })

    setShowEdit(false)
  }

  async function saveLesson(data: FieldValues) {
    await fetcher.submit(JSON.stringify(data), {
      encType: "application/json",
      action: `/lessons/${lesson.id}`,
      method: 'PATCH'
    })

    setShowEdit(false)
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

      <Modal open={showEdit} onClose={() => setShowEdit(false)}>
        <form className="w-[24rem]" onSubmit={handleSubmit(saveLesson)}>
          <header className="p-2 pb-0">
            <div className="text-sm text-secondary flex gap-2 items-center mb-2 font-medium">
              <div className="i-lucide-scan-search"></div> Edit lesson
            </div>

            <p>
              You're editing the lesson: <b>{lesson.course.name}</b>
            </p>
          </header>

          <div className="p-2">
            <div className="grid grid-cols-3 gap-2">
              <div className="col-span-1">
                <label className="block">
                  <span>Start time</span>
                  <Input
                    type="time"
                    {...register("timeStart", { required: true })}
                  />
                </label>
              </div>

              <div className="col-span-1">
                <label className="block">
                  <span>End time</span>
                  <Input
                    type="time"
                    {...register("timeEnd", { required: true })}
                  />
                </label>
              </div>

              <div className="col-span-1">
                <label className="block">
                  <span>Location</span>
                  <Input {...register("location", { required: true })} />
                  <small className="text-secondary">Eg. SF24</small>
                </label>
              </div>
            </div>
            <p className="text-secondary">
              If you need to change the course and lecturer, you need to delete
              this schedule and create a new one.
            </p>
          </div>

          <footer className="p-2 border-t border-zinc-300 dark:border-neutral-700">
            <div className="flex justify-between">
              <div className="flex gap-2">
                <Button
                  variant="neutral"
                  type="button"
                  onClick={() => setShowEdit(false)}
                >
                  Cancel
                </Button>

                <Button variant="neutral" type="button" onClick={handleDelete}>
                  <div className="opacity-50 i-lucide-trash-2"></div> Delete
                </Button>
              </div>

              <Button variant="primary">Save</Button>
            </div>
          </footer>
        </form>
      </Modal>
    </>
  )
}

export { LessonItem }
