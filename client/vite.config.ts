import { vitePlugin as remix } from "@remix-run/dev";
import { installGlobals } from "@remix-run/node";
import UnoCSS from "unocss/vite";
import { defineConfig } from "vite";

installGlobals();

export default defineConfig({
	plugins: [remix(), UnoCSS()],
	resolve: {
		alias: {
			"~": "/app",
		},
	},
	server: { port: 3000 },
	optimizeDeps: {
		exclude: ["nock", "mock-aws-s3"],
	},
});
