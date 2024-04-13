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
	json,
	useLoaderData,
	useRevalidator,
} from "@remix-run/react";
import { BottomNav, Navbar } from "./components/navbar";
import { Footer } from "./components/footer";
import { PendingUI } from "./components/pending-ui";
import { checkAuth } from "./lib/check-auth";
import { prisma } from "./lib/prisma.server";
import { GlobalCtx } from "./lib/global-ctx";
import { User } from "@prisma/client";
import { CommonHead } from "./components/common-head";
import { useColorScheme } from "./lib/use-color-scheme";
import React from "react";

export const loader = async ({ request }: LoaderFunctionArgs) => {
	let user: User | undefined | null;
	let unreadNotifications = 0;

	try {
		const userId = await checkAuth(request);
		user = await prisma.user.findFirst({ where: { id: userId } });
		unreadNotifications = await prisma.notificationSubscriber.count({
			where: { userId: userId, read: false },
		});
	} catch (error) {
		//
	}

	return json({ user, unreadNotifications });
};

export const links: LinksFunction = () => [
	...(cssBundleHref ? [{ rel: "stylesheet", href: cssBundleHref }] : []),
];

export { ErrorBoundary } from "./components/error-boundary";

export default function App() {
	const { user, unreadNotifications } = useLoaderData<typeof loader>();
	const scheme = useColorScheme();
	const revalidator = useRevalidator();

	React.useEffect(() => {
		if (scheme === "light") {
			// dynamically change meta theme-color
			document
				.querySelector('meta[name="theme-color"]')
				?.setAttribute("content", "#FAFAFA");
		} else {
			document
				.querySelector('meta[name="theme-color"]')
				?.setAttribute("content", "#171717");
		}
	}, [scheme]);

	React.useEffect(() => {
		function refresh() {
			if (document.visibilityState !== "visible") {
				return;
			}

			revalidator.revalidate();
		}

		document.addEventListener("visibilitychange", refresh);

		return () => document.removeEventListener("visibilitychange", refresh);
	}, [revalidator]);

	React.useEffect(() => {
		if (unreadNotifications > 0) {
			navigator.setAppBadge(unreadNotifications);
		} else {
			navigator.clearAppBadge();
		}
	}, [unreadNotifications]);

	return (
		<html lang="en">
			<head>
				<CommonHead />
				<Meta />
				<Links />
			</head>
			<body>
				<PendingUI />

				<GlobalCtx.Provider value={{ user, unreadNotifications }}>
					<Navbar />
					<Outlet context={{ user }} />
				</GlobalCtx.Provider>

				<ScrollRestoration />
				<Scripts />
				<LiveReload />
				<Footer />
				<BottomNav />
			</body>
		</html>
	);
}
