import "@unocss/reset/tailwind.css"
import "./style.css"

import { cssBundleHref } from "@remix-run/css-bundle"
import type { LinksFunction } from "@remix-run/node"
import {
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
} from "@remix-run/react"
import { Navbar } from "./components/navbar"
import { Footer } from "./components/footer"
import posthog from "posthog-js"
import React from "react"

export const links: LinksFunction = () => [
  ...(cssBundleHref ? [{ rel: "stylesheet", href: cssBundleHref }] : []),
]

export default function App() {
  React.useEffect(() => {
    posthog.init("phc_qmxF7NTz6XUnYUDoMpkTign6mujS8F8VqR75wb0Bsl7", {
      api_host: "https://eu.posthog.com",
    })
  }, [])
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body>
        <Navbar />
        <Outlet />
        <ScrollRestoration />
        <Scripts />
        <LiveReload />

        <Footer />
      </body>
    </html>
  )
}
