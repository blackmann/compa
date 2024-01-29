import { createCookie } from "@remix-run/node"

export const userPrefs = createCookie("user-prefs", {
  maxAge: 60 * 60 * 24 * 30,
})
