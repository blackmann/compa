import "@unocss/reset/tailwind.css";
import "./style.css";

import { User } from "@prisma/client";
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
import React from "react";
import { CommonHead } from "./components/common-head";
import { Footer } from "./components/footer";
import { BottomNav, Navbar } from "./components/navbar";
import { PendingUI } from "./components/pending-ui";
import { checkAuth } from "./lib/check-auth";
import { GlobalCtx } from "./lib/global-ctx";
import { prisma } from "./lib/prisma.server";
import { useColorScheme } from "./lib/use-color-scheme";

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
  const scheme = useColorScheme();

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

  return (
    <html lang="en">
      <head>
        <CommonHead />
        <Meta />
        <Links />
      </head>
      <body>
        <PendingUI />

        <GlobalCtx.Provider value={{ user: user as User | null | undefined }}>
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
