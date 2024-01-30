import clsx from "clsx"
import React from "react"
import ReactDOM from "react-dom"

interface Props extends React.PropsWithChildren {
  className?: string
  open?: boolean
  onClose?: VoidFunction
}

function Modal({ children, className, onClose, open }: Props) {
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

  if (!mounted) {
    return null
  }

  return ReactDOM.createPortal(
    <dialog
      className={clsx(
        "rounded-lg border border-zinc-300 dark:border-neutral-700 shadow dark:text-white",
        className
      )}
      ref={ref}
    >
      {children}
    </dialog>,
    document.body
  )
}

export { Modal }
