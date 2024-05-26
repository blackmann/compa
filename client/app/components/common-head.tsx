const dev = process.env.NODE_ENV !== "production";

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
			{!dev && (
				<script
					src="https://0.observe.so/script.js"
					data-app="clwnp4jnp0000ze4wmdyiawle"
				/>
			)}
		</>
	);
}

export { CommonHead };
