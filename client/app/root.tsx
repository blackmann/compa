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
import { Navbar } from "./components/navbar";
import { Footer } from "./components/footer";
import { PendingUI } from "./components/pending-ui";
import { checkAuth } from "./lib/check-auth";
import { prisma } from "./lib/prisma.server";
import { GlobalCtx } from "./lib/global-ctx";
import { User } from "@prisma/client";

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
	return (
		<html lang="en">
			<head>
				<title>Oh no!</title>
				<Meta />
				<Links />
			</head>
			<body>
				<div className="flex items-center max-w-4xl  mx-auto h-screen justify-center">
					<div className="flex flex-col items-center space-y-3">
						<img src="/sym.svg" width={240} className="block" alt="Compa" />
						<h1 className="font-bold text-3xl">Sorry, Unexpected Error</h1>
						<p className="text-gray-500 max-w-2xl text-center">
							We are facing an internal server error. Our experts are trying to
							fix the problem. Please try again or wait for sometime
						</p>
						<a
							href="/discussions"
							className="bg-gray-800 px-3 py-4 rounded-md tracking-wide font-bold text-gray-500"
						>
							{" "}
							TAKE ME HOME
						</a>
					</div>
				</div>
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
