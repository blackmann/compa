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
} from "@remix-run/react";
import { BottomNav, Navbar } from "./components/navbar";
import { Footer } from "./components/footer";
import { PendingUI } from "./components/pending-ui";
import { checkAuth } from "./lib/check-auth";
import { prisma } from "./lib/prisma.server";
import { GlobalCtx } from "./lib/global-ctx";
import { User } from "@prisma/client";
import { CommonHead } from "./components/common-head";

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
				<LiveReload />
				<Footer />
				<BottomNav />
			</body>
		</html>
	);
}
