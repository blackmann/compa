import React from "react"
import ReactDOM from "react-dom"

interface Props extends React.PropsWithChildren {
  open?: boolean
  onClose?: VoidFunction
}

function Modal({ children, onClose, open }: Props) {
  const ref = React.useRef<HTMLDialogElement>(null)
  const [mounted, setMounted] = React.useState(false)

  React.useEffect(() => {
    if (open) {
      ref.current?.showModal()
    } else {
      ref.current?.close()
    }

    ref.current?.addEventListener("close", () => {
      onClose?.()
    })
  }, [open, onClose])

  React.useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) { return null }

  return ReactDOM.createPortal(
    <dialog
      className="rounded-lg border border-zinc-300 dark:border-neutral-700 shadow"
      ref={ref}
    >
      {children}
    </dialog>,
    document.body
  )
}

export { Modal }
