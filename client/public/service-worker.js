const cacheHeader = 'compa:v1.0.0:'

const offlineFundamentals = ['/offline']

//Add core website files to cache during serviceworker installation
const updateStaticCache = async () => {
  const cache = await caches.open(`${cacheHeader}fundamentals`)
  return await Promise.all(
    offlineFundamentals.map((value) => {
      let request = new Request(value)
      const url = new URL(request.url)
      if (url.origin !== location.origin) {
        request = new Request(value)
      }
      return fetch(request)
        .then((response) => {
          const cachedCopy = response.clone()
          return cache.put(request, cachedCopy)
        })
        .catch(() => {
          return caches.match(new Request('/offline')).then((response_1) => {
            if (response_1) {
              self.clients.matchAll().then((clients) => {
                for (const client of clients) {
                  client.navigate('/offline')
                }
              })
            }
            return response_1
          })
        })
    })
  )
}

//Clear caches with a different version number
const clearOldCaches = async () => {
  const keys = await caches.keys()
  return await Promise.all(
    keys
      .filter((key) => {
        return key.indexOf(cacheHeader) !== 0
      })
      .map((key_1) => {
        return caches.delete(key_1)
      })
  )
}

//When the service worker is first added to a computer
self.addEventListener('install', (event) => {
  event.waitUntil(
    updateStaticCache().then(() => {
      return self.skipWaiting()
    })
  )
})

//Service worker handles networking
self.addEventListener('fetch', (event) => {
  //This service worker won't touch non-get requests
  if (event.request.method !== 'GET') {
    return
  }

  //Fetch from network and cache
  const fetchFromNetwork = async (response) => {
    const cacheCopy = response.clone()
    if (event.request.headers.get('Accept').indexOf('image') !== -1) {
      await caches.open(`${cacheHeader}images`).then(async (cache) => {
        await cache.put(event.request, cacheCopy)
      })
    } else {
      await caches.open(`${cacheHeader}assets`).then(async function add(cache) {
        await cache.put(event.request, cacheCopy)
      })
    }

    return response
  }

  //For non-HTML requests, look for file in cache, then network if no cache exists.
  event.respondWith(
    caches.match(event.request).then((cached) => {
      return (
        cached ||
        fetch(event.request)
          .then((response) => {
            return fetchFromNetwork(response)
          })
          .catch(async () => {
            return await caches
              .match(new Request('/offline'))
              .then((response) => {
                if (response) {
                  self.clients.matchAll().then((clients) => {
                    for (const client of clients) {
                      client.navigate('/offline')
                    }
                  })
                }
                return response
              })
          })
      )
    })
  )
})

//After the install event
self.addEventListener('activate', (event) => {
  event.waitUntil(self.clients.claim())
})

self.addEventListener('message', async (event) => {
  if (event.data.action === 'clearCache') {
    clearOldCaches()
  }

  if (event.data.type === 'REMIX_NAVIGATION') {
    const cachePromises = new Map();
    const { location, isMount, manifest, matches } = event.data
    const existingUrl = await caches.match(location.pathname)
    const documentUrl = location.pathname + location.search + location.hash;
    console.log('mounted', isMount)

    if (!existingUrl || !isMount) {
      console.log('i am in here', documentUrl)
      const response = await fetch(documentUrl).catch(async () => {
        return (
          (await caches.match(location.pathname)) ||
          (await caches
            .match(new Request('/offline'), {})
            .then((response) => {
              if (response) {
                self.clients.matchAll().then((clients) => {
                  for (const client of clients) {
                    client.navigate('/offline')
                  }
                })
              }
              return response
            }))
        )
      });

        cachePromises.set(
          documentUrl,
          await caches.open(`${cacheHeader}pages`).then(async (cache) => {
            await cache.put(documentUrl, response)
          }).catch(error => {
            console.error(`Failed to cache document for ${documentUrl}:`, error)
          })
        );
    }

    if (isMount) {
      for (const match of matches) {
        if (manifest.routes[match.id].hasLoader) {
          const params = new URLSearchParams(location.search);
          params.set('_data', match.id);

          let search = params.toString();
          search = search ? `?${search}` : '';

          const url = location.pathname + search + location.hash;

          if (!cachePromises.has(url)) {
            console.log('Caching data for:', url);

            const response = await fetch(url);

            cachePromises.set(
              url,
              await caches.open(`${cacheHeader}assets`).then(async (cache) => {
                await cache.put(url, response)
              }).catch((error) => {
                console.error(`Failed to cache data for ${url}:`, error)
              })
            );
          }
        }
      }
    }

    await Promise.all(cachePromises.values());
  }
})
