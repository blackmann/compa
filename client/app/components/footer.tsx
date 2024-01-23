import { SymOutline } from "./sym-outline"

function Footer() {
  return (
    <footer className="container mx-auto py-6 border-t border-zinc-300 dark:border-neutral-700 mt-6">
      <div className="grid grid-cols-4">
        <div className="col-span-1">
          <div className="mb-2">
            <SymOutline className="size-12" />
          </div>

          <div className="font-bold">COMPA</div>

          <div className="text-secondary mb-2">
            An open initiative to promote collaboration and knowledge sharing
            among students of higher education.
          </div>

          <div className="flex gap-4">
            <a
              className="inline-flex items-center rounded-lg gap-2 px-2 bg-zinc-100 dark:bg-neutral-800 font-medium"
              href="https://github.com/blackmann/compa"
            >
              <div className="i-lucide-github"></div>
              Source code
            </a>

            <div className="flex gap-2 items-center text-secondary">
              <div className="size-2 rounded-full bg-green"></div>
              All systems green
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}

export { Footer }
