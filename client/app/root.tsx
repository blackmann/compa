import "@unocss/reset/tailwind.css";
import "./style.css";

import { cssBundleHref } from "@remix-run/css-bundle";
import type { LinksFunction } from "@remix-run/node";
import {
	Links,
	LiveReload,
	Meta,
	Outlet,
	Scripts,
	ScrollRestoration,
} from "@remix-run/react";
import { Navbar } from "./components/navbar";
import { Footer } from "./components/footer";
import { PendingUI } from "./components/pending-ui";

export const links: LinksFunction = () => [
	...(cssBundleHref ? [{ rel: "stylesheet", href: cssBundleHref }] : []),
];

export default function App() {
	return (
		<html lang="en">
			<head>
				<meta charSet="utf-8" />
				<meta
					name="viewport"
					content="width=device-width,initial-scale=1,maximum-scale=1"
				/>
				<link rel="manifest" href="/manifest.webmanifest" />
				<Meta />
				<Links />
			</head>
			<body>
				<PendingUI />

				<Navbar />
				<Outlet />
				<ScrollRestoration />
				<Scripts />
				<LiveReload />

				<Footer />
			</body>
		</html>
	);
}
