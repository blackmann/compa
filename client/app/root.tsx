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
	useLocation,
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
import { SymOutline } from "./components/sym-outline";

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
	const location = useLocation();
	const statusCode = isRouteErrorResponse(error) ? error.status : 600;

	useEffect(() => {
		if (statusCode === 404) return;

		if (isRouteErrorResponse(error)) {
			posthog.capture("route-error-response", {
				data: error.data,
				statusCode,
				page: location.pathname,
			});
		} else {
			posthog.capture("application-error", {
				stack: (error as Error).stack,
				page: location.pathname,
			});
		}
	}, [error, statusCode, location]);

	const stackTrace = (error as Error).stack;

	return (
		<html lang="en">
			<head>
				<title>
					{statusCode === 404
						? "404 Not Found"
						: `${statusCode} An unexpected Error`}
				</title>
				<Meta />
				<Links />
			</head>
			<body>
				<Navbar />

				<div className="min-h-[60vh] mt-8">
					<div className="flex mx-auto gap-4 max-w-[28rem] px-4">
						<div>
							<SymOutline className="size-12" />
						</div>

						<div>
							<h1 className="font-bold">
								{statusCode === 404
									? "404: Not found"
									: `${statusCode}: An unexpected error occured`}
							</h1>

							<p className="text-gray-500">
								{statusCode === 404
									? "There is nothing on this page. Perhaps, what was on this page is long gone. Sorry!"
									: "This must be strange to you. It's strange to us too. we will look into this and resolve it as soon as possible."}
							</p>

							<div className="mt-2">
								<Anchor href="/discussions">
									Go Home <div className="i-lucide-arrow-right opacity-50" />
								</Anchor>
							</div>
						</div>
					</div>

					{process.env.NODE_ENV === "development" && stackTrace && (
						<div className="p-4 border-t mt-8">
							<header className="flex font-mono bg-red-600 text-white items-center inline-flex rounded-lg px-2 text-sm gap-2">
								<div className="i-lucide-eye opacity-70" /> Dev only
							</header>
							<pre className="text-sm text-gray-500 mt-4">{stackTrace}</pre>
						</div>
					)}
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
