import { visit } from "unist-util-visit";
import type { Plugin } from 'unified'

function removeCodeTrail(): ReturnType<Plugin> {
	return (tree) => {
		// remove trailing newline from code
		visit(tree, "element", (node) => {
			if (node.tagName === "code") {
				for (const child of node.children) {
					if (child.type === "text") {
						child.value = child.value.replace(/\n$/, "");
					}
				}
			}
		});
	};
}

export { removeCodeTrail}