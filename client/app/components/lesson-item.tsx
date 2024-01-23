function LessonItem() {
  return (
    <div className="group p-2 rounded-lg hover:bg-zinc-100 dark:hover:bg-neutral-800 transition-[background] duration-200">
      <header className="font-mono text-sm text-secondary">
        Math 173: 10.30-12.25
      </header>
      <div className="font-medium">Logic and Set Theorem</div>
      <footer className="text-sm text-secondary flex justify-between">
        <span>P. A. Kwabi</span> <span>SF11</span>

        <button className="rounded-md !text-xs px-2 bg-zinc-200 dark:bg-neutral-900 font-medium group-hover:opacity-100 opacity-0">
          Edit
        </button>
      </footer>
    </div>
  )
}

export { LessonItem }
