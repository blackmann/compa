import "@unocss/reset/tailwind.css";

import "virtual:uno.css";
import "./style.css";

import type { User } from "@prisma/client";
import { cssBundleHref } from "@remix-run/css-bundle";
import type { LinksFunction, LoaderFunctionArgs } from "@remix-run/node";
import {
	Links,
	Meta,
	Outlet,
	Scripts,
	ScrollRestoration,
	json,
	useLoaderData,
	useLocation,
	useRevalidator,
} from "@remix-run/react";
import clsx from "clsx";
import React from "react";
import { CommonHead } from "./components/common-head";
import { Footer } from "./components/footer";
import { BottomNav, Navbar, SideNav } from "./components/navbar";
import { PendingUI } from "./components/pending-ui";
import { checkAuth } from "./lib/check-auth";
import { prisma } from "./lib/prisma.server";
import { useColorScheme } from "./lib/use-color-scheme";

const authRoutes = [
	"/login",
	"/create-account",
	"/forgot-password",
	"/reset-password",
	"/account-created",
	"/resend-verification",
];

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
	const location = useLocation();

	const hideNav = authRoutes.includes(location.pathname);

	React.useEffect(() => {
		if (scheme === "light") {
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
		try {
			if (unreadNotifications > 0) {
				navigator.setAppBadge(unreadNotifications);
			} else {
				navigator.clearAppBadge();
			}
		} catch {
			// doesn't support badging
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

				<Navbar />
				<div className="container mx-auto !max-md:px-0">
					<div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
						<div
							className={clsx("col-span-1 max-lg:hidden", {
								hidden: hideNav,
							})}
						>
							<div className="max-w-[15rem] sticky top-[4rem] h-[calc(95vh-4rem)]">
								<SideNav />
							</div>
						</div>

						<div
							className={clsx("col-span-1 lg:col-span-4 mt-2", {
								"lg:col-span-5": hideNav,
							})}
						>
							<Outlet />
						</div>
					</div>
				</div>

				<ScrollRestoration />
				<Scripts />
				<Footer />
				<BottomNav />
			</body>
		</html>
	);
}
