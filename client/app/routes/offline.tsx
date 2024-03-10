import React from 'react'

export default function Offline() {
  const getBrowsingHistory = async () => {
    const browsingHistory: Array<unknown> = []
    const parser = new DOMParser()

    const cache = await caches.open(
      await caches.keys().then((res) => {
        return res.filter((word) => word.includes('pages'))[0]
      })
    )

    const keys = await cache.keys()

    console.log(keys)

    for (const request of keys) {
      const data: Record<string, unknown> = {}
      data.url = request.url
      browsingHistory.push(data)
    }

    if (browsingHistory?.length) {
      const markup = document.getElementById('browsing-history')
      if (!markup) return
      markup.innerHTML =
        '<p class="mb-1">In the meantime, you still have things you can access: </p>'
      browsingHistory.forEach((data) => {
        if (!data) return
        markup.innerHTML += `
				<ul class="list-disc pl-4">
					<li>
						<a class="block text-blue-600" href="${data.url}">${data.url}</a>
					</li>
				</ul>
				`
      })
      document
        .getElementById('browsing-history')
        ?.insertAdjacentElement('beforeend', markup)
    }
  }

  React.useEffect(() => {
    getBrowsingHistory()
  })

  return (
    <div className='container mx-auto min-h-[70vh] pt-8'>
      <h1 className='font-bold text-3xl mb-8'>
        Oops, you are currently offline
      </h1>
      <h2 className='font-medium text-xl mb-4'>
        Please check your internet connection and try again
      </h2>

      <div id='browsing-history' />
    </div>
  )
}
