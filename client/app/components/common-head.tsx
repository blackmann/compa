const dev = process.env.NODE_ENV !== "production";
const observeAppId = import.meta.env.VITE_OBSERVE_APP_ID;

function CommonHead() {
	return (
		<>
			<meta charSet="utf-8" />
			<meta
				name="viewport"
				content="width=device-width,initial-scale=1,maximum-scale=1,viewport-fit=cover"
			/>
			<meta name="theme-color" content="#FAFAFA" />
			<link rel="manifest" href="/manifest.webmanifest" />
			<link rel="apple-touch-icon" href="/icons/apple-touch-icon.png" />
			<link rel="icon" type="image/png" href="/favicon.png" />
			<link
				href="https://cdn.jsdelivr.net/npm/katex@0.16.9/dist/katex.min.css"
				rel="stylesheet"
			/>
			{!dev && observeAppId && (
				<script src="https://0.observe.so/script.js" data-app={observeAppId} />
			)}
		</>
	);
}

export { CommonHead };
