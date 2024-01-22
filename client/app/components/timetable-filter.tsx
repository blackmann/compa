import { FieldValues, useForm, useFormContext } from "react-hook-form"
import { LargeSelect } from "./large-select"
import { useAsyncFetcher } from "~/lib/use-async-fetcher"
import React from "react"
import { useNavigate } from "@remix-run/react"

interface Props {
  programmes: { name: string; slug: string }[]
  value?: {
    programme: string
    level: string
    sem: string
    year: string
  }
}

function TimetableFilter({ programmes, value }: Props) {
  const [programmeSelectOpen, setProgrammeSelectOpen] = React.useState(false)
  const fetcher = useAsyncFetcher()
  const { watch, register, setValue } = useForm({
    defaultValues: {
      ...value,
    },
  })

  const navigate = useNavigate()

  const programme = watch("programme")
  const level = watch("level")
  const sem = watch("sem")
  const year = watch("year")

  const selected = React.useMemo(
    () => programmes.find(({ slug }) => slug === value?.programme),
    [programmes]
  )

  const programmeOptions = programmes.map(({ name, slug }) => ({
    label: name,
    value: slug,
  }))

  async function handleAdd(data: FieldValues) {
    await fetcher.submit(JSON.stringify(data), {
      encType: "application/json",
      action: "/programmes",
      method: "POST",
    })
  }

  React.useEffect(() => {
    if (selected) return
    setValue("programme", programmes[0].slug)
  }, [selected, setValue])

  React.useEffect(() => {
    const day = new URLSearchParams(location.search).get("day")
    navigate(`/timetable/${year}/${programme}/${level}/${sem}?day=${day ?? ''}`)
  }, [programme, level, sem, year])

  return (
    <div className="flex gap-2">
      <LargeSelect
        newForm={<NewForm />}
        onAdd={handleAdd}
        open={programmeSelectOpen}
        onToggle={(open) => setProgrammeSelectOpen(open)}
        options={programmeOptions}
        onSelect={(value) => {
          setValue("programme", value)
          setProgrammeSelectOpen(false)
        }}
      >
        {selected?.name}
      </LargeSelect>

      <select
        className="bg-zinc-200 dark:bg-neutral-800 px-2 py-1 pe-6 rounded-lg font-medium"
        {...register("year")}
      >
        <option value="2023-2024">2023/2024</option>
      </select>

      <select
        className="bg-zinc-200 dark:bg-neutral-800 px-2 py-1 pe-6 rounded-lg font-medium"
        {...register("level", { required: true })}
      >
        <option value="100">L100</option>
        <option value="200">L200</option>
        <option value="300">L300</option>
        <option value="400">L400</option>
        <option value="500">L500</option>
        <option value="600">L600</option>
      </select>

      <select
        className="bg-zinc-200 dark:bg-neutral-800 px-2 py-1 pe-6 rounded-lg font-medium"
        {...register("sem", { required: true })}
      >
        <option value="1">Sem 1</option>
        <option value="2">Sem 2</option>
      </select>
    </div>
  )
}

function NewForm() {
  const { register } = useFormContext()

  return (
    <div className="flex-1">
      <header className="p-2">
        <div className="text-sm text-secondary flex gap-2 items-center font-medium">
          <div className="i-lucide-list-plus"></div> Add new
        </div>
      </header>

      <div className="p-2">
        <label>
          Programme
          <input
            className="block w-full rounded-lg bg-zinc-200 dark:bg-neutral-800 px-2 py-1"
            type="text"
            {...register("name", { required: true })}
          />
          <small className="text-secondary">
            Example. BSc. Aerospace Engineering, MSc. Mathematics
          </small>
        </label>
      </div>
    </div>
  )
}

export { TimetableFilter }
