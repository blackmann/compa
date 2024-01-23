function CrowdsourceNotice() {
  return (
    <div className="p-2 rounded-lg border bg-white dark:bg-neutral-800 dark:border-neutral-700">
      <header className="font-bold flex gap-2 items-center mb-2">
        <div className="i-lucide-badge-check text-green-500"></div>
        <span>Crowdsourcing</span>
      </header>
      <p>
        This is a crowdsourced effort to curate this data. Please make sure
        these details are correct before submitting them.
      </p>

      <p className="text-secondary mt-2">
        In case of any error, please create an issue here.
      </p>

      <footer className="mt-2">
        <a className="inline-flex gap-2 items-center" href="/crowdsourcing">
          Read more <div className="i-lucide-arrow-up-right-square" />
        </a>
      </footer>
    </div>
  )
}

export { CrowdsourceNotice }
