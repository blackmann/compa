function CommonHead() {
	return (
		<>
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
		</>
	);
}

export { CommonHead }
