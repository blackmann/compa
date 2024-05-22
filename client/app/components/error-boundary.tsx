import {
	Links,
	Meta,
	Scripts,
	isRouteErrorResponse,
	useLocation,
	useRouteError,
} from "@remix-run/react";
import posthog from "posthog-js";
import React from "react";
import { Anchor } from "./anchor";
import { CommonHead } from "./common-head";
import { Footer } from "./footer";
import { Navbar } from "./navbar";
import { SymOutline } from "./sym-outline";

function ErrorBoundary() {
	const error = useRouteError();
	const location = useLocation();
	const statusCode = isRouteErrorResponse(error) ? error.status : 600;

	React.useEffect(() => {
		if (statusCode === 404) return;

		if (isRouteErrorResponse(error)) {
			posthog.capture("route-error-response", {
				data: error.data,
				statusCode,
				page: location.pathname,
			});
		} else {
			posthog.capture("application-error", {
				stack: (error as Error).stack || (error as Error).message,
				page: location.pathname,
			});
		}
	}, [error, statusCode, location]);

	const stackTrace = (error as Error).stack;

	return (
		<html lang="en">
			<head>
				<CommonHead />
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
								<Anchor to="/discussions">
									Go Home <div className="i-lucide-arrow-right opacity-50" />
								</Anchor>
							</div>
						</div>
					</div>

					{process.env.NODE_ENV === "development" && stackTrace && (
						<div className="p-4 border-t dark:border-neutral-800 mt-8 overflow-y-auto">
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

export { ErrorBoundary };
