function TimetableFilter() {
  return (
    <div className="flex gap-2">
      <div className="bg-zinc-200 dark:bg-neutral-800 px-2 py-1 rounded-lg font-medium w-[12rem] flex-1">
        BSc. Statistics
      </div>
      <select className="bg-zinc-200 dark:bg-neutral-800 px-2 py-1 rounded-lg font-medium">
        <option value="2023/2024">2023/2024</option>
      </select>
      <select className="bg-zinc-200 dark:bg-neutral-800 px-2 py-1 rounded-lg font-medium">
        <option value="100">L100</option>
        <option value="200">L200</option>
        <option value="300">L300</option>
        <option value="400">L400</option>
        <option value="500">L500</option>
        <option value="600">L600</option>
      </select>
      <select className="bg-zinc-200 dark:bg-neutral-800 px-2 py-1 rounded-lg font-medium">
        <option value="1">Sem 1</option>
        <option value="2">Sem 2</option>
      </select>
    </div>
  )
}

export { TimetableFilter }
