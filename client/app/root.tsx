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
	isRouteErrorResponse,
	json,
	useLoaderData,
	useRouteError,
} from "@remix-run/react";
import { Navbar } from "./components/navbar";
import { Footer } from "./components/footer";
import { PendingUI } from "./components/pending-ui";
import { checkAuth } from "./lib/check-auth";
import { prisma } from "./lib/prisma.server";
import { GlobalCtx } from "./lib/global-ctx";
import { User } from "@prisma/client";
import { Anchor } from "./components/anchor";
import posthog from "posthog-js";
import { useEffect } from "react";

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

export function ErrorBoundary() {
	const error = useRouteError();
	const statusCode = (isRouteErrorResponse(error) && error.status) || 500;
	const errorMessage =
		(isRouteErrorResponse(error) && error.data) || "An unknown error";

	useEffect(() => {
		posthog.capture("route_error", {
			statusCode,
			errorMessage,
		});
	}, [statusCode, errorMessage]);

	return (
		<html lang="en">
			<head>
				<title>
					{statusCode === 404
						? "404 Not Found"
						: `${statusCode} Internal Server Error`}
				</title>
				<Meta />
				<Links />
			</head>
			<body className="flex flex-col min-h-screen">
				<div className="flex-1">
					<div className="flex items-start justify-center space-x-4 p-3  py-38">
						<img src="/sym.svg" width={80} alt="Compa" />

						<div className="flex flex-col items-start space-y-4 ">
							<h1 className="font-bold">
								{statusCode === 404
									? "404 : Not found"
									: `${statusCode} : An unknown error occured`}
							</h1>
							<p className="text-gray-500 w-1/2">
								{statusCode === 404
									? "There is nothing on this page. Perhaps, what was on this page is long gone. Sorry!"
									: "This must be strange to you. It's strange to us too. we will look into this and resolve it as soon as possible"}
							</p>
							<Anchor href="/discussions">
								Go Home <div className="i-lucide-arrow-right  opacity-50"></div>
							</Anchor>
						</div>
					</div>
				</div>

				<Footer />

				<Scripts />
			</body>
		</html>
	);
}

export default function App() {
	const { user } = useLoaderData<typeof loader>();

	return (
		<html lang="en">
			<head>
				<meta charSet="utf-8" />
				<meta
					name="viewport"
					content="width=device-width,initial-scale=1,maximum-scale=1"
				/>
				<link rel="manifest" href="/manifest.webmanifest" />
				<link rel="icon" type="image/x-icon" href="/favicon.ico" />
				<link
					href="https://cdn.jsdelivr.net/npm/katex@0.16.9/dist/katex.min.css"
					rel="stylesheet"
				/>
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
			</body>
		</html>
	);
}
