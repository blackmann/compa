import React from "react"
import { Modal } from "./modal"
import { FieldValues, FormProvider, set, useForm } from "react-hook-form"
import { RequestState } from "~/lib/request-state"
import clsx from "clsx"
import { Input } from "./input"

interface Props extends React.PropsWithChildren {
  label: string
  newForm: React.ReactNode
  onAdd: (data: FieldValues) => Promise<void>
  onSelect: (value: string | number) => void
  onToggle: (open: boolean) => void
  open: boolean
  options: { label: string; value: string | number }[]
}

function LargeSelect({
  children,
  label,
  newForm,
  onAdd,
  onSelect,
  onToggle,
  open,
  options,
}: Props) {
  const [state, setState] = React.useState<"select" | "add">("select")

  function showAdd() {
    setState("add")
  }

  const handleModalClose = React.useCallback(() => onToggle(false), [])

  function hide() {
    onToggle(false)
  }

  async function handleOnAdd(data: FieldValues) {
    await onAdd(data)
    setState("select")
  }

  React.useEffect(() => {
    if (!open) {
      setState("select")
    }
  }, [open])

  return (
    <>
      <button
        className="bg-zinc-200 dark:bg-neutral-800 px-2 py-1 rounded-lg font-medium flex-1 text-start flex items-center w-full dark:text-white"
        type="button"
        onClick={() => onToggle(true)}
      >
        <span className="flex-1 line-clamp-1">{children}</span>
        <div className="i-lucide-mouse-pointer-2 text-secondary"></div>
      </button>

      <Modal
        onClose={handleModalClose}
        open={open}
        className="w-full max-w-[24rem]"
      >
        <div className="w-full rounded-lg bg-zinc-100 dark:bg-neutral-900 dark:border border-neutral-800 h-[24rem] flex flex-col ">
          {state === "select" ? (
            <SelectState
              onShowAdd={showAdd}
              onHide={hide}
              onSelect={onSelect}
              options={options}
              label={label}
            />
          ) : (
            <FormState
              form={newForm}
              label={label}
              onAdd={handleOnAdd}
              onCancel={() => setState("select")}
            />
          )}
        </div>
      </Modal>
    </>
  )
}

interface SelectProps {
  onShowAdd: VoidFunction
  onHide: VoidFunction
  options: Props["options"]
  onSelect: Props["onSelect"]
  label: Props["label"]
}

function SelectState({
  label,
  onHide,
  onSelect,
  onShowAdd,
  options,
}: SelectProps) {
  const [q, setQ] = React.useState("")

  const filteredOptions = React.useMemo(() => {
    return options.filter((option) =>
      option.label.toLowerCase().includes(q.toLowerCase())
    )
  }, [options, q])

  return (
    <>
      <header className="p-2">
        <div className="text-sm text-secondary flex gap-2 items-center mb-2 font-medium">
          <div className="i-lucide-scan-search"></div> Select {label}
        </div>
        <Input
          type="text"
          placeholder="Start typing…"
          value={q}
          onChange={(e) => setQ((e.target as HTMLInputElement).value)}
        />
      </header>

      <ul className="flex-1 px-2 overflow-y-auto">
        {filteredOptions.length === 0 && (
          <li className="text-secondary">
            {filteredOptions.length === 0 ? (
              <>
                No option with <b>{q}</b> found
              </>
            ) : (
              <>No options available. Try adding new.</>
            )}
          </li>
        )}

        {filteredOptions.map((option) => (
          <li
            className="px-2 py-1 hover:bg-zinc-200 dark:hover:bg-neutral-800 rounded-lg focus-within:bg-zinc-200 dark:focus-within:bg-neutral-800"
            key={option.value}
            onClick={() => onSelect(option.value)}
          >
            <button className="block w-full text-start dark:text-white">{option.label}</button>
          </li>
        ))}
      </ul>

      <footer className="border-t border-zinc-200 dark:border-neutral-800 flex justify-between p-2">
        <button
          className="inline-flex gap-2 items-center bg-zinc-200 dark:bg-neutral-800 px-2 rounded-md font-medium"
          onClick={onShowAdd}
        >
          <div className="i-lucide-list-plus text-secondary" /> Add new
        </button>

        <button
          className="px-2 py-1 hover:bg-zinc-200 dark:hover:bg-neutral-800 rounded-lg font-medium"
          onClick={onHide}
        >
          Cancel
        </button>
      </footer>
    </>
  )
}

interface FormStateProps {
  form: Props["newForm"]
  onAdd: Props["onAdd"]
  onCancel: VoidFunction
  label: Props["label"]
}

function FormState({ form, label, onAdd, onCancel }: FormStateProps) {
  const formMethods = useForm()
  const { handleSubmit } = formMethods
  const [status, setStatus] = React.useState<RequestState>("idle")

  async function submit(data: FieldValues) {
    setStatus("loading")
    try {
      await onAdd(data)
      setStatus("success")
    } catch (error) {
      setStatus("error")
    }
  }

  return (
    <FormProvider {...formMethods}>
      <form className="flex flex-col h-full" onSubmit={handleSubmit(submit)}>
        <header className="p-2">
          <div className="text-sm text-secondary flex gap-2 items-center font-medium dark:text-white">
            <div className="i-lucide-list-plus"></div> Add new {label}
          </div>
        </header>

        <div className="flex-1">{form}</div>

        <footer className="border-t border-zinc-200 dark:border-neutral-800 flex justify-between p-2">
          <button
            className="px-2 py-1 hover:bg-zinc-200 dark:hover:bg-neutral-800 rounded-lg font-medium"
            onClick={onCancel}
            type="button"
          >
            Cancel
          </button>

          <button className="inline-flex gap-2 items-center bg-zinc-200 dark:bg-neutral-800 px-2 rounded-md font-medium">
            <div
              className={clsx("text-secondary", {
                "i-lucide-corner-down-left": status !== "loading",
                "i-svg-spinners-dot-revolve": status === "loading",
              })}
            />{" "}
            {status === "loading" ? "Saving…" : "Save"}
          </button>
        </footer>
      </form>
    </FormProvider>
  )
}

export { LargeSelect }
