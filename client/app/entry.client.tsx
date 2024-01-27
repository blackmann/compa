/**
 * By default, Remix will handle hydrating your app on the client for you.
 * You are free to delete this file if you'd like to, but if you ever want it revealed again, you can run `npx remix reveal` ✨
 * For more information, see https://remix.run/file-conventions/entry.client
 */

import { RemixBrowser } from "@remix-run/react"
import { startTransition, StrictMode } from "react"
import { hydrateRoot } from "react-dom/client"
import { loadServiceWorker } from "@remix-pwa/sw"
import posthog from "posthog-js"

loadServiceWorker()
posthog.init("phc_qmxF7NTz6XUnYUDoMpkTign6mujS8F8VqR75wb0Bsl7", {
  api_host: "https://eu.posthog.com",
})

startTransition(() => {
  hydrateRoot(
    document,
    <StrictMode>
      <RemixBrowser />
    </StrictMode>
  )
})
