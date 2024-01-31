import { json } from "@remix-run/node";
import { values } from "~/lib/values.server";

export const loader = async () => {
	const shortName = values.get("shortName");
	const appName = `${shortName} | compa`;

	return json(
		{
			short_name: appName,
			name: appName,
			start_url: "/",
			display: "standalone",
			background_color: "#ffffff",
			display_override: ["fullscreen"],
			shortcuts: [
				{
					name: appName,
					url: "/",
					icons: [
						{
							src: "/icons/android-icon-96x96.png",
							sizes: "96x96",
							type: "image/png",
							purpose: "any monochrome",
						},
					],
				},
			],
			icons: [
				{
					src: "/icons/android-icon-36x36.png",
					sizes: "36x36",
					type: "image/png",
					density: "0.75",
				},
				{
					src: "/icons/android-icon-48x48.png",
					sizes: "48x48",
					type: "image/png",
					density: "1.0",
				},
				{
					src: "/icons/android-icon-72x72.png",
					sizes: "72x72",
					type: "image/png",
					density: "1.5",
				},
				{
					src: "/icons/android-icon-96x96.png",
					sizes: "96x96",
					type: "image/png",
					density: "2.0",
				},
				{
					src: "/icons/android-chrome-256x256.png",
					sizes: "256x256",
					type: "image/png",
				},
				{
					src: "/icons/android-chrome-512x512.png",
					sizes: "512x512",
					type: "image/png",
				},
			],
		},
		{
			headers: {
				"Cache-Control": "public, max-age=600",
				"Content-Type": "application/manifest+json",
			},
		},
	);
};
