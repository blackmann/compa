import { unified, type Plugin } from "unified";
import remarkParse from "remark-parse";
import remarkRehype from "remark-rehype";
import rehypeSanitize from "rehype-sanitize";
import rehypeStringify from "rehype-stringify";
import remarkGfm from "remark-gfm";
import rehypeShiki from "@shikijs/rehype";
import smartypants from "remark-smartypants";
import { visit } from "unist-util-visit";
import rehypeKatex from "rehype-katex";
import remarkMath from "remark-math";
import { removeCodeTrail } from "./remove-code-trail";

// TODO: Implement image re-embed (we shouldn't show full images from markdown)

const processor = unified()
	.use(remarkParse)
	.use(remarkGfm)
	.use(remarkRehype)
	.use(rehypeSanitize)
	.use(reduce)
	.use(removeLinks)
	.use(remarkMath)
	.use(rehypeKatex)
	.use(removeCodeTrail)
	.use(rehypeShiki, {
		themes: { light: "vitesse-light", dark: "vitesse-dark" },
	})
	.use(smartypants)
	.use(rehypeStringify);

async function renderSummary(content: string) {
	return (await processor.process(content)).toString();
}

function removeLinks(): ReturnType<Plugin> {
	return (tree) => {
		visit(tree, "element", (child, index, parent) => {
			if (child.tagName === "a") {
				child.tagName = "span";
				child.properties.className = "underline hyphens-auto";
			}
		});
	};
}

function reduce(): ReturnType<Plugin> {
	return (tree) => {
		// Some improvements include:
		// Shortening code blocks
		// Using paragraph length
		// Render h tags as div
		const count = tree.children.length;
		tree.children.splice(5);

		if (count > 5) {
			tree.children.push({
				type: "element",
				tagName: "div",
				properties: { className: "content-more" },
				children: [],
			});
		}

		visit(tree, "element", (child) => {
			const tagName = child.tagName;
			if (
				child.type === "element" &&
				["h1", "h2", "h3", "h4", "h5", "h6"].includes(tagName)
			) {
				child.tagName = "div";

				child.properties = {
					...child.properties,
					className: "reduce-heading",
				};

				child.children = [
					{
						type: "element",
						tagName: "div",
						properties: { className: "tag" },
						children: [{ type: "text", value: tagName }],
					},
					{
						type: "element",
						tagName: "div",
						properties: {},
						children: child.children,
					},
				];
			}
		});
	};
}

export { renderSummary };
