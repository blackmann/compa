function renderContent(content: string, limit?: number) {
	if (limit) {
		const paragraphs = content
			.substring(0, 512)
			.split("\n")
			.filter((p) => Boolean(p.trim()))
			.map((p) => `<p>${p}</p>`);

		if (paragraphs.length <= limit) {
			return paragraphs;
		}

		return [...paragraphs.slice(0, limit), "<p>...</p>"];
	}

	const paragraphs = content
		.split("\n")
		.filter((p) => Boolean(p.trim()))
		.map((p) => `<p>${p}</p>`);

	return paragraphs;
}

export default renderContent;
