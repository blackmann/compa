function isImage(contentType: string, basic = false) {
	return (
		["image/png", "image/jpeg", "image/jpg"].includes(contentType) ||
		(!basic && ["image/webp", "image/gif"].includes(contentType))
	);
}

export { isImage };
