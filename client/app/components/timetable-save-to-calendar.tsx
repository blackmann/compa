import React from "react"
import { Button } from "./button"
import { Modal } from "./modal"
import { Anchor } from "./anchor"
import { useLoaderData, useParams } from "@remix-run/react"
import { TimeTableLoader } from "~/routes/timetable_.$year.$programme.$level.$sem.$day"

// [ ]: Edit lesson
// [ ]: Save programme, etc. as cookie preference
// [ ]: Hosting
// [ ]: Website
function TimetableSaveToCalender() {
  const [open, setOpen] = React.useState(false)
  const { programmes } = useLoaderData<TimeTableLoader>()

  const handleModalClose = React.useCallback(() => setOpen(false), [])

  const { year, programme: programmeSlug, sem, level } = useParams()
  const url = `/downloads/timetable/${year}/${programmeSlug}/${level}/${sem}`

  const programme = programmes.find((p) => p.slug === programmeSlug)

  return (
    <>
      <Button onClick={() => setOpen(true)}>
        <div className="size-4">
          <div className="i-lucide-calendar-plus opacity-50" />
        </div>{" "}
        Save to calendar
      </Button>

      <Modal
        open={open}
        onClose={handleModalClose}
        className="w-full max-w-[24rem]"
      >
        <div className="w-full">
          <header className="flex text-secondary p-2 items-center text-sm gap-2">
            <div className=" i-lucide-calendar-plus"></div>
            <div>Save to Calendar</div>
          </header>

          <div className="px-2 mb-2">
            <p>
              You're about to download the calendar file which contains all the
              schedule for{" "}
              <code className="bg-zinc-200 dark:bg-neutral-700 px-1 rounded">
                {programme?.name}
              </code>{" "}
              <code className="bg-zinc-200 dark:bg-neutral-700 px-1 rounded">
                L{level}
              </code>{" "}
              Semester{" "}
              <code className="bg-zinc-200 dark:bg-neutral-700 px-1 rounded">
                {sem}
              </code>{" "}
              for the year{" "}
              <code className="bg-zinc-200 dark:bg-neutral-700 px-1 rounded">
                {year}
              </code>
              .
            </p>

            <p className="mt-2 text-secondary">
              After download, open file to automically fill your calendar.
            </p>

            <p className="mt-2">
              🌶️ You may need to manually adjust your calendar when there are
              changes.
            </p>
          </div>

          <footer className="flex justify-between p-2 border-t border-zinc-200 dark:border-neutral-700">
            <Button variant="neutral" onClick={() => setOpen(false)}>
              Cancel
            </Button>

            <Anchor href={url}>Download ics file</Anchor>
          </footer>
        </div>
      </Modal>
    </>
  )
}

export { TimetableSaveToCalender }
