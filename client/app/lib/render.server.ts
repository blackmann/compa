import { unified } from "unified";
import remarkParse from "remark-parse";
import remarkRehype from "remark-rehype";
import rehypeSanitize from "rehype-sanitize";
import rehypeStringify from "rehype-stringify";
import remarkGfm from "remark-gfm";
import rehypeShiki from "@shikijs/rehype";
import smartypants from "remark-smartypants";
import rehypeDocument from "rehype-document";
import rehypeKatex from "rehype-katex";
import remarkMath from "remark-math";
import { removeCodeTrail } from "./remove-code-trail";

const processor = unified()
	.use(remarkParse)
	.use(remarkGfm)
	.use(remarkRehype)
	.use(rehypeSanitize)
	.use(remarkMath)
	.use(rehypeDocument, {
		// Get the latest one from: <https://katex.org/docs/browser>.
		css: "https://cdn.jsdelivr.net/npm/katex@0.16.9/dist/katex.min.css",
	})
	.use(rehypeKatex)
	.use(removeCodeTrail)
	.use(rehypeShiki, {
		themes: { light: "vitesse-light", dark: "vitesse-dark" },
	})
	.use(smartypants)
	.use(rehypeStringify);

async function render(content: string) {
	return (await processor.process(content)).toString();
}

export { render };
