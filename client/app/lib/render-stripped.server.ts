import strip from "strip-markdown";
import { remark } from 'remark'

const processor = remark().use(strip);

async function renderStripped(content: string, maxLength?: number) {
	const stripped = (await processor.process(content)).toString().replaceAll('\n', ' ');

	if (maxLength) {
		const truncated = stripped.substring(0, maxLength);
		return stripped.length > maxLength ? `${truncated}…` : truncated;
	}

	return stripped;
}

export { renderStripped };
