import React from "react"

interface Props extends React.PropsWithChildren {
  show?: boolean
  onClose?: VoidFunction
}

function Modal({ children, onClose, show }: Props) {
  const ref = React.useRef<HTMLDialogElement>(null)

  React.useEffect(() => {
    if (show) {
      ref.current?.showModal()
    } else {
      ref.current?.close()
    }

    ref.current?.addEventListener("close", () => {
      onClose?.()
    })
  }, [show, onClose])

  return <dialog className="rounded-lg border border-zinc-300 dark:border-neutral-700 shadow" ref={ref}>{children}</dialog>
}

export { Modal }
