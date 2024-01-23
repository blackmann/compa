function Footer() {
  return (
    <footer className="container mx-auto py-6 border-t border-zinc-300 dark:border-neutral-700 mt-6">
      <div className="grid grid-cols-4">
        <div className="col-span-1">
          <div className="text-secondary">
            An open initiative to promote collaboration and knowledge sharing
            among students of higher education.
          </div>

          <div>
            <a
              className="inline-flex items-center rounded-lg gap-2 px-2 bg-zinc-100 dark:bg-neutral-800 font-medium"
              href="https://github.com/blackmann/compa"
            >
              <div className="i-lucide-github"></div>
              Source code
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}

export { Footer }
