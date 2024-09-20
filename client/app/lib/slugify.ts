function slugify(
	text: string,
	/** Add random characters at the end of the generated slug */
	mangle = false,
) {
	let slug = text
		.toString()
		.toLowerCase()
		.trim()
		.replace(/\s+/g, "-")
		.replace(/&/g, "-and-")
		.replace(/[^\w-]+/g, "")
		.replace(/--+/g, "-");

	if (mangle) {
		slug += `-${Math.random().toString(36).substring(2, 7)}`;
	}

	return slug;
}

export { slugify };
