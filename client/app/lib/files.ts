function ellipsizeFilename(name: string, length = 14) {
	const parts = name.split(".");
	if (parts.length === 1) {
		return `${name.slice(0, length)}…`;
	}
	const [filename, ...extension] = parts;
	return `${filename.slice(0, length)}…${extension[extension.length - 1]}`;
}

function humanizeSize(s: number) {
	const units = ["B", "KB", "MB", "GB"];
	let i = 0;
	let size = s;
	while (size >= 1024 && i < units.length) {
		size /= 1024;
		i++;
	}
	return `${size.toFixed(1)}${units[i]}`;
}

export { ellipsizeFilename, humanizeSize };
