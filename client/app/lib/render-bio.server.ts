import rehypeSanitize from "rehype-sanitize";
import rehypeStringify from "rehype-stringify";
import remarkGfm from "remark-gfm";
import remarkParse from "remark-parse";
import remarkRehype from "remark-rehype";
import { unified, type Plugin } from "unified";
import { visit } from "unist-util-visit";

const processor = unified()
	.use(remarkParse)
	.use(remarkGfm)
	.use(remarkRehype)
	.use(exclude, { elements: ["table", "img"] })
	.use(rehypeSanitize)
	.use(rehypeStringify);

async function renderBio(bio: string) {
	return (await processor.process(bio)).toString();
}

function exclude({ elements }: { elements: string[] }): ReturnType<Plugin> {
	return (tree) => {
		visit(tree, "element", (child, index, parent) => {
			if (elements.includes(child.tagName)) {
				parent.children.splice(index, 1);
			}
		});
	};
}

export { renderBio };
