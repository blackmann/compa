import "@unocss/reset/tailwind.css";
import "./style.css";

import { cssBundleHref } from "@remix-run/css-bundle";
import type { LinksFunction, LoaderFunctionArgs } from "@remix-run/node";
import {
	Links,
	LiveReload,
	Meta,
	Outlet,
	Scripts,
	ScrollRestoration,
	UIMatch,
	json,
	useLoaderData,
	useLocation,
	useMatches,
} from "@remix-run/react";
import { BottomNav, Navbar } from "./components/navbar";
import { Footer } from "./components/footer";
import { PendingUI } from "./components/pending-ui";
import { checkAuth } from "./lib/check-auth";
import { prisma } from "./lib/prisma.server";
import { GlobalCtx } from "./lib/global-ctx";
import { User } from "@prisma/client";
import { CommonHead } from "./components/common-head";
import { useRef } from "react";
import React from "react";

export const loader = async ({ request }: LoaderFunctionArgs) => {
	let user: User | undefined | null;
	try {
		const userId = await checkAuth(request);
		user = await prisma.user.findFirst({ where: { id: userId } });
	} catch (error) {
		//
	}

	return json({ user });
};

export const links: LinksFunction = () => [
	...(cssBundleHref ? [{ rel: "stylesheet", href: cssBundleHref }] : []),
];

export { ErrorBoundary } from "./components/error-boundary";

export default function App() {
	const { user } = useLoaderData<typeof loader>();

	const location = useLocation();
	const isMount = useRef(true);
	const matches = useMatches();

	function isPromise(p: any): boolean {
		if (p && typeof p === "object" && typeof p.then === "function") {
			return true;
		}
		return false;
	}

	function isFunction(p: any): boolean {
		if (typeof p === "function") {
			return true;
		}
		return false;
	}

	React.useEffect(() => {
		const mounted = isMount;
		isMount.current = false;

		if ("serviceWorker" in navigator) {
			if (navigator.serviceWorker.controller) {
				navigator.serviceWorker.controller?.postMessage({
					action: "clearCache",
				});
				navigator.serviceWorker.controller?.postMessage({
					type: "REMIX_NAVIGATION",
					isMount: mounted,
					location,
					manifest: window.__remixManifest,
					matches: matches.filter(filteredMatches).map(sanitizeHandleObject),
				});
			} else {
				const listener = async () => {
					await navigator.serviceWorker.ready;
					navigator.serviceWorker.controller?.postMessage({
						action: "clearCache",
					});
					navigator.serviceWorker.controller?.postMessage({
						type: "REMIX_NAVIGATION",
						isMount: mounted,
						location,
						manifest: window.__remixManifest,
						matches: matches.filter(filteredMatches).map(sanitizeHandleObject),
					});
				};
				navigator.serviceWorker.addEventListener("controllerchange", listener);
				return () => {
					navigator.serviceWorker.removeEventListener(
						"controllerchange",
						listener,
					);
				};
			}
		}

		function filteredMatches(route: UIMatch) {
			if (route.data) {
				return (
					Object.values(route.data).filter((elem) => {
						return isPromise(elem);
					}).length === 0
				);
			}
			return true;
		}

		function sanitizeHandleObject(route: UIMatch) {
			let handle = route.handle;

			if (handle) {
				const filterInvalidTypes = ([, value]: any) =>
					!isPromise(value) && !isFunction(value);
				handle = Object.fromEntries(
					Object.entries(route.handle!).filter(filterInvalidTypes),
				);
			}
			return { ...route, handle };
		}
	}, [location, matches]);

	return (
		<html lang="en">
			<head>
				<CommonHead />
				<Meta />
				<Links />
			</head>
			<body>
				<PendingUI />

				<GlobalCtx.Provider value={{ user }}>
					<Navbar />
					<Outlet context={{ user }} />
				</GlobalCtx.Provider>

				<ScrollRestoration />
				<Scripts />
				<LiveReload timeoutMs={1000} />
				<Footer />
				<BottomNav />
			</body>
		</html>
	);
}
