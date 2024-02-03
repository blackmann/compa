import { createCookie } from "@remix-run/node";

const MAX_COOKIE_AGE = 60 * 60 * 24 * 30; // 30 days

export const userPrefs = createCookie("user-prefs", {
	maxAge: MAX_COOKIE_AGE,
});

export const authCookie = createCookie("auth", {
	secrets: process.env.COOKIE_SECRET?.split(",") ?? [],
	maxAge: MAX_COOKIE_AGE,
	secure: true,
});
