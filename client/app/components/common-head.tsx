function CommonHead() {
	return (
		<>
			<meta charSet="utf-8" />
			<meta
				name="viewport"
				content="width=device-width,initial-scale=1,maximum-scale=1"
			/>
			<link rel="manifest" href="/manifest.webmanifest" />
			<link rel="apple-touch-icon" href="/icons/apple-touch-icon.png" />
			<link rel="icon" type="image/png" href="/favicon.png" />
			<link
				href="https://cdn.jsdelivr.net/npm/katex@0.16.9/dist/katex.min.css"
				rel="stylesheet"
			/>
		</>
	);
}

export { CommonHead }
